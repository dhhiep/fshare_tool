class Fshare {
  constructor() {}

  settings(callback) {
    return chrome.storage.sync.get(['settings'], (data) => callback(data));
  }

  healthCheck(onSuccess = () => {}, onError = () => {}) {
    this.settings((data) => {
      $.ajax({
        method: 'get',
        url: data.settings.serverUrl,
        success: () => {
          toastr.success(`${data.settings.serverUrl} is ready!`);
          onSuccess(data);
        },
        error: () => {
          toastr.warning(`${data.settings.serverUrl} isn't ready!`);
          onError(data);
        },
      });
    });
  }

  isFshare() {
    return /https:\/\/.*fshare.vn/.test(location.href);
  }

  isFshareFolder() {
    return /https:\/\/.*fshare.vn\/folder\//.test(location.href);
  }

  isFshareFileLink(url) {
    return /^https:\/\/.*fshare.vn\/file\//.test(url);
  }

  fshareFolderId() {
    return location.href.match(/fshare.vn\/folder\/(\w+|\d+)/)[1];
  }

  fshareLinkId(url) {
    return url.match(/fshare.vn\/file\/(\w+|\d+)/)[1];
  }
}
