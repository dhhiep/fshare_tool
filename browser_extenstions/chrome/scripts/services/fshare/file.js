class FshareFile extends Fshare {
  // Class methods
  static attachActions() {
    const fshareFile = new FshareFile();
    fshareFile.attachActions();
  }

  static download(fileId) {
    const fshareFile = new FshareFile();
    fshareFile.download(fileId);
  }

  static directLink(fileId) {
    const fshareFile = new FshareFile();
    return fshareFile.directLink(fileId);
  }

  static openInVlc(fileId) {
    const fshareFile = new FshareFile();
    fshareFile.openInVlc(fileId);
  }

  static scanFshareLink() {
    const fshareFile = new FshareFile();
    fshareFile.scanFshareLink();
  }

  // Instances methods
  attachActions() {
    if (this.isFshareFolder()) return;

    if (this.isFshare()) {
      this.healthCheck({}, () => {
        this.attachFshareLinkPopup();
      });
      console.log('[Fshare Tool] Fshare File is processing ...');
    } else {
      console.log('[Fshare Tool] Scan Fshare link for non-fshare page');
      this.healthCheck({ displayServerStatus: false }, () => {
        this.scanFshareLink();
      });
    }
  }

  download(fileId) {
    this.directLink(fileId).then((link) => {
      console.log('Downloading for ID', fileId);

      window.open(link);
    });
  }

  directLink(fileId) {
    console.log('Get direct link for ID', fileId);
    const self = this;

    return new Promise(function (resolve, reject) {
      self.settings((data) => {
        $.ajax({
          method: 'get',
          url: `${data.settings.serverUrl}/api/v1/fshare/${fileId}/direct-link`,
          success: function (data) {
            resolve(data.location.replace('http://', 'https://'));
          },
          error: (data) => {
            if (data.statusText == 'error') {
              this.healthCheck();
            } else {
              toastr.error(data.responseText);
            }
          },
        });
      });
    });
  }

  openInVlc(fileId) {
    console.log('Opening VLC for ID', fileId);

    this.settings((data) => {
      $.ajax({
        method: 'get',
        url: `${data.settings.serverUrl}/api/v1/fshare/${fileId}/play`,
        success: () => {
          toastr.success('VLC is opening ...');
        },
        error: (data) => {
          if (data.statusText == 'error') {
            this.healthCheck();
          } else {
            toastr.error(data.responseText);
          }
        },
      });
    });
  }

  attachFshareLinkPopup() {
    const html = `
        <div id="fshare-file-actions" class="modal">
          <ul>
            <li class="fshare-action download" data-fshare-link="${window.location.href}">Download</li>
            <li class="fshare-action play" data-fshare-link="${window.location.href}">Play in VLC</li>
            <li class="fshare-action copy-direct-link" data-fshare-link="${window.location.href}">Copy Direct Link</li>
          </ul>
        </div>
      `;

    $('body').append(html);
    $('#fshare-file-actions').modal();
  }

  scanFshareLink() {
    const whiteListTag = `
      a, address, article, aside, b, base, button, caption,
      center,code, div, em, h1, h2, h3, h4, h5, h6,
      i, li, link, p, small, span, strong, td, pre
    `;
    let totalFshareLinkCounter = 0;

    $.each($(whiteListTag), (i, tag) => {
      const element = $(tag);

      const isAsALink = this.isFshareLink($.trim(element.attr('href')));
      const isAsAText = this.isFshareLink($.trim(element.html()));

      if (isAsALink || isAsAText) {
        totalFshareLinkCounter++;
        const fshareLink = isAsALink ? $.trim(element.attr('href')) : $.trim(element.html());

        // Prevent link redirect
        element.click((event) => event.preventDefault());

        element.xpopover({
          delay: 100,
          placement: 'top',
          trigger: 'hover',
          autoPlace: true,
          content: this.xpopoverContentFshareLink(fshareLink).join(' '),
        });

        element.on('shown.bs.xpopover', () => {
          setTimeout(() => element.xpopover('hide'), 2000);
        });
      }
    });

    this.settings((data) => {
      var tagTmp = document.createElement('a');
      tagTmp.href = data.settings.serverUrl;

      if (totalFshareLinkCounter > 0 && tagTmp.host !== location.host) {
        toastr.success(`Scan Fshare Link is finished. Total Fshare Links: ${totalFshareLinkCounter}`);
      }
    });
  }

  xpopoverContentFshareLink(fshareLink) {
    const links = fshareLink.split('\n');
    const linkDescriptionClass = links.length <= 1 ? 'hide' : '';

    return $.map(links, (link) => {
      const hideFshareFolderClass = this.isFshareFolderLink(link) ? 'hide' : '';

      return `
        <div class='fshare-xpopover-wrapper'>
          <span class='link-description ${linkDescriptionClass}'>#${this.fshareLinkCode(link)} - </span>
          <a class='fshare-xpopover-btn open' data-fshare-link='${link}'>Open</span>
          <a class='fshare-xpopover-btn fshare-xpopover-action play ${hideFshareFolderClass}' data-fshare-link='${link}'>Play</a>
          <a class='fshare-xpopover-btn fshare-xpopover-action download ${hideFshareFolderClass}' data-fshare-link='${link}'>Download</a>
          <a class='fshare-xpopover-btn fshare-xpopover-action copy-direct-link ${hideFshareFolderClass}' data-fshare-link='${link}'>Copy Direct Link</a>
        </div>
      `;
    });
  }
}
