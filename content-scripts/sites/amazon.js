// Amazon-specific price extraction and injection logic

import {
  PRICE_REGEX,
  isInsideProcessedElement,
  parsePriceString,
  calculateTimeCost,
  showHoverTooltip,
  hideHoverTooltip
} from '../base.js';

// Track processed Amazon price elements to avoid reprocessing
const processedAmazonPrices = new WeakSet();

// Function to extract price from Amazon price element structure
function extractAmazonPrice(priceElement) {
  // First, try to get the full price from a-offscreen span (most reliable)
  const offscreenSpan = priceElement.querySelector('.a-offscreen');
  if (offscreenSpan) {
    const offscreenText = offscreenSpan.textContent.trim();
    // Be more lenient - if it contains a currency symbol and numbers, use it
    if (offscreenText && (/(R\$|€|\$)/.test(offscreenText) && /\d/.test(offscreenText))) {
      return offscreenText;
    }
  }
  
  // If no offscreen, reconstruct from visible elements
  const symbolSpan = priceElement.querySelector('.a-price-symbol');
  const wholeSpan = priceElement.querySelector('.a-price-whole');
  const decimalSpan = priceElement.querySelector('.a-price-decimal');
  const fractionSpan = priceElement.querySelector('.a-price-fraction');
  
  if (symbolSpan && wholeSpan) {
    let priceText = symbolSpan.textContent.trim();
    priceText += wholeSpan.textContent.trim();
    
    if (decimalSpan) {
      priceText += decimalSpan.textContent.trim();
    }
    
    if (fractionSpan) {
      priceText += fractionSpan.textContent.trim();
    }
    
    // Be more lenient - if it contains a currency symbol and numbers, use it
    if (priceText && (/(R\$|€|\$)/.test(priceText) && /\d/.test(priceText))) {
      return priceText;
    }
  }
  
  return null;
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
          display: inline-block;
          vertical-align: middle;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-family: 'Boldonse', sans-serif;
          font-weight: 700;
          line-height: 1.2;
        `;
        if (container.parentNode) {
          container.parentNode.replaceChild(timeCostSpan, container);
        }
      } else if (spacingMode === 'comfortable') {
        // Comfortable mode: Add hover trigger to price container
        container.style.cssText += 'position: relative; display: inline-block; cursor: pointer;';
        container.setAttribute('data-timecost-trigger', 'true');
        container.setAttribute('data-timecost', timeCost);
        container.setAttribute('data-original-price', priceText);
        container.addEventListener('mouseenter', showHoverTooltip);
        container.addEventListener('mouseleave', hideHoverTooltip);
      } else {
        // Default mode: Show price + time cost side by side
        const timeCostSpan = document.createElement('span');
        timeCostSpan.textContent = ` ${timeCost}`;
        timeCostSpan.setAttribute('data-timecost-element', 'true');
        timeCostSpan.style.cssText = `
          display: inline-block;
          margin-left: 4px;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-family: 'Boldonse', sans-serif;
          font-weight: 700;
          line-height: 1.2;
          vertical-align: middle;
        `;
        // Use insertAdjacentElement which is more reliable than insertBefore
        try {
          if (container.parentNode) {
            container.insertAdjacentElement('afterend', timeCostSpan);
          } else {
            // Fallback: try to append to container itself (though this is not ideal)
            container.appendChild(timeCostSpan);
          }
        } catch (e) {
          console.error('TimeCost: Error inserting time cost element:', e);
          // Fallback: try appendChild to parent
          if (container.parentNode) {
            container.parentNode.appendChild(timeCostSpan);
          }
        }
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

