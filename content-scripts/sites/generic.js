// Generic handler for all sites without specific implementations

import {
  PRICE_REGEX,
  isInsideProcessedElement,
  isStrikethrough,
  parsePriceString,
  calculateTimeCost,
  showHoverTooltip,
  hideHoverTooltip
} from '../base.js';

// Note: processedTextNodes WeakSet is passed from the main handler

// Process a text node and replace prices with time cost
function processNode(textNode, userSalary, userCurrency, spacingMode) {
  const originalText = textNode.nodeValue;
  
  // Find all price matches with their positions
  const matches = [];
  let match;
  const regex = new RegExp(PRICE_REGEX);
  
  while ((match = regex.exec(originalText)) !== null) {
    matches.push({
      match: match[0],
      index: match.index,
      length: match[0].length
    });
  }
  
  if (matches.length === 0) return;
  
  // Process each match to calculate time cost
  const processedMatches = matches.map(matchData => {
    const match = matchData.match;
    try {
      // Parse the price
      const { price: priceValue, currency: detectedCurrency } = parsePriceString(match);
      
      if (!priceValue || priceValue === 0) return null;

      // Calculate time cost
      const timeCost = calculateTimeCost(priceValue, detectedCurrency, userSalary, userCurrency);

      return {
        ...matchData,
        timeCost
      };

    } catch (e) {
      console.error("TimeCost Error parsing:", match, e);
      return null;
    }
  }).filter(m => m !== null);
  
  if (processedMatches.length === 0) return;
  
  // Skip entire text node if it's inside strikethrough styling
  if (isStrikethrough(textNode)) {
    return;
  }
  
  // Create a document fragment to build the new content
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  
  processedMatches.forEach((matchData) => {
    // Add text before the match
    if (matchData.index > lastIndex) {
      const beforeText = originalText.substring(lastIndex, matchData.index);
      fragment.appendChild(document.createTextNode(beforeText));
    }
    
    if (spacingMode === 'compact') {
      // Compact mode: Replace price with time cost
      const timeCostSpan = document.createElement('span');
      timeCostSpan.textContent = matchData.timeCost;
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
      fragment.appendChild(timeCostSpan);
    } else if (spacingMode === 'comfortable') {
      // Comfortable mode: Show price, hover shows time cost in tooltip
      const priceWrapper = document.createElement('span');
      priceWrapper.style.cssText = 'position: relative; display: inline-block;';
      priceWrapper.setAttribute('data-timecost-trigger', 'true');
      priceWrapper.textContent = matchData.match;
      
      // Store time cost data for hover tooltip
      priceWrapper.setAttribute('data-timecost', matchData.timeCost);
      priceWrapper.setAttribute('data-original-price', matchData.match);
      
      // Add hover event listeners
      priceWrapper.addEventListener('mouseenter', showHoverTooltip);
      priceWrapper.addEventListener('mouseleave', hideHoverTooltip);
      
      fragment.appendChild(priceWrapper);
    } else {
      // Default mode: Show price + time cost side by side
      // Wrap both in a container for proper vertical alignment
      const wrapper = document.createElement('span');
      wrapper.style.cssText = 'display: inline-flex; align-items: center; vertical-align: middle;';
      
      const priceSpan = document.createElement('span');
      priceSpan.textContent = matchData.match;
      wrapper.appendChild(priceSpan);
      
      const timeCostSpan = document.createElement('span');
      timeCostSpan.textContent = ` ${matchData.timeCost}`;
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
      fragment.appendChild(wrapper);
    }
    
    lastIndex = matchData.index + matchData.length;
  });
  
  // Add remaining text after last match
  if (lastIndex < originalText.length) {
    fragment.appendChild(document.createTextNode(originalText.substring(lastIndex)));
  }
  
  // Replace the text node with the fragment
  const parent = textNode.parentNode;
  parent.replaceChild(fragment, textNode);
}

// Generic site handler - scans and processes prices in text nodes
export function scanAndConvert(rootNode, userSalary, userCurrency, spacingMode, processedTextNodesSet, skipFilter = null) {
  // Use the shared WeakSet from the main handler
  if (!processedTextNodesSet) {
    console.warn('TimeCost: processedTextNodesSet not provided to generic handler');
    return true;
  }
  
  // TreeWalker is efficient for finding text nodes
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    // Skip if already processed or inside script/style tags
    if (!node.parentElement || node.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)) continue;
    
    // Skip if this text node has already been processed
    if (processedTextNodesSet.has(node)) continue;
    
    // Skip if text node is inside an element we created (check all ancestors)
    if (isInsideProcessedElement(node)) continue;
    
    // Skip if text node is inside strikethrough styling
    if (isStrikethrough(node)) continue;
    
    // Apply custom skip filter if provided (e.g., skip nodes inside processed Amazon price containers)
    if (skipFilter && skipFilter(node)) continue;

    const text = node.nodeValue;
    
    // Check if text contains a price (create new regex instance to avoid state issues)
    if (text && text.trim() && new RegExp(PRICE_REGEX).test(text)) {
      // Mark as processed before processing to avoid reprocessing
      processedTextNodesSet.add(node);
      processNode(node, userSalary, userCurrency, spacingMode);
    }
  }
  
  return true; // Return true to indicate we processed text nodes
}

