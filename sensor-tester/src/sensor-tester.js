import { createPage } from "./create-page.js"
import "./sensor-tests-page.js";

import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/iron-icons';
import '@polymer/iron-pages';
import '@polymer/iron-selector/iron-selector';
import '@polymer/paper-icon-button';

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

class SensorTester extends PolymerElement {
  static get is() { return 'sensor-tester'; }

  static get properties() {
    return {
      page: String,
      routeData: Object,
      subroute: String,
      rootPath: String,
    };
  }

  static get template() {
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

        .drawer-list a.iron-selected {
          font-weight: bold;
          color: var(--app-secondary-color);
        }

        .drawer-list a {
          display: block;
          text-decoration: none;
          color: var(--app-secondary-color);
          padding: 0 18px;
          line-height: 42px;
        }
      </style>

      <app-location route="{{route}}"></app-location>
      <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>

      <app-drawer-layout fullbleed narrow="{{narrow}}">
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Choose sensor:</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="accelerometer" href="accelerometer">
              Accelerometer<sub>device</sub>
            </a>
            <a name="accelerometer-screen" href="accelerometer-screen">
              Accelerometer<sub>screen</sub>
            </a>
            <a name="linearaccelerationsensor" href="linearaccelerationsensor">
              LinearAccelerationSensor<sub>device</sub>
            </a>
            <a name="linearaccelerationsensor-screen" href="linearaccelerationsensor-screen">
              LinearAccelerationSensor<sub>screen</sub>
            </a>
            <a name="gyroscope" href="gyroscope">
              Gyroscope<sub>device</sub>
            </a>
            <a name="absoluteorientationsensor" href="absoluteorientationsensor">
              AbsoluteOrientationSensor<sub>device</sub>
            </a>
            <a name="relativeorientationsensor" href="relativeorientationsensor">
              RelativeOrientationSensor<sub>device</sub>
            </a>
            <a name="ambientlightsensor" href="ambientlightsensor">
              AmbientLightSensor<sub>device</sub>
            </a>
            <a name="magnetometer" href="magnetometer">
              Magnetometer<sub>device</sub>
            </a>
          </iron-selector>
        </app-drawer>

        <app-header-layout has-scrolling-region>

          <app-header slot="header" condenses reveals effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="icons:menu" drawer-toggle></paper-icon-button>
              <div main-title>Sensor tester</div>
            </app-toolbar>
          </app-header>
          <iron-pages id="ironPage" selected="[[page]]" attr-for-selected="name" fallback-selection="accelerometer" role="main">
            <accelerometer-page name="accelerometer"></accelerometer-page>
            <accelerometer-screen-page name="accelerometer-screen"></accelerometer-screen-page>
            <linearaccelerationsensor-page name="linearaccelerationsensor"></linearaccelerationsensor-page>
            <linearaccelerationsensor-screen-page name="linearaccelerationsensor-screen"></linearaccelerationsensor-screen-page>
            <gyroscope-page name="gyroscope"></gyroscope-page>
            <absoluteorientationsensor-page name="absoluteorientationsensor"></absoluteorientationsensor-page>
            <relativeorientationsensor-page name="relativeorientationsensor"></relativeorientationsensor-page>
            <ambientlightsensor-page name="ambientlightsensor"></ambientlightsensor-page>
            <magnetometer-page name="magnetometer"></magnetometer-page>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get observers() {
    return ['_routePageChanged(routeData.page)'];
  }

  _routePageChanged(page) {
    this.page = page || 'accelerometer';
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }
}

window.customElements.define(SensorTester.is, SensorTester);