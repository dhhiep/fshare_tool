chrome.storage.sync.get(['settings'], (data) => {
  const settings = data.settings;
  console.log('[Fshare Tool] Settings:', settings);

  // Restore current settings to form elements
  for (const [key, value] of Object.entries(settings)) {
    $(`form.settings [key=${key}]`).val(value);
  }
});

$('form.settings').submit(function (e) {
  e.preventDefault();

  const formData = buildFormData($(this));
  console.log('[Fshare Tool] Form Data:', formData);

  chrome.storage.sync.set({ settings: formData });
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
