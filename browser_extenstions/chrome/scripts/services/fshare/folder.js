class FshareFolder extends Fshare {
  // Class methods
  static attachActions() {
    const fshareFolder = new FshareFolder();
    fshareFolder.attachActions();
  }

  attachActions() {
    if (!this.isFshareFolder()) return;
    console.log('[Fshare Tool] Fshare Folder is processing ...');

    this.healthCheck((data) => {
      this.addFolderTab();

      const mainTree = this.initializeTree((tree) => {
        this.fetchFshareFolder(this.currentFshareLinkCode(), 1, tree, null, (data) => {
          tree.removeRow(0);
          this.setData('currentPage', data.meta.current_page);
          this.setData('totalPage', data.meta.total_page);
        });
      });

      this.onClick(mainTree);
      this.onDoubleClick(mainTree);
      this.onExpand(mainTree);
      this.onScrollEnd(mainTree);
    });
  }

  // PRIVATE

  initializeTree(onCompleted = () => {}) {
    const tree = new tui.Grid({
      el: document.getElementById('fshare_tool_link_processed'),
      data: [{}],
      bodyHeight: 500,
      selectionUnit: 'row',
      heightResizable: true,
      contextMenu: ({ rowKey }) => this.contextMenu(tree, rowKey),
      treeColumnOptions: {
        name: 'name',
      },
      columns: [
        {
          header: 'Name',
          name: 'name',
          minWidth: 600,
          resizable: true,
        },
        {
          header: 'Size',
          name: 'size',
          width: 100,
          align: 'center',
        },
        {
          header: 'Code',
          name: 'linkcode',
          width: 150,
          editor: {
            type: 'text',
          },
        },
        {
          align: 'center',
          header: 'Modified',
          name: 'modified',
          width: 150,
        },
        {
          header: 'Actions',
          width: 280,
          formatter: this.cellActionsBuilder,
        },
      ],
    });

    // Callback completed
    onCompleted(tree);

    return tree;
  }

  onClick(tree) {
    let rowClickTimer = null;
    tree.on('click', (ev) => {
      clearTimeout(rowClickTimer);
      rowClickTimer = setTimeout(() => {
        console.log('[GRID][EVENT] click');
        const { rowKey } = ev;
        if (!rowKey) return;

        const { type } = tree.getRow(rowKey);
        switch (type) {
          case 'folder':
            tree.expand(rowKey);
            break;
          default:
            break;
        }
      }, 200);
    });
  }

  onDoubleClick(tree) {
    tree.on('dblclick', (ev) => {
      console.log('[GRID][EVENT] dblclick');
      const { rowKey } = ev;
      if (!rowKey) return;

      const { type, linkcode } = tree.getRow(rowKey);
      switch (type) {
        case 'folder':
          tree.expand(rowKey);
          break;
        case 'video':
          FshareFile.openInVlc(linkcode);
          break;
        case 'subtitle':
          FshareFile.openInVlc(linkcode);
          break;
        default:
          FshareFile.download(linkcode);
          break;
      }
    });
  }

  onExpand(tree) {
    tree.on('expand', (ev) => {
      console.log('[GRID][EVENT] expand');
      const { rowKey } = ev;
      const descendantRows = tree.getDescendantRows(rowKey);
      if (descendantRows.length > 0) return; // already has descendant rows

      const { linkcode } = tree.getRow(rowKey);
      this.fetchInfiniteFshareFolder(linkcode, 1, tree, rowKey);
    });
  }

  onScrollEnd(tree) {
    tree.on('scrollEnd', () => {
      console.log('[GRID][EVENT] scrollEnd');
      const currentPage = this.getData('currentPage');
      const totalPage = this.getData('totalPage');
      if (currentPage == null || totalPage == null) return;

      const nextPage = currentPage + 1;
      if (nextPage > totalPage) return;

      // Avoid duplicate request
      this.setData('currentPage', null);
      this.setData('totalPage', null);

      this.fetchFshareFolder(this.currentFshareLinkCode(), nextPage, tree, null, (data) => {
        this.setData('currentPage', data.meta.current_page);
        this.setData('totalPage', data.meta.total_page);
      });
    });
  }

  contextMenu(tree, rowKey) {
    const { linkcode, furl } = tree.getRow(rowKey);

    return [
      [
        {
          name: 'copyToClipboard',
          label: 'Copy Code to clipboard',
          action: () => {
            navigator.clipboard.writeText(linkcode);
            toastr.success(`Code ${linkcode} has been copied to clipboard`);
          },
        },
      ],
      [
        {
          name: 'open',
          label: 'Open in new tab',
          action: () => {
            window.open(furl);
          },
        },
        {
          name: 'download',
          label: 'Download',
          action: () => {
            FshareFile.download(linkcode);
          },
        },
        {
          name: 'play',
          label: 'Play in VLC',
          action: () => {
            FshareFile.openInVlc(linkcode);
          },
        },
      ],
    ];
  }

  fetchInfiniteFshareFolder(linkCode, page, tree, parentRowKey) {
    const mainFetcher = this.fetchFshareFolder(linkCode, page, tree, parentRowKey);

    return mainFetcher.then((data) => {
      if (data == null || data.meta == null) return;

      const currentPage = data.meta.current_page;
      const totalPage = data.meta.total_page;
      if (currentPage == null || totalPage == null) return;

      const nextPage = currentPage + 1;
      if (nextPage > totalPage) return;

      this.fetchInfiniteFshareFolder(linkCode, nextPage, tree, parentRowKey);
    });
  }

  fetchFshareFolder(linkCode, page, tree, parentRowKey, onCompleted = () => {}) {
    return this.fshareFolderApi(linkCode, page)
      .then((data) => {
        data.items.forEach((row) => {
          tree.appendRow(row, { parentRowKey: parentRowKey });
        });

        return data;
      })
      .then(onCompleted);
  }

  fshareFolderApi(linkCode, page) {
    console.log(`[Fshare Tool] Fetching folder ${linkCode} page ${page}`);

    const self = this;
    return new Promise(function (resolve, reject) {
      self.settings((settings) => {
        const url = `${settings.settings.serverUrl}/api/v1/fshare/${linkCode}/list_v3`;

        $.ajax({
          method: 'get',
          async: false,
          cache: false,
          url: url,
          data: {
            page: page,
            per_page: 50,
          },
          success: function (data) {
            resolve(data);
          },
          error: function () {
            reject();
          },
        });
      });
    });
  }

  addFolderTab() {
    const html = `
      <div id="fshare-tool-hooker">
        <ul class="nav nav-tabs" id="navigation" role="tablist">
          <li class="nav-item" role="presentation" >
            <a class="nav-link active" id="processed-tab" href="javascript:;" data-toggle="tab" data-tab="#processed">Processed</a>
          </li>
          <li class="nav-item" role="presentation" >
            <a class="nav-link" id="original-tab" href="javascript:;" data-toggle="tab" data-tab="#original">Original</a>
          </li>
        </ul>
        <div id="main-content">
          <div id="fshare_tool_link_processed"></div>
        </div>
      </div>
      `;

    $('.download-file').prepend(html);
    $('.download-file folder').hide();
    $('html, body').css('overflow', 'hidden');

    $('#fshare-tool-hooker a[data-toggle="tab"]').on('click', function (event) {
      switch ($(event.target).data('tab')) {
        case '#processed':
          $('#fshare-tool-hooker #main-content').show();
          $('.download-file folder').hide();
          $('html, body').css('overflow', 'hidden');
          break;
        case '#original':
          $('#fshare-tool-hooker #main-content').hide();
          $('.download-file folder').show();
          $('html, body').css('overflow', 'auto');
          break;
      }
    });

    return $(html);
  }

  cellActionsBuilder(data) {
    const { furl, type } = data.row;
    let actions = [`<li class="fshare-action open" data-fshare-link='${furl}'>Open</li>`];

    if (type !== 'folder') {
      actions.push(`<li class="fshare-action download" data-fshare-link='${furl}'>Download</li>`);
    }

    if (type == 'video') {
      actions.push(`<li class="fshare-action play-in-vlc play" data-fshare-link='${furl}'>Play in VLC</li>`);
    }

    if (type == 'subtitle') {
      actions.push(`<li class="fshare-action add-to-vlc play" data-fshare-link='${furl}'>Add to VLC</li>`);
    }

    return `
      <div class="folder-action">
        <ul>
          ${actions.join('')}
        </ul>
      </div>
    `;
  }

  getData(key) {
    return $('#fshare_tool_link_processed').data(key);
  }

  setData(key, value) {
    $('#fshare_tool_link_processed').data(key, value);
  }
}
