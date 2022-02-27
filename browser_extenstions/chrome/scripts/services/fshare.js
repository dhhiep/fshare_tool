class Fshare {
  constructor() {}

  // Class methods
  static attachActions() {
    if (this.#isFshareFolder()) {
      this.#healthCheck();
      console.log('[Fshare Tool] Fshare Folder is processing ...');

      // this.#folderFetchData(1);
      // this.#folderFormatter();
      // this.#folderActionBar();
      this.#addFolderTab();

      // $('#').DataTable({
      //   ajax: 'http://127.0.0.1:7777/api/v1/fshare/data',
      //   columns: [
      //     { data: 'name' },
      //     { data: 'position' },
      //     { data: 'office' },
      //     { data: 'extn' },
      //     { data: 'start_date' },
      //     { data: 'salary' },
      //   ],
      //   serverSide: true,
      //   ordering: false,
      //   searching: false,
      // });

      $('#fshare_tool_link_processed').DataTable({
        serverSide: true,
        ordering: false,
        searching: false,
        ajax: 'http://127.0.0.1:7777/api/v1/fshare/data',
        columns: [
          { data: 'name' },
          { data: 'position' },
          { data: 'office' },
          { data: 'extn' },
          { data: 'start_date' },
          { data: 'salary' },
        ],
        // ajax: function (data, callback, _settings) {
        //   var out = [];

        //   for (var i = data.start, ien = data.start + data.length; i < ien; i++) {
        //     out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5']);
        //   }

        //   setTimeout(function () {
        //     callback({
        //       draw: data.draw,
        //       data: out,
        //       recordsTotal: 5000000,
        //       recordsFiltered: 5000000,
        //     });
        //   }, 50);
        // },
        dom: 'rtiS',
        scrollY: 800,
        scroller: {
          loadingIndicator: true,
        },
      });
    } else if (this.#isFshare()) {
      this.#healthCheck();
      console.log('[Fshare Tool] Fshare File is processing ...');
    } else {
      console.log('[Fshare Tool] Scan Fshare link for non-fshare page');
      this.scanFshareLink();
    }
  }

  static download(fileId) {
    console.log('Downloading for ID', fileId);

    this_.#settings((data) => {
      $.ajax({
        method: 'get',
        url: `${data.settings.serverUrl}/api/v1/fshare/${fileId}/download`,
        success: function (data) {
          window.open(data.location.replace('http://', 'https://'));
        },
        error: (data) => {
          if (data.statusText == 'error') {
            this.#healthCheck();
          } else {
            toastr.error(data.responseText);
          }
        },
      });
    });
  }

  static openInVlc(fileId) {
    console.log('Opening VLC for ID', fileId);

    this.#settings((data) => {
      $.ajax({
        method: 'get',
        url: `${data.settings.serverUrl}/api/v1/fshare/${fileId}/play`,
        success: () => {
          toastr.success('VLC is opening ...');
        },
        error: (data) => {
          if (data.statusText == 'error') {
            this.#healthCheck();
          } else {
            toastr.error(data.responseText);
          }
        },
      });
    });
  }

  static scanFshareLink() {
    const whiteListTag = `
      a, address, article, aside, b, base, button, caption,
      center,code, div, em, h1, h2, h3, h4, h5, h6,
      i, li, link, p, small, span, strong, td
    `;
    let totalFshareLinkCounter = 0;

    $.each($(whiteListTag), (i, tag) => {
      const element = $(tag);

      const isAsALink = this.#isFshareFileLink($.trim(element.attr('href')));
      const isAsAText = this.#isFshareFileLink($.trim(element.html()));

      if (isAsALink || isAsAText) {
        totalFshareLinkCounter++;

        const fshareLink = isAsALink ? $.trim(element.attr('href')) : $.trim(element.html());
        const fshareLinkId = this.#fshareLinkId(fshareLink);

        // Prevent link redirect
        element.click(function (event) {
          event.preventDefault();
        });

        element.popover({
          delay: 100,
          placement: 'top',
          trigger: 'hover',
          autoPlace: true,
          content: `
            <a class='fshare-popover-btn play fshare-popover-action play' href='${fshareLinkId}'>Play</a>
            <a class='fshare-popover-btn download fshare-popover-action download' href='${fshareLinkId}'>Download</a>
            <a class='fshare-popover-btn open' target='_blank' href='${fshareLink}'>Open</span>
          `,
        });

        element.on('shown.bs.popover', () => {
          setTimeout(() => element.popover('hide'), 2000);
        });
      }
    });

    $(document)
      .off('click', '.fshare-popover-action')
      .on('click', '.fshare-popover-action', function (event) {
        event.preventDefault();

        const action = $(event.target);

        if (action.hasClass('play')) {
          Fshare.openInVlc(action.attr('href'));
        }

        if (action.hasClass('download')) {
          Fshare.download(action.attr('href'));
        }
      });

    console.log(`Scan Fshare Link is finished. Total Fshare Links: ${totalFshareLinkCounter}`);
  }

  // PRIVATE
  static #settings(callback) {
    return chrome.storage.sync.get(['settings'], (data) => callback(data));
  }

  static #healthCheck() {
    this.#settings((data) => {
      $.ajax({
        method: 'get',
        url: data.settings.serverUrl,
        success: () => {
          toastr.success(`${data.settings.serverUrl} is ready!`);
        },
        error: () => {
          toastr.warning(`${data.settings.serverUrl} isn't ready!`);
        },
      });
    });
  }

  static #folderFormatter() {
    $.each($('.detail-name'), (idx, item) => {
      // Remove sub tag
      $(item).find('.detail-name__modified, .detail-name__size').remove();

      const textFormatted = $(item).text().replace(/\n/gi, '').trim();
      $(item).text(textFormatted);
    });
  }

  static #folderActionBar() {
    $.each($('.detail-name'), (idx, item) => {
      const itemRow = $(item).parents('fshare-file');
      itemRow.addClass('folder-item-row');

      // Add actions
      if (itemRow.find('.folder-action').length <= 0) {
        const itemName = $(item).text();
        itemRow.append(this.#buildActionBar(itemName));
      }
    });
  }

  static #folderFetchData(page) {
    console.log('[Fshare Tool] Fetching page', page);

    this.#settings((data) => {
      console.log(`[Fshare Tool] ${settings.serverUrl}/api/v1/fshare/${fshareFolderId}/list`);

      $.ajax({
        method: 'get',
        async: false,
        cache: false,
        url: `${settings.serverUrl}/api/v1/fshare/${fshareFolderId}/list`,
        data: {
          page: page,
          per_page: 60,
        },
        success: function (data) {},
      });
    });
  }

  static #buildActionBar(fileName) {
    const html = `
        <div class="folder-action">
          <ul>
            <li class="open-in-vlc" fileName="${fileName}" onclick="Fshare.openInVlc('${fileName}')">Open in VLC</li>
            <li class="download" fileName="${fileName}" onclick="Fshare.download('${fileName}')">Download</li>
          </ul>
        </div>
      `;

    return $(html);
  }

  static #addFolderTab() {
    const html = `
      <div id="fshare-tool-hooker">
        <ul class="nav nav-tabs" id="navigation" role="tablist">
          <li class="nav-item" role="presentation" >
            <a class="nav-link active" id="processed-tab" data-toggle="tab" href="#processed" role="tab" aria-controls="processed" aria-selected="true">Processed</a>
          </li>
          <li class="nav-item" role="presentation" >
            <a class="nav-link" id="original-tab" data-toggle="tab" href="#original" role="tab" aria-controls="original" aria-selected="false">Original</a>
          </li>
        </ul>
        <div id="main-content">
          <table id="fshare_tool_link_processed" class="display" style="width:100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Extn.</th>
                <th>Salary</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      `;

    $('.download-file').prepend(html);
    $('.download-file folder').hide();

    $('#fshare-tool-hooker a[data-toggle="tab"]').on('click', function (event) {
      switch ($(event.target).attr('href')) {
        case '#processed':
          $('#fshare-tool-hooker #main-content').show();
          $('.download-file folder').hide();
          break;
        case '#original':
          $('#fshare-tool-hooker #main-content').hide();
          $('.download-file folder').show();
          break;
      }
    });

    return $(html);
  }

  static #isFshare() {
    return /https:\/\/.*fshare.vn/.test(location.href);
  }

  static #isFshareFolder() {
    return /https:\/\/.*fshare.vn\/folder\//.test(location.href);
  }

  static #isFshareFileLink(url) {
    return /^https:\/\/.*fshare.vn\/file\//.test(url);
  }

  static #fshareFolderId() {
    return location.href.match(/fshare.vn\/folder\/(\w+|\d+)/)[1];
  }

  static #fshareLinkId(url) {
    return url.match(/fshare.vn\/file\/(\w+|\d+)/)[1];
  }
}
