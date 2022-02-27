// Navigation items
let element = document.getElementById('fshareActions');

element.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: Navigation.attachActions,
  });
});

const Navigation = (() => {
  const attachActions = () => Fshare.attachActions();

  return {
    attachActions: attachActions,
  }
})()
