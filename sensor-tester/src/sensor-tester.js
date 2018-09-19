import { createPage } from "./create-page.js"
import "./sensor-tests-page.js";

import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import {LitElement, html} from '@polymer/lit-element';
import {installRouter} from '../node_modules/pwa-helpers/router.js';

export const menuIcon = html`<svg height="24" viewBox="0 0 24 24" width="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;

createPage('page-1', {
  src: "src/tests/accelerometer.json",
  sensorType: "Accelerometer",
  referenceFrame: "device"
});

const loadPage = (page) => {
  switch(page) {
    case 'accelerometer':
      createPage('page-1', {
        src: "src/tests/accelerometer.json",
        sensorType: "Accelerometer",
        referenceFrame: "device"
      });
      break;
    case 'accelerometer-screen':
      createPage('page-2', {
        src: "src/tests/accelerometer-screen.json",
        sensorType: "Accelerometer",
        referenceFrame: "screen"
      });
      break;
    case 'linearaccelerationsensor':
      createPage('page-3', {
        src: "src/tests/linearaccelerationsensor.json",
        sensorType: "LinearAccelerationSensor",
        referenceFrame: "device"
      });
      break;
    case 'linearaccelerationsensor-screen':
      createPage('page-4', {
        src: "src/tests/linearaccelerationsensor-screen.json",
        sensorType: "LinearAccelerationSensor",
        referenceFrame: "screen"
      });
      break;
    case 'gyroscope':
      createPage('page-5', {
        src: "src/tests/gyroscope.json",
        sensorType: "Gyroscope"
      });
      break;
    case 'absoluteorientationsensor':
      createPage('page-6', {
        src: "src/tests/absoluteorientationsensor.json",
        sensorType: "AbsoluteOrientationSensor"
      });
      break;
    case 'relativeorientationsensor':
      createPage('page-7', {
        src: "src/tests/relativeorientationsensor.json",
        sensorType: "RelativeOrientationSensor"
      });
      break;
    case 'magnetometer':
      createPage('page-8', {
        src: "src/tests/magnetometer.json",
        sensorType: "Magnetometer",
        frequency: 10
      });
      break;
    case 'ambientlightsensor':
      createPage('page-9', {
        src: "src/tests/ambientlightsensor.json",
        sensorType: "AmbientLightSensor",
        frequency: 10
      });
      break;
  }
}

class SensorTester extends LitElement {
  static get properties() {
    return {
      page: {type: String},
      drawerOpened: {type: Boolean}
    };
  }

  constructor() {
    super();
    installRouter(location => {
      const pathname = decodeURIComponent(location.pathname);

      const parts = pathname.slice(1).split('/');
      this.page = parts[parts.length - 1] || 'accelerometer';
      loadPage(this.page);
      this.drawerOpened = false || (this.drawer && this.drawer.persistent);
    });
  }

  firstUpdated() {
    this.drawer = this.shadowRoot.querySelector('#drawer');
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

        app-drawer {
          z-index: 2;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
          font-weight: bold;
        }

        .drawer-list a {
          display: block;
          text-decoration: none;
          color: var(--app-secondary-color);
          padding: 0 18px;
          line-height: 42px;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        .menu-btn {
          display: inline-block;
          width: 40px;
          height: 40px;
          padding: 8px;
          box-sizing: border-box;
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          text-decoration: none;
        }
      </style>

      <app-drawer-layout fullbleed>
        <app-drawer id="drawer" slot="drawer" .opened="${this.drawerOpened}"
            @opened-changed="${e => this.drawerOpened = e.target.opened}">
          <app-toolbar>Choose sensor:</app-toolbar>
          <nav class="drawer-list">
            <a ?selected="${this.page === 'accelerometer'}" href="accelerometer">
              Accelerometer<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'accelerometer-screen'}" href="accelerometer-screen">
              Accelerometer<sub>screen</sub>
            </a>
            <a ?selected="${this.page === 'linearaccelerationsensor'}" href="linearaccelerationsensor">
              LinearAccelerationSensor<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'linearaccelerationsensor-screen'}" href="linearaccelerationsensor-screen">
              LinearAccelerationSensor<sub>screen</sub>
            </a>
            <a ?selected="${this.page === 'gyroscope'}" href="gyroscope">
              Gyroscope<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'absoluteorientationsensor'}" href="absoluteorientationsensor">
              AbsoluteOrientationSensor<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'relativeorientationsensor'}" href="relativeorientationsensor">
              RelativeOrientationSensor<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'magnetometer'}" href="magnetometer">
              Magnetometer<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'ambientlightsensor'}" href="ambientlightsensor">
              AmbientLightSensor<sub>device</sub>
            </a>
          </nav>
        </app-drawer>

        <app-header-layout has-scrolling-region>
          <app-header slot="header" condenses reveals effects="waterfall">
            <app-toolbar>
              <button class="menu-btn" aria-label="Menu" drawer-toggle
                @click="${() => this.drawerOpened = true}">${menuIcon}</button>
              <div main-title>Sensor tester</div>
            </app-toolbar>
          </app-header>

          <main role="main" class="main-content">
            <page-1 class="page" ?active="${this.page === 'accelerometer'}"></page-1>
            <page-2 class="page" ?active="${this.page === 'accelerometer-screen'}"></page-2>
            <page-3 class="page" ?active="${this.page === 'linearaccelerationsensor'}"></page-3>
            <page-4 class="page" ?active="${this.page === 'linearaccelerationsensor-screen'}"></page-4>
            <page-5 class="page" ?active="${this.page === 'gyroscope'}"></page-5>
            <page-6 class="page" ?active="${this.page === 'absoluteorientationsensor'}"></page-6>
            <page-7 class="page" ?active="${this.page === 'relativeorientationsensor'}"></page-7>
            <page-8 class="page" ?active="${this.page === 'magnetometer'}"></page-8>
            <page-9 class="page" ?active="${this.page === 'ambientlightsensor'}"></page-9>
          </main>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }
}

window.customElements.define('sensor-tester', SensorTester);