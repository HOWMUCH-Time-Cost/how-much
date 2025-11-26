// Main entry point for content script - uses modular site handlers

import {
  DEFAULT_WHITELIST,
  US_MONTHLY_MINIMUM_WAGE,
  isWhitelisted,
  getDomainFromUrl,
  normalizeDomain,
  isInsideProcessedElement,
  setTooltipUserData
} from './base.js';
import { getSiteHandler, getSiteName } from './registry.js';
import * as genericHandler from './sites/generic.js';

// Global state
let userSalary = US_MONTHLY_MINIMUM_WAGE;
let userCurrency = 'USD';
let whitelist = [];
let spacingMode = 'default'; // 'default', 'comfortable', 'compact'
let siteHandler = null;

// Track processed text nodes (shared across handlers)
const processedTextNodes = new WeakSet();

// Main entry point
chrome.storage.local.get(['userSalary', 'userCurrency', 'whitelist', 'spacingMode'], (data) => {
  if (data.userSalary && data.userCurrency) {
    userSalary = parseFloat(data.userSalary);
    userCurrency = data.userCurrency;
  } else {
    // Set defaults if no saved settings
    userSalary = US_MONTHLY_MINIMUM_WAGE;
    userCurrency = 'USD';
  }
  
  // Set tooltip user data
  setTooltipUserData(userSalary, userCurrency);
  
  // Load spacing mode
  if (data.spacingMode && ['default', 'comfortable', 'compact'].includes(data.spacingMode)) {
    spacingMode = data.spacingMode;
  }
  
  // Load whitelist (normalize all domains by removing www. and converting to lowercase)
  if (data.whitelist && Array.isArray(data.whitelist) && data.whitelist.length > 0) {
    // Merge stored whitelist with default to ensure all default domains are included
    const normalizedStored = data.whitelist.map(domain => normalizeDomain(domain));
    const normalizedDefault = DEFAULT_WHITELIST.map(domain => normalizeDomain(domain));
    // Combine and deduplicate
    whitelist = [...new Set([...normalizedDefault, ...normalizedStored])];
    // Update storage with merged whitelist (preserving user-added domains)
    chrome.storage.local.set({ whitelist: [...new Set([...DEFAULT_WHITELIST, ...data.whitelist])] });
  } else {
    // Use default whitelist if none is saved
    whitelist = DEFAULT_WHITELIST.map(domain => normalizeDomain(domain));
    // Save defaults to storage
    chrome.storage.local.set({ whitelist: DEFAULT_WHITELIST });
  }
  
  // Check if current domain is whitelisted before initializing
  const currentDomain = getDomainFromUrl(window.location.href);
  
  if (isWhitelisted(currentDomain, whitelist)) {
    init();
  } else {
    // Domain is not whitelisted, do nothing
    console.log('TimeCost: Domain not whitelisted, skipping processing:', currentDomain);
  }
});

function init() {
  // Get the site handler for the current site
  const currentUrl = window.location.href;
  siteHandler = getSiteHandler(currentUrl);
  const siteName = getSiteName(currentUrl);
  console.log(`TimeCost: Using handler for site: ${siteName}`);
  
  // Run immediately
  scanAndConvert(document.body);

  // Debounce function to prevent excessive scanning
  let debounceTimer = null;
  const debounceDelay = 100; // Wait 100ms after last mutation before scanning
  
  // Run whenever the page content changes (for dynamic sites like Amazon/infinite scroll)
  const observer = new MutationObserver((mutations) => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Collect all added nodes to process them together
    const nodesToProcess = [];
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
          // Skip if inside our created elements
          if (!isInsideProcessedElement(node)) {
            nodesToProcess.push(node);
          }
        }
      });
    });
    
    // Debounce the scanning to batch multiple mutations
    debounceTimer = setTimeout(() => {
      nodesToProcess.forEach((node) => {
        scanAndConvert(node);
      });
      debounceTimer = null;
    }, debounceDelay);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Listen for storage changes to update spacing mode and user data dynamically
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.userSalary || changes.userCurrency) {
        const newSalary = changes.userSalary ? parseFloat(changes.userSalary.newValue) : userSalary;
        const newCurrency = changes.userCurrency ? changes.userCurrency.newValue : userCurrency;
        userSalary = newSalary;
        userCurrency = newCurrency;
        setTooltipUserData(userSalary, userCurrency);
      }
      if (changes.spacingMode) {
        spacingMode = changes.spacingMode.newValue || 'default';
      // Re-process the entire page with new spacing mode
      // Use requestAnimationFrame to batch DOM operations
      requestAnimationFrame(() => {
        // Remove timecost elements we created (batch queries)
        const triggers = document.querySelectorAll('[data-timecost-trigger]');
        const spans = document.querySelectorAll('span[style*="background-color: #dafaa2"]');
        
        // Process in smaller batches to avoid blocking
        const processBatch = (elements, startIndex, batchSize = 50) => {
          const endIndex = Math.min(startIndex + batchSize, elements.length);
          for (let i = startIndex; i < endIndex; i++) {
            const el = elements[i];
            const parent = el.parentNode;
            if (parent) {
              if (el.hasAttribute('data-timecost-trigger')) {
                const originalPrice = el.getAttribute('data-original-price') || el.textContent;
                const textNode = document.createTextNode(originalPrice);
                parent.replaceChild(textNode, el);
                parent.normalize();
              } else {
                // For spans, just normalize parent
                parent.normalize();
              }
            }
          }
          
          if (endIndex < elements.length) {
            // Process next batch asynchronously
            setTimeout(() => processBatch(elements, endIndex, batchSize), 0);
          } else {
            // All batches processed, now rescan
            scanAndConvert(document.body);
          }
        };
        
        // Combine and deduplicate elements
        const allElements = Array.from(new Set([...triggers, ...spans]));
        if (allElements.length > 0) {
          processBatch(allElements, 0);
        } else {
          scanAndConvert(document.body);
        }
      });
      }
    }
  });
}

function scanAndConvert(rootNode) {
  if (!siteHandler || !siteHandler.scanAndConvert) {
    console.error('TimeCost: Site handler not available or missing scanAndConvert method');
    return;
  }
  
  // Run site-specific handler (e.g., Amazon price containers)
  // Returns false if it only handles specific elements and not all text nodes
  const handledAllTextNodes = siteHandler.scanAndConvert(rootNode, userSalary, userCurrency, spacingMode, processedTextNodes);
  
  // If site handler is generic or already handled all nodes, we're done
  if (handledAllTextNodes || siteHandler === genericHandler) {
    return;
  }
  
  // Site handler only handled specific elements (like Amazon price containers)
  // Now process remaining text nodes with generic handler
  // Pass an optional filter function to skip nodes inside processed Amazon price containers
  const skipFilter = siteHandler.isInProcessedAmazonPrice ? 
    (node) => siteHandler.isInProcessedAmazonPrice(node) : 
    null;
  
  genericHandler.scanAndConvert(rootNode, userSalary, userCurrency, spacingMode, processedTextNodes, skipFilter);
}

