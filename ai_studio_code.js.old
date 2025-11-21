document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.local.get(['userSalary', 'userCurrency'], (data) => {
    if (data.userSalary) document.getElementById('salary').value = data.userSalary;
    if (data.userCurrency) document.getElementById('currency').value = data.userCurrency;
  });

  // Save settings
  document.getElementById('saveBtn').addEventListener('click', () => {
    const salary = parseFloat(document.getElementById('salary').value);
    const currency = document.getElementById('currency').value;

    if (!salary || salary <= 0) {
      alert("Please enter a valid salary.");
      return;
    }

    chrome.storage.local.set({
      userSalary: salary,
      userCurrency: currency
    }, () => {
      const status = document.getElementById('status');
      status.style.display = 'block';
      setTimeout(() => { status.style.display = 'none'; }, 2000);
      
      // Optional: Reload the active tab to apply changes immediately
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    });
  });
});