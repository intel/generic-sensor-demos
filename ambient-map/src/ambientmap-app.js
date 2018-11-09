import {LitElement, html} from '@polymer/lit-element';
import '@polymer/paper-dialog/paper-dialog.js';
import "@material/mwc-button/mwc-button.js";
import '@johnriv/google-map/google-map.js';

class AmbientmapApp extends LitElement {
  static get properties() {
    return {
      latitude: {type: Number},
      longitude: {type: Number}
    };
  }

  constructor() {
    super();
    this.latitude = 60.1699;
    this.longitude = 24.9384;
    this.mapApiKey = location.origin === 'https://ambientmap.appspot.com' || location.origin === 'https://intel.github.io' ? 'AIzaSyCR59cBBxaiINBUEbdmUVHYs8CV8jtEDTw' : 'DEADBEEF59cBBxaiINBUEbdmUVHYs8CV8jtEDTw';
    this.styles = [];
    this.nightStyles = [
      {
        elementType: 'geometry',
        stylers: [{
          color: '#25303f'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#404a59'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#212a37'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#263c3f'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#925020'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#131820'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#657a9a'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#001a4d'
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#25303f'
        }]
      }, {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d69664'
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#756956'
        }]
      }, {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d69664'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#6b9a76'
        }]
      }, {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#9ca5b3'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f3d19c'
        }]
      }, {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#515c6d'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#17263c'
        }]
      }
    ];
  }

  firstUpdated() {
    if ('AmbientLightSensor' in window) {
      this.sensor = new AmbientLightSensor();
      this.sensor.onreading = () => {
        this.mapElement = this.shadowRoot.querySelector('#mapElement');
        if (!this.mapElement.map)
          return;

        var isNightMode = this.sensor.illuminance < 10;
        if (typeof this.isNightMode == "undefined" || this.isNightMode != isNightMode) {
          this.isNightMode = isNightMode;

          this.mapElement.map.set('styles', this.isNightMode ? this.nightStyles : []);
        }
      }
      this.sensor.start();
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
      });
    }

    this.infoDialog = this.shadowRoot.querySelector('#infoDialog');
  }

  openInfoDialog() {
    this.infoDialog.open();
  }

  render() {
    return html`
      <style>
        .floater {
          position: absolute;
          float: right;
          top: 10px;
          right: 10px;
          z-index: 1;
        }
        .green {
          --mdc-theme-on-primary: white;
          --mdc-theme-primary: #4caf50;
          --mdc-theme-on-secondary: white;
          --mdc-theme-secondary: #4caf50;
        }
        .blue {
          --mdc-theme-on-primary: white;
          --mdc-theme-primary: #3f51b5;
          --mdc-theme-on-secondary: white;
          --mdc-theme-secondary: #3f51b5;
        }
      </style>

      <google-map id="mapElement" latitude="${this.latitude}" longitude="${this.longitude}" zoom="14" min-zoom="9" max-zoom="20" styles="${this.styles}" language="en" api-key="${this.mapApiKey}">
      </google-map>

      <div class="floater">
        <mwc-button class="green" raised label="INFO" icon="info" @click="${this.openInfoDialog}">
        </mwc-button>
      </div>

      <paper-dialog id="infoDialog" modal>
        <p>Welcome to Ambitent Map demo! This web application demonstrates how Ambient light sensor can be used to control style of a map widget. When ambient illuminance level is less than 10 lumen, night mode style will be used.${'AmbientLightSensor' in window ? "" : " Unfortunately, your device doesn't have support for Ambient light sensor."}</p>
        <div class="buttons">
          <mwc-button class="blue" dialog-confirm autofocus>Close</mwc-button>
        </div>
      </paper-dialog>
    `;
  }
}

customElements.define('ambientmap-app', AmbientmapApp);
