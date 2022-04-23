// let us know we're running
console.log('[Fshare Tool] Background service worker has loaded via Manifest V3.');

// listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // log the message
  console.log('[Fshare Tool] Message received! request:', request);

  switch (request.cmd) {
    case 'attachLogic':
      //   chrome.scripting.executeScript({
      //     target: { tabId: sender.tab.id },
      //     files: ['scripts/services/logic.js'],
      //   });
      break;
    case 'addContextMenus':
      contextMenusHandler(sender.tab);
      break;
    default:
      console.log('[Fshare Tool] Action invalid', request.cmd);
      break;
  }
});

// handle contextMenus interactions
chrome.contextMenus.onClicked.addListener((menu) => {
  console.log('[Fshare Tool] Menu selected:', menu);
  switch (menu.menuItemId) {
    case 'context_menu_rescan_fshare_links':
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            FshareFile.scanFshareLink();
            toastr.success('Re-scan Fshare Links was successfully!');
          },
        });
      });
      break;
    case 'context_menu_open_activities_page':
      chrome.storage.sync.get(['settings'], (data) => {
        const settings = data.settings;
        console.log('[Fshare Tool] Settings:', settings);
        chrome.windows.create({ url: settings.serverUrl, type: 'popup' });
      });
      break;
  }
});

// PRIVATE

const contextMenusHandler = () => {
  // don't try to duplicate this menu item
  chrome.contextMenus.removeAll();

  // create a menu
  chrome.contextMenus.create({
    title: 'View Activities',
    id: 'context_menu_open_activities_page',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    title: 'Re-scan Fshare Links',
    id: 'context_menu_rescan_fshare_links',
    contexts: ['all'],
  });
};
