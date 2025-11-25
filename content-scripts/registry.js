// Site registry - detects current site and returns appropriate handler

import { getDomainFromUrl, normalizeDomain } from './base.js';
import * as amazonHandler from './sites/amazon.js';
import * as genericHandler from './sites/generic.js';

// Map of domains to their handlers
const SITE_HANDLERS = {
  'amazon.com': amazonHandler,
  'amazon.co.uk': amazonHandler,
  'amazon.de': amazonHandler,
  'amazon.fr': amazonHandler,
  'amazon.it': amazonHandler,
  'amazon.es': amazonHandler,
  'amazon.ca': amazonHandler,
  'amazon.com.au': amazonHandler,
  'amazon.co.jp': amazonHandler,
};

// Get base domain from a domain string
export function getBaseDomain(domain) {
  const normalized = normalizeDomain(domain);
  const parts = normalized.split('.');
  
  // Handle common multi-part TLDs
  const multiPartTlds = ['co.uk', 'com.au', 'co.jp', 'com.br'];
  for (const tld of multiPartTlds) {
    if (normalized.endsWith('.' + tld)) {
      const domainPart = normalized.replace('.' + tld, '');
      return domainPart.split('.').pop() || domainPart;
    }
  }
  
  // For simple domains like "amazon.com", return "amazon"
  if (parts.length === 2) {
    return parts[0];
  }
  
  // For domains like "www.amazon.com", return "amazon"
  if (parts.length >= 3) {
    return parts[parts.length - 2];
  }
  
  return parts[0];
}

// Get the handler for the current site
export function getSiteHandler(url) {
  const domain = getDomainFromUrl(url);
  const normalizedDomain = normalizeDomain(domain);
  
  // Check for exact domain match first
  if (SITE_HANDLERS[normalizedDomain]) {
    return SITE_HANDLERS[normalizedDomain];
  }
  
  // Check for base domain match (e.g., any amazon.com subdomain)
  const baseDomain = getBaseDomain(normalizedDomain);
  const handlerKey = Object.keys(SITE_HANDLERS).find(key => {
    const handlerBaseDomain = getBaseDomain(key);
    return handlerBaseDomain === baseDomain;
  });
  
  if (handlerKey) {
    return SITE_HANDLERS[handlerKey];
  }
  
  // Default to generic handler
  return genericHandler;
}

// Get site name for debugging/logging
export function getSiteName(url) {
  const domain = getDomainFromUrl(url);
  const normalizedDomain = normalizeDomain(domain);
  const baseDomain = getBaseDomain(normalizedDomain);
  
  // Check if we have a specific handler
  const handler = getSiteHandler(url);
  if (handler !== genericHandler) {
    return baseDomain;
  }
  
  return 'generic';
}

