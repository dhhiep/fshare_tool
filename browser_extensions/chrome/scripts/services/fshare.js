class Fshare {
  constructor() {}

  // Global bindings for all HTML elements has attribute [data-fshare-link]
  static bindingFshareActions() {
    $(document)
      .off('click', '[data-fshare-link]')
      .on('click', '[data-fshare-link]', function (event) {
        event.preventDefault();
        const fshare = new Fshare();
        const element = $(event.target);

        const fshareLink = element.data('fshareLink');
        const fshareLinkCode = fshare.fshareLinkCode(fshareLink);
        if (fshareLinkCode == undefined || fshareLinkCode == '') return;

        if (element.hasClass('action-play')) {
          FshareFile.watch(fshareLinkCode);
        }

        if (element.hasClass('action-download')) {
          FshareFile.download(fshareLinkCode);
        }

        if (element.hasClass('action-show-transfer-popup')) {
          FshareFile.showTransferPopup(fshareLinkCode);
        }

        if (element.hasClass('action-transfer-file')) {
          const remote = element.data('remote');
          const path = element.data('path');
          const fileName = element.data('fileName');

          FshareFile.transfer(fshareLinkCode, remote, path, fileName);
        }

        if (element.hasClass('action-copy-direct-link')) {
          FshareFile.directLink(fshareLinkCode).then((link) => {
            navigator.clipboard.writeText(link);
            const fileName = link.split('/').pop();
            toastr.success(`Direct Link ${fileName} has been copied to clipboard`);
          });
        }

        if (element.hasClass('action-open')) {
          window.open(fshareLink);
        }
      });
  }

  // Instances methods
  settings(callback) {
    return chrome.storage.sync.get(['settings'], (data) => callback(data));
  }

  healthCheck(option = {}, onSuccess = () => {}, onError = () => {}) {
    if (option.displayServerStatus == null) option.displayServerStatus = false;

    this.settings((data) => {
      $.ajax({
        method: 'get',
        url: `${data.settings.serverUrl}/api/v1/health-check`,
        success: () => {
          if (option.displayServerStatus) {
            // toastr.success(`${data.settings.serverUrl} is ready!`);
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

  isFshareLink(url) {
    return /^https:\/\/.*fshare.vn\/(file|folder)\//.test(url);
  }

  isFshareFileLink(url) {
    return /https:\/\/.*fshare.vn\/file\//.test(url);
  }

  isFshareFolderLink(url) {
    return /https:\/\/.*fshare.vn\/folder\//.test(url);
  }

  currentFshareLinkCode() {
    return this.fshareLinkCode(location.href);
  }

  fshareFileUrlFromCode(code) {
    return `https://www.fshare.vn/file/${code}`;
  }

  fshareLinkCode(url) {
    const regexMatched = url.match(/fshare.vn\/(file|folder)\/(\w+|\d+)/);

    return regexMatched && regexMatched.length > 1 ? regexMatched[2] : '';
  }
}
