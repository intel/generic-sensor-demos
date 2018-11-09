import "./sensor-tests-page.js";

import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import {LitElement, html} from '@polymer/lit-element';
import {installRouter} from '../node_modules/pwa-helpers/router.js';

const menuIcon = html`<svg height="24" viewBox="0 0 24 24" width="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;

class SensorTester extends LitElement {
  static get properties() {
    return {
      page: {type: String}
    };
  }

  constructor() {
    super();
    installRouter(location => {
      const pathname = decodeURIComponent(location.pathname);

      const parts = pathname.slice(1).split('/');
      this.page = parts[parts.length - 1] || 'accelerometer';

      if (screen.orientation) {
        screen.orientation.unlock();
      }
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen
        || document.mozCancelFullScreen;
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
        || document.mozFullscreenElement;

      if (fullscreenElement) {
        exitFullscreen.call(document);
      }

      if (this.drawer && !this.drawer.persistent) {
        this.drawer.close();
      }
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
          height: 52px;
        }

        .page {
          display: none;
          will-change: transform, opacity;
        }

        .page[active] {
          display: block;
          animation: pagein 0.3s ease-in-out;
        }

        @keyframes pagein {
          from {
            transform: translateY(10px);
            opacity: 0;
          }

          to {
            transform: translateY(0px);
            opacity: 1;
          }
        }

        .menu-btn {
          display: inline-block;
          width: 40px;
          height: 40px;
          padding: 8px;
          outline: none;
          user-select: none;
          box-sizing: border-box;
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          color: var(--app-header-text-color);
          cursor: pointer;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
          text-decoration: none;
        }

        .menu-btn svg {
          fill: currentColor;
        }
      </style>

      <app-drawer-layout fullbleed>
        <app-drawer id="drawer" slot="drawer">
          <app-toolbar>Choose sensor:</app-toolbar>
          <nav class="drawer-list">
            <a ?selected="${this.page === 'accelerometer'}" href="accelerometer">
              Accelerometer<br><small>device coordinates</small>
            </a>
            <a ?selected="${this.page === 'accelerometer-screen'}" href="accelerometer-screen">
              Accelerometer<br><small>screen coordinates</small>
            </a>
            <a ?selected="${this.page === 'linearaccelerationsensor'}" href="linearaccelerationsensor">
              LinearAccelerationSensor<br><small>device coordinates</small>
            </a>
            <a ?selected="${this.page === 'linearaccelerationsensor-screen'}" href="linearaccelerationsensor-screen">
              LinearAccelerationSensor<br><small>screen coordinates</small>
            </a>
            <a ?selected="${this.page === 'gyroscope'}" href="gyroscope">
              Gyroscope<br><small>device coordinates</small>
            </a>
            <a ?selected="${this.page === 'gyroscope-screen'}" href="gyroscope-screen">
              Gyroscope<br><small>screen coordinates</small>
            </a>
            <a ?selected="${this.page === 'absoluteorientationsensor'}" href="absoluteorientationsensor">
              AbsoluteOrientationSensor<br><small>device coordinates</small>
            </a>
            <a ?selected="${this.page === 'absoluteorientationsensor-screen'}" href="absoluteorientationsensor-screen">
              AbsoluteOrientationSensor<br><small>screen coordinates</small>
            </a>
            <a ?selected="${this.page === 'relativeorientationsensor'}" href="relativeorientationsensor">
              RelativeOrientationSensor<br><small>device coordinates</small>
            </a>
            <a ?selected="${this.page === 'relativeorientationsensor-screen'}" href="relativeorientationsensor-screen">
              RelativeOrientationSensor<br><small>screen coordinates</small>
            </a>
            <a ?selected="${this.page === 'magnetometer'}" href="magnetometer">
              Magnetometer<br><small>device coordinates</small>
            </a>
            <a ?selected="${this.page === 'magnetometer-screen'}" href="magnetometer-screen">
              Magnetometer<br><small>screen coordinates</small>
            </a>
            <a ?selected="${this.page === 'ambientlightsensor'}" href="ambientlightsensor">
              AmbientLightSensor<br><small>device coordinates</small>
            </a>
          </nav>
        </app-drawer>

        <app-header-layout has-scrolling-region>
          <app-header slot="header" condenses reveals effects="waterfall">
            <app-toolbar>
              <button class="menu-btn" aria-label="Menu" drawer-toggle
                @click="${(ev) => {
                  this.drawer.toggle();
                  // Stop propagation as a click outside drawer will close it!
                  ev.stopPropagation();
                }}">${menuIcon}</button>
              <div main-title>Sensor tester</div>
            </app-toolbar>
          </app-header>

          <main role="main" class="main-content">
            <sensor-tests-page class="page"
              type="Accelerometer"
              src="src/tests/accelerometer.json"
              ?active="${this.page === 'accelerometer'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="Accelerometer"
              src="src/tests/accelerometer-screen.json"
              referenceFrame="screen"
              ?active="${this.page === 'accelerometer-screen'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="LinearAccelerationSensor"
              src="src/tests/linearaccelerationsensor.json"
              ?active="${this.page === 'linearaccelerationsensor'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="LinearAccelerationSensor"
              src="src/tests/linearaccelerationsensor-screen.json"
              referenceFrame="screen"
              ?active="${this.page === 'linearaccelerationsensor-screen'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="Gyroscope"
              src="src/tests/gyroscope.json"
              ?active="${this.page === 'gyroscope'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="Gyroscope"
              src="src/tests/gyroscope-screen.json"
              referenceFrame="screen"
              ?active="${this.page === 'gyroscope-screen'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="AbsoluteOrientationSensor"
              src="src/tests/absoluteorientationsensor.json"
              ?active="${this.page === 'absoluteorientationsensor'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="AbsoluteOrientationSensor"
              src="src/tests/absoluteorientationsensor-screen.json"
              referenceFrame="screen"
              ?active="${this.page === 'absoluteorientationsensor-screen'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="RelativeOrientationSensor"
              src="src/tests/relativeorientationsensor.json"
              ?active="${this.page === 'relativeorientationsensor'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="RelativeOrientationSensor"
              src="src/tests/relativeorientationsensor-screen.json"
              referenceFrame="screen"
              ?active="${this.page === 'relativeorientationsensor-screen'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="Magnetometer"
              src="src/tests/magnetometer.json"
              frequency="10"
              ?active="${this.page === 'magnetometer'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="Magnetometer"
              src="src/tests/magnetometer-screen.json"
              frequency="10"
              referenceFrame="screen"
              ?active="${this.page === 'magnetometer-screen'}">
            </sensor-tests-page>
            <sensor-tests-page class="page"
              type="AmbientLightSensor"
              src="src/tests/ambientlightsensor.json"
              frequency="10"
              ?active="${this.page === 'ambientlightsensor'}">
            </sensor-tests-page>
          </main>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }
}

window.customElements.define('sensor-tester', SensorTester);
