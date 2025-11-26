// Amazon-specific price extraction and injection logic

import {
  PRICE_REGEX,
  isInsideProcessedElement,
  isStrikethrough,
  parsePriceString,
  calculateTimeCost,
  showHoverTooltip,
  hideHoverTooltip
} from '../base.js';

// Track processed Amazon price elements to avoid reprocessing
const processedAmazonPrices = new WeakSet();

// Function to extract price from Amazon price element structure
// Amazon uses .a-offscreen span which contains the full price text (e.g., "R$ 4.364,10")
function extractAmazonPrice(priceElement) {
  const offscreenSpan = priceElement.querySelector('.a-offscreen');
  if (offscreenSpan) {
    const offscreenText = offscreenSpan.textContent.trim();
    // Return the price text if it contains currency and numbers
    if (offscreenText && (/(R\$|€|\$)/.test(offscreenText) && /\d/.test(offscreenText))) {
      return offscreenText;
    }
  }
  
  return null;
}

// Check if an element or any of its ancestors has Amazon's strikethrough attribute
function hasAmazonStrikethrough(element) {
  let current = element;
  while (current && current !== document.body) {
    if (current.hasAttribute && current.hasAttribute('data-a-strike') && 
        current.getAttribute('data-a-strike') === 'true') {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

// Function to process Amazon price elements
export function processAmazonPrices(rootNode, userSalary, userCurrency, spacingMode) {
  // Find all Amazon price containers
  const priceContainers = rootNode.querySelectorAll('.a-price:not([data-timecost-processed])');
  
  priceContainers.forEach(container => {
    // Skip if already processed or inside our created elements
    if (processedAmazonPrices.has(container) || isInsideProcessedElement(container)) {
      return;
    }
    
    // Skip if price is strikethrough/slashed
    // Check for Amazon-specific strikethrough attribute (on element or parent)
    if (hasAmazonStrikethrough(container)) {
      return;
    }
    
    // Also check for general strikethrough styling
    if (isStrikethrough(container)) {
      return;
    }
    
    // Mark as processed
    processedAmazonPrices.add(container);
    container.setAttribute('data-timecost-processed', 'true');
    
    // Extract the full price text
    const priceText = extractAmazonPrice(container);
    if (!priceText) {
      return;
    }
    
    // Process the price
    try {
      // Try regex first, but if it doesn't match, process the priceText directly
      const regex = new RegExp(PRICE_REGEX);
      let match = regex.exec(priceText);
      let priceToProcess = match ? match[0] : priceText;
      
      // Parse the price
      const { price: priceValue, currency: detectedCurrency } = parsePriceString(priceToProcess);
      
      if (!priceValue || priceValue === 0) {
        return; // Skip this container if price is invalid
      }
      
      // Calculate time cost
      const timeCost = calculateTimeCost(priceValue, detectedCurrency, userSalary, userCurrency);
      
      // Insert the time cost display
      if (spacingMode === 'compact') {
        // Compact mode: Replace price with time cost
        const timeCostSpan = document.createElement('span');
        timeCostSpan.textContent = timeCost;
        timeCostSpan.style.cssText = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        `;
        if (container.parentNode) {
          container.parentNode.replaceChild(timeCostSpan, container);
        }
      } else if (spacingMode === 'comfortable') {
        // Comfortable mode: Add hover trigger to price container with coin icon
        // Wrap container in a flex wrapper to add coin icon
        const wrapper = document.createElement('span');
        wrapper.style.cssText = 'display: inline-flex; align-items: center; gap: 4px; position: relative; cursor: pointer;';
        wrapper.setAttribute('data-timecost-trigger', 'true');
        wrapper.setAttribute('data-timecost', timeCost);
        wrapper.setAttribute('data-original-price', priceText);
        
        // Create coin icon (Lucide circle-dollar-sign)
        const coinIcon = document.createElement('span');
        coinIcon.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dafaa2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 10c0 .465 0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06C14.697 12 14.465 12 14 12h-4c-.465 0-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C8 13.303 8 13.535 8 14s0 .697.052.888a1.5 1.5 0 0 0 1.06 1.06c.19.052.423.052.888.052h4c.465 0 .697 0 .888-.052a1.5 1.5 0 0 0 1.06-1.06C16 14.697 16 14.465 16 14"/>
            <path d="M12 6v12"/>
          </svg>
        `;
        coinIcon.style.cssText = 'display: inline-flex; align-items: center; line-height: 1; flex-shrink: 0;';
        
        // Insert wrapper before container and move container into wrapper
        const parent = container.parentNode;
        if (parent) {
          parent.insertBefore(wrapper, container);
          wrapper.appendChild(container);
          wrapper.appendChild(coinIcon);
        } else {
          // Fallback: append icon to container
          container.appendChild(coinIcon);
          container.style.cssText += 'position: relative; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;';
        }
        
        wrapper.addEventListener('mouseenter', showHoverTooltip);
        wrapper.addEventListener('mouseleave', hideHoverTooltip);
      } else {
        // Default mode: Show price + time cost side by side
        // Wrap both elements in a flex container for proper center alignment
        const wrapper = document.createElement('span');
        wrapper.style.cssText = 'display: inline-flex; align-items: center; vertical-align: middle;';
        wrapper.setAttribute('data-timecost-wrapper', 'true');
        
        // Move the container into the wrapper (preserves all properties and event listeners)
        const parent = container.parentNode;
        if (parent) {
          // Insert wrapper before container
          parent.insertBefore(wrapper, container);
          // Move container into wrapper
          wrapper.appendChild(container);
        } else {
          // Fallback: if no parent, just append to container
          container.appendChild(wrapper);
        }
        
        const timeCostSpan = document.createElement('span');
        timeCostSpan.textContent = ` ${timeCost}`;
        timeCostSpan.setAttribute('data-timecost-element', 'true');
        timeCostSpan.style.cssText = `
          display: inline-flex;
          align-items: center;
          margin-left: 4px;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        `;
        wrapper.appendChild(timeCostSpan);
      }
    } catch (e) {
      console.error("TimeCost Error parsing Amazon price:", priceText, e);
    }
  });
}

// Amazon site handler - scans and processes prices
export function scanAndConvert(rootNode, userSalary, userCurrency, spacingMode, processedTextNodes) {
  // First, process Amazon price elements (they need special handling)
  processAmazonPrices(rootNode, userSalary, userCurrency, spacingMode);
  
  // Then process generic text nodes (for prices not in Amazon price containers)
  // This will be handled by the generic handler
  return false; // Return false to indicate we didn't process all text nodes
}

// Check if a text node is inside a processed Amazon price container
export function isInProcessedAmazonPrice(textNode) {
  let current = textNode.parentElement;
  while (current && current !== document.body) {
    if (current.classList.contains('a-price') && current.hasAttribute('data-timecost-processed')) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

