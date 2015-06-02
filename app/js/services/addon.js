/* global MozActivity */

/* global AddonGenerator */

const GENERATED_ADDON_COUNT_KEY = '__CUSTOMIZER__generatedAddonCount';

var AddonService = {};

AddonService.getGenerator = function(target) {
  return new Promise((resolve, reject) => {
    var number = parseInt(localStorage.getItem(GENERATED_ADDON_COUNT_KEY), 10) || 0;
    var name = window.prompt('Enter a name for this add-on', `Addon ${number + 1}`);
    if (!name) {
      reject();
      return;
    }

    var generator = new AddonGenerator({
      target: target,
      name: name
    });

    resolve(generator);
  });
};

AddonService.generate = function(target, callback) {
  if (typeof callback !== 'function') {
    return;
  }

  return AddonService.getGenerator(target)
    .then((generator) => {
      callback(generator);

      var addonBlob = new Blob([generator.generate()], { type: 'application/zip' });
      AddonService.install(addonBlob);
    });
};

AddonService.install = function(blob) {
  return new Promise((resolve, reject) => {
    var activity = new MozActivity({
      name: 'import-app',
      data: {
        blob: blob
      }
    });

    activity.onsuccess = () => {
      var number = parseInt(localStorage.getItem(GENERATED_ADDON_COUNT_KEY), 10) || 0;
      localStorage.setItem(GENERATED_ADDON_COUNT_KEY, number + 1);

      resolve();
    };

    activity.onerror = (error) => {
      console.error('Unable to install the addon', error);
      reject(error);
    };
  });
};
