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
    console.log('Downloading for ID', fileId);

    this.settings((data) => {
      $.ajax({
        method: 'get',
        url: `${data.settings.serverUrl}/api/v1/fshare/${fileId}/download`,
        success: function (data) {
          window.open(data.location.replace('http://', 'https://'));
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

      const isAsALink = this.isFshareFileLink($.trim(element.attr('href')));
      const isAsAText = this.isFshareFileLink($.trim(element.html()));

      if (isAsALink || isAsAText) {
        totalFshareLinkCounter++;
        const fshareLink = isAsALink ? $.trim(element.attr('href')) : $.trim(element.html());

        // Prevent link redirect
        element.click((event) => event.preventDefault());

        element.popover({
          delay: 100,
          placement: 'top',
          trigger: 'hover',
          autoPlace: true,
          content: this.popoverContent(fshareLink).join(' '),
        });

        element.on('shown.bs.popover', () => {
          setTimeout(() => element.popover('hide'), 2000);
        });
      }
    });

    if (totalFshareLinkCounter > 0) {
      toastr.success(`Scan Fshare Link is finished. Total Fshare Links: ${totalFshareLinkCounter}`);
    }
  }

  popoverContent(fshareLink) {
    const links = fshareLink.split('\n');
    const linkDescriptionClass = links.length <= 1 ? 'hide' : '';

    return $.map(links, (link) => {
      return `
        <div class='fshare-popover-wrapper'>
          <span class='link-description ${linkDescriptionClass}'>#${this.fshareLinkCode(link)} - </span>
          <a class='fshare-popover-btn open' data-fshare-link='${link}'>Open</span>
          <a class='fshare-popover-btn fshare-popover-action play' data-fshare-link='${link}'>Play</a>
          <a class='fshare-popover-btn fshare-popover-action download' data-fshare-link='${link}'>Download</a>
        </div>
      `;
    });
  }
}
