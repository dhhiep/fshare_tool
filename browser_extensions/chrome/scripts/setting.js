chrome.storage.sync.get(['settings'], (data) => {
  const settings = data.settings;
  console.log('[Fshare Tool] Settings:', settings);

  // Restore current settings to form elements
  for (const [key, value] of Object.entries(settings)) {
    $(`form#setting [key=${key}]`).val(value);
  }
});

$('form#setting').on('submit', (e) => {
  e.preventDefault();

  const formData = buildFormData(e.target);
  console.log('[Fshare Tool] Form Data:', formData);

  getLocalIp().then((localIP) => {
    formData.serverLANUrl = formData.serverUrl.replace(/localhost|127\.0\.0\.1/, localIP);

    chrome.storage.sync.set({ settings: formData });

    $('form#setting #form-alert').show();
    $('form#setting #form-alert .alert-title').text('Setting has been saved!');
    $('form#setting #form-alert .text-muted').html(`<hr><pre>${JSON.stringify(formData, null, 2)}</pre>`);
  });
});

$('#view-playbacks').on('click', (e) => {
  e.preventDefault();
  chrome.storage.sync.get(['settings'], (data) => {
    const settings = data.settings;
    console.log('[Fshare Tool] Settings:', settings);
    chrome.windows.create({ url: `${settings.serverUrl}/playbacks`, type: 'popup' });
  });
});

$('#view-activities').on('click', (e) => {
  e.preventDefault();
  chrome.storage.sync.get(['settings'], (data) => {
    const settings = data.settings;
    console.log('[Fshare Tool] Settings:', settings);
    chrome.windows.create({ url: settings.serverUrl, type: 'popup' });
  });
});

$('#view-transfers').on('click', (e) => {
  e.preventDefault();
  chrome.storage.sync.get(['settings'], (data) => {
    const settings = data.settings;
    console.log('[Fshare Tool] Settings:', settings);
    chrome.windows.create({ url: `${settings.serverUrl}/transfers`, type: 'popup' });
  });
});

// PRIVATE

const buildFormData = (form) => {
  return $(form)
    .serializeArray()
    .reduce((obj, item) => {
      obj[camelize(item.name.replace(/_|-/gi, ' '))] = item.value;

      return obj;
    }, {});
};

const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

const getLocalIp = () => {
  return new Promise((resolve, reject) => {
    window.RTCPeerConnection =
      window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for Firefox and chrome
    const pc = new RTCPeerConnection({ iceServers: [] }),
      noop = function () {};
    pc.createDataChannel(''); //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
    pc.onicecandidate = function (ice) {
      if (ice && ice.candidate && ice.candidate.candidate) {
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
        resolve(myIP);
        pc.onicecandidate = noop;
      }
    };
  });
};
