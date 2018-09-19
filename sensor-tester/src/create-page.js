import {LitElement, html, property} from '@polymer/lit-element';

export const createPage = (tagName, options) => {
  if (customElements.get(tagName)) {
    return;
  }
  customElements.define(tagName, class extends LitElement {
    render() {
      return html`
        <sensor-tests-page
          tests="${options.src}"
          sensortype="${options.sensorType}"
          referenceframe="${options.referenceFrame || 'device'}"
          frequency="${options.frequency || 60}">
        </sensor-tests-page>
      `;
    }
  });
}