// Open options page when icon clicked
browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});

let currentActiveTabUrl = '';

// Track active tab URL
browser.tabs.onActivated.addListener(activeInfo => {
  browser.tabs.get(activeInfo.tabId).then(tab => {
    currentActiveTabUrl = tab.url;
    checkAndCloseTabs(tab.url);
  });
});

// Track URL changes in active tab
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    currentActiveTabUrl = changeInfo.url;
    checkAndCloseTabs(changeInfo.url);
  }
});

// Close new tabs when needed
browser.tabs.onCreated.addListener(async tab => {
  const data = await browser.storage.local.get(['blockedUrls']);
  const blockedUrls = data.blockedUrls || [];
  
  if (blockedUrls.some(url => currentActiveTabUrl.includes(url))) {
    browser.tabs.remove(tab.id);
  }
});

async function checkAndCloseTabs(url) {
  const data = await browser.storage.local.get(['targetUrls', 'desiredUrls']);
  const targetUrls = data.targetUrls || [];
  const desiredUrls = data.desiredUrls || [];

  // Check if current URL is a target site
  const isTargetSite = targetUrls.some(targetUrl => url.includes(targetUrl));
  
  if (isTargetSite) {
    const tabs = await browser.tabs.query({});
    
    tabs.forEach(tab => {
      // Don't close the current tab
      if (tab.url === url) return;
      
      // Check if tab matches any desired URLs
      const shouldKeep = desiredUrls.some(desiredUrl => tab.url.includes(desiredUrl));
      
      // Close tab if it doesn't match any desired URLs
      if (!shouldKeep) {
        browser.tabs.remove(tab.id).catch(err => {
          console.error("Error closing tab:", err);
        });
      }
    });
  }
}
