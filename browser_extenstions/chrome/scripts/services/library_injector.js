const libraryInjector = () => {
  const libs = [
    {
      path: 'scripts/vendor/jquery.min.js',
      disabled: () => $.fn && $.fn.jquery.length > 0, // JQuery is installed
      matches: [],
      onload: () => {},
    },
    {
      path: 'scripts/vendor/toastr.min.js',
      disabled: () => false,
      matches: [],
      onload: () => {},
    },
    {
      path: 'scripts/vendor/jquery.modal.min.js',
      disabled: () => false,
      matches: [/https:\/\/.*fshare.vn\/file\//],
      onload: () => {},
    },
    {
      path: 'scripts/vendor/tui-grid.js',
      disabled: () => false,
      matches: [/https:\/\/.*fshare.vn\/folder\//],
      onload: () => {},
    },
    {
      path: 'scripts/services/fshare.js',
      disabled: () => false,
      matches: [],
      onload: () => {
        Fshare.bindingFshareActions();
      },
    },
    {
      path: 'scripts/services/fshare/file.js',
      disabled: () => false,
      matches: [],
      onload: () => {
        $(document).ready(() => {
          setTimeout(function () {
            FshareFile.attachActions();
          }, 500);
        });
      },
    },
    {
      path: 'scripts/services/fshare/folder.js',
      disabled: () => false,
      matches: [/https:\/\/.*fshare.vn\/folder\//],
      onload: () => {
        $(document).ready(() => {
          setTimeout(function () {
            FshareFolder.attachActions();
          }, 500);
        });
      },
    },
  ];

  libs.forEach((lib) => {
    if (lib.disabled()) return;

    let scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL(lib.path);
    scriptTag.onload = lib.onload;

    const currentDomainMatched = lib.matches.filter((regex) => regex.test(location.href));
    if (lib.matches.length > 0 && currentDomainMatched.length == 0) return;

    // Avoid error undefined appendChild
    document;
    (document.head || document.documentElement).appendChild(scriptTag);

    console.log('Library', lib.path, 'was injected!');
  });
};
