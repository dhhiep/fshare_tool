const libraryInjector = () => {
  const libs = [
    {
      path: 'scripts/vendor/jquery.min.js',
      onload: () => {},
    },
    {
      path: 'scripts/vendor/bootstrap.bundle.min.js',
      onload: () => {},
    },
    {
      path: 'scripts/vendor/toastr.min.js',
      onload: () => {
        setTimeout(function () {
          Fshare.attachActions();
        }, 3000);
      },
    },
    {
      path: 'scripts/vendor/datatables.min.js',
      onload: () => {},
    },
    {
      path: 'scripts/vendor/dataTables.scroller.min.js',
      onload: () => {},
    },
    {
      path: 'scripts/services/fshare.js',
      onload: () => {},
    },
  ];

  libs.forEach((lib) => {
    let scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL(lib.path);
    scriptTag.onload = lib.onload;

    // Avoid error undefined appendChild
    document;

    (document.head || document.documentElement).appendChild(scriptTag);
  });
};
