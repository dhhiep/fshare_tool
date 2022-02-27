// let us know we're running
console.log("[Fshare Tool] Fshare Tool execute script via Manifest V3.");

// listen for messages from the background
chrome.runtime.onMessage.addListener(r => {
  console.log('[Fshare Tool] listen for messages from the background', r);
});
