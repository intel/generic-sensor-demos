import {LitElement, html} from '@polymer/lit-element';

const lazyObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.srcset = lazyImage.dataset.srcset || '';
      lazyImage.classList.remove("lazy");
      observer.unobserve(lazyImage);
    }
  });
});

const fallback = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><path d='M0,0h1v1H0' fill='%23fff'/></svg>`;

customElements.define("lazy-image", class extends LitElement {
  static get properties() {
    return {
      src: {type:String}
    }
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
          display: hidden;
        }
      </style>
      <img data-src="${this.src}" src="${fallback}" decoding="async" class="lazy"
        @error="${ev => ev.target.src = fallback}">
    `;
  }
});