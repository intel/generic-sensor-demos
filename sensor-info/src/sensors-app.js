import {LitElement, html, css} from 'lit-element';
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

class SensorsApp extends LitElement {
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
    let options = null;
    let sensorConstructor = null;

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
      sensorConstructor = window.AmbientLightSensor;
      break;

    case "Accelerometer":
      sensorConstructor = window.Accelerometer;
      break;

    case "LinearAcceleration":
      sensorConstructor = window.LinearAccelerationSensor;
      break;

    case "Gyroscope":
      sensorConstructor = window.Gyroscope;
      break;

    case "Magnetometer":
      sensorConstructor = window.Magnetometer;
      break;

    case "AbsoluteOrientation":
      sensorConstructor = window.AbsoluteOrientationSensor;
      break;

    case "RelativeOrientation":
      sensorConstructor = window.RelativeOrientationSensor;
      break;
    }

    if (!sensorConstructor) {
      this.toastNotSupported.open();
      return;
    }

    let sensor = new sensorConstructor(options || {});

    sensor.name = this.selectedSensor.value;
    sensor.frequency = (options && options.hasOwnProperty('frequency')) ? `${options.frequency} Hz` : 'default';
    sensor.id = this.sensorDataModel.length;

    sensor.onreading = () => {
      function round(number, precision) {
        let factor = 10 ** precision;
        return Math.round(number * factor) / factor;
      }

      let i = 0;
      let properties = new Array("timestamp", "illuminance", "x", "y", "z", "quaternion");

      for (let property in properties) {
        let propertyName = properties[property];
        if (propertyName == 'timestamp') {
          sensor.readingTimestamp = `timestamp: ${round(sensor.timestamp, 3)}`;
        } else if (propertyName in sensor) {
          if (propertyName == 'quaternion') {
            sensor.readingValue0 = `${propertyName}.X: ${round(sensor[propertyName][0], 3)}`;
            sensor.readingValue1 = `${propertyName}.Y: ${round(sensor[propertyName][1], 3)}`;
            sensor.readingValue2 = `${propertyName}.Z: ${round(sensor[propertyName][2], 3)}`;
            sensor.readingValue3 = `${propertyName}.W: ${round(sensor[propertyName][3], 3)}`;
          } else {
            let readingId = `readingValue${i++}`;
            sensor[readingId] = `${propertyName}: ${round(sensor[propertyName], 3)}`;
          }
        }
      }
      this.requestUpdate('sensorDataModel');
    }

    sensor.onerror = e => {
      sensor.errorType = `Error: ${e.error.name}`;
      sensor.errorMessage = `Error message: ${e.error.message}`;
      this.requestUpdate('sensorDataModel');
    }

    sensor.onactivate = () => {
      this.requestUpdate('sensorDataModel');
    };

    this.sensorDataModel.push(sensor);
    this.requestUpdate("sensorDataModel");
  }

  removeSensor(event) {
    let id = event.currentTarget.id;
    let index = this.sensorDataModel.findIndex(v => v.id == id);

    if (index == -1) {
      return;
    }

    // Stop sensor
    this.sensorDataModel[id].stop();

    this.sensorDataModel.splice(index, 1);
    // Update ids
    for (let i = 0; i < this.sensorDataModel.length; ++i) {
      this.sensorDataModel[i].id = i;
    }
    this.requestUpdate("sensorDataModel");
    // Update toggle buttons
    for (let i = 0; i < this.sensorDataModel.length; ++i) {
      this.shadowRoot.querySelector(`#toggle_${i}`).checked = this.sensorDataModel[i].active;
    }
  }

  sensorToggleChanged(event) {
    let toggle_id = event.currentTarget.id;
    let id = toggle_id.substring(7);
    if (event.target.checked) {
      this.sensorDataModel[id].start();
      this.sensorDataModel[id].active = true;
    } else {
      this.sensorDataModel[id].stop();
      this.sensorDataModel[id].active = false;
    }

    this.requestUpdate('sensorDataModel');
  }

  static get styles() {
    return css`
        :host {
          --app-primary-color: #0071c5;
          --app-secondary-color: black;
          display: block;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        .module {
          padding-left: 14px;
          padding-right: 14px;
          padding-bottom: 14px;
        }

        .item {
          display: flex;
          padding: 20px;
          border-radius: 8px;
          background-color: white;
          border: 1px solid #ddd;
          max-width: 100%;
          margin: 16px auto 0 auto;
        }

        .pad {
          padding: 0 16px;
        }

        span {
          display: block;
        }

        .push-right {
          margin-left: auto;
        }

        .toggle {
          display: inline-block;
        }

        .blue {
          --mdc-theme-on-primary: white;
          --mdc-theme-primary: #3f51b5;
          --mdc-theme-on-secondary: white;
          --mdc-theme-secondary: #3f51b5;
        }
    `;
  }

  render() {
    return html`
      <app-header-layout fullbleed="">
        <app-header slot="header" condenses="" fixed="" effects="waterfall">
          <app-toolbar>
            <div main-title="">Sensor info</div>
            <mwc-icon @click="${this.openAddSensorDialog}">add_circle_outline</mwc-icon>
          </app-toolbar>
        </app-header>

        <div class="module">
          ${this.sensorDataModel && this.sensorDataModel.map((item, index) => html`
            <div class="item">
              <paper-toggle-button class="toggle" sizing="contain" id="toggle_${item.id}" @change="${this.sensorToggleChanged}"></paper-toggle-button>
              <div class="pad">
                <span>Sensor type: ${item.name}</span>
                <span>Frequency hint: ${item.frequency}</span>
                <span>Sensor activated: ${item.activated}</span>
                <span>${item.errorType}</span>
                <span>${item.errorMessage}</span>
                <span>${item.readingTimestamp}</span>
                <span>${item.readingValue0}</span>
                <span>${item.readingValue1}</span>
                <span>${item.readingValue2}</span>
                <span>${item.readingValue3}</span>
              </div>
              <mwc-icon id="${item.id}" @click="${this.removeSensor}" class="push-right">clear</mwc-icon>
            </div>
          `)}
        </div>
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
