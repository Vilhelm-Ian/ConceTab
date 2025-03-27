document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  browser.storage.local.get(['blockedUrls', 'targetUrls', 'desiredUrls']).then(data => {
    document.getElementById('blockedUrls').value = (data.blockedUrls || []).join('\n');
    document.getElementById('targetUrls').value = (data.targetUrls || []).join('\n');
    document.getElementById('desiredUrls').value = (data.desiredUrls || []).join('\n');
  });

  // Save button handler
  document.getElementById('save').addEventListener('click', () => {
    const blockedUrls = document.getElementById('blockedUrls').value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    const targetUrls = document.getElementById('targetUrls').value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    const desiredUrls = document.getElementById('desiredUrls').value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    browser.storage.local.set({
      blockedUrls,
      targetUrls,
      desiredUrls
    });
    
    alert('Settings saved!');
  });
});
