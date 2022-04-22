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
      this.healthCheck();
      console.log('[Fshare Tool] Fshare File is processing ...');
    } else {
      console.log('[Fshare Tool] Scan Fshare link for non-fshare page');
      this.scanFshareLink();
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

  scanFshareLink() {
    const whiteListTag = `
      a, address, article, aside, b, base, button, caption,
      center,code, div, em, h1, h2, h3, h4, h5, h6,
      i, li, link, p, small, span, strong, td
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
          content: `
            <a class='fshare-popover-btn open' data-fshare-link='${fshareLink}'>Open</span>
            <a class='fshare-popover-btn fshare-popover-action play' data-fshare-link='${fshareLink}'>Play</a>
            <a class='fshare-popover-btn fshare-popover-action download' data-fshare-link='${fshareLink}'>Download</a>
          `,
        });

        element.on('shown.bs.popover', () => {
          setTimeout(() => element.popover('hide'), 2000);
        });
      }
    });

    console.log(`Scan Fshare Link is finished. Total Fshare Links: ${totalFshareLinkCounter}`);
  }
}
