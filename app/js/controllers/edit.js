/* global Controller */

/* global AddonGenerator */
/* global AddonService */

export default class EditController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.changes = {};

    this.view.setTarget(target);
    this.view.open();
  }

  close() {
    this.view.close();
  }

  save() {
    var name = window.prompt('Enter a name for this add-on', 'Addon ' + new Date().toISOString());
    if (!name) {
      return;
    }

    var generator = new AddonGenerator(this.target, name);
    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];

    if (this.changes.innerHTML) {
      generator.innerHTML(this.changes.innerHTML);
    }

    if (this.changes.properties) {
      generator.setProperties(this.changes.properties);
    }

    AddonService.install(generator.generate());

    this.close();
  }
}
