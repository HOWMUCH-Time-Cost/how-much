// Shared utilities and constants for all site handlers

// Exchange rates relative to USD (Base 1.0)
export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,  // 1 USD = 0.92 EUR (approx)
  BRL: 5.00   // 1 USD = 5.00 BRL (approx)
};

// Currency Symbols and Formatting Rules
export const CURRENCY_CONFIG = {
  USD: { symbol: '$', decimal: '.', separator: ',' },
  EUR: { symbol: '€', decimal: ',', separator: '.' }, // European format
  BRL: { symbol: 'R$', decimal: ',', separator: '.' } // Brazilian format
};

// Regex patterns to find prices in text
// Matches: $100, $100.00, 100 USD, €100, 100 €, R$ 1.000,00, R$ 245
export const PRICE_REGEX = /((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi;

// US Federal minimum wage: $7.25/hour * 40 hours/week * 4.33 weeks/month = $1,256.67/month
export const US_MONTHLY_MINIMUM_WAGE = 1256.67;

// Default whitelist sites for the extension
export const DEFAULT_WHITELIST = [
  'google.com',
  'amazon.com',
  'amazon.com.br',
  'amazon.co.uk',
  'amazon.de',
  'amazon.fr',
  'amazon.it',
  'amazon.es',
  'amazon.ca',
  'amazon.com.au',
  'amazon.co.jp',
  'ebay.com',
  'ebay.co.uk',
  'ebay.de',
  'walmart.com',
  'target.com',
  'bestbuy.com',
  'costco.com',
  'alibaba.com',
  'shopify.com',
  'etsy.com',
  'aliexpress.com'
];

// Helper function to normalize domain (remove www. prefix and convert to lowercase)
export function normalizeDomain(domain) {
  return domain.replace(/^www\./, '').toLowerCase();
}

// Helper function to get normalized domain from URL
export function getDomainFromUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return normalizeDomain(hostname);
  } catch (e) {
    // If URL parsing fails, try simple string manipulation
    const hostname = url.replace(/^https?:\/\//, '').split('/')[0];
    return normalizeDomain(hostname);
  }
}

// Helper function to check if current domain is in whitelist
export function isWhitelisted(domain, whitelist) {
  // Normalize domain for comparison
  const normalizedDomain = normalizeDomain(domain);
  
  // Check if domain matches exactly
  if (whitelist.includes(normalizedDomain)) {
    return true;
  }
  
  // Check if domain is a subdomain of a whitelisted domain
  // e.g., "www.amazon.com" matches "amazon.com" (after normalization, both become "amazon.com")
  // e.g., "shop.amazon.com" matches "amazon.com"
  for (const whitelistedDomain of whitelist) {
    const normalizedWhitelisted = normalizeDomain(whitelistedDomain);
    
    // Exact match
    if (normalizedDomain === normalizedWhitelisted) {
      return true;
    }
    
    // Check if current domain is a subdomain of whitelisted domain
    // e.g., "shop.amazon.com" ends with ".amazon.com"
    if (normalizedDomain.endsWith('.' + normalizedWhitelisted)) {
      return true;
    }
    
    // Check if whitelisted domain is a subdomain of current domain
    // e.g., "amazon.com" should match if whitelist has "shop.amazon.com" (though this is less common)
    if (normalizedWhitelisted.endsWith('.' + normalizedDomain)) {
      return true;
    }
  }
  
  return false;
}

// Helper function to check if a node or any of its ancestors is inside an element we created
export function isInsideProcessedElement(node) {
  let current = node.parentElement;
  while (current && current !== document.body) {
    if (current.hasAttribute('data-timecost-trigger') || 
        current.hasAttribute('data-timecost-wrapper') ||
        current.hasAttribute('data-timecost-element') ||
        current.classList.contains('timecost-wrapper')) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

// Helper function to check if an element or text node has strikethrough styling
export function isStrikethrough(node) {
  // Check if node is a text node, get its parent element
  let element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  
  if (!element) return false;
  
  // Walk up the DOM tree to check for strikethrough
  while (element && element !== document.body) {
    // Check for strikethrough HTML tags
    const tagName = element.tagName?.toLowerCase();
    if (tagName === 's' || tagName === 'strike' || tagName === 'del') {
      return true;
    }
    
    // Check computed style for text-decoration: line-through
    const style = window.getComputedStyle(element);
    const textDecoration = style.textDecoration || style.textDecorationLine;
    if (textDecoration && textDecoration.includes('line-through')) {
      return true;
    }
    
    // Check inline style
    if (element.style.textDecoration && element.style.textDecoration.includes('line-through')) {
      return true;
    }
    if (element.style.textDecorationLine && element.style.textDecorationLine.includes('line-through')) {
      return true;
    }
    
    element = element.parentElement;
  }
  
  return false;
}

// Parse price string to numeric value
export function parsePriceString(priceString, detectedCurrency) {
  // 1. Identify currency
  let currency = detectedCurrency || 'USD';
  if (priceString.includes('R$') || priceString.includes('BRL')) currency = 'BRL';
  else if (priceString.includes('€') || priceString.includes('EUR')) currency = 'EUR';
  
  // 2. Clean the string
  let cleanString = priceString.replace(/[^\d.,]/g, '').trim();
  
  // 3. Detect number format by pattern
  let isUSDFormat = false;
  const usdPattern = /,\d{3}\./;
  const brlPattern = /\.\d{3},/;
  
  if (usdPattern.test(cleanString)) {
    isUSDFormat = true;
  } else if (brlPattern.test(cleanString)) {
    isUSDFormat = false;
  } else if (cleanString.includes('.') && cleanString.includes(',')) {
    const dotIndex = cleanString.lastIndexOf('.');
    const commaIndex = cleanString.lastIndexOf(',');
    isUSDFormat = dotIndex > commaIndex;
  } else if (cleanString.includes('.')) {
    const parts = cleanString.split('.');
    const lastPart = parts[parts.length - 1];
    if (parts.length === 2 && lastPart.length <= 2) {
      isUSDFormat = true;
    } else if (parts.length > 2 || lastPart.length === 3) {
      isUSDFormat = false;
    } else {
      isUSDFormat = (lastPart.length <= 2);
    }
  } else if (cleanString.includes(',')) {
    const parts = cleanString.split(',');
    const lastPart = parts[parts.length - 1];
    isUSDFormat = (lastPart.length === 3 && parts.length > 1);
  } else {
    isUSDFormat = (currency === 'USD');
  }
  
  // 4. Parse based on format
  if (isUSDFormat) {
    if (cleanString.includes('.')) {
      cleanString = cleanString.replace(/,/g, '');
    } else if (cleanString.includes(',')) {
      cleanString = cleanString.replace(/,/g, '');
    }
  } else {
    if (cleanString.includes(',')) {
      cleanString = cleanString.replace(/\./g, '').replace(',', '.');
    } else if (cleanString.includes('.')) {
      const parts = cleanString.split('.');
      const lastPart = parts[parts.length - 1];
      if (parts.length > 2) {
        cleanString = cleanString.replace(/\./g, '');
      } else if (lastPart.length === 3) {
        cleanString = cleanString.replace(/\./g, '');
      } else if (lastPart.length <= 2) {
        // Keep as is
      } else {
        cleanString = cleanString.replace(/\./g, '');
      }
    }
  }
  
  const priceValue = parseFloat(cleanString);
  
  return {
    price: isNaN(priceValue) || priceValue === 0 ? null : priceValue,
    currency
  };
}

// Calculate time cost from price
export function calculateTimeCost(price, priceCurrency, userSalary, userCurrency) {
  // Normalize Price to USD (Base)
  const priceInUSD = price / EXCHANGE_RATES[priceCurrency];
  
  // Normalize User Salary to USD (Base)
  // Assuming 22 working days per month, 8 hours per day
  const salaryInUSD = userSalary / EXCHANGE_RATES[userCurrency];
  const dailyWageInUSD = salaryInUSD / 22;
  
  // Calculate Days
  const daysCost = priceInUSD / dailyWageInUSD;
  
  // Formatting the result
  // Always use hours (no days), assuming 8h work day
  const totalHours = daysCost * 8;
  
  if (totalHours < 1) {
    // If less than 1 hour, show only minutes
    const minutes = Math.round(totalHours * 60);
    return `${minutes}m`;
  } else {
    // If 1 hour or more, show decimal hours (e.g., 1.5h, 2.3h)
    // Round to 1 decimal place
    const decimalHours = Math.round(totalHours * 10) / 10;
    return `${decimalHours}h`;
  }
}

// Create time cost display element
export function createTimeCostElement(timeCost, spacingMode) {
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
    vertical-align: middle;
  `;
  return timeCostSpan;
}

// Hover tooltip management for comfortable mode
let currentTooltip = null;

export function showHoverTooltip(event) {
  const trigger = event.currentTarget;
  const timeCost = trigger.getAttribute('data-timecost');
  const originalPrice = trigger.getAttribute('data-original-price');
  
  // Remove existing tooltip if any
  if (currentTooltip) {
    currentTooltip.remove();
  }
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'timecost-hover-tooltip';
  tooltip.setAttribute('data-timecost-tooltip', 'true');
  tooltip.innerHTML = `
    <div style="padding: 12px;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #000;">
        ${originalPrice}
      </div>
      <div style="font-size: 12px; color: #000; margin-bottom: 8px;">
        Time cost
      </div>
      <div style="
        display: inline-block;
        padding: 4px 8px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.2;
      ">
        ${timeCost}
      </div>
    </div>
  `;
  
  // Style the tooltip
  tooltip.style.cssText = `
    position: absolute;
    z-index: 999999;
    width: 280px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #dafaa2;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  `;
  
  // Add to body for proper positioning
  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
  
  // Position tooltip
  const rect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Position above the trigger by default, adjust if not enough space
  let top = rect.top + scrollY - tooltipRect.height - 8;
  let left = rect.left + scrollX + (rect.width / 2) - (tooltipRect.width / 2);
  
  // Adjust if tooltip goes off screen
  if (top < scrollY) {
    top = rect.bottom + scrollY + 8;
  }
  if (left < scrollX) {
    left = scrollX + 8;
  } else if (left + tooltipRect.width > scrollX + window.innerWidth) {
    left = scrollX + window.innerWidth - tooltipRect.width - 8;
  }
  
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  
  // Fade in
  requestAnimationFrame(() => {
    tooltip.style.opacity = '1';
  });
}

export function hideHoverTooltip(event) {
  if (currentTooltip) {
    currentTooltip.style.opacity = '0';
    setTimeout(() => {
      if (currentTooltip && currentTooltip.parentNode) {
        currentTooltip.remove();
      }
      currentTooltip = null;
    }, 150);
  }
}

