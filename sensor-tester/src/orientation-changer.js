import {LitElement, html} from '@polymer/lit-element';

import "@material/mwc-radio/mwc-radio.js";
import "@material/mwc-formfield/mwc-formfield.js";
import "@material/mwc-button/mwc-button.js";

export class OrientationChanger extends LitElement {
  constructor() {
    super();
    const docEl = document.documentElement;
    this._requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullscreen
      || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    this._cancelFullScreen = document.exitFullscreen || document.webkitExitFullscreen
      || document.mozCancelFullScreen || document.msExitFullscreen;
    this._orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {});
  }

  async lock(orientation) {
    this._requestFullScreen.call(document.documentElement);
    try {
      await this._orientation.lock(orientation);
    } catch(err) {
      console.log("screen.orientation.lock() is not available on this device.");
      this._cancelFullScreen.call(document);
    };
  }

  unlock() {
    this._orientation.unlock();
    this._cancelFullScreen.call(document);
    this.shadowRoot.querySelector('#one').checked = true;
  }

  render() {
    return html`
      <div>If the device supports it, lock to desired orientation before running the tests.</div>
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