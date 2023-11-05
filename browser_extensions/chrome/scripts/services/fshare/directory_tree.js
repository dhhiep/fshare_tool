class DirectoryTree extends Fshare {
  remote = '';

  // Class methods
  static initialize(remote, onSelected) {
    const fshareFolder = new DirectoryTree();
    fshareFolder.initialize(remote, onSelected);
  }

  initialize(remote, onSelected) {
    if (remote == undefined || remote == null || remote == '') return;

    this.remote = remote;
    this.healthCheck({}, (data) => {
      const mainTree = this.initializeTree((tree) => {
        this.fetchRcloneDirectories('', tree, null, (data) => {
          tree.removeRow(0);
        });
      });

      this.onClick(mainTree, onSelected);
      this.onDoubleClick(mainTree);
      this.onExpand(mainTree);
    });
  }

  // PRIVATE
  initializeTree(onCompleted = () => {}) {
    const rcloneDirectoriesElement = document.getElementById('rclone-remote-directories');
    if (!rcloneDirectoriesElement) return;

    rcloneDirectoriesElement.innerHTML = '';
    const tree = new tui.Grid({
      el: rcloneDirectoriesElement,
      data: [{}],
      bodyHeight: 350,
      selectionUnit: 'row',
      escapeClose: false,
      heightResizable: true,
      contextMenu: ({ rowKey }) => this.contextMenu(tree, rowKey),
      treeColumnOptions: {
        name: 'name',
      },
      header: {
        align: 'left',
      },
      columns: [
        {
          header: 'Remote Path',
          name: 'name',
        },
      ],
    });

    // Callback completed
    onCompleted(tree);

    return tree;
  }

  onClick(tree, onSelected) {
    let rowClickTimer = null;
    tree.on('click', (ev) => {
      clearTimeout(rowClickTimer);
      rowClickTimer = setTimeout(() => {
        console.log('[GRID][EVENT] click');
        const { rowKey } = ev;
        if (!rowKey) return;

        const { path } = tree.getRow(rowKey);

        console.log('xpath', path);
        onSelected(path);
      }, 200);
    });
  }

  onDoubleClick(tree) {
    tree.on('dblclick', (ev) => {
      console.log('[GRID][EVENT] dblclick');
      const { rowKey } = ev;
      if (!rowKey) return;

      tree.expand(rowKey);
    });
  }

  onExpand(tree) {
    tree.on('expand', (ev) => {
      console.log('[GRID][EVENT] expand');
      const { rowKey } = ev;
      const descendantRows = tree.getDescendantRows(rowKey);
      if (descendantRows.length > 0) return; // already has descendant rows

      const { path } = tree.getRow(rowKey);
      this.fetchRcloneDirectories(path, tree, rowKey);
    });
  }

  contextMenu(tree, rowKey) {
    const { linkcode, furl, name } = tree.getRow(rowKey);

    return [[]];
  }

  fetchRcloneDirectories(destination_path, tree, parentRowKey, onCompleted = () => {}) {
    return this.fetchRcloneDirectoriesApi(destination_path)
      .then((data) => {
        data.forEach((row) => {
          row.is_folder = true;
          row._children = [];
          row.type = 'folder';

          tree.appendRow(row, { parentRowKey: parentRowKey });
        });

        return data;
      })
      .then(onCompleted);
  }

  fetchRcloneDirectoriesApi(destination_path) {
    const self = this;
    return new Promise(function (resolve, reject) {
      self.settings((settings) => {
        const url = `${settings.settings.serverUrl}/api/v1/rclone/directories`;

        $.ajax({
          method: 'get',
          async: false,
          cache: false,
          url: url,
          data: {
            remote: self.remote,
            destination_path: destination_path,
          },
          success: function (data) {
            resolve(data);
          },
          error: function (data) {
            toastr.error(data.responseText);
            reject();
          },
        });
      });
    });
  }
}
