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

        if (element.hasClass('copy-direct-link')) {
          FshareFile.directLink(fshareLinkCode).then((link) => {
            navigator.clipboard.writeText(link);
            const fileName = link.split('/').pop();
            toastr.success(`Direct Link ${fileName} has been copied to clipboard`);
          });
        }

        if (element.hasClass('share-lan-link')) {
          console.log('share-lan-link', fshareLinkCode);
          FshareFile.lanLink(fshareLinkCode).then((link) => {
            console.log('lanLink', link);
            navigator.clipboard.writeText(link);
            toastr.success(`LAN Link ${link} has been copied to clipboard`);
          });
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
        url: `${data.settings.serverUrl}/api/v1/health-check`,
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

  isFshareLink(url) {
    return /^https:\/\/.*fshare.vn\/(file|folder)\//.test(url);
  }

  isFshareFolderLink(url) {
    return /https:\/\/.*fshare.vn\/folder\//.test(url);
  }

  currentFshareLinkCode() {
    return this.fshareLinkCode(location.href);
  }

  fshareLinkCode(url) {
    const regexMatched = url.match(/fshare.vn\/(file|folder)\/(\w+|\d+)/);

    return regexMatched && regexMatched.length > 1 ? regexMatched[2] : '';
  }
}
