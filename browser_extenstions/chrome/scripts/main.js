console.log('[Fshare Tool] Fshare Tool initializing ...');

const fireEvents = () => {
  const events = ['attachLogic', 'addContextMenus'];

  events.forEach((event) => {
    chrome.runtime.sendMessage({
      cmd: event,
    });
  });
};

libraryInjector();
fireEvents();
