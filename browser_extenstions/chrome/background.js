// let us know we're running
console.log('[Fshare Tool] Background service worker has loaded via Manifest V3.');

// listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // log the message
  console.log('[Fshare Tool] Message received! request:', request);

  switch (request.cmd) {
    // case 'exampleAttachLogic':
    //   chrome.scripting.executeScript({
    //     target: { tabId: sender.tab.id },
    //     files: ['scripts/services/logic.js'],
    //   });

    //   break;
    case 'addContextMenus':
      contextMenusHandler(sender.tab);
      break;
    default:
      console.log('[Fshare Tool] Action invalid', request.cmd);
      break;
  }
});

// PRIVATE

const contextMenusHandler = (tab) => {
  // don't try to duplicate this menu item
  chrome.contextMenus.removeAll();

  // create a menu
  chrome.contextMenus.create({
    title: 'Re-scan Fshare Links',
    id: 'context_menu_rescan_fshare_links',
    contexts: ['all'],
  });

  // chrome.contextMenus.create({
  //   title: 'Health Check',
  //   id: 'context_menu_health_check',
  //   contexts: ['all'],
  // });

  // handle interactions
  chrome.contextMenus.onClicked.addListener((menu) => {
    console.log('[Fshare Tool] Menu selected:', menu);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          FshareFile.scanFshareLink();
          toastr.success('Re-scan Fshare Links was successfully!');
        },
      });

      // chrome.tabs.sendMessage(tabs[0].id, {
      //   msg: 'Greetings from your Test V3 context menu',
      // });
    });
  });
};
