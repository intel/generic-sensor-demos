import {LitElement, html} from '@polymer/lit-element';
import "@material/mwc-button/mwc-button.js";
import '@polymer/paper-dialog/paper-dialog.js';

class VrButtonApp extends LitElement{

  constructor() {
    super();
  }

  showInfoDialog() {
    this.infoDialog = this.shadowRoot.querySelector('#infoDialog');
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

      <div class="floater">
        <mwc-button class="green" raised label="INFO" icon="info" @click="${this.showInfoDialog}">
        </mwc-button>
      </div>

      <paper-dialog id="infoDialog" modal="">
        <p>Welcome to VR Button demo! This web application demonstrates how Magnetometer sensor can be used to provide user input for WebVR content. If you have VR enclosure with magnet button, you can interact with objects in the scene by sliding button down.${'Magnetometer' in window ? "" : " Unfortunately, your device doesn't have support for Magnetometer sensor."}</p>
        <div class="buttons">
          <mwc-button class="blue" dialog-confirm autofocus>Close</mwc-button>
        </div>
      </paper-dialog>
    `;
  }
}

customElements.define('vr-button-app', VrButtonApp);
