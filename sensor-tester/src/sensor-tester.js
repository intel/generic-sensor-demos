import { createPage } from "./create-page.js"
import "./sensor-tests-page.js";

import {LitElement, html} from '@polymer/lit-element';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import { installRouter } from '../node_modules/pwa-helpers/router.js';

export const menuIcon = html`<svg height="24" viewBox="0 0 24 24" width="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;

customElements.define('accelerometer-page', createPage({
  src: "src/tests/accelerometer.json",
  sensorType: "Accelerometer",
  referenceFrame: "device"
}));
customElements.define('accelerometer-screen-page', createPage({
  src: "src/tests/accelerometer-screen.json",
  sensorType: "Accelerometer",
  referenceFrame: "screen"
}));
customElements.define('linearaccelerationsensor-page', createPage({
  src: "src/tests/linearaccelerationsensor.json",
  sensorType: "LinearAccelerationSensor",
  referenceFrame: "device"
}));
customElements.define('linearaccelerationsensor-screen-page', createPage({
  src: "src/tests/linearaccelerationsensor-screen.json",
  sensorType: "LinearAccelerationSensor",
  referenceFrame: "screen"
}));
customElements.define('absoluteorientationsensor-page', createPage({
  src: "src/tests/absoluteorientationsensor.json",
  sensorType: "AbsoluteOrientationSensor"
}));
customElements.define('relativeorientationsensor-page', createPage({
  src: "src/tests/relativeorientationsensor.json",
  sensorType: "RelativeOrientationSensor"
}));
customElements.define('gyroscope-page', createPage({
  src: "src/tests/gyroscope.json",
  sensorType: "Gyroscope"
}));
customElements.define('magnetometer-page', createPage({
  src: "src/tests/magnetometer.json",
  sensorType: "Magnetometer",
  frequency: 10
}));
customElements.define('ambientlightsensor-page', createPage({
  src: "src/tests/ambientlightsensor.json",
  sensorType: "AmbientLightSensor",
  frequency: 10
}));

class SensorTester extends LitElement {
  static get is() { return 'sensor-tester'; }

  static get properties() {
    return {
      page: {type: String},
      drawerOpened: {type: Boolean}
    };
  }

  firstUpdated() {
    const drawer = this.shadowRoot.querySelector('#drawer');
    installRouter(location => {
      const pathname = decodeURIComponent(location.pathname)
      const parts = pathname.slice(1).split('/');
      this.page = parts[0] || 'accerometer';
      this.drawerOpened = false || drawer.persistent;
    });
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

        app-drawer {
          z-index: 2;
        }
      </style>

      <app-drawer-layout fullbleed>
        <app-drawer id="drawer" slot="drawer" .opened="${this.drawerOpened}"
            @opened-changed="${e => this.drawerOpened = e.target.opened}">
          <app-toolbar>Choose sensor:</app-toolbar>
          <nav class="drawer-list">
            <a ?selected="${this.page === 'accelerometer'}" href="/accelerometer">
              Accelerometer<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'accelerometer-screen'}" href="/accelerometer-screen">
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
            <a ?selected="${this.page === 'ambientlightsensor'}" href="ambientlightsensor">
              AmbientLightSensor<sub>device</sub>
            </a>
            <a ?selected="${this.page === 'magnetometer'}" href="magnetometer">
              Magnetometer<sub>device</sub>
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
            <accelerometer-page class="page" ?active="${this.page === 'accelerometer'}"></accelerometer-page>
            <accelerometer-screen-page class="page" ?active="${this.page === 'accelerometer-screen'}"></accelerometer-screen-page>
            <linearaccelerationsensor-page class="page" ?active="${this.page === 'linearaccelerationsensor'}"></linearaccelerationsensor-page>
            <linearaccelerationsensor-screen-page class="page" ?active="${this.page === 'linearaccelerationsensor-screen'}"></linearaccelerationsensor-screen-page>
            <gyroscope-page class="page" ?active="${this.page === 'gyroscope'}"></gyroscope-page>
            <absoluteorientationsensor-page class="page" ?active="${this.page === 'absoluteorientationsensor'}"></absoluteorientationsensor-page>
            <relativeorientationsensor-page class="page" ?active="${this.page === 'relativeorientationsensor'}"></relativeorientationsensor-page>
            <ambientlightsensor-page class="page" ?active="${this.page === 'ambientlightsensor'}"></ambientlightsensor-page>
            <magnetometer-page class="page" ?active="${this.page === 'magnetometer'}"></magnetometer-page>
          </main>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }
}

window.customElements.define(SensorTester.is, SensorTester);