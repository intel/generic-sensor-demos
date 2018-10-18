import {LitElement, html} from '@polymer/lit-element';
import "@material/mwc-icon/mwc-icon.js";
import "@material/mwc-button/mwc-button.js";
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-label/iron-label.js';
class SensorsApp extends LitElement {

  static get properties() {
    return {
      sensorDataModel: {type: Array}
    };
  }

  constructor() {
    super();
    this.sensorDataModel = [];
  }

  openAddSensorDialog() {
    this.addSensorDialog = this.shadowRoot.querySelector('#addSensorDialog');
    this.addSensorDialog.open();
  }

  addSensor() {
    this.selectedSensor = this.shadowRoot.querySelector('#selectedSensor');
    this.selectedFrequency = this.shadowRoot.querySelector('#selectedFrequency');
    this.toastPleaseSelectSensor = this.shadowRoot.querySelector('#toastPleaseSelectSensor');
    this.toastNotSupported = this.shadowRoot.querySelector('#toastNotSupported');
    var options = null;
    var sensorConstructor = null;

    if (!this.selectedSensor.value) {
      this.toastPleaseSelectSensor.open();
      return;
    }

    if (this.selectedFrequency.value !== "" && !isNaN(this.selectedFrequency.value)) {
      options = {
        frequency: this.selectedFrequency.value
      };
    }

    switch (this.selectedSensor.value) {
    case "Ambient light":
      if ('AmbientLightSensor' in window) {
        sensorConstructor = AmbientLightSensor;
      }
      break;

    case "Accelerometer":
      if ('Accelerometer' in window) {
        sensorConstructor = Accelerometer;
      }
      break;

    case "LinearAcceleration":
      if ('LinearAccelerationSensor' in window) {
        sensorConstructor = LinearAccelerationSensor;
      }
      break;

    case "Gyroscope":
      if ('Gyroscope' in window) {
        sensorConstructor = Gyroscope;
      }
      break;

    case "Magnetometer":
      if ('Magnetometer' in window) {
        sensorConstructor = Magnetometer;
      }
      break;

    case "AbsoluteOrientation":
      if ('AbsoluteOrientationSensor' in window) {
        sensorConstructor = AbsoluteOrientationSensor;
      }
      break;

    case "RelativeOrientation":
      if ('RelativeOrientationSensor' in window) {
        sensorConstructor = RelativeOrientationSensor;
      }
      break;
    }

    if (!sensorConstructor) {
      this.toastNotSupported.open();
      return;
    }

    var sensor = null;
    if (options) {
      sensor = new sensorConstructor(options);
    } else {
      sensor = new sensorConstructor();
    }


    sensor.name = this.selectedSensor.value;
    sensor.frequency = (options && options.hasOwnProperty('frequency')) ? options.frequency + ' Hz' : 'default';
    sensor.id = this.sensorDataModel.length;
    sensor.app = this;

    sensor.onreading = function () {
      function round(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
      }

      var i = 0;
      var properties = new Array("timestamp", "illuminance", "x", "y", "z", "quaternion");

      for (var property in properties) {
        var propertyName = properties[property];
        if (propertyName == 'timestamp') {
          this.readingTimestamp = 'timestamp: ' + round(this.timestamp, 3);
          this.app.requestUpdate('sensorDataModel.' + this.id + '.readingTimestamp');
        } else if (propertyName in this) {
          if (propertyName == 'quaternion') {
            this["readingValue0"] = propertyName + ".X: " + round(this[propertyName][0], 3);
            this["readingValue1"] = propertyName + ".Y: " + round(this[propertyName][1], 3);
            this["readingValue2"] = propertyName + ".Z: " + round(this[propertyName][2], 3);
            this["readingValue3"] = propertyName + ".W: " + round(this[propertyName][3], 3);
            this.app.requestUpdate('sensorDataModel.' + this.id + '.readingValue0');
            this.app.requestUpdate('sensorDataModel.' + this.id + '.readingValue1');
            this.app.requestUpdate('sensorDataModel.' + this.id + '.readingValue2');
            this.app.requestUpdate('sensorDataModel.' + this.id + '.readingValue3');
          } else {
            var readingId = 'readingValue' + i++;
            this[readingId] = propertyName + ': ' + round(this[propertyName], 3);
            this.app.requestUpdate('sensorDataModel.' + this.id + '.' + readingId);
          }
        }
      }
      this.app.requestUpdate('sensorDataModel');
    }

    sensor.onerror = function(e) {
      this["errorType"] = "Error: " + e.error.name;
      this["errorMessage"] = "Error message: " + e.error.message;
      this.app.requestUpdate('sensorDataModel.' + this.id + '.errorType');
      this.app.requestUpdate('sensorDataModel.' + this.id + '.errorMessage');
      this.app.requestUpdate('sensorDataModel');
    }

    sensor.onactivate = function () {
      this.app.requestUpdate('sensorDataModel.' + this.id + '.activated');
      this.app.requestUpdate('sensorDataModel');
    };

    this.sensorDataModel.push(sensor);
    this.requestUpdate("sensorDataModel");
  }

