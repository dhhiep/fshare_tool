const libraryInjector = () => {
  const libs = [
    {
      path: 'scripts/vendor/jquery.min.js',
      matches: [],
      onload: () => {},
    },
    {
      path: 'scripts/vendor/bootstrap.bundle.min.js',
      matches: [/https:\/\/.*fshare.vn\/folder\//],
      onload: () => {},
    },
    {
      path: 'scripts/vendor/toastr.min.js',
      matches: [],
      onload: () => {
        setTimeout(function () {
          Fshare.attachActions();
        }, 3000);
      },
    },
    {
      path: 'scripts/vendor/datatables.min.js',
      matches: [/https:\/\/.*fshare.vn\/folder\//],
      onload: () => {},
    },
    {
      path: 'scripts/vendor/dataTables.scroller.min.js',
      matches: [/https:\/\/.*fshare.vn\/folder\//],
      onload: () => {},
    },
    {
      path: 'scripts/services/fshare.js',
      matches: [],
      onload: () => {},
    },
  ];

  libs.forEach((lib) => {
    let scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL(lib.path);
    scriptTag.onload = lib.onload;

    const currentDomainMatched = lib.matches.filter((regex) => regex.test(location.href));
    if (lib.matches.length > 0 && currentDomainMatched.length == 0) return;

    // Avoid error undefined appendChild
    document;

    (document.head || document.documentElement).appendChild(scriptTag);
  });
};
