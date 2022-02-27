console.log('[Fshare Tool] Fshare Tool initializing ...');

const fireEvents = () => {
  const events = ['exampleAttachLogic', 'addContextMenus'];

  events.forEach((event) => {
    chrome.runtime.sendMessage({
      cmd: event,
    });
  });
};

libraryInjector();
fireEvents();
