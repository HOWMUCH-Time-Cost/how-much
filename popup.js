document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('salary');
  const currencySelect = document.getElementById('currency');
  const currencyDisplay = document.getElementById('currencyDisplay');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Currency display mapping
  const currencyMap = {
    'USD': 'USD ($)',
    'EUR': 'EUR (€)',
    'BRL': 'BRL (R$)'
  };

  // Format number with thousands separator based on currency
  function formatNumber(value, currency) {
    if (!value) return '';
    const num = parseFloat(value.toString().replace(/[^\d.,]/g, '').replace(/,/g, '').replace(/\./g, ''));
    if (isNaN(num)) return '';
    
    // BRL/EUR use dot for thousands, comma for decimals
    // USD uses comma for thousands, dot for decimals
    if (currency === 'BRL' || currency === 'EUR') {
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  }

  // Parse formatted number back to numeric value
  function parseFormattedNumber(value, currency) {
    if (!value) return 0;
    let cleanValue = value.toString().replace(/[^\d.,]/g, '');
    
    if (currency === 'BRL' || currency === 'EUR') {
      // Remove dots (thousands) and replace comma with dot (decimal)
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    } else {
      // Remove commas (thousands)
      cleanValue = cleanValue.replace(/,/g, '');
    }
    
    return parseFloat(cleanValue) || 0;
  }

  // Update currency display
  function updateCurrencyDisplay() {
    const selectedCurrency = currencySelect.value;
    if (selectedCurrency && currencyMap[selectedCurrency]) {
      currencyDisplay.textContent = currencyMap[selectedCurrency];
    } else {
      currencyDisplay.textContent = '-';
    }
  }

  // Update salary input formatting
  function updateSalaryDisplay() {
    const value = salaryInput.value;
    const currency = currencySelect.value;
    if (value && currency) {
      const formatted = formatNumber(value, currency);
      if (formatted !== value) {
        const cursorPos = salaryInput.selectionStart;
        salaryInput.value = formatted;
        // Try to maintain cursor position
        setTimeout(() => {
          salaryInput.setSelectionRange(cursorPos, cursorPos);
        }, 0);
      }
    }
  }

  // Load saved settings
  chrome.storage.local.get(['userSalary', 'userCurrency'], (data) => {
    if (data.userCurrency) {
      currencySelect.value = data.userCurrency;
      updateCurrencyDisplay();
    }
    if (data.userSalary) {
      salaryInput.value = formatNumber(data.userSalary.toString(), data.userCurrency || 'USD');
    }
  });

  // Update currency display when selection changes
  currencySelect.addEventListener('change', () => {
    updateCurrencyDisplay();
    // Reformat salary input with new currency format
    if (salaryInput.value) {
      const numValue = parseFormattedNumber(salaryInput.value, currencySelect.value || 'USD');
      salaryInput.value = formatNumber(numValue.toString(), currencySelect.value);
    }
  });

  // Format salary input as user types
  salaryInput.addEventListener('input', (e) => {
    const currency = currencySelect.value;
    if (currency) {
      const numValue = parseFormattedNumber(e.target.value, currency);
      if (numValue > 0) {
        e.target.value = formatNumber(numValue.toString(), currency);
      }
    }
  });

  // Save settings
  saveBtn.addEventListener('click', () => {
    const currency = currencySelect.value;
    
    if (!currency) {
      currencySelect.focus();
      currencySelect.style.borderColor = 'hsl(0 84.2% 60.2%)';
      setTimeout(() => {
        currencySelect.style.borderColor = '';
      }, 2000);
      return;
    }

    const salary = parseFormattedNumber(salaryInput.value, currency);

    if (!salary || salary <= 0) {
      // Show error state
      salaryInput.style.borderColor = 'hsl(0 84.2% 60.2%)';
      salaryInput.focus();
      setTimeout(() => {
        salaryInput.style.borderColor = '';
      }, 2000);
      return;
    }

    chrome.storage.local.set({
      userSalary: salary,
      userCurrency: currency
    }, () => {
      // Show success message
      statusDiv.classList.remove('hidden');
      saveBtn.disabled = true;
      saveBtn.style.opacity = '0.6';
      saveBtn.style.cursor = 'not-allowed';
      
      setTimeout(() => {
        statusDiv.classList.add('hidden');
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
      }, 3000);
      
      // Reload the active tab to apply changes immediately
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    });
  });

  // Allow Enter key to save
  salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  currencySelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });
});

