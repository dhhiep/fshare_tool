class Fshare {
  constructor() {}

  // Class methods
  static bindingFshareActions() {
    $(document)
      .off('click', '[data-fshare-link]')
      .on('click', '[data-fshare-link]', function (event) {
        event.preventDefault();
        const fshare = new Fshare();
        const element = $(event.target);

        const fshareLink = element.data('fshareLink');
        console.log('fshareLink', fshareLink);
        const fshareLinkCode = fshare.fshareLinkCode(fshareLink);

        console.log('fshareLinkCode', fshareLinkCode);

        if (element.hasClass('play')) {
          FshareFile.openInVlc(fshareLinkCode);
        }

        if (element.hasClass('download')) {
          FshareFile.download(fshareLinkCode);
        }

        if (element.hasClass('open')) {
          window.open(fshareLink);
        }
      });
  }

  // Instances methods
  settings(callback) {
    return chrome.storage.sync.get(['settings'], (data) => callback(data));
  }

  healthCheck(option = {}, onSuccess = () => {}, onError = () => {}) {
    if (option.displayServerStatus == null) option.displayServerStatus = true;

    this.settings((data) => {
      $.ajax({
        method: 'get',
        url: data.settings.serverUrl,
        success: () => {
          if (option.displayServerStatus) {
            toastr.success(`${data.settings.serverUrl} is ready!`);
          }

          onSuccess(data);
        },
        error: () => {
          if (option.displayServerStatus) {
            toastr.warning(`${data.settings.serverUrl} isn't ready!`);
          }

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

  currentFshareLinkCode() {
    return this.fshareLinkCode(location.href);
  }

  fshareLinkCode(url) {
    const regexMatched = url.match(/fshare.vn\/(file|folder)\/(\w+|\d+)/);

    return regexMatched && regexMatched.length > 1 ? regexMatched[2] : '';
  }
}
