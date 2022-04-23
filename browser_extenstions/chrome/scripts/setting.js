chrome.storage.sync.get(['settings'], (data) => {
  const settings = data.settings;
  console.log('[Fshare Tool] Settings:', settings);

  // Restore current settings to form elements
  for (const [key, value] of Object.entries(settings)) {
    $(`form#setting [key=${key}]`).val(value);
  }
});

$('form#setting').submit((e) => {
  e.preventDefault();

  const formData = buildFormData(e.target);
  console.log('[Fshare Tool] Form Data:', formData);

  chrome.storage.sync.set({ settings: formData });
  $('form#setting #form-alert').show();
  $('form#setting #form-alert .alert-title').text('Setting has been saved!');
  $('form#setting #form-alert .text-muted').html(`<hr><pre>${JSON.stringify(formData, null, 2)}</pre>`);
});

$('#view-activities').click((e) => {
  e.preventDefault();
  chrome.storage.sync.get(['settings'], (data) => {
    const settings = data.settings;
    console.log('[Fshare Tool] Settings:', settings);
    chrome.windows.create({ url: settings.serverUrl, type: 'popup' });
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

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}
