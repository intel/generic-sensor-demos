import {LitElement, html} from '@polymer/lit-element';
import {classMap} from 'lit-html/directives/classMap';
import "@material/mwc-button";
import "@polymer/paper-spinner/paper-spinner-lite";
import "@polymer/paper-styles/color";
import "./orientation-changer.js";
import "./lazy-image.js"
import {idleUntilVisible} from "./idle-until-visible.js";

class SensorTestsPage extends LitElement {
  static get properties() {
    return {
      frequency: {type: Number},
      referenceFrame: {type: String},
      type: {type: String},
      src: {type: String},
      isSupported: {type: Boolean},
      items: {type: Array}
    };
  }

  constructor() {
    super();
    this.frequency = 60;
    this.referenceFrame = "device";
    this.isSupported = true;
    this.items = null;

    idleUntilVisible(this, async () => {
      const response = await fetch(this.src);
      if (!response.ok) {
        console.error("File doesn't exist", this.src);
        return;
      }
      this.items = await response.json();
      console.log("Loading data file:", this.src)
    });
  }

  get sensor() {
    return this.sensor_;
  }

  getItemText(state) {
    return state || "RUN";
  }

  isTestRunning(state) {
    return state === "RUNNING";
  }

  runAllTests() {
    // TODO(alex)
  }

  testRunning(index) {
    this.items[index].state = 'RUNNING';
    this.requestUpdate('items');
  }

  testPassed(index) {
    this.items[index].state = 'PASSED';
    this.requestUpdate('items');
    this.testCompleted(index);
  }

  testFailed(index) {
    this.items[index].state = 'FAILED';
    this.requestUpdate('items');
    this.testCompleted(index);
  }

  testCompleted(index) {
    clearTimeout(this.items[index].timeout_id);
    this.sensor.removeEventListener('reading', this.items[index].handler);
    this.sensor.stop();
  }

  firstUpdated() {
    if (this.type in window) {
      this.sensor_ = new window[this.type]({
        frequency: this.frequency,
        referenceFrame: this.referenceFrame
      });

      this.sensor_.onreading = () => {
        this.sensor_.stop();
        this.sensor_.onreading = null;
      }

      this.sensor_.onerror = e => {
        if (e.error.name === 'NotReadableError') {
          this.isSupported = false;
          this.referenceFrame = "device";
          this.items = [];
          this.requestUpdate('items');
        }
      }

      this.sensor_.start();
    } else {
      this.isSupported = false;
      this.referenceFrame = "device";
    }
  }

  runTest(index) {
    let item = this.items[index];

    // set state of test case to 'running'
    this.testRunning(index);

    // set timeout and save it's id
    this.items[index].timeout_id = setTimeout(() => {
      this.testFailed(index);
    }, item.duration * 1000);

    /**
     * Campare sensor reading values.
     *
     * @param {array|number} val Actual reading values.
     * @param {array|number} exp expected reading values.
     * @param {Function} isEqual Function which compares the reading values
     *                           and return a boolean result.
     */
    const compareReadings = (val, exp, isEqual) => {
      // compare number values
      if (typeof val === 'number' && typeof exp === 'number') {
        return isEqual(val, exp);
      }
      // compare array values
      else if (val instanceof Array && exp instanceof Array) {
        if (val.length !== exp.length) {
          return false;
        }
        for (const [index, value] of val.entries()) {
          if (!compareReadings(value, exp[index], isEqual)) {
            return false;
          }
        }
        return true;
      }

      return false;
    }

    // if sensor value is same as expectation, pass test
    this.items[index].handler = () => {
      if (Object.keys(item.expected).every(
          key => compareReadings(this.sensor[key], item.expected[key], eval(item.isEqual)))) {
          this.testPassed(index);
      }
    }

    // test rotation measurement for relativeOrientationSensor
    if (item.expected === 'none') {
      const timeToStabilize = 1000;
      // set timeout to get stable sensor reading
      setTimeout( () => {
        const toRadians = degrees => degrees * Math.PI / 180;
        const toDegrees = radians => radians * 180 / Math.PI;

        const angle = toDegrees(Math.acos(this.sensor.quaternion[3])) * 2;
        const vx = this.sensor.quaternion[0] / Math.sin(toRadians(angle / 2));
        const vy = this.sensor.quaternion[1] / Math.sin(toRadians(angle / 2));
        const vz = this.sensor.quaternion[2] / Math.sin(toRadians(angle / 2));

        item.expected = {
          "quaternion": [
            // rotate 90 degrees clockwise to measure expected sensor reading
            Math.sin(toRadians((angle + 90) / 2)) * vx,
            Math.sin(toRadians((angle + 90) / 2)) * vy,
            Math.sin(toRadians((angle + 90) / 2)) * vz,
            Math.cos(toRadians((angle + 90) / 2))
          ]
        };
        // add onreading event listener to receive new events.
        this.sensor.addEventListener('reading', this.items[index].handler);
      }, timeToStabilize);
    } else {
      // add onreading event listener to receive new events.
      this.sensor.addEventListener('reading', this.items[index].handler);
    }

    // start sensor
    this.sensor.start();
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          padding: 10px;
        }
  
        div.device {
          display: none;
        }

        div.hidden {
          display: none;
        }
  
        div.screen {
          display: block;
        }
  
        mwc-button {
          margin-left: 0px;
          margin-right: 10px;
          position: relative;
          float: right;
          --mdc-theme-primary: var(--app-primary-color);
        }
  
        mwc-button.LOCK {
          margin-bottom: 10px;
          float: none;
          --mdc-theme-primary: var(--app-primary-color);
        }
  
        mwc-button.PASSED {
          --mdc-theme-primary: var(--paper-green-500);
        }
  
        mwc-button.FAILED {
          --mdc-theme-primary: var(--paper-red-500);
        }
  
        mwc-button.RUNNING {
          --mdc-theme-primary: var(--app-primary-color);
        }
  
        paper-spinner-lite.green {
          margin: 6px 10px 0px 0px;
          --paper-spinner-color: var(--paper-green-500);
        }
  
        .item {
          @apply --layout-vertical;
          background-color: white;
          max-width: 100%;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
  
        .header {
          @apply --layout-horizontal;
        }
  
        h1 {
          margin: 10px 0 0 0;
          font-size: 20px;
        }
  
        .title {
          height: 40px;
          @apply --layout-flex;
        }
  
        .description {
          margin-top: 14px;
        }
  
        .image {
          @apply --layout-horizontal;
          @apply --layout-wrap;
          @apply --layout-center-justified;
          margin-top: 8px;
        }
      </style>
  
      <div class="${classMap({'hidden': this.isSupported})}">Sensor is not supported by the browser or the device.</div>
      <div class="${classMap({'hidden': !this.isSupported})}">
        <div class="${classMap({'hidden': this.referenceFrame === 'device' || !screen.orientation})}">
          <orientation-changer></orientation-changer>
        </div>

        ${this.items && this.items.map((item, index) => html`
            <div>
              <div class="item">
                <div class="header">
                  <div class="title"><h1>${item.name}</h1></div>
                  <paper-spinner-lite ?active="${this.isTestRunning(item.state)}" class="green"></paper-spinner-lite>
                  <mwc-button raised @click="${() => this.runTest(index)}" class="${item.state}" label="${this.getItemText(item.state)}"></mwc-button>
                </div>
                <div class="description">${item.description}</div>
                <div class="image">
                  <lazy-image src="${item.illustration}"></lazy-image>
                </div>
              </div>
            </div>
        `)}
      </div>
    `;
  }
}

customElements.define('sensor-tests-page', SensorTestsPage);
