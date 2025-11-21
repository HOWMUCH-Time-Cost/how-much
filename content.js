// 1. MOCK LOCAL DATA: Fixed exchange rates relative to USD (Base 1.0)
const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,  // 1 USD = 0.92 EUR (approx)
  BRL: 5.00   // 1 USD = 5.00 BRL (approx)
};

// Currency Symbols and Formatting Rules
const CURRENCY_CONFIG = {
  USD: { symbol: '$', decimal: '.', separator: ',' },
  EUR: { symbol: '€', decimal: ',', separator: '.' }, // European format
  BRL: { symbol: 'R$', decimal: ',', separator: '.' } // Brazilian format
};

// Regex patterns to find prices in text
// Matches: $100, $100.00, 100 USD, €100, 100 €, R$ 1.000,00
const PRICE_REGEX = /((R\$|€|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s?(USD|EUR|BRL))/gi;

let userSalary = 0;
let userCurrency = 'USD';

// Main entry point
chrome.storage.local.get(['userSalary', 'userCurrency'], (data) => {
  if (data.userSalary && data.userCurrency) {
    userSalary = parseFloat(data.userSalary);
    userCurrency = data.userCurrency;
    init();
  }
});

function init() {
  // Run immediately
  scanAndConvert(document.body);

  // Run whenever the page content changes (for dynamic sites like Amazon/infinite scroll)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          scanAndConvert(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function scanAndConvert(rootNode) {
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
    if (node.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)) continue;
    if (node.parentElement.getAttribute('data-timecost-processed')) continue;

    const text = node.nodeValue;
    
    // Check if text contains a price
    if (text && PRICE_REGEX.test(text)) {
      processNode(node);
    }
  }
}

function processNode(textNode) {
  const originalText = textNode.nodeValue;
  
  // We replace the text content by parsing matches
  const newText = originalText.replace(PRICE_REGEX, (match) => {
    try {
      // 1. Identify currency of the Price Found on Page
      let detectedCurrency = 'USD'; // Default
      if (match.includes('R$') || match.includes('BRL')) detectedCurrency = 'BRL';
      else if (match.includes('€') || match.includes('EUR')) detectedCurrency = 'EUR';
      
      // 2. Clean the string to get a raw number
      let cleanString = match.replace(/[^\d.,]/g, '').trim();
      
      // Handle Decimal/Thousand separators based on currency conventions
      // BRL/EUR: dot = thousands separator, comma = decimal separator (1.000,50)
      // USD: comma = thousands separator, dot = decimal separator (1,000.50)
      let priceValue = 0;
      
      if (detectedCurrency === 'BRL' || detectedCurrency === 'EUR') {
        // Brazilian/European format: dot for thousands, comma for decimals
        // Examples: 1.000,50 | 1.000.000,99 | 1000,50 | 1.000
        if (cleanString.includes(',')) {
          // Has comma = decimal separator exists
          // Remove all dots (thousands separators) and replace comma with dot
          cleanString = cleanString.replace(/\./g, '').replace(',', '.');
        } else if (cleanString.includes('.')) {
          // Only dots, no comma - determine if thousands or decimal
          const parts = cleanString.split('.');
          const lastPart = parts[parts.length - 1];
          
          if (parts.length > 2) {
            // Multiple dots = thousands separators: 1.000.000 -> 1000000
            cleanString = cleanString.replace(/\./g, '');
          } else if (lastPart.length === 3) {
            // 3 digits after dot = thousands: 1.000 -> 1000
            cleanString = cleanString.replace(/\./g, '');
          } else if (lastPart.length <= 2) {
            // 1-2 digits after dot = likely decimal (edge case, but treat as decimal)
            // Keep as is: 1.50 -> 1.50
          } else {
            // Default: remove dots (treat as thousands)
            cleanString = cleanString.replace(/\./g, '');
          }
        }
      } else {
        // USD format: comma for thousands, dot for decimals
        // Examples: 1,000.50 | 1,000,000.99 | 1000.50 | 1,000
        if (cleanString.includes('.')) {
          // Has dot = decimal separator exists
          // Remove all commas (thousands separators)
          cleanString = cleanString.replace(/,/g, '');
        } else if (cleanString.includes(',')) {
          // Only commas, no dot = thousands separators
          // Remove all commas: 1,000 -> 1000
          cleanString = cleanString.replace(/,/g, '');
        }
      }
      
      priceValue = parseFloat(cleanString);
      
      if (isNaN(priceValue) || priceValue === 0) return match;

      // 3. Normalize Price to USD (Base)
      const priceInUSD = priceValue / EXCHANGE_RATES[detectedCurrency];

      // 4. Normalize User Salary to USD (Base)
      // Assuming 22 working days per month, 8 hours per day
      const salaryInUSD = userSalary / EXCHANGE_RATES[userCurrency];
      const dailyWageInUSD = salaryInUSD / 22;

      // 5. Calculate Days
      const daysCost = priceInUSD / dailyWageInUSD;

      // Formatting the result
      let daysString = "";
      if (daysCost < 1) {
        // If less than 1 day, show hours (assuming 8h work day)
        const hours = (daysCost * 8).toFixed(1);
        daysString = ` (${hours}h work)`;
      } else {
        daysString = ` (${daysCost.toFixed(1)} days)`;
      }

      return `${match} ${daysString}`;

    } catch (e) {
      console.error("TimeCost Error parsing:", match, e);
      return match; // Return original if error
    }
  });

  if (newText !== originalText) {
    textNode.nodeValue = newText;
    textNode.parentElement.setAttribute('data-timecost-processed', 'true');
  }
}