  removeSensor(event) {
    var id = event.currentTarget.id;
    var index = this.sensorDataModel.findIndex(function (v) {
      return v.id == id;
    });

    if (index == -1) {
      return;
    }

    // Stop sensor
    this.sensorDataModel[id].stop();

    this.sensorDataModel.splice(index, 1);
    // Update ids
    for (var i = 0; i < this.sensorDataModel.length; ++i) {
      this.sensorDataModel[i].id = i;
      // Notify about updated ids
      this.requestUpdate('sensorDataModel.' + i + '.id');
    }
    this.requestUpdate("sensorDataModel");
    // Update toggle buttons
    for (var i = 0; i < this.sensorDataModel.length; ++i) {
      this.shadowRoot.querySelector('#toggle_' + i).checked = this.sensorDataModel[i].active;
    }
  }

  sensorToggleChanged(event) {
    var toggle_id = event.currentTarget.id;
    var id = toggle_id.substring(7);
    if (event.target.checked) {
      this.sensorDataModel[id].start();
      this.sensorDataModel[id].active = true;
    } else {
      this.sensorDataModel[id].stop();
      this.sensorDataModel[id].active = false;
    }

    this.requestUpdate('sensorDataModel.' + id + '.activated');
    this.requestUpdate('sensorDataModel');
  }

  render() {
    return html`
      <style>
        :host {
          --app-primary-color: #0071c5;
          --app-secondary-color: black;
          display: block;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        .item {
          @apply(--layout-horizontal);
          padding: 20px;
          border-radius: 8px;
          background-color: white;
          border: 1px solid #ddd;
          max-width: 100%;
          margin: 16px auto 0 auto;
        }

        .pad {
          padding: 0 16px;
          @apply(--layout-flex);
          @apply(--layout-vertical);
        }

        .toggle {
          @apply(--layout-vertical);
        }

        .blue {
          --mdc-theme-on-primary: white;
          --mdc-theme-primary: #3f51b5;
          --mdc-theme-on-secondary: white;
          --mdc-theme-secondary: #3f51b5;
        }
      </style>

      <app-header-layout fullbleed="">
        <app-header slot="header" condenses="" fixed="" effects="waterfall">
          <app-toolbar>
            <div main-title="">Sensor info</div>
            <mwc-icon @click="${this.openAddSensorDialog}">add_circle_outline</mwc-icon>
          </app-toolbar>
        </app-header>

        ${this.sensorDataModel && this.sensorDataModel.map((item, index) => html`
          <div>
            <div class="item">
              <paper-toggle-button class="toggle" sizing="contain" id="toggle_${item.id}" @change="${this.sensorToggleChanged}"></paper-toggle-button>
              <div class="pad">
                <iron-label>Sensor type: ${item.name}</iron-label>
                <iron-label>Frequency hint: ${item.frequency}</iron-label>
                <iron-label>Sensor activated: ${item.activated}</iron-label>
                <span>${item.errorType}</span>
                <span>${item.errorMessage}</span>
                <span>${item.readingTimestamp}</span>
                <span>${item.readingValue0}</span>
                <span>${item.readingValue1}</span>
                <span>${item.readingValue2}</span>
                <span>${item.readingValue3}</span>
              </div>
              <mwc-icon id="${item.id}" @click="${this.removeSensor}">clear</mwc-icon>
            </div>
          </div>
        `)}
      </app-header-layout>

      <paper-toast id="toastNotSupported" text="Selected sensor is not supported."></paper-toast>
      <paper-toast id="toastPleaseSelectSensor" text="Please select sensor."></paper-toast>

      <paper-dialog id="addSensorDialog" modal="">
        <h2>Add sensor</h2>
        <paper-dropdown-menu-light id="selectedSensor" label="Sensor type">
          <paper-listbox class="dropdown-content" slot="dropdown-content">
            <paper-item>Ambient light</paper-item>
            <paper-item>Accelerometer</paper-item>
            <paper-item>LinearAcceleration</paper-item>
            <paper-item>Gyroscope</paper-item>
            <paper-item>Magnetometer</paper-item>
            <paper-item>AbsoluteOrientation</paper-item>
            <paper-item>RelativeOrientation</paper-item>
          </paper-listbox>
        </paper-dropdown-menu-light>
        <paper-input id="selectedFrequency" label="Frequency"></paper-input>
        <div class="buttons">
          <mwc-button class="blue" dialog-confirm @click="${this.addSensor}">Add</mwc-button>
          <mwc-button class="blue" dialog-confirm autofocus>Cancel</mwc-button>
        </div>
      </paper-dialog>
    `;
  }
}

customElements.define('sensors-app', SensorsApp);
