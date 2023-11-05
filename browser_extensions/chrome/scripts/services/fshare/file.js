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

  static showTransferPopup(fileId) {
    const fshareFile = new FshareFile();
    fshareFile.showTransferPopup(fileId);
  }

  static transfer(fileId, remote, path, fileName) {
    const fshareFile = new FshareFile();
    fshareFile.transfer(fileId, remote, path, fileName);
  }

  static directLink(fileId) {
    const fshareFile = new FshareFile();
    return fshareFile.directLink(fileId);
  }

  static watch(fileId) {
    const fshareFile = new FshareFile();
    fshareFile.watch(fileId);
  }

  static scanFshareLink() {
    const fshareFile = new FshareFile();
    fshareFile.scanFshareLink();
  }

  // Instances methods
  attachActions() {
    if (this.isFshareFolder()) return;

    if (this.isFshare()) {
      if (this.isFshareFileLink(location.href)) {
        this.healthCheck({}, () => {
          this.attachFshareLinkPopup();
        });
        console.log('[Fshare Tool] Fshare File is processing ...');
      }
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

  transfer(fileId, remote, path, fileName) {
    const self = this;

    return new Promise(function (resolve, reject) {
      self.settings((data) => {
        $.ajax({
          method: 'post',
          data: {
            file_id: fileId,
            remote: remote,
            destination_path: path,
            file_name: fileName,
          },
          url: `${data.settings.serverUrl}/api/v1/fshare/transfer/file`,
          success: function (data) {
            $.modal.getCurrent().close();
            toastr.success(`File is transferring to [${remote}]:${path}/${fileName}`);

            resolve(data);
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

  remotes() {
    const self = this;
    return new Promise(function (resolve, reject) {
      self.settings((data) => {
        $.ajax({
          method: 'get',
          url: `${data.settings.serverUrl}/api/v1/rclone/remotes`,
          success: function (data) {
            resolve(data);
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

  watch(fileId) {
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
        <div id="fshare-file-actions-modal" class="popup-modal">
          <ul>
            <li class="action-download" data-fshare-link="${window.location.href}">Download</li>
            <li class="action-play" data-fshare-link="${window.location.href}">Watch</li>
            <li class="action-show-transfer-popup" data-fshare-link="${window.location.href}">Transfer</li>
            <li class="action-copy-direct-link" data-fshare-link="${window.location.href}">Copy Direct Link</li>
          </ul>
        </div>
      `;

    $('body').append(html);
    $('#fshare-file-actions-modal').modal();
  }

  showTransferPopup(fileId) {
    this.directLink(fileId).then((link) => {
      const fileNameParts = link.split('/');
      const fileName = decodeURIComponent(fileNameParts[fileNameParts.length - 1]).trim();

      this.remotes().then((remotes) => {
        const remoteOptions = remotes.map((remote) => {
          return `<option value="${remote}">${remote}</option>`;
        });

        const html = `
          <div id="transfer-form-modal" class="popup-modal">
            <p>
              <label for="transfer-remote">Remote:</label>
              <select id="transfer-remote" name="transfer-remote">
                <option value="">Please select a remote to transfer</option>
                ${remoteOptions.join('')}
              </select>
            </p>
            <div class="transfer-form-detail hidden">
              <p>
                <label for="transfer-file-name">File Name (Please enter a new file name for a custom name):</label>
                <input type="text" id="transfer-file-name" name="transfer-file-name" placeholder="File Name" value="${fileName}">
              </p>
              <p>
                <label for="transfer-path">Path (Please enter a new path for a custom path):</label>
                <input type="text" id="transfer-path" name="transfer-path" placeholder="Path">
              </p>
              <div id="rclone-remote-directories"></div>
              <hr/>
              <p class='full-path'>
                File Destination: <span />
              </p>
              <div class="actions">
                <button class="action-transfer action-transfer-file" data-fshare-link="${this.fshareFileUrlFromCode(
                  fileId
                )}">
                  Transfer
                </button>
              </div>
            </div>
          </div>
        `;

        $('body').append(html);
        $('#transfer-form-modal').modal();
        $('#transfer-form-modal').on($.modal.AFTER_CLOSE, function (event, modal) {
          $('#transfer-form-modal').remove();
        });

        $('#transfer-remote')
          .off('change')
          .on('change', () => {
            const remote = $('#transfer-remote').val();

            if (remote == null || remote == undefined || remote == '') {
              $('.transfer-form-detail').addClass('hidden');
            } else {
              $('.transfer-form-detail').removeClass('hidden');
              $('[name=transfer-path]').val('/');
              this.updateTransferPathAsText();

              DirectoryTree.initialize(remote, (path) => {
                $('[name=transfer-path]').val(path);
                this.updateTransferPathAsText();
              });
            }
          });

        $('[name=transfer-path], [name=transfer-file-name]').on('keydown', () => {
          this.updateTransferPathAsText();
        });

        $('[name=transfer-path], [name=transfer-file-name]').on('change', () => {
          this.updateTransferPathAsText();
        });
      });
    });
  }

  transferPath() {
    const remote = $('[name=transfer-remote]');
    const path = $('[name=transfer-path]');
    const fileName = $('[name=transfer-file-name]');

    if (path.val()[0] != '/') path.val(`/${path.val()}`);

    return {
      remote: remote.val(),
      path: path.val(),
      fileName: fileName.val(),
      fullPath: [path.val(), fileName.val()].join('/').replace(/\/+/g, '/'),
    };
  }

  updateTransferPathAsText() {
    const transferPath = this.transferPath();
    $('.full-path span').html(
      `<strong style='color: red;'>[${transferPath.remote}]</strong>:<span style='color: blue;'>${transferPath.fullPath}</span>`
    );

    $('.action-transfer-file').data('remote', transferPath.remote);
    $('.action-transfer-file').data('path', transferPath.path);
    $('.action-transfer-file').data('fileName', transferPath.fileName);
    $('.action-transfer-file').data('fullPath', transferPath.fullPath);
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
        element.on('click', (event) => event.preventDefault());
        element.fshareToolPopover({
          delay: 100,
          placement: 'top',
          trigger: 'hover',
          autoPlace: true,
          content: this.fshareToolPopoverContentFshareLink(fshareLink).join(' '),
        });

        element.on('shown.bs.fshare-tool-popover', () => {
          setTimeout(() => element.fshare - tool - popover('hide'), 2000);
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

  fshareToolPopoverContentFshareLink(fshareLink) {
    const links = fshareLink.split('\n');
    const linkDescriptionClass = links.length <= 1 ? 'hide' : '';

    return $.map(links, (link) => {
      const hideFshareFolderClass = this.isFshareFolderLink(link) ? 'hide' : '';

      return `
        <div class='fshare-fshare-tool-popover-wrapper'>
          <span class='link-description ${linkDescriptionClass}'>#${this.fshareLinkCode(link)} - </span>
          <a class='fshare-fshare-tool-popover-btn action-open' data-fshare-link='${link}'>Open</span>
          <a class='fshare-fshare-tool-popover-btn fshare-fshare-tool-popover-action action-play ${hideFshareFolderClass}' data-fshare-link='${link}'>Play</a>
          <a class='fshare-fshare-tool-popover-btn fshare-fshare-tool-popover-action action-download ${hideFshareFolderClass}' data-fshare-link='${link}'>Download</a>
          <a class='fshare-fshare-tool-popover-btn fshare-fshare-tool-popover-action action-show-transfer-popup ${hideFshareFolderClass}' data-fshare-link='${link}'>Transfer</a>
          <a class='fshare-fshare-tool-popover-btn fshare-fshare-tool-popover-action action-copy-direct-link ${hideFshareFolderClass}' data-fshare-link='${link}'>Copy Direct Link</a>
        </div>
      `;
    });
  }
}
