import {LitElement, html} from '@polymer/lit-element';

const lazyObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.onload = () => {
        lazyImage.classList.remove("lazy");
      }
      observer.unobserve(lazyImage);
    }
  });
});

customElements.define("lazy-image", class extends LitElement {
  static get properties() {
    return { src: {type:String}}
  }

  firstUpdated() {
    const img = this.shadowRoot.querySelector('img');
    lazyObserver.observe(img);
  }

  render() {
    return html`
      <style>
        :host {
          width: 350px;
          height: 200px;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover
        }
        .lazy {
          visibility: hidden;
        }
      </style>
      <img data-src="${this.src}"
        decoding="async" class="lazy"
        @error="${ev => console.error(`Couldn't load ${this.src}`)}">
    `;
  }
});