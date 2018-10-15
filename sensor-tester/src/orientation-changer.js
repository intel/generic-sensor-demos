import {LitElement, html} from '@polymer/lit-element';

import "@material/mwc-radio";
import "@material/mwc-formfield";
import "@material/mwc-button";

export class OrientationChanger extends LitElement {
  static get properties() {
    return {
      log: {type:String}
    }
  }

  constructor() {
    super();
    const docEl = document.documentElement;
    this._requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullscreen
      || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    this._cancelFullScreen = document.exitFullscreen || document.webkitExitFullscreen
      || document.mozCancelFullScreen || document.msExitFullscreen;

    this.isChangedByMe = false;
    this.log = '';

    screen.orientation.addEventListener('change', () => {
      if (!this.isChangedByMe) {
        this.shadowRoot.querySelector('#one').checked = true;
      }
      // The event listener is called after lock() promise resolves.
      this.isChangedByMe = false;
    });
  }

  async lock(orientation) {
    this.log = '';
    this.isChangedByMe = true;
    this._requestFullScreen.call(document.documentElement);
    try {
      await screen.orientation.lock(orientation);
      // Chrome/Android bug: Accepts lock to portrait-secondary but doesn't
      // rotate and sent 'change' event.
      setTimeout(() => {
        this.isChangedByMe = false;
      }, 500);
    } catch(err) {
      console.log("Cannot lock to the requested orientation.");
      this.log = "Failed";
      this._cancelFullScreen.call(document);
      this.shadowRoot.querySelector('#one').checked = true;
      this.isChangedByMe = false;
    };
  }

  unlock() {
    screen.orientation.unlock();
    this._cancelFullScreen.call(document);
  }

  render() {
    return html`
      <div>If the device supports it, lock to desired orientation before running the tests.</div>
      ${this.log}
      <mwc-formfield label="0˚">
      <mwc-radio id="one" name="o" @click="${() => this.lock('portrait-primary')}" checked></mwc-radio>
      </mwc-formfield>
      <mwc-formfield label="90˚">
      <mwc-radio id="two" name="o" @click="${() => this.lock('landscape-primary')}"></mwc-radio>
      </mwc-formfield>
      <mwc-formfield label="180˚">
      <mwc-radio id="three" name="o" @click="${() => this.lock('portrait-secondary')}"></mwc-radio>
      </mwc-formfield>
      <mwc-formfield label="270˚">
      <mwc-radio id="four" name="o" @click="${() => this.lock('landscape-secondary')}"></mwc-radio>
      </mwc-formfield>
      <mwc-button @click="${_ => this.unlock()}">RESET</mwc-button>
    `
  }
}
customElements.define('orientation-changer', OrientationChanger);