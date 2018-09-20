/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
     * @template A
     */class MDCFoundation {
  /** @return enum{cssClasses} */static get cssClasses() {
    // Classes extending MDCFoundation should implement this method to return an object which exports every
    // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
    return {};
  } /** @return enum{strings} */

  static get strings() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
    return {};
  } /** @return enum{numbers} */

  static get numbers() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
    return {};
  } /** @return {!Object} */

  static get defaultAdapter() {
    // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
    // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
    // validation.
    return {};
  } /**
     * @param {A=} adapter
     */

  constructor(adapter = {}) {
    /** @protected {!A} */this.adapter_ = adapter;
  }

  init() {// Subclasses should override this method to perform initialization routines (registering events, etc.)
  }

  destroy() {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
  }

}

var foundation = {
  default: MDCFoundation
}; /**
    * @license
    * Copyright 2016 Google Inc.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * @template F
        */

class MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCComponent}
   */static attachTo(root) {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().
    return new MDCComponent(root, new MDCFoundation());
  } /**
     * @param {!Element} root
     * @param {F=} foundation
     * @param {...?} args
     */

  constructor(root, foundation = undefined, ...args) {
    /** @protected {!Element} */this.root_ = root;
    this.initialize(...args); // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    /** @protected {!F} */
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  initialize() /* ...args */{} // Subclasses can override this to do any additional setup work that would be considered part of a
  // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
  // initialized. Any additional arguments besides root and foundation will be passed in here.
  /**
   * @return {!F} foundation
   */

  getDefaultFoundation() {
    // Subclasses must override this method to return a properly configured foundation class for the
    // component.
    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');
  }

  initialSyncWithDOM() {// Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    this.foundation_.destroy();
  } /**
     * Wrapper method to add an event listener to the component's root element. This is most useful when
     * listening for custom events.
     * @param {string} evtType
     * @param {!Function} handler
     */

  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  } /**
     * Wrapper method to remove an event listener to the component's root element. This is most useful when
     * unlistening for custom events.
     * @param {string} evtType
     * @param {!Function} handler
     */

  unlisten(evtType, handler) {
    this.root_.removeEventListener(evtType, handler);
  } /**
     * Fires a cross-browser-compatible custom event from the component root of the given type,
     * with the given data.
     * @param {string} evtType
     * @param {!Object} evtData
     * @param {boolean=} shouldBubble
     */

  emit(evtType, evtData, shouldBubble = false) {
    let evt;

    if (typeof CustomEvent === 'function') {
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }

    this.root_.dispatchEvent(evt);
  }

}

var component = {
  default: MDCComponent
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /* eslint no-unused-vars: [2, {"args": "none"}] */ /**
                                                           * Adapter for MDC Form Field. Provides an interface for managing
                                                           * - event handlers
                                                           * - ripple activation
                                                           *
                                                           * Additionally, provides type information for the adapter to the Closure
                                                           * compiler.
                                                           *
                                                           * Implement this adapter for your framework of choice to delegate updates to
                                                           * the component in your framework of choice. See architecture documentation
                                                           * for more details.
                                                           * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
                                                           *
                                                           * @record
                                                           */

class MDCFormFieldAdapter {
  /**
   * @param {string} type
   * @param {!EventListener} handler
   */registerInteractionHandler(type, handler) {} /**
                                                   * @param {string} type
                                                   * @param {!EventListener} handler
                                                   */

  deregisterInteractionHandler(type, handler) {}

  activateInputRipple() {}

  deactivateInputRipple() {}

}

var adapter = {
  default: MDCFormFieldAdapter
}; /**
    * @license
    * Copyright 2017 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-form-field'
}; /** @enum {string} */
const strings = {
  LABEL_SELECTOR: '.mdc-form-field > label'
};
var constants = {
  cssClasses: cssClasses,
  strings: strings
}; /**
    * @license
    * Copyright 2017 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * @extends {MDCFoundation<!MDCFormFieldAdapter>}
        */

class MDCFormFieldFoundation extends MDCFoundation {
  /** @return enum {cssClasses} */static get cssClasses() {
    return cssClasses;
  } /** @return enum {strings} */

  static get strings() {
    return strings;
  } /** @return {!MDCFormFieldAdapter} */

  static get defaultAdapter() {
    return {
      registerInteractionHandler: () => /* type: string, handler: EventListener */{},
      deregisterInteractionHandler: () => /* type: string, handler: EventListener */{},
      activateInputRipple: () => {},
      deactivateInputRipple: () => {}
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCFormFieldFoundation.defaultAdapter, adapter)); /** @private {!EventListener} */

    this.clickHandler_ = /** @type {!EventListener} */() => this.handleClick_();
  }

  init() {
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
  } /** @private */

  handleClick_() {
    this.adapter_.activateInputRipple();
    requestAnimationFrame(() => this.adapter_.deactivateInputRipple());
  }

}

var foundation$1 = {
  default: MDCFormFieldFoundation
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /* eslint no-unused-vars: [2, {"args": "none"}] */ /**
                                                           * Adapter for MDC Ripple. Provides an interface for managing
                                                           * - classes
                                                           * - dom
                                                           * - CSS variables
                                                           * - position
                                                           * - dimensions
                                                           * - scroll position
                                                           * - event handlers
                                                           * - unbounded, active and disabled states
                                                           *
                                                           * Additionally, provides type information for the adapter to the Closure
                                                           * compiler.
                                                           *
                                                           * Implement this adapter for your framework of choice to delegate updates to
                                                           * the component in your framework of choice. See architecture documentation
                                                           * for more details.
                                                           * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
                                                           *
                                                           * @record
                                                           */

class MDCRippleAdapter {
  /** @return {boolean} */browserSupportsCssVars() {} /** @return {boolean} */

  isUnbounded() {} /** @return {boolean} */

  isSurfaceActive() {} /** @return {boolean} */

  isSurfaceDisabled() {} /** @param {string} className */

  addClass(className) {} /** @param {string} className */

  removeClass(className) {} /** @param {!EventTarget} target */

  containsEventTarget(target) {} /**
                                  * @param {string} evtType
                                  * @param {!Function} handler
                                  */

  registerInteractionHandler(evtType, handler) {} /**
                                                   * @param {string} evtType
                                                   * @param {!Function} handler
                                                   */

  deregisterInteractionHandler(evtType, handler) {} /**
                                                     * @param {string} evtType
                                                     * @param {!Function} handler
                                                     */

  registerDocumentInteractionHandler(evtType, handler) {} /**
                                                           * @param {string} evtType
                                                           * @param {!Function} handler
                                                           */

  deregisterDocumentInteractionHandler(evtType, handler) {} /**
                                                             * @param {!Function} handler
                                                             */

  registerResizeHandler(handler) {} /**
                                     * @param {!Function} handler
                                     */

  deregisterResizeHandler(handler) {} /**
                                       * @param {string} varName
                                       * @param {?number|string} value
                                       */

  updateCssVariable(varName, value) {} /** @return {!ClientRect} */

  computeBoundingRect() {} /** @return {{x: number, y: number}} */

  getWindowPageOffset() {}

}

var adapter$1 = {
  default: MDCRippleAdapter
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
const cssClasses$1 = {
  // Ripple is a special case where the "root" component is really a "mixin" of sorts,
  // given that it's an 'upgrade' to an existing component. That being said it is the root
  // CSS class that all other CSS classes derive from.
  ROOT: 'mdc-ripple-upgraded',
  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation'
};
const strings$1 = {
  VAR_LEFT: '--mdc-ripple-left',
  VAR_TOP: '--mdc-ripple-top',
  VAR_FG_SIZE: '--mdc-ripple-fg-size',
  VAR_FG_SCALE: '--mdc-ripple-fg-scale',
  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end'
};
const numbers = {
  PADDING: 10,
  INITIAL_ORIGIN_SCALE: 0.6,
  DEACTIVATION_TIMEOUT_MS: 225,
  // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)
  FG_DEACTIVATION_MS: 150,
  // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)
  TAP_DELAY_MS: 300 // Delay between touch and simulated mouse events on touch devices

};
var constants$1 = {
  cssClasses: cssClasses$1,
  strings: strings$1,
  numbers: numbers
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.
        * @private {boolean|undefined}
        */
let supportsCssVariables_; /**
                            * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.
                            * @private {boolean|undefined}
                            */
let supportsPassive_; /**
                       * @param {!Window} windowObj
                       * @return {boolean}
                       */

function detectEdgePseudoVarBug(windowObj) {
  // Detect versions of Edge with buggy var() support
  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/
  const document = windowObj.document;
  const node = document.createElement('div');
  node.className = 'mdc-ripple-surface--test-edge-var-bug';
  document.body.appendChild(node); // The bug exists if ::before style ends up propagating to the parent element.
  // Additionally, getComputedStyle returns null in iframes with display: "none" in Firefox,
  // but Firefox is known to support CSS custom properties correctly.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397

  const computedStyle = windowObj.getComputedStyle(node);
  const hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';
  node.remove();
  return hasPseudoVarBug;
} /**
   * @param {!Window} windowObj
   * @param {boolean=} forceRefresh
   * @return {boolean|undefined}
   */

function supportsCssVariables(windowObj, forceRefresh = false) {
  let supportsCssVariables = supportsCssVariables_;

  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
    return supportsCssVariables;
  }

  const supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';

  if (!supportsFunctionPresent) {
    return;
  }

  const explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes'); // See: https://bugs.webkit.org/show_bug.cgi?id=154669
  // See: README section on Safari

  const weAreFeatureDetectingSafari10plus = windowObj.CSS.supports('(--css-vars: yes)') && windowObj.CSS.supports('color', '#00000000');

  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {
    supportsCssVariables = !detectEdgePseudoVarBug(windowObj);
  } else {
    supportsCssVariables = false;
  }

  if (!forceRefresh) {
    supportsCssVariables_ = supportsCssVariables;
  }

  return supportsCssVariables;
} //
/**
 * Determine whether the current browser supports passive event listeners, and if so, use them.
 * @param {!Window=} globalObj
 * @param {boolean=} forceRefresh
 * @return {boolean|{passive: boolean}}
 */

function applyPassive(globalObj = window, forceRefresh = false) {
  if (supportsPassive_ === undefined || forceRefresh) {
    let isSupported = false;

    try {
      globalObj.document.addEventListener('test', null, {
        get passive() {
          isSupported = true;
        }

      });
    } catch (e) {}

    supportsPassive_ = isSupported;
  }

  return supportsPassive_ ? {
    passive: true
  } : false;
} /**
   * @param {!Object} HTMLElementPrototype
   * @return {!Array<string>}
   */

function getMatchesProperty(HTMLElementPrototype) {
  return ['webkitMatchesSelector', 'msMatchesSelector', 'matches'].filter(p => p in HTMLElementPrototype).pop();
} /**
   * @param {!Event} ev
   * @param {{x: number, y: number}} pageOffset
   * @param {!ClientRect} clientRect
   * @return {{x: number, y: number}}
   */

function getNormalizedEventCoords(ev, pageOffset, clientRect) {
  const {
    x,
    y
  } = pageOffset;
  const documentX = x + clientRect.left;
  const documentY = y + clientRect.top;
  let normalizedX;
  let normalizedY; // Determine touch point relative to the ripple container.

  if (ev.type === 'touchstart') {
    normalizedX = ev.changedTouches[0].pageX - documentX;
    normalizedY = ev.changedTouches[0].pageY - documentY;
  } else {
    normalizedX = ev.pageX - documentX;
    normalizedY = ev.pageY - documentY;
  }

  return {
    x: normalizedX,
    y: normalizedY
  };
}

var util = {
  supportsCssVariables: supportsCssVariables,
  applyPassive: applyPassive,
  getMatchesProperty: getMatchesProperty,
  getNormalizedEventCoords: getNormalizedEventCoords
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * @typedef {{
        *   isActivated: (boolean|undefined),
        *   hasDeactivationUXRun: (boolean|undefined),
        *   wasActivatedByPointer: (boolean|undefined),
        *   wasElementMadeActive: (boolean|undefined),
        *   activationEvent: Event,
        *   isProgrammatic: (boolean|undefined)
        * }}
        */
let ActivationStateType; /**
                          * @typedef {{
                          *   activate: (string|undefined),
                          *   deactivate: (string|undefined),
                          *   focus: (string|undefined),
                          *   blur: (string|undefined)
                          * }}
                          */
let ListenerInfoType; /**
                       * @typedef {{
                       *   activate: function(!Event),
                       *   deactivate: function(!Event),
                       *   focus: function(),
                       *   blur: function()
                       * }}
                       */
let ListenersType; /**
                    * @typedef {{
                    *   x: number,
                    *   y: number
                    * }}
                    */
let PointType; // Activation events registered on the root element of each instance for activation

const ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown']; // Deactivation events registered on documentElement when a pointer-related down event occurs

const POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup']; // Tracks activations that have occurred on the current frame, to avoid simultaneous nested activations
/** @type {!Array<!EventTarget>} */
let activatedTargets = []; /**
                            * @extends {MDCFoundation<!MDCRippleAdapter>}
                            */

class MDCRippleFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses$1;
  }

  static get strings() {
    return strings$1;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter() {
    return {
      browserSupportsCssVars: () => /* boolean - cached */{},
      isUnbounded: () => /* boolean */{},
      isSurfaceActive: () => /* boolean */{},
      isSurfaceDisabled: () => /* boolean */{},
      addClass: () => /* className: string */{},
      removeClass: () => /* className: string */{},
      containsEventTarget: () => /* target: !EventTarget */{},
      registerInteractionHandler: () => /* evtType: string, handler: EventListener */{},
      deregisterInteractionHandler: () => /* evtType: string, handler: EventListener */{},
      registerDocumentInteractionHandler: () => /* evtType: string, handler: EventListener */{},
      deregisterDocumentInteractionHandler: () => /* evtType: string, handler: EventListener */{},
      registerResizeHandler: () => /* handler: EventListener */{},
      deregisterResizeHandler: () => /* handler: EventListener */{},
      updateCssVariable: () => /* varName: string, value: string */{},
      computeBoundingRect: () => /* ClientRect */{},
      getWindowPageOffset: () => /* {x: number, y: number} */{}
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCRippleFoundation.defaultAdapter, adapter)); /** @private {number} */
    this.layoutFrame_ = 0; /** @private {!ClientRect} */
    this.frame_ = /** @type {!ClientRect} */{
      width: 0,
      height: 0
    }; /** @private {!ActivationStateType} */
    this.activationState_ = this.defaultActivationState_(); /** @private {number} */
    this.initialSize_ = 0; /** @private {number} */
    this.maxRadius_ = 0; /** @private {function(!Event)} */

    this.activateHandler_ = e => this.activate_(e); /** @private {function(!Event)} */

    this.deactivateHandler_ = e => this.deactivate_(e); /** @private {function(?Event=)} */

    this.focusHandler_ = () => requestAnimationFrame(() => this.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED)); /** @private {function(?Event=)} */

    this.blurHandler_ = () => requestAnimationFrame(() => this.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED)); /** @private {!Function} */

    this.resizeHandler_ = () => this.layout(); /** @private {{left: number, top:number}} */

    this.unboundedCoords_ = {
      left: 0,
      top: 0
    }; /** @private {number} */
    this.fgScale_ = 0; /** @private {number} */
    this.activationTimer_ = 0; /** @private {number} */
    this.fgDeactivationRemovalTimer_ = 0; /** @private {boolean} */
    this.activationAnimationHasEnded_ = false; /** @private {!Function} */

    this.activationTimerCallback_ = () => {
      this.activationAnimationHasEnded_ = true;
      this.runDeactivationUXLogicIfReady_();
    }; /** @private {?Event} */

    this.previousActivationEvent_ = null;
  } /**
     * We compute this property so that we are not querying information about the client
     * until the point in time where the foundation requests it. This prevents scenarios where
     * client-side feature-detection may happen too early, such as when components are rendered on the server
     * and then initialized at mount time on the client.
     * @return {boolean}
     * @private
     */

  isSupported_() {
    return this.adapter_.browserSupportsCssVars();
  } /**
     * @return {!ActivationStateType}
     */

  defaultActivationState_() {
    return {
      isActivated: false,
      hasDeactivationUXRun: false,
      wasActivatedByPointer: false,
      wasElementMadeActive: false,
      activationEvent: null,
      isProgrammatic: false
    };
  }

  init() {
    if (!this.isSupported_()) {
      return;
    }

    this.registerRootHandlers_();
    const {
      ROOT,
      UNBOUNDED
    } = MDCRippleFoundation.cssClasses;
    requestAnimationFrame(() => {
      this.adapter_.addClass(ROOT);

      if (this.adapter_.isUnbounded()) {
        this.adapter_.addClass(UNBOUNDED); // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple

        this.layoutInternal_();
      }
    });
  }

  destroy() {
    if (!this.isSupported_()) {
      return;
    }

    if (this.activationTimer_) {
      clearTimeout(this.activationTimer_);
      this.activationTimer_ = 0;
      const {
        FG_ACTIVATION
      } = MDCRippleFoundation.cssClasses;
      this.adapter_.removeClass(FG_ACTIVATION);
    }

    this.deregisterRootHandlers_();
    this.deregisterDeactivationHandlers_();
    const {
      ROOT,
      UNBOUNDED
    } = MDCRippleFoundation.cssClasses;
    requestAnimationFrame(() => {
      this.adapter_.removeClass(ROOT);
      this.adapter_.removeClass(UNBOUNDED);
      this.removeCssVars_();
    });
  } /** @private */

  registerRootHandlers_() {
    ACTIVATION_EVENT_TYPES.forEach(type => {
      this.adapter_.registerInteractionHandler(type, this.activateHandler_);
    });
    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);

    if (this.adapter_.isUnbounded()) {
      this.adapter_.registerResizeHandler(this.resizeHandler_);
    }
  } /**
     * @param {!Event} e
     * @private
     */

  registerDeactivationHandlers_(e) {
    if (e.type === 'keydown') {
      this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);
    } else {
      POINTER_DEACTIVATION_EVENT_TYPES.forEach(type => {
        this.adapter_.registerDocumentInteractionHandler(type, this.deactivateHandler_);
      });
    }
  } /** @private */

  deregisterRootHandlers_() {
    ACTIVATION_EVENT_TYPES.forEach(type => {
      this.adapter_.deregisterInteractionHandler(type, this.activateHandler_);
    });
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);

    if (this.adapter_.isUnbounded()) {
      this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    }
  } /** @private */

  deregisterDeactivationHandlers_() {
    this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);
    POINTER_DEACTIVATION_EVENT_TYPES.forEach(type => {
      this.adapter_.deregisterDocumentInteractionHandler(type, this.deactivateHandler_);
    });
  } /** @private */

  removeCssVars_() {
    const {
      strings
    } = MDCRippleFoundation;
    Object.keys(strings).forEach(k => {
      if (k.indexOf('VAR_') === 0) {
        this.adapter_.updateCssVariable(strings[k], null);
      }
    });
  } /**
     * @param {?Event} e
     * @private
     */

  activate_(e) {
    if (this.adapter_.isSurfaceDisabled()) {
      return;
    }

    const activationState = this.activationState_;

    if (activationState.isActivated) {
      return;
    } // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction


    const previousActivationEvent = this.previousActivationEvent_;
    const isSameInteraction = previousActivationEvent && e && previousActivationEvent.type !== e.type;

    if (isSameInteraction) {
      return;
    }

    activationState.isActivated = true;
    activationState.isProgrammatic = e === null;
    activationState.activationEvent = e;
    activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown';
    const hasActivatedChild = e && activatedTargets.length > 0 && activatedTargets.some(target => this.adapter_.containsEventTarget(target));

    if (hasActivatedChild) {
      // Immediately reset activation state, while preserving logic that prevents touch follow-on events
      this.resetActivationState_();
      return;
    }

    if (e) {
      activatedTargets.push( /** @type {!EventTarget} */e.target);
      this.registerDeactivationHandlers_(e);
    }

    activationState.wasElementMadeActive = this.checkElementMadeActive_(e);

    if (activationState.wasElementMadeActive) {
      this.animateActivation_();
    }

    requestAnimationFrame(() => {
      // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
      activatedTargets = [];

      if (!activationState.wasElementMadeActive && (e.key === ' ' || e.keyCode === 32)) {
        // If space was pressed, try again within an rAF call to detect :active, because different UAs report
        // active states inconsistently when they're called within event handling code:
        // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
        // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
        // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
        // variable is set within a rAF callback for a submit button interaction (#2241).
        activationState.wasElementMadeActive = this.checkElementMadeActive_(e);

        if (activationState.wasElementMadeActive) {
          this.animateActivation_();
        }
      }

      if (!activationState.wasElementMadeActive) {
        // Reset activation state immediately if element was not made active.
        this.activationState_ = this.defaultActivationState_();
      }
    });
  } /**
     * @param {?Event} e
     * @private
     */

  checkElementMadeActive_(e) {
    return e && e.type === 'keydown' ? this.adapter_.isSurfaceActive() : true;
  } /**
     * @param {?Event=} event Optional event containing position information.
     */

  activate(event = null) {
    this.activate_(event);
  } /** @private */

  animateActivation_() {
    const {
      VAR_FG_TRANSLATE_START,
      VAR_FG_TRANSLATE_END
    } = MDCRippleFoundation.strings;
    const {
      FG_DEACTIVATION,
      FG_ACTIVATION
    } = MDCRippleFoundation.cssClasses;
    const {
      DEACTIVATION_TIMEOUT_MS
    } = MDCRippleFoundation.numbers;
    this.layoutInternal_();
    let translateStart = '';
    let translateEnd = '';

    if (!this.adapter_.isUnbounded()) {
      const {
        startPoint,
        endPoint
      } = this.getFgTranslationCoordinates_();
      translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
    }

    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd); // Cancel any ongoing activation/deactivation animations

    clearTimeout(this.activationTimer_);
    clearTimeout(this.fgDeactivationRemovalTimer_);
    this.rmBoundedActivationClasses_();
    this.adapter_.removeClass(FG_DEACTIVATION); // Force layout in order to re-trigger the animation.

    this.adapter_.computeBoundingRect();
    this.adapter_.addClass(FG_ACTIVATION);
    this.activationTimer_ = setTimeout(() => this.activationTimerCallback_(), DEACTIVATION_TIMEOUT_MS);
  } /**
     * @private
     * @return {{startPoint: PointType, endPoint: PointType}}
     */

  getFgTranslationCoordinates_() {
    const {
      activationEvent,
      wasActivatedByPointer
    } = this.activationState_;
    let startPoint;

    if (wasActivatedByPointer) {
      startPoint = getNormalizedEventCoords( /** @type {!Event} */activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());
    } else {
      startPoint = {
        x: this.frame_.width / 2,
        y: this.frame_.height / 2
      };
    } // Center the element around the start point.


    startPoint = {
      x: startPoint.x - this.initialSize_ / 2,
      y: startPoint.y - this.initialSize_ / 2
    };
    const endPoint = {
      x: this.frame_.width / 2 - this.initialSize_ / 2,
      y: this.frame_.height / 2 - this.initialSize_ / 2
    };
    return {
      startPoint,
      endPoint
    };
  } /** @private */

  runDeactivationUXLogicIfReady_() {
    // This method is called both when a pointing device is released, and when the activation animation ends.
    // The deactivation animation should only run after both of those occur.
    const {
      FG_DEACTIVATION
    } = MDCRippleFoundation.cssClasses;
    const {
      hasDeactivationUXRun,
      isActivated
    } = this.activationState_;
    const activationHasEnded = hasDeactivationUXRun || !isActivated;

    if (activationHasEnded && this.activationAnimationHasEnded_) {
      this.rmBoundedActivationClasses_();
      this.adapter_.addClass(FG_DEACTIVATION);
      this.fgDeactivationRemovalTimer_ = setTimeout(() => {
        this.adapter_.removeClass(FG_DEACTIVATION);
      }, numbers.FG_DEACTIVATION_MS);
    }
  } /** @private */

  rmBoundedActivationClasses_() {
    const {
      FG_ACTIVATION
    } = MDCRippleFoundation.cssClasses;
    this.adapter_.removeClass(FG_ACTIVATION);
    this.activationAnimationHasEnded_ = false;
    this.adapter_.computeBoundingRect();
  }

  resetActivationState_() {
    this.previousActivationEvent_ = this.activationState_.activationEvent;
    this.activationState_ = this.defaultActivationState_(); // Touch devices may fire additional events for the same interaction within a short time.
    // Store the previous event until it's safe to assume that subsequent events are for new interactions.

    setTimeout(() => this.previousActivationEvent_ = null, MDCRippleFoundation.numbers.TAP_DELAY_MS);
  } /**
     * @param {?Event} e
     * @private
     */

  deactivate_(e) {
    const activationState = this.activationState_; // This can happen in scenarios such as when you have a keyup event that blurs the element.

    if (!activationState.isActivated) {
      return;
    }

    const state = /** @type {!ActivationStateType} */Object.assign({}, activationState);

    if (activationState.isProgrammatic) {
      const evtObject = null;
      requestAnimationFrame(() => this.animateDeactivation_(evtObject, state));
      this.resetActivationState_();
    } else {
      this.deregisterDeactivationHandlers_();
      requestAnimationFrame(() => {
        this.activationState_.hasDeactivationUXRun = true;
        this.animateDeactivation_(e, state);
        this.resetActivationState_();
      });
    }
  } /**
     * @param {?Event=} event Optional event containing position information.
     */

  deactivate(event = null) {
    this.deactivate_(event);
  } /**
     * @param {Event} e
     * @param {!ActivationStateType} options
     * @private
     */

  animateDeactivation_(e, {
    wasActivatedByPointer,
    wasElementMadeActive
  }) {
    if (wasActivatedByPointer || wasElementMadeActive) {
      this.runDeactivationUXLogicIfReady_();
    }
  }

  layout() {
    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
    }

    this.layoutFrame_ = requestAnimationFrame(() => {
      this.layoutInternal_();
      this.layoutFrame_ = 0;
    });
  } /** @private */

  layoutInternal_() {
    this.frame_ = this.adapter_.computeBoundingRect();
    const maxDim = Math.max(this.frame_.height, this.frame_.width); // Surface diameter is treated differently for unbounded vs. bounded ripples.
    // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
    // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
    // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
    // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
    // `overflow: hidden`.

    const getBoundedRadius = () => {
      const hypotenuse = Math.sqrt(Math.pow(this.frame_.width, 2) + Math.pow(this.frame_.height, 2));
      return hypotenuse + MDCRippleFoundation.numbers.PADDING;
    };

    this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius(); // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform

    this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;
    this.fgScale_ = this.maxRadius_ / this.initialSize_;
    this.updateLayoutCssVars_();
  } /** @private */

  updateLayoutCssVars_() {
    const {
      VAR_FG_SIZE,
      VAR_LEFT,
      VAR_TOP,
      VAR_FG_SCALE
    } = MDCRippleFoundation.strings;
    this.adapter_.updateCssVariable(VAR_FG_SIZE, `${this.initialSize_}px`);
    this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);

    if (this.adapter_.isUnbounded()) {
      this.unboundedCoords_ = {
        left: Math.round(this.frame_.width / 2 - this.initialSize_ / 2),
        top: Math.round(this.frame_.height / 2 - this.initialSize_ / 2)
      };
      this.adapter_.updateCssVariable(VAR_LEFT, `${this.unboundedCoords_.left}px`);
      this.adapter_.updateCssVariable(VAR_TOP, `${this.unboundedCoords_.top}px`);
    }
  } /** @param {boolean} unbounded */

  setUnbounded(unbounded) {
    const {
      UNBOUNDED
    } = MDCRippleFoundation.cssClasses;

    if (unbounded) {
      this.adapter_.addClass(UNBOUNDED);
    } else {
      this.adapter_.removeClass(UNBOUNDED);
    }
  }

}

var foundation$2 = {
  default: MDCRippleFoundation
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * @extends MDCComponent<!MDCRippleFoundation>
        */

class MDCRipple extends MDCComponent {
  /** @param {...?} args */constructor(...args) {
    super(...args); /** @type {boolean} */
    this.disabled = false; /** @private {boolean} */
    this.unbounded_;
  } /**
     * @param {!Element} root
     * @param {{isUnbounded: (boolean|undefined)}=} options
     * @return {!MDCRipple}
     */

  static attachTo(root, {
    isUnbounded = undefined
  } = {}) {
    const ripple = new MDCRipple(root); // Only override unbounded behavior if option is explicitly specified

    if (isUnbounded !== undefined) {
      ripple.unbounded = /** @type {boolean} */isUnbounded;
    }

    return ripple;
  } /**
     * @param {!RippleCapableSurface} instance
     * @return {!MDCRippleAdapter}
     */

  static createAdapter(instance) {
    const MATCHES = getMatchesProperty(HTMLElement.prototype);
    return {
      browserSupportsCssVars: () => supportsCssVariables(window),
      isUnbounded: () => instance.unbounded,
      isSurfaceActive: () => instance.root_[MATCHES](':active'),
      isSurfaceDisabled: () => instance.disabled,
      addClass: className => instance.root_.classList.add(className),
      removeClass: className => instance.root_.classList.remove(className),
      containsEventTarget: target => instance.root_.contains(target),
      registerInteractionHandler: (evtType, handler) => instance.root_.addEventListener(evtType, handler, applyPassive()),
      deregisterInteractionHandler: (evtType, handler) => instance.root_.removeEventListener(evtType, handler, applyPassive()),
      registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
      deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
      registerResizeHandler: handler => window.addEventListener('resize', handler),
      deregisterResizeHandler: handler => window.removeEventListener('resize', handler),
      updateCssVariable: (varName, value) => instance.root_.style.setProperty(varName, value),
      computeBoundingRect: () => instance.root_.getBoundingClientRect(),
      getWindowPageOffset: () => ({
        x: window.pageXOffset,
        y: window.pageYOffset
      })
    };
  } /** @return {boolean} */

  get unbounded() {
    return this.unbounded_;
  } /** @param {boolean} unbounded */

  set unbounded(unbounded) {
    this.unbounded_ = Boolean(unbounded);
    this.setUnbounded_();
  } /**
     * Closure Compiler throws an access control error when directly accessing a
     * protected or private property inside a getter/setter, like unbounded above.
     * By accessing the protected property inside a method, we solve that problem.
     * That's why this function exists.
     * @private
     */

  setUnbounded_() {
    this.foundation_.setUnbounded(this.unbounded_);
  }

  activate() {
    this.foundation_.activate();
  }

  deactivate() {
    this.foundation_.deactivate();
  }

  layout() {
    this.foundation_.layout();
  } /** @return {!MDCRippleFoundation} */

  getDefaultFoundation() {
    return new MDCRippleFoundation(MDCRipple.createAdapter(this));
  }

  initialSyncWithDOM() {
    this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;
  }

} /**
   * See Material Design spec for more details on when to use ripples.
   * https://material.io/guidelines/motion/choreography.html#choreography-creation
   * @record
   */

class RippleCapableSurface {} /** @protected {!Element} */

RippleCapableSurface.prototype.root_; /**
                                       * Whether or not the ripple bleeds out of the bounds of the element.
                                       * @type {boolean|undefined}
                                       */
RippleCapableSurface.prototype.unbounded; /**
                                           * Whether or not the ripple is attached to a disabled component.
                                           * @type {boolean|undefined}
                                           */
RippleCapableSurface.prototype.disabled;
var index = {
  MDCRipple: MDCRipple,
  MDCRippleFoundation: MDCRippleFoundation,
  RippleCapableSurface: RippleCapableSurface,
  util: util
}; /**
    * @license
    * Copyright 2017 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /* eslint-enable no-unused-vars */ /**
                                           * @typedef {{
                                           *   checked: boolean,
                                           *   indeterminate: boolean,
                                           *   disabled: boolean,
                                           *   value: ?string
                                           * }}
                                           */
let MDCSelectionControlState; /**
                               * @record
                               */

class MDCSelectionControl {
  /** @return {?MDCRipple} */get ripple() {}

}

var index$1 = {
  MDCSelectionControlState: MDCSelectionControlState,
  MDCSelectionControl: MDCSelectionControl
}; /**
    * @license
    * Copyright 2017 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /* eslint-enable no-unused-vars */ /**
                                           * @extends MDCComponent<!MDCFormFieldFoundation>
                                           */

class MDCFormField extends MDCComponent {
  static attachTo(root) {
    return new MDCFormField(root);
  } /** @param {?MDCSelectionControl} input */

  set input(input) {
    this.input_ = input;
  } /** @return {?MDCSelectionControl} */

  get input() {
    return this.input_;
  }

  constructor(...args) {
    super(...args); /** @private {?MDCSelectionControl} */
    this.input_;
  } /**
     * @return {!Element}
     * @private
     */

  get label_() {
    const {
      LABEL_SELECTOR
    } = MDCFormFieldFoundation.strings;
    return (/** @type {!Element} */this.root_.querySelector(LABEL_SELECTOR)
    );
  } /** @return {!MDCFormFieldFoundation} */

  getDefaultFoundation() {
    return new MDCFormFieldFoundation({
      registerInteractionHandler: (type, handler) => this.label_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.label_.removeEventListener(type, handler),
      activateInputRipple: () => {
        if (this.input_ && this.input_.ripple) {
          this.input_.ripple.activate();
        }
      },
      deactivateInputRipple: () => {
        if (this.input_ && this.input_.ripple) {
          this.input_.ripple.deactivate();
        }
      }
    });
  }

}

var index$2 = {
  MDCFormField: MDCFormField,
  MDCFormFieldFoundation: MDCFormFieldFoundation
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * An expression marker with embedded unique key to avoid collision with
        * possible text in templates.
        */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`; /**
                                                             * An expression marker used text-positions, not attribute positions,
                                                             * in template.
                                                             */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);

const rewritesStyleAttribute = (() => {
  const el = document.createElement('div');
  el.setAttribute('style', '{{bad value}}');
  return el.getAttribute('style') !== '{{bad value}}';
})(); /**
       * An updateable Template that tracks the location of dynamic parts.
       */

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    let index = -1;
    let partIndex = 0;
    const nodesToRemove = [];

    const _prepareTemplate = template => {
      const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                                                            NodeFilter.SHOW_TEXT */, null, false); // The actual previous node, accounting for removals: if a node is removed
      // it will never be the previousNode.

      let previousNode; // Used to set previousNode at the top of the loop.

      let currentNode;

      while (walker.nextNode()) {
        index++;
        previousNode = currentNode;
        const node = currentNode = walker.currentNode;

        if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
            if (node.hasAttributes()) {
              const attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              let count = 0;

              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = result.strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // If the attribute name contains special characters, lower-case
                // it so that on XML nodes with case-sensitive getAttribute() we
                // can still find the attribute, which will have been lower-cased
                // by the parser.
                //
                // If the attribute name doesn't contain special character, it's
                // important to _not_ lower-case it, in case the name is
                // case-sensitive, like with XML attributes like "viewBox".

                const attributeLookupName = rewritesStyleAttribute && name === 'style' ? 'style$' : /^[a-zA-Z-]*$/.test(name) ? name : name.toLowerCase();
                const attributeValue = node.getAttribute(attributeLookupName);
                const strings = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings
                });
                node.removeAttribute(attributeLookupName);
                partIndex += strings.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              _prepareTemplate(node);
            }
          } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
            const nodeValue = node.nodeValue;

            if (nodeValue.indexOf(marker) < 0) {
              continue;
            }

            const parent = node.parentNode;
            const strings = nodeValue.split(markerRegex);
            const lastIndex = strings.length - 1; // We have a part for each match found

            partIndex += lastIndex; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
              this.parts.push({
                type: 'node',
                index: index++
              });
            }

            parent.insertBefore(strings[lastIndex] === '' ? createMarker() : document.createTextNode(strings[lastIndex]), node);
            nodesToRemove.push(node);
          } else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
            if (node.nodeValue === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * previousSibling is being removed (thus it's not the
              //    `previousNode`)
              //  * previousSibling is not a Text node
              //
              // TODO(justinfagnani): We should be able to use the previousNode
              // here as the marker node and reduce the number of extra nodes we
              // add to a template. See
              // https://github.com/PolymerLabs/lit-html/issues/147

              const previousSibling = node.previousSibling;

              if (previousSibling === null || previousSibling !== previousNode || previousSibling.nodeType !== Node.TEXT_NODE) {
                parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              this.parts.push({
                type: 'node',
                index: index++
              });
              nodesToRemove.push(node); // If we don't have a nextSibling add a marker node.
              // We don't have to check if the next node is going to be removed,
              // because that node will induce a new marker if so.

              if (node.nextSibling === null) {
                parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              currentNode = previousNode;
              partIndex++;
            } else {
              let i = -1;

              while ((i = node.nodeValue.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


const createMarker = () => document.createComment(''); /**
                                                        * This regex extracts the attribute name preceding an attribute-position
                                                        * expression. It does this by matching the syntax allowed for attributes
                                                        * against the string literal directly preceding the expression, assuming that
                                                        * the expression is in an attribute-value position.
                                                        *
                                                        * See attributes in the HTML spec:
                                                        * https://www.w3.org/TR/html5/syntax.html#attributes-0
                                                        *
                                                        * "\0-\x1F\x7F-\x9F" are Unicode control characters
                                                        *
                                                        * " \x09\x0a\x0c\x0d" are HTML space characters:
                                                        * https://www.w3.org/TR/html5/infrastructure.html#space-character
                                                        *
                                                        * So an attribute is:
                                                        *  * The name: any character except a control character, space character, ('),
                                                        *    ("), ">", "=", or "/"
                                                        *  * Followed by zero or more space characters
                                                        *  * Followed by "="
                                                        *  * Followed by zero or more space characters
                                                        *  * Followed by:
                                                        *    * Any character except space, ('), ("), "<", ">", "=", (`), or
                                                        *    * (") then any non-("), or
                                                        *    * (') then any non-(')
                                                        */

const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
var template = {
  marker: marker,
  nodeMarker: nodeMarker,
  markerRegex: markerRegex,
  rewritesStyleAttribute: rewritesStyleAttribute,
  Template: Template,
  isTemplatePartActive: isTemplatePartActive,
  createMarker: createMarker,
  lastAttributeNameRegex: lastAttributeNameRegex
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */
const walkerNodeFilter = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT; /**
                                                                                                    * Removes the list of nodes from a Template safely. In addition to removing
                                                                                                    * nodes from the Template, the Template part indices are updated to match
                                                                                                    * the mutated Template DOM.
                                                                                                    *
                                                                                                    * As the template is walked the removal state is tracked and
                                                                                                    * part indices are adjusted as needed.
                                                                                                    *
                                                                                                    * div
                                                                                                    *   div#1 (remove) <-- start removing (removing node is div#1)
                                                                                                    *     div
                                                                                                    *       div#2 (remove)  <-- continue removing (removing node is still div#1)
                                                                                                    *         div
                                                                                                    * div <-- stop removing since previous sibling is the removing node (div#1,
                                                                                                    * removed 4 nodes)
                                                                                                    */

function removeNodesFromTemplate(template, nodesToRemove) {
  const {
    element: {
      content
    },
    parts
  } = template;
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let part = parts[partIndex];
  let nodeIndex = -1;
  let removeCount = 0;
  const nodesToRemoveInTemplate = [];
  let currentRemovingNode = null;

  while (walker.nextNode()) {
    nodeIndex++;
    const node = walker.currentNode; // End removal if stepped past the removing node

    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    } // A node to remove was found in the template


    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node); // Track node we're removing

      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    } // When removing, increment count by which to adjust subsequent part indices


    if (currentRemovingNode !== null) {
      removeCount++;
    }

    while (part !== undefined && part.index === nodeIndex) {
      // If part is in a removed node deactivate it by setting index to -1 or
      // adjust the index as needed.
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      part = parts[partIndex];
    }
  }

  nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
}

const countNodes = node => {
  let count = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? 0 : 1;
  const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

  while (walker.nextNode()) {
    count++;
  }

  return count;
};

const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
  for (let i = startIndex + 1; i < parts.length; i++) {
    const part = parts[i];

    if (isTemplatePartActive(part)) {
      return i;
    }
  }

  return -1;
}; /**
    * Inserts the given node into the Template, optionally before the given
    * refNode. In addition to inserting the node into the Template, the Template
    * part indices are updated to match the mutated Template DOM.
    */

function insertNodeIntoTemplate(template, node, refNode = null) {
  const {
    element: {
      content
    },
    parts
  } = template; // If there's no refNode, then put node at end of template.
  // No part indices need to be shifted in this case.

  if (refNode === null || refNode === undefined) {
    content.appendChild(node);
    return;
  }

  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let insertCount = 0;
  let walkerIndex = -1;

  while (walker.nextNode()) {
    walkerIndex++;
    const walkerNode = walker.currentNode;

    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }

    while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
      // If we've inserted the node, simply adjust all subsequent parts
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }

        return;
      }

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
    }
  }
}

var modifyTemplate = {
  removeNodesFromTemplate: removeNodesFromTemplate,
  insertNodeIntoTemplate: insertNodeIntoTemplate
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined; /**
                                                                                                                            * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
                                                                                                                            * (exclusive), into another container (could be the same container), before
                                                                                                                            * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
                                                                                                                            * container.
                                                                                                                            */

const reparentNodes = (container, start, end = null, before = null) => {
  let node = start;

  while (node !== end) {
    const n = node.nextSibling;
    container.insertBefore(node, before);
    node = n;
  }
}; /**
    * Removes nodes, starting from `startNode` (inclusive) to `endNode`
    * (exclusive), from `container`.
    */

const removeNodes = (container, startNode, endNode = null) => {
  let node = startNode;

  while (node !== endNode) {
    const n = node.nextSibling;
    container.removeChild(node);
    node = n;
  }
};

var dom = {
  isCEPolyfill: isCEPolyfill,
  reparentNodes: reparentNodes,
  removeNodes: removeNodes
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */
const directives = new WeakMap();

const directive = f => {
  directives.set(f, true);
  return f;
};

const isDirective = o => typeof o === 'function' && directives.has(o);

var directive$1 = {
  directive: directive,
  isDirective: isDirective
}; /**
    * A sentinel value that signals that a value was handled by a directive and
    * should not be written to the DOM.
    */
const noChange = {};
var part = {
  noChange: noChange
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * An instance of a `Template` that can be attached to the DOM and updated
        * with new values.
        */

class TemplateInstance {
  constructor(template, processor, getTemplate) {
    this._parts = [];
    this.template = template;
    this.processor = processor;
    this._getTemplate = getTemplate;
  }

  update(values) {
    let i = 0;

    for (const part of this._parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this._parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // When using the Custom Elements polyfill, clone the node, rather than
    // importing it, to keep the fragment in the template's document. This
    // leaves the fragment inert so custom elements won't upgrade and
    // potentially modify their contents by creating a polyfilled ShadowRoot
    // while we traverse the tree.
    const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const parts = this.template.parts;
    let partIndex = 0;
    let nodeIndex = 0;

    const _prepareInstance = fragment => {
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null
      const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length && node !== null) {
        const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
        // multiple bound attributes on an element. So each iteration we either
        // increment the nodeIndex, if we aren't on a node with a part, or the
        // partIndex if we are. By not incrementing the nodeIndex when we find a
        // part, we allow for the next part to be associated with the current
        // node if neccessasry.

        if (!isTemplatePartActive(part)) {
          this._parts.push(undefined);

          partIndex++;
        } else if (nodeIndex === part.index) {
          if (part.type === 'node') {
            const part = this.processor.handleTextExpression(this._getTemplate);
            part.insertAfterNode(node);

            this._parts.push(part);
          } else {
            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings));
          }

          partIndex++;
        } else {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            _prepareInstance(node.content);
          }

          node = walker.nextNode();
        }
      }
    };

    _prepareInstance(fragment);

    if (isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

var templateInstance = {
  TemplateInstance: TemplateInstance
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * The return type of `html`, which holds a Template and the values from
        * interpolated expressions.
        */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  } /**
     * Returns a string of HTML used to create a <template> element.
     */

  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isTextBinding = true;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i];
      html += s;
      const close = s.lastIndexOf('>'); // We're in a text position if the previous string closed its last tag, an
      // attribute position if the string opened an unclosed tag, and unchanged
      // if the string had no brackets at all:
      //
      // "...>...": text position. open === -1, close > -1
      // "...<...": attribute position. open > -1
      // "...": no change. open === -1, close === -1

      isTextBinding = (close > -1 || isTextBinding) && s.indexOf('<', close + 1) === -1;

      if (!isTextBinding && rewritesStyleAttribute) {
        html = html.replace(lastAttributeNameRegex, (match, p1, p2, p3) => {
          return p2 === 'style' ? `${p1}style$${p3}` : match;
        });
      }

      html += isTextBinding ? nodeMarker : marker;
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

} /**
   * A TemplateResult for SVG fragments.
   *
   * This class wraps HTMl in an <svg> tag in order to parse its contents in the
   * SVG namespace, then modifies the template to remove the <svg> tag so that
   * clones only container the original fragment.
   */

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    reparentNodes(content, svgElement.firstChild);
    return template;
  }

}

var templateResult = {
  TemplateResult: TemplateResult,
  SVGTemplateResult: SVGTemplateResult
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */

const isPrimitive = value => value === null || !(typeof value === 'object' || typeof value === 'function'); /**
                                                                                                             * Sets attribute values for AttributeParts, so that the value is only set once
                                                                                                             * even if there are multiple parts for an attribute.
                                                                                                             */

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  } /**
     * Creates a single part. Override this to create a differnt type of part.
     */

  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (v != null && (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        } else {
          text += typeof v === 'string' ? v : String(v);
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}

class AttributePart {
  constructor(comitter) {
    this.value = undefined;
    this.committer = comitter;
  }

  setValue(value) {
    if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!isDirective(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while (isDirective(this.value)) {
      const directive$$1 = this.value;
      this.value = noChange;
      directive$$1(this);
    }

    if (this.value === noChange) {
      return;
    }

    this.committer.commit();
  }

}

class NodePart {
  constructor(templateFactory) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.templateFactory = templateFactory;
  } /**
     * Inserts this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  appendInto(container) {
    this.startNode = container.appendChild(createMarker());
    this.endNode = container.appendChild(createMarker());
  } /**
     * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
     * its next sibling must be static, unchanging nodes such as those that appear
     * in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  } /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  appendIntoPart(part) {
    part._insert(this.startNode = createMarker());

    part._insert(this.endNode = createMarker());
  } /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  insertAfterPart(ref) {
    ref._insert(this.startNode = createMarker());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while (isDirective(this._pendingValue)) {
      const directive$$1 = this._pendingValue;
      this._pendingValue = noChange;
      directive$$1(this);
    }

    const value = this._pendingValue;

    if (value === noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this._commitText(value);
      }
    } else if (value instanceof TemplateResult) {
      this._commitTemplateResult(value);
    } else if (value instanceof Node) {
      this._commitNode(value);
    } else if (Array.isArray(value) || value[Symbol.iterator]) {
      this._commitIterable(value);
    } else if (value.then !== undefined) {
      this._commitPromise(value);
    } else {
      // Fallback, will render the string representation
      this._commitText(value);
    }
  }

  _insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  _commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this._insert(value);

    this.value = value;
  }

  _commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;

    if (node === this.endNode.previousSibling && node.nodeType === Node.TEXT_NODE) {
      // If we only have a single text node between the markers, we can just
      // set its value, rather than replacing it.
      // TODO(justinfagnani): Can we just check if this.value is primitive?
      node.textContent = value;
    } else {
      this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
    }

    this.value = value;
  }

  _commitTemplateResult(value) {
    const template = this.templateFactory(value);

    if (this.value && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use it's syntax extension, etc. The template factory comes
      // from the render function so that it can control caching.
      const instance = new TemplateInstance(template, value.processor, this.templateFactory);

      const fragment = instance._clone();

      instance.update(value.values);

      this._commitNode(fragment);

      this.value = instance;
    }
  }

  _commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.templateFactory);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  _commitPromise(value) {
    this.value = value;
    value.then(v => {
      if (this.value === value) {
        this.setValue(v);
        this.commit();
      }
    });
  }

  clear(startNode = this.startNode) {
    removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

} /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this._pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while (isDirective(this._pendingValue)) {
      const directive$$1 = this._pendingValue;
      this._pendingValue = noChange;
      directive$$1(this);
    }

    if (this._pendingValue === noChange) {
      return;
    }

    const value = !!this._pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }
    }

    this.value = value;
    this._pendingValue = noChange;
  }

} /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element[this.name] = this._getValue();
    }
  }

}

class PropertyPart extends AttributePart {}

class EventPart {
  constructor(element, eventName) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while (isDirective(this._pendingValue)) {
      const directive$$1 = this._pendingValue;
      this._pendingValue = noChange;
      directive$$1(this);
    }

    if (this._pendingValue === noChange) {
      return;
    }

    if (this._pendingValue == null !== (this.value == null)) {
      if (this._pendingValue == null) {
        this.element.removeEventListener(this.eventName, this);
      } else {
        this.element.addEventListener(this.eventName, this);
      }
    }

    this.value = this._pendingValue;
    this._pendingValue = noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.element, event);
    } else if (typeof this.value.handleEvent === 'function') {
      this.value.handleEvent(event);
    }
  }

}

var parts = {
  isPrimitive: isPrimitive,
  AttributeCommitter: AttributeCommitter,
  AttributePart: AttributePart,
  NodePart: NodePart,
  BooleanAttributePart: BooleanAttributePart,
  PropertyCommitter: PropertyCommitter,
  PropertyPart: PropertyPart,
  EventPart: EventPart
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * The default TemplateFactory which caches Templates keyed on
        * result.type and result.strings.
        */

function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = new Map();
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.get(result.strings);

  if (template === undefined) {
    template = new Template(result, result.getTemplateElement());
    templateCache.set(result.strings, template);
  }

  return template;
} // The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.


const templateCaches = new Map();
var templateFactory$1 = {
  templateFactory: templateFactory,
  templateCaches: templateCaches
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */
const parts$1 = new WeakMap(); /**
                                * Renders a template to a container.
                                *
                                * To update a container with new values, reevaluate the template literal and
                                * call `render` with the new result.
                                *
                                * @param result a TemplateResult created by evaluating a template tag like
                                *     `html` or `svg`.
                                * @param container A DOM parent to render to. The entire contents are either
                                *     replaced, or efficiently updated if the same result type was previous
                                *     rendered there.
                                * @param templateFactory a function to create a Template or retreive one from
                                *     cache.
                                */

function render(result, container, templateFactory$$1 = templateFactory) {
  let part = parts$1.get(container);

  if (part === undefined) {
    removeNodes(container, container.firstChild);
    parts$1.set(container, part = new NodePart(templateFactory$$1));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
}

var render$1 = {
  parts: parts$1,
  render: render
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * Creates Parts when a template is instantiated.
        */

class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */handleAttributeExpressions(element, name, strings) {
    const prefix = name[0];

    if (prefix === '.') {
      const comitter = new PropertyCommitter(element, name.slice(1), strings);
      return comitter.parts;
    }

    if (prefix === '@') {
      return [new EventPart(element, name.slice(1))];
    }

    if (prefix === '?') {
      return [new BooleanAttributePart(element, name.slice(1), strings)];
    }

    const comitter = new AttributeCommitter(element, name, strings);
    return comitter.parts;
  } /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */

  handleTextExpression(templateFactory) {
    return new NodePart(templateFactory);
  }

}

const defaultTemplateProcessor = new DefaultTemplateProcessor();
var defaultTemplateProcessor$1 = {
  DefaultTemplateProcessor: DefaultTemplateProcessor,
  defaultTemplateProcessor: defaultTemplateProcessor
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * Interprets a template literal as an HTML template that can efficiently
        * render to and update a container.
        */

const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor); /**
                                                                                                             * Interprets a template literal as an SVG template that can efficiently
                                                                                                             * render to and update a container.
                                                                                                             */

const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);

var litHtml = {
  html: html,
  svg: svg,
  TemplateResult: TemplateResult,
  SVGTemplateResult: SVGTemplateResult,
  marker: marker,
  nodeMarker: nodeMarker,
  markerRegex: markerRegex,
  rewritesStyleAttribute: rewritesStyleAttribute,
  Template: Template,
  isTemplatePartActive: isTemplatePartActive,
  createMarker: createMarker,
  lastAttributeNameRegex: lastAttributeNameRegex,
  DefaultTemplateProcessor: DefaultTemplateProcessor,
  defaultTemplateProcessor: defaultTemplateProcessor,
  TemplateInstance: TemplateInstance,
  noChange: noChange,
  isPrimitive: isPrimitive,
  AttributeCommitter: AttributeCommitter,
  AttributePart: AttributePart,
  NodePart: NodePart,
  BooleanAttributePart: BooleanAttributePart,
  PropertyCommitter: PropertyCommitter,
  PropertyPart: PropertyPart,
  EventPart: EventPart,
  isCEPolyfill: isCEPolyfill,
  reparentNodes: reparentNodes,
  removeNodes: removeNodes,
  directive: directive,
  isDirective: isDirective,
  parts: parts$1,
  render: render,
  templateFactory: templateFactory,
  templateCaches: templateCaches
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ // Get a key to lookup in `templateCaches`.

const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

let compatibleShadyCSSVersion = true;

if (typeof window.ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
  console.warn(`Incompatible ShadyCSS version detected.` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` + `@webcomponents/shadycss@1.3.1.`);
  compatibleShadyCSSVersion = false;
} /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */

const shadyTemplateFactory = scopeName => result => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);
  let templateCache = templateCaches.get(cacheKey);

  if (templateCache === undefined) {
    templateCache = new Map();
    templateCaches.set(cacheKey, templateCache);
  }

  let template = templateCache.get(result.strings);

  if (template === undefined) {
    const element = result.getTemplateElement();

    if (compatibleShadyCSSVersion) {
      window.ShadyCSS.prepareTemplateDom(element, scopeName);
    }

    template = new Template(result, element);
    templateCache.set(result.strings, template);
  }

  return template;
};

const TEMPLATE_TYPES = ['html', 'svg']; /**
                                         * Removes all style elements from Templates for the given scopeName.
                                         */

function removeStylesFromLitTemplates(scopeName) {
  TEMPLATE_TYPES.forEach(type => {
    const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));

    if (templates !== undefined) {
      templates.forEach(template => {
        const {
          element: {
            content
          }
        } = template; // IE 11 doesn't support the iterable param Set constructor

        const styles = new Set();
        Array.from(content.querySelectorAll('style')).forEach(s => {
          styles.add(s);
        });
        removeNodesFromTemplate(template, styles);
      });
    }
  });
}

const shadyRenderSet = new Set(); /**
                                   * For the given scope name, ensures that ShadyCSS style scoping is performed.
                                   * This is done just once per scope name so the fragment and template cannot
                                   * be modified.
                                   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
                                   * to be scoped and appended to the document
                                   * (2) removes style elements from all lit-html Templates for this scope name.
                                   *
                                   * Note, <style> elements can only be placed into templates for the
                                   * initial rendering of the scope. If <style> elements are included in templates
                                   * dynamically rendered to the scope (after the first scope render), they will
                                   * not be scoped and the <style> will be left in the template and rendered
                                   * output.
                                   */

const prepareTemplateStyles = (renderedDOM, template, scopeName) => {
  shadyRenderSet.add(scopeName); // Move styles out of rendered DOM and store.

  const styles = renderedDOM.querySelectorAll('style'); // If there are no styles, there's no work to do.

  if (styles.length === 0) {
    return;
  }

  const condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
  // manipulations will not prevent us from being able to fix up template
  // part indices.
  // NOTE: collecting styles is inefficient for browsers but ShadyCSS
  // currently does this anyway. When it does not, this should be changed.

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    style.parentNode.removeChild(style);
    condensedStyle.textContent += style.textContent;
  } // Remove styles from nested templates in this scope.


  removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
  // `template`.

  insertNodeIntoTemplate(template, condensedStyle, template.element.content.firstChild); // Note, it's important that ShadyCSS gets the template that `lit-html`
  // will actually render so that it can update the style inside when
  // needed (e.g. @apply native Shadow DOM case).

  window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);

  if (window.ShadyCSS.nativeShadow) {
    // When in native Shadow DOM, re-add styling to rendered content using
    // the style ShadyCSS produced.
    const style = template.element.content.querySelector('style');
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else {
    // When not in native Shadow DOM, at this point ShadyCSS will have
    // removed the style from the lit template and parts will be broken as a
    // result. To fix this, we put back the style node ShadyCSS removed
    // and then tell lit to remove that node from the template.
    // NOTE, ShadyCSS creates its own style so we can safely add/remove
    // `condensedStyle` here.
    template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
    const removes = new Set();
    removes.add(condensedStyle);
    removeNodesFromTemplate(template, removes);
  }
};

function render$2(result, container, scopeName) {
  const hasRendered = parts$1.has(container);
  render(result, container, shadyTemplateFactory(scopeName)); // When rendering a TemplateResult, scope the template with ShadyCSS

  if (container instanceof ShadowRoot && compatibleShadyCSSVersion && result instanceof TemplateResult) {
    // Scope the element template one time only for this scope.
    if (!shadyRenderSet.has(scopeName)) {
      const part = parts$1.get(container);
      const instance = part.value;
      prepareTemplateStyles(container, instance.template, scopeName);
    } // Update styling if this is the initial render to this container.


    if (!hasRendered) {
      window.ShadyCSS.styleElement(container.host);
    }
  }
}

var shadyRender = {
  render: render$2,
  html: html,
  svg: svg,
  TemplateResult: TemplateResult
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ // serializer/deserializers for boolean attribute

const fromBooleanAttribute = value => value !== null;

const toBooleanAttribute = value => value ? '' : null; /**
                                                        * Change function that returns true if `value` is different from `oldValue`.
                                                        * This method is used as the default for a property's `hasChanged` function.
                                                        */

const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

const defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  reflect: false,
  hasChanged: notEqual
};
const microtaskPromise = new Promise(resolve => resolve(true));
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING = 1 << 3; /**
                                     * Base element class which manages element properties and attributes. When
                                     * properties change, the `update` method is asynchronously called. This method
                                     * should be supplied by subclassers to render updates as desired.
                                     */

class UpdatingElement extends HTMLElement {
  constructor() {
    super();
    this._updateState = 0;
    this._instanceProperties = undefined;
    this._updatePromise = microtaskPromise; /**
                                             * Map with keys for any properties that have changed since the last
                                             * update cycle with previous values.
                                             */
    this._changedProperties = new Map(); /**
                                          * Map with keys of properties that should be reflected when updated.
                                          */
    this._reflectingProperties = undefined;
    this.initialize();
  } /**
     * Returns a list of attributes corresponding to the registered properties.
     */

  static get observedAttributes() {
    // note: piggy backing on this to ensure we're _finalized.
    this._finalize();

    const attributes = [];

    for (const [p, v] of this._classProperties) {
      const attr = this._attributeNameForProperty(p, v);

      if (attr !== undefined) {
        this._attributeToPropertyMap.set(attr, p);

        attributes.push(attr);
      }
    }

    return attributes;
  } /**
     * Creates a property accessor on the element prototype if one does not exist.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     */

  static createProperty(name, options = defaultPropertyDeclaration) {
    // ensure private storage for property declarations.
    if (!this.hasOwnProperty('_classProperties')) {
      this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

      const superProperties = Object.getPrototypeOf(this)._classProperties;

      if (superProperties !== undefined) {
        superProperties.forEach((v, k) => this._classProperties.set(k, v));
      }
    }

    this._classProperties.set(name, options); // Allow user defined accessors by not replacing an existing own-property
    // accessor.


    if (this.prototype.hasOwnProperty(name)) {
      return;
    }

    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    Object.defineProperty(this.prototype, name, {
      get() {
        return this[key];
      },

      set(value) {
        const oldValue = this[name];
        this[key] = value;

        this._requestPropertyUpdate(name, oldValue, options);
      },

      configurable: true,
      enumerable: true
    });
  } /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     */

  static _finalize() {
    if (this.hasOwnProperty('_finalized') && this._finalized) {
      return;
    } // finalize any superclasses


    const superCtor = Object.getPrototypeOf(this);

    if (typeof superCtor._finalize === 'function') {
      superCtor._finalize();
    }

    this._finalized = true; // initialize Map populated in observedAttributes

    this._attributeToPropertyMap = new Map(); // make any properties

    const props = this.properties; // support symbols in properties (IE11 does not support this)

    const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])];

    for (const p of propKeys) {
      // note, use of `any` is due to TypeSript lack of support for symbol in
      // index types
      this.createProperty(p, props[p]);
    }
  } /**
     * Returns the property name for the given attribute `name`.
     */

  static _attributeNameForProperty(name, options) {
    const attribute = options !== undefined && options.attribute;
    return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
  } /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     */

  static _valueHasChanged(value, old, hasChanged = notEqual) {
    return hasChanged(value, old);
  } /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's `type`
     * or `type.fromAttribute` property option.
     */

  static _propertyValueFromAttribute(value, options) {
    const type = options && options.type;

    if (type === undefined) {
      return value;
    } // Note: special case `Boolean` so users can use it as a `type`.


    const fromAttribute = type === Boolean ? fromBooleanAttribute : typeof type === 'function' ? type : type.fromAttribute;
    return fromAttribute ? fromAttribute(value) : value;
  } /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     */

  static _propertyValueToAttribute(value, options) {
    if (options === undefined || options.reflect === undefined) {
      return;
    } // Note: special case `Boolean` so users can use it as a `type`.


    const toAttribute = options.type === Boolean ? toBooleanAttribute : options.type && options.type.toAttribute || String;
    return toAttribute(value);
  } /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */

  initialize() {
    this.renderRoot = this.createRenderRoot();

    this._saveInstanceProperties();
  } /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */

  _saveInstanceProperties() {
    for (const [p] of this.constructor._classProperties) {
      if (this.hasOwnProperty(p)) {
        const value = this[p];
        delete this[p];

        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }

        this._instanceProperties.set(p, value);
      }
    }
  } /**
     * Applies previously saved instance properties.
     */

  _applyInstanceProperties() {
    for (const [p, v] of this._instanceProperties) {
      this[p] = v;
    }

    this._instanceProperties = undefined;
  } /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */

  createRenderRoot() {
    return this.attachShadow({
      mode: 'open'
    });
  } /**
     * Uses ShadyCSS to keep element DOM updated.
     */

  connectedCallback() {
    if (this._updateState & STATE_HAS_UPDATED) {
      if (window.ShadyCSS !== undefined) {
        window.ShadyCSS.styleElement(this);
      }
    } else {
      this.requestUpdate();
    }
  } /**
     * Synchronizes property values when attributes change.
     */

  attributeChangedCallback(name, old, value) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }

  _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    const ctor = this.constructor;

    const attrValue = ctor._propertyValueToAttribute(value, options);

    if (attrValue !== undefined) {
      const attr = ctor._attributeNameForProperty(name, options);

      if (attr !== undefined) {
        // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting
        this._updateState = this._updateState | STATE_IS_REFLECTING;

        if (attrValue === null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        } // mark state not reflecting


        this._updateState = this._updateState & ~STATE_IS_REFLECTING;
      }
    }
  }

  _attributeToProperty(name, value) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (!(this._updateState & STATE_IS_REFLECTING)) {
      const ctor = this.constructor;

      const propName = ctor._attributeToPropertyMap.get(name);

      if (propName !== undefined) {
        const options = ctor._classProperties.get(propName);

        this[propName] = ctor._propertyValueFromAttribute(value, options);
      }
    }
  } /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */

  requestUpdate(name, oldValue) {
    if (name !== undefined) {
      const options = this.constructor._classProperties.get(name) || defaultPropertyDeclaration;
      return this._requestPropertyUpdate(name, oldValue, options);
    }

    return this._invalidate();
  } /**
     * Requests an update for a specific property and records change information.
     * @param name {PropertyKey} name of requesting property
     * @param oldValue {any} old value of requesting property
     * @param options {PropertyDeclaration}
     */

  _requestPropertyUpdate(name, oldValue, options) {
    if (!this.constructor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
      return this.updateComplete;
    } // track old value when changing.


    if (!this._changedProperties.has(name)) {
      this._changedProperties.set(name, oldValue);
    } // add to reflecting properties set


    if (options.reflect === true) {
      if (this._reflectingProperties === undefined) {
        this._reflectingProperties = new Map();
      }

      this._reflectingProperties.set(name, options);
    }

    return this._invalidate();
  } /**
     * Invalidates the element causing it to asynchronously update regardless
     * of whether or not any property changes are pending. This method is
     * automatically called when any registered property changes.
     */

  async _invalidate() {
    if (!this._hasRequestedUpdate) {
      // mark state updating...
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      let resolver;
      const previousValidatePromise = this._updatePromise;
      this._updatePromise = new Promise(r => resolver = r);
      await previousValidatePromise;

      this._validate();

      resolver(!this._hasRequestedUpdate);
    }

    return this.updateComplete;
  }

  get _hasRequestedUpdate() {
    return this._updateState & STATE_UPDATE_REQUESTED;
  } /**
     * Validates the element by updating it.
     */

  _validate() {
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }

    if (this.shouldUpdate(this._changedProperties)) {
      const changedProperties = this._changedProperties;
      this.update(changedProperties);

      this._markUpdated();

      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }

      this.updated(changedProperties);
    } else {
      this._markUpdated();
    }
  }

  _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  } /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. This getter can be implemented to
     * await additional state. For example, it is sometimes useful to await a
     * rendered element before fulfilling this Promise. To do this, first await
     * `super.updateComplete` then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */

  get updateComplete() {
    return this._updatePromise;
  } /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */

  shouldUpdate(_changedProperties) {
    return true;
  } /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated DOM in the element's
     * `renderRoot`. Setting properties inside this method will *not* trigger
     * another update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */

  update(_changedProperties) {
    if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
      for (const [k, v] of this._reflectingProperties) {
        this._propertyToAttribute(k, this[k], v);
      }

      this._reflectingProperties = undefined;
    }
  } /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * * @param _changedProperties Map of changed properties with old values
     */

  updated(_changedProperties) {} /**
                                  * Invoked when the element is first updated. Implement to perform one time
                                  * work on the element after update.
                                  *
                                  * Setting properties inside this method will trigger the element to update
                                  * again after this update cycle completes.
                                  *
                                  * * @param _changedProperties Map of changed properties with old values
                                  */

  firstUpdated(_changedProperties) {}

} /**
   * Maps attribute names to properties; for example `foobar` attribute
   * to `fooBar` property.
   */

UpdatingElement._attributeToPropertyMap = new Map(); /**
                                                      * Marks class as having finished creating properties.
                                                      */
UpdatingElement._finalized = true; /**
                                    * Memoized list of all class properties, including any superclass properties.
                                    */
UpdatingElement._classProperties = new Map();
UpdatingElement.properties = {};
var updatingElement = {
  notEqual: notEqual,
  UpdatingElement: UpdatingElement
}; /**
    * @license
    * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ /**
        * Class decorator factory that defines the decorated class as a custom element.
        *
        * @param tagName the name of the custom element to define
        *
        * In TypeScript, the `tagName` passed to `customElement` must be a key of the
        * `HTMLElementTagNameMap` interface. To add your element to the interface,
        * declare the interface in this module:
        *
        *     @customElement('my-element')
        *     export class MyElement extends LitElement {}
        *
        *     declare global {
        *       interface HTMLElementTagNameMap {
        *         'my-element': MyElement;
        *       }
        *     }
        *
        */

const customElement = tagName => clazz => {
  window.customElements.define(tagName, clazz); // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason. `Constructor<HTMLElement>`
  // is helpful to make sure the decorator is applied to elements however.

  return clazz;
}; /**
    * A property decorator which creates a LitElement property which reflects a
    * corresponding attribute value. A `PropertyDeclaration` may optionally be
    * supplied to configure property features.
    */

const property = options => (proto, name) => {
  proto.constructor.createProperty(name, options);
}; /**
    * A property decorator that converts a class property into a getter that
    * executes a querySelector on the element's renderRoot.
    */

const query = _query((target, selector) => target.querySelector(selector)); /**
                                                                             * A property decorator that converts a class property into a getter
                                                                             * that executes a querySelectorAll on the element's renderRoot.
                                                                             */

const queryAll = _query((target, selector) => target.querySelectorAll(selector)); /**
                                                                                   * Base-implementation of `@query` and `@queryAll` decorators.
                                                                                   *
                                                                                   * @param queryFn exectute a `selector` (ie, querySelector or querySelectorAll)
                                                                                   * against `target`.
                                                                                   */

function _query(queryFn) {
  return selector => (proto, propName) => {
    Object.defineProperty(proto, propName, {
      get() {
        return queryFn(this.renderRoot, selector);
      },

      enumerable: true,
      configurable: true
    });
  };
}

var decorators = {
  customElement: customElement,
  property: property,
  query: query,
  queryAll: queryAll
};

class LitElement extends UpdatingElement {
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * * @param _changedProperties Map of changed properties with old values
   */update(changedProperties) {
    super.update(changedProperties);

    if (typeof this.render === 'function') {
      this.constructor.render(this.render(), this.renderRoot, this.localName);
    } else {
      throw new Error('render() not implemented');
    }
  }

} /**
   * Render method used to render the lit-html TemplateResult to the element's
   * DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   */

LitElement.render = render$2;
var litElement = {
  LitElement: LitElement,
  html: html,
  svg: svg,
  notEqual: notEqual,
  UpdatingElement: UpdatingElement,
  customElement: customElement,
  property: property,
  query: query,
  queryAll: queryAll
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

function isCustomElementCandidate(element) {
  return element.localName.match('-');
}

async function callWhenReady(element, method, args) {
  if (!element[method] && isCustomElementCandidate(element) && !customElements.get(element.localName)) {
    await customElements.whenDefined(element.localName);
  }

  if (element[method]) {
    element[method](...args);
  }
}

let afterRenderPromise;

function afterNextRender() {
  if (!afterRenderPromise) {
    afterRenderPromise = new Promise(resolve => {
      requestAnimationFrame(() => setTimeout(() => {
        afterRenderPromise = null;
        resolve();
      }));
    });
  }

  return afterRenderPromise;
}

function findAssignedNode(slot, selector) {
  return slot.assignedNodes({
    flatten: true
  }).find(n => {
    return n.nodeType == Node.ELEMENT_NODE && n.matches(selector);
  });
}

var utils = {
  callWhenReady: callWhenReady,
  afterNextRender: afterNextRender,
  findAssignedNode: findAssignedNode
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */
const hasCustomEventConstructor = typeof CustomEvent === 'function';

const MDCWebComponentMixin = superClass => class MDCWebComponent extends superClass {
  get host() {
    return this._host;
  } // TODO(sorvell): should be changed in MDC


  get activeElement() {
    return this.host.getRootNode().activeElement;
  }

  initialize(...args) {
    super.initialize(...args);
    this._host = this.root_.getRootNode().host;
  } // TODO(sorvell): would be nice in MDC


  createAdapter() {
    return null;
  }

  getDefaultFoundation() {
    const foundation = super.getDefaultFoundation();
    Object.assign(foundation.adapter_, this.createAdapter());
    return foundation;
  } // TODO(sorvell): convenient but maybe not best.


  emit(evtType, evtData, shouldBubble = false) {
    let evt;

    if (hasCustomEventConstructor) {
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble,
        composed: true
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }

    this.root_.dispatchEvent(evt);
  }

};

var mdcWebComponent = {
  MDCWebComponentMixin: MDCWebComponentMixin
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

class ComponentElement extends LitElement {
  static get ComponentClass() {
    throw new Error('Must provide component class');
  }

  static get componentSelector() {
    throw new Error('Must provide component selector');
  }

  constructor() {
    super();
    this._asyncComponent = false;
  }

  async firstUpdated() {
    if (this._asyncComponent) {
      await afterNextRender();
    }

    this._makeComponent();
  }

  _makeComponent() {
    this._componentRoot = this.shadowRoot.querySelector(this.constructor.componentSelector);
    this._component = new this.constructor.ComponentClass(this._componentRoot);

    if (this._resolveComponentPromise) {
      this._resolveComponentPromise(this._component);
    }
  }

  componentReady() {
    if (!this._componentPromise) {
      this._componentPromise = new Promise(resolve => {
        this._resolveComponentPromise = resolve;
      });

      if (this._component) {
        this._resolveComponentPromise(this._component);
      }
    }

    return this._componentPromise;
  }

}

var componentElement = {
  ComponentElement: ComponentElement,
  html: html,
  MDCWebComponentMixin: MDCWebComponentMixin
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

class FormableComponentElement extends ComponentElement {
  static get formElementSelector() {
    return 'input';
  }

  constructor() {
    super();
    this._asyncComponent = true;
  }

  firstUpdated() {
    super.firstUpdated();
    this._formElement = this.shadowRoot.querySelector(this.constructor.formElementSelector);
  }

  click() {
    if (this._formElement) {
      this._formElement.click();
    }
  } // TODO(srovell): use delegates focus?


  focus() {
    if (this._formElement) {
      this._formElement.focus();
    }
  }

  setAriaLabel(value) {
    if (this._formElement) {
      this._formElement.setAttribute('aria-label', value);
    }
  }

}

var formableComponentElement = {
  FormableComponentElement: FormableComponentElement,
  MDCWebComponentMixin: MDCWebComponentMixin,
  html: html
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

class SelectionController {
  static getController(element) {
    const root = element.getRootNode();

    if (!root.__selectionController) {
      root.__selectionController = new SelectionController(root);
    }

    return root.__selectionController;
  }

  constructor(node) {
    node.addEventListener('keydown', e => this._keyDownHandler(e));
    node.addEventListener('mousedown', e => this._mousedownHandler(e));
    node.addEventListener('mouseup', e => this._mouseupHandler(e));
    this._sets = {};
    this._property = 'checked';
  }

  _keyDownHandler(e) {
    this._keyIsDown = true;
    const element = e.target;

    if (!this.has(element)) {
      return;
    }

    if (e.key == 'ArrowRight' || e.key == 'ArrowDown') {
      this.next(element);
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowUp') {
      this.previous(element);
    }
  }

  _mousedownHandler(e) {
    this._mouseIsDown = true;
  }

  _mouseupHandler(e) {
    this._mouseIsDown = false;
  }

  has(element) {
    const set = this.getSet(element.name);
    return set.has(element);
  }

  previous(element) {
    const order = this.getOrdered(element);
    const i = order.indexOf(element);
    this.select(order[i - 1] || order[order.length - 1]);
  }

  next(element) {
    const order = this.getOrdered(element);
    const i = order.indexOf(element);
    this.select(order[i + 1] || order[0]);
  }

  select(element) {
    element.focus();
    element.click();
  } /**
     * Helps to track the focused selection group and if it changes, focuses
     * the selected item in the group. This matches native radio button behavior.
     * @param {*} event
     * @param {*} element
     */

  focus(event, element) {
    // Only manage focus state when using keyboard
    if (this._mouseIsDown) {
      return;
    }

    cancelAnimationFrame(this._blurRaf);
    const set = this.getSet(element.name);
    const currentFocusedSet = this._focusedSet;
    this._focusedSet = set;

    if (currentFocusedSet != set && set._selected && set._selected != element) {
      // TODO(sorvell): needed because MDC Ripple delays focus/blur until RAF.
      requestAnimationFrame(() => {
        set._selected.focus();
      });
    }
  } /**
     * Helps track the focused selection group by setting it to null asynchronously
     * on blur if no focus event is received.
     * @param {*} element
     */

  blur(element) {
    // Only manage focus state when using keyboard
    if (this._mouseIsDown) {
      return;
    }

    this._blurRaf = requestAnimationFrame(() => {
      this._focusedSet = null;
    });
  }

  getOrdered(element) {
    const set = this.getSet(element.name);

    if (!set._ordered) {
      set._ordered = [];

      for (const e of set) {
        set._ordered.push(e);
      }

      set._ordered.sort((a, b) => a.compareDocumentPosition(b) == Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0);
    }

    return set._ordered;
  }

  getSet(name) {
    if (!this._sets[name]) {
      this._sets[name] = new Set();
    }

    return this._sets[name];
  }

  register(element) {
    const set = this.getSet(element.name);
    set.add(element);
    set._ordered = null;
  }

  unregister(element) {
    const set = this.getSet(element.name);
    set.delete(element);
    set._ordered = null;

    if (set._selected == element) {
      set._selected = null;
    }
  }

  update(element) {
    if (this._updating) {
      return;
    }

    this._updating = true;

    if (element[this._property]) {
      const set = this.getSet(element.name);

      for (const e of set) {
        e[this._property] = e == element;
      }

      set._selected = element;
    }

    this._updating = false;
  }

}

var selectionController = {
  SelectionController: SelectionController
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */
const style = html`<style>.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var: 1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug::before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-button{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;line-height:2.25rem;font-weight:500;letter-spacing:.08929em;text-decoration:none;text-transform:uppercase;--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:transparent;will-change:transform, opacity;padding:0 8px 0 8px;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;height:36px;border:none;outline:none;line-height:inherit;user-select:none;-webkit-appearance:none;overflow:hidden;vertical-align:middle;border-radius:2px}.mdc-button::before,.mdc-button::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-button::before{transition:opacity 15ms linear;z-index:1}.mdc-button.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-button.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-button.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-button.mdc-ripple-upgraded--foreground-activation::after{animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-button.mdc-ripple-upgraded--foreground-deactivation::after{animation:150ms mdc-ripple-fg-opacity-out;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-button::before,.mdc-button::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-button.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:none}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{background-color:transparent;color:rgba(0,0,0,0.37);cursor:default;pointer-events:none}.mdc-button:not(:disabled){background-color:transparent}.mdc-button:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}.mdc-button::before,.mdc-button::after{background-color:#6200ee}@supports not (-ms-ime-align: auto){.mdc-button::before,.mdc-button::after{background-color:var(--mdc-theme-primary, #6200ee)}}.mdc-button:hover::before{opacity:.04}.mdc-button:not(.mdc-ripple-upgraded):focus::before,.mdc-button.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.12}.mdc-button:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-button:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.16}.mdc-button.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .16}.mdc-button .mdc-button__icon{margin-left:0;margin-right:8px;display:inline-block;width:18px;height:18px;font-size:18px;vertical-align:top}[dir="rtl"] .mdc-button .mdc-button__icon,.mdc-button .mdc-button__icon[dir="rtl"]{margin-left:8px;margin-right:0}.mdc-button svg.mdc-button__icon{fill:currentColor}.mdc-button--raised .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon,.mdc-button--outlined .mdc-button__icon{margin-left:-4px;margin-right:8px}[dir="rtl"] .mdc-button--raised .mdc-button__icon,.mdc-button--raised .mdc-button__icon[dir="rtl"],[dir="rtl"] .mdc-button--unelevated .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon[dir="rtl"],[dir="rtl"] .mdc-button--outlined .mdc-button__icon,.mdc-button--outlined .mdc-button__icon[dir="rtl"]{margin-left:8px;margin-right:-4px}.mdc-button--raised,.mdc-button--unelevated{padding:0 16px 0 16px}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{background-color:rgba(0,0,0,0.12);color:rgba(0,0,0,0.37)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){background-color:#6200ee}@supports not (-ms-ime-align: auto){.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){background-color:var(--mdc-theme-primary, #6200ee)}}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){color:#fff;color:var(--mdc-theme-on-primary, #fff)}.mdc-button--raised::before,.mdc-button--raised::after,.mdc-button--unelevated::before,.mdc-button--unelevated::after{background-color:#fff}@supports not (-ms-ime-align: auto){.mdc-button--raised::before,.mdc-button--raised::after,.mdc-button--unelevated::before,.mdc-button--unelevated::after{background-color:var(--mdc-theme-on-primary, #fff)}}.mdc-button--raised:hover::before,.mdc-button--unelevated:hover::before{opacity:.08}.mdc-button--raised:not(.mdc-ripple-upgraded):focus::before,.mdc-button--raised.mdc-ripple-upgraded--background-focused::before,.mdc-button--unelevated:not(.mdc-ripple-upgraded):focus::before,.mdc-button--unelevated.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.24}.mdc-button--raised:not(.mdc-ripple-upgraded)::after,.mdc-button--unelevated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-button--raised:not(.mdc-ripple-upgraded):active::after,.mdc-button--unelevated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.32}.mdc-button--raised.mdc-ripple-upgraded,.mdc-button--unelevated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .32}.mdc-button--raised{box-shadow:0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12);transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-button--raised:hover,.mdc-button--raised:focus{box-shadow:0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)}.mdc-button--raised:active{box-shadow:0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)}.mdc-button--raised:disabled{box-shadow:0px 0px 0px 0px rgba(0,0,0,0.2),0px 0px 0px 0px rgba(0,0,0,0.14),0px 0px 0px 0px rgba(0,0,0,0.12)}.mdc-button--outlined{border-style:solid;padding:0 14px 0 14px;border-width:2px;line-height:32px}.mdc-button--outlined:disabled{border-color:rgba(0,0,0,0.37)}.mdc-button--outlined.mdc-button--dense{line-height:27px}.mdc-button--outlined:not(:disabled){border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-button--dense{height:32px;font-size:.8125rem;line-height:32px}:host{display:inline-flex;outline:none}.mdc-button{flex:1}
</style>`;
var mwcButtonCss = {
  style: style
}; /**
    * @license
    * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
    * This code may only be used under the BSD style license found at
    * http://polymer.github.io/LICENSE.txt
    * The complete set of authors may be found at
    * http://polymer.github.io/AUTHORS.txt
    * The complete set of contributors may be found at
    * http://polymer.github.io/CONTRIBUTORS.txt
    * Code distributed by Google as part of the polymer project is also
    * subject to an additional IP rights grant found at
    * http://polymer.github.io/PATENTS.txt
    */ // On IE11, classList.toggle doesn't accept a second argument.
// Since this is so minor, we just polyfill it.

if (window.navigator.userAgent.match('Trident')) {
  DOMTokenList.prototype.toggle = function (token, force) {
    if (force === undefined || force) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return force === undefined ? true : force;
  };
} /**
   * Stores the ClassInfo object applied to a given AttributePart.
   * Used to unset existing values when a new ClassInfo object is applied.
   */

const classMapCache = new WeakMap(); /**
                                      * Stores AttributeParts that have had static classes applied (e.g. `foo` in
                                      * class="foo ${classMap()}"). Static classes are applied only the first time
                                      * the directive is run on a part.
                                      */ // Note, could be a WeakSet, but prefer not requiring this polyfill.

const classMapStatics = new WeakMap(); /**
                                        * A directive that applies CSS classes. This must be used in the `class`
                                        * attribute and must be the only part used in the attribute. It takes each
                                        * property in the `classInfo` argument and adds the property name to the
                                        * element's `classList` if the property value is truthy; if the property value
                                        * is falsey, the property name is removed from the element's `classList`. For
                                        * example
                                        * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
                                        * @param classInfo {ClassInfo}
                                        */

const classMap = classInfo => directive(part => {
  if (!(part instanceof AttributePart) || part instanceof PropertyPart || part.committer.name !== 'class' || part.committer.parts.length > 1) {
    throw new Error('The `classMap` directive must be used in the `class` attribute ' + 'and must be the only part in the attribute.');
  } // handle static classes


  if (!classMapStatics.has(part)) {
    part.committer.element.className = part.committer.strings.join(' ');
    classMapStatics.set(part, true);
  } // remove old classes that no longer apply


  const oldInfo = classMapCache.get(part);

  for (const name in oldInfo) {
    if (!(name in classInfo)) {
      part.committer.element.classList.remove(name);
    }
  } // add new classes


  for (const name in classInfo) {
    if (!oldInfo || oldInfo[name] !== classInfo[name]) {
      // We explicitly want a loose truthy check here because
      // it seems more convenient that '' and 0 are skipped.
      part.committer.element.classList.toggle(name, Boolean(classInfo[name]));
    }
  }

  classMapCache.set(part, classInfo);
});

var classMap$1 = {
  classMap: classMap
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */
const style$1 = html`<style>@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var: 1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug::before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-ripple-surface{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:transparent;will-change:transform, opacity;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface::before,.mdc-ripple-surface::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear;z-index:1}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:150ms mdc-ripple-fg-opacity-out;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface::before,.mdc-ripple-surface::after{background-color:#000}.mdc-ripple-surface:hover::before{opacity:.04}.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before,.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.12}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.16}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .16}.mdc-ripple-surface::before,.mdc-ripple-surface::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:#6200ee}@supports not (-ms-ime-align: auto){.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:var(--mdc-theme-primary, #6200ee)}}.mdc-ripple-surface--primary:hover::before{opacity:.04}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before,.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.12}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.16}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .16}.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:#018786}@supports not (-ms-ime-align: auto){.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:var(--mdc-theme-secondary, #018786)}}.mdc-ripple-surface--accent:hover::before{opacity:.04}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before,.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.12}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.16}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .16}.mdc-ripple-surface{pointer-events:none;position:absolute;top:0;right:0;bottom:0;left:0}
</style>`;
var mwcRippleCss = {
  style: style$1
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */ // TODO(sorvell): These are MDC utils. Would be nice to use em, but they don't appear to be easily
// exposed via the public builds.

let supportsPassive_$1;

function applyPassive$1(globalObj = window, forceRefresh = false) {
  if (supportsPassive_$1 === undefined || forceRefresh) {
    let isSupported = false;

    try {
      globalObj.document.addEventListener('test', null, {
        get passive() {
          isSupported = true;
        }

      });
    } catch (e) {}

    supportsPassive_$1 = isSupported;
  }

  return supportsPassive_$1 ? {
    passive: true
  } : false;
}

function getMatchesProperty$1(HTMLElementPrototype) {
  return ['webkitMatchesSelector', 'msMatchesSelector', 'matches'].filter(p => p in HTMLElementPrototype).pop();
}

const MATCHES = getMatchesProperty$1(HTMLElement.prototype);

class MDCWCRipple extends MDCWebComponentMixin(MDCRipple) {}

class MDCWCRippleContainer extends MDCWCRipple {
  createAdapter() {
    const container = this.host.parentNode || this.host;
    return {
      isSurfaceActive: () => container[MATCHES](':active'),
      isSurfaceDisabled: () => container.disabled,
      containsEventTarget: target => container.contains(target),
      registerInteractionHandler: (evtType, handler) => container.addEventListener(evtType, handler, applyPassive$1()),
      deregisterInteractionHandler: (evtType, handler) => container.removeEventListener(evtType, handler, applyPassive$1()),
      computeBoundingRect: () => container.getBoundingClientRect()
    };
  }

}

class Ripple extends LitElement {
  static get properties() {
    return {
      primary: {
        type: Boolean
      },
      accent: {
        type: Boolean
      },
      unbounded: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.primary = false;
    this.accent = false;
    this.unbounded = false;
  }

  _renderStyle() {
    return style$1;
  } // TODO(sorvell) #css: sizing.


  render() {
    const {
      primary,
      accent,
      unbounded
    } = this;
    const classInfo = {
      'mdc-ripple-surface--primary': primary,
      'mdc-ripple-surface--accent': accent
    };
    return html`
      ${this._renderStyle()}
      <div class="mdc-ripple-surface ${classMap(classInfo)}" data-mdc-ripple-is-unbounded="${unbounded}"></div>`;
  }

  firstUpdated() {
    const surface = this.shadowRoot.querySelector('.mdc-ripple-surface');
    const container = this.parentNode || this; // TODO(sorvell) #css: this might be bad since the container might be positioned.

    container.style.position = 'relative';
    this._ripple = new MDCWCRippleContainer(surface);
  }

}

customElements.define('mwc-ripple', Ripple);
var mwcRipple = {
  MDCWCRipple: MDCWCRipple,
  MDCWCRippleContainer: MDCWCRippleContainer,
  Ripple: Ripple
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */ // load material icons font

const fontEl = document.createElement('link');
fontEl.rel = 'stylesheet';
fontEl.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(fontEl); /**
                                   @license
                                   Copyright 2018 Google Inc. All Rights Reserved.
                                   
                                   Licensed under the Apache License, Version 2.0 (the "License");
                                   you may not use this file except in compliance with the License.
                                   You may obtain a copy of the License at
                                   
                                       http://www.apache.org/licenses/LICENSE-2.0
                                   
                                   Unless required by applicable law or agreed to in writing, software
                                   distributed under the License is distributed on an "AS IS" BASIS,
                                   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                   See the License for the specific language governing permissions and
                                   limitations under the License.
                                   */

class Button extends LitElement {
  static get properties() {
    return {
      raised: {
        type: Boolean
      },
      unelevated: {
        type: Boolean
      },
      outlined: {
        type: Boolean
      },
      dense: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      },
      icon: {
        type: String
      },
      label: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.raised = false;
    this.unelevated = false;
    this.outlined = false;
    this.dense = false;
    this.disabled = false;
    this.icon = '';
    this.label = '';
  }

  createRenderRoot() {
    return this.attachShadow({
      mode: 'open',
      delegatesFocus: true
    });
  }

  firstUpdated() {
    this._ripple = new MDCWCRipple(this.shadowRoot.querySelector('.mdc-button'));
  }

  renderStyle() {
    return style;
  }

  render() {
    const {
      raised,
      unelevated,
      outlined,
      dense,
      disabled,
      icon,
      label
    } = this;
    const hostClassInfo = {
      'mdc-button--raised': raised,
      'mdc-button--unelevated': unelevated,
      'mdc-button--outlined': outlined,
      'mdc-button--dense': dense
    };
    return html`
      ${this.renderStyle()}
      <button class="mdc-button ${classMap(hostClassInfo)}" ?disabled="${disabled}">
        ${icon ? html`<span class="material-icons mdc-button__icon">${icon}</span>` : ''}
        ${label || ''}
        <slot></slot>
      </button>`;
  }

}

customElements.define('mwc-button', Button);
var mwcButton = {
  Button: Button
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */
const style$2 = html`<style>.mdc-form-field{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;line-height:1.25rem;font-weight:400;letter-spacing:.01786em;text-decoration:inherit;text-transform:inherit;color:rgba(0,0,0,0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0,0,0,0.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{order:0;margin-right:auto;padding-left:4px}[dir="rtl"] .mdc-form-field>label,.mdc-form-field[dir="rtl"]>label{margin-left:auto;padding-right:4px}.mdc-form-field--align-end>label{order:-1;margin-left:auto;padding-right:4px}[dir="rtl"] .mdc-form-field--align-end>label,.mdc-form-field--align-end[dir="rtl"]>label{margin-right:auto;padding-left:4px}
</style>`;
var mwcFormfieldCss = {
  style: style$2
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

class MDCWCFormField extends MDCWebComponentMixin(MDCFormField) {}

class Formfield extends ComponentElement {
  static get ComponentClass() {
    return MDCWCFormField;
  }

  static get componentSelector() {
    return '.mdc-form-field';
  }

  static get properties() {
    return {
      label: {
        type: String
      },
      alignEnd: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.label = '';
    this.alignEnd = false;
  }

  renderStyle() {
    return style$2;
  }

  render() {
    const {
      label,
      alignEnd
    } = this;
    return html`${this.renderStyle()}
      <div class="mdc-form-field ${classMap({
      'mdc-form-field--align-end': alignEnd
    })}">
        <slot></slot>
        <label class="mdc-label" @click="${e => this._labelClickHandler(e)}">${label}</label>
      </div>`;
  }

  updated(changedProps) {
    if (changedProps.has('label') && this._input) {
      if (this._input.localName == 'input') {
        this._input.setAttribute('aria-label', this.label);
      } else {
        callWhenReady(this._input, 'setAriaLabel', [this.label]);
      }
    }
  }

  _labelClickHandler() {
    if (this._input) {
      this._input.focus();

      this._input.click();
    }
  }

  get _input() {
    return this.__input = this.__input || findAssignedNode(this.shadowRoot.querySelector('slot'), '*');
  }

}

customElements.define('mwc-formfield', Formfield);
var mwcFormfield = {
  MDCWCFormField: MDCWCFormField,
  Formfield: Formfield
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */
const style$3 = html`<style>@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var: 1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug::before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-radio{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:transparent;will-change:transform, opacity;display:inline-block;position:relative;flex:0 0 auto;box-sizing:border-box;width:40px;height:40px;padding:10px;cursor:pointer;will-change:opacity, transform, border-color, background-color, color}.mdc-radio .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle{border-color:rgba(0,0,0,0.54)}.mdc-radio .mdc-radio__native-control:enabled:checked+.mdc-radio__background .mdc-radio__outer-circle{border-color:#018786;border-color:var(--mdc-theme-secondary, #018786)}.mdc-radio .mdc-radio__native-control:enabled+.mdc-radio__background .mdc-radio__inner-circle{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786)}.mdc-radio .mdc-radio__background::before{background-color:#018786}@supports not (-ms-ime-align: auto){.mdc-radio .mdc-radio__background::before{background-color:var(--mdc-theme-secondary, #018786)}}.mdc-radio::before,.mdc-radio::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-radio::before{transition:opacity 15ms linear;z-index:1}.mdc-radio.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-radio.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-radio.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-radio.mdc-ripple-upgraded--foreground-activation::after{animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-radio.mdc-ripple-upgraded--foreground-deactivation::after{animation:150ms mdc-ripple-fg-opacity-out;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-radio::before,.mdc-radio::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-radio.mdc-ripple-upgraded::before,.mdc-radio.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-radio.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-radio::before,.mdc-radio::after{background-color:#018786}@supports not (-ms-ime-align: auto){.mdc-radio::before,.mdc-radio::after{background-color:var(--mdc-theme-secondary, #018786)}}.mdc-radio:hover::before{opacity:.04}.mdc-radio:not(.mdc-ripple-upgraded):focus::before,.mdc-radio.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.12}.mdc-radio:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-radio:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.16}.mdc-radio.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .16}.mdc-radio__background{display:inline-block;position:absolute;left:10px;box-sizing:border-box;width:50%;height:50%}.mdc-radio__background::before{position:absolute;top:0;left:0;width:100%;height:100%;transform:scale(0, 0);transition:opacity 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1);border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-radio__outer-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;transition:border-color 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1);border-width:2px;border-style:solid;border-radius:50%}.mdc-radio__inner-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;transform:scale(0, 0);transition:transform 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1),background-color 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1);border-radius:50%}.mdc-radio__native-control{position:absolute;top:0;left:0;width:100%;height:100%;margin:0;padding:0;opacity:0;cursor:inherit;z-index:1}.mdc-radio.mdc-ripple-upgraded .mdc-radio__background::before{content:none}.mdc-radio__native-control:checked+.mdc-radio__background,.mdc-radio__native-control:disabled+.mdc-radio__background{transition:opacity 120ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__outer-circle{transition:border-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle{transition:transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio--disabled{cursor:default;pointer-events:none}.mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__inner-circle{transform:scale(0.5);transition:transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio__native-control:disabled+.mdc-radio__background,[aria-disabled="true"] .mdc-radio__native-control+.mdc-radio__background{cursor:default}.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__outer-circle,[aria-disabled="true"] .mdc-radio__native-control+.mdc-radio__background .mdc-radio__outer-circle{border-color:rgba(0,0,0,0.26)}.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle,[aria-disabled="true"] .mdc-radio__native-control+.mdc-radio__background .mdc-radio__inner-circle{background-color:rgba(0,0,0,0.26)}.mdc-radio__native-control:focus+.mdc-radio__background::before{transform:scale(2, 2);transition:opacity 120ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:.26}:host{display:inline-block}
</style>`;
var mwcRadioCss = {
  style: style$3
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /* eslint no-unused-vars: [2, {"args": "none"}] */ /**
                                                           * Adapter for MDC Radio. Provides an interface for managing
                                                           * - classes
                                                           * - dom
                                                           *
                                                           * Additionally, provides type information for the adapter to the Closure
                                                           * compiler.
                                                           *
                                                           * Implement this adapter for your framework of choice to delegate updates to
                                                           * the component in your framework of choice. See architecture documentation
                                                           * for more details.
                                                           * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
                                                           *
                                                           * @record
                                                           */

class MDCRadioAdapter {
  /** @param {string} className */addClass(className) {} /** @param {string} className */

  removeClass(className) {} /** @return {!MDCSelectionControlState} */

  getNativeControl() {}

}

var adapter$2 = {
  default: MDCRadioAdapter
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /** @enum {string} */
const strings$2 = {
  NATIVE_CONTROL_SELECTOR: '.mdc-radio__native-control'
}; /** @enum {string} */
const cssClasses$2 = {
  ROOT: 'mdc-radio',
  DISABLED: 'mdc-radio--disabled'
};
var constants$2 = {
  strings: strings$2,
  cssClasses: cssClasses$2
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * @extends {MDCFoundation<!MDCRadioAdapter>}
        */

class MDCRadioFoundation extends MDCFoundation {
  /** @return enum {cssClasses} */static get cssClasses() {
    return cssClasses$2;
  } /** @return enum {strings} */

  static get strings() {
    return strings$2;
  } /** @return {!MDCRadioAdapter} */

  static get defaultAdapter() {
    return (/** @type {!MDCRadioAdapter} */{
        addClass: () => /* className: string */{},
        removeClass: () => /* className: string */{},
        getNativeControl: () => /* !MDCSelectionControlState */{}
      }
    );
  } /** @return {boolean} */

  isChecked() {
    return this.getNativeControl_().checked;
  } /** @param {boolean} checked */

  setChecked(checked) {
    this.getNativeControl_().checked = checked;
  } /** @return {boolean} */

  isDisabled() {
    return this.getNativeControl_().disabled;
  } /** @param {boolean} disabled */

  setDisabled(disabled) {
    const {
      DISABLED
    } = MDCRadioFoundation.cssClasses;
    this.getNativeControl_().disabled = disabled;

    if (disabled) {
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.removeClass(DISABLED);
    }
  } /** @return {?string} */

  getValue() {
    return this.getNativeControl_().value;
  } /** @param {?string} value */

  setValue(value) {
    this.getNativeControl_().value = value;
  } /**
     * @return {!MDCSelectionControlState}
     * @private
     */

  getNativeControl_() {
    return this.adapter_.getNativeControl() || {
      checked: false,
      disabled: false,
      value: null
    };
  }

}

var foundation$3 = {
  default: MDCRadioFoundation
}; /**
    * @license
    * Copyright 2016 Google Inc. All Rights Reserved.
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *      http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */ /**
        * @extends MDCComponent<!MDCRadioFoundation>
        * @implements {MDCSelectionControl}
        */

class MDCRadio extends MDCComponent {
  static attachTo(root) {
    return new MDCRadio(root);
  } /** @return {boolean} */

  get checked() {
    return this.foundation_.isChecked();
  } /** @param {boolean} checked */

  set checked(checked) {
    this.foundation_.setChecked(checked);
  } /** @return {boolean} */

  get disabled() {
    return this.foundation_.isDisabled();
  } /** @param {boolean} disabled */

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  } /** @return {?string} */

  get value() {
    return this.foundation_.getValue();
  } /** @param {?string} value */

  set value(value) {
    this.foundation_.setValue(value);
  } /** @return {!MDCRipple} */

  get ripple() {
    return this.ripple_;
  }

  constructor(...args) {
    super(...args); /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();
  } /**
     * @return {!MDCRipple}
     * @private
     */

  initRipple_() {
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      // Radio buttons technically go "active" whenever there is *any* keyboard interaction. This is not the
      // UI we desire.
      isSurfaceActive: () => false,
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeControl_.removeEventListener(type, handler)
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  } /**
     * Returns the state of the native control element, or null if the native control element is not present.
     * @return {?MDCSelectionControlState}
     * @private
     */

  get nativeControl_() {
    const {
      NATIVE_CONTROL_SELECTOR
    } = MDCRadioFoundation.strings;
    const el = /** @type {?MDCSelectionControlState} */this.root_.querySelector(NATIVE_CONTROL_SELECTOR);
    return el;
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  } /** @return {!MDCRadioFoundation} */

  getDefaultFoundation() {
    return new MDCRadioFoundation({
      addClass: className => this.root_.classList.add(className),
      removeClass: className => this.root_.classList.remove(className),
      getNativeControl: () => this.root_.querySelector(MDCRadioFoundation.strings.NATIVE_CONTROL_SELECTOR)
    });
  }

}

var index$3 = {
  MDCRadio: MDCRadio,
  MDCRadioFoundation: MDCRadioFoundation
}; /**
   @license
   Copyright 2018 Google Inc. All Rights Reserved.
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */

class MDCWCRadio extends MDCWebComponentMixin(MDCRadio) {}

class Radio extends FormableComponentElement {
  static get ComponentClass() {
    return MDCWCRadio;
  }

  static get componentSelector() {
    return '.mdc-radio';
  }

  static get properties() {
    return {
      checked: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      },
      value: {
        type: String
      },
      name: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.checked = false;
    this.disabled = false;
    this.name = '';
    this.value = '';
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
    this._boundInputFocusHandler = this._inputFocusHandler.bind(this);
    this._boundInputBlurHandler = this._inputBlurHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._selectionController = SelectionController.getController(this);

    this._selectionController.register(this);

    this._selectionController.update(this);
  }

  disconnectedCallback() {
    this._selectionController.unregister(this);
  }

  renderStyle() {
    return style$3;
  }

  render() {
    const {
      checked,
      value,
      name
    } = this;
    return html`
      ${this.renderStyle()}
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio"
          .checked="${checked}" .name="${name}" .value="${value}"
          @change="${this._boundInputChangeHandler}"
          @focus="${this._boundInputFocusHandler}"
          @blur="${this._boundInputBlurHandler}">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>`;
  }

  get disabled() {
    return this._component && this._component.disabled;
  }

  set disabled(value) {
    this.componentReady().then(component => component.disabled = value);
  }

  get checked() {
    return this.__checked;
  }

  set checked(value) {
    const old = this.checked;
    this.__checked = value;
    this.requestUpdate('checked', old);

    if (this._selectionController) {
      this._selectionController.update(this);
    }
  }

  _inputChangeHandler(e) {
    this.checked = e.target.checked;
  }

  _inputFocusHandler(e) {
    this._selectionController.focus(e, this);
  }

  _inputBlurHandler(e) {
    this._selectionController.blur(this);
  }

  get name() {
    return this.__name;
  }

  set name(value) {
    if (this._selectionController) {
      this._selectionController.unregister(this);
    }

    const old = this.name;
    this.__name = value;
    this.requestUpdate('name', old);

    if (this._selectionController) {
      this._selectionController.register(this);

      this._selectionController.update(this);
    }
  }

}

customElements.define('mwc-radio', Radio);
var mwcRadio = {
  MDCWCRadio: MDCWCRadio,
  Radio: Radio
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict';

const nativeShadow = !(window['ShadyDOM'] && window['ShadyDOM']['inUse']);
let nativeCssVariables_; /**
                          * @param {(ShadyCSSOptions | ShadyCSSInterface)=} settings
                          */

function calcCssVariables(settings) {
  if (settings && settings['shimcssproperties']) {
    nativeCssVariables_ = false;
  } else {
    // chrome 49 has semi-working css vars, check if box-shadow works
    // safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
    // However, shim css custom properties are only supported with ShadyDOM enabled,
    // so fall back on native if we do not detect ShadyDOM
    // Edge 15: custom properties used in ::before and ::after will also be used in the parent element
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12414257/
    nativeCssVariables_ = nativeShadow || Boolean(!navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)'));
  }
}

if (window.ShadyCSS && window.ShadyCSS.nativeCss !== undefined) {
  nativeCssVariables_ = window.ShadyCSS.nativeCss;
} else if (window.ShadyCSS) {
  calcCssVariables(window.ShadyCSS); // reset window variable to let ShadyCSS API take its place

  window.ShadyCSS = undefined;
} else {
  calcCssVariables(window['WebComponents'] && window['WebComponents']['flags']);
} // Hack for type error under new type inference which doesn't like that
// nativeCssVariables is updated in a function and assigns the type
// `function(): ?` instead of `boolean`.


const nativeCssVariables = /** @type {boolean} */nativeCssVariables_;
var styleSettings = {
  nativeShadow: nativeShadow,
  nativeCssVariables: nativeCssVariables
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /*
      Extremely simple css parser. Intended to be not more than what we need
      and definitely not necessarily correct =).
      */
'use strict'; /** @unrestricted */

class StyleNode {
  constructor() {
    /** @type {number} */this['start'] = 0; /** @type {number} */
    this['end'] = 0; /** @type {StyleNode} */
    this['previous'] = null; /** @type {StyleNode} */
    this['parent'] = null; /** @type {Array<StyleNode>} */
    this['rules'] = null; /** @type {string} */
    this['parsedCssText'] = ''; /** @type {string} */
    this['cssText'] = ''; /** @type {boolean} */
    this['atRule'] = false; /** @type {number} */
    this['type'] = 0; /** @type {string} */
    this['keyframesName'] = ''; /** @type {string} */
    this['selector'] = ''; /** @type {string} */
    this['parsedSelector'] = '';
  }

} // given a string of css, return a simple rule tree
/**
 * @param {string} text
 * @return {StyleNode}
 */

function parse(text) {
  text = clean(text);
  return parseCss(lex(text), text);
} // remove stuff we don't care about that may hinder parsing
/**
 * @param {string} cssText
 * @return {string}
 */

function clean(cssText) {
  return cssText.replace(RX.comments, '').replace(RX.port, '');
} // super simple {...} lexer that returns a node tree
/**
 * @param {string} text
 * @return {StyleNode}
 */

function lex(text) {
  let root = new StyleNode();
  root['start'] = 0;
  root['end'] = text.length;
  let n = root;

  for (let i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n['rules']) {
        n['rules'] = [];
      }

      let p = n;
      let previous = p['rules'][p['rules'].length - 1] || null;
      n = new StyleNode();
      n['start'] = i + 1;
      n['parent'] = p;
      n['previous'] = previous;
      p['rules'].push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n['end'] = i + 1;
      n = n['parent'] || root;
    }
  }

  return root;
} // add selectors/cssText to node tree
/**
 * @param {StyleNode} node
 * @param {string} text
 * @return {StyleNode}
 */

function parseCss(node, text) {
  let t = text.substring(node['start'], node['end'] - 1);
  node['parsedCssText'] = node['cssText'] = t.trim();

  if (node['parent']) {
    let ss = node['previous'] ? node['previous']['end'] : node['parent']['start'];
    t = text.substring(ss, node['start'] - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(RX.multipleSpaces, ' '); // TODO(sorvell): ad hoc; make selector include only after last ;
    // helps with mixin syntax

    t = t.substring(t.lastIndexOf(';') + 1);
    let s = node['parsedSelector'] = node['selector'] = t.trim();
    node['atRule'] = s.indexOf(AT_START) === 0; // note, support a subset of rule types...

    if (node['atRule']) {
      if (s.indexOf(MEDIA_START) === 0) {
        node['type'] = types.MEDIA_RULE;
      } else if (s.match(RX.keyframesRule)) {
        node['type'] = types.KEYFRAMES_RULE;
        node['keyframesName'] = node['selector'].split(RX.multipleSpaces).pop();
      }
    } else {
      if (s.indexOf(VAR_START) === 0) {
        node['type'] = types.MIXIN_RULE;
      } else {
        node['type'] = types.STYLE_RULE;
      }
    }
  }

  let r$ = node['rules'];

  if (r$) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }

  return node;
} /**
   * conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
   * expanded form that doesn't require trailing space `\000033`
   * @param {string} s
   * @return {string}
   */

function _expandUnicodeEscapes(s) {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
    let code = arguments[1],
        repeat = 6 - code.length;

    while (repeat--) {
      code = '0' + code;
    }

    return '\\' + code;
  });
} /**
   * stringify parsed css.
   * @param {StyleNode} node
   * @param {boolean=} preserveProperties
   * @param {string=} text
   * @return {string}
   */

function stringify(node, preserveProperties, text = '') {
  // calc rule cssText
  let cssText = '';

  if (node['cssText'] || node['rules']) {
    let r$ = node['rules'];

    if (r$ && !_hasMixinRules(r$)) {
      for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }
    } else {
      cssText = preserveProperties ? node['cssText'] : removeCustomProps(node['cssText']);
      cssText = cssText.trim();

      if (cssText) {
        cssText = '  ' + cssText + '\n';
      }
    }
  } // emit rule if there is cssText


  if (cssText) {
    if (node['selector']) {
      text += node['selector'] + ' ' + OPEN_BRACE + '\n';
    }

    text += cssText;

    if (node['selector']) {
      text += CLOSE_BRACE + '\n\n';
    }
  }

  return text;
} /**
   * @param {Array<StyleNode>} rules
   * @return {boolean}
   */

function _hasMixinRules(rules) {
  let r = rules[0];
  return Boolean(r) && Boolean(r['selector']) && r['selector'].indexOf(VAR_START) === 0;
} /**
   * @param {string} cssText
   * @return {string}
   */

function removeCustomProps(cssText) {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
} /**
   * @param {string} cssText
   * @return {string}
   */

function removeCustomPropAssignment(cssText) {
  return cssText.replace(RX.customProp, '').replace(RX.mixinProp, '');
} /**
   * @param {string} cssText
   * @return {string}
   */

function removeCustomPropApply(cssText) {
  return cssText.replace(RX.mixinApply, '').replace(RX.varApply, '');
} /** @enum {number} */

const types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1000
};
const OPEN_BRACE = '{';
const CLOSE_BRACE = '}'; // helper regexp's

const RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g
};
const VAR_START = '--';
const MEDIA_START = '@media';
const AT_START = '@';
var cssParse = {
  StyleNode: StyleNode,
  parse: parse,
  stringify: stringify,
  removeCustomPropAssignment: removeCustomPropAssignment,
  types: types
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const VAR_ASSIGN = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
const MIXIN_MATCH = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
const VAR_CONSUMED = /(--[\w-]+)\s*([:,;)]|$)/gi;
const ANIMATION_MATCH = /(animation\s*:)|(animation-name\s*:)/;
const MEDIA_MATCH = /@media\s(.*)/;
const IS_VAR = /^--/;
const BRACKETED = /\{[^}]*\}/g;
const HOST_PREFIX = '(?:^|[^.#[:])';
const HOST_SUFFIX = '($|[.:[\\s>+~])';
var commonRegex = {
  VAR_ASSIGN: VAR_ASSIGN,
  MIXIN_MATCH: MIXIN_MATCH,
  VAR_CONSUMED: VAR_CONSUMED,
  ANIMATION_MATCH: ANIMATION_MATCH,
  MEDIA_MATCH: MEDIA_MATCH,
  IS_VAR: IS_VAR,
  BRACKETED: BRACKETED,
  HOST_PREFIX: HOST_PREFIX,
  HOST_SUFFIX: HOST_SUFFIX
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /** @type {!Set<string>} */

const styleTextSet = new Set();
const scopingAttribute = 'shady-unscoped'; /**
                                            * Add a specifically-marked style to the document directly, and only one copy of that style.
                                            *
                                            * @param {!HTMLStyleElement} style
                                            * @return {undefined}
                                            */

function processUnscopedStyle(style) {
  const text = style.textContent;

  if (!styleTextSet.has(text)) {
    styleTextSet.add(text);
    const newStyle = style.cloneNode(true);
    document.head.appendChild(newStyle);
  }
} /**
   * Check if a style is supposed to be unscoped
   * @param {!HTMLStyleElement} style
   * @return {boolean} true if the style has the unscoping attribute
   */

function isUnscopedStyle(style) {
  return style.hasAttribute(scopingAttribute);
}

var unscopedStyleHandler = {
  scopingAttribute: scopingAttribute,
  processUnscopedStyle: processUnscopedStyle,
  isUnscopedStyle: isUnscopedStyle
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /**
               * @param {string|StyleNode} rules
               * @param {function(StyleNode)=} callback
               * @return {string}
               */

function toCssText(rules, callback) {
  if (!rules) {
    return '';
  }

  if (typeof rules === 'string') {
    rules = parse(rules);
  }

  if (callback) {
    forEachRule(rules, callback);
  }

  return stringify(rules, nativeCssVariables);
} /**
   * @param {HTMLStyleElement} style
   * @return {StyleNode}
   */

function rulesForStyle(style) {
  if (!style['__cssRules'] && style.textContent) {
    style['__cssRules'] = parse(style.textContent);
  }

  return style['__cssRules'] || null;
} // Tests if a rule is a keyframes selector, which looks almost exactly
// like a normal selector but is not (it has nothing to do with scoping
// for example).
/**
 * @param {StyleNode} rule
 * @return {boolean}
 */

function isKeyframesSelector(rule) {
  return Boolean(rule['parent']) && rule['parent']['type'] === types.KEYFRAMES_RULE;
} /**
   * @param {StyleNode} node
   * @param {Function=} styleRuleCallback
   * @param {Function=} keyframesRuleCallback
   * @param {boolean=} onlyActiveRules
   */

function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
  if (!node) {
    return;
  }

  let skipRules = false;
  let type = node['type'];

  if (onlyActiveRules) {
    if (type === types.MEDIA_RULE) {
      let matchMedia = node['selector'].match(MEDIA_MATCH);

      if (matchMedia) {
        // if rule is a non matching @media rule, skip subrules
        if (!window.matchMedia(matchMedia[1]).matches) {
          skipRules = true;
        }
      }
    }
  }

  if (type === types.STYLE_RULE) {
    styleRuleCallback(node);
  } else if (keyframesRuleCallback && type === types.KEYFRAMES_RULE) {
    keyframesRuleCallback(node);
  } else if (type === types.MIXIN_RULE) {
    skipRules = true;
  }

  let r$ = node['rules'];

  if (r$ && !skipRules) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
    }
  }
} // add a string of cssText to the document.
/**
 * @param {string} cssText
 * @param {string} moniker
 * @param {Node} target
 * @param {Node} contextNode
 * @return {HTMLStyleElement}
 */

function applyCss(cssText, moniker, target, contextNode) {
  let style = createScopeStyle(cssText, moniker);
  applyStyle(style, target, contextNode);
  return style;
} /**
   * @param {string} cssText
   * @param {string} moniker
   * @return {HTMLStyleElement}
   */

function createScopeStyle(cssText, moniker) {
  let style = /** @type {HTMLStyleElement} */document.createElement('style');

  if (moniker) {
    style.setAttribute('scope', moniker);
  }

  style.textContent = cssText;
  return style;
} /**
   * Track the position of the last added style for placing placeholders
   * @type {Node}
   */

let lastHeadApplyNode = null; // insert a comment node as a styling position placeholder.
/**
 * @param {string} moniker
 * @return {!Comment}
 */

function applyStylePlaceHolder(moniker) {
  let placeHolder = document.createComment(' Shady DOM styles for ' + moniker + ' ');
  let after = lastHeadApplyNode ? lastHeadApplyNode['nextSibling'] : null;
  let scope = document.head;
  scope.insertBefore(placeHolder, after || scope.firstChild);
  lastHeadApplyNode = placeHolder;
  return placeHolder;
} /**
   * @param {HTMLStyleElement} style
   * @param {?Node} target
   * @param {?Node} contextNode
   */

function applyStyle(style, target, contextNode) {
  target = target || document.head;
  let after = contextNode && contextNode.nextSibling || target.firstChild;
  target.insertBefore(style, after);

  if (!lastHeadApplyNode) {
    lastHeadApplyNode = style;
  } else {
    // only update lastHeadApplyNode if the new style is inserted after the old lastHeadApplyNode
    let position = style.compareDocumentPosition(lastHeadApplyNode);

    if (position === Node.DOCUMENT_POSITION_PRECEDING) {
      lastHeadApplyNode = style;
    }
  }
} /**
   * @param {string} buildType
   * @return {boolean}
   */

function isTargetedBuild(buildType) {
  return nativeShadow ? buildType === 'shadow' : buildType === 'shady';
} /**
   * Walk from text[start] matching parens and
   * returns position of the outer end paren
   * @param {string} text
   * @param {number} start
   * @return {number}
   */

function findMatchingParen(text, start) {
  let level = 0;

  for (let i = start, l = text.length; i < l; i++) {
    if (text[i] === '(') {
      level++;
    } else if (text[i] === ')') {
      if (--level === 0) {
        return i;
      }
    }
  }

  return -1;
} /**
   * @param {string} str
   * @param {function(string, string, string, string)} callback
   */

function processVariableAndFallback(str, callback) {
  // find 'var('
  let start = str.indexOf('var(');

  if (start === -1) {
    // no var?, everything is prefix
    return callback(str, '', '', '');
  } //${prefix}var(${inner})${suffix}


  let end = findMatchingParen(str, start + 3);
  let inner = str.substring(start + 4, end);
  let prefix = str.substring(0, start); // suffix may have other variables

  let suffix = processVariableAndFallback(str.substring(end + 1), callback);
  let comma = inner.indexOf(','); // value and fallback args should be trimmed to match in property lookup

  if (comma === -1) {
    // variable, no fallback
    return callback(prefix, inner.trim(), '', suffix);
  } // var(${value},${fallback})


  let value = inner.substring(0, comma).trim();
  let fallback = inner.substring(comma + 1).trim();
  return callback(prefix, value, fallback, suffix);
} /**
   * @param {Element} element
   * @param {string} value
   */

function setElementClassRaw(element, value) {
  // use native setAttribute provided by ShadyDOM when setAttribute is patched
  if (nativeShadow) {
    element.setAttribute('class', value);
  } else {
    window['ShadyDOM']['nativeMethods']['setAttribute'].call(element, 'class', value);
  }
} /**
   * @param {Element | {is: string, extends: string}} element
   * @return {{is: string, typeExtension: string}}
   */

function getIsExtends(element) {
  let localName = element['localName'];
  let is = '',
      typeExtension = ''; /*
                          NOTE: technically, this can be wrong for certain svg elements
                          with `-` in the name like `<font-face>`
                          */

  if (localName) {
    if (localName.indexOf('-') > -1) {
      is = localName;
    } else {
      typeExtension = localName;
      is = element.getAttribute && element.getAttribute('is') || '';
    }
  } else {
    is = /** @type {?} */element.is;
    typeExtension = /** @type {?} */element.extends;
  }

  return {
    is,
    typeExtension
  };
} /**
   * @param {Element|DocumentFragment} element
   * @return {string}
   */

function gatherStyleText(element) {
  /** @type {!Array<string>} */const styleTextParts = [];
  const styles = /** @type {!NodeList<!HTMLStyleElement>} */element.querySelectorAll('style');

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];

    if (isUnscopedStyle(style)) {
      if (!nativeShadow) {
        processUnscopedStyle(style);
        style.parentNode.removeChild(style);
      }
    } else {
      styleTextParts.push(style.textContent);
      style.parentNode.removeChild(style);
    }
  }

  return styleTextParts.join('').trim();
} /**
   * Split a selector separated by commas into an array in a smart way
   * @param {string} selector
   * @return {!Array<string>}
   */

function splitSelectorList(selector) {
  const parts = [];
  let part = '';

  for (let i = 0; i >= 0 && i < selector.length; i++) {
    // A selector with parentheses will be one complete part
    if (selector[i] === '(') {
      // find the matching paren
      const end = findMatchingParen(selector, i); // push the paren block into the part

      part += selector.slice(i, end + 1); // move the index to after the paren block

      i = end;
    } else if (selector[i] === ',') {
      parts.push(part);
      part = '';
    } else {
      part += selector[i];
    }
  } // catch any pieces after the last comma


  if (part) {
    parts.push(part);
  }

  return parts;
}

const CSS_BUILD_ATTR = 'css-build'; /**
                                     * Return the polymer-css-build "build type" applied to this element
                                     *
                                     * @param {!HTMLElement} element
                                     * @return {string} Can be "", "shady", or "shadow"
                                     */

function getCssBuild(element) {
  if (element.__cssBuild === undefined) {
    // try attribute first, as it is the common case
    const attrValue = element.getAttribute(CSS_BUILD_ATTR);

    if (attrValue) {
      element.__cssBuild = attrValue;
    } else {
      const buildComment = getBuildComment(element);

      if (buildComment !== '') {
        // remove build comment so it is not needlessly copied into every element instance
        removeBuildComment(element);
      }

      element.__cssBuild = buildComment;
    }
  }

  return element.__cssBuild || '';
} /**
   * Check if the given element, either a <template> or <style>, has been processed
   * by polymer-css-build.
   *
   * If so, then we can make a number of optimizations:
   * - polymer-css-build will decompose mixins into individual CSS Custom Properties,
   * so the ApplyShim can be skipped entirely.
   * - Under native ShadowDOM, the style text can just be copied into each instance
   * without modification
   * - If the build is "shady" and ShadyDOM is in use, the styling does not need
   * scoping beyond the shimming of CSS Custom Properties
   *
   * @param {!HTMLElement} element
   * @return {boolean}
   */

function elementHasBuiltCss(element) {
  return getCssBuild(element) !== '';
} /**
   * For templates made with tagged template literals, polymer-css-build will
   * insert a comment of the form `<!--css-build:shadow-->`
   *
   * @param {!HTMLElement} element
   * @return {string}
   */

function getBuildComment(element) {
  const buildComment = element.localName === 'template' ? element.content.firstChild : element.firstChild;

  if (buildComment instanceof Comment) {
    const commentParts = buildComment.textContent.trim().split(':');

    if (commentParts[0] === CSS_BUILD_ATTR) {
      return commentParts[1];
    }
  }

  return '';
} /**
   * @param {!HTMLElement} element
   */

function removeBuildComment(element) {
  const buildComment = element.localName === 'template' ? element.content.firstChild : element.firstChild;
  buildComment.parentNode.removeChild(buildComment);
}

var styleUtil = {
  toCssText: toCssText,
  rulesForStyle: rulesForStyle,
  isKeyframesSelector: isKeyframesSelector,
  forEachRule: forEachRule,
  applyCss: applyCss,
  createScopeStyle: createScopeStyle,
  applyStylePlaceHolder: applyStylePlaceHolder,
  applyStyle: applyStyle,
  isTargetedBuild: isTargetedBuild,
  findMatchingParen: findMatchingParen,
  processVariableAndFallback: processVariableAndFallback,
  setElementClassRaw: setElementClassRaw,
  getIsExtends: getIsExtends,
  gatherStyleText: gatherStyleText,
  splitSelectorList: splitSelectorList,
  getCssBuild: getCssBuild,
  elementHasBuiltCss: elementHasBuiltCss,
  getBuildComment: getBuildComment
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /**
               * @param {Element} element
               * @param {Object=} properties
               */

function updateNativeProperties(element, properties) {
  // remove previous properties
  for (let p in properties) {
    // NOTE: for bc with shim, don't apply null values.
    if (p === null) {
      element.style.removeProperty(p);
    } else {
      element.style.setProperty(p, properties[p]);
    }
  }
} /**
   * @param {Element} element
   * @param {string} property
   * @return {string}
   */

function getComputedStyleValue(element, property) {
  /**
   * @const {string}
   */const value = window.getComputedStyle(element).getPropertyValue(property);

  if (!value) {
    return '';
  } else {
    return value.trim();
  }
} /**
   * return true if `cssText` contains a mixin definition or consumption
   * @param {string} cssText
   * @return {boolean}
   */

function detectMixin(cssText) {
  const has = MIXIN_MATCH.test(cssText) || VAR_ASSIGN.test(cssText); // reset state of the regexes

  MIXIN_MATCH.lastIndex = 0;
  VAR_ASSIGN.lastIndex = 0;
  return has;
}

var commonUtils = {
  updateNativeProperties: updateNativeProperties,
  getComputedStyleValue: getComputedStyleValue,
  detectMixin: detectMixin
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /*
       * The apply shim simulates the behavior of `@apply` proposed at
       * https://tabatkins.github.io/specs/css-apply-rule/.
       * The approach is to convert a property like this:
       *
       *    --foo: {color: red; background: blue;}
       *
       * to this:
       *
       *    --foo_-_color: red;
       *    --foo_-_background: blue;
       *
       * Then where `@apply --foo` is used, that is converted to:
       *
       *    color: var(--foo_-_color);
       *    background: var(--foo_-_background);
       *
       * This approach generally works but there are some issues and limitations.
       * Consider, for example, that somewhere *between* where `--foo` is set and used,
       * another element sets it to:
       *
       *    --foo: { border: 2px solid red; }
       *
       * We must now ensure that the color and background from the previous setting
       * do not apply. This is accomplished by changing the property set to this:
       *
       *    --foo_-_border: 2px solid red;
       *    --foo_-_color: initial;
       *    --foo_-_background: initial;
       *
       * This works but introduces one new issue.
       * Consider this setup at the point where the `@apply` is used:
       *
       *    background: orange;
       *    `@apply` --foo;
       *
       * In this case the background will be unset (initial) rather than the desired
       * `orange`. We address this by altering the property set to use a fallback
       * value like this:
       *
       *    color: var(--foo_-_color);
       *    background: var(--foo_-_background, orange);
       *    border: var(--foo_-_border);
       *
       * Note that the default is retained in the property set and the `background` is
       * the desired `orange`. This leads us to a limitation.
       *
       * Limitation 1:
      
       * Only properties in the rule where the `@apply`
       * is used are considered as default values.
       * If another rule matches the element and sets `background` with
       * less specificity than the rule in which `@apply` appears,
       * the `background` will not be set.
       *
       * Limitation 2:
       *
       * When using Polymer's `updateStyles` api, new properties may not be set for
       * `@apply` properties.
      
      */
'use strict';

const APPLY_NAME_CLEAN = /;\s*/m;
const INITIAL_INHERIT = /^\s*(initial)|(inherit)\s*$/;
const IMPORTANT = /\s*!important/; // separator used between mixin-name and mixin-property-name when producing properties
// NOTE: plain '-' may cause collisions in user styles

const MIXIN_VAR_SEP = '_-_'; /**
                              * @typedef {!Object<string, string>}
                              */
let PropertyEntry; // eslint-disable-line no-unused-vars
/**
 * @typedef {!Object<string, boolean>}
 */
let DependantsEntry; // eslint-disable-line no-unused-vars
/** @typedef {{
 *    properties: PropertyEntry,
 *    dependants: DependantsEntry
 * }}
 */
let MixinMapEntry; // eslint-disable-line no-unused-vars
// map of mixin to property names
// --foo: {border: 2px} -> {properties: {(--foo, ['border'])}, dependants: {'element-name': proto}}

class MixinMap {
  constructor() {
    /** @type {!Object<string, !MixinMapEntry>} */this._map = {};
  } /**
     * @param {string} name
     * @param {!PropertyEntry} props
     */

  set(name, props) {
    name = name.trim();
    this._map[name] = {
      properties: props,
      dependants: {}
    };
  } /**
     * @param {string} name
     * @return {MixinMapEntry}
     */

  get(name) {
    name = name.trim();
    return this._map[name] || null;
  }

} /**
   * Callback for when an element is marked invalid
   * @type {?function(string)}
   */

let invalidCallback = null; /** @unrestricted */

class ApplyShim {
  constructor() {
    /** @type {?string} */this._currentElement = null; /** @type {HTMLMetaElement} */
    this._measureElement = null;
    this._map = new MixinMap();
  } /**
     * return true if `cssText` contains a mixin definition or consumption
     * @param {string} cssText
     * @return {boolean}
     */

  detectMixin(cssText) {
    return detectMixin(cssText);
  } /**
     * Gather styles into one style for easier processing
     * @param {!HTMLTemplateElement} template
     * @return {HTMLStyleElement}
     */

  gatherStyles(template) {
    const styleText = gatherStyleText(template.content);

    if (styleText) {
      const style = /** @type {!HTMLStyleElement} */document.createElement('style');
      style.textContent = styleText;
      template.content.insertBefore(style, template.content.firstChild);
      return style;
    }

    return null;
  } /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     * @return {StyleNode}
     */

  transformTemplate(template, elementName) {
    if (template._gatheredStyle === undefined) {
      template._gatheredStyle = this.gatherStyles(template);
    } /** @type {HTMLStyleElement} */

    const style = template._gatheredStyle;
    return style ? this.transformStyle(style, elementName) : null;
  } /**
     * @param {!HTMLStyleElement} style
     * @param {string} elementName
     * @return {StyleNode}
     */

  transformStyle(style, elementName = '') {
    let ast = rulesForStyle(style);
    this.transformRules(ast, elementName);
    style.textContent = toCssText(ast);
    return ast;
  } /**
     * @param {!HTMLStyleElement} style
     * @return {StyleNode}
     */

  transformCustomStyle(style) {
    let ast = rulesForStyle(style);
    forEachRule(ast, rule => {
      if (rule['selector'] === ':root') {
        rule['selector'] = 'html';
      }

      this.transformRule(rule);
    });
    style.textContent = toCssText(ast);
    return ast;
  } /**
     * @param {StyleNode} rules
     * @param {string} elementName
     */

  transformRules(rules, elementName) {
    this._currentElement = elementName;
    forEachRule(rules, r => {
      this.transformRule(r);
    });
    this._currentElement = null;
  } /**
     * @param {!StyleNode} rule
     */

  transformRule(rule) {
    rule['cssText'] = this.transformCssText(rule['parsedCssText'], rule); // :root was only used for variable assignment in property shim,
    // but generates invalid selectors with real properties.
    // replace with `:host > *`, which serves the same effect

    if (rule['selector'] === ':root') {
      rule['selector'] = ':host > *';
    }
  } /**
     * @param {string} cssText
     * @param {!StyleNode} rule
     * @return {string}
     */

  transformCssText(cssText, rule) {
    // produce variables
    cssText = cssText.replace(VAR_ASSIGN, (matchText, propertyName, valueProperty, valueMixin) => this._produceCssProperties(matchText, propertyName, valueProperty, valueMixin, rule)); // consume mixins

    return this._consumeCssProperties(cssText, rule);
  } /**
     * @param {string} property
     * @return {string}
     */

  _getInitialValueForProperty(property) {
    if (!this._measureElement) {
      this._measureElement = /** @type {HTMLMetaElement} */document.createElement('meta');

      this._measureElement.setAttribute('apply-shim-measure', '');

      this._measureElement.style.all = 'initial';
      document.head.appendChild(this._measureElement);
    }

    return window.getComputedStyle(this._measureElement).getPropertyValue(property);
  } /**
     * Walk over all rules before this rule to find fallbacks for mixins
     *
     * @param {!StyleNode} startRule
     * @return {!Object}
     */

  _fallbacksFromPreviousRules(startRule) {
    // find the "top" rule
    let topRule = startRule;

    while (topRule['parent']) {
      topRule = topRule['parent'];
    }

    const fallbacks = {};
    let seenStartRule = false;
    forEachRule(topRule, r => {
      // stop when we hit the input rule
      seenStartRule = seenStartRule || r === startRule;

      if (seenStartRule) {
        return;
      } // NOTE: Only matching selectors are "safe" for this fallback processing
      // It would be prohibitive to run `matchesSelector()` on each selector,
      // so we cheat and only check if the same selector string is used, which
      // guarantees things like specificity matching


      if (r['selector'] === startRule['selector']) {
        Object.assign(fallbacks, this._cssTextToMap(r['parsedCssText']));
      }
    });
    return fallbacks;
  } /**
     * replace mixin consumption with variable consumption
     * @param {string} text
     * @param {!StyleNode=} rule
     * @return {string}
     */

  _consumeCssProperties(text, rule) {
    /** @type {Array} */let m = null; // loop over text until all mixins with defintions have been applied

    while (m = MIXIN_MATCH.exec(text)) {
      let matchText = m[0];
      let mixinName = m[1];
      let idx = m.index; // collect properties before apply to be "defaults" if mixin might override them
      // match includes a "prefix", so find the start and end positions of @apply

      let applyPos = idx + matchText.indexOf('@apply');
      let afterApplyPos = idx + matchText.length; // find props defined before this @apply

      let textBeforeApply = text.slice(0, applyPos);
      let textAfterApply = text.slice(afterApplyPos);
      let defaults = rule ? this._fallbacksFromPreviousRules(rule) : {};
      Object.assign(defaults, this._cssTextToMap(textBeforeApply));

      let replacement = this._atApplyToCssProperties(mixinName, defaults); // use regex match position to replace mixin, keep linear processing time


      text = `${textBeforeApply}${replacement}${textAfterApply}`; // move regex search to _after_ replacement

      MIXIN_MATCH.lastIndex = idx + replacement.length;
    }

    return text;
  } /**
     * produce variable consumption at the site of mixin consumption
     * `@apply` --foo; -> for all props (${propname}: var(--foo_-_${propname}, ${fallback[propname]}}))
     * Example:
     *  border: var(--foo_-_border); padding: var(--foo_-_padding, 2px)
     *
     * @param {string} mixinName
     * @param {Object} fallbacks
     * @return {string}
     */

  _atApplyToCssProperties(mixinName, fallbacks) {
    mixinName = mixinName.replace(APPLY_NAME_CLEAN, '');
    let vars = [];

    let mixinEntry = this._map.get(mixinName); // if we depend on a mixin before it is created
    // make a sentinel entry in the map to add this element as a dependency for when it is defined.


    if (!mixinEntry) {
      this._map.set(mixinName, {});

      mixinEntry = this._map.get(mixinName);
    }

    if (mixinEntry) {
      if (this._currentElement) {
        mixinEntry.dependants[this._currentElement] = true;
      }

      let p, parts, f;
      const properties = mixinEntry.properties;

      for (p in properties) {
        f = fallbacks && fallbacks[p];
        parts = [p, ': var(', mixinName, MIXIN_VAR_SEP, p];

        if (f) {
          parts.push(',', f.replace(IMPORTANT, ''));
        }

        parts.push(')');

        if (IMPORTANT.test(properties[p])) {
          parts.push(' !important');
        }

        vars.push(parts.join(''));
      }
    }

    return vars.join('; ');
  } /**
     * @param {string} property
     * @param {string} value
     * @return {string}
     */

  _replaceInitialOrInherit(property, value) {
    let match = INITIAL_INHERIT.exec(value);

    if (match) {
      if (match[1]) {
        // initial
        // replace `initial` with the concrete initial value for this property
        value = this._getInitialValueForProperty(property);
      } else {
        // inherit
        // with this purposfully illegal value, the variable will be invalid at
        // compute time (https://www.w3.org/TR/css-variables/#invalid-at-computed-value-time)
        // and for inheriting values, will behave similarly
        // we cannot support the same behavior for non inheriting values like 'border'
        value = 'apply-shim-inherit';
      }
    }

    return value;
  } /**
     * "parse" a mixin definition into a map of properties and values
     * cssTextToMap('border: 2px solid black') -> ('border', '2px solid black')
     * @param {string} text
     * @return {!Object<string, string>}
     */

  _cssTextToMap(text) {
    let props = text.split(';');
    let property, value;
    let out = {};

    for (let i = 0, p, sp; i < props.length; i++) {
      p = props[i];

      if (p) {
        sp = p.split(':'); // ignore lines that aren't definitions like @media

        if (sp.length > 1) {
          property = sp[0].trim(); // some properties may have ':' in the value, like data urls

          value = this._replaceInitialOrInherit(property, sp.slice(1).join(':'));
          out[property] = value;
        }
      }
    }

    return out;
  } /**
     * @param {MixinMapEntry} mixinEntry
     */

  _invalidateMixinEntry(mixinEntry) {
    if (!invalidCallback) {
      return;
    }

    for (let elementName in mixinEntry.dependants) {
      if (elementName !== this._currentElement) {
        invalidCallback(elementName);
      }
    }
  } /**
     * @param {string} matchText
     * @param {string} propertyName
     * @param {?string} valueProperty
     * @param {?string} valueMixin
     * @param {!StyleNode} rule
     * @return {string}
     */

  _produceCssProperties(matchText, propertyName, valueProperty, valueMixin, rule) {
    // handle case where property value is a mixin
    if (valueProperty) {
      // form: --mixin2: var(--mixin1), where --mixin1 is in the map
      processVariableAndFallback(valueProperty, (prefix, value) => {
        if (value && this._map.get(value)) {
          valueMixin = `@apply ${value};`;
        }
      });
    }

    if (!valueMixin) {
      return matchText;
    }

    let mixinAsProperties = this._consumeCssProperties('' + valueMixin, rule);

    let prefix = matchText.slice(0, matchText.indexOf('--'));

    let mixinValues = this._cssTextToMap(mixinAsProperties);

    let combinedProps = mixinValues;

    let mixinEntry = this._map.get(propertyName);

    let oldProps = mixinEntry && mixinEntry.properties;

    if (oldProps) {
      // NOTE: since we use mixin, the map of properties is updated here
      // and this is what we want.
      combinedProps = Object.assign(Object.create(oldProps), mixinValues);
    } else {
      this._map.set(propertyName, combinedProps);
    }

    let out = [];
    let p, v; // set variables defined by current mixin

    let needToInvalidate = false;

    for (p in combinedProps) {
      v = mixinValues[p]; // if property not defined by current mixin, set initial

      if (v === undefined) {
        v = 'initial';
      }

      if (oldProps && !(p in oldProps)) {
        needToInvalidate = true;
      }

      out.push(`${propertyName}${MIXIN_VAR_SEP}${p}: ${v}`);
    }

    if (needToInvalidate) {
      this._invalidateMixinEntry(mixinEntry);
    }

    if (mixinEntry) {
      mixinEntry.properties = combinedProps;
    } // because the mixinMap is global, the mixin might conflict with
    // a different scope's simple variable definition:
    // Example:
    // some style somewhere:
    // --mixin1:{ ... }
    // --mixin2: var(--mixin1);
    // some other element:
    // --mixin1: 10px solid red;
    // --foo: var(--mixin1);
    // In this case, we leave the original variable definition in place.


    if (valueProperty) {
      prefix = `${matchText};${prefix}`;
    }

    return `${prefix}${out.join('; ')};`;
  }

} /* exports */

ApplyShim.prototype['detectMixin'] = ApplyShim.prototype.detectMixin;
ApplyShim.prototype['transformStyle'] = ApplyShim.prototype.transformStyle;
ApplyShim.prototype['transformCustomStyle'] = ApplyShim.prototype.transformCustomStyle;
ApplyShim.prototype['transformRules'] = ApplyShim.prototype.transformRules;
ApplyShim.prototype['transformRule'] = ApplyShim.prototype.transformRule;
ApplyShim.prototype['transformTemplate'] = ApplyShim.prototype.transformTemplate;
ApplyShim.prototype['_separator'] = MIXIN_VAR_SEP;
Object.defineProperty(ApplyShim.prototype, 'invalidCallback', {
  /** @return {?function(string)} */get() {
    return invalidCallback;
  },

  /** @param {?function(string)} cb */set(cb) {
    invalidCallback = cb;
  }

});
var applyShim = {
  default: ApplyShim
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /**
               * @const {!Object<string, !HTMLTemplateElement>}
               */

const templateMap = {};
var templateMap$1 = {
  default: templateMap
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /*
               * Utilities for handling invalidating apply-shim mixins for a given template.
               *
               * The invalidation strategy involves keeping track of the "current" version of a template's mixins, and updating that count when a mixin is invalidated.
               * The template
               */ /** @const {string} */

const CURRENT_VERSION = '_applyShimCurrentVersion'; /** @const {string} */
const NEXT_VERSION = '_applyShimNextVersion'; /** @const {string} */
const VALIDATING_VERSION = '_applyShimValidatingVersion'; /**
                                                           * @const {Promise<void>}
                                                           */
const promise = Promise.resolve(); /**
                                    * @param {string} elementName
                                    */

function invalidate(elementName) {
  let template = templateMap[elementName];

  if (template) {
    invalidateTemplate(template);
  }
} /**
   * This function can be called multiple times to mark a template invalid
   * and signal that the style inside must be regenerated.
   *
   * Use `startValidatingTemplate` to begin an asynchronous validation cycle.
   * During that cycle, call `templateIsValidating` to see if the template must
   * be revalidated
   * @param {HTMLTemplateElement} template
   */

function invalidateTemplate(template) {
  // default the current version to 0
  template[CURRENT_VERSION] = template[CURRENT_VERSION] || 0; // ensure the "validating for" flag exists

  template[VALIDATING_VERSION] = template[VALIDATING_VERSION] || 0; // increment the next version

  template[NEXT_VERSION] = (template[NEXT_VERSION] || 0) + 1;
} /**
   * @param {string} elementName
   * @return {boolean}
   */

function isValid(elementName) {
  let template = templateMap[elementName];

  if (template) {
    return templateIsValid(template);
  }

  return true;
} /**
   * @param {HTMLTemplateElement} template
   * @return {boolean}
   */

function templateIsValid(template) {
  return template[CURRENT_VERSION] === template[NEXT_VERSION];
} /**
   * @param {string} elementName
   * @return {boolean}
   */

function isValidating(elementName) {
  let template = templateMap[elementName];

  if (template) {
    return templateIsValidating(template);
  }

  return false;
} /**
   * Returns true if the template is currently invalid and `startValidating` has been called since the last invalidation.
   * If false, the template must be validated.
   * @param {HTMLTemplateElement} template
   * @return {boolean}
   */

function templateIsValidating(template) {
  return !templateIsValid(template) && template[VALIDATING_VERSION] === template[NEXT_VERSION];
} /**
   * the template is marked as `validating` for one microtask so that all instances
   * found in the tree crawl of `applyStyle` will update themselves,
   * but the template will only be updated once.
   * @param {string} elementName
  */

function startValidating(elementName) {
  let template = templateMap[elementName];
  startValidatingTemplate(template);
} /**
   * Begin an asynchronous invalidation cycle.
   * This should be called after every validation of a template
   *
   * After one microtask, the template will be marked as valid until the next call to `invalidateTemplate`
   * @param {HTMLTemplateElement} template
   */

function startValidatingTemplate(template) {
  // remember that the current "next version" is the reason for this validation cycle
  template[VALIDATING_VERSION] = template[NEXT_VERSION]; // however, there only needs to be one async task to clear the counters

  if (!template._validating) {
    template._validating = true;
    promise.then(function () {
      // sync the current version to let future invalidations cause a refresh cycle
      template[CURRENT_VERSION] = template[NEXT_VERSION];
      template._validating = false;
    });
  }
} /**
   * @return {boolean}
   */

function elementsAreInvalid() {
  for (let elementName in templateMap) {
    let template = templateMap[elementName];

    if (!templateIsValid(template)) {
      return true;
    }
  }

  return false;
}

var applyShimUtils = {
  invalidate: invalidate,
  invalidateTemplate: invalidateTemplate,
  isValid: isValid,
  templateIsValid: templateIsValid,
  isValidating: isValidating,
  templateIsValidating: templateIsValidating,
  startValidating: startValidating,
  startValidatingTemplate: startValidatingTemplate,
  elementsAreInvalid: elementsAreInvalid
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /** @type {Promise<void>} */

let readyPromise = null; /** @type {?function(?function())} */
let whenReady = window['HTMLImports'] && window['HTMLImports']['whenReady'] || null; /** @type {function()} */
let resolveFn; /**
                * @param {?function()} callback
                */

function documentWait(callback) {
  requestAnimationFrame(function () {
    if (whenReady) {
      whenReady(callback);
    } else {
      if (!readyPromise) {
        readyPromise = new Promise(resolve => {
          resolveFn = resolve;
        });

        if (document.readyState === 'complete') {
          resolveFn();
        } else {
          document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
              resolveFn();
            }
          });
        }
      }

      readyPromise.then(function () {
        callback && callback();
      });
    }
  });
}

var documentWait$1 = {
  default: documentWait
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /**
               * @typedef {HTMLStyleElement | {getStyle: function():HTMLStyleElement}}
               */

let CustomStyleProvider;
const SEEN_MARKER = '__seenByShadyCSS';
const CACHED_STYLE = '__shadyCSSCachedStyle'; /** @type {?function(!HTMLStyleElement)} */
let transformFn = null; /** @type {?function()} */
let validateFn = null; /**
                       This interface is provided to add document-level <style> elements to ShadyCSS for processing.
                       These styles must be processed by ShadyCSS to simulate ShadowRoot upper-bound encapsulation from outside styles
                       In addition, these styles may also need to be processed for @apply rules and CSS Custom Properties
                       
                       To add document-level styles to ShadyCSS, one can call `ShadyCSS.addDocumentStyle(styleElement)` or `ShadyCSS.addDocumentStyle({getStyle: () => styleElement})`
                       
                       In addition, if the process used to discover document-level styles can be synchronously flushed, one should set `ShadyCSS.documentStyleFlush`.
                       This function will be called when calculating styles.
                       
                       An example usage of the document-level styling api can be found in `examples/document-style-lib.js`
                       
                       @unrestricted
                       */

class CustomStyleInterface {
  constructor() {
    /** @type {!Array<!CustomStyleProvider>} */this['customStyles'] = [];
    this['enqueued'] = false; // NOTE(dfreedm): use quotes here to prevent closure inlining to `function(){}`;

    documentWait(() => {
      if (window['ShadyCSS']['flushCustomStyles']) {
        window['ShadyCSS']['flushCustomStyles']();
      }
    });
  } /**
     * Queue a validation for new custom styles to batch style recalculations
     */

  enqueueDocumentValidation() {
    if (this['enqueued'] || !validateFn) {
      return;
    }

    this['enqueued'] = true;
    documentWait(validateFn);
  } /**
     * @param {!HTMLStyleElement} style
     */

  addCustomStyle(style) {
    if (!style[SEEN_MARKER]) {
      style[SEEN_MARKER] = true;
      this['customStyles'].push(style);
      this.enqueueDocumentValidation();
    }
  } /**
     * @param {!CustomStyleProvider} customStyle
     * @return {HTMLStyleElement}
     */

  getStyleForCustomStyle(customStyle) {
    if (customStyle[CACHED_STYLE]) {
      return customStyle[CACHED_STYLE];
    }

    let style;

    if (customStyle['getStyle']) {
      style = customStyle['getStyle']();
    } else {
      style = customStyle;
    }

    return style;
  } /**
     * @return {!Array<!CustomStyleProvider>}
     */

  processStyles() {
    const cs = this['customStyles'];

    for (let i = 0; i < cs.length; i++) {
      const customStyle = cs[i];

      if (customStyle[CACHED_STYLE]) {
        continue;
      }

      const style = this.getStyleForCustomStyle(customStyle);

      if (style) {
        // HTMLImports polyfill may have cloned the style into the main document,
        // which is referenced with __appliedElement.
        const styleToTransform = /** @type {!HTMLStyleElement} */style['__appliedElement'] || style;

        if (transformFn) {
          transformFn(styleToTransform);
        }

        customStyle[CACHED_STYLE] = styleToTransform;
      }
    }

    return cs;
  }

}

CustomStyleInterface.prototype['addCustomStyle'] = CustomStyleInterface.prototype.addCustomStyle;
CustomStyleInterface.prototype['getStyleForCustomStyle'] = CustomStyleInterface.prototype.getStyleForCustomStyle;
CustomStyleInterface.prototype['processStyles'] = CustomStyleInterface.prototype.processStyles;
Object.defineProperties(CustomStyleInterface.prototype, {
  'transformCallback': {
    /** @return {?function(!HTMLStyleElement)} */get() {
      return transformFn;
    },

    /** @param {?function(!HTMLStyleElement)} fn */set(fn) {
      transformFn = fn;
    }

  },
  'validateCallback': {
    /** @return {?function()} */get() {
      return validateFn;
    },

    /**
     * @param {?function()} fn
     * @this {CustomStyleInterface}
     */set(fn) {
      let needsEnqueue = false;

      if (!validateFn) {
        needsEnqueue = true;
      }

      validateFn = fn;

      if (needsEnqueue) {
        this.enqueueDocumentValidation();
      }
    }

  }
}); /** @typedef {{
     * customStyles: !Array<!CustomStyleProvider>,
     * addCustomStyle: function(!CustomStyleProvider),
     * getStyleForCustomStyle: function(!CustomStyleProvider): HTMLStyleElement,
     * findStyles: function(),
     * transformCallback: ?function(!HTMLStyleElement),
     * validateCallback: ?function()
     * }}
     */
let CustomStyleInterfaceInterface;
var customStyleInterface = {
  CustomStyleProvider: CustomStyleProvider,
  default: CustomStyleInterface,
  CustomStyleInterfaceInterface: CustomStyleInterfaceInterface
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict'; /** @const {ApplyShim} */

const applyShim$1 = new ApplyShim();

class ApplyShimInterface {
  constructor() {
    /** @type {?CustomStyleInterfaceInterface} */this.customStyleInterface = null;
    applyShim$1['invalidCallback'] = invalidate;
  }

  ensure() {
    if (this.customStyleInterface) {
      return;
    }

    this.customStyleInterface = window.ShadyCSS.CustomStyleInterface;

    if (this.customStyleInterface) {
      this.customStyleInterface['transformCallback'] = style => {
        applyShim$1.transformCustomStyle(style);
      };

      this.customStyleInterface['validateCallback'] = () => {
        requestAnimationFrame(() => {
          if (this.customStyleInterface['enqueued']) {
            this.flushCustomStyles();
          }
        });
      };
    }
  } /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     */

  prepareTemplate(template, elementName) {
    this.ensure();

    if (elementHasBuiltCss(template)) {
      return;
    }

    templateMap[elementName] = template;
    let ast = applyShim$1.transformTemplate(template, elementName); // save original style ast to use for revalidating instances

    template['_styleAst'] = ast;
  }

  flushCustomStyles() {
    this.ensure();

    if (!this.customStyleInterface) {
      return;
    }

    let styles = this.customStyleInterface['processStyles']();

    if (!this.customStyleInterface['enqueued']) {
      return;
    }

    for (let i = 0; i < styles.length; i++) {
      let cs = styles[i];
      let style = this.customStyleInterface['getStyleForCustomStyle'](cs);

      if (style) {
        applyShim$1.transformCustomStyle(style);
      }
    }

    this.customStyleInterface['enqueued'] = false;
  } /**
     * @param {HTMLElement} element
     * @param {Object=} properties
     */

  styleSubtree(element, properties) {
    this.ensure();

    if (properties) {
      updateNativeProperties(element, properties);
    }

    if (element.shadowRoot) {
      this.styleElement(element);
      let shadowChildren = element.shadowRoot.children || element.shadowRoot.childNodes;

      for (let i = 0; i < shadowChildren.length; i++) {
        this.styleSubtree( /** @type {HTMLElement} */shadowChildren[i]);
      }
    } else {
      let children = element.children || element.childNodes;

      for (let i = 0; i < children.length; i++) {
        this.styleSubtree( /** @type {HTMLElement} */children[i]);
      }
    }
  } /**
     * @param {HTMLElement} element
     */

  styleElement(element) {
    this.ensure();
    let {
      is
    } = getIsExtends(element);
    let template = templateMap[is];

    if (template && elementHasBuiltCss(template)) {
      return;
    }

    if (template && !templateIsValid(template)) {
      // only revalidate template once
      if (!templateIsValidating(template)) {
        this.prepareTemplate(template, is);
        startValidatingTemplate(template);
      } // update this element instance


      let root = element.shadowRoot;

      if (root) {
        let style = /** @type {HTMLStyleElement} */root.querySelector('style');

        if (style) {
          // reuse the template's style ast, it has all the original css text
          style['__cssRules'] = template['_styleAst'];
          style.textContent = toCssText(template['_styleAst']);
        }
      }
    }
  } /**
     * @param {Object=} properties
     */

  styleDocument(properties) {
    this.ensure();
    this.styleSubtree(document.body, properties);
  }

}

if (!window.ShadyCSS || !window.ShadyCSS.ScopingShim) {
  const applyShimInterface = new ApplyShimInterface();
  let CustomStyleInterface$$1 = window.ShadyCSS && window.ShadyCSS.CustomStyleInterface; /** @suppress {duplicate} */
  window.ShadyCSS = {
    /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     * @param {string=} elementExtends
     */prepareTemplate(template, elementName, elementExtends) {
      // eslint-disable-line no-unused-vars
      applyShimInterface.flushCustomStyles();
      applyShimInterface.prepareTemplate(template, elementName);
    },

    /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     * @param {string=} elementExtends
     */prepareTemplateStyles(template, elementName, elementExtends) {
      this.prepareTemplate(template, elementName, elementExtends);
    },

    /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     */prepareTemplateDom(template, elementName) {},

    // eslint-disable-line no-unused-vars
    /**
     * @param {!HTMLElement} element
     * @param {Object=} properties
     */styleSubtree(element, properties) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.styleSubtree(element, properties);
    },

    /**
     * @param {!HTMLElement} element
     */styleElement(element) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.styleElement(element);
    },

    /**
     * @param {Object=} properties
     */styleDocument(properties) {
      applyShimInterface.flushCustomStyles();
      applyShimInterface.styleDocument(properties);
    },

    /**
     * @param {Element} element
     * @param {string} property
     * @return {string}
     */getComputedStyleValue(element, property) {
      return getComputedStyleValue(element, property);
    },

    flushCustomStyles() {
      applyShimInterface.flushCustomStyles();
    },

    nativeCss: nativeCssVariables,
    nativeShadow: nativeShadow
  };

  if (CustomStyleInterface$$1) {
    window.ShadyCSS.CustomStyleInterface = CustomStyleInterface$$1;
  }
}

window.ShadyCSS.ApplyShim = applyShim$1; /**
                                         @license
                                         Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
                                         This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
                                         The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
                                         The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
                                         Code distributed by Google as part of the polymer project is also
                                         subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
                                         */

window.JSCompiler_renameProperty = function (prop) {
  return prop;
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */

let CSS_URL_RX = /(url\()([^)]*)(\))/g;
let ABS_URL = /(^\/)|(^#)|(^[\w-\d]*:)/;
let workingURL;
let resolveDoc; /**
                 * Resolves the given URL against the provided `baseUri'.
                 *
                 * Note that this function performs no resolution for URLs that start
                 * with `/` (absolute URLs) or `#` (hash identifiers).  For general purpose
                 * URL resolution, use `window.URL`.
                 *
                 * @param {string} url Input URL to resolve
                 * @param {?string=} baseURI Base URI to resolve the URL against
                 * @return {string} resolved URL
                 */

function resolveUrl(url, baseURI) {
  if (url && ABS_URL.test(url)) {
    return url;
  } // Lazy feature detection.


  if (workingURL === undefined) {
    workingURL = false;

    try {
      const u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      workingURL = u.href === 'http://a/c%20d';
    } catch (e) {// silently fail
    }
  }

  if (!baseURI) {
    baseURI = document.baseURI || window.location.href;
  }

  if (workingURL) {
    return new URL(url, baseURI).href;
  } // Fallback to creating an anchor into a disconnected document.


  if (!resolveDoc) {
    resolveDoc = document.implementation.createHTMLDocument('temp');
    resolveDoc.base = resolveDoc.createElement('base');
    resolveDoc.head.appendChild(resolveDoc.base);
    resolveDoc.anchor = resolveDoc.createElement('a');
    resolveDoc.body.appendChild(resolveDoc.anchor);
  }

  resolveDoc.base.href = baseURI;
  resolveDoc.anchor.href = url;
  return resolveDoc.anchor.href || url;
} /**
   * Resolves any relative URL's in the given CSS text against the provided
   * `ownerDocument`'s `baseURI`.
   *
   * @param {string} cssText CSS text to process
   * @param {string} baseURI Base URI to resolve the URL against
   * @return {string} Processed CSS text with resolved URL's
   */

function resolveCss(cssText, baseURI) {
  return cssText.replace(CSS_URL_RX, function (m, pre, url, post) {
    return pre + '\'' + resolveUrl(url.replace(/["']/g, ''), baseURI) + '\'' + post;
  });
} /**
   * Returns a path from a given `url`. The path includes the trailing
   * `/` from the url.
   *
   * @param {string} url Input URL to transform
   * @return {string} resolved path
   */

function pathFromUrl(url) {
  return url.substring(0, url.lastIndexOf('/') + 1);
}

var resolveUrl$1 = {
  resolveUrl: resolveUrl,
  resolveCss: resolveCss,
  pathFromUrl: pathFromUrl
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const useShadow = !window.ShadyDOM;
const useNativeCSSProperties = Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
const useNativeCustomElements = !window.customElements.polyfillWrapFlushCallback; /**
                                                                                   * Globally settable property that is automatically assigned to
                                                                                   * `ElementMixin` instances, useful for binding in templates to
                                                                                   * make URL's relative to an application's root.  Defaults to the main
                                                                                   * document URL, but can be overridden by users.  It may be useful to set
                                                                                   * `rootPath` to provide a stable application mount path when
                                                                                   * using client side routing.
                                                                                   */
let rootPath = undefined || pathFromUrl(document.baseURI || window.location.href); /**
                                                                                    * Sets the global rootPath property used by `ElementMixin` and
                                                                                    * available via `rootPath`.
                                                                                    *
                                                                                    * @param {string} path The new root path
                                                                                    * @return {void}
                                                                                    */

const setRootPath = function (path) {
  rootPath = path;
}; /**
    * A global callback used to sanitize any value before inserting it into the DOM. The callback signature is:
    *
    *     Polymer = {
    *       sanitizeDOMValue: function(value, name, type, node) { ... }
    *     }
    *
    * Where:
    *
    * `value` is the value to sanitize.
    * `name` is the name of an attribute or property (for example, href).
    * `type` indicates where the value is being inserted: one of property, attribute, or text.
    * `node` is the node where the value is being inserted.
    *
    * @type {(function(*,string,string,Node):*)|undefined}
    */

let sanitizeDOMValue = undefined; /**
                                   * Sets the global sanitizeDOMValue available via this module's exported
                                   * `sanitizeDOMValue` variable.
                                   *
                                   * @param {(function(*,string,string,Node):*)|undefined} newSanitizeDOMValue the global sanitizeDOMValue callback
                                   * @return {void}
                                   */

const setSanitizeDOMValue = function (newSanitizeDOMValue) {
  sanitizeDOMValue = newSanitizeDOMValue;
}; /**
    * Globally settable property to make Polymer Gestures use passive TouchEvent listeners when recognizing gestures.
    * When set to `true`, gestures made from touch will not be able to prevent scrolling, allowing for smoother
    * scrolling performance.
    * Defaults to `false` for backwards compatibility.
    */

let passiveTouchGestures = false; /**
                                   * Sets `passiveTouchGestures` globally for all elements using Polymer Gestures.
                                   *
                                   * @param {boolean} usePassive enable or disable passive touch gestures globally
                                   * @return {void}
                                   */

const setPassiveTouchGestures = function (usePassive) {
  passiveTouchGestures = usePassive;
};

var settings = {
  useShadow: useShadow,
  useNativeCSSProperties: useNativeCSSProperties,
  useNativeCustomElements: useNativeCustomElements,

  get rootPath() {
    return rootPath;
  },

  setRootPath: setRootPath,

  get sanitizeDOMValue() {
    return sanitizeDOMValue;
  },

  setSanitizeDOMValue: setSanitizeDOMValue,

  get passiveTouchGestures() {
    return passiveTouchGestures;
  },

  setPassiveTouchGestures: setPassiveTouchGestures
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // unique global id for deduping mixins.

let dedupeId = 0; /**
                   * @constructor
                   * @extends {Function}
                   * @private
                   */

function MixinFunction() {} /** @type {(WeakMap | undefined)} */

MixinFunction.prototype.__mixinApplications; /** @type {(Object | undefined)} */
MixinFunction.prototype.__mixinSet; /* eslint-disable valid-jsdoc */ /**
                                                                      * Wraps an ES6 class expression mixin such that the mixin is only applied
                                                                      * if it has not already been applied its base argument. Also memoizes mixin
                                                                      * applications.
                                                                      *
                                                                      * @template T
                                                                      * @param {T} mixin ES6 class expression mixin to wrap
                                                                      * @return {T}
                                                                      * @suppress {invalidCasts}
                                                                      */

const dedupingMixin = function (mixin) {
  let mixinApplications = /** @type {!MixinFunction} */mixin.__mixinApplications;

  if (!mixinApplications) {
    mixinApplications = new WeakMap(); /** @type {!MixinFunction} */
    mixin.__mixinApplications = mixinApplications;
  } // maintain a unique id for each mixin


  let mixinDedupeId = dedupeId++;

  function dedupingMixin(base) {
    let baseSet = /** @type {!MixinFunction} */base.__mixinSet;

    if (baseSet && baseSet[mixinDedupeId]) {
      return base;
    }

    let map = mixinApplications;
    let extended = map.get(base);

    if (!extended) {
      extended = /** @type {!Function} */mixin(base);
      map.set(base, extended);
    } // copy inherited mixin set from the extended class, or the base class
    // NOTE: we avoid use of Set here because some browser (IE11)
    // cannot extend a base Set via the constructor.


    let mixinSet = Object.create( /** @type {!MixinFunction} */extended.__mixinSet || baseSet || null);
    mixinSet[mixinDedupeId] = true; /** @type {!MixinFunction} */
    extended.__mixinSet = mixinSet;
    return extended;
  }

  return dedupingMixin;
}; /* eslint-enable valid-jsdoc */

var mixin = {
  dedupingMixin: dedupingMixin
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const MODULE_STYLE_LINK_SELECTOR = 'link[rel=import][type~=css]';
const INCLUDE_ATTR = 'include';
const SHADY_UNSCOPED_ATTR = 'shady-unscoped';

function importModule(moduleId) {
  const /** DomModule */PolymerDomModule = customElements.get('dom-module');

  if (!PolymerDomModule) {
    return null;
  }

  return PolymerDomModule.import(moduleId);
}

function styleForImport(importDoc) {
  // NOTE: polyfill affordance.
  // under the HTMLImports polyfill, there will be no 'body',
  // but the import pseudo-doc can be used directly.
  let container = importDoc.body ? importDoc.body : importDoc;
  const importCss = resolveCss(container.textContent, importDoc.baseURI);
  const style = document.createElement('style');
  style.textContent = importCss;
  return style;
} /** @typedef {{assetpath: string}} */

let templateWithAssetPath; // eslint-disable-line no-unused-vars
/**
 * Module with utilities for collection CSS text from `<templates>`, external
 * stylesheets, and `dom-module`s.
 *
 * @summary Module with utilities for collection CSS text from various sources.
 */
`TODO(modulizer): A namespace named Polymer.StyleGather was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`; /**
                                       * Returns a list of <style> elements in a space-separated list of `dom-module`s.
                                       *
                                       * @function
                                       * @param {string} moduleIds List of dom-module id's within which to
                                       * search for css.
                                       * @return {!Array<!HTMLStyleElement>} Array of contained <style> elements
                                       * @this {StyleGather}
                                       */

function stylesFromModules(moduleIds) {
  const modules = moduleIds.trim().split(/\s+/);
  const styles = [];

  for (let i = 0; i < modules.length; i++) {
    styles.push(...stylesFromModule(modules[i]));
  }

  return styles;
} /**
   * Returns a list of <style> elements in a given `dom-module`.
   * Styles in a `dom-module` can come either from `<style>`s within the
   * first `<template>`, or else from one or more
   * `<link rel="import" type="css">` links outside the template.
   *
   * @param {string} moduleId dom-module id to gather styles from
   * @return {!Array<!HTMLStyleElement>} Array of contained styles.
   * @this {StyleGather}
   */

function stylesFromModule(moduleId) {
  const m = importModule(moduleId);

  if (!m) {
    console.warn('Could not find style data in module named', moduleId);
    return [];
  }

  if (m._styles === undefined) {
    const styles = []; // module imports: <link rel="import" type="css">

    styles.push(..._stylesFromModuleImports(m)); // include css from the first template in the module

    const template = m.querySelector('template');

    if (template) {
      styles.push(...stylesFromTemplate(template, /** @type {templateWithAssetPath} */m.assetpath));
    }

    m._styles = styles;
  }

  return m._styles;
} /**
   * Returns the `<style>` elements within a given template.
   *
   * @param {!HTMLTemplateElement} template Template to gather styles from
   * @param {string} baseURI baseURI for style content
   * @return {!Array<!HTMLStyleElement>} Array of styles
   * @this {StyleGather}
   */

function stylesFromTemplate(template, baseURI) {
  if (!template._styles) {
    const styles = []; // if element is a template, get content from its .content

    const e$ = template.content.querySelectorAll('style');

    for (let i = 0; i < e$.length; i++) {
      let e = e$[i]; // support style sharing by allowing styles to "include"
      // other dom-modules that contain styling

      let include = e.getAttribute(INCLUDE_ATTR);

      if (include) {
        styles.push(...stylesFromModules(include).filter(function (item, index, self) {
          return self.indexOf(item) === index;
        }));
      }

      if (baseURI) {
        e.textContent = resolveCss(e.textContent, baseURI);
      }

      styles.push(e);
    }

    template._styles = styles;
  }

  return template._styles;
} /**
   * Returns a list of <style> elements  from stylesheets loaded via `<link rel="import" type="css">` links within the specified `dom-module`.
   *
   * @param {string} moduleId Id of `dom-module` to gather CSS from
   * @return {!Array<!HTMLStyleElement>} Array of contained styles.
   * @this {StyleGather}
   */

function stylesFromModuleImports(moduleId) {
  let m = importModule(moduleId);
  return m ? _stylesFromModuleImports(m) : [];
} /**
   * @this {StyleGather}
   * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
   * @return {!Array<!HTMLStyleElement>} Array of contained styles
   */

function _stylesFromModuleImports(module) {
  const styles = [];
  const p$ = module.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);

  for (let i = 0; i < p$.length; i++) {
    let p = p$[i];

    if (p.import) {
      const importDoc = p.import;
      const unscoped = p.hasAttribute(SHADY_UNSCOPED_ATTR);

      if (unscoped && !importDoc._unscopedStyle) {
        const style = styleForImport(importDoc);
        style.setAttribute(SHADY_UNSCOPED_ATTR, '');
        importDoc._unscopedStyle = style;
      } else if (!importDoc._style) {
        importDoc._style = styleForImport(importDoc);
      }

      styles.push(unscoped ? importDoc._unscopedStyle : importDoc._style);
    }
  }

  return styles;
} /**
   *
   * Returns CSS text of styles in a space-separated list of `dom-module`s.
   * Note: This method is deprecated, use `stylesFromModules` instead.
   *
   * @deprecated
   * @param {string} moduleIds List of dom-module id's within which to
   * search for css.
   * @return {string} Concatenated CSS content from specified `dom-module`s
   * @this {StyleGather}
   */

function cssFromModules(moduleIds) {
  let modules = moduleIds.trim().split(/\s+/);
  let cssText = '';

  for (let i = 0; i < modules.length; i++) {
    cssText += cssFromModule(modules[i]);
  }

  return cssText;
} /**
   * Returns CSS text of styles in a given `dom-module`.  CSS in a `dom-module`
   * can come either from `<style>`s within the first `<template>`, or else
   * from one or more `<link rel="import" type="css">` links outside the
   * template.
   *
   * Any `<styles>` processed are removed from their original location.
   * Note: This method is deprecated, use `styleFromModule` instead.
   *
   * @deprecated
   * @param {string} moduleId dom-module id to gather styles from
   * @return {string} Concatenated CSS content from specified `dom-module`
   * @this {StyleGather}
   */

function cssFromModule(moduleId) {
  let m = importModule(moduleId);

  if (m && m._cssText === undefined) {
    // module imports: <link rel="import" type="css">
    let cssText = _cssFromModuleImports(m); // include css from the first template in the module


    let t = m.querySelector('template');

    if (t) {
      cssText += cssFromTemplate(t, /** @type {templateWithAssetPath} */m.assetpath);
    }

    m._cssText = cssText || null;
  }

  if (!m) {
    console.warn('Could not find style data in module named', moduleId);
  }

  return m && m._cssText || '';
} /**
   * Returns CSS text of `<styles>` within a given template.
   *
   * Any `<styles>` processed are removed from their original location.
   * Note: This method is deprecated, use `styleFromTemplate` instead.
   *
   * @deprecated
   * @param {!HTMLTemplateElement} template Template to gather styles from
   * @param {string} baseURI Base URI to resolve the URL against
   * @return {string} Concatenated CSS content from specified template
   * @this {StyleGather}
   */

function cssFromTemplate(template, baseURI) {
  let cssText = '';
  const e$ = stylesFromTemplate(template, baseURI); // if element is a template, get content from its .content

  for (let i = 0; i < e$.length; i++) {
    let e = e$[i];

    if (e.parentNode) {
      e.parentNode.removeChild(e);
    }

    cssText += e.textContent;
  }

  return cssText;
} /**
   * Returns CSS text from stylesheets loaded via `<link rel="import" type="css">`
   * links within the specified `dom-module`.
   *
   * Note: This method is deprecated, use `stylesFromModuleImports` instead.
   *
   * @deprecated
   *
   * @param {string} moduleId Id of `dom-module` to gather CSS from
   * @return {string} Concatenated CSS content from links in specified `dom-module`
   * @this {StyleGather}
   */

function cssFromModuleImports(moduleId) {
  let m = importModule(moduleId);
  return m ? _cssFromModuleImports(m) : '';
} /**
   * @deprecated
   * @this {StyleGather}
   * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
   * @return {string} Concatenated CSS content from links in the dom-module
   */

function _cssFromModuleImports(module) {
  let cssText = '';

  let styles = _stylesFromModuleImports(module);

  for (let i = 0; i < styles.length; i++) {
    cssText += styles[i].textContent;
  }

  return cssText;
}

var styleGather = {
  stylesFromModules: stylesFromModules,
  stylesFromModule: stylesFromModule,
  stylesFromTemplate: stylesFromTemplate,
  stylesFromModuleImports: stylesFromModuleImports,
  cssFromModules: cssFromModules,
  cssFromModule: cssFromModule,
  cssFromTemplate: cssFromTemplate,
  cssFromModuleImports: cssFromModuleImports
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
let modules = {};
let lcModules = {};

function findModule(id) {
  return modules[id] || lcModules[id.toLowerCase()];
}

function styleOutsideTemplateCheck(inst) {
  if (inst.querySelector('style')) {
    console.warn('dom-module %s has style outside template', inst.id);
  }
} /**
   * The `dom-module` element registers the dom it contains to the name given
   * by the module's id attribute. It provides a unified database of dom
   * accessible via its static `import` API.
   *
   * A key use case of `dom-module` is for providing custom element `<template>`s
   * via HTML imports that are parsed by the native HTML parser, that can be
   * relocated during a bundling pass and still looked up by `id`.
   *
   * Example:
   *
   *     <dom-module id="foo">
   *       <img src="stuff.png">
   *     </dom-module>
   *
   * Then in code in some other location that cannot access the dom-module above
   *
   *     let img = customElements.get('dom-module').import('foo', 'img');
   *
   * @customElement
   * @extends HTMLElement
   * @summary Custom element that provides a registry of relocatable DOM content
   *   by `id` that is agnostic to bundling.
   * @unrestricted
   */

class DomModule extends HTMLElement {
  static get observedAttributes() {
    return ['id'];
  } /**
     * Retrieves the element specified by the css `selector` in the module
     * registered by `id`. For example, this.import('foo', 'img');
     * @param {string} id The id of the dom-module in which to search.
     * @param {string=} selector The css selector by which to find the element.
     * @return {Element} Returns the element which matches `selector` in the
     * module registered at the specified `id`.
     */

  static import(id, selector) {
    if (id) {
      let m = findModule(id);

      if (m && selector) {
        return m.querySelector(selector);
      }

      return m;
    }

    return null;
  } /* eslint-disable no-unused-vars */ /**
                                         * @param {string} name Name of attribute.
                                         * @param {?string} old Old value of attribute.
                                         * @param {?string} value Current value of attribute.
                                         * @param {?string} namespace Attribute namespace.
                                         * @return {void}
                                         * @override
                                         */

  attributeChangedCallback(name, old, value, namespace) {
    if (old !== value) {
      this.register();
    }
  } /* eslint-enable no-unused-args */ /**
                                        * The absolute URL of the original location of this `dom-module`.
                                        *
                                        * This value will differ from this element's `ownerDocument` in the
                                        * following ways:
                                        * - Takes into account any `assetpath` attribute added during bundling
                                        *   to indicate the original location relative to the bundled location
                                        * - Uses the HTMLImports polyfill's `importForElement` API to ensure
                                        *   the path is relative to the import document's location since
                                        *   `ownerDocument` is not currently polyfilled
                                        */

  get assetpath() {
    // Don't override existing assetpath.
    if (!this.__assetpath) {
      // note: assetpath set via an attribute must be relative to this
      // element's location; accomodate polyfilled HTMLImports
      const owner = window.HTMLImports && HTMLImports.importForElement ? HTMLImports.importForElement(this) || document : this.ownerDocument;
      const url = resolveUrl(this.getAttribute('assetpath') || '', owner.baseURI);
      this.__assetpath = pathFromUrl(url);
    }

    return this.__assetpath;
  } /**
     * Registers the dom-module at a given id. This method should only be called
     * when a dom-module is imperatively created. For
     * example, `document.createElement('dom-module').register('foo')`.
     * @param {string=} id The id at which to register the dom-module.
     * @return {void}
     */

  register(id) {
    id = id || this.id;

    if (id) {
      this.id = id; // store id separate from lowercased id so that
      // in all cases mixedCase id will stored distinctly
      // and lowercase version is a fallback

      modules[id] = this;
      lcModules[id.toLowerCase()] = this;
      styleOutsideTemplateCheck(this);
    }
  }

}

DomModule.prototype['modules'] = modules;
customElements.define('dom-module', DomModule);
var domModule = {
  DomModule: DomModule
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Module with utilities for manipulating structured data path strings.
       *
       * @summary Module with utilities for manipulating structured data path strings.
       */
`TODO(modulizer): A namespace named Polymer.Path was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`; /**
                                       * Returns true if the given string is a structured data path (has dots).
                                       *
                                       * Example:
                                       *
                                       * ```
                                       * isPath('foo.bar.baz') // true
                                       * isPath('foo')         // false
                                       * ```
                                       *
                                       * @param {string} path Path string
                                       * @return {boolean} True if the string contained one or more dots
                                       */

function isPath(path) {
  return path.indexOf('.') >= 0;
} /**
   * Returns the root property name for the given path.
   *
   * Example:
   *
   * ```
   * root('foo.bar.baz') // 'foo'
   * root('foo')         // 'foo'
   * ```
   *
   * @param {string} path Path string
   * @return {string} Root property name
   */

function root(path) {
  let dotIndex = path.indexOf('.');

  if (dotIndex === -1) {
    return path;
  }

  return path.slice(0, dotIndex);
} /**
   * Given `base` is `foo.bar`, `foo` is an ancestor, `foo.bar` is not
   * Returns true if the given path is an ancestor of the base path.
   *
   * Example:
   *
   * ```
   * isAncestor('foo.bar', 'foo')         // true
   * isAncestor('foo.bar', 'foo.bar')     // false
   * isAncestor('foo.bar', 'foo.bar.baz') // false
   * ```
   *
   * @param {string} base Path string to test against.
   * @param {string} path Path string to test.
   * @return {boolean} True if `path` is an ancestor of `base`.
   */

function isAncestor(base, path) {
  //     base.startsWith(path + '.');
  return base.indexOf(path + '.') === 0;
} /**
   * Given `base` is `foo.bar`, `foo.bar.baz` is an descendant
   *
   * Example:
   *
   * ```
   * isDescendant('foo.bar', 'foo.bar.baz') // true
   * isDescendant('foo.bar', 'foo.bar')     // false
   * isDescendant('foo.bar', 'foo')         // false
   * ```
   *
   * @param {string} base Path string to test against.
   * @param {string} path Path string to test.
   * @return {boolean} True if `path` is a descendant of `base`.
   */

function isDescendant(base, path) {
  //     path.startsWith(base + '.');
  return path.indexOf(base + '.') === 0;
} /**
   * Replaces a previous base path with a new base path, preserving the
   * remainder of the path.
   *
   * User must ensure `path` has a prefix of `base`.
   *
   * Example:
   *
   * ```
   * translate('foo.bar', 'zot', 'foo.bar.baz') // 'zot.baz'
   * ```
   *
   * @param {string} base Current base string to remove
   * @param {string} newBase New base string to replace with
   * @param {string} path Path to translate
   * @return {string} Translated string
   */

function translate(base, newBase, path) {
  return newBase + path.slice(base.length);
} /**
   * @param {string} base Path string to test against
   * @param {string} path Path string to test
   * @return {boolean} True if `path` is equal to `base`
   * @this {Path}
   */

function matches(base, path) {
  return base === path || isAncestor(base, path) || isDescendant(base, path);
} /**
   * Converts array-based paths to flattened path.  String-based paths
   * are returned as-is.
   *
   * Example:
   *
   * ```
   * normalize(['foo.bar', 0, 'baz'])  // 'foo.bar.0.baz'
   * normalize('foo.bar.0.baz')        // 'foo.bar.0.baz'
   * ```
   *
   * @param {string | !Array<string|number>} path Input path
   * @return {string} Flattened path
   */

function normalize(path) {
  if (Array.isArray(path)) {
    let parts = [];

    for (let i = 0; i < path.length; i++) {
      let args = path[i].toString().split('.');

      for (let j = 0; j < args.length; j++) {
        parts.push(args[j]);
      }
    }

    return parts.join('.');
  } else {
    return path;
  }
} /**
   * Splits a path into an array of property names. Accepts either arrays
   * of path parts or strings.
   *
   * Example:
   *
   * ```
   * split(['foo.bar', 0, 'baz'])  // ['foo', 'bar', '0', 'baz']
   * split('foo.bar.0.baz')        // ['foo', 'bar', '0', 'baz']
   * ```
   *
   * @param {string | !Array<string|number>} path Input path
   * @return {!Array<string>} Array of path parts
   * @this {Path}
   * @suppress {checkTypes}
   */

function split(path) {
  if (Array.isArray(path)) {
    return normalize(path).split('.');
  }

  return path.toString().split('.');
} /**
   * Reads a value from a path.  If any sub-property in the path is `undefined`,
   * this method returns `undefined` (will never throw.
   *
   * @param {Object} root Object from which to dereference path from
   * @param {string | !Array<string|number>} path Path to read
   * @param {Object=} info If an object is provided to `info`, the normalized
   *  (flattened) path will be set to `info.path`.
   * @return {*} Value at path, or `undefined` if the path could not be
   *  fully dereferenced.
   * @this {Path}
   */

function get(root, path, info) {
  let prop = root;
  let parts = split(path); // Loop over path parts[0..n-1] and dereference

  for (let i = 0; i < parts.length; i++) {
    if (!prop) {
      return;
    }

    let part = parts[i];
    prop = prop[part];
  }

  if (info) {
    info.path = parts.join('.');
  }

  return prop;
} /**
   * Sets a value to a path.  If any sub-property in the path is `undefined`,
   * this method will no-op.
   *
   * @param {Object} root Object from which to dereference path from
   * @param {string | !Array<string|number>} path Path to set
   * @param {*} value Value to set to path
   * @return {string | undefined} The normalized version of the input path
   * @this {Path}
   */

function set(root, path, value) {
  let prop = root;
  let parts = split(path);
  let last = parts[parts.length - 1];

  if (parts.length > 1) {
    // Loop over path parts[0..n-2] and dereference
    for (let i = 0; i < parts.length - 1; i++) {
      let part = parts[i];
      prop = prop[part];

      if (!prop) {
        return;
      }
    } // Set value to object at end of path


    prop[last] = value;
  } else {
    // Simple property set
    prop[path] = value;
  }

  return parts.join('.');
} /**
   * Returns true if the given string is a structured data path (has dots).
   *
   * This function is deprecated.  Use `isPath` instead.
   *
   * Example:
   *
   * ```
   * isDeep('foo.bar.baz') // true
   * isDeep('foo')         // false
   * ```
   *
   * @deprecated
   * @param {string} path Path string
   * @return {boolean} True if the string contained one or more dots
   */

const isDeep = isPath;
var path = {
  isPath: isPath,
  root: root,
  isAncestor: isAncestor,
  isDescendant: isDescendant,
  translate: translate,
  matches: matches,
  normalize: normalize,
  split: split,
  get: get,
  set: set,
  isDeep: isDeep
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const caseMap = {};
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g; /**
                                   * @fileoverview Module with utilities for converting between "dash-case" and
                                   * "camelCase" identifiers.
                                   */ /**
                                       * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
                                       * (e.g. `fooBarBaz`).
                                       *
                                       * @param {string} dash Dash-case identifier
                                       * @return {string} Camel-case representation of the identifier
                                       */

function dashToCamelCase(dash) {
  return caseMap[dash] || (caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL, m => m[1].toUpperCase()));
} /**
   * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
   * (e.g. `foo-bar-baz`).
   *
   * @param {string} camel Camel-case identifier
   * @return {string} Dash-case representation of the identifier
   */

function camelToDashCase(camel) {
  return caseMap[camel] || (caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase());
}

var caseMap$1 = {
  dashToCamelCase: dashToCamelCase,
  camelToDashCase: camelToDashCase
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // Microtask implemented using Mutation Observer

let microtaskCurrHandle = 0;
let microtaskLastHandle = 0;
let microtaskCallbacks = [];
let microtaskNodeContent = 0;
let microtaskNode = document.createTextNode('');
new window.MutationObserver(microtaskFlush).observe(microtaskNode, {
  characterData: true
});

function microtaskFlush() {
  const len = microtaskCallbacks.length;

  for (let i = 0; i < len; i++) {
    let cb = microtaskCallbacks[i];

    if (cb) {
      try {
        cb();
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
    }
  }

  microtaskCallbacks.splice(0, len);
  microtaskLastHandle += len;
} /**
   * Async interface wrapper around `setTimeout`.
   *
   * @namespace
   * @summary Async interface wrapper around `setTimeout`.
   */

const timeOut = {
  /**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @memberof timeOut
   * @param {number=} delay Time to wait before calling callbacks in ms
   * @return {!AsyncInterface} An async timeout interface
   */after(delay) {
    return {
      run(fn) {
        return window.setTimeout(fn, delay);
      },

      cancel(handle) {
        window.clearTimeout(handle);
      }

    };
  },

  /**
   * Enqueues a function called in the next task.
   *
   * @memberof timeOut
   * @param {!Function} fn Callback to run
   * @param {number=} delay Delay in milliseconds
   * @return {number} Handle used for canceling task
   */run(fn, delay) {
    return window.setTimeout(fn, delay);
  },

  /**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @memberof timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */cancel(handle) {
    window.clearTimeout(handle);
  }

}; /**
    * Async interface wrapper around `requestAnimationFrame`.
    *
    * @namespace
    * @summary Async interface wrapper around `requestAnimationFrame`.
    */
const animationFrame = {
  /**
   * Enqueues a function called at `requestAnimationFrame` timing.
   *
   * @memberof animationFrame
   * @param {function(number):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */run(fn) {
    return window.requestAnimationFrame(fn);
  },

  /**
   * Cancels a previously enqueued `animationFrame` callback.
   *
   * @memberof animationFrame
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */cancel(handle) {
    window.cancelAnimationFrame(handle);
  }

}; /**
    * Async interface wrapper around `requestIdleCallback`.  Falls back to
    * `setTimeout` on browsers that do not support `requestIdleCallback`.
    *
    * @namespace
    * @summary Async interface wrapper around `requestIdleCallback`.
    */
const idlePeriod = {
  /**
   * Enqueues a function called at `requestIdleCallback` timing.
   *
   * @memberof idlePeriod
   * @param {function(!IdleDeadline):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */run(fn) {
    return window.requestIdleCallback ? window.requestIdleCallback(fn) : window.setTimeout(fn, 16);
  },

  /**
   * Cancels a previously enqueued `idlePeriod` callback.
   *
   * @memberof idlePeriod
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */cancel(handle) {
    window.cancelIdleCallback ? window.cancelIdleCallback(handle) : window.clearTimeout(handle);
  }

}; /**
    * Async interface for enqueuing callbacks that run at microtask timing.
    *
    * Note that microtask timing is achieved via a single `MutationObserver`,
    * and thus callbacks enqueued with this API will all run in a single
    * batch, and not interleaved with other microtasks such as promises.
    * Promises are avoided as an implementation choice for the time being
    * due to Safari bugs that cause Promises to lack microtask guarantees.
    *
    * @namespace
    * @summary Async interface for enqueuing callbacks that run at microtask
    *   timing.
    */
const microTask = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */run(callback) {
    microtaskNode.textContent = microtaskNodeContent++;
    microtaskCallbacks.push(callback);
    return microtaskCurrHandle++;
  },

  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */cancel(handle) {
    const idx = handle - microtaskLastHandle;

    if (idx >= 0) {
      if (!microtaskCallbacks[idx]) {
        throw new Error('invalid async handle: ' + handle);
      }

      microtaskCallbacks[idx] = null;
    }
  }

};
var async = {
  timeOut: timeOut,
  animationFrame: animationFrame,
  idlePeriod: idlePeriod,
  microTask: microTask
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /** @const {!AsyncInterface} */
const microtask = microTask; /**
                              * Element class mixin that provides basic meta-programming for creating one
                              * or more property accessors (getter/setter pair) that enqueue an async
                              * (batched) `_propertiesChanged` callback.
                              *
                              * For basic usage of this mixin, call `MyClass.createProperties(props)`
                              * once at class definition time to create property accessors for properties
                              * named in props, implement `_propertiesChanged` to react as desired to
                              * property changes, and implement `static get observedAttributes()` and
                              * include lowercase versions of any property names that should be set from
                              * attributes. Last, call `this._enableProperties()` in the element's
                              * `connectedCallback` to enable the accessors.
                              *
                              * @mixinFunction
                              * @polymer
                              * @summary Element class mixin for reacting to property changes from
                              *   generated property accessors.
                              */
const PropertiesChanged = dedupingMixin( /**
                                          * @template T
                                          * @param {function(new:T)} superClass Class to apply mixin to.
                                          * @return {function(new:T)} superClass with mixin applied.
                                          */superClass => {
  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_PropertiesChanged}
   * @unrestricted
   */class PropertiesChanged extends superClass {
    /**
     * Creates property accessors for the given property names.
     * @param {!Object} props Object whose keys are names of accessors.
     * @return {void}
     * @protected
     */static createProperties(props) {
      const proto = this.prototype;

      for (let prop in props) {
        // don't stomp an existing accessor
        if (!(prop in proto)) {
          proto._createPropertyAccessor(prop);
        }
      }
    } /**
       * Returns an attribute name that corresponds to the given property.
       * The attribute name is the lowercased property name. Override to
       * customize this mapping.
       * @param {string} property Property to convert
       * @return {string} Attribute name corresponding to the given property.
       *
       * @protected
       */

    static attributeNameForProperty(property) {
      return property.toLowerCase();
    } /**
       * Override point to provide a type to which to deserialize a value to
       * a given property.
       * @param {string} name Name of property
       *
       * @protected
       */

    static typeForProperty(name) {} //eslint-disable-line no-unused-vars
    /**
     * Creates a setter/getter pair for the named property with its own
     * local storage.  The getter returns the value in the local storage,
     * and the setter calls `_setProperty`, which updates the local storage
     * for the property and enqueues a `_propertiesChanged` callback.
     *
     * This method may be called on a prototype or an instance.  Calling
     * this method may overwrite a property value that already exists on
     * the prototype/instance by creating the accessor.
     *
     * @param {string} property Name of the property
     * @param {boolean=} readOnly When true, no setter is created; the
     *   protected `_setProperty` function must be used to set the property
     * @return {void}
     * @protected
     * @override
     */

    _createPropertyAccessor(property, readOnly) {
      this._addPropertyToAttributeMap(property);

      if (!this.hasOwnProperty('__dataHasAccessor')) {
        this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor);
      }

      if (!this.__dataHasAccessor[property]) {
        this.__dataHasAccessor[property] = true;

        this._definePropertyAccessor(property, readOnly);
      }
    } /**
       * Adds the given `property` to a map matching attribute names
       * to property names, using `attributeNameForProperty`. This map is
       * used when deserializing attribute values to properties.
       *
       * @param {string} property Name of the property
       * @override
       */

    _addPropertyToAttributeMap(property) {
      if (!this.hasOwnProperty('__dataAttributes')) {
        this.__dataAttributes = Object.assign({}, this.__dataAttributes);
      }

      if (!this.__dataAttributes[property]) {
        const attr = this.constructor.attributeNameForProperty(property);
        this.__dataAttributes[attr] = property;
      }
    } /**
       * Defines a property accessor for the given property.
       * @param {string} property Name of the property
       * @param {boolean=} readOnly When true, no setter is created
       * @return {void}
       * @override
       */

    _definePropertyAccessor(property, readOnly) {
      Object.defineProperty(this, property, {
        /* eslint-disable valid-jsdoc */ /** @this {PropertiesChanged} */get() {
          return this._getProperty(property);
        },

        /** @this {PropertiesChanged} */set: readOnly ? function () {} : function (value) {
          this._setProperty(property, value);
        } /* eslint-enable */
      });
    }

    constructor() {
      super();
      this.__dataEnabled = false;
      this.__dataReady = false;
      this.__dataInvalid = false;
      this.__data = {};
      this.__dataPending = null;
      this.__dataOld = null;
      this.__dataInstanceProps = null;
      this.__serializing = false;

      this._initializeProperties();
    } /**
       * Lifecycle callback called when properties are enabled via
       * `_enableProperties`.
       *
       * Users may override this function to implement behavior that is
       * dependent on the element having its property data initialized, e.g.
       * from defaults (initialized from `constructor`, `_initializeProperties`),
       * `attributeChangedCallback`, or values propagated from host e.g. via
       * bindings.  `super.ready()` must be called to ensure the data system
       * becomes enabled.
       *
       * @return {void}
       * @public
       * @override
       */

    ready() {
      this.__dataReady = true;

      this._flushProperties();
    } /**
       * Initializes the local storage for property accessors.
       *
       * Provided as an override point for performing any setup work prior
       * to initializing the property accessor system.
       *
       * @return {void}
       * @protected
       * @override
       */

    _initializeProperties() {
      // Capture instance properties; these will be set into accessors
      // during first flush. Don't set them here, since we want
      // these to overwrite defaults/constructor assignments
      for (let p in this.__dataHasAccessor) {
        if (this.hasOwnProperty(p)) {
          this.__dataInstanceProps = this.__dataInstanceProps || {};
          this.__dataInstanceProps[p] = this[p];
          delete this[p];
        }
      }
    } /**
       * Called at ready time with bag of instance properties that overwrote
       * accessors when the element upgraded.
       *
       * The default implementation sets these properties back into the
       * setter at ready time.  This method is provided as an override
       * point for customizing or providing more efficient initialization.
       *
       * @param {Object} props Bag of property values that were overwritten
       *   when creating property accessors.
       * @return {void}
       * @protected
       * @override
       */

    _initializeInstanceProperties(props) {
      Object.assign(this, props);
    } /**
       * Updates the local storage for a property (via `_setPendingProperty`)
       * and enqueues a `_proeprtiesChanged` callback.
       *
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @return {void}
       * @protected
       * @override
       */

    _setProperty(property, value) {
      if (this._setPendingProperty(property, value)) {
        this._invalidateProperties();
      }
    } /**
       * Returns the value for the given property.
       * @param {string} property Name of property
       * @return {*} Value for the given property
       * @protected
       * @override
       */

    _getProperty(property) {
      return this.__data[property];
    } /* eslint-disable no-unused-vars */ /**
                                           * Updates the local storage for a property, records the previous value,
                                           * and adds it to the set of "pending changes" that will be passed to the
                                           * `_propertiesChanged` callback.  This method does not enqueue the
                                           * `_propertiesChanged` callback.
                                           *
                                           * @param {string} property Name of the property
                                           * @param {*} value Value to set
                                           * @param {boolean=} ext Not used here; affordance for closure
                                           * @return {boolean} Returns true if the property changed
                                           * @protected
                                           * @override
                                           */

    _setPendingProperty(property, value, ext) {
      let old = this.__data[property];

      let changed = this._shouldPropertyChange(property, value, old);

      if (changed) {
        if (!this.__dataPending) {
          this.__dataPending = {};
          this.__dataOld = {};
        } // Ensure old is captured from the last turn


        if (this.__dataOld && !(property in this.__dataOld)) {
          this.__dataOld[property] = old;
        }

        this.__data[property] = value;
        this.__dataPending[property] = value;
      }

      return changed;
    } /* eslint-enable */ /**
                           * Marks the properties as invalid, and enqueues an async
                           * `_propertiesChanged` callback.
                           *
                           * @return {void}
                           * @protected
                           * @override
                           */

    _invalidateProperties() {
      if (!this.__dataInvalid && this.__dataReady) {
        this.__dataInvalid = true;
        microtask.run(() => {
          if (this.__dataInvalid) {
            this.__dataInvalid = false;

            this._flushProperties();
          }
        });
      }
    } /**
       * Call to enable property accessor processing. Before this method is
       * called accessor values will be set but side effects are
       * queued. When called, any pending side effects occur immediately.
       * For elements, generally `connectedCallback` is a normal spot to do so.
       * It is safe to call this method multiple times as it only turns on
       * property accessors once.
       *
       * @return {void}
       * @protected
       * @override
       */

    _enableProperties() {
      if (!this.__dataEnabled) {
        this.__dataEnabled = true;

        if (this.__dataInstanceProps) {
          this._initializeInstanceProperties(this.__dataInstanceProps);

          this.__dataInstanceProps = null;
        }

        this.ready();
      }
    } /**
       * Calls the `_propertiesChanged` callback with the current set of
       * pending changes (and old values recorded when pending changes were
       * set), and resets the pending set of changes. Generally, this method
       * should not be called in user code.
       *
       * @return {void}
       * @protected
       * @override
       */

    _flushProperties() {
      const props = this.__data;
      const changedProps = this.__dataPending;
      const old = this.__dataOld;

      if (this._shouldPropertiesChange(props, changedProps, old)) {
        this.__dataPending = null;
        this.__dataOld = null;

        this._propertiesChanged(props, changedProps, old);
      }
    } /**
       * Called in `_flushProperties` to determine if `_propertiesChanged`
       * should be called. The default implementation returns true if
       * properties are pending. Override to customize when
       * `_propertiesChanged` is called.
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {?Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {?Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {boolean} true if changedProps is truthy
       * @override
       */

    _shouldPropertiesChange(currentProps, changedProps, oldProps) {
      // eslint-disable-line no-unused-vars
      return Boolean(changedProps);
    } /**
       * Callback called when any properties with accessors created via
       * `_createPropertyAccessor` have been set.
       *
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {?Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {?Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {void}
       * @protected
       * @override
       */

    _propertiesChanged(currentProps, changedProps, oldProps) {} // eslint-disable-line no-unused-vars
    /**
     * Method called to determine whether a property value should be
     * considered as a change and cause the `_propertiesChanged` callback
     * to be enqueued.
     *
     * The default implementation returns `true` if a strict equality
     * check fails. The method always returns false for `NaN`.
     *
     * Override this method to e.g. provide stricter checking for
     * Objects/Arrays when using immutable patterns.
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     *   and enqueue a `_proeprtiesChanged` callback
     * @protected
     * @override
     */

    _shouldPropertyChange(property, value, old) {
      return (// Strict equality check
        old !== value && ( // This ensures (old==NaN, value==NaN) always returns false
        old === old || value === value)
      );
    } /**
       * Implements native Custom Elements `attributeChangedCallback` to
       * set an attribute value to a property via `_attributeToProperty`.
       *
       * @param {string} name Name of attribute that changed
       * @param {?string} old Old attribute value
       * @param {?string} value New attribute value
       * @param {?string} namespace Attribute namespace.
       * @return {void}
       * @suppress {missingProperties} Super may or may not implement the callback
       * @override
       */

    attributeChangedCallback(name, old, value, namespace) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }

      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, old, value, namespace);
      }
    } /**
       * Deserializes an attribute to its associated property.
       *
       * This method calls the `_deserializeValue` method to convert the string to
       * a typed value.
       *
       * @param {string} attribute Name of attribute to deserialize.
       * @param {?string} value of the attribute.
       * @param {*=} type type to deserialize to, defaults to the value
       * returned from `typeForProperty`
       * @return {void}
       * @override
       */

    _attributeToProperty(attribute, value, type) {
      if (!this.__serializing) {
        const map = this.__dataAttributes;
        const property = map && map[attribute] || attribute;
        this[property] = this._deserializeValue(value, type || this.constructor.typeForProperty(property));
      }
    } /**
       * Serializes a property to its associated attribute.
       *
       * @suppress {invalidCasts} Closure can't figure out `this` is an element.
       *
       * @param {string} property Property name to reflect.
       * @param {string=} attribute Attribute name to reflect to.
       * @param {*=} value Property value to refect.
       * @return {void}
       * @override
       */

    _propertyToAttribute(property, attribute, value) {
      this.__serializing = true;
      value = arguments.length < 3 ? this[property] : value;

      this._valueToNodeAttribute( /** @type {!HTMLElement} */this, value, attribute || this.constructor.attributeNameForProperty(property));

      this.__serializing = false;
    } /**
       * Sets a typed value to an HTML attribute on a node.
       *
       * This method calls the `_serializeValue` method to convert the typed
       * value to a string.  If the `_serializeValue` method returns `undefined`,
       * the attribute will be removed (this is the default for boolean
       * type `false`).
       *
       * @param {Element} node Element to set attribute to.
       * @param {*} value Value to serialize.
       * @param {string} attribute Attribute name to serialize to.
       * @return {void}
       * @override
       */

    _valueToNodeAttribute(node, value, attribute) {
      const str = this._serializeValue(value);

      if (str === undefined) {
        node.removeAttribute(attribute);
      } else {
        node.setAttribute(attribute, str);
      }
    } /**
       * Converts a typed JavaScript value to a string.
       *
       * This method is called when setting JS property values to
       * HTML attributes.  Users may override this method to provide
       * serialization for custom types.
       *
       * @param {*} value Property value to serialize.
       * @return {string | undefined} String serialized from the provided
       * property  value.
       * @override
       */

    _serializeValue(value) {
      switch (typeof value) {
        case 'boolean':
          return value ? '' : undefined;

        default:
          return value != null ? value.toString() : undefined;
      }
    } /**
       * Converts a string to a typed JavaScript value.
       *
       * This method is called when reading HTML attribute values to
       * JS properties.  Users may override this method to provide
       * deserialization for custom `type`s. Types for `Boolean`, `String`,
       * and `Number` convert attributes to the expected types.
       *
       * @param {?string} value Value to deserialize.
       * @param {*=} type Type to deserialize the string to.
       * @return {*} Typed value deserialized from the provided string.
       * @override
       */

    _deserializeValue(value, type) {
      switch (type) {
        case Boolean:
          return value !== null;

        case Number:
          return Number(value);

        default:
          return value;
      }
    }

  }

  return PropertiesChanged;
});
var propertiesChanged = {
  PropertiesChanged: PropertiesChanged
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
let caseMap$2 = caseMap$1; // Save map of native properties; this forms a blacklist or properties
// that won't have their values "saved" by `saveAccessorValue`, since
// reading from an HTMLElement accessor from the context of a prototype throws

const nativeProperties = {};
let proto = HTMLElement.prototype;

while (proto) {
  let props = Object.getOwnPropertyNames(proto);

  for (let i = 0; i < props.length; i++) {
    nativeProperties[props[i]] = true;
  }

  proto = Object.getPrototypeOf(proto);
} /**
   * Used to save the value of a property that will be overridden with
   * an accessor. If the `model` is a prototype, the values will be saved
   * in `__dataProto`, and it's up to the user (or downstream mixin) to
   * decide how/when to set these values back into the accessors.
   * If `model` is already an instance (it has a `__data` property), then
   * the value will be set as a pending property, meaning the user should
   * call `_invalidateProperties` or `_flushProperties` to take effect
   *
   * @param {Object} model Prototype or instance
   * @param {string} property Name of property
   * @return {void}
   * @private
   */

function saveAccessorValue(model, property) {
  // Don't read/store value for any native properties since they could throw
  if (!nativeProperties[property]) {
    let value = model[property];

    if (value !== undefined) {
      if (model.__data) {
        // Adding accessor to instance; update the property
        // It is the user's responsibility to call _flushProperties
        model._setPendingProperty(property, value);
      } else {
        // Adding accessor to proto; save proto's value for instance-time use
        if (!model.__dataProto) {
          model.__dataProto = {};
        } else if (!model.hasOwnProperty(JSCompiler_renameProperty('__dataProto', model))) {
          model.__dataProto = Object.create(model.__dataProto);
        }

        model.__dataProto[property] = value;
      }
    }
  }
} /**
   * Element class mixin that provides basic meta-programming for creating one
   * or more property accessors (getter/setter pair) that enqueue an async
   * (batched) `_propertiesChanged` callback.
   *
   * For basic usage of this mixin:
   *
   * -   Declare attributes to observe via the standard `static get observedAttributes()`. Use
   *     `dash-case` attribute names to represent `camelCase` property names.
   * -   Implement the `_propertiesChanged` callback on the class.
   * -   Call `MyClass.createPropertiesForAttributes()` **once** on the class to generate
   *     property accessors for each observed attribute. This must be called before the first
   *     instance is created, for example, by calling it before calling `customElements.define`.
   *     It can also be called lazily from the element's `constructor`, as long as it's guarded so
   *     that the call is only made once, when the first instance is created.
   * -   Call `this._enableProperties()` in the element's `connectedCallback` to enable
   *     the accessors.
   *
   * Any `observedAttributes` will automatically be
   * deserialized via `attributeChangedCallback` and set to the associated
   * property using `dash-case`-to-`camelCase` convention.
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin PropertiesChanged
   * @summary Element class mixin for reacting to property changes from
   *   generated property accessors.
   */

const PropertyAccessors = dedupingMixin(superClass => {
  /**
   * @constructor
   * @extends {superClass}
   * @implements {Polymer_PropertiesChanged}
   * @unrestricted
   * @private
   */const base = PropertiesChanged(superClass); /**
                                                  * @polymer
                                                  * @mixinClass
                                                  * @implements {Polymer_PropertyAccessors}
                                                  * @extends {base}
                                                  * @unrestricted
                                                  */

  class PropertyAccessors extends base {
    /**
     * Generates property accessors for all attributes in the standard
     * static `observedAttributes` array.
     *
     * Attribute names are mapped to property names using the `dash-case` to
     * `camelCase` convention
     *
     * @return {void}
     */static createPropertiesForAttributes() {
      let a$ = this.observedAttributes;

      for (let i = 0; i < a$.length; i++) {
        this.prototype._createPropertyAccessor(caseMap$2.dashToCamelCase(a$[i]));
      }
    } /**
       * Returns an attribute name that corresponds to the given property.
       * By default, converts camel to dash case, e.g. `fooBar` to `foo-bar`.
       * @param {string} property Property to convert
       * @return {string} Attribute name corresponding to the given property.
       *
       * @protected
       */

    static attributeNameForProperty(property) {
      return caseMap$2.camelToDashCase(property);
    } /**
       * Overrides PropertiesChanged implementation to initialize values for
       * accessors created for values that already existed on the element
       * prototype.
       *
       * @return {void}
       * @protected
       */

    _initializeProperties() {
      if (this.__dataProto) {
        this._initializeProtoProperties(this.__dataProto);

        this.__dataProto = null;
      }

      super._initializeProperties();
    } /**
       * Called at instance time with bag of properties that were overwritten
       * by accessors on the prototype when accessors were created.
       *
       * The default implementation sets these properties back into the
       * setter at instance time.  This method is provided as an override
       * point for customizing or providing more efficient initialization.
       *
       * @param {Object} props Bag of property values that were overwritten
       *   when creating property accessors.
       * @return {void}
       * @protected
       */

    _initializeProtoProperties(props) {
      for (let p in props) {
        this._setProperty(p, props[p]);
      }
    } /**
       * Ensures the element has the given attribute. If it does not,
       * assigns the given value to the attribute.
       *
       * @suppress {invalidCasts} Closure can't figure out `this` is infact an element
       *
       * @param {string} attribute Name of attribute to ensure is set.
       * @param {string} value of the attribute.
       * @return {void}
       */

    _ensureAttribute(attribute, value) {
      const el = /** @type {!HTMLElement} */this;

      if (!el.hasAttribute(attribute)) {
        this._valueToNodeAttribute(el, value, attribute);
      }
    } /**
       * Overrides PropertiesChanged implemention to serialize objects as JSON.
       *
       * @param {*} value Property value to serialize.
       * @return {string | undefined} String serialized from the provided property value.
       */

    _serializeValue(value) {
      /* eslint-disable no-fallthrough */switch (typeof value) {
        case 'object':
          if (value instanceof Date) {
            return value.toString();
          } else if (value) {
            try {
              return JSON.stringify(value);
            } catch (x) {
              return '';
            }
          }

        default:
          return super._serializeValue(value);
      }
    } /**
       * Converts a string to a typed JavaScript value.
       *
       * This method is called by Polymer when reading HTML attribute values to
       * JS properties.  Users may override this method on Polymer element
       * prototypes to provide deserialization for custom `type`s.  Note,
       * the `type` argument is the value of the `type` field provided in the
       * `properties` configuration object for a given property, and is
       * by convention the constructor for the type to deserialize.
       *
       *
       * @param {?string} value Attribute value to deserialize.
       * @param {*=} type Type to deserialize the string to.
       * @return {*} Typed value deserialized from the provided string.
       */

    _deserializeValue(value, type) {
      /**
       * @type {*}
       */let outValue;

      switch (type) {
        case Object:
          try {
            outValue = JSON.parse( /** @type {string} */value);
          } catch (x) {
            // allow non-JSON literals like Strings and Numbers
            outValue = value;
          }

          break;

        case Array:
          try {
            outValue = JSON.parse( /** @type {string} */value);
          } catch (x) {
            outValue = null;
            console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${value}`);
          }

          break;

        case Date:
          outValue = isNaN(value) ? String(value) : Number(value);
          outValue = new Date(outValue);
          break;

        default:
          outValue = super._deserializeValue(value, type);
          break;
      }

      return outValue;
    } /* eslint-enable no-fallthrough */ /**
                                          * Overrides PropertiesChanged implementation to save existing prototype
                                          * property value so that it can be reset.
                                          * @param {string} property Name of the property
                                          * @param {boolean=} readOnly When true, no setter is created
                                          *
                                          * When calling on a prototype, any overwritten values are saved in
                                          * `__dataProto`, and it is up to the subclasser to decide how/when
                                          * to set those properties back into the accessor.  When calling on an
                                          * instance, the overwritten value is set via `_setPendingProperty`,
                                          * and the user should call `_invalidateProperties` or `_flushProperties`
                                          * for the values to take effect.
                                          * @protected
                                          * @return {void}
                                          */

    _definePropertyAccessor(property, readOnly) {
      saveAccessorValue(this, property);

      super._definePropertyAccessor(property, readOnly);
    } /**
       * Returns true if this library created an accessor for the given property.
       *
       * @param {string} property Property name
       * @return {boolean} True if an accessor was created
       */

    _hasAccessor(property) {
      return this.__dataHasAccessor && this.__dataHasAccessor[property];
    } /**
       * Returns true if the specified property has a pending change.
       *
       * @param {string} prop Property name
       * @return {boolean} True if property has a pending change
       * @protected
       */

    _isPropertyPending(prop) {
      return Boolean(this.__dataPending && prop in this.__dataPending);
    }

  }

  return PropertyAccessors;
});
var propertyAccessors = {
  PropertyAccessors: PropertyAccessors
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // 1.x backwards-compatible auto-wrapper for template type extensions
// This is a clear layering violation and gives favored-nation status to
// dom-if and dom-repeat templates.  This is a conceit we're choosing to keep
// a.) to ease 1.x backwards-compatibility due to loss of `is`, and
// b.) to maintain if/repeat capability in parser-constrained elements
//     (e.g. table, select) in lieu of native CE type extensions without
//     massive new invention in this space (e.g. directive system)

const templateExtensions = {
  'dom-if': true,
  'dom-repeat': true
};

function wrapTemplateExtension(node) {
  let is = node.getAttribute('is');

  if (is && templateExtensions[is]) {
    let t = node;
    t.removeAttribute('is');
    node = t.ownerDocument.createElement(is);
    t.parentNode.replaceChild(node, t);
    node.appendChild(t);

    while (t.attributes.length) {
      node.setAttribute(t.attributes[0].name, t.attributes[0].value);
      t.removeAttribute(t.attributes[0].name);
    }
  }

  return node;
}

function findTemplateNode(root, nodeInfo) {
  // recursively ascend tree until we hit root
  let parent = nodeInfo.parentInfo && findTemplateNode(root, nodeInfo.parentInfo); // unwind the stack, returning the indexed node at each level

  if (parent) {
    // note: marginally faster than indexing via childNodes
    // (http://jsperf.com/childnodes-lookup)
    for (let n = parent.firstChild, i = 0; n; n = n.nextSibling) {
      if (nodeInfo.parentIndex === i++) {
        return n;
      }
    }
  } else {
    return root;
  }
} // construct `$` map (from id annotations)


function applyIdToMap(inst, map, node, nodeInfo) {
  if (nodeInfo.id) {
    map[nodeInfo.id] = node;
  }
} // install event listeners (from event annotations)


function applyEventListener(inst, node, nodeInfo) {
  if (nodeInfo.events && nodeInfo.events.length) {
    for (let j = 0, e$ = nodeInfo.events, e; j < e$.length && (e = e$[j]); j++) {
      inst._addMethodEventListenerToNode(node, e.name, e.value, inst);
    }
  }
} // push configuration references at configure time


function applyTemplateContent(inst, node, nodeInfo) {
  if (nodeInfo.templateInfo) {
    node._templateInfo = nodeInfo.templateInfo;
  }
}

function createNodeEventHandler(context, eventName, methodName) {
  // Instances can optionally have a _methodHost which allows redirecting where
  // to find methods. Currently used by `templatize`.
  context = context._methodHost || context;

  let handler = function (e) {
    if (context[methodName]) {
      context[methodName](e, e.detail);
    } else {
      console.warn('listener method `' + methodName + '` not defined');
    }
  };

  return handler;
} /**
   * Element mixin that provides basic template parsing and stamping, including
   * the following template-related features for stamped templates:
   *
   * - Declarative event listeners (`on-eventname="listener"`)
   * - Map of node id's to stamped node instances (`this.$.id`)
   * - Nested template content caching/removal and re-installation (performance
   *   optimization)
   *
   * @mixinFunction
   * @polymer
   * @summary Element class mixin that provides basic template parsing and stamping
   */

const TemplateStamp = dedupingMixin( /**
                                      * @template T
                                      * @param {function(new:T)} superClass Class to apply mixin to.
                                      * @return {function(new:T)} superClass with mixin applied.
                                      */superClass => {
  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_TemplateStamp}
   */class TemplateStamp extends superClass {
    /**
     * Scans a template to produce template metadata.
     *
     * Template-specific metadata are stored in the object returned, and node-
     * specific metadata are stored in objects in its flattened `nodeInfoList`
     * array.  Only nodes in the template that were parsed as nodes of
     * interest contain an object in `nodeInfoList`.  Each `nodeInfo` object
     * contains an `index` (`childNodes` index in parent) and optionally
     * `parent`, which points to node info of its parent (including its index).
     *
     * The template metadata object returned from this method has the following
     * structure (many fields optional):
     *
     * ```js
     *   {
     *     // Flattened list of node metadata (for nodes that generated metadata)
     *     nodeInfoList: [
     *       {
     *         // `id` attribute for any nodes with id's for generating `$` map
     *         id: {string},
     *         // `on-event="handler"` metadata
     *         events: [
     *           {
     *             name: {string},   // event name
     *             value: {string},  // handler method name
     *           }, ...
     *         ],
     *         // Notes when the template contained a `<slot>` for shady DOM
     *         // optimization purposes
     *         hasInsertionPoint: {boolean},
     *         // For nested `<template>`` nodes, nested template metadata
     *         templateInfo: {object}, // nested template metadata
     *         // Metadata to allow efficient retrieval of instanced node
     *         // corresponding to this metadata
     *         parentInfo: {number},   // reference to parent nodeInfo>
     *         parentIndex: {number},  // index in parent's `childNodes` collection
     *         infoIndex: {number},    // index of this `nodeInfo` in `templateInfo.nodeInfoList`
     *       },
     *       ...
     *     ],
     *     // When true, the template had the `strip-whitespace` attribute
     *     // or was nested in a template with that setting
     *     stripWhitespace: {boolean},
     *     // For nested templates, nested template content is moved into
     *     // a document fragment stored here; this is an optimization to
     *     // avoid the cost of nested template cloning
     *     content: {DocumentFragment}
     *   }
     * ```
     *
     * This method kicks off a recursive treewalk as follows:
     *
     * ```
     *    _parseTemplate <---------------------+
     *      _parseTemplateContent              |
     *        _parseTemplateNode  <------------|--+
     *          _parseTemplateNestedTemplate --+  |
     *          _parseTemplateChildNodes ---------+
     *          _parseTemplateNodeAttributes
     *            _parseTemplateNodeAttribute
     *
     * ```
     *
     * These methods may be overridden to add custom metadata about templates
     * to either `templateInfo` or `nodeInfo`.
     *
     * Note that this method may be destructive to the template, in that
     * e.g. event annotations may be removed after being noted in the
     * template metadata.
     *
     * @param {!HTMLTemplateElement} template Template to parse
     * @param {TemplateInfo=} outerTemplateInfo Template metadata from the outer
     *   template, for parsing nested templates
     * @return {!TemplateInfo} Parsed template metadata
     */static _parseTemplate(template, outerTemplateInfo) {
      // since a template may be re-used, memo-ize metadata
      if (!template._templateInfo) {
        let templateInfo = template._templateInfo = {};
        templateInfo.nodeInfoList = [];
        templateInfo.stripWhiteSpace = outerTemplateInfo && outerTemplateInfo.stripWhiteSpace || template.hasAttribute('strip-whitespace');

        this._parseTemplateContent(template, templateInfo, {
          parent: null
        });
      }

      return template._templateInfo;
    }

    static _parseTemplateContent(template, templateInfo, nodeInfo) {
      return this._parseTemplateNode(template.content, templateInfo, nodeInfo);
    } /**
       * Parses template node and adds template and node metadata based on
       * the current node, and its `childNodes` and `attributes`.
       *
       * This method may be overridden to add custom node or template specific
       * metadata based on this node.
       *
       * @param {Node} node Node to parse
       * @param {!TemplateInfo} templateInfo Template metadata for current template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       */

    static _parseTemplateNode(node, templateInfo, nodeInfo) {
      let noted;
      let element = /** @type {Element} */node;

      if (element.localName == 'template' && !element.hasAttribute('preserve-content')) {
        noted = this._parseTemplateNestedTemplate(element, templateInfo, nodeInfo) || noted;
      } else if (element.localName === 'slot') {
        // For ShadyDom optimization, indicating there is an insertion point
        templateInfo.hasInsertionPoint = true;
      }

      if (element.firstChild) {
        noted = this._parseTemplateChildNodes(element, templateInfo, nodeInfo) || noted;
      }

      if (element.hasAttributes && element.hasAttributes()) {
        noted = this._parseTemplateNodeAttributes(element, templateInfo, nodeInfo) || noted;
      }

      return noted;
    } /**
       * Parses template child nodes for the given root node.
       *
       * This method also wraps whitelisted legacy template extensions
       * (`is="dom-if"` and `is="dom-repeat"`) with their equivalent element
       * wrappers, collapses text nodes, and strips whitespace from the template
       * if the `templateInfo.stripWhitespace` setting was provided.
       *
       * @param {Node} root Root node whose `childNodes` will be parsed
       * @param {!TemplateInfo} templateInfo Template metadata for current template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {void}
       */

    static _parseTemplateChildNodes(root, templateInfo, nodeInfo) {
      if (root.localName === 'script' || root.localName === 'style') {
        return;
      }

      for (let node = root.firstChild, parentIndex = 0, next; node; node = next) {
        // Wrap templates
        if (node.localName == 'template') {
          node = wrapTemplateExtension(node);
        } // collapse adjacent textNodes: fixes an IE issue that can cause
        // text nodes to be inexplicably split =(
        // note that root.normalize() should work but does not so we do this
        // manually.


        next = node.nextSibling;

        if (node.nodeType === Node.TEXT_NODE) {
          let /** Node */n = next;

          while (n && n.nodeType === Node.TEXT_NODE) {
            node.textContent += n.textContent;
            next = n.nextSibling;
            root.removeChild(n);
            n = next;
          } // optionally strip whitespace


          if (templateInfo.stripWhiteSpace && !node.textContent.trim()) {
            root.removeChild(node);
            continue;
          }
        }

        let childInfo = {
          parentIndex,
          parentInfo: nodeInfo
        };

        if (this._parseTemplateNode(node, templateInfo, childInfo)) {
          childInfo.infoIndex = templateInfo.nodeInfoList.push( /** @type {!NodeInfo} */childInfo) - 1;
        } // Increment if not removed


        if (node.parentNode) {
          parentIndex++;
        }
      }
    } /**
       * Parses template content for the given nested `<template>`.
       *
       * Nested template info is stored as `templateInfo` in the current node's
       * `nodeInfo`. `template.content` is removed and stored in `templateInfo`.
       * It will then be the responsibility of the host to set it back to the
       * template and for users stamping nested templates to use the
       * `_contentForTemplate` method to retrieve the content for this template
       * (an optimization to avoid the cost of cloning nested template content).
       *
       * @param {HTMLTemplateElement} node Node to parse (a <template>)
       * @param {TemplateInfo} outerTemplateInfo Template metadata for current template
       *   that includes the template `node`
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       */

    static _parseTemplateNestedTemplate(node, outerTemplateInfo, nodeInfo) {
      let templateInfo = this._parseTemplate(node, outerTemplateInfo);

      let content = templateInfo.content = node.content.ownerDocument.createDocumentFragment();
      content.appendChild(node.content);
      nodeInfo.templateInfo = templateInfo;
      return true;
    } /**
       * Parses template node attributes and adds node metadata to `nodeInfo`
       * for nodes of interest.
       *
       * @param {Element} node Node to parse
       * @param {TemplateInfo} templateInfo Template metadata for current template
       * @param {NodeInfo} nodeInfo Node metadata for current template.
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       */

    static _parseTemplateNodeAttributes(node, templateInfo, nodeInfo) {
      // Make copy of original attribute list, since the order may change
      // as attributes are added and removed
      let noted = false;
      let attrs = Array.from(node.attributes);

      for (let i = attrs.length - 1, a; a = attrs[i]; i--) {
        noted = this._parseTemplateNodeAttribute(node, templateInfo, nodeInfo, a.name, a.value) || noted;
      }

      return noted;
    } /**
       * Parses a single template node attribute and adds node metadata to
       * `nodeInfo` for attributes of interest.
       *
       * This implementation adds metadata for `on-event="handler"` attributes
       * and `id` attributes.
       *
       * @param {Element} node Node to parse
       * @param {!TemplateInfo} templateInfo Template metadata for current template
       * @param {!NodeInfo} nodeInfo Node metadata for current template.
       * @param {string} name Attribute name
       * @param {string} value Attribute value
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       */

    static _parseTemplateNodeAttribute(node, templateInfo, nodeInfo, name, value) {
      // events (on-*)
      if (name.slice(0, 3) === 'on-') {
        node.removeAttribute(name);
        nodeInfo.events = nodeInfo.events || [];
        nodeInfo.events.push({
          name: name.slice(3),
          value
        });
        return true;
      } // static id
      else if (name === 'id') {
          nodeInfo.id = value;
          return true;
        }

      return false;
    } /**
       * Returns the `content` document fragment for a given template.
       *
       * For nested templates, Polymer performs an optimization to cache nested
       * template content to avoid the cost of cloning deeply nested templates.
       * This method retrieves the cached content for a given template.
       *
       * @param {HTMLTemplateElement} template Template to retrieve `content` for
       * @return {DocumentFragment} Content fragment
       */

    static _contentForTemplate(template) {
      let templateInfo = /** @type {HTMLTemplateElementWithInfo} */template._templateInfo;
      return templateInfo && templateInfo.content || template.content;
    } /**
       * Clones the provided template content and returns a document fragment
       * containing the cloned dom.
       *
       * The template is parsed (once and memoized) using this library's
       * template parsing features, and provides the following value-added
       * features:
       * * Adds declarative event listeners for `on-event="handler"` attributes
       * * Generates an "id map" for all nodes with id's under `$` on returned
       *   document fragment
       * * Passes template info including `content` back to templates as
       *   `_templateInfo` (a performance optimization to avoid deep template
       *   cloning)
       *
       * Note that the memoized template parsing process is destructive to the
       * template: attributes for bindings and declarative event listeners are
       * removed after being noted in notes, and any nested `<template>.content`
       * is removed and stored in notes as well.
       *
       * @param {!HTMLTemplateElement} template Template to stamp
       * @return {!StampedTemplate} Cloned template content
       * @override
       */

    _stampTemplate(template) {
      // Polyfill support: bootstrap the template if it has not already been
      if (template && !template.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate) {
        HTMLTemplateElement.decorate(template);
      }

      let templateInfo = this.constructor._parseTemplate(template);

      let nodeInfo = templateInfo.nodeInfoList;
      let content = templateInfo.content || template.content;
      let dom = /** @type {DocumentFragment} */document.importNode(content, true); // NOTE: ShadyDom optimization indicating there is an insertion point

      dom.__noInsertionPoint = !templateInfo.hasInsertionPoint;
      let nodes = dom.nodeList = new Array(nodeInfo.length);
      dom.$ = {};

      for (let i = 0, l = nodeInfo.length, info; i < l && (info = nodeInfo[i]); i++) {
        let node = nodes[i] = findTemplateNode(dom, info);
        applyIdToMap(this, dom.$, node, info);
        applyTemplateContent(this, node, info);
        applyEventListener(this, node, info);
      }

      dom = /** @type {!StampedTemplate} */dom; // eslint-disable-line no-self-assign

      return dom;
    } /**
       * Adds an event listener by method name for the event provided.
       *
       * This method generates a handler function that looks up the method
       * name at handling time.
       *
       * @param {!Node} node Node to add listener on
       * @param {string} eventName Name of event
       * @param {string} methodName Name of method
       * @param {*=} context Context the method will be called on (defaults
       *   to `node`)
       * @return {Function} Generated handler function
       * @override
       */

    _addMethodEventListenerToNode(node, eventName, methodName, context) {
      context = context || node;
      let handler = createNodeEventHandler(context, eventName, methodName);

      this._addEventListenerToNode(node, eventName, handler);

      return handler;
    } /**
       * Override point for adding custom or simulated event handling.
       *
       * @param {!Node} node Node to add event listener to
       * @param {string} eventName Name of event
       * @param {function(!Event):void} handler Listener function to add
       * @return {void}
       * @override
       */

    _addEventListenerToNode(node, eventName, handler) {
      node.addEventListener(eventName, handler);
    } /**
       * Override point for adding custom or simulated event handling.
       *
       * @param {!Node} node Node to remove event listener from
       * @param {string} eventName Name of event
       * @param {function(!Event):void} handler Listener function to remove
       * @return {void}
       * @override
       */

    _removeEventListenerFromNode(node, eventName, handler) {
      node.removeEventListener(eventName, handler);
    }

  }

  return TemplateStamp;
});
var templateStamp = {
  TemplateStamp: TemplateStamp
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /** @const {Object} */
const CaseMap = caseMap$1; // Monotonically increasing unique ID used for de-duping effects triggered
// from multiple properties in the same turn

let dedupeId$1 = 0; /**
                     * Property effect types; effects are stored on the prototype using these keys
                     * @enum {string}
                     */
const TYPES = {
  COMPUTE: '__computeEffects',
  REFLECT: '__reflectEffects',
  NOTIFY: '__notifyEffects',
  PROPAGATE: '__propagateEffects',
  OBSERVE: '__observeEffects',
  READ_ONLY: '__readOnly'
}; /** @const {RegExp} */
const capitalAttributeRegex = /[A-Z]/; /**
                                        * @typedef {{
                                        * name: (string | undefined),
                                        * structured: (boolean | undefined),
                                        * wildcard: (boolean | undefined)
                                        * }}
                                        */
let DataTrigger; //eslint-disable-line no-unused-vars
/**
 * @typedef {{
 * info: ?,
 * trigger: (!DataTrigger | undefined),
 * fn: (!Function | undefined)
 * }}
 */
let DataEffect; //eslint-disable-line no-unused-vars

let PropertyEffectsType; //eslint-disable-line no-unused-vars
/**
 * Ensures that the model has an own-property map of effects for the given type.
 * The model may be a prototype or an instance.
 *
 * Property effects are stored as arrays of effects by property in a map,
 * by named type on the model. e.g.
 *
 *   __computeEffects: {
 *     foo: [ ... ],
 *     bar: [ ... ]
 *   }
 *
 * If the model does not yet have an effect map for the type, one is created
 * and returned.  If it does, but it is not an own property (i.e. the
 * prototype had effects), the the map is deeply cloned and the copy is
 * set on the model and returned, ready for new effects to be added.
 *
 * @param {Object} model Prototype or instance
 * @param {string} type Property effect type
 * @return {Object} The own-property map of effects for the given type
 * @private
 */

function ensureOwnEffectMap(model, type) {
  let effects = model[type];

  if (!effects) {
    effects = model[type] = {};
  } else if (!model.hasOwnProperty(type)) {
    effects = model[type] = Object.create(model[type]);

    for (let p in effects) {
      let protoFx = effects[p];
      let instFx = effects[p] = Array(protoFx.length);

      for (let i = 0; i < protoFx.length; i++) {
        instFx[i] = protoFx[i];
      }
    }
  }

  return effects;
} // -- effects ----------------------------------------------
/**
 * Runs all effects of a given type for the given set of property changes
 * on an instance.
 *
 * @param {!PropertyEffectsType} inst The instance with effects to run
 * @param {Object} effects Object map of property-to-Array of effects
 * @param {Object} props Bag of current property changes
 * @param {Object=} oldProps Bag of previous values for changed properties
 * @param {boolean=} hasPaths True with `props` contains one or more paths
 * @param {*=} extraArgs Additional metadata to pass to effect function
 * @return {boolean} True if an effect ran for this property
 * @private
 */

function runEffects(inst, effects, props, oldProps, hasPaths, extraArgs) {
  if (effects) {
    let ran = false;
    let id = dedupeId$1++;

    for (let prop in props) {
      if (runEffectsForProperty(inst, effects, id, prop, props, oldProps, hasPaths, extraArgs)) {
        ran = true;
      }
    }

    return ran;
  }

  return false;
} /**
   * Runs a list of effects for a given property.
   *
   * @param {!PropertyEffectsType} inst The instance with effects to run
   * @param {Object} effects Object map of property-to-Array of effects
   * @param {number} dedupeId Counter used for de-duping effects
   * @param {string} prop Name of changed property
   * @param {*} props Changed properties
   * @param {*} oldProps Old properties
   * @param {boolean=} hasPaths True with `props` contains one or more paths
   * @param {*=} extraArgs Additional metadata to pass to effect function
   * @return {boolean} True if an effect ran for this property
   * @private
   */

function runEffectsForProperty(inst, effects, dedupeId, prop, props, oldProps, hasPaths, extraArgs) {
  let ran = false;
  let rootProperty = hasPaths ? root(prop) : prop;
  let fxs = effects[rootProperty];

  if (fxs) {
    for (let i = 0, l = fxs.length, fx; i < l && (fx = fxs[i]); i++) {
      if ((!fx.info || fx.info.lastRun !== dedupeId) && (!hasPaths || pathMatchesTrigger(prop, fx.trigger))) {
        if (fx.info) {
          fx.info.lastRun = dedupeId;
        }

        fx.fn(inst, prop, props, oldProps, fx.info, hasPaths, extraArgs);
        ran = true;
      }
    }
  }

  return ran;
} /**
   * Determines whether a property/path that has changed matches the trigger
   * criteria for an effect.  A trigger is a descriptor with the following
   * structure, which matches the descriptors returned from `parseArg`.
   * e.g. for `foo.bar.*`:
   * ```
   * trigger: {
   *   name: 'a.b',
   *   structured: true,
   *   wildcard: true
   * }
   * ```
   * If no trigger is given, the path is deemed to match.
   *
   * @param {string} path Path or property that changed
   * @param {DataTrigger} trigger Descriptor
   * @return {boolean} Whether the path matched the trigger
   */

function pathMatchesTrigger(path, trigger) {
  if (trigger) {
    let triggerPath = trigger.name;
    return triggerPath == path || trigger.structured && isAncestor(triggerPath, path) || trigger.wildcard && isDescendant(triggerPath, path);
  } else {
    return true;
  }
} /**
   * Implements the "observer" effect.
   *
   * Calls the method with `info.methodName` on the instance, passing the
   * new and old values.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {string} property Name of property
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {?} info Effect metadata
   * @return {void}
   * @private
   */

function runObserverEffect(inst, property, props, oldProps, info) {
  let fn = typeof info.method === "string" ? inst[info.method] : info.method;
  let changedProp = info.property;

  if (fn) {
    fn.call(inst, inst.__data[changedProp], oldProps[changedProp]);
  } else if (!info.dynamicFn) {
    console.warn('observer method `' + info.method + '` not defined');
  }
} /**
   * Runs "notify" effects for a set of changed properties.
   *
   * This method differs from the generic `runEffects` method in that it
   * will dispatch path notification events in the case that the property
   * changed was a path and the root property for that path didn't have a
   * "notify" effect.  This is to maintain 1.0 behavior that did not require
   * `notify: true` to ensure object sub-property notifications were
   * sent.
   *
   * @param {!PropertyEffectsType} inst The instance with effects to run
   * @param {Object} notifyProps Bag of properties to notify
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {boolean} hasPaths True with `props` contains one or more paths
   * @return {void}
   * @private
   */

function runNotifyEffects(inst, notifyProps, props, oldProps, hasPaths) {
  // Notify
  let fxs = inst[TYPES.NOTIFY];
  let notified;
  let id = dedupeId$1++; // Try normal notify effects; if none, fall back to try path notification

  for (let prop in notifyProps) {
    if (notifyProps[prop]) {
      if (fxs && runEffectsForProperty(inst, fxs, id, prop, props, oldProps, hasPaths)) {
        notified = true;
      } else if (hasPaths && notifyPath(inst, prop, props)) {
        notified = true;
      }
    }
  } // Flush host if we actually notified and host was batching
  // And the host has already initialized clients; this prevents
  // an issue with a host observing data changes before clients are ready.


  let host;

  if (notified && (host = inst.__dataHost) && host._invalidateProperties) {
    host._invalidateProperties();
  }
} /**
   * Dispatches {property}-changed events with path information in the detail
   * object to indicate a sub-path of the property was changed.
   *
   * @param {!PropertyEffectsType} inst The element from which to fire the event
   * @param {string} path The path that was changed
   * @param {Object} props Bag of current property changes
   * @return {boolean} Returns true if the path was notified
   * @private
   */

function notifyPath(inst, path, props) {
  let rootProperty = root(path);

  if (rootProperty !== path) {
    let eventName = camelToDashCase(rootProperty) + '-changed';
    dispatchNotifyEvent(inst, eventName, props[path], path);
    return true;
  }

  return false;
} /**
   * Dispatches {property}-changed events to indicate a property (or path)
   * changed.
   *
   * @param {!PropertyEffectsType} inst The element from which to fire the event
   * @param {string} eventName The name of the event to send ('{property}-changed')
   * @param {*} value The value of the changed property
   * @param {string | null | undefined} path If a sub-path of this property changed, the path
   *   that changed (optional).
   * @return {void}
   * @private
   * @suppress {invalidCasts}
   */

function dispatchNotifyEvent(inst, eventName, value, path) {
  let detail = {
    value: value,
    queueProperty: true
  };

  if (path) {
    detail.path = path;
  } /** @type {!HTMLElement} */

  inst.dispatchEvent(new CustomEvent(eventName, {
    detail
  }));
} /**
   * Implements the "notify" effect.
   *
   * Dispatches a non-bubbling event named `info.eventName` on the instance
   * with a detail object containing the new `value`.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {string} property Name of property
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {?} info Effect metadata
   * @param {boolean} hasPaths True with `props` contains one or more paths
   * @return {void}
   * @private
   */

function runNotifyEffect(inst, property, props, oldProps, info, hasPaths) {
  let rootProperty = hasPaths ? root(property) : property;
  let path = rootProperty != property ? property : null;
  let value = path ? get(inst, path) : inst.__data[property];

  if (path && value === undefined) {
    value = props[property]; // specifically for .splices
  }

  dispatchNotifyEvent(inst, info.eventName, value, path);
} /**
   * Handler function for 2-way notification events. Receives context
   * information captured in the `addNotifyListener` closure from the
   * `__notifyListeners` metadata.
   *
   * Sets the value of the notified property to the host property or path.  If
   * the event contained path information, translate that path to the host
   * scope's name for that path first.
   *
   * @param {CustomEvent} event Notification event (e.g. '<property>-changed')
   * @param {!PropertyEffectsType} inst Host element instance handling the notification event
   * @param {string} fromProp Child element property that was bound
   * @param {string} toPath Host property/path that was bound
   * @param {boolean} negate Whether the binding was negated
   * @return {void}
   * @private
   */

function handleNotification(event, inst, fromProp, toPath, negate) {
  let value;
  let detail = /** @type {Object} */event.detail;
  let fromPath = detail && detail.path;

  if (fromPath) {
    toPath = translate(fromProp, toPath, fromPath);
    value = detail && detail.value;
  } else {
    value = event.target[fromProp];
  }

  value = negate ? !value : value;

  if (!inst[TYPES.READ_ONLY] || !inst[TYPES.READ_ONLY][toPath]) {
    if (inst._setPendingPropertyOrPath(toPath, value, true, Boolean(fromPath)) && (!detail || !detail.queueProperty)) {
      inst._invalidateProperties();
    }
  }
} /**
   * Implements the "reflect" effect.
   *
   * Sets the attribute named `info.attrName` to the given property value.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {string} property Name of property
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {?} info Effect metadata
   * @return {void}
   * @private
   */

function runReflectEffect(inst, property, props, oldProps, info) {
  let value = inst.__data[property];

  if (sanitizeDOMValue) {
    value = sanitizeDOMValue(value, info.attrName, 'attribute', /** @type {Node} */inst);
  }

  inst._propertyToAttribute(property, info.attrName, value);
} /**
   * Runs "computed" effects for a set of changed properties.
   *
   * This method differs from the generic `runEffects` method in that it
   * continues to run computed effects based on the output of each pass until
   * there are no more newly computed properties.  This ensures that all
   * properties that will be computed by the initial set of changes are
   * computed before other effects (binding propagation, observers, and notify)
   * run.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {!Object} changedProps Bag of changed properties
   * @param {!Object} oldProps Bag of previous values for changed properties
   * @param {boolean} hasPaths True with `props` contains one or more paths
   * @return {void}
   * @private
   */

function runComputedEffects(inst, changedProps, oldProps, hasPaths) {
  let computeEffects = inst[TYPES.COMPUTE];

  if (computeEffects) {
    let inputProps = changedProps;

    while (runEffects(inst, computeEffects, inputProps, oldProps, hasPaths)) {
      Object.assign(oldProps, inst.__dataOld);
      Object.assign(changedProps, inst.__dataPending);
      inputProps = inst.__dataPending;
      inst.__dataPending = null;
    }
  }
} /**
   * Implements the "computed property" effect by running the method with the
   * values of the arguments specified in the `info` object and setting the
   * return value to the computed property specified.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {string} property Name of property
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {?} info Effect metadata
   * @return {void}
   * @private
   */

function runComputedEffect(inst, property, props, oldProps, info) {
  let result = runMethodEffect(inst, property, props, oldProps, info);
  let computedProp = info.methodInfo;

  if (inst.__dataHasAccessor && inst.__dataHasAccessor[computedProp]) {
    inst._setPendingProperty(computedProp, result, true);
  } else {
    inst[computedProp] = result;
  }
} /**
   * Computes path changes based on path links set up using the `linkPaths`
   * API.
   *
   * @param {!PropertyEffectsType} inst The instance whose props are changing
   * @param {string | !Array<(string|number)>} path Path that has changed
   * @param {*} value Value of changed path
   * @return {void}
   * @private
   */

function computeLinkedPaths(inst, path, value) {
  let links = inst.__dataLinkedPaths;

  if (links) {
    let link;

    for (let a in links) {
      let b = links[a];

      if (isDescendant(a, path)) {
        link = translate(a, b, path);

        inst._setPendingPropertyOrPath(link, value, true, true);
      } else if (isDescendant(b, path)) {
        link = translate(b, a, path);

        inst._setPendingPropertyOrPath(link, value, true, true);
      }
    }
  }
} // -- bindings ----------------------------------------------
/**
 * Adds binding metadata to the current `nodeInfo`, and binding effects
 * for all part dependencies to `templateInfo`.
 *
 * @param {Function} constructor Class that `_parseTemplate` is currently
 *   running on
 * @param {TemplateInfo} templateInfo Template metadata for current template
 * @param {NodeInfo} nodeInfo Node metadata for current template node
 * @param {string} kind Binding kind, either 'property', 'attribute', or 'text'
 * @param {string} target Target property name
 * @param {!Array<!BindingPart>} parts Array of binding part metadata
 * @param {string=} literal Literal text surrounding binding parts (specified
 *   only for 'property' bindings, since these must be initialized as part
 *   of boot-up)
 * @return {void}
 * @private
 */

function addBinding(constructor, templateInfo, nodeInfo, kind, target, parts, literal) {
  // Create binding metadata and add to nodeInfo
  nodeInfo.bindings = nodeInfo.bindings || [];
  let /** Binding */binding = {
    kind,
    target,
    parts,
    literal,
    isCompound: parts.length !== 1
  };
  nodeInfo.bindings.push(binding); // Add listener info to binding metadata

  if (shouldAddListener(binding)) {
    let {
      event,
      negate
    } = binding.parts[0];
    binding.listenerEvent = event || CaseMap.camelToDashCase(target) + '-changed';
    binding.listenerNegate = negate;
  } // Add "propagate" property effects to templateInfo


  let index = templateInfo.nodeInfoList.length;

  for (let i = 0; i < binding.parts.length; i++) {
    let part = binding.parts[i];
    part.compoundIndex = i;
    addEffectForBindingPart(constructor, templateInfo, binding, part, index);
  }
} /**
   * Adds property effects to the given `templateInfo` for the given binding
   * part.
   *
   * @param {Function} constructor Class that `_parseTemplate` is currently
   *   running on
   * @param {TemplateInfo} templateInfo Template metadata for current template
   * @param {!Binding} binding Binding metadata
   * @param {!BindingPart} part Binding part metadata
   * @param {number} index Index into `nodeInfoList` for this node
   * @return {void}
   */

function addEffectForBindingPart(constructor, templateInfo, binding, part, index) {
  if (!part.literal) {
    if (binding.kind === 'attribute' && binding.target[0] === '-') {
      console.warn('Cannot set attribute ' + binding.target + ' because "-" is not a valid attribute starting character');
    } else {
      let dependencies = part.dependencies;
      let info = {
        index,
        binding,
        part,
        evaluator: constructor
      };

      for (let j = 0; j < dependencies.length; j++) {
        let trigger = dependencies[j];

        if (typeof trigger == 'string') {
          trigger = parseArg(trigger);
          trigger.wildcard = true;
        }

        constructor._addTemplatePropertyEffect(templateInfo, trigger.rootProperty, {
          fn: runBindingEffect,
          info,
          trigger
        });
      }
    }
  }
} /**
   * Implements the "binding" (property/path binding) effect.
   *
   * Note that binding syntax is overridable via `_parseBindings` and
   * `_evaluateBinding`.  This method will call `_evaluateBinding` for any
   * non-literal parts returned from `_parseBindings`.  However,
   * there is no support for _path_ bindings via custom binding parts,
   * as this is specific to Polymer's path binding syntax.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {string} path Name of property
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {?} info Effect metadata
   * @param {boolean} hasPaths True with `props` contains one or more paths
   * @param {Array} nodeList List of nodes associated with `nodeInfoList` template
   *   metadata
   * @return {void}
   * @private
   */

function runBindingEffect(inst, path, props, oldProps, info, hasPaths, nodeList) {
  let node = nodeList[info.index];
  let binding = info.binding;
  let part = info.part; // Subpath notification: transform path and set to client
  // e.g.: foo="{{obj.sub}}", path: 'obj.sub.prop', set 'foo.prop'=obj.sub.prop

  if (hasPaths && part.source && path.length > part.source.length && binding.kind == 'property' && !binding.isCompound && node.__isPropertyEffectsClient && node.__dataHasAccessor && node.__dataHasAccessor[binding.target]) {
    let value = props[path];
    path = translate(part.source, binding.target, path);

    if (node._setPendingPropertyOrPath(path, value, false, true)) {
      inst._enqueueClient(node);
    }
  } else {
    let value = info.evaluator._evaluateBinding(inst, part, path, props, oldProps, hasPaths); // Propagate value to child


    applyBindingValue(inst, node, binding, part, value);
  }
} /**
   * Sets the value for an "binding" (binding) effect to a node,
   * either as a property or attribute.
   *
   * @param {!PropertyEffectsType} inst The instance owning the binding effect
   * @param {Node} node Target node for binding
   * @param {!Binding} binding Binding metadata
   * @param {!BindingPart} part Binding part metadata
   * @param {*} value Value to set
   * @return {void}
   * @private
   */

function applyBindingValue(inst, node, binding, part, value) {
  value = computeBindingValue(node, value, binding, part);

  if (sanitizeDOMValue) {
    value = sanitizeDOMValue(value, binding.target, binding.kind, node);
  }

  if (binding.kind == 'attribute') {
    // Attribute binding
    inst._valueToNodeAttribute( /** @type {Element} */node, value, binding.target);
  } else {
    // Property binding
    let prop = binding.target;

    if (node.__isPropertyEffectsClient && node.__dataHasAccessor && node.__dataHasAccessor[prop]) {
      if (!node[TYPES.READ_ONLY] || !node[TYPES.READ_ONLY][prop]) {
        if (node._setPendingProperty(prop, value)) {
          inst._enqueueClient(node);
        }
      }
    } else {
      inst._setUnmanagedPropertyToNode(node, prop, value);
    }
  }
} /**
   * Transforms an "binding" effect value based on compound & negation
   * effect metadata, as well as handling for special-case properties
   *
   * @param {Node} node Node the value will be set to
   * @param {*} value Value to set
   * @param {!Binding} binding Binding metadata
   * @param {!BindingPart} part Binding part metadata
   * @return {*} Transformed value to set
   * @private
   */

function computeBindingValue(node, value, binding, part) {
  if (binding.isCompound) {
    let storage = node.__dataCompoundStorage[binding.target];
    storage[part.compoundIndex] = value;
    value = storage.join('');
  }

  if (binding.kind !== 'attribute') {
    // Some browsers serialize `undefined` to `"undefined"`
    if (binding.target === 'textContent' || binding.target === 'value' && (node.localName === 'input' || node.localName === 'textarea')) {
      value = value == undefined ? '' : value;
    }
  }

  return value;
} /**
   * Returns true if a binding's metadata meets all the requirements to allow
   * 2-way binding, and therefore a `<property>-changed` event listener should be
   * added:
   * - used curly braces
   * - is a property (not attribute) binding
   * - is not a textContent binding
   * - is not compound
   *
   * @param {!Binding} binding Binding metadata
   * @return {boolean} True if 2-way listener should be added
   * @private
   */

function shouldAddListener(binding) {
  return Boolean(binding.target) && binding.kind != 'attribute' && binding.kind != 'text' && !binding.isCompound && binding.parts[0].mode === '{';
} /**
   * Setup compound binding storage structures, notify listeners, and dataHost
   * references onto the bound nodeList.
   *
   * @param {!PropertyEffectsType} inst Instance that bas been previously bound
   * @param {TemplateInfo} templateInfo Template metadata
   * @return {void}
   * @private
   */

function setupBindings(inst, templateInfo) {
  // Setup compound storage, dataHost, and notify listeners
  let {
    nodeList,
    nodeInfoList
  } = templateInfo;

  if (nodeInfoList.length) {
    for (let i = 0; i < nodeInfoList.length; i++) {
      let info = nodeInfoList[i];
      let node = nodeList[i];
      let bindings = info.bindings;

      if (bindings) {
        for (let i = 0; i < bindings.length; i++) {
          let binding = bindings[i];
          setupCompoundStorage(node, binding);
          addNotifyListener(node, inst, binding);
        }
      }

      node.__dataHost = inst;
    }
  }
} /**
   * Initializes `__dataCompoundStorage` local storage on a bound node with
   * initial literal data for compound bindings, and sets the joined
   * literal parts to the bound property.
   *
   * When changes to compound parts occur, they are first set into the compound
   * storage array for that property, and then the array is joined to result in
   * the final value set to the property/attribute.
   *
   * @param {Node} node Bound node to initialize
   * @param {Binding} binding Binding metadata
   * @return {void}
   * @private
   */

function setupCompoundStorage(node, binding) {
  if (binding.isCompound) {
    // Create compound storage map
    let storage = node.__dataCompoundStorage || (node.__dataCompoundStorage = {});
    let parts = binding.parts; // Copy literals from parts into storage for this binding

    let literals = new Array(parts.length);

    for (let j = 0; j < parts.length; j++) {
      literals[j] = parts[j].literal;
    }

    let target = binding.target;
    storage[target] = literals; // Configure properties with their literal parts

    if (binding.literal && binding.kind == 'property') {
      node[target] = binding.literal;
    }
  }
} /**
   * Adds a 2-way binding notification event listener to the node specified
   *
   * @param {Object} node Child element to add listener to
   * @param {!PropertyEffectsType} inst Host element instance to handle notification event
   * @param {Binding} binding Binding metadata
   * @return {void}
   * @private
   */

function addNotifyListener(node, inst, binding) {
  if (binding.listenerEvent) {
    let part = binding.parts[0];
    node.addEventListener(binding.listenerEvent, function (e) {
      handleNotification(e, inst, binding.target, part.source, part.negate);
    });
  }
} // -- for method-based effects (complexObserver & computed) --------------
/**
 * Adds property effects for each argument in the method signature (and
 * optionally, for the method name if `dynamic` is true) that calls the
 * provided effect function.
 *
 * @param {Element | Object} model Prototype or instance
 * @param {!MethodSignature} sig Method signature metadata
 * @param {string} type Type of property effect to add
 * @param {Function} effectFn Function to run when arguments change
 * @param {*=} methodInfo Effect-specific information to be included in
 *   method effect metadata
 * @param {boolean|Object=} dynamicFn Boolean or object map indicating whether
 *   method names should be included as a dependency to the effect. Note,
 *   defaults to true if the signature is static (sig.static is true).
 * @return {void}
 * @private
 */

function createMethodEffect(model, sig, type, effectFn, methodInfo, dynamicFn) {
  dynamicFn = sig.static || dynamicFn && (typeof dynamicFn !== 'object' || dynamicFn[sig.methodName]);
  let info = {
    methodName: sig.methodName,
    args: sig.args,
    methodInfo,
    dynamicFn
  };

  for (let i = 0, arg; i < sig.args.length && (arg = sig.args[i]); i++) {
    if (!arg.literal) {
      model._addPropertyEffect(arg.rootProperty, type, {
        fn: effectFn,
        info: info,
        trigger: arg
      });
    }
  }

  if (dynamicFn) {
    model._addPropertyEffect(sig.methodName, type, {
      fn: effectFn,
      info: info
    });
  }
} /**
   * Calls a method with arguments marshaled from properties on the instance
   * based on the method signature contained in the effect metadata.
   *
   * Multi-property observers, computed properties, and inline computing
   * functions call this function to invoke the method, then use the return
   * value accordingly.
   *
   * @param {!PropertyEffectsType} inst The instance the effect will be run on
   * @param {string} property Name of property
   * @param {Object} props Bag of current property changes
   * @param {Object} oldProps Bag of previous values for changed properties
   * @param {?} info Effect metadata
   * @return {*} Returns the return value from the method invocation
   * @private
   */

function runMethodEffect(inst, property, props, oldProps, info) {
  // Instances can optionally have a _methodHost which allows redirecting where
  // to find methods. Currently used by `templatize`.
  let context = inst._methodHost || inst;
  let fn = context[info.methodName];

  if (fn) {
    let args = marshalArgs(inst.__data, info.args, property, props);
    return fn.apply(context, args);
  } else if (!info.dynamicFn) {
    console.warn('method `' + info.methodName + '` not defined');
  }
}

const emptyArray = []; // Regular expressions used for binding

const IDENT = '(?:' + '[a-zA-Z_$][\\w.:$\\-*]*' + ')';
const NUMBER = '(?:' + '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?' + ')';
const SQUOTE_STRING = '(?:' + '\'(?:[^\'\\\\]|\\\\.)*\'' + ')';
const DQUOTE_STRING = '(?:' + '"(?:[^"\\\\]|\\\\.)*"' + ')';
const STRING = '(?:' + SQUOTE_STRING + '|' + DQUOTE_STRING + ')';
const ARGUMENT = '(?:(' + IDENT + '|' + NUMBER + '|' + STRING + ')\\s*' + ')';
const ARGUMENTS = '(?:' + ARGUMENT + '(?:,\\s*' + ARGUMENT + ')*' + ')';
const ARGUMENT_LIST = '(?:' + '\\(\\s*' + '(?:' + ARGUMENTS + '?' + ')' + '\\)\\s*' + ')';
const BINDING = '(' + IDENT + '\\s*' + ARGUMENT_LIST + '?' + ')'; // Group 3

const OPEN_BRACKET = '(\\[\\[|{{)' + '\\s*';
const CLOSE_BRACKET = '(?:]]|}})';
const NEGATE = '(?:(!)\\s*)?'; // Group 2

const EXPRESSION = OPEN_BRACKET + NEGATE + BINDING + CLOSE_BRACKET;
const bindingRegex = new RegExp(EXPRESSION, "g"); /**
                                                   * Create a string from binding parts of all the literal parts
                                                   *
                                                   * @param {!Array<BindingPart>} parts All parts to stringify
                                                   * @return {string} String made from the literal parts
                                                   */

function literalFromParts(parts) {
  let s = '';

  for (let i = 0; i < parts.length; i++) {
    let literal = parts[i].literal;
    s += literal || '';
  }

  return s;
} /**
   * Parses an expression string for a method signature, and returns a metadata
   * describing the method in terms of `methodName`, `static` (whether all the
   * arguments are literals), and an array of `args`
   *
   * @param {string} expression The expression to parse
   * @return {?MethodSignature} The method metadata object if a method expression was
   *   found, otherwise `undefined`
   * @private
   */

function parseMethod(expression) {
  // tries to match valid javascript property names
  let m = expression.match(/([^\s]+?)\(([\s\S]*)\)/);

  if (m) {
    let methodName = m[1];
    let sig = {
      methodName,
      static: true,
      args: emptyArray
    };

    if (m[2].trim()) {
      // replace escaped commas with comma entity, split on un-escaped commas
      let args = m[2].replace(/\\,/g, '&comma;').split(',');
      return parseArgs(args, sig);
    } else {
      return sig;
    }
  }

  return null;
} /**
   * Parses an array of arguments and sets the `args` property of the supplied
   * signature metadata object. Sets the `static` property to false if any
   * argument is a non-literal.
   *
   * @param {!Array<string>} argList Array of argument names
   * @param {!MethodSignature} sig Method signature metadata object
   * @return {!MethodSignature} The updated signature metadata object
   * @private
   */

function parseArgs(argList, sig) {
  sig.args = argList.map(function (rawArg) {
    let arg = parseArg(rawArg);

    if (!arg.literal) {
      sig.static = false;
    }

    return arg;
  }, this);
  return sig;
} /**
   * Parses an individual argument, and returns an argument metadata object
   * with the following fields:
   *
   *   {
   *     value: 'prop',        // property/path or literal value
   *     literal: false,       // whether argument is a literal
   *     structured: false,    // whether the property is a path
   *     rootProperty: 'prop', // the root property of the path
   *     wildcard: false       // whether the argument was a wildcard '.*' path
   *   }
   *
   * @param {string} rawArg The string value of the argument
   * @return {!MethodArg} Argument metadata object
   * @private
   */

function parseArg(rawArg) {
  // clean up whitespace
  let arg = rawArg.trim() // replace comma entity with comma
  .replace(/&comma;/g, ',') // repair extra escape sequences; note only commas strictly need
  // escaping, but we allow any other char to be escaped since its
  // likely users will do this
  .replace(/\\(.)/g, '\$1'); // basic argument descriptor

  let a = {
    name: arg,
    value: '',
    literal: false
  }; // detect literal value (must be String or Number)

  let fc = arg[0];

  if (fc === '-') {
    fc = arg[1];
  }

  if (fc >= '0' && fc <= '9') {
    fc = '#';
  }

  switch (fc) {
    case "'":
    case '"':
      a.value = arg.slice(1, -1);
      a.literal = true;
      break;

    case '#':
      a.value = Number(arg);
      a.literal = true;
      break;
  } // if not literal, look for structured path


  if (!a.literal) {
    a.rootProperty = root(arg); // detect structured path (has dots)

    a.structured = isPath(arg);

    if (a.structured) {
      a.wildcard = arg.slice(-2) == '.*';

      if (a.wildcard) {
        a.name = arg.slice(0, -2);
      }
    }
  }

  return a;
} /**
   * Gather the argument values for a method specified in the provided array
   * of argument metadata.
   *
   * The `path` and `value` arguments are used to fill in wildcard descriptor
   * when the method is being called as a result of a path notification.
   *
   * @param {Object} data Instance data storage object to read properties from
   * @param {!Array<!MethodArg>} args Array of argument metadata
   * @param {string} path Property/path name that triggered the method effect
   * @param {Object} props Bag of current property changes
   * @return {Array<*>} Array of argument values
   * @private
   */

function marshalArgs(data, args, path, props) {
  let values = [];

  for (let i = 0, l = args.length; i < l; i++) {
    let arg = args[i];
    let name = arg.name;
    let v;

    if (arg.literal) {
      v = arg.value;
    } else {
      if (arg.structured) {
        v = get(data, name); // when data is not stored e.g. `splices`

        if (v === undefined) {
          v = props[name];
        }
      } else {
        v = data[name];
      }
    }

    if (arg.wildcard) {
      // Only send the actual path changed info if the change that
      // caused the observer to run matched the wildcard
      let baseChanged = name.indexOf(path + '.') === 0;
      let matches$$1 = path.indexOf(name) === 0 && !baseChanged;
      values[i] = {
        path: matches$$1 ? path : name,
        value: matches$$1 ? props[path] : v,
        base: v
      };
    } else {
      values[i] = v;
    }
  }

  return values;
} // data api
/**
 * Sends array splice notifications (`.splices` and `.length`)
 *
 * Note: this implementation only accepts normalized paths
 *
 * @param {!PropertyEffectsType} inst Instance to send notifications to
 * @param {Array} array The array the mutations occurred on
 * @param {string} path The path to the array that was mutated
 * @param {Array} splices Array of splice records
 * @return {void}
 * @private
 */

function notifySplices(inst, array, path, splices) {
  let splicesPath = path + '.splices';
  inst.notifyPath(splicesPath, {
    indexSplices: splices
  });
  inst.notifyPath(path + '.length', array.length); // Null here to allow potentially large splice records to be GC'ed.

  inst.__data[splicesPath] = {
    indexSplices: null
  };
} /**
   * Creates a splice record and sends an array splice notification for
   * the described mutation
   *
   * Note: this implementation only accepts normalized paths
   *
   * @param {!PropertyEffectsType} inst Instance to send notifications to
   * @param {Array} array The array the mutations occurred on
   * @param {string} path The path to the array that was mutated
   * @param {number} index Index at which the array mutation occurred
   * @param {number} addedCount Number of added items
   * @param {Array} removed Array of removed items
   * @return {void}
   * @private
   */

function notifySplice(inst, array, path, index, addedCount, removed) {
  notifySplices(inst, array, path, [{
    index: index,
    addedCount: addedCount,
    removed: removed,
    object: array,
    type: 'splice'
  }]);
} /**
   * Returns an upper-cased version of the string.
   *
   * @param {string} name String to uppercase
   * @return {string} Uppercased string
   * @private
   */

function upper(name) {
  return name[0].toUpperCase() + name.substring(1);
} /**
   * Element class mixin that provides meta-programming for Polymer's template
   * binding and data observation (collectively, "property effects") system.
   *
   * This mixin uses provides the following key static methods for adding
   * property effects to an element class:
   * - `addPropertyEffect`
   * - `createPropertyObserver`
   * - `createMethodObserver`
   * - `createNotifyingProperty`
   * - `createReadOnlyProperty`
   * - `createReflectedProperty`
   * - `createComputedProperty`
   * - `bindTemplate`
   *
   * Each method creates one or more property accessors, along with metadata
   * used by this mixin's implementation of `_propertiesChanged` to perform
   * the property effects.
   *
   * Underscored versions of the above methods also exist on the element
   * prototype for adding property effects on instances at runtime.
   *
   * Note that this mixin overrides several `PropertyAccessors` methods, in
   * many cases to maintain guarantees provided by the Polymer 1.x features;
   * notably it changes property accessors to be synchronous by default
   * whereas the default when using `PropertyAccessors` standalone is to be
   * async by default.
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin TemplateStamp
   * @appliesMixin PropertyAccessors
   * @summary Element class mixin that provides meta-programming for Polymer's
   * template binding and data observation system.
   */

const PropertyEffects = dedupingMixin(superClass => {
  /**
   * @constructor
   * @extends {superClass}
   * @implements {Polymer_PropertyAccessors}
   * @implements {Polymer_TemplateStamp}
   * @unrestricted
   * @private
   */const propertyEffectsBase = TemplateStamp(PropertyAccessors(superClass)); /**
                                                                                * @polymer
                                                                                * @mixinClass
                                                                                * @implements {Polymer_PropertyEffects}
                                                                                * @extends {propertyEffectsBase}
                                                                                * @unrestricted
                                                                                */

  class PropertyEffects extends propertyEffectsBase {
    constructor() {
      super(); /** @type {boolean} */ // Used to identify users of this mixin, ala instanceof

      this.__isPropertyEffectsClient = true; /** @type {number} */ // NOTE: used to track re-entrant calls to `_flushProperties`
      // path changes dirty check against `__dataTemp` only during one "turn"
      // and are cleared when `__dataCounter` returns to 0.

      this.__dataCounter = 0; /** @type {boolean} */
      this.__dataClientsReady; /** @type {Array} */
      this.__dataPendingClients; /** @type {Object} */
      this.__dataToNotify; /** @type {Object} */
      this.__dataLinkedPaths; /** @type {boolean} */
      this.__dataHasPaths; /** @type {Object} */
      this.__dataCompoundStorage; /** @type {Polymer_PropertyEffects} */
      this.__dataHost; /** @type {!Object} */
      this.__dataTemp; /** @type {boolean} */
      this.__dataClientsInitialized; /** @type {!Object} */
      this.__data; /** @type {!Object} */
      this.__dataPending; /** @type {!Object} */
      this.__dataOld; /** @type {Object} */
      this.__computeEffects; /** @type {Object} */
      this.__reflectEffects; /** @type {Object} */
      this.__notifyEffects; /** @type {Object} */
      this.__propagateEffects; /** @type {Object} */
      this.__observeEffects; /** @type {Object} */
      this.__readOnly; /** @type {!TemplateInfo} */
      this.__templateInfo;
    }

    get PROPERTY_EFFECT_TYPES() {
      return TYPES;
    } /**
       * @return {void}
       */

    _initializeProperties() {
      super._initializeProperties();

      hostStack.registerHost(this);
      this.__dataClientsReady = false;
      this.__dataPendingClients = null;
      this.__dataToNotify = null;
      this.__dataLinkedPaths = null;
      this.__dataHasPaths = false; // May be set on instance prior to upgrade

      this.__dataCompoundStorage = this.__dataCompoundStorage || null;
      this.__dataHost = this.__dataHost || null;
      this.__dataTemp = {};
      this.__dataClientsInitialized = false;
    } /**
       * Overrides `PropertyAccessors` implementation to provide a
       * more efficient implementation of initializing properties from
       * the prototype on the instance.
       *
       * @override
       * @param {Object} props Properties to initialize on the prototype
       * @return {void}
       */

    _initializeProtoProperties(props) {
      this.__data = Object.create(props);
      this.__dataPending = Object.create(props);
      this.__dataOld = {};
    } /**
       * Overrides `PropertyAccessors` implementation to avoid setting
       * `_setProperty`'s `shouldNotify: true`.
       *
       * @override
       * @param {Object} props Properties to initialize on the instance
       * @return {void}
       */

    _initializeInstanceProperties(props) {
      let readOnly = this[TYPES.READ_ONLY];

      for (let prop in props) {
        if (!readOnly || !readOnly[prop]) {
          this.__dataPending = this.__dataPending || {};
          this.__dataOld = this.__dataOld || {};
          this.__data[prop] = this.__dataPending[prop] = props[prop];
        }
      }
    } // Prototype setup ----------------------------------------
    /**
     * Equivalent to static `addPropertyEffect` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     */

    _addPropertyEffect(property, type, effect) {
      this._createPropertyAccessor(property, type == TYPES.READ_ONLY); // effects are accumulated into arrays per property based on type


      let effects = ensureOwnEffectMap(this, type)[property];

      if (!effects) {
        effects = this[type][property] = [];
      }

      effects.push(effect);
    } /**
       * Removes the given property effect.
       *
       * @param {string} property Property the effect was associated with
       * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
       * @param {Object=} effect Effect metadata object to remove
       * @return {void}
       */

    _removePropertyEffect(property, type, effect) {
      let effects = ensureOwnEffectMap(this, type)[property];
      let idx = effects.indexOf(effect);

      if (idx >= 0) {
        effects.splice(idx, 1);
      }
    } /**
       * Returns whether the current prototype/instance has a property effect
       * of a certain type.
       *
       * @param {string} property Property name
       * @param {string=} type Effect type, from this.PROPERTY_EFFECT_TYPES
       * @return {boolean} True if the prototype/instance has an effect of this type
       * @protected
       */

    _hasPropertyEffect(property, type) {
      let effects = this[type];
      return Boolean(effects && effects[property]);
    } /**
       * Returns whether the current prototype/instance has a "read only"
       * accessor for the given property.
       *
       * @param {string} property Property name
       * @return {boolean} True if the prototype/instance has an effect of this type
       * @protected
       */

    _hasReadOnlyEffect(property) {
      return this._hasPropertyEffect(property, TYPES.READ_ONLY);
    } /**
       * Returns whether the current prototype/instance has a "notify"
       * property effect for the given property.
       *
       * @param {string} property Property name
       * @return {boolean} True if the prototype/instance has an effect of this type
       * @protected
       */

    _hasNotifyEffect(property) {
      return this._hasPropertyEffect(property, TYPES.NOTIFY);
    } /**
       * Returns whether the current prototype/instance has a "reflect to attribute"
       * property effect for the given property.
       *
       * @param {string} property Property name
       * @return {boolean} True if the prototype/instance has an effect of this type
       * @protected
       */

    _hasReflectEffect(property) {
      return this._hasPropertyEffect(property, TYPES.REFLECT);
    } /**
       * Returns whether the current prototype/instance has a "computed"
       * property effect for the given property.
       *
       * @param {string} property Property name
       * @return {boolean} True if the prototype/instance has an effect of this type
       * @protected
       */

    _hasComputedEffect(property) {
      return this._hasPropertyEffect(property, TYPES.COMPUTE);
    } // Runtime ----------------------------------------
    /**
     * Sets a pending property or path.  If the root property of the path in
     * question had no accessor, the path is set, otherwise it is enqueued
     * via `_setPendingProperty`.
     *
     * This function isolates relatively expensive functionality necessary
     * for the public API (`set`, `setProperties`, `notifyPath`, and property
     * change listeners via {{...}} bindings), such that it is only done
     * when paths enter the system, and not at every propagation step.  It
     * also sets a `__dataHasPaths` flag on the instance which is used to
     * fast-path slower path-matching code in the property effects host paths.
     *
     * `path` can be a path string or array of path parts as accepted by the
     * public API.
     *
     * @param {string | !Array<number|string>} path Path to set
     * @param {*} value Value to set
     * @param {boolean=} shouldNotify Set to true if this change should
     *  cause a property notification event dispatch
     * @param {boolean=} isPathNotification If the path being set is a path
     *   notification of an already changed value, as opposed to a request
     *   to set and notify the change.  In the latter `false` case, a dirty
     *   check is performed and then the value is set to the path before
     *   enqueuing the pending property change.
     * @return {boolean} Returns true if the property/path was enqueued in
     *   the pending changes bag.
     * @protected
     */

    _setPendingPropertyOrPath(path, value, shouldNotify, isPathNotification) {
      if (isPathNotification || root(Array.isArray(path) ? path[0] : path) !== path) {
        // Dirty check changes being set to a path against the actual object,
        // since this is the entry point for paths into the system; from here
        // the only dirty checks are against the `__dataTemp` cache to prevent
        // duplicate work in the same turn only. Note, if this was a notification
        // of a change already set to a path (isPathNotification: true),
        // we always let the change through and skip the `set` since it was
        // already dirty checked at the point of entry and the underlying
        // object has already been updated
        if (!isPathNotification) {
          let old = get(this, path);
          path = /** @type {string} */set(this, path, value); // Use property-accessor's simpler dirty check

          if (!path || !super._shouldPropertyChange(path, value, old)) {
            return false;
          }
        }

        this.__dataHasPaths = true;

        if (this._setPendingProperty( /**@type{string}*/path, value, shouldNotify)) {
          computeLinkedPaths(this, path, value);
          return true;
        }
      } else {
        if (this.__dataHasAccessor && this.__dataHasAccessor[path]) {
          return this._setPendingProperty( /**@type{string}*/path, value, shouldNotify);
        } else {
          this[path] = value;
        }
      }

      return false;
    } /**
       * Applies a value to a non-Polymer element/node's property.
       *
       * The implementation makes a best-effort at binding interop:
       * Some native element properties have side-effects when
       * re-setting the same value (e.g. setting `<input>.value` resets the
       * cursor position), so we do a dirty-check before setting the value.
       * However, for better interop with non-Polymer custom elements that
       * accept objects, we explicitly re-set object changes coming from the
       * Polymer world (which may include deep object changes without the
       * top reference changing), erring on the side of providing more
       * information.
       *
       * Users may override this method to provide alternate approaches.
       *
       * @param {!Node} node The node to set a property on
       * @param {string} prop The property to set
       * @param {*} value The value to set
       * @return {void}
       * @protected
       */

    _setUnmanagedPropertyToNode(node, prop, value) {
      // It is a judgment call that resetting primitives is
      // "bad" and resettings objects is also "good"; alternatively we could
      // implement a whitelist of tag & property values that should never
      // be reset (e.g. <input>.value && <select>.value)
      if (value !== node[prop] || typeof value == 'object') {
        node[prop] = value;
      }
    } /**
       * Overrides the `PropertiesChanged` implementation to introduce special
       * dirty check logic depending on the property & value being set:
       *
       * 1. Any value set to a path (e.g. 'obj.prop': 42 or 'obj.prop': {...})
       *    Stored in `__dataTemp`, dirty checked against `__dataTemp`
       * 2. Object set to simple property (e.g. 'prop': {...})
       *    Stored in `__dataTemp` and `__data`, dirty checked against
       *    `__dataTemp` by default implementation of `_shouldPropertyChange`
       * 3. Primitive value set to simple property (e.g. 'prop': 42)
       *    Stored in `__data`, dirty checked against `__data`
       *
       * The dirty-check is important to prevent cycles due to two-way
       * notification, but paths and objects are only dirty checked against any
       * previous value set during this turn via a "temporary cache" that is
       * cleared when the last `_propertiesChanged` exits. This is so:
       * a. any cached array paths (e.g. 'array.3.prop') may be invalidated
       *    due to array mutations like shift/unshift/splice; this is fine
       *    since path changes are dirty-checked at user entry points like `set`
       * b. dirty-checking for objects only lasts one turn to allow the user
       *    to mutate the object in-place and re-set it with the same identity
       *    and have all sub-properties re-propagated in a subsequent turn.
       *
       * The temp cache is not necessarily sufficient to prevent invalid array
       * paths, since a splice can happen during the same turn (with pathological
       * user code); we could introduce a "fixup" for temporarily cached array
       * paths if needed: https://github.com/Polymer/polymer/issues/4227
       *
       * @override
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @param {boolean=} shouldNotify True if property should fire notification
       *   event (applies only for `notify: true` properties)
       * @return {boolean} Returns true if the property changed
       */

    _setPendingProperty(property, value, shouldNotify) {
      let isPath$$1 = this.__dataHasPaths && isPath(property);
      let prevProps = isPath$$1 ? this.__dataTemp : this.__data;

      if (this._shouldPropertyChange(property, value, prevProps[property])) {
        if (!this.__dataPending) {
          this.__dataPending = {};
          this.__dataOld = {};
        } // Ensure old is captured from the last turn


        if (!(property in this.__dataOld)) {
          this.__dataOld[property] = this.__data[property];
        } // Paths are stored in temporary cache (cleared at end of turn),
        // which is used for dirty-checking, all others stored in __data


        if (isPath$$1) {
          this.__dataTemp[property] = value;
        } else {
          this.__data[property] = value;
        } // All changes go into pending property bag, passed to _propertiesChanged


        this.__dataPending[property] = value; // Track properties that should notify separately

        if (isPath$$1 || this[TYPES.NOTIFY] && this[TYPES.NOTIFY][property]) {
          this.__dataToNotify = this.__dataToNotify || {};
          this.__dataToNotify[property] = shouldNotify;
        }

        return true;
      }

      return false;
    } /**
       * Overrides base implementation to ensure all accessors set `shouldNotify`
       * to true, for per-property notification tracking.
       *
       * @override
       * @param {string} property Name of the property
       * @param {*} value Value to set
       * @return {void}
       */

    _setProperty(property, value) {
      if (this._setPendingProperty(property, value, true)) {
        this._invalidateProperties();
      }
    } /**
       * Overrides `PropertyAccessor`'s default async queuing of
       * `_propertiesChanged`: if `__dataReady` is false (has not yet been
       * manually flushed), the function no-ops; otherwise flushes
       * `_propertiesChanged` synchronously.
       *
       * @override
       * @return {void}
       */

    _invalidateProperties() {
      if (this.__dataReady) {
        this._flushProperties();
      }
    } /**
       * Enqueues the given client on a list of pending clients, whose
       * pending property changes can later be flushed via a call to
       * `_flushClients`.
       *
       * @param {Object} client PropertyEffects client to enqueue
       * @return {void}
       * @protected
       */

    _enqueueClient(client) {
      this.__dataPendingClients = this.__dataPendingClients || [];

      if (client !== this) {
        this.__dataPendingClients.push(client);
      }
    } /**
       * Overrides superclass implementation.
       *
       * @return {void}
       * @protected
       */

    _flushProperties() {
      this.__dataCounter++;

      super._flushProperties();

      this.__dataCounter--;
    } /**
       * Flushes any clients previously enqueued via `_enqueueClient`, causing
       * their `_flushProperties` method to run.
       *
       * @return {void}
       * @protected
       */

    _flushClients() {
      if (!this.__dataClientsReady) {
        this.__dataClientsReady = true;

        this._readyClients(); // Override point where accessors are turned on; importantly,
        // this is after clients have fully readied, providing a guarantee
        // that any property effects occur only after all clients are ready.


        this.__dataReady = true;
      } else {
        this.__enableOrFlushClients();
      }
    } // NOTE: We ensure clients either enable or flush as appropriate. This
    // handles two corner cases:
    // (1) clients flush properly when connected/enabled before the host
    // enables; e.g.
    //   (a) Templatize stamps with no properties and does not flush and
    //   (b) the instance is inserted into dom and
    //   (c) then the instance flushes.
    // (2) clients enable properly when not connected/enabled when the host
    // flushes; e.g.
    //   (a) a template is runtime stamped and not yet connected/enabled
    //   (b) a host sets a property, causing stamped dom to flush
    //   (c) the stamped dom enables.


    __enableOrFlushClients() {
      let clients = this.__dataPendingClients;

      if (clients) {
        this.__dataPendingClients = null;

        for (let i = 0; i < clients.length; i++) {
          let client = clients[i];

          if (!client.__dataEnabled) {
            client._enableProperties();
          } else if (client.__dataPending) {
            client._flushProperties();
          }
        }
      }
    } /**
       * Perform any initial setup on client dom. Called before the first
       * `_flushProperties` call on client dom and before any element
       * observers are called.
       *
       * @return {void}
       * @protected
       */

    _readyClients() {
      this.__enableOrFlushClients();
    } /**
       * Sets a bag of property changes to this instance, and
       * synchronously processes all effects of the properties as a batch.
       *
       * Property names must be simple properties, not paths.  Batched
       * path propagation is not supported.
       *
       * @param {Object} props Bag of one or more key-value pairs whose key is
       *   a property and value is the new value to set for that property.
       * @param {boolean=} setReadOnly When true, any private values set in
       *   `props` will be set. By default, `setProperties` will not set
       *   `readOnly: true` root properties.
       * @return {void}
       * @public
       */

    setProperties(props, setReadOnly) {
      for (let path in props) {
        if (setReadOnly || !this[TYPES.READ_ONLY] || !this[TYPES.READ_ONLY][path]) {
          //TODO(kschaaf): explicitly disallow paths in setProperty?
          // wildcard observers currently only pass the first changed path
          // in the `info` object, and you could do some odd things batching
          // paths, e.g. {'foo.bar': {...}, 'foo': null}
          this._setPendingPropertyOrPath(path, props[path], true);
        }
      }

      this._invalidateProperties();
    } /**
       * Overrides `PropertyAccessors` so that property accessor
       * side effects are not enabled until after client dom is fully ready.
       * Also calls `_flushClients` callback to ensure client dom is enabled
       * that was not enabled as a result of flushing properties.
       *
       * @override
       * @return {void}
       */

    ready() {
      // It is important that `super.ready()` is not called here as it
      // immediately turns on accessors. Instead, we wait until `readyClients`
      // to enable accessors to provide a guarantee that clients are ready
      // before processing any accessors side effects.
      this._flushProperties(); // If no data was pending, `_flushProperties` will not `flushClients`
      // so ensure this is done.


      if (!this.__dataClientsReady) {
        this._flushClients();
      } // Before ready, client notifications do not trigger _flushProperties.
      // Therefore a flush is necessary here if data has been set.


      if (this.__dataPending) {
        this._flushProperties();
      }
    } /**
       * Implements `PropertyAccessors`'s properties changed callback.
       *
       * Runs each class of effects for the batch of changed properties in
       * a specific order (compute, propagate, reflect, observe, notify).
       *
       * @param {!Object} currentProps Bag of all current accessor values
       * @param {?Object} changedProps Bag of properties changed since the last
       *   call to `_propertiesChanged`
       * @param {?Object} oldProps Bag of previous values for each property
       *   in `changedProps`
       * @return {void}
       */

    _propertiesChanged(currentProps, changedProps, oldProps) {
      // ----------------------------
      // let c = Object.getOwnPropertyNames(changedProps || {});
      // window.debug && console.group(this.localName + '#' + this.id + ': ' + c);
      // if (window.debug) { debugger; }
      // ----------------------------
      let hasPaths = this.__dataHasPaths;
      this.__dataHasPaths = false; // Compute properties

      runComputedEffects(this, changedProps, oldProps, hasPaths); // Clear notify properties prior to possible reentry (propagate, observe),
      // but after computing effects have a chance to add to them

      let notifyProps = this.__dataToNotify;
      this.__dataToNotify = null; // Propagate properties to clients

      this._propagatePropertyChanges(changedProps, oldProps, hasPaths); // Flush clients


      this._flushClients(); // Reflect properties


      runEffects(this, this[TYPES.REFLECT], changedProps, oldProps, hasPaths); // Observe properties

      runEffects(this, this[TYPES.OBSERVE], changedProps, oldProps, hasPaths); // Notify properties to host

      if (notifyProps) {
        runNotifyEffects(this, notifyProps, changedProps, oldProps, hasPaths);
      } // Clear temporary cache at end of turn


      if (this.__dataCounter == 1) {
        this.__dataTemp = {};
      } // ----------------------------
      // window.debug && console.groupEnd(this.localName + '#' + this.id + ': ' + c);
      // ----------------------------

    } /**
       * Called to propagate any property changes to stamped template nodes
       * managed by this element.
       *
       * @param {Object} changedProps Bag of changed properties
       * @param {Object} oldProps Bag of previous values for changed properties
       * @param {boolean} hasPaths True with `props` contains one or more paths
       * @return {void}
       * @protected
       */

    _propagatePropertyChanges(changedProps, oldProps, hasPaths) {
      if (this[TYPES.PROPAGATE]) {
        runEffects(this, this[TYPES.PROPAGATE], changedProps, oldProps, hasPaths);
      }

      let templateInfo = this.__templateInfo;

      while (templateInfo) {
        runEffects(this, templateInfo.propertyEffects, changedProps, oldProps, hasPaths, templateInfo.nodeList);
        templateInfo = templateInfo.nextTemplateInfo;
      }
    } /**
       * Aliases one data path as another, such that path notifications from one
       * are routed to the other.
       *
       * @param {string | !Array<string|number>} to Target path to link.
       * @param {string | !Array<string|number>} from Source path to link.
       * @return {void}
       * @public
       */

    linkPaths(to, from) {
      to = normalize(to);
      from = normalize(from);
      this.__dataLinkedPaths = this.__dataLinkedPaths || {};
      this.__dataLinkedPaths[to] = from;
    } /**
       * Removes a data path alias previously established with `_linkPaths`.
       *
       * Note, the path to unlink should be the target (`to`) used when
       * linking the paths.
       *
       * @param {string | !Array<string|number>} path Target path to unlink.
       * @return {void}
       * @public
       */

    unlinkPaths(path) {
      path = normalize(path);

      if (this.__dataLinkedPaths) {
        delete this.__dataLinkedPaths[path];
      }
    } /**
       * Notify that an array has changed.
       *
       * Example:
       *
       *     this.items = [ {name: 'Jim'}, {name: 'Todd'}, {name: 'Bill'} ];
       *     ...
       *     this.items.splice(1, 1, {name: 'Sam'});
       *     this.items.push({name: 'Bob'});
       *     this.notifySplices('items', [
       *       { index: 1, removed: [{name: 'Todd'}], addedCount: 1, object: this.items, type: 'splice' },
       *       { index: 3, removed: [], addedCount: 1, object: this.items, type: 'splice'}
       *     ]);
       *
       * @param {string} path Path that should be notified.
       * @param {Array} splices Array of splice records indicating ordered
       *   changes that occurred to the array. Each record should have the
       *   following fields:
       *    * index: index at which the change occurred
       *    * removed: array of items that were removed from this index
       *    * addedCount: number of new items added at this index
       *    * object: a reference to the array in question
       *    * type: the string literal 'splice'
       *
       *   Note that splice records _must_ be normalized such that they are
       *   reported in index order (raw results from `Object.observe` are not
       *   ordered and must be normalized/merged before notifying).
       * @return {void}
       * @public
      */

    notifySplices(path, splices) {
      let info = {
        path: ''
      };
      let array = /** @type {Array} */get(this, path, info);
      notifySplices(this, array, info.path, splices);
    } /**
       * Convenience method for reading a value from a path.
       *
       * Note, if any part in the path is undefined, this method returns
       * `undefined` (this method does not throw when dereferencing undefined
       * paths).
       *
       * @param {(string|!Array<(string|number)>)} path Path to the value
       *   to read.  The path may be specified as a string (e.g. `foo.bar.baz`)
       *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
       *   bracketed expressions are not supported; string-based path parts
       *   *must* be separated by dots.  Note that when dereferencing array
       *   indices, the index may be used as a dotted part directly
       *   (e.g. `users.12.name` or `['users', 12, 'name']`).
       * @param {Object=} root Root object from which the path is evaluated.
       * @return {*} Value at the path, or `undefined` if any part of the path
       *   is undefined.
       * @public
       */

    get(path, root$$1) {
      return get(root$$1 || this, path);
    } /**
       * Convenience method for setting a value to a path and notifying any
       * elements bound to the same path.
       *
       * Note, if any part in the path except for the last is undefined,
       * this method does nothing (this method does not throw when
       * dereferencing undefined paths).
       *
       * @param {(string|!Array<(string|number)>)} path Path to the value
       *   to write.  The path may be specified as a string (e.g. `'foo.bar.baz'`)
       *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
       *   bracketed expressions are not supported; string-based path parts
       *   *must* be separated by dots.  Note that when dereferencing array
       *   indices, the index may be used as a dotted part directly
       *   (e.g. `'users.12.name'` or `['users', 12, 'name']`).
       * @param {*} value Value to set at the specified path.
       * @param {Object=} root Root object from which the path is evaluated.
       *   When specified, no notification will occur.
       * @return {void}
       * @public
      */

    set(path, value, root$$1) {
      if (root$$1) {
        set(root$$1, path, value);
      } else {
        if (!this[TYPES.READ_ONLY] || !this[TYPES.READ_ONLY][/** @type {string} */path]) {
          if (this._setPendingPropertyOrPath(path, value, true)) {
            this._invalidateProperties();
          }
        }
      }
    } /**
       * Adds items onto the end of the array at the path specified.
       *
       * The arguments after `path` and return value match that of
       * `Array.prototype.push`.
       *
       * This method notifies other paths to the same array that a
       * splice occurred to the array.
       *
       * @param {string | !Array<string|number>} path Path to array.
       * @param {...*} items Items to push onto array
       * @return {number} New length of the array.
       * @public
       */

    push(path, ...items) {
      let info = {
        path: ''
      };
      let array = /** @type {Array}*/get(this, path, info);
      let len = array.length;
      let ret = array.push(...items);

      if (items.length) {
        notifySplice(this, array, info.path, len, items.length, []);
      }

      return ret;
    } /**
       * Removes an item from the end of array at the path specified.
       *
       * The arguments after `path` and return value match that of
       * `Array.prototype.pop`.
       *
       * This method notifies other paths to the same array that a
       * splice occurred to the array.
       *
       * @param {string | !Array<string|number>} path Path to array.
       * @return {*} Item that was removed.
       * @public
       */

    pop(path) {
      let info = {
        path: ''
      };
      let array = /** @type {Array} */get(this, path, info);
      let hadLength = Boolean(array.length);
      let ret = array.pop();

      if (hadLength) {
        notifySplice(this, array, info.path, array.length, 0, [ret]);
      }

      return ret;
    } /**
       * Starting from the start index specified, removes 0 or more items
       * from the array and inserts 0 or more new items in their place.
       *
       * The arguments after `path` and return value match that of
       * `Array.prototype.splice`.
       *
       * This method notifies other paths to the same array that a
       * splice occurred to the array.
       *
       * @param {string | !Array<string|number>} path Path to array.
       * @param {number} start Index from which to start removing/inserting.
       * @param {number} deleteCount Number of items to remove.
       * @param {...*} items Items to insert into array.
       * @return {Array} Array of removed items.
       * @public
       */

    splice(path, start, deleteCount, ...items) {
      let info = {
        path: ''
      };
      let array = /** @type {Array} */get(this, path, info); // Normalize fancy native splice handling of crazy start values

      if (start < 0) {
        start = array.length - Math.floor(-start);
      } else if (start) {
        start = Math.floor(start);
      } // array.splice does different things based on the number of arguments
      // you pass in. Therefore, array.splice(0) and array.splice(0, undefined)
      // do different things. In the former, the whole array is cleared. In the
      // latter, no items are removed.
      // This means that we need to detect whether 1. one of the arguments
      // is actually passed in and then 2. determine how many arguments
      // we should pass on to the native array.splice
      //


      let ret; // Omit any additional arguments if they were not passed in

      if (arguments.length === 2) {
        ret = array.splice(start); // Either start was undefined and the others were defined, but in this
        // case we can safely pass on all arguments
        //
        // Note: this includes the case where none of the arguments were passed in,
        // e.g. this.splice('array'). However, if both start and deleteCount
        // are undefined, array.splice will not modify the array (as expected)
      } else {
        ret = array.splice(start, deleteCount, ...items);
      } // At the end, check whether any items were passed in (e.g. insertions)
      // or if the return array contains items (e.g. deletions).
      // Only notify if items were added or deleted.


      if (items.length || ret.length) {
        notifySplice(this, array, info.path, start, items.length, ret);
      }

      return ret;
    } /**
       * Removes an item from the beginning of array at the path specified.
       *
       * The arguments after `path` and return value match that of
       * `Array.prototype.pop`.
       *
       * This method notifies other paths to the same array that a
       * splice occurred to the array.
       *
       * @param {string | !Array<string|number>} path Path to array.
       * @return {*} Item that was removed.
       * @public
       */

    shift(path) {
      let info = {
        path: ''
      };
      let array = /** @type {Array} */get(this, path, info);
      let hadLength = Boolean(array.length);
      let ret = array.shift();

      if (hadLength) {
        notifySplice(this, array, info.path, 0, 0, [ret]);
      }

      return ret;
    } /**
       * Adds items onto the beginning of the array at the path specified.
       *
       * The arguments after `path` and return value match that of
       * `Array.prototype.push`.
       *
       * This method notifies other paths to the same array that a
       * splice occurred to the array.
       *
       * @param {string | !Array<string|number>} path Path to array.
       * @param {...*} items Items to insert info array
       * @return {number} New length of the array.
       * @public
       */

    unshift(path, ...items) {
      let info = {
        path: ''
      };
      let array = /** @type {Array} */get(this, path, info);
      let ret = array.unshift(...items);

      if (items.length) {
        notifySplice(this, array, info.path, 0, items.length, []);
      }

      return ret;
    } /**
       * Notify that a path has changed.
       *
       * Example:
       *
       *     this.item.user.name = 'Bob';
       *     this.notifyPath('item.user.name');
       *
       * @param {string} path Path that should be notified.
       * @param {*=} value Value at the path (optional).
       * @return {void}
       * @public
      */

    notifyPath(path, value) {
      /** @type {string} */let propPath;

      if (arguments.length == 1) {
        // Get value if not supplied
        let info = {
          path: ''
        };
        value = get(this, path, info);
        propPath = info.path;
      } else if (Array.isArray(path)) {
        // Normalize path if needed
        propPath = normalize(path);
      } else {
        propPath = /** @type{string} */path;
      }

      if (this._setPendingPropertyOrPath(propPath, value, true, true)) {
        this._invalidateProperties();
      }
    } /**
       * Equivalent to static `createReadOnlyProperty` API but can be called on
       * an instance to add effects at runtime.  See that method for
       * full API docs.
       *
       * @param {string} property Property name
       * @param {boolean=} protectedSetter Creates a custom protected setter
       *   when `true`.
       * @return {void}
       * @protected
       */

    _createReadOnlyProperty(property, protectedSetter) {
      this._addPropertyEffect(property, TYPES.READ_ONLY);

      if (protectedSetter) {
        this['_set' + upper(property)] = /** @this {PropertyEffects} */function (value) {
          this._setProperty(property, value);
        };
      }
    } /**
       * Equivalent to static `createPropertyObserver` API but can be called on
       * an instance to add effects at runtime.  See that method for
       * full API docs.
       *
       * @param {string} property Property name
       * @param {string|function(*,*)} method Function or name of observer method to call
       * @param {boolean=} dynamicFn Whether the method name should be included as
       *   a dependency to the effect.
       * @return {void}
       * @protected
       */

    _createPropertyObserver(property, method, dynamicFn) {
      let info = {
        property,
        method,
        dynamicFn: Boolean(dynamicFn)
      };

      this._addPropertyEffect(property, TYPES.OBSERVE, {
        fn: runObserverEffect,
        info,
        trigger: {
          name: property
        }
      });

      if (dynamicFn) {
        this._addPropertyEffect( /** @type {string} */method, TYPES.OBSERVE, {
          fn: runObserverEffect,
          info,
          trigger: {
            name: method
          }
        });
      }
    } /**
       * Equivalent to static `createMethodObserver` API but can be called on
       * an instance to add effects at runtime.  See that method for
       * full API docs.
       *
       * @param {string} expression Method expression
       * @param {boolean|Object=} dynamicFn Boolean or object map indicating
       *   whether method names should be included as a dependency to the effect.
       * @return {void}
       * @protected
       */

    _createMethodObserver(expression, dynamicFn) {
      let sig = parseMethod(expression);

      if (!sig) {
        throw new Error("Malformed observer expression '" + expression + "'");
      }

      createMethodEffect(this, sig, TYPES.OBSERVE, runMethodEffect, null, dynamicFn);
    } /**
       * Equivalent to static `createNotifyingProperty` API but can be called on
       * an instance to add effects at runtime.  See that method for
       * full API docs.
       *
       * @param {string} property Property name
       * @return {void}
       * @protected
       */

    _createNotifyingProperty(property) {
      this._addPropertyEffect(property, TYPES.NOTIFY, {
        fn: runNotifyEffect,
        info: {
          eventName: CaseMap.camelToDashCase(property) + '-changed',
          property: property
        }
      });
    } /**
       * Equivalent to static `createReflectedProperty` API but can be called on
       * an instance to add effects at runtime.  See that method for
       * full API docs.
       *
       * @param {string} property Property name
       * @return {void}
       * @protected
       */

    _createReflectedProperty(property) {
      let attr = this.constructor.attributeNameForProperty(property);

      if (attr[0] === '-') {
        console.warn('Property ' + property + ' cannot be reflected to attribute ' + attr + ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.');
      } else {
        this._addPropertyEffect(property, TYPES.REFLECT, {
          fn: runReflectEffect,
          info: {
            attrName: attr
          }
        });
      }
    } /**
       * Equivalent to static `createComputedProperty` API but can be called on
       * an instance to add effects at runtime.  See that method for
       * full API docs.
       *
       * @param {string} property Name of computed property to set
       * @param {string} expression Method expression
       * @param {boolean|Object=} dynamicFn Boolean or object map indicating
       *   whether method names should be included as a dependency to the effect.
       * @return {void}
       * @protected
       */

    _createComputedProperty(property, expression, dynamicFn) {
      let sig = parseMethod(expression);

      if (!sig) {
        throw new Error("Malformed computed expression '" + expression + "'");
      }

      createMethodEffect(this, sig, TYPES.COMPUTE, runComputedEffect, property, dynamicFn);
    } // -- static class methods ------------
    /**
     * Ensures an accessor exists for the specified property, and adds
     * to a list of "property effects" that will run when the accessor for
     * the specified property is set.  Effects are grouped by "type", which
     * roughly corresponds to a phase in effect processing.  The effect
     * metadata should be in the following form:
     *
     *     {
     *       fn: effectFunction, // Reference to function to call to perform effect
     *       info: { ... }       // Effect metadata passed to function
     *       trigger: {          // Optional triggering metadata; if not provided
     *         name: string      // the property is treated as a wildcard
     *         structured: boolean
     *         wildcard: boolean
     *       }
     *     }
     *
     * Effects are called from `_propertiesChanged` in the following order by
     * type:
     *
     * 1. COMPUTE
     * 2. PROPAGATE
     * 3. REFLECT
     * 4. OBSERVE
     * 5. NOTIFY
     *
     * Effect functions are called with the following signature:
     *
     *     effectFunction(inst, path, props, oldProps, info, hasPaths)
     *
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     */

    static addPropertyEffect(property, type, effect) {
      this.prototype._addPropertyEffect(property, type, effect);
    } /**
       * Creates a single-property observer for the given property.
       *
       * @param {string} property Property name
       * @param {string|function(*,*)} method Function or name of observer method to call
       * @param {boolean=} dynamicFn Whether the method name should be included as
       *   a dependency to the effect.
       * @return {void}
       * @protected
       */

    static createPropertyObserver(property, method, dynamicFn) {
      this.prototype._createPropertyObserver(property, method, dynamicFn);
    } /**
       * Creates a multi-property "method observer" based on the provided
       * expression, which should be a string in the form of a normal JavaScript
       * function signature: `'methodName(arg1, [..., argn])'`.  Each argument
       * should correspond to a property or path in the context of this
       * prototype (or instance), or may be a literal string or number.
       *
       * @param {string} expression Method expression
       * @param {boolean|Object=} dynamicFn Boolean or object map indicating
       * @return {void}
       *   whether method names should be included as a dependency to the effect.
       * @protected
       */

    static createMethodObserver(expression, dynamicFn) {
      this.prototype._createMethodObserver(expression, dynamicFn);
    } /**
       * Causes the setter for the given property to dispatch `<property>-changed`
       * events to notify of changes to the property.
       *
       * @param {string} property Property name
       * @return {void}
       * @protected
       */

    static createNotifyingProperty(property) {
      this.prototype._createNotifyingProperty(property);
    } /**
       * Creates a read-only accessor for the given property.
       *
       * To set the property, use the protected `_setProperty` API.
       * To create a custom protected setter (e.g. `_setMyProp()` for
       * property `myProp`), pass `true` for `protectedSetter`.
       *
       * Note, if the property will have other property effects, this method
       * should be called first, before adding other effects.
       *
       * @param {string} property Property name
       * @param {boolean=} protectedSetter Creates a custom protected setter
       *   when `true`.
       * @return {void}
       * @protected
       */

    static createReadOnlyProperty(property, protectedSetter) {
      this.prototype._createReadOnlyProperty(property, protectedSetter);
    } /**
       * Causes the setter for the given property to reflect the property value
       * to a (dash-cased) attribute of the same name.
       *
       * @param {string} property Property name
       * @return {void}
       * @protected
       */

    static createReflectedProperty(property) {
      this.prototype._createReflectedProperty(property);
    } /**
       * Creates a computed property whose value is set to the result of the
       * method described by the given `expression` each time one or more
       * arguments to the method changes.  The expression should be a string
       * in the form of a normal JavaScript function signature:
       * `'methodName(arg1, [..., argn])'`
       *
       * @param {string} property Name of computed property to set
       * @param {string} expression Method expression
       * @param {boolean|Object=} dynamicFn Boolean or object map indicating whether
       *   method names should be included as a dependency to the effect.
       * @return {void}
       * @protected
       */

    static createComputedProperty(property, expression, dynamicFn) {
      this.prototype._createComputedProperty(property, expression, dynamicFn);
    } /**
       * Parses the provided template to ensure binding effects are created
       * for them, and then ensures property accessors are created for any
       * dependent properties in the template.  Binding effects for bound
       * templates are stored in a linked list on the instance so that
       * templates can be efficiently stamped and unstamped.
       *
       * @param {!HTMLTemplateElement} template Template containing binding
       *   bindings
       * @return {!TemplateInfo} Template metadata object
       * @protected
       */

    static bindTemplate(template) {
      return this.prototype._bindTemplate(template);
    } // -- binding ----------------------------------------------
    /**
     * Equivalent to static `bindTemplate` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * This method may be called on the prototype (for prototypical template
     * binding, to avoid creating accessors every instance) once per prototype,
     * and will be called with `runtimeBinding: true` by `_stampTemplate` to
     * create and link an instance of the template metadata associated with a
     * particular stamping.
     *
     * @param {!HTMLTemplateElement} template Template containing binding
     *   bindings
     * @param {boolean=} instanceBinding When false (default), performs
     *   "prototypical" binding of the template and overwrites any previously
     *   bound template for the class. When true (as passed from
     *   `_stampTemplate`), the template info is instanced and linked into
     *   the list of bound templates.
     * @return {!TemplateInfo} Template metadata object; for `runtimeBinding`,
     *   this is an instance of the prototypical template info
     * @protected
     */

    _bindTemplate(template, instanceBinding) {
      let templateInfo = this.constructor._parseTemplate(template);

      let wasPreBound = this.__templateInfo == templateInfo; // Optimization: since this is called twice for proto-bound templates,
      // don't attempt to recreate accessors if this template was pre-bound

      if (!wasPreBound) {
        for (let prop in templateInfo.propertyEffects) {
          this._createPropertyAccessor(prop);
        }
      }

      if (instanceBinding) {
        // For instance-time binding, create instance of template metadata
        // and link into list of templates if necessary
        templateInfo = /** @type {!TemplateInfo} */Object.create(templateInfo);
        templateInfo.wasPreBound = wasPreBound;

        if (!wasPreBound && this.__templateInfo) {
          let last = this.__templateInfoLast || this.__templateInfo;
          this.__templateInfoLast = last.nextTemplateInfo = templateInfo;
          templateInfo.previousTemplateInfo = last;
          return templateInfo;
        }
      }

      return this.__templateInfo = templateInfo;
    } /**
       * Adds a property effect to the given template metadata, which is run
       * at the "propagate" stage of `_propertiesChanged` when the template
       * has been bound to the element via `_bindTemplate`.
       *
       * The `effect` object should match the format in `_addPropertyEffect`.
       *
       * @param {Object} templateInfo Template metadata to add effect to
       * @param {string} prop Property that should trigger the effect
       * @param {Object=} effect Effect metadata object
       * @return {void}
       * @protected
       */

    static _addTemplatePropertyEffect(templateInfo, prop, effect) {
      let hostProps = templateInfo.hostProps = templateInfo.hostProps || {};
      hostProps[prop] = true;
      let effects = templateInfo.propertyEffects = templateInfo.propertyEffects || {};
      let propEffects = effects[prop] = effects[prop] || [];
      propEffects.push(effect);
    } /**
       * Stamps the provided template and performs instance-time setup for
       * Polymer template features, including data bindings, declarative event
       * listeners, and the `this.$` map of `id`'s to nodes.  A document fragment
       * is returned containing the stamped DOM, ready for insertion into the
       * DOM.
       *
       * This method may be called more than once; however note that due to
       * `shadycss` polyfill limitations, only styles from templates prepared
       * using `ShadyCSS.prepareTemplate` will be correctly polyfilled (scoped
       * to the shadow root and support CSS custom properties), and note that
       * `ShadyCSS.prepareTemplate` may only be called once per element. As such,
       * any styles required by in runtime-stamped templates must be included
       * in the main element template.
       *
       * @param {!HTMLTemplateElement} template Template to stamp
       * @return {!StampedTemplate} Cloned template content
       * @override
       * @protected
       */

    _stampTemplate(template) {
      // Ensures that created dom is `_enqueueClient`'d to this element so
      // that it can be flushed on next call to `_flushProperties`
      hostStack.beginHosting(this);

      let dom = super._stampTemplate(template);

      hostStack.endHosting(this);

      let templateInfo = /** @type {!TemplateInfo} */this._bindTemplate(template, true); // Add template-instance-specific data to instanced templateInfo


      templateInfo.nodeList = dom.nodeList; // Capture child nodes to allow unstamping of non-prototypical templates

      if (!templateInfo.wasPreBound) {
        let nodes = templateInfo.childNodes = [];

        for (let n = dom.firstChild; n; n = n.nextSibling) {
          nodes.push(n);
        }
      }

      dom.templateInfo = templateInfo; // Setup compound storage, 2-way listeners, and dataHost for bindings

      setupBindings(this, templateInfo); // Flush properties into template nodes if already booted

      if (this.__dataReady) {
        runEffects(this, templateInfo.propertyEffects, this.__data, null, false, templateInfo.nodeList);
      }

      return dom;
    } /**
       * Removes and unbinds the nodes previously contained in the provided
       * DocumentFragment returned from `_stampTemplate`.
       *
       * @param {!StampedTemplate} dom DocumentFragment previously returned
       *   from `_stampTemplate` associated with the nodes to be removed
       * @return {void}
       * @protected
       */

    _removeBoundDom(dom) {
      // Unlink template info
      let templateInfo = dom.templateInfo;

      if (templateInfo.previousTemplateInfo) {
        templateInfo.previousTemplateInfo.nextTemplateInfo = templateInfo.nextTemplateInfo;
      }

      if (templateInfo.nextTemplateInfo) {
        templateInfo.nextTemplateInfo.previousTemplateInfo = templateInfo.previousTemplateInfo;
      }

      if (this.__templateInfoLast == templateInfo) {
        this.__templateInfoLast = templateInfo.previousTemplateInfo;
      }

      templateInfo.previousTemplateInfo = templateInfo.nextTemplateInfo = null; // Remove stamped nodes

      let nodes = templateInfo.childNodes;

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.parentNode.removeChild(node);
      }
    } /**
       * Overrides default `TemplateStamp` implementation to add support for
       * parsing bindings from `TextNode`'s' `textContent`.  A `bindings`
       * array is added to `nodeInfo` and populated with binding metadata
       * with information capturing the binding target, and a `parts` array
       * with one or more metadata objects capturing the source(s) of the
       * binding.
       *
       * @override
       * @param {Node} node Node to parse
       * @param {TemplateInfo} templateInfo Template metadata for current template
       * @param {NodeInfo} nodeInfo Node metadata for current template node
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @protected
       * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
       */

    static _parseTemplateNode(node, templateInfo, nodeInfo) {
      let noted = super._parseTemplateNode(node, templateInfo, nodeInfo);

      if (node.nodeType === Node.TEXT_NODE) {
        let parts = this._parseBindings(node.textContent, templateInfo);

        if (parts) {
          // Initialize the textContent with any literal parts
          // NOTE: default to a space here so the textNode remains; some browsers
          // (IE) omit an empty textNode following cloneNode/importNode.
          node.textContent = literalFromParts(parts) || ' ';
          addBinding(this, templateInfo, nodeInfo, 'text', 'textContent', parts);
          noted = true;
        }
      }

      return noted;
    } /**
       * Overrides default `TemplateStamp` implementation to add support for
       * parsing bindings from attributes.  A `bindings`
       * array is added to `nodeInfo` and populated with binding metadata
       * with information capturing the binding target, and a `parts` array
       * with one or more metadata objects capturing the source(s) of the
       * binding.
       *
       * @override
       * @param {Element} node Node to parse
       * @param {TemplateInfo} templateInfo Template metadata for current template
       * @param {NodeInfo} nodeInfo Node metadata for current template node
       * @param {string} name Attribute name
       * @param {string} value Attribute value
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @protected
       * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
       */

    static _parseTemplateNodeAttribute(node, templateInfo, nodeInfo, name, value) {
      let parts = this._parseBindings(value, templateInfo);

      if (parts) {
        // Attribute or property
        let origName = name;
        let kind = 'property'; // The only way we see a capital letter here is if the attr has
        // a capital letter in it per spec. In this case, to make sure
        // this binding works, we go ahead and make the binding to the attribute.

        if (capitalAttributeRegex.test(name)) {
          kind = 'attribute';
        } else if (name[name.length - 1] == '$') {
          name = name.slice(0, -1);
          kind = 'attribute';
        } // Initialize attribute bindings with any literal parts


        let literal = literalFromParts(parts);

        if (literal && kind == 'attribute') {
          node.setAttribute(name, literal);
        } // Clear attribute before removing, since IE won't allow removing
        // `value` attribute if it previously had a value (can't
        // unconditionally set '' before removing since attributes with `$`
        // can't be set using setAttribute)


        if (node.localName === 'input' && origName === 'value') {
          node.setAttribute(origName, '');
        } // Remove annotation


        node.removeAttribute(origName); // Case hackery: attributes are lower-case, but bind targets
        // (properties) are case sensitive. Gambit is to map dash-case to
        // camel-case: `foo-bar` becomes `fooBar`.
        // Attribute bindings are excepted.

        if (kind === 'property') {
          name = dashToCamelCase(name);
        }

        addBinding(this, templateInfo, nodeInfo, kind, name, parts, literal);
        return true;
      } else {
        return super._parseTemplateNodeAttribute(node, templateInfo, nodeInfo, name, value);
      }
    } /**
       * Overrides default `TemplateStamp` implementation to add support for
       * binding the properties that a nested template depends on to the template
       * as `_host_<property>`.
       *
       * @override
       * @param {Node} node Node to parse
       * @param {TemplateInfo} templateInfo Template metadata for current template
       * @param {NodeInfo} nodeInfo Node metadata for current template node
       * @return {boolean} `true` if the visited node added node-specific
       *   metadata to `nodeInfo`
       * @protected
       * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
       */

    static _parseTemplateNestedTemplate(node, templateInfo, nodeInfo) {
      let noted = super._parseTemplateNestedTemplate(node, templateInfo, nodeInfo); // Merge host props into outer template and add bindings


      let hostProps = nodeInfo.templateInfo.hostProps;
      let mode = '{';

      for (let source in hostProps) {
        let parts = [{
          mode,
          source,
          dependencies: [source]
        }];
        addBinding(this, templateInfo, nodeInfo, 'property', '_host_' + source, parts);
      }

      return noted;
    } /**
       * Called to parse text in a template (either attribute values or
       * textContent) into binding metadata.
       *
       * Any overrides of this method should return an array of binding part
       * metadata  representing one or more bindings found in the provided text
       * and any "literal" text in between.  Any non-literal parts will be passed
       * to `_evaluateBinding` when any dependencies change.  The only required
       * fields of each "part" in the returned array are as follows:
       *
       * - `dependencies` - Array containing trigger metadata for each property
       *   that should trigger the binding to update
       * - `literal` - String containing text if the part represents a literal;
       *   in this case no `dependencies` are needed
       *
       * Additional metadata for use by `_evaluateBinding` may be provided in
       * each part object as needed.
       *
       * The default implementation handles the following types of bindings
       * (one or more may be intermixed with literal strings):
       * - Property binding: `[[prop]]`
       * - Path binding: `[[object.prop]]`
       * - Negated property or path bindings: `[[!prop]]` or `[[!object.prop]]`
       * - Two-way property or path bindings (supports negation):
       *   `{{prop}}`, `{{object.prop}}`, `{{!prop}}` or `{{!object.prop}}`
       * - Inline computed method (supports negation):
       *   `[[compute(a, 'literal', b)]]`, `[[!compute(a, 'literal', b)]]`
       *
       * The default implementation uses a regular expression for best
       * performance. However, the regular expression uses a white-list of
       * allowed characters in a data-binding, which causes problems for
       * data-bindings that do use characters not in this white-list.
       *
       * Instead of updating the white-list with all allowed characters,
       * there is a StrictBindingParser (see lib/mixins/strict-binding-parser)
       * that uses a state machine instead. This state machine is able to handle
       * all characters. However, it is slightly less performant, therefore we
       * extracted it into a separate optional mixin.
       *
       * @param {string} text Text to parse from attribute or textContent
       * @param {Object} templateInfo Current template metadata
       * @return {Array<!BindingPart>} Array of binding part metadata
       * @protected
       */

    static _parseBindings(text, templateInfo) {
      let parts = [];
      let lastIndex = 0;
      let m; // Example: "literal1{{prop}}literal2[[!compute(foo,bar)]]final"
      // Regex matches:
      //        Iteration 1:  Iteration 2:
      // m[1]: '{{'          '[['
      // m[2]: ''            '!'
      // m[3]: 'prop'        'compute(foo,bar)'

      while ((m = bindingRegex.exec(text)) !== null) {
        // Add literal part
        if (m.index > lastIndex) {
          parts.push({
            literal: text.slice(lastIndex, m.index)
          });
        } // Add binding part


        let mode = m[1][0];
        let negate = Boolean(m[2]);
        let source = m[3].trim();
        let customEvent = false,
            notifyEvent = '',
            colon = -1;

        if (mode == '{' && (colon = source.indexOf('::')) > 0) {
          notifyEvent = source.substring(colon + 2);
          source = source.substring(0, colon);
          customEvent = true;
        }

        let signature = parseMethod(source);
        let dependencies = [];

        if (signature) {
          // Inline computed function
          let {
            args,
            methodName
          } = signature;

          for (let i = 0; i < args.length; i++) {
            let arg = args[i];

            if (!arg.literal) {
              dependencies.push(arg);
            }
          }

          let dynamicFns = templateInfo.dynamicFns;

          if (dynamicFns && dynamicFns[methodName] || signature.static) {
            dependencies.push(methodName);
            signature.dynamicFn = true;
          }
        } else {
          // Property or path
          dependencies.push(source);
        }

        parts.push({
          source,
          mode,
          negate,
          customEvent,
          signature,
          dependencies,
          event: notifyEvent
        });
        lastIndex = bindingRegex.lastIndex;
      } // Add a final literal part


      if (lastIndex && lastIndex < text.length) {
        let literal = text.substring(lastIndex);

        if (literal) {
          parts.push({
            literal: literal
          });
        }
      }

      if (parts.length) {
        return parts;
      } else {
        return null;
      }
    } /**
       * Called to evaluate a previously parsed binding part based on a set of
       * one or more changed dependencies.
       *
       * @param {this} inst Element that should be used as scope for
       *   binding dependencies
       * @param {BindingPart} part Binding part metadata
       * @param {string} path Property/path that triggered this effect
       * @param {Object} props Bag of current property changes
       * @param {Object} oldProps Bag of previous values for changed properties
       * @param {boolean} hasPaths True with `props` contains one or more paths
       * @return {*} Value the binding part evaluated to
       * @protected
       */

    static _evaluateBinding(inst, part, path, props, oldProps, hasPaths) {
      let value;

      if (part.signature) {
        value = runMethodEffect(inst, path, props, oldProps, part.signature);
      } else if (path != part.source) {
        value = get(inst, part.source);
      } else {
        if (hasPaths && isPath(path)) {
          value = get(inst, path);
        } else {
          value = inst.__data[path];
        }
      }

      if (part.negate) {
        value = !value;
      }

      return value;
    }

  } // make a typing for closure :P


  PropertyEffectsType = PropertyEffects;
  return PropertyEffects;
}); /**
     * Helper api for enqueuing client dom created by a host element.
     *
     * By default elements are flushed via `_flushProperties` when
     * `connectedCallback` is called. Elements attach their client dom to
     * themselves at `ready` time which results from this first flush.
     * This provides an ordering guarantee that the client dom an element
     * creates is flushed before the element itself (i.e. client `ready`
     * fires before host `ready`).
     *
     * However, if `_flushProperties` is called *before* an element is connected,
     * as for example `Templatize` does, this ordering guarantee cannot be
     * satisfied because no elements are connected. (Note: Bound elements that
     * receive data do become enqueued clients and are properly ordered but
     * unbound elements are not.)
     *
     * To maintain the desired "client before host" ordering guarantee for this
     * case we rely on the "host stack. Client nodes registers themselves with
     * the creating host element when created. This ensures that all client dom
     * is readied in the proper order, maintaining the desired guarantee.
     *
     * @private
     */

class HostStack {
  constructor() {
    this.stack = [];
  } /**
     * @param {*} inst Instance to add to hostStack
     * @return {void}
     */

  registerHost(inst) {
    if (this.stack.length) {
      let host = this.stack[this.stack.length - 1];

      host._enqueueClient(inst);
    }
  } /**
     * @param {*} inst Instance to begin hosting
     * @return {void}
     */

  beginHosting(inst) {
    this.stack.push(inst);
  } /**
     * @param {*} inst Instance to end hosting
     * @return {void}
     */

  endHosting(inst) {
    let stackLen = this.stack.length;

    if (stackLen && this.stack[stackLen - 1] == inst) {
      this.stack.pop();
    }
  }

}

const hostStack = new HostStack();
var propertyEffects = {
  PropertyEffects: PropertyEffects
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Creates a copy of `props` with each property normalized such that
       * upgraded it is an object with at least a type property { type: Type}.
       *
       * @param {Object} props Properties to normalize
       * @return {Object} Copy of input `props` with normalized properties that
       * are in the form {type: Type}
       * @private
       */

function normalizeProperties(props) {
  const output = {};

  for (let p in props) {
    const o = props[p];
    output[p] = typeof o === 'function' ? {
      type: o
    } : o;
  }

  return output;
} /**
   * Mixin that provides a minimal starting point to using the PropertiesChanged
   * mixin by providing a mechanism to declare properties in a static
   * getter (e.g. static get properties() { return { foo: String } }). Changes
   * are reported via the `_propertiesChanged` method.
   *
   * This mixin provides no specific support for rendering. Users are expected
   * to create a ShadowRoot and put content into it and update it in whatever
   * way makes sense. This can be done in reaction to properties changing by
   * implementing `_propertiesChanged`.
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin PropertiesChanged
   * @summary Mixin that provides a minimal starting point for using
   * the PropertiesChanged mixin by providing a declarative `properties` object.
   */

const PropertiesMixin = dedupingMixin(superClass => {
  /**
   * @constructor
   * @implements {Polymer_PropertiesChanged}
   * @private
   */const base = PropertiesChanged(superClass); /**
                                                  * Returns the super class constructor for the given class, if it is an
                                                  * instance of the PropertiesMixin.
                                                  *
                                                  * @param {!PropertiesMixinConstructor} constructor PropertiesMixin constructor
                                                  * @return {?PropertiesMixinConstructor} Super class constructor
                                                  */

  function superPropertiesClass(constructor) {
    const superCtor = Object.getPrototypeOf(constructor); // Note, the `PropertiesMixin` class below only refers to the class
    // generated by this call to the mixin; the instanceof test only works
    // because the mixin is deduped and guaranteed only to apply once, hence
    // all constructors in a proto chain will see the same `PropertiesMixin`

    return superCtor.prototype instanceof PropertiesMixin ? /** @type {!PropertiesMixinConstructor} */superCtor : null;
  } /**
     * Returns a memoized version of the `properties` object for the
     * given class. Properties not in object format are converted to at
     * least {type}.
     *
     * @param {PropertiesMixinConstructor} constructor PropertiesMixin constructor
     * @return {Object} Memoized properties object
     */

  function ownProperties(constructor) {
    if (!constructor.hasOwnProperty(JSCompiler_renameProperty('__ownProperties', constructor))) {
      let props = null;

      if (constructor.hasOwnProperty(JSCompiler_renameProperty('properties', constructor)) && constructor.properties) {
        props = normalizeProperties(constructor.properties);
      }

      constructor.__ownProperties = props;
    }

    return constructor.__ownProperties;
  } /**
     * @polymer
     * @mixinClass
     * @extends {base}
     * @implements {Polymer_PropertiesMixin}
     * @unrestricted
     */

  class PropertiesMixin extends base {
    /**
     * Implements standard custom elements getter to observes the attributes
     * listed in `properties`.
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     */static get observedAttributes() {
      const props = this._properties;
      return props ? Object.keys(props).map(p => this.attributeNameForProperty(p)) : [];
    } /**
       * Finalizes an element definition, including ensuring any super classes
       * are also finalized. This includes ensuring property
       * accessors exist on the element prototype. This method calls
       * `_finalizeClass` to finalize each constructor in the prototype chain.
       * @return {void}
       */

    static finalize() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('__finalized', this))) {
        const superCtor = superPropertiesClass( /** @type {!PropertiesMixinConstructor} */this);

        if (superCtor) {
          superCtor.finalize();
        }

        this.__finalized = true;

        this._finalizeClass();
      }
    } /**
       * Finalize an element class. This includes ensuring property
       * accessors exist on the element prototype. This method is called by
       * `finalize` and finalizes the class constructor.
       *
       * @protected
       */

    static _finalizeClass() {
      const props = ownProperties( /** @type {!PropertiesMixinConstructor} */this);

      if (props) {
        this.createProperties(props);
      }
    } /**
       * Returns a memoized version of all properties, including those inherited
       * from super classes. Properties not in object format are converted to
       * at least {type}.
       *
       * @return {Object} Object containing properties for this class
       * @protected
       */

    static get _properties() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('__properties', this))) {
        const superCtor = superPropertiesClass( /** @type {!PropertiesMixinConstructor} */this);
        this.__properties = Object.assign({}, superCtor && superCtor._properties, ownProperties( /** @type {PropertiesMixinConstructor} */this));
      }

      return this.__properties;
    } /**
       * Overrides `PropertiesChanged` method to return type specified in the
       * static `properties` object for the given property.
       * @param {string} name Name of property
       * @return {*} Type to which to deserialize attribute
       *
       * @protected
       */

    static typeForProperty(name) {
      const info = this._properties[name];
      return info && info.type;
    } /**
       * Overrides `PropertiesChanged` method and adds a call to
       * `finalize` which lazily configures the element's property accessors.
       * @override
       * @return {void}
       */

    _initializeProperties() {
      this.constructor.finalize();

      super._initializeProperties();
    } /**
       * Called when the element is added to a document.
       * Calls `_enableProperties` to turn on property system from
       * `PropertiesChanged`.
       * @suppress {missingProperties} Super may or may not implement the callback
       * @return {void}
       * @override
       */

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this._enableProperties();
    } /**
       * Called when the element is removed from a document
       * @suppress {missingProperties} Super may or may not implement the callback
       * @return {void}
       * @override
       */

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

  }

  return PropertiesMixin;
});
var propertiesMixin = {
  PropertiesMixin: PropertiesMixin
};
const bundledImportMeta = { ...import.meta,
  url: new URL('../node_modules/%40polymer/polymer/lib/mixins/element-mixin.js', import.meta.url).href
};
const ElementMixin = dedupingMixin(base => {
  /**
   * @constructor
   * @extends {base}
   * @implements {Polymer_PropertyEffects}
   * @implements {Polymer_PropertiesMixin}
   * @private
   */const polymerElementBase = PropertiesMixin(PropertyEffects(base)); /**
                                                                         * Returns a list of properties with default values.
                                                                         * This list is created as an optimization since it is a subset of
                                                                         * the list returned from `_properties`.
                                                                         * This list is used in `_initializeProperties` to set property defaults.
                                                                         *
                                                                         * @param {PolymerElementConstructor} constructor Element class
                                                                         * @return {PolymerElementProperties} Flattened properties for this class
                                                                         *   that have default values
                                                                         * @private
                                                                         */

  function propertyDefaults(constructor) {
    if (!constructor.hasOwnProperty(JSCompiler_renameProperty('__propertyDefaults', constructor))) {
      constructor.__propertyDefaults = null;
      let props = constructor._properties;

      for (let p in props) {
        let info = props[p];

        if ('value' in info) {
          constructor.__propertyDefaults = constructor.__propertyDefaults || {};
          constructor.__propertyDefaults[p] = info;
        }
      }
    }

    return constructor.__propertyDefaults;
  } /**
     * Returns a memoized version of the the `observers` array.
     * @param {PolymerElementConstructor} constructor Element class
     * @return {Array} Array containing own observers for the given class
     * @protected
     */

  function ownObservers(constructor) {
    if (!constructor.hasOwnProperty(JSCompiler_renameProperty('__ownObservers', constructor))) {
      constructor.__ownObservers = constructor.hasOwnProperty(JSCompiler_renameProperty('observers', constructor)) ? /** @type {PolymerElementConstructor} */constructor.observers : null;
    }

    return constructor.__ownObservers;
  } /**
     * Creates effects for a property.
     *
     * Note, once a property has been set to
     * `readOnly`, `computed`, `reflectToAttribute`, or `notify`
     * these values may not be changed. For example, a subclass cannot
     * alter these settings. However, additional `observers` may be added
     * by subclasses.
     *
     * The info object should may contain property metadata as follows:
     *
     * * `type`: {function} type to which an attribute matching the property
     * is deserialized. Note the property is camel-cased from a dash-cased
     * attribute. For example, 'foo-bar' attribute is deserialized to a
     * property named 'fooBar'.
     *
     * * `readOnly`: {boolean} creates a readOnly property and
     * makes a private setter for the private of the form '_setFoo' for a
     * property 'foo',
     *
     * * `computed`: {string} creates a computed property. A computed property
     * also automatically is set to `readOnly: true`. The value is calculated
     * by running a method and arguments parsed from the given string. For
     * example 'compute(foo)' will compute a given property when the
     * 'foo' property changes by executing the 'compute' method. This method
     * must return the computed value.
     *
     * * `reflectToAttribute`: {boolean} If true, the property value is reflected
     * to an attribute of the same name. Note, the attribute is dash-cased
     * so a property named 'fooBar' is reflected as 'foo-bar'.
     *
     * * `notify`: {boolean} sends a non-bubbling notification event when
     * the property changes. For example, a property named 'foo' sends an
     * event named 'foo-changed' with `event.detail` set to the value of
     * the property.
     *
     * * observer: {string} name of a method that runs when the property
     * changes. The arguments of the method are (value, previousValue).
     *
     * Note: Users may want control over modifying property
     * effects via subclassing. For example, a user might want to make a
     * reflectToAttribute property not do so in a subclass. We've chosen to
     * disable this because it leads to additional complication.
     * For example, a readOnly effect generates a special setter. If a subclass
     * disables the effect, the setter would fail unexpectedly.
     * Based on feedback, we may want to try to make effects more malleable
     * and/or provide an advanced api for manipulating them.
     * Also consider adding warnings when an effect cannot be changed.
     *
     * @param {!PolymerElement} proto Element class prototype to add accessors
     *   and effects to
     * @param {string} name Name of the property.
     * @param {Object} info Info object from which to create property effects.
     * Supported keys:
     * @param {Object} allProps Flattened map of all properties defined in this
     *   element (including inherited properties)
     * @return {void}
     * @private
     */

  function createPropertyFromConfig(proto, name, info, allProps) {
    // computed forces readOnly...
    if (info.computed) {
      info.readOnly = true;
    } // Note, since all computed properties are readOnly, this prevents
    // adding additional computed property effects (which leads to a confusing
    // setup where multiple triggers for setting a property)
    // While we do have `hasComputedEffect` this is set on the property's
    // dependencies rather than itself.


    if (info.computed && !proto._hasReadOnlyEffect(name)) {
      proto._createComputedProperty(name, info.computed, allProps);
    }

    if (info.readOnly && !proto._hasReadOnlyEffect(name)) {
      proto._createReadOnlyProperty(name, !info.computed);
    }

    if (info.reflectToAttribute && !proto._hasReflectEffect(name)) {
      proto._createReflectedProperty(name);
    }

    if (info.notify && !proto._hasNotifyEffect(name)) {
      proto._createNotifyingProperty(name);
    } // always add observer


    if (info.observer) {
      proto._createPropertyObserver(name, info.observer, allProps[info.observer]);
    } // always create the mapping from attribute back to property for deserialization.


    proto._addPropertyToAttributeMap(name);
  } /**
     * Process all style elements in the element template. Styles with the
     * `include` attribute are processed such that any styles in
     * the associated "style modules" are included in the element template.
     * @param {PolymerElementConstructor} klass Element class
     * @param {!HTMLTemplateElement} template Template to process
     * @param {string} is Name of element
     * @param {string} baseURI Base URI for element
     * @private
     */

  function processElementStyles(klass, template, is, baseURI) {
    const templateStyles = template.content.querySelectorAll('style');
    const stylesWithImports = stylesFromTemplate(template); // insert styles from <link rel="import" type="css"> at the top of the template

    const linkedStyles = stylesFromModuleImports(is);
    const firstTemplateChild = template.content.firstElementChild;

    for (let idx = 0; idx < linkedStyles.length; idx++) {
      let s = linkedStyles[idx];
      s.textContent = klass._processStyleText(s.textContent, baseURI);
      template.content.insertBefore(s, firstTemplateChild);
    } // keep track of the last "concrete" style in the template we have encountered


    let templateStyleIndex = 0; // ensure all gathered styles are actually in this template.

    for (let i = 0; i < stylesWithImports.length; i++) {
      let s = stylesWithImports[i];
      let templateStyle = templateStyles[templateStyleIndex]; // if the style is not in this template, it's been "included" and
      // we put a clone of it in the template before the style that included it

      if (templateStyle !== s) {
        s = s.cloneNode(true);
        templateStyle.parentNode.insertBefore(s, templateStyle);
      } else {
        templateStyleIndex++;
      }

      s.textContent = klass._processStyleText(s.textContent, baseURI);
    }

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(template, is);
    }
  } /**
     * @polymer
     * @mixinClass
     * @unrestricted
     * @implements {Polymer_ElementMixin}
     */

  class PolymerElement extends polymerElementBase {
    /**
     * Override of PropertiesMixin _finalizeClass to create observers and
     * find the template.
     * @return {void}
     * @protected
     * @override
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     */static _finalizeClass() {
      super._finalizeClass();

      if (this.hasOwnProperty(JSCompiler_renameProperty('is', this)) && this.is) {
        register(this.prototype);
      }

      const observers = ownObservers(this);

      if (observers) {
        this.createObservers(observers, this._properties);
      } // note: create "working" template that is finalized at instance time


      let template = /** @type {PolymerElementConstructor} */this.template;

      if (template) {
        if (typeof template === 'string') {
          console.error('template getter must return HTMLTemplateElement');
          template = null;
        } else {
          template = template.cloneNode(true);
        }
      }

      this.prototype._template = template;
    } /**
       * Override of PropertiesChanged createProperties to create accessors
       * and property effects for all of the properties.
       * @return {void}
       * @protected
       * @override
       */

    static createProperties(props) {
      for (let p in props) {
        createPropertyFromConfig(this.prototype, p, props[p], props);
      }
    } /**
       * Creates observers for the given `observers` array.
       * Leverages `PropertyEffects` to create observers.
       * @param {Object} observers Array of observer descriptors for
       *   this class
       * @param {Object} dynamicFns Object containing keys for any properties
       *   that are functions and should trigger the effect when the function
       *   reference is changed
       * @return {void}
       * @protected
       */

    static createObservers(observers, dynamicFns) {
      const proto = this.prototype;

      for (let i = 0; i < observers.length; i++) {
        proto._createMethodObserver(observers[i], dynamicFns);
      }
    } /**
       * Returns the template that will be stamped into this element's shadow root.
       *
       * If a `static get is()` getter is defined, the default implementation
       * will return the first `<template>` in a `dom-module` whose `id`
       * matches this element's `is`.
       *
       * Users may override this getter to return an arbitrary template
       * (in which case the `is` getter is unnecessary). The template returned
       * must be an `HTMLTemplateElement`.
       *
       * Note that when subclassing, if the super class overrode the default
       * implementation and the subclass would like to provide an alternate
       * template via a `dom-module`, it should override this getter and
       * return `DomModule.import(this.is, 'template')`.
       *
       * If a subclass would like to modify the super class template, it should
       * clone it rather than modify it in place.  If the getter does expensive
       * work such as cloning/modifying a template, it should memoize the
       * template for maximum performance:
       *
       *   let memoizedTemplate;
       *   class MySubClass extends MySuperClass {
       *     static get template() {
       *       if (!memoizedTemplate) {
       *         memoizedTemplate = super.template.cloneNode(true);
       *         let subContent = document.createElement('div');
       *         subContent.textContent = 'This came from MySubClass';
       *         memoizedTemplate.content.appendChild(subContent);
       *       }
       *       return memoizedTemplate;
       *     }
       *   }
       *
       * @return {HTMLTemplateElement|string} Template to be stamped
       */

    static get template() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_template', this))) {
        this._template = DomModule && DomModule.import( /** @type {PolymerElementConstructor}*/this.is, 'template') || // note: implemented so a subclass can retrieve the super
        // template; call the super impl this way so that `this` points
        // to the superclass.
        Object.getPrototypeOf( /** @type {PolymerElementConstructor}*/this.prototype).constructor.template;
      }

      return this._template;
    } /**
       * Path matching the url from which the element was imported.
       *
       * This path is used to resolve url's in template style cssText.
       * The `importPath` property is also set on element instances and can be
       * used to create bindings relative to the import path.
       *
       * For elements defined in ES modules, users should implement
       * `static get importMeta() { return import.meta; }`, and the default
       * implementation of `importPath` will  return `import.meta.url`'s path.
       * For elements defined in HTML imports, this getter will return the path
       * to the document containing a `dom-module` element matching this
       * element's static `is` property.
       *
       * Note, this path should contain a trailing `/`.
       *
       * @return {string} The import path for this element class
       * @suppress {missingProperties}
       */

    static get importPath() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_importPath', this))) {
        const meta = this.importMeta;

        if (meta) {
          this._importPath = pathFromUrl(meta.url);
        } else {
          const module = DomModule && DomModule.import( /** @type {PolymerElementConstructor} */this.is);
          this._importPath = module && module.assetpath || Object.getPrototypeOf( /** @type {PolymerElementConstructor}*/this.prototype).constructor.importPath;
        }
      }

      return this._importPath;
    }

    constructor() {
      super(); /** @type {HTMLTemplateElement} */
      this._template; /** @type {string} */
      this._importPath; /** @type {string} */
      this.rootPath; /** @type {string} */
      this.importPath; /** @type {StampedTemplate | HTMLElement | ShadowRoot} */
      this.root; /** @type {!Object<string, !Element>} */
      this.$;
    } /**
       * Overrides the default `PropertyAccessors` to ensure class
       * metaprogramming related to property accessors and effects has
       * completed (calls `finalize`).
       *
       * It also initializes any property defaults provided via `value` in
       * `properties` metadata.
       *
       * @return {void}
       * @override
       * @suppress {invalidCasts}
       */

    _initializeProperties() {
      instanceCount++;
      this.constructor.finalize(); // note: finalize template when we have access to `localName` to
      // avoid dependence on `is` for polyfilling styling.

      this.constructor._finalizeTemplate( /** @type {!HTMLElement} */this.localName);

      super._initializeProperties(); // set path defaults


      this.rootPath = rootPath;
      this.importPath = this.constructor.importPath; // apply property defaults...

      let p$ = propertyDefaults(this.constructor);

      if (!p$) {
        return;
      }

      for (let p in p$) {
        let info = p$[p]; // Don't set default value if there is already an own property, which
        // happens when a `properties` property with default but no effects had
        // a property set (e.g. bound) by its host before upgrade

        if (!this.hasOwnProperty(p)) {
          let value = typeof info.value == 'function' ? info.value.call(this) : info.value; // Set via `_setProperty` if there is an accessor, to enable
          // initializing readOnly property defaults

          if (this._hasAccessor(p)) {
            this._setPendingProperty(p, value, true);
          } else {
            this[p] = value;
          }
        }
      }
    } /**
       * Gather style text for a style element in the template.
       *
       * @param {string} cssText Text containing styling to process
       * @param {string} baseURI Base URI to rebase CSS paths against
       * @return {string} The processed CSS text
       * @protected
       */

    static _processStyleText(cssText, baseURI) {
      return resolveCss(cssText, baseURI);
    } /**
      * Configures an element `proto` to function with a given `template`.
      * The element name `is` and extends `ext` must be specified for ShadyCSS
      * style scoping.
      *
      * @param {string} is Tag name (or type extension name) for this element
      * @return {void}
      * @protected
      */

    static _finalizeTemplate(is) {
      /** @const {HTMLTemplateElement} */const template = this.prototype._template;

      if (template && !template.__polymerFinalized) {
        template.__polymerFinalized = true;
        const importPath = this.importPath;
        const baseURI = importPath ? resolveUrl(importPath) : ''; // e.g. support `include="module-name"`, and ShadyCSS

        processElementStyles(this, template, is, baseURI);

        this.prototype._bindTemplate(template);
      }
    } /**
       * Provides a default implementation of the standard Custom Elements
       * `connectedCallback`.
       *
       * The default implementation enables the property effects system and
       * flushes any pending properties, and updates shimmed CSS properties
       * when using the ShadyCSS scoping/custom properties polyfill.
       *
       * @suppress {missingProperties, invalidCasts} Super may or may not implement the callback
       * @return {void}
       */

    connectedCallback() {
      if (window.ShadyCSS && this._template) {
        window.ShadyCSS.styleElement( /** @type {!HTMLElement} */this);
      }

      super.connectedCallback();
    } /**
       * Stamps the element template.
       *
       * @return {void}
       * @override
       */

    ready() {
      if (this._template) {
        this.root = this._stampTemplate(this._template);
        this.$ = this.root.$;
      }

      super.ready();
    } /**
       * Implements `PropertyEffects`'s `_readyClients` call. Attaches
       * element dom by calling `_attachDom` with the dom stamped from the
       * element's template via `_stampTemplate`. Note that this allows
       * client dom to be attached to the element prior to any observers
       * running.
       *
       * @return {void}
       * @override
       */

    _readyClients() {
      if (this._template) {
        this.root = this._attachDom( /** @type {StampedTemplate} */this.root);
      } // The super._readyClients here sets the clients initialized flag.
      // We must wait to do this until after client dom is created/attached
      // so that this flag can be checked to prevent notifications fired
      // during this process from being handled before clients are ready.


      super._readyClients();
    } /**
       * Attaches an element's stamped dom to itself. By default,
       * this method creates a `shadowRoot` and adds the dom to it.
       * However, this method may be overridden to allow an element
       * to put its dom in another location.
       *
       * @throws {Error}
       * @suppress {missingReturn}
       * @param {StampedTemplate} dom to attach to the element.
       * @return {ShadowRoot} node to which the dom has been attached.
       */

    _attachDom(dom) {
      if (this.attachShadow) {
        if (dom) {
          if (!this.shadowRoot) {
            this.attachShadow({
              mode: 'open'
            });
          }

          this.shadowRoot.appendChild(dom);
          return this.shadowRoot;
        }

        return null;
      } else {
        throw new Error('ShadowDOM not available. ' + // TODO(sorvell): move to compile-time conditional when supported
        'PolymerElement can create dom as children instead of in ' + 'ShadowDOM by setting `this.root = this;\` before \`ready\`.');
      }
    } /**
       * When using the ShadyCSS scoping and custom property shim, causes all
       * shimmed styles in this element (and its subtree) to be updated
       * based on current custom property values.
       *
       * The optional parameter overrides inline custom property styles with an
       * object of properties where the keys are CSS properties, and the values
       * are strings.
       *
       * Example: `this.updateStyles({'--color': 'blue'})`
       *
       * These properties are retained unless a value of `null` is set.
       *
       * Note: This function does not support updating CSS mixins.
       * You can not dynamically change the value of an `@apply`.
       *
       * @param {Object=} properties Bag of custom property key/values to
       *   apply to this element.
       * @return {void}
       * @suppress {invalidCasts}
       */

    updateStyles(properties) {
      if (window.ShadyCSS) {
        window.ShadyCSS.styleSubtree( /** @type {!HTMLElement} */this, properties);
      }
    } /**
       * Rewrites a given URL relative to a base URL. The base URL defaults to
       * the original location of the document containing the `dom-module` for
       * this element. This method will return the same URL before and after
       * bundling.
       *
       * Note that this function performs no resolution for URLs that start
       * with `/` (absolute URLs) or `#` (hash identifiers).  For general purpose
       * URL resolution, use `window.URL`.
       *
       * @param {string} url URL to resolve.
       * @param {string=} base Optional base URL to resolve against, defaults
       * to the element's `importPath`
       * @return {string} Rewritten URL relative to base
       */

    resolveUrl(url, base) {
      if (!base && this.importPath) {
        base = resolveUrl(this.importPath);
      }

      return resolveUrl(url, base);
    } /**
       * Overrides `PropertyAccessors` to add map of dynamic functions on
       * template info, for consumption by `PropertyEffects` template binding
       * code. This map determines which method templates should have accessors
       * created for them.
       *
       * @override
       * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
       */

    static _parseTemplateContent(template, templateInfo, nodeInfo) {
      templateInfo.dynamicFns = templateInfo.dynamicFns || this._properties;
      return super._parseTemplateContent(template, templateInfo, nodeInfo);
    }

  }

  return PolymerElement;
}); /**
     * Provides basic tracking of element definitions (registrations) and
     * instance counts.
     *
     * @summary Provides basic tracking of element definitions (registrations) and
     * instance counts.
     */
`TODO(modulizer): A namespace named Polymer.telemetry was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`; /**
                                       * Total number of Polymer element instances created.
                                       * @type {number}
                                       */
let instanceCount = 0; /**
                               * Array of Polymer element classes that have been finalized.
                               * @type {Array<PolymerElement>}
                               */
const registrations = []; /**
                                  * @param {!PolymerElementConstructor} prototype Element prototype to log
                                  * @this {this}
                                  * @private
                                  */

function _regLog(prototype) {
  console.log('[' + prototype.is + ']: registered');
} /**
   * Registers a class prototype for telemetry purposes.
   * @param {HTMLElement} prototype Element prototype to register
   * @this {this}
   * @protected
   */

function register(prototype) {
  registrations.push(prototype);
  undefined && _regLog(prototype);
} /**
   * Logs all elements registered with an `is` to the console.
   * @public
   * @this {this}
   */

function dumpRegistrations() {
  registrations.forEach(_regLog);
} /**
   * When using the ShadyCSS scoping and custom property shim, causes all
   * shimmed `styles` (via `custom-style`) in the document (and its subtree)
   * to be updated based on current custom property values.
   *
   * The optional parameter overrides inline custom property styles with an
   * object of properties where the keys are CSS properties, and the values
   * are strings.
   *
   * Example: `updateStyles({'--color': 'blue'})`
   *
   * These properties are retained unless a value of `null` is set.
   *
   * @param {Object=} props Bag of custom property key/values to
   *   apply to the document.
   * @return {void}
   */

const updateStyles = function (props) {
  if (window.ShadyCSS) {
    window.ShadyCSS.styleDocument(props);
  }
};

var elementMixin = {
  ElementMixin: ElementMixin,

  get instanceCount() {
    return instanceCount;
  },

  registrations: registrations,
  register: register,
  dumpRegistrations: dumpRegistrations,
  updateStyles: updateStyles
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * @summary Collapse multiple callbacks into one invocation after a timer.
       */
const Debouncer = class Debouncer {
  constructor() {
    this._asyncModule = null;
    this._callback = null;
    this._timer = null;
  } /**
     * Sets the scheduler; that is, a module with the Async interface,
     * a callback and optional arguments to be passed to the run function
     * from the async module.
     *
     * @param {!AsyncInterface} asyncModule Object with Async interface.
     * @param {function()} callback Callback to run.
     * @return {void}
     */

  setConfig(asyncModule, callback) {
    this._asyncModule = asyncModule;
    this._callback = callback;
    this._timer = this._asyncModule.run(() => {
      this._timer = null;

      this._callback();
    });
  } /**
     * Cancels an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */

  cancel() {
    if (this.isActive()) {
      this._asyncModule.cancel(this._timer);

      this._timer = null;
    }
  } /**
     * Flushes an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */

  flush() {
    if (this.isActive()) {
      this.cancel();

      this._callback();
    }
  } /**
     * Returns true if the debouncer is active.
     *
     * @return {boolean} True if active.
     */

  isActive() {
    return this._timer != null;
  } /**
     * Creates a debouncer if no debouncer is passed as a parameter
     * or it cancels an active debouncer otherwise. The following
     * example shows how a debouncer can be called multiple times within a
     * microtask and "debounced" such that the provided callback function is
     * called once. Add this method to a custom element:
     *
     * ```js
     * import {microTask} from '@polymer/polymer/lib/utils/async.js';
     * import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
     * // ...
     *
     * _debounceWork() {
     *   this._debounceJob = Debouncer.debounce(this._debounceJob,
     *       microTask, () => this._doWork());
     * }
     * ```
     *
     * If the `_debounceWork` method is called multiple times within the same
     * microtask, the `_doWork` function will be called only once at the next
     * microtask checkpoint.
     *
     * Note: In testing it is often convenient to avoid asynchrony. To accomplish
     * this with a debouncer, you can use `enqueueDebouncer` and
     * `flush`. For example, extend the above example by adding
     * `enqueueDebouncer(this._debounceJob)` at the end of the
     * `_debounceWork` method. Then in a test, call `flush` to ensure
     * the debouncer has completed.
     *
     * @param {Debouncer?} debouncer Debouncer object.
     * @param {!AsyncInterface} asyncModule Object with Async interface
     * @param {function()} callback Callback to run.
     * @return {!Debouncer} Returns a debouncer object.
     */

  static debounce(debouncer, asyncModule, callback) {
    if (debouncer instanceof Debouncer) {
      debouncer.cancel();
    } else {
      debouncer = new Debouncer();
    }

    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }

};
var debounce = {
  Debouncer: Debouncer
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // detect native touch action support

let HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
let GESTURE_KEY = '__polymerGestures';
let HANDLED_OBJ = '__polymerGesturesHandled';
let TOUCH_ACTION = '__polymerGesturesTouchAction'; // radius for tap and track

let TAP_DISTANCE = 25;
let TRACK_DISTANCE = 5; // number of last N track positions to keep

let TRACK_LENGTH = 2; // Disabling "mouse" handlers for 2500ms is enough

let MOUSE_TIMEOUT = 2500;
let MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click']; // an array of bitmask values for mapping MouseEvent.which to MouseEvent.buttons

let MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];

let MOUSE_HAS_BUTTONS = function () {
  try {
    return new MouseEvent('test', {
      buttons: 1
    }).buttons === 1;
  } catch (e) {
    return false;
  }
}(); /**
      * @param {string} name Possible mouse event name
      * @return {boolean} true if mouse event, false if not
      */

function isMouseEvent(name) {
  return MOUSE_EVENTS.indexOf(name) > -1;
} /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */ // check for passive event listeners


let SUPPORTS_PASSIVE = false;

(function () {
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get() {
        SUPPORTS_PASSIVE = true;
      }

    });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (e) {}
})(); /**
       * Generate settings for event listeners, dependant on `passiveTouchGestures`
       *
       * @param {string} eventName Event name to determine if `{passive}` option is
       *   needed
       * @return {{passive: boolean} | undefined} Options to use for addEventListener
       *   and removeEventListener
       */

function PASSIVE_TOUCH(eventName) {
  if (isMouseEvent(eventName) || eventName === 'touchend') {
    return;
  }

  if (HAS_NATIVE_TA && SUPPORTS_PASSIVE && passiveTouchGestures) {
    return {
      passive: true
    };
  } else {
    return;
  }
} // Check for touch-only devices


let IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/); /** @record */

const GestureInfo = function () {}; // eslint-disable-line no-unused-vars
/** @type {string|undefined} */

GestureInfo.prototype.state; /** @type {boolean|undefined} */
GestureInfo.prototype.started; /** @type {!Array<?>|undefined} */
GestureInfo.prototype.moves; /** @type {number|undefined} */
GestureInfo.prototype.x; /** @type {number|undefined} */
GestureInfo.prototype.y; /** @type {boolean|undefined} */
GestureInfo.prototype.prevent; /** @type {function(?): void|undefined} */
GestureInfo.prototype.addMove; /** @type {null|undefined} */
GestureInfo.prototype.movefn; /** @type {null|undefined} */
GestureInfo.prototype.upFn; /** @record */

const GestureRecognizer = function () {}; // eslint-disable-line no-unused-vars
/** @type {function(): void} */

GestureRecognizer.prototype.reset; /** @type {function(MouseEvent): void | undefined} */
GestureRecognizer.prototype.mousedown; /** @type {(function(MouseEvent): void | undefined)} */
GestureRecognizer.prototype.mousemove; /** @type {(function(MouseEvent): void | undefined)} */
GestureRecognizer.prototype.mouseup; /** @type {(function(TouchEvent): void | undefined)} */
GestureRecognizer.prototype.touchstart; /** @type {(function(TouchEvent): void | undefined)} */
GestureRecognizer.prototype.touchmove; /** @type {(function(TouchEvent): void | undefined)} */
GestureRecognizer.prototype.touchend; /** @type {(function(MouseEvent): void | undefined)} */
GestureRecognizer.prototype.click; /** @type {!GestureInfo} */
GestureRecognizer.prototype.info; /** @type {!Array<string>} */
GestureRecognizer.prototype.emits; // keep track of any labels hit by the mouseCanceller
/** @type {!Array<!HTMLLabelElement>} */
const clickedLabels = []; /** @type {!Object<boolean>} */
const labellable = {
  'button': true,
  'input': true,
  'keygen': true,
  'meter': true,
  'output': true,
  'textarea': true,
  'progress': true,
  'select': true
}; // Defined at https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute
/** @type {!Object<boolean>} */
const canBeDisabled = {
  'button': true,
  'command': true,
  'fieldset': true,
  'input': true,
  'keygen': true,
  'optgroup': true,
  'option': true,
  'select': true,
  'textarea': true
}; /**
    * @param {HTMLElement} el Element to check labelling status
    * @return {boolean} element can have labels
    */

function canBeLabelled(el) {
  return labellable[el.localName] || false;
} /**
   * @param {HTMLElement} el Element that may be labelled.
   * @return {!Array<!HTMLLabelElement>} Relevant label for `el`
   */

function matchingLabels(el) {
  let labels = Array.prototype.slice.call( /** @type {HTMLInputElement} */el.labels || []); // IE doesn't have `labels` and Safari doesn't populate `labels`
  // if element is in a shadowroot.
  // In this instance, finding the non-ancestor labels is enough,
  // as the mouseCancellor code will handle ancstor labels

  if (!labels.length) {
    labels = [];
    let root = el.getRootNode(); // if there is an id on `el`, check for all labels with a matching `for` attribute

    if (el.id) {
      let matching = root.querySelectorAll(`label[for = ${el.id}]`);

      for (let i = 0; i < matching.length; i++) {
        labels.push( /** @type {!HTMLLabelElement} */matching[i]);
      }
    }
  }

  return labels;
} // touch will make synthetic mouse events
// `preventDefault` on touchend will cancel them,
// but this breaks `<input>` focus and link clicks
// disable mouse handlers for MOUSE_TIMEOUT ms after
// a touchend to ignore synthetic mouse events


let mouseCanceller = function (mouseEvent) {
  // Check for sourceCapabilities, used to distinguish synthetic events
  // if mouseEvent did not come from a device that fires touch events,
  // it was made by a real mouse and should be counted
  // http://wicg.github.io/InputDeviceCapabilities/#dom-inputdevicecapabilities-firestouchevents
  let sc = mouseEvent.sourceCapabilities;

  if (sc && !sc.firesTouchEvents) {
    return;
  } // skip synthetic mouse events


  mouseEvent[HANDLED_OBJ] = {
    skip: true
  }; // disable "ghost clicks"

  if (mouseEvent.type === 'click') {
    let clickFromLabel = false;
    let path = mouseEvent.composedPath && mouseEvent.composedPath();

    if (path) {
      for (let i = 0; i < path.length; i++) {
        if (path[i].nodeType === Node.ELEMENT_NODE) {
          if (path[i].localName === 'label') {
            clickedLabels.push(path[i]);
          } else if (canBeLabelled(path[i])) {
            let ownerLabels = matchingLabels(path[i]); // check if one of the clicked labels is labelling this element

            for (let j = 0; j < ownerLabels.length; j++) {
              clickFromLabel = clickFromLabel || clickedLabels.indexOf(ownerLabels[j]) > -1;
            }
          }
        }

        if (path[i] === POINTERSTATE.mouse.target) {
          return;
        }
      }
    } // if one of the clicked labels was labelling the target element,
    // this is not a ghost click


    if (clickFromLabel) {
      return;
    }

    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
  }
}; /**
    * @param {boolean=} setup True to add, false to remove.
    * @return {void}
    */

function setupTeardownMouseCanceller(setup) {
  let events = IS_TOUCH_ONLY ? ['click'] : MOUSE_EVENTS;

  for (let i = 0, en; i < events.length; i++) {
    en = events[i];

    if (setup) {
      // reset clickLabels array
      clickedLabels.length = 0;
      document.addEventListener(en, mouseCanceller, true);
    } else {
      document.removeEventListener(en, mouseCanceller, true);
    }
  }
}

function ignoreMouse(e) {
  if (!POINTERSTATE.mouse.mouseIgnoreJob) {
    setupTeardownMouseCanceller(true);
  }

  let unset = function () {
    setupTeardownMouseCanceller();
    POINTERSTATE.mouse.target = null;
    POINTERSTATE.mouse.mouseIgnoreJob = null;
  };

  POINTERSTATE.mouse.target = e.composedPath()[0];
  POINTERSTATE.mouse.mouseIgnoreJob = Debouncer.debounce(POINTERSTATE.mouse.mouseIgnoreJob, timeOut.after(MOUSE_TIMEOUT), unset);
} /**
   * @param {MouseEvent} ev event to test for left mouse button down
   * @return {boolean} has left mouse button down
   */

function hasLeftMouseButton(ev) {
  let type = ev.type; // exit early if the event is not a mouse event

  if (!isMouseEvent(type)) {
    return false;
  } // ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
  // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)


  if (type === 'mousemove') {
    // allow undefined for testing events
    let buttons = ev.buttons === undefined ? 1 : ev.buttons;

    if (ev instanceof window.MouseEvent && !MOUSE_HAS_BUTTONS) {
      buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
    } // buttons is a bitmask, check that the left button bit is set (1)


    return Boolean(buttons & 1);
  } else {
    // allow undefined for testing events
    let button = ev.button === undefined ? 0 : ev.button; // ev.button is 0 in mousedown/mouseup/click for left button activation

    return button === 0;
  }
}

function isSyntheticClick(ev) {
  if (ev.type === 'click') {
    // ev.detail is 0 for HTMLElement.click in most browsers
    if (ev.detail === 0) {
      return true;
    } // in the worst case, check that the x/y position of the click is within
    // the bounding box of the target of the event
    // Thanks IE 10 >:(


    let t = _findOriginalTarget(ev); // make sure the target of the event is an element so we can use getBoundingClientRect,
    // if not, just assume it is a synthetic click


    if (!t.nodeType || /** @type {Element} */t.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    let bcr = /** @type {Element} */t.getBoundingClientRect(); // use page x/y to account for scrolling

    let x = ev.pageX,
        y = ev.pageY; // ev is a synthetic click if the position is outside the bounding box of the target

    return !(x >= bcr.left && x <= bcr.right && y >= bcr.top && y <= bcr.bottom);
  }

  return false;
}

let POINTERSTATE = {
  mouse: {
    target: null,
    mouseIgnoreJob: null
  },
  touch: {
    x: 0,
    y: 0,
    id: -1,
    scrollDecided: false
  }
};

function firstTouchAction(ev) {
  let ta = 'auto';
  let path = ev.composedPath && ev.composedPath();

  if (path) {
    for (let i = 0, n; i < path.length; i++) {
      n = path[i];

      if (n[TOUCH_ACTION]) {
        ta = n[TOUCH_ACTION];
        break;
      }
    }
  }

  return ta;
}

function trackDocument(stateObj, movefn, upfn) {
  stateObj.movefn = movefn;
  stateObj.upfn = upfn;
  document.addEventListener('mousemove', movefn);
  document.addEventListener('mouseup', upfn);
}

function untrackDocument(stateObj) {
  document.removeEventListener('mousemove', stateObj.movefn);
  document.removeEventListener('mouseup', stateObj.upfn);
  stateObj.movefn = null;
  stateObj.upfn = null;
} // use a document-wide touchend listener to start the ghost-click prevention mechanism
// Use passive event listeners, if supported, to not affect scrolling performance


document.addEventListener('touchend', ignoreMouse, SUPPORTS_PASSIVE ? {
  passive: true
} : false);
const gestures = {};
const recognizers = []; /**
                         * Finds the element rendered on the screen at the provided coordinates.
                         *
                         * Similar to `document.elementFromPoint`, but pierces through
                         * shadow roots.
                         *
                         * @param {number} x Horizontal pixel coordinate
                         * @param {number} y Vertical pixel coordinate
                         * @return {Element} Returns the deepest shadowRoot inclusive element
                         * found at the screen position given.
                         */

function deepTargetFind(x, y) {
  let node = document.elementFromPoint(x, y);
  let next = node; // this code path is only taken when native ShadowDOM is used
  // if there is a shadowroot, it may have a node at x/y
  // if there is not a shadowroot, exit the loop

  while (next && next.shadowRoot && !window.ShadyDOM) {
    // if there is a node at x/y in the shadowroot, look deeper
    let oldNext = next;
    next = next.shadowRoot.elementFromPoint(x, y); // on Safari, elementFromPoint may return the shadowRoot host

    if (oldNext === next) {
      break;
    }

    if (next) {
      node = next;
    }
  }

  return node;
} /**
   * a cheaper check than ev.composedPath()[0];
   *
   * @private
   * @param {Event|Touch} ev Event.
   * @return {EventTarget} Returns the event target.
   */

function _findOriginalTarget(ev) {
  // shadowdom
  if (ev.composedPath) {
    const targets = /** @type {!Array<!EventTarget>} */ev.composedPath(); // It shouldn't be, but sometimes targets is empty (window on Safari).

    return targets.length > 0 ? targets[0] : ev.target;
  } // shadydom


  return ev.target;
} /**
   * @private
   * @param {Event} ev Event.
   * @return {void}
   */

function _handleNative(ev) {
  let handled;
  let type = ev.type;
  let node = ev.currentTarget;
  let gobj = node[GESTURE_KEY];

  if (!gobj) {
    return;
  }

  let gs = gobj[type];

  if (!gs) {
    return;
  }

  if (!ev[HANDLED_OBJ]) {
    ev[HANDLED_OBJ] = {};

    if (type.slice(0, 5) === 'touch') {
      ev = /** @type {TouchEvent} */ev; // eslint-disable-line no-self-assign

      let t = ev.changedTouches[0];

      if (type === 'touchstart') {
        // only handle the first finger
        if (ev.touches.length === 1) {
          POINTERSTATE.touch.id = t.identifier;
        }
      }

      if (POINTERSTATE.touch.id !== t.identifier) {
        return;
      }

      if (!HAS_NATIVE_TA) {
        if (type === 'touchstart' || type === 'touchmove') {
          _handleTouchAction(ev);
        }
      }
    }
  }

  handled = ev[HANDLED_OBJ]; // used to ignore synthetic mouse events

  if (handled.skip) {
    return;
  } // reset recognizer state


  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];

    if (gs[r.name] && !handled[r.name]) {
      if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
        r.reset();
      }
    }
  } // enforce gesture recognizer order


  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];

    if (gs[r.name] && !handled[r.name]) {
      handled[r.name] = true;
      r[type](ev);
    }
  }
} /**
   * @private
   * @param {TouchEvent} ev Event.
   * @return {void}
   */

function _handleTouchAction(ev) {
  let t = ev.changedTouches[0];
  let type = ev.type;

  if (type === 'touchstart') {
    POINTERSTATE.touch.x = t.clientX;
    POINTERSTATE.touch.y = t.clientY;
    POINTERSTATE.touch.scrollDecided = false;
  } else if (type === 'touchmove') {
    if (POINTERSTATE.touch.scrollDecided) {
      return;
    }

    POINTERSTATE.touch.scrollDecided = true;
    let ta = firstTouchAction(ev);
    let shouldPrevent = false;
    let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
    let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);

    if (!ev.cancelable) {// scrolling is happening
    } else if (ta === 'none') {
      shouldPrevent = true;
    } else if (ta === 'pan-x') {
      shouldPrevent = dy > dx;
    } else if (ta === 'pan-y') {
      shouldPrevent = dx > dy;
    }

    if (shouldPrevent) {
      ev.preventDefault();
    } else {
      prevent('track');
    }
  }
} /**
   * Adds an event listener to a node for the given gesture type.
   *
   * @param {!Node} node Node to add listener on
   * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
   * @param {!function(!Event):void} handler Event listener function to call
   * @return {boolean} Returns true if a gesture event listener was added.
   */

function addListener(node, evType, handler) {
  if (gestures[evType]) {
    _add(node, evType, handler);

    return true;
  }

  return false;
} /**
   * Removes an event listener from a node for the given gesture type.
   *
   * @param {!Node} node Node to remove listener from
   * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
   * @param {!function(!Event):void} handler Event listener function previously passed to
   *  `addListener`.
   * @return {boolean} Returns true if a gesture event listener was removed.
   */

function removeListener(node, evType, handler) {
  if (gestures[evType]) {
    _remove(node, evType, handler);

    return true;
  }

  return false;
} /**
   * automate the event listeners for the native events
   *
   * @private
   * @param {!Node} node Node on which to add the event.
   * @param {string} evType Event type to add.
   * @param {function(!Event)} handler Event handler function.
   * @return {void}
   */

function _add(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];

  if (!gobj) {
    node[GESTURE_KEY] = gobj = {};
  }

  for (let i = 0, dep, gd; i < deps.length; i++) {
    dep = deps[i]; // don't add mouse handlers on iOS because they cause gray selection overlays

    if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== 'click') {
      continue;
    }

    gd = gobj[dep];

    if (!gd) {
      gobj[dep] = gd = {
        _count: 0
      };
    }

    if (gd._count === 0) {
      node.addEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
    }

    gd[name] = (gd[name] || 0) + 1;
    gd._count = (gd._count || 0) + 1;
  }

  node.addEventListener(evType, handler);

  if (recognizer.touchAction) {
    setTouchAction(node, recognizer.touchAction);
  }
} /**
   * automate event listener removal for native events
   *
   * @private
   * @param {!Node} node Node on which to remove the event.
   * @param {string} evType Event type to remove.
   * @param {function(!Event): void} handler Event handler function.
   * @return {void}
   */

function _remove(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];

  if (gobj) {
    for (let i = 0, dep, gd; i < deps.length; i++) {
      dep = deps[i];
      gd = gobj[dep];

      if (gd && gd[name]) {
        gd[name] = (gd[name] || 1) - 1;
        gd._count = (gd._count || 1) - 1;

        if (gd._count === 0) {
          node.removeEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
        }
      }
    }
  }

  node.removeEventListener(evType, handler);
} /**
   * Registers a new gesture event recognizer for adding new custom
   * gesture event types.
   *
   * @param {!GestureRecognizer} recog Gesture recognizer descriptor
   * @return {void}
   */

function register$1(recog) {
  recognizers.push(recog);

  for (let i = 0; i < recog.emits.length; i++) {
    gestures[recog.emits[i]] = recog;
  }
} /**
   * @private
   * @param {string} evName Event name.
   * @return {Object} Returns the gesture for the given event name.
   */

function _findRecognizerByEvent(evName) {
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];

    for (let j = 0, n; j < r.emits.length; j++) {
      n = r.emits[j];

      if (n === evName) {
        return r;
      }
    }
  }

  return null;
} /**
   * Sets scrolling direction on node.
   *
   * This value is checked on first move, thus it should be called prior to
   * adding event listeners.
   *
   * @param {!Node} node Node to set touch action setting on
   * @param {string} value Touch action value
   * @return {void}
   */

function setTouchAction(node, value) {
  if (HAS_NATIVE_TA) {
    // NOTE: add touchAction async so that events can be added in
    // custom element constructors. Otherwise we run afoul of custom
    // elements restriction against settings attributes (style) in the
    // constructor.
    microTask.run(() => {
      node.style.touchAction = value;
    });
  }

  node[TOUCH_ACTION] = value;
} /**
   * Dispatches an event on the `target` element of `type` with the given
   * `detail`.
   * @private
   * @param {!EventTarget} target The element on which to fire an event.
   * @param {string} type The type of event to fire.
   * @param {!Object=} detail The detail object to populate on the event.
   * @return {void}
   */

function _fire(target, type, detail) {
  let ev = new Event(type, {
    bubbles: true,
    cancelable: true,
    composed: true
  });
  ev.detail = detail;
  target.dispatchEvent(ev); // forward `preventDefault` in a clean way

  if (ev.defaultPrevented) {
    let preventer = detail.preventer || detail.sourceEvent;

    if (preventer && preventer.preventDefault) {
      preventer.preventDefault();
    }
  }
} /**
   * Prevents the dispatch and default action of the given event name.
   *
   * @param {string} evName Event name.
   * @return {void}
   */

function prevent(evName) {
  let recognizer = _findRecognizerByEvent(evName);

  if (recognizer.info) {
    recognizer.info.prevent = true;
  }
} /**
   * Reset the 2500ms timeout on processing mouse input after detecting touch input.
   *
   * Touch inputs create synthesized mouse inputs anywhere from 0 to 2000ms after the touch.
   * This method should only be called during testing with simulated touch inputs.
   * Calling this method in production may cause duplicate taps or other Gestures.
   *
   * @return {void}
   */

function resetMouseCanceller() {
  if (POINTERSTATE.mouse.mouseIgnoreJob) {
    POINTERSTATE.mouse.mouseIgnoreJob.flush();
  }
} /* eslint-disable valid-jsdoc */

register$1({
  name: 'downup',
  deps: ['mousedown', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend']
  },
  emits: ['down', 'up'],
  info: {
    movefn: null,
    upfn: null
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */reset: function () {
    untrackDocument(this.info);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */mousedown: function (e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }

    let t = _findOriginalTarget(e);

    let self = this;

    let movefn = function movefn(e) {
      if (!hasLeftMouseButton(e)) {
        downupFire('up', t, e);
        untrackDocument(self.info);
      }
    };

    let upfn = function upfn(e) {
      if (hasLeftMouseButton(e)) {
        downupFire('up', t, e);
      }

      untrackDocument(self.info);
    };

    trackDocument(this.info, movefn, upfn);
    downupFire('down', t, e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchstart: function (e) {
    downupFire('down', _findOriginalTarget(e), e.changedTouches[0], e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchend: function (e) {
    downupFire('up', _findOriginalTarget(e), e.changedTouches[0], e);
  }
}); /**
     * @param {string} type
     * @param {EventTarget} target
     * @param {Event|Touch} event
     * @param {Event=} preventer
     * @return {void}
     */

function downupFire(type, target, event, preventer) {
  if (!target) {
    return;
  }

  _fire(target, type, {
    x: event.clientX,
    y: event.clientY,
    sourceEvent: event,
    preventer: preventer,
    prevent: function (e) {
      return prevent(e);
    }
  });
}

register$1({
  name: 'track',
  touchAction: 'none',
  deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend']
  },
  emits: ['track'],
  info: {
    x: 0,
    y: 0,
    state: 'start',
    started: false,
    moves: [],
    /** @this {GestureInfo} */addMove: function (move) {
      if (this.moves.length > TRACK_LENGTH) {
        this.moves.shift();
      }

      this.moves.push(move);
    },
    movefn: null,
    upfn: null,
    prevent: false
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */reset: function () {
    this.info.state = 'start';
    this.info.started = false;
    this.info.moves = [];
    this.info.x = 0;
    this.info.y = 0;
    this.info.prevent = false;
    untrackDocument(this.info);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */mousedown: function (e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }

    let t = _findOriginalTarget(e);

    let self = this;

    let movefn = function movefn(e) {
      let x = e.clientX,
          y = e.clientY;

      if (trackHasMovedEnough(self.info, x, y)) {
        // first move is 'start', subsequent moves are 'move', mouseup is 'end'
        self.info.state = self.info.started ? e.type === 'mouseup' ? 'end' : 'track' : 'start';

        if (self.info.state === 'start') {
          // if and only if tracking, always prevent tap
          prevent('tap');
        }

        self.info.addMove({
          x: x,
          y: y
        });

        if (!hasLeftMouseButton(e)) {
          // always fire "end"
          self.info.state = 'end';
          untrackDocument(self.info);
        }

        if (t) {
          trackFire(self.info, t, e);
        }

        self.info.started = true;
      }
    };

    let upfn = function upfn(e) {
      if (self.info.started) {
        movefn(e);
      } // remove the temporary listeners


      untrackDocument(self.info);
    }; // add temporary document listeners as mouse retargets


    trackDocument(this.info, movefn, upfn);
    this.info.x = e.clientX;
    this.info.y = e.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchstart: function (e) {
    let ct = e.changedTouches[0];
    this.info.x = ct.clientX;
    this.info.y = ct.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchmove: function (e) {
    let t = _findOriginalTarget(e);

    let ct = e.changedTouches[0];
    let x = ct.clientX,
        y = ct.clientY;

    if (trackHasMovedEnough(this.info, x, y)) {
      if (this.info.state === 'start') {
        // if and only if tracking, always prevent tap
        prevent('tap');
      }

      this.info.addMove({
        x: x,
        y: y
      });
      trackFire(this.info, t, ct);
      this.info.state = 'track';
      this.info.started = true;
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchend: function (e) {
    let t = _findOriginalTarget(e);

    let ct = e.changedTouches[0]; // only trackend if track was started and not aborted

    if (this.info.started) {
      // reset started state on up
      this.info.state = 'end';
      this.info.addMove({
        x: ct.clientX,
        y: ct.clientY
      });
      trackFire(this.info, t, ct);
    }
  }
}); /**
     * @param {!GestureInfo} info
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */

function trackHasMovedEnough(info, x, y) {
  if (info.prevent) {
    return false;
  }

  if (info.started) {
    return true;
  }

  let dx = Math.abs(info.x - x);
  let dy = Math.abs(info.y - y);
  return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
} /**
   * @param {!GestureInfo} info
   * @param {?EventTarget} target
   * @param {Touch} touch
   * @return {void}
   */

function trackFire(info, target, touch) {
  if (!target) {
    return;
  }

  let secondlast = info.moves[info.moves.length - 2];
  let lastmove = info.moves[info.moves.length - 1];
  let dx = lastmove.x - info.x;
  let dy = lastmove.y - info.y;
  let ddx,
      ddy = 0;

  if (secondlast) {
    ddx = lastmove.x - secondlast.x;
    ddy = lastmove.y - secondlast.y;
  }

  _fire(target, 'track', {
    state: info.state,
    x: touch.clientX,
    y: touch.clientY,
    dx: dx,
    dy: dy,
    ddx: ddx,
    ddy: ddy,
    sourceEvent: touch,
    hover: function () {
      return deepTargetFind(touch.clientX, touch.clientY);
    }
  });
}

register$1({
  name: 'tap',
  deps: ['mousedown', 'click', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['click', 'touchend']
  },
  emits: ['tap'],
  info: {
    x: NaN,
    y: NaN,
    prevent: false
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */reset: function () {
    this.info.x = NaN;
    this.info.y = NaN;
    this.info.prevent = false;
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */mousedown: function (e) {
    if (hasLeftMouseButton(e)) {
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */click: function (e) {
    if (hasLeftMouseButton(e)) {
      trackForward(this.info, e);
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchstart: function (e) {
    const touch = e.changedTouches[0];
    this.info.x = touch.clientX;
    this.info.y = touch.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */touchend: function (e) {
    trackForward(this.info, e.changedTouches[0], e);
  }
}); /**
     * @param {!GestureInfo} info
     * @param {Event | Touch} e
     * @param {Event=} preventer
     * @return {void}
     */

function trackForward(info, e, preventer) {
  let dx = Math.abs(e.clientX - info.x);
  let dy = Math.abs(e.clientY - info.y); // find original target from `preventer` for TouchEvents, or `e` for MouseEvents

  let t = _findOriginalTarget(preventer || e);

  if (!t || canBeDisabled[/** @type {!HTMLElement} */t.localName] && t.hasAttribute('disabled')) {
    return;
  } // dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`


  if (isNaN(dx) || isNaN(dy) || dx <= TAP_DISTANCE && dy <= TAP_DISTANCE || isSyntheticClick(e)) {
    // prevent taps from being generated if an event has canceled them
    if (!info.prevent) {
      _fire(t, 'tap', {
        x: e.clientX,
        y: e.clientY,
        sourceEvent: e,
        preventer: preventer
      });
    }
  }
} /* eslint-enable valid-jsdoc */ /** @deprecated */

const findOriginalTarget = _findOriginalTarget; /** @deprecated */
const add = addListener; /** @deprecated */
const remove = removeListener;
var gestures$0 = {
  gestures: gestures,
  recognizers: recognizers,
  deepTargetFind: deepTargetFind,
  addListener: addListener,
  removeListener: removeListener,
  register: register$1,
  setTouchAction: setTouchAction,
  prevent: prevent,
  resetMouseCanceller: resetMouseCanceller,
  findOriginalTarget: findOriginalTarget,
  add: add,
  remove: remove
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const gestures$1 = gestures$0; /**
                                * Element class mixin that provides API for adding Polymer's cross-platform
                                * gesture events to nodes.
                                *
                                * The API is designed to be compatible with override points implemented
                                * in `TemplateStamp` such that declarative event listeners in
                                * templates will support gesture events when this mixin is applied along with
                                * `TemplateStamp`.
                                *
                                * @mixinFunction
                                * @polymer
                                * @summary Element class mixin that provides API for adding Polymer's
                                *   cross-platform
                                * gesture events to nodes
                                */
const GestureEventListeners = dedupingMixin( /**
                                              * @template T
                                              * @param {function(new:T)} superClass Class to apply mixin to.
                                              * @return {function(new:T)} superClass with mixin applied.
                                              */superClass => {
  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_GestureEventListeners}
   */class GestureEventListeners extends superClass {
    /**
     * Add the event listener to the node if it is a gestures event.
     *
     * @param {!Node} node Node to add event listener to
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to add
     * @return {void}
     * @override
     */_addEventListenerToNode(node, eventName, handler) {
      if (!gestures$1.addListener(node, eventName, handler)) {
        super._addEventListenerToNode(node, eventName, handler);
      }
    } /**
       * Remove the event listener to the node if it is a gestures event.
       *
       * @param {!Node} node Node to remove event listener from
       * @param {string} eventName Name of event
       * @param {function(!Event):void} handler Listener function to remove
       * @return {void}
       * @override
       */

    _removeEventListenerFromNode(node, eventName, handler) {
      if (!gestures$1.removeListener(node, eventName, handler)) {
        super._removeEventListenerFromNode(node, eventName, handler);
      }
    }

  }

  return GestureEventListeners;
});
var gestureEventListeners = {
  GestureEventListeners: GestureEventListeners
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const HOST_DIR = /:host\(:dir\((ltr|rtl)\)\)/g;
const HOST_DIR_REPLACMENT = ':host([dir="$1"])';
const EL_DIR = /([\s\w-#\.\[\]\*]*):dir\((ltr|rtl)\)/g;
const EL_DIR_REPLACMENT = ':host([dir="$2"]) $1'; /**
                                                   * @type {!Array<!Polymer_DirMixin>}
                                                   */
const DIR_INSTANCES = []; /** @type {MutationObserver} */
let observer = null;
let DOCUMENT_DIR = '';

function getRTL() {
  DOCUMENT_DIR = document.documentElement.getAttribute('dir');
} /**
   * @param {!Polymer_DirMixin} instance Instance to set RTL status on
   */

function setRTL(instance) {
  if (!instance.__autoDirOptOut) {
    const el = /** @type {!HTMLElement} */instance;
    el.setAttribute('dir', DOCUMENT_DIR);
  }
}

function updateDirection() {
  getRTL();
  DOCUMENT_DIR = document.documentElement.getAttribute('dir');

  for (let i = 0; i < DIR_INSTANCES.length; i++) {
    setRTL(DIR_INSTANCES[i]);
  }
}

function takeRecords() {
  if (observer && observer.takeRecords().length) {
    updateDirection();
  }
} /**
   * Element class mixin that allows elements to use the `:dir` CSS Selector to
   * have text direction specific styling.
   *
   * With this mixin, any stylesheet provided in the template will transform
   * `:dir` into `:host([dir])` and sync direction with the page via the
   * element's `dir` attribute.
   *
   * Elements can opt out of the global page text direction by setting the `dir`
   * attribute directly in `ready()` or in HTML.
   *
   * Caveats:
   * - Applications must set `<html dir="ltr">` or `<html dir="rtl">` to sync
   *   direction
   * - Automatic left-to-right or right-to-left styling is sync'd with the
   *   `<html>` element only.
   * - Changing `dir` at runtime is supported.
   * - Opting out of the global direction styling is permanent
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin PropertyAccessors
   */

const DirMixin = dedupingMixin(base => {
  if (!observer) {
    getRTL();
    observer = new MutationObserver(updateDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    });
  } /**
     * @constructor
     * @extends {base}
     * @implements {Polymer_PropertyAccessors}
     * @private
     */

  const elementBase = PropertyAccessors(base); /**
                                                * @polymer
                                                * @mixinClass
                                                * @implements {Polymer_DirMixin}
                                                */

  class Dir extends elementBase {
    /**
     * @override
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     */static _processStyleText(cssText, baseURI) {
      cssText = super._processStyleText(cssText, baseURI);
      cssText = this._replaceDirInCssText(cssText);
      return cssText;
    } /**
       * Replace `:dir` in the given CSS text
       *
       * @param {string} text CSS text to replace DIR
       * @return {string} Modified CSS
       */

    static _replaceDirInCssText(text) {
      let replacedText = text;
      replacedText = replacedText.replace(HOST_DIR, HOST_DIR_REPLACMENT);
      replacedText = replacedText.replace(EL_DIR, EL_DIR_REPLACMENT);

      if (text !== replacedText) {
        this.__activateDir = true;
      }

      return replacedText;
    }

    constructor() {
      super(); /** @type {boolean} */
      this.__autoDirOptOut = false;
    } /**
       * @suppress {invalidCasts} Closure doesn't understand that `this` is an HTMLElement
       * @return {void}
       */

    ready() {
      super.ready();
      this.__autoDirOptOut = /** @type {!HTMLElement} */this.hasAttribute('dir');
    } /**
       * @suppress {missingProperties} If it exists on elementBase, it can be super'd
       * @return {void}
       */

    connectedCallback() {
      if (elementBase.prototype.connectedCallback) {
        super.connectedCallback();
      }

      if (this.constructor.__activateDir) {
        takeRecords();
        DIR_INSTANCES.push(this);
        setRTL(this);
      }
    } /**
       * @suppress {missingProperties} If it exists on elementBase, it can be super'd
       * @return {void}
       */

    disconnectedCallback() {
      if (elementBase.prototype.disconnectedCallback) {
        super.disconnectedCallback();
      }

      if (this.constructor.__activateDir) {
        const idx = DIR_INSTANCES.indexOf(this);

        if (idx > -1) {
          DIR_INSTANCES.splice(idx, 1);
        }
      }
    }

  }

  Dir.__activateDir = false;
  return Dir;
});
var dirMixin = {
  DirMixin: DirMixin
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
let scheduled = false;
let beforeRenderQueue = [];
let afterRenderQueue = [];

function schedule() {
  scheduled = true; // before next render

  requestAnimationFrame(function () {
    scheduled = false;
    flushQueue(beforeRenderQueue); // after the render

    setTimeout(function () {
      runQueue(afterRenderQueue);
    });
  });
}

function flushQueue(queue) {
  while (queue.length) {
    callMethod(queue.shift());
  }
}

function runQueue(queue) {
  for (let i = 0, l = queue.length; i < l; i++) {
    callMethod(queue.shift());
  }
}

function callMethod(info) {
  const context = info[0];
  const callback = info[1];
  const args = info[2];

  try {
    callback.apply(context, args);
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
}

function flush() {
  while (beforeRenderQueue.length || afterRenderQueue.length) {
    flushQueue(beforeRenderQueue);
    flushQueue(afterRenderQueue);
  }

  scheduled = false;
} /**
   * Module for scheduling flushable pre-render and post-render tasks.
   *
   * @summary Module for scheduling flushable pre-render and post-render tasks.
   */

`TODO(modulizer): A namespace named Polymer.RenderStatus was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`; /**
                                       * Enqueues a callback which will be run before the next render, at
                                       * `requestAnimationFrame` timing.
                                       *
                                       * This method is useful for enqueuing work that requires DOM measurement,
                                       * since measurement may not be reliable in custom element callbacks before
                                       * the first render, as well as for batching measurement tasks in general.
                                       *
                                       * Tasks in this queue may be flushed by calling `flush()`.
                                       *
                                       * @param {*} context Context object the callback function will be bound to
                                       * @param {function(...*):void} callback Callback function
                                       * @param {!Array=} args An array of arguments to call the callback function with
                                       * @return {void}
                                       */

function beforeNextRender(context, callback, args) {
  if (!scheduled) {
    schedule();
  }

  beforeRenderQueue.push([context, callback, args]);
} /**
   * Enqueues a callback which will be run after the next render, equivalent
   * to one task (`setTimeout`) after the next `requestAnimationFrame`.
   *
   * This method is useful for tuning the first-render performance of an
   * element or application by deferring non-critical work until after the
   * first paint.  Typical non-render-critical work may include adding UI
   * event listeners and aria attributes.
   *
   * @param {*} context Context object the callback function will be bound to
   * @param {function(...*):void} callback Callback function
   * @param {!Array=} args An array of arguments to call the callback function with
   * @return {void}
   */

function afterNextRender$1(context, callback, args) {
  if (!scheduled) {
    schedule();
  }

  afterRenderQueue.push([context, callback, args]);
}

var renderStatus = {
  beforeNextRender: beforeNextRender,
  afterNextRender: afterNextRender$1,
  flush: flush
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */

function resolve() {
  document.body.removeAttribute('unresolved');
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  resolve();
} else {
  window.addEventListener('DOMContentLoaded', resolve);
} /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

function newSplice(index, removed, addedCount) {
  return {
    index: index,
    removed: removed,
    addedCount: addedCount
  };
}

const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3; // Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' -> '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.

function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  // "Deletion" columns
  let rowCount = oldEnd - oldStart + 1;
  let columnCount = currentEnd - currentStart + 1;
  let distances = new Array(rowCount); // "Addition" rows. Initialize null column.

  for (let i = 0; i < rowCount; i++) {
    distances[i] = new Array(columnCount);
    distances[i][0] = i;
  } // Initialize null row


  for (let j = 0; j < columnCount; j++) distances[0][j] = j;

  for (let i = 1; i < rowCount; i++) {
    for (let j = 1; j < columnCount; j++) {
      if (equals(current[currentStart + j - 1], old[oldStart + i - 1])) distances[i][j] = distances[i - 1][j - 1];else {
        let north = distances[i - 1][j] + 1;
        let west = distances[i][j - 1] + 1;
        distances[i][j] = north < west ? north : west;
      }
    }
  }

  return distances;
} // This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.


function spliceOperationsFromEditDistances(distances) {
  let i = distances.length - 1;
  let j = distances[0].length - 1;
  let current = distances[i][j];
  let edits = [];

  while (i > 0 || j > 0) {
    if (i == 0) {
      edits.push(EDIT_ADD);
      j--;
      continue;
    }

    if (j == 0) {
      edits.push(EDIT_DELETE);
      i--;
      continue;
    }

    let northWest = distances[i - 1][j - 1];
    let west = distances[i - 1][j];
    let north = distances[i][j - 1];
    let min;
    if (west < north) min = west < northWest ? west : northWest;else min = north < northWest ? north : northWest;

    if (min == northWest) {
      if (northWest == current) {
        edits.push(EDIT_LEAVE);
      } else {
        edits.push(EDIT_UPDATE);
        current = northWest;
      }

      i--;
      j--;
    } else if (min == west) {
      edits.push(EDIT_DELETE);
      i--;
      current = west;
    } else {
      edits.push(EDIT_ADD);
      j--;
      current = north;
    }
  }

  edits.reverse();
  return edits;
} /**
   * Splice Projection functions:
   *
   * A splice map is a representation of how a previous array of items
   * was transformed into a new array of items. Conceptually it is a list of
   * tuples of
   *
   *   <index, removed, addedCount>
   *
   * which are kept in ascending index order of. The tuple represents that at
   * the |index|, |removed| sequence of items were removed, and counting forward
   * from |index|, |addedCount| items were added.
   */ /**
       * Lacking individual splice mutation information, the minimal set of
       * splices can be synthesized given the previous state and final state of an
       * array. The basic approach is to calculate the edit distance matrix and
       * choose the shortest path through it.
       *
       * Complexity: O(l * p)
       *   l: The length of the current array
       *   p: The length of the old array
       *
       * @param {!Array} current The current "changed" array for which to
       * calculate splices.
       * @param {number} currentStart Starting index in the `current` array for
       * which splices are calculated.
       * @param {number} currentEnd Ending index in the `current` array for
       * which splices are calculated.
       * @param {!Array} old The original "unchanged" array to compare `current`
       * against to determine splices.
       * @param {number} oldStart Starting index in the `old` array for
       * which splices are calculated.
       * @param {number} oldEnd Ending index in the `old` array for
       * which splices are calculated.
       * @return {!Array} Returns an array of splice record objects. Each of these
       * contains: `index` the location where the splice occurred; `removed`
       * the array of removed items from this location; `addedCount` the number
       * of items added at this location.
       */

function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  let prefixCount = 0;
  let suffixCount = 0;
  let splice;
  let minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
  if (currentStart == 0 && oldStart == 0) prefixCount = sharedPrefix(current, old, minLength);
  if (currentEnd == current.length && oldEnd == old.length) suffixCount = sharedSuffix(current, old, minLength - prefixCount);
  currentStart += prefixCount;
  oldStart += prefixCount;
  currentEnd -= suffixCount;
  oldEnd -= suffixCount;
  if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];

  if (currentStart == currentEnd) {
    splice = newSplice(currentStart, [], 0);

    while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);

    return [splice];
  } else if (oldStart == oldEnd) return [newSplice(currentStart, [], currentEnd - currentStart)];

  let ops = spliceOperationsFromEditDistances(calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
  splice = undefined;
  let splices = [];
  let index = currentStart;
  let oldIndex = oldStart;

  for (let i = 0; i < ops.length; i++) {
    switch (ops[i]) {
      case EDIT_LEAVE:
        if (splice) {
          splices.push(splice);
          splice = undefined;
        }

        index++;
        oldIndex++;
        break;

      case EDIT_UPDATE:
        if (!splice) splice = newSplice(index, [], 0);
        splice.addedCount++;
        index++;
        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;

      case EDIT_ADD:
        if (!splice) splice = newSplice(index, [], 0);
        splice.addedCount++;
        index++;
        break;

      case EDIT_DELETE:
        if (!splice) splice = newSplice(index, [], 0);
        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
    }
  }

  if (splice) {
    splices.push(splice);
  }

  return splices;
}

function sharedPrefix(current, old, searchLength) {
  for (let i = 0; i < searchLength; i++) if (!equals(current[i], old[i])) return i;

  return searchLength;
}

function sharedSuffix(current, old, searchLength) {
  let index1 = current.length;
  let index2 = old.length;
  let count = 0;

  while (count < searchLength && equals(current[--index1], old[--index2])) count++;

  return count;
} /**
   * Returns an array of splice records indicating the minimum edits required
   * to transform the `previous` array into the `current` array.
   *
   * Splice records are ordered by index and contain the following fields:
   * - `index`: index where edit started
   * - `removed`: array of removed items from this index
   * - `addedCount`: number of items added at this index
   *
   * This function is based on the Levenshtein "minimum edit distance"
   * algorithm. Note that updates are treated as removal followed by addition.
   *
   * The worst-case time complexity of this algorithm is `O(l * p)`
   *   l: The length of the current array
   *   p: The length of the previous array
   *
   * However, the worst-case complexity is reduced by an `O(n)` optimization
   * to detect any shared prefix & suffix between the two arrays and only
   * perform the more expensive minimum edit distance calculation over the
   * non-shared portions of the arrays.
   *
   * @function
   * @param {!Array} current The "changed" array for which splices will be
   * calculated.
   * @param {!Array} previous The "unchanged" original array to compare
   * `current` against to determine the splices.
   * @return {!Array} Returns an array of splice record objects. Each of these
   * contains: `index` the location where the splice occurred; `removed`
   * the array of removed items from this location; `addedCount` the number
   * of items added at this location.
   */

function calculateSplices(current, previous) {
  return calcSplices(current, 0, current.length, previous, 0, previous.length);
}

function equals(currentValue, previousValue) {
  return currentValue === previousValue;
}

var arraySplice = {
  calculateSplices: calculateSplices
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Returns true if `node` is a slot element
       * @param {Node} node Node to test.
       * @return {boolean} Returns true if the given `node` is a slot
       * @private
       */

function isSlot(node) {
  return node.localName === 'slot';
} /**
   * Class that listens for changes (additions or removals) to
   * "flattened nodes" on a given `node`. The list of flattened nodes consists
   * of a node's children and, for any children that are `<slot>` elements,
   * the expanded flattened list of `assignedNodes`.
   * For example, if the observed node has children `<a></a><slot></slot><b></b>`
   * and the `<slot>` has one `<div>` assigned to it, then the flattened
   * nodes list is `<a></a><div></div><b></b>`. If the `<slot>` has other
   * `<slot>` elements assigned to it, these are flattened as well.
   *
   * The provided `callback` is called whenever any change to this list
   * of flattened nodes occurs, where an addition or removal of a node is
   * considered a change. The `callback` is called with one argument, an object
   * containing an array of any `addedNodes` and `removedNodes`.
   *
   * Note: the callback is called asynchronous to any changes
   * at a microtask checkpoint. This is because observation is performed using
   * `MutationObserver` and the `<slot>` element's `slotchange` event which
   * are asynchronous.
   *
   * An example:
   * ```js
   * class TestSelfObserve extends PolymerElement {
   *   static get is() { return 'test-self-observe';}
   *   connectedCallback() {
   *     super.connectedCallback();
   *     this._observer = new FlattenedNodesObserver(this, (info) => {
   *       this.info = info;
   *     });
   *   }
   *   disconnectedCallback() {
   *     super.disconnectedCallback();
   *     this._observer.disconnect();
   *   }
   * }
   * customElements.define(TestSelfObserve.is, TestSelfObserve);
   * ```
   *
   * @summary Class that listens for changes (additions or removals) to
   * "flattened nodes" on a given `node`.
   */

class FlattenedNodesObserver {
  /**
   * Returns the list of flattened nodes for the given `node`.
   * This list consists of a node's children and, for any children
   * that are `<slot>` elements, the expanded flattened list of `assignedNodes`.
   * For example, if the observed node has children `<a></a><slot></slot><b></b>`
   * and the `<slot>` has one `<div>` assigned to it, then the flattened
   * nodes list is `<a></a><div></div><b></b>`. If the `<slot>` has other
   * `<slot>` elements assigned to it, these are flattened as well.
   *
   * @param {HTMLElement|HTMLSlotElement} node The node for which to return the list of flattened nodes.
   * @return {Array} The list of flattened nodes for the given `node`.
  */static getFlattenedNodes(node) {
    if (isSlot(node)) {
      node = /** @type {HTMLSlotElement} */node; // eslint-disable-line no-self-assign

      return node.assignedNodes({
        flatten: true
      });
    } else {
      return Array.from(node.childNodes).map(node => {
        if (isSlot(node)) {
          node = /** @type {HTMLSlotElement} */node; // eslint-disable-line no-self-assign

          return node.assignedNodes({
            flatten: true
          });
        } else {
          return [node];
        }
      }).reduce((a, b) => a.concat(b), []);
    }
  } /**
     * @param {Element} target Node on which to listen for changes.
     * @param {?function(!Element, { target: !Element, addedNodes: !Array<!Element>, removedNodes: !Array<!Element> }):void} callback Function called when there are additions
     * or removals from the target's list of flattened nodes.
    */

  constructor(target, callback) {
    /**
     * @type {MutationObserver}
     * @private
     */this._shadyChildrenObserver = null; /**
                                            * @type {MutationObserver}
                                            * @private
                                            */
    this._nativeChildrenObserver = null;
    this._connected = false; /**
                              * @type {Element}
                              * @private
                              */
    this._target = target;
    this.callback = callback;
    this._effectiveNodes = [];
    this._observer = null;
    this._scheduled = false; /**
                              * @type {function()}
                              * @private
                              */

    this._boundSchedule = () => {
      this._schedule();
    };

    this.connect();

    this._schedule();
  } /**
     * Activates an observer. This method is automatically called when
     * a `FlattenedNodesObserver` is created. It should only be called to
     * re-activate an observer that has been deactivated via the `disconnect` method.
     *
     * @return {void}
     */

  connect() {
    if (isSlot(this._target)) {
      this._listenSlots([this._target]);
    } else if (this._target.children) {
      this._listenSlots(this._target.children);

      if (window.ShadyDOM) {
        this._shadyChildrenObserver = ShadyDOM.observeChildren(this._target, mutations => {
          this._processMutations(mutations);
        });
      } else {
        this._nativeChildrenObserver = new MutationObserver(mutations => {
          this._processMutations(mutations);
        });

        this._nativeChildrenObserver.observe(this._target, {
          childList: true
        });
      }
    }

    this._connected = true;
  } /**
     * Deactivates the flattened nodes observer. After calling this method
     * the observer callback will not be called when changes to flattened nodes
     * occur. The `connect` method may be subsequently called to reactivate
     * the observer.
     *
     * @return {void}
     */

  disconnect() {
    if (isSlot(this._target)) {
      this._unlistenSlots([this._target]);
    } else if (this._target.children) {
      this._unlistenSlots(this._target.children);

      if (window.ShadyDOM && this._shadyChildrenObserver) {
        ShadyDOM.unobserveChildren(this._shadyChildrenObserver);
        this._shadyChildrenObserver = null;
      } else if (this._nativeChildrenObserver) {
        this._nativeChildrenObserver.disconnect();

        this._nativeChildrenObserver = null;
      }
    }

    this._connected = false;
  } /**
     * @return {void}
     * @private
     */

  _schedule() {
    if (!this._scheduled) {
      this._scheduled = true;
      microTask.run(() => this.flush());
    }
  } /**
     * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
     * @return {void}
     * @private
     */

  _processMutations(mutations) {
    this._processSlotMutations(mutations);

    this.flush();
  } /**
     * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
     * @return {void}
     * @private
     */

  _processSlotMutations(mutations) {
    if (mutations) {
      for (let i = 0; i < mutations.length; i++) {
        let mutation = mutations[i];

        if (mutation.addedNodes) {
          this._listenSlots(mutation.addedNodes);
        }

        if (mutation.removedNodes) {
          this._unlistenSlots(mutation.removedNodes);
        }
      }
    }
  } /**
     * Flushes the observer causing any pending changes to be immediately
     * delivered the observer callback. By default these changes are delivered
     * asynchronously at the next microtask checkpoint.
     *
     * @return {boolean} Returns true if any pending changes caused the observer
     * callback to run.
     */

  flush() {
    if (!this._connected) {
      return false;
    }

    if (window.ShadyDOM) {
      ShadyDOM.flush();
    }

    if (this._nativeChildrenObserver) {
      this._processSlotMutations(this._nativeChildrenObserver.takeRecords());
    } else if (this._shadyChildrenObserver) {
      this._processSlotMutations(this._shadyChildrenObserver.takeRecords());
    }

    this._scheduled = false;
    let info = {
      target: this._target,
      addedNodes: [],
      removedNodes: []
    };
    let newNodes = this.constructor.getFlattenedNodes(this._target);
    let splices = calculateSplices(newNodes, this._effectiveNodes); // process removals

    for (let i = 0, s; i < splices.length && (s = splices[i]); i++) {
      for (let j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
        info.removedNodes.push(n);
      }
    } // process adds


    for (let i = 0, s; i < splices.length && (s = splices[i]); i++) {
      for (let j = s.index; j < s.index + s.addedCount; j++) {
        info.addedNodes.push(newNodes[j]);
      }
    } // update cache


    this._effectiveNodes = newNodes;
    let didFlush = false;

    if (info.addedNodes.length || info.removedNodes.length) {
      didFlush = true;
      this.callback.call(this._target, info);
    }

    return didFlush;
  } /**
     * @param {!Array<Element|Node>|!NodeList<Node>} nodeList Nodes that could change
     * @return {void}
     * @private
     */

  _listenSlots(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      let n = nodeList[i];

      if (isSlot(n)) {
        n.addEventListener('slotchange', this._boundSchedule);
      }
    }
  } /**
     * @param {!Array<Element|Node>|!NodeList<Node>} nodeList Nodes that could change
     * @return {void}
     * @private
     */

  _unlistenSlots(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      let n = nodeList[i];

      if (isSlot(n)) {
        n.removeEventListener('slotchange', this._boundSchedule);
      }
    }
  }

}

var flattenedNodesObserver = {
  FlattenedNodesObserver: FlattenedNodesObserver
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
let debouncerQueue = []; /**
                          * Adds a `Debouncer` to a list of globally flushable tasks.
                          *
                          * @param {!Debouncer} debouncer Debouncer to enqueue
                          * @return {void}
                          */

const enqueueDebouncer = function (debouncer) {
  debouncerQueue.push(debouncer);
};

function flushDebouncers() {
  const didFlush = Boolean(debouncerQueue.length);

  while (debouncerQueue.length) {
    try {
      debouncerQueue.shift().flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  }

  return didFlush;
} /**
   * Forces several classes of asynchronously queued tasks to flush:
   * - Debouncers added via `enqueueDebouncer`
   * - ShadyDOM distribution
   *
   * @return {void}
   */

const flush$1 = function () {
  let shadyDOM, debouncers;

  do {
    shadyDOM = window.ShadyDOM && ShadyDOM.flush();

    if (window.ShadyCSS && window.ShadyCSS.ScopingShim) {
      window.ShadyCSS.ScopingShim.flush();
    }

    debouncers = flushDebouncers();
  } while (shadyDOM || debouncers);
};

var flush$2 = {
  enqueueDebouncer: enqueueDebouncer,
  flush: flush$1
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
const p = Element.prototype; /**
                              * @const {function(this:Node, string): boolean}
                              */
const normalizedMatchesSelector = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector; /**
                                                                                                                                                                   * Cross-platform `element.matches` shim.
                                                                                                                                                                   *
                                                                                                                                                                   * @function matchesSelector
                                                                                                                                                                   * @param {!Node} node Node to check selector against
                                                                                                                                                                   * @param {string} selector Selector to match
                                                                                                                                                                   * @return {boolean} True if node matched selector
                                                                                                                                                                   */

const matchesSelector = function (node, selector) {
  return normalizedMatchesSelector.call(node, selector);
}; /**
    * Node API wrapper class returned from `Polymer.dom.(target)` when
    * `target` is a `Node`.
    *
    */

class DomApi {
  /**
   * @param {Node} node Node for which to create a Polymer.dom helper object.
   */constructor(node) {
    this.node = node;
  } /**
     * Returns an instance of `Polymer.FlattenedNodesObserver` that
     * listens for node changes on this element.
     *
     * @param {function(!Element, { target: !Element, addedNodes: !Array<!Element>, removedNodes: !Array<!Element> }):void} callback Called when direct or distributed children
     *   of this element changes
     * @return {!FlattenedNodesObserver} Observer instance
     */

  observeNodes(callback) {
    return new FlattenedNodesObserver(this.node, callback);
  } /**
     * Disconnects an observer previously created via `observeNodes`
     *
     * @param {!FlattenedNodesObserver} observerHandle Observer instance
     *   to disconnect.
     * @return {void}
     */

  unobserveNodes(observerHandle) {
    observerHandle.disconnect();
  } /**
     * Provided as a backwards-compatible API only.  This method does nothing.
     * @return {void}
     */

  notifyObserver() {} /**
                       * Returns true if the provided node is contained with this element's
                       * light-DOM children or shadow root, including any nested shadow roots
                       * of children therein.
                       *
                       * @param {Node} node Node to test
                       * @return {boolean} Returns true if the given `node` is contained within
                       *   this element's light or shadow DOM.
                       */

  deepContains(node) {
    if (this.node.contains(node)) {
      return true;
    }

    let n = node;
    let doc = node.ownerDocument; // walk from node to `this` or `document`

    while (n && n !== doc && n !== this.node) {
      // use logical parentnode, or native ShadowRoot host
      n = n.parentNode || n.host;
    }

    return n === this.node;
  } /**
     * Returns the root node of this node.  Equivalent to `getRootNode()`.
     *
     * @return {Node} Top most element in the dom tree in which the node
     * exists. If the node is connected to a document this is either a
     * shadowRoot or the document; otherwise, it may be the node
     * itself or a node or document fragment containing it.
     */

  getOwnerRoot() {
    return this.node.getRootNode();
  } /**
     * For slot elements, returns the nodes assigned to the slot; otherwise
     * an empty array. It is equivalent to `<slot>.addignedNodes({flatten:true})`.
     *
     * @return {!Array<!Node>} Array of assigned nodes
     */

  getDistributedNodes() {
    return this.node.localName === 'slot' ? this.node.assignedNodes({
      flatten: true
    }) : [];
  } /**
     * Returns an array of all slots this element was distributed to.
     *
     * @return {!Array<!HTMLSlotElement>} Description
     */

  getDestinationInsertionPoints() {
    let ip$ = [];
    let n = this.node.assignedSlot;

    while (n) {
      ip$.push(n);
      n = n.assignedSlot;
    }

    return ip$;
  } /**
     * Calls `importNode` on the `ownerDocument` for this node.
     *
     * @param {!Node} node Node to import
     * @param {boolean} deep True if the node should be cloned deeply during
     *   import
     * @return {Node} Clone of given node imported to this owner document
     */

  importNode(node, deep) {
    let doc = this.node instanceof Document ? this.node : this.node.ownerDocument;
    return doc.importNode(node, deep);
  } /**
     * @return {!Array<!Node>} Returns a flattened list of all child nodes and
     * nodes assigned to child slots.
     */

  getEffectiveChildNodes() {
    return FlattenedNodesObserver.getFlattenedNodes(this.node);
  } /**
     * Returns a filtered list of flattened child elements for this element based
     * on the given selector.
     *
     * @param {string} selector Selector to filter nodes against
     * @return {!Array<!HTMLElement>} List of flattened child elements
     */

  queryDistributedElements(selector) {
    let c$ = this.getEffectiveChildNodes();
    let list = [];

    for (let i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
      if (c.nodeType === Node.ELEMENT_NODE && matchesSelector(c, selector)) {
        list.push(c);
      }
    }

    return list;
  } /**
     * For shadow roots, returns the currently focused element within this
     * shadow root.
     *
     * @return {Node|undefined} Currently focused element
     */

  get activeElement() {
    let node = this.node;
    return node._activeElement !== undefined ? node._activeElement : node.activeElement;
  }

}

function forwardMethods(proto, methods) {
  for (let i = 0; i < methods.length; i++) {
    let method = methods[i]; /* eslint-disable valid-jsdoc */

    proto[method] = /** @this {DomApi} */function () {
      return this.node[method].apply(this.node, arguments);
    }; /* eslint-enable */
  }
}

function forwardReadOnlyProperties(proto, properties) {
  for (let i = 0; i < properties.length; i++) {
    let name = properties[i];
    Object.defineProperty(proto, name, {
      get: function () {
        const domApi = /** @type {DomApi} */this;
        return domApi.node[name];
      },
      configurable: true
    });
  }
}

function forwardProperties(proto, properties) {
  for (let i = 0; i < properties.length; i++) {
    let name = properties[i];
    Object.defineProperty(proto, name, {
      get: function () {
        const domApi = /** @type {DomApi} */this;
        return domApi.node[name];
      },
      set: function (value) {
        /** @type {DomApi} */this.node[name] = value;
      },
      configurable: true
    });
  }
} /**
   * Event API wrapper class returned from `Polymer.dom.(target)` when
   * `target` is an `Event`.
   */

class EventApi {
  constructor(event) {
    this.event = event;
  } /**
     * Returns the first node on the `composedPath` of this event.
     *
     * @return {!EventTarget} The node this event was dispatched to
     */

  get rootTarget() {
    return this.event.composedPath()[0];
  } /**
     * Returns the local (re-targeted) target for this event.
     *
     * @return {!EventTarget} The local (re-targeted) target for this event.
     */

  get localTarget() {
    return this.event.target;
  } /**
     * Returns the `composedPath` for this event.
     * @return {!Array<!EventTarget>} The nodes this event propagated through
     */

  get path() {
    return this.event.composedPath();
  }

} /**
   * @function
   * @param {boolean=} deep
   * @return {!Node}
   */

DomApi.prototype.cloneNode; /**
                             * @function
                             * @param {!Node} node
                             * @return {!Node}
                             */
DomApi.prototype.appendChild; /**
                               * @function
                               * @param {!Node} newChild
                               * @param {Node} refChild
                               * @return {!Node}
                               */
DomApi.prototype.insertBefore; /**
                                * @function
                                * @param {!Node} node
                                * @return {!Node}
                                */
DomApi.prototype.removeChild; /**
                               * @function
                               * @param {!Node} oldChild
                               * @param {!Node} newChild
                               * @return {!Node}
                               */
DomApi.prototype.replaceChild; /**
                                * @function
                                * @param {string} name
                                * @param {string} value
                                * @return {void}
                                */
DomApi.prototype.setAttribute; /**
                                * @function
                                * @param {string} name
                                * @return {void}
                                */
DomApi.prototype.removeAttribute; /**
                                   * @function
                                   * @param {string} selector
                                   * @return {?Element}
                                   */
DomApi.prototype.querySelector; /**
                                 * @function
                                 * @param {string} selector
                                 * @return {!NodeList<!Element>}
                                 */
DomApi.prototype.querySelectorAll; /** @type {?Node} */
DomApi.prototype.parentNode; /** @type {?Node} */
DomApi.prototype.firstChild; /** @type {?Node} */
DomApi.prototype.lastChild; /** @type {?Node} */
DomApi.prototype.nextSibling; /** @type {?Node} */
DomApi.prototype.previousSibling; /** @type {?HTMLElement} */
DomApi.prototype.firstElementChild; /** @type {?HTMLElement} */
DomApi.prototype.lastElementChild; /** @type {?HTMLElement} */
DomApi.prototype.nextElementSibling; /** @type {?HTMLElement} */
DomApi.prototype.previousElementSibling; /** @type {!Array<!Node>} */
DomApi.prototype.childNodes; /** @type {!Array<!HTMLElement>} */
DomApi.prototype.children; /** @type {?DOMTokenList} */
DomApi.prototype.classList; /** @type {string} */
DomApi.prototype.textContent; /** @type {string} */
DomApi.prototype.innerHTML;
forwardMethods(DomApi.prototype, ['cloneNode', 'appendChild', 'insertBefore', 'removeChild', 'replaceChild', 'setAttribute', 'removeAttribute', 'querySelector', 'querySelectorAll']);
forwardReadOnlyProperties(DomApi.prototype, ['parentNode', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling', 'firstElementChild', 'lastElementChild', 'nextElementSibling', 'previousElementSibling', 'childNodes', 'children', 'classList']);
forwardProperties(DomApi.prototype, ['textContent', 'innerHTML']); /**
                                                                    * Legacy DOM and Event manipulation API wrapper factory used to abstract
                                                                    * differences between native Shadow DOM and "Shady DOM" when polyfilling on
                                                                    * older browsers.
                                                                    *
                                                                    * Note that in Polymer 2.x use of `Polymer.dom` is no longer required and
                                                                    * in the majority of cases simply facades directly to the standard native
                                                                    * API.
                                                                    *
                                                                    * @summary Legacy DOM and Event manipulation API wrapper factory used to
                                                                    * abstract differences between native Shadow DOM and "Shady DOM."
                                                                    * @param {(Node|Event)=} obj Node or event to operate on
                                                                    * @return {!DomApi|!EventApi} Wrapper providing either node API or event API
                                                                    */

const dom$1 = function (obj) {
  obj = obj || document;

  if (!obj.__domApi) {
    let helper;

    if (obj instanceof Event) {
      helper = new EventApi(obj);
    } else {
      helper = new DomApi(obj);
    }

    obj.__domApi = helper;
  }

  return obj.__domApi;
};

var polymer_dom = {
  matchesSelector: matchesSelector,
  DomApi: DomApi,
  dom: dom$1,
  flush: flush$1,
  addDebouncer: enqueueDebouncer
};
const bundledImportMeta$1 = { ...import.meta,
  url: new URL('../node_modules/%40polymer/polymer/lib/legacy/legacy-element-mixin.js', import.meta.url).href
};
let styleInterface = window.ShadyCSS; /**
                                       * Element class mixin that provides Polymer's "legacy" API intended to be
                                       * backward-compatible to the greatest extent possible with the API
                                       * found on the Polymer 1.x `Polymer.Base` prototype applied to all elements
                                       * defined using the `Polymer({...})` function.
                                       *
                                       * @mixinFunction
                                       * @polymer
                                       * @appliesMixin ElementMixin
                                       * @appliesMixin GestureEventListeners
                                       * @property isAttached {boolean} Set to `true` in this element's
                                       *   `connectedCallback` and `false` in `disconnectedCallback`
                                       * @summary Element class mixin that provides Polymer's "legacy" API
                                       */
const LegacyElementMixin = dedupingMixin(base => {
  /**
   * @constructor
   * @extends {base}
   * @implements {Polymer_ElementMixin}
   * @implements {Polymer_GestureEventListeners}
   * @implements {Polymer_DirMixin}
   * @private
   */const legacyElementBase = DirMixin(GestureEventListeners(ElementMixin(base))); /**
                                                                                     * Map of simple names to touch action names
                                                                                     * @dict
                                                                                     */
  const DIRECTION_MAP = {
    'x': 'pan-x',
    'y': 'pan-y',
    'none': 'none',
    'all': 'auto'
  }; /**
      * @polymer
      * @mixinClass
      * @extends {legacyElementBase}
      * @implements {Polymer_LegacyElementMixin}
      * @unrestricted
      */

  class LegacyElement extends legacyElementBase {
    constructor() {
      super(); /** @type {boolean} */
      this.isAttached; /** @type {WeakMap<!Element, !Object<string, !Function>>} */
      this.__boundListeners; /** @type {Object<string, Function>} */
      this._debouncers; // Ensure listeners are applied immediately so that they are
      // added before declarative event listeners. This allows an element to
      // decorate itself via an event prior to any declarative listeners
      // seeing the event. Note, this ensures compatibility with 1.x ordering.

      this._applyListeners();
    } /**
       * Forwards `importMeta` from the prototype (i.e. from the info object
       * passed to `Polymer({...})`) to the static API.
       *
       * @return {!Object} The `import.meta` object set on the prototype
       * @suppress {missingProperties} `this` is always in the instance in
       *  closure for some reason even in a static method, rather than the class
       */

    static get importMeta() {
      return this.prototype.importMeta;
    } /**
       * Legacy callback called during the `constructor`, for overriding
       * by the user.
       * @return {void}
       */

    created() {} /**
                  * Provides an implementation of `connectedCallback`
                  * which adds Polymer legacy API's `attached` method.
                  * @return {void}
                  * @override
                  */

    connectedCallback() {
      super.connectedCallback();
      this.isAttached = true;
      this.attached();
    } /**
       * Legacy callback called during `connectedCallback`, for overriding
       * by the user.
       * @return {void}
       */

    attached() {} /**
                   * Provides an implementation of `disconnectedCallback`
                   * which adds Polymer legacy API's `detached` method.
                   * @return {void}
                   * @override
                   */

    disconnectedCallback() {
      super.disconnectedCallback();
      this.isAttached = false;
      this.detached();
    } /**
       * Legacy callback called during `disconnectedCallback`, for overriding
       * by the user.
       * @return {void}
       */

    detached() {} /**
                   * Provides an override implementation of `attributeChangedCallback`
                   * which adds the Polymer legacy API's `attributeChanged` method.
                   * @param {string} name Name of attribute.
                   * @param {?string} old Old value of attribute.
                   * @param {?string} value Current value of attribute.
                   * @param {?string} namespace Attribute namespace.
                   * @return {void}
                   * @override
                   */

    attributeChangedCallback(name, old, value, namespace) {
      if (old !== value) {
        super.attributeChangedCallback(name, old, value, namespace);
        this.attributeChanged(name, old, value);
      }
    } /**
       * Legacy callback called during `attributeChangedChallback`, for overriding
       * by the user.
       * @param {string} name Name of attribute.
       * @param {?string} old Old value of attribute.
       * @param {?string} value Current value of attribute.
       * @return {void}
       */

    attributeChanged(name, old, value) {} // eslint-disable-line no-unused-vars
    /**
     * Overrides the default `Polymer.PropertyEffects` implementation to
     * add support for class initialization via the `_registered` callback.
     * This is called only when the first instance of the element is created.
     *
     * @return {void}
     * @override
     * @suppress {invalidCasts}
     */

    _initializeProperties() {
      let proto = Object.getPrototypeOf(this);

      if (!proto.hasOwnProperty('__hasRegisterFinished')) {
        proto.__hasRegisterFinished = true;

        this._registered();
      }

      super._initializeProperties();

      this.root = /** @type {HTMLElement} */this;
      this.created();
    } /**
       * Called automatically when an element is initializing.
       * Users may override this method to perform class registration time
       * work. The implementation should ensure the work is performed
       * only once for the class.
       * @protected
       * @return {void}
       */

    _registered() {} /**
                      * Overrides the default `Polymer.PropertyEffects` implementation to
                      * add support for installing `hostAttributes` and `listeners`.
                      *
                      * @return {void}
                      * @override
                      */

    ready() {
      this._ensureAttributes();

      super.ready();
    } /**
       * Ensures an element has required attributes. Called when the element
       * is being readied via `ready`. Users should override to set the
       * element's required attributes. The implementation should be sure
       * to check and not override existing attributes added by
       * the user of the element. Typically, setting attributes should be left
       * to the element user and not done here; reasonable exceptions include
       * setting aria roles and focusability.
       * @protected
       * @return {void}
       */

    _ensureAttributes() {} /**
                            * Adds element event listeners. Called when the element
                            * is being readied via `ready`. Users should override to
                            * add any required element event listeners.
                            * In performance critical elements, the work done here should be kept
                            * to a minimum since it is done before the element is rendered. In
                            * these elements, consider adding listeners asynchronously so as not to
                            * block render.
                            * @protected
                            * @return {void}
                            */

    _applyListeners() {} /**
                          * Converts a typed JavaScript value to a string.
                          *
                          * Note this method is provided as backward-compatible legacy API
                          * only.  It is not directly called by any Polymer features. To customize
                          * how properties are serialized to attributes for attribute bindings and
                          * `reflectToAttribute: true` properties as well as this method, override
                          * the `_serializeValue` method provided by `Polymer.PropertyAccessors`.
                          *
                          * @param {*} value Value to deserialize
                          * @return {string | undefined} Serialized value
                          */

    serialize(value) {
      return this._serializeValue(value);
    } /**
       * Converts a string to a typed JavaScript value.
       *
       * Note this method is provided as backward-compatible legacy API
       * only.  It is not directly called by any Polymer features.  To customize
       * how attributes are deserialized to properties for in
       * `attributeChangedCallback`, override `_deserializeValue` method
       * provided by `Polymer.PropertyAccessors`.
       *
       * @param {string} value String to deserialize
       * @param {*} type Type to deserialize the string to
       * @return {*} Returns the deserialized value in the `type` given.
       */

    deserialize(value, type) {
      return this._deserializeValue(value, type);
    } /**
       * Serializes a property to its associated attribute.
       *
       * Note this method is provided as backward-compatible legacy API
       * only.  It is not directly called by any Polymer features.
       *
       * @param {string} property Property name to reflect.
       * @param {string=} attribute Attribute name to reflect.
       * @param {*=} value Property value to reflect.
       * @return {void}
       */

    reflectPropertyToAttribute(property, attribute, value) {
      this._propertyToAttribute(property, attribute, value);
    } /**
       * Sets a typed value to an HTML attribute on a node.
       *
       * Note this method is provided as backward-compatible legacy API
       * only.  It is not directly called by any Polymer features.
       *
       * @param {*} value Value to serialize.
       * @param {string} attribute Attribute name to serialize to.
       * @param {Element} node Element to set attribute to.
       * @return {void}
       */

    serializeValueToAttribute(value, attribute, node) {
      this._valueToNodeAttribute( /** @type {Element} */node || this, value, attribute);
    } /**
       * Copies own properties (including accessor descriptors) from a source
       * object to a target object.
       *
       * @param {Object} prototype Target object to copy properties to.
       * @param {Object} api Source object to copy properties from.
       * @return {Object} prototype object that was passed as first argument.
       */

    extend(prototype, api) {
      if (!(prototype && api)) {
        return prototype || api;
      }

      let n$ = Object.getOwnPropertyNames(api);

      for (let i = 0, n; i < n$.length && (n = n$[i]); i++) {
        let pd = Object.getOwnPropertyDescriptor(api, n);

        if (pd) {
          Object.defineProperty(prototype, n, pd);
        }
      }

      return prototype;
    } /**
       * Copies props from a source object to a target object.
       *
       * Note, this method uses a simple `for...in` strategy for enumerating
       * properties.  To ensure only `ownProperties` are copied from source
       * to target and that accessor implementations are copied, use `extend`.
       *
       * @param {!Object} target Target object to copy properties to.
       * @param {!Object} source Source object to copy properties from.
       * @return {!Object} Target object that was passed as first argument.
       */

    mixin(target, source) {
      for (let i in source) {
        target[i] = source[i];
      }

      return target;
    } /**
       * Sets the prototype of an object.
       *
       * Note this method is provided as backward-compatible legacy API
       * only.  It is not directly called by any Polymer features.
       * @param {Object} object The object on which to set the prototype.
       * @param {Object} prototype The prototype that will be set on the given
       * `object`.
       * @return {Object} Returns the given `object` with its prototype set
       * to the given `prototype` object.
       */

    chainObject(object, prototype) {
      if (object && prototype && object !== prototype) {
        object.__proto__ = prototype;
      }

      return object;
    } /* **** Begin Template **** */ /**
                                      * Calls `importNode` on the `content` of the `template` specified and
                                      * returns a document fragment containing the imported content.
                                      *
                                      * @param {HTMLTemplateElement} template HTML template element to instance.
                                      * @return {!DocumentFragment} Document fragment containing the imported
                                      *   template content.
                                     */

    instanceTemplate(template) {
      let content = this.constructor._contentForTemplate(template);

      let dom$$1 = /** @type {!DocumentFragment} */document.importNode(content, true);
      return dom$$1;
    } /* **** Begin Events **** */ /**
                                    * Dispatches a custom event with an optional detail value.
                                    *
                                    * @param {string} type Name of event type.
                                    * @param {*=} detail Detail value containing event-specific
                                    *   payload.
                                    * @param {{ bubbles: (boolean|undefined), cancelable: (boolean|undefined), composed: (boolean|undefined) }=}
                                    *  options Object specifying options.  These may include:
                                    *  `bubbles` (boolean, defaults to `true`),
                                    *  `cancelable` (boolean, defaults to false), and
                                    *  `node` on which to fire the event (HTMLElement, defaults to `this`).
                                    * @return {!Event} The new event that was fired.
                                    */

    fire(type, detail, options) {
      options = options || {};
      detail = detail === null || detail === undefined ? {} : detail;
      let event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed
      });
      event.detail = detail;
      let node = options.node || this;
      node.dispatchEvent(event);
      return event;
    } /**
       * Convenience method to add an event listener on a given element,
       * late bound to a named method on this element.
       *
       * @param {Element} node Element to add event listener to.
       * @param {string} eventName Name of event to listen for.
       * @param {string} methodName Name of handler method on `this` to call.
       * @return {void}
       */

    listen(node, eventName, methodName) {
      node = /** @type {!Element} */node || this;
      let hbl = this.__boundListeners || (this.__boundListeners = new WeakMap());
      let bl = hbl.get(node);

      if (!bl) {
        bl = {};
        hbl.set(node, bl);
      }

      let key = eventName + methodName;

      if (!bl[key]) {
        bl[key] = this._addMethodEventListenerToNode(node, eventName, methodName, this);
      }
    } /**
       * Convenience method to remove an event listener from a given element,
       * late bound to a named method on this element.
       *
       * @param {Element} node Element to remove event listener from.
       * @param {string} eventName Name of event to stop listening to.
       * @param {string} methodName Name of handler method on `this` to not call
       anymore.
       * @return {void}
       */

    unlisten(node, eventName, methodName) {
      node = /** @type {!Element} */node || this;

      let bl = this.__boundListeners && this.__boundListeners.get(node);

      let key = eventName + methodName;
      let handler = bl && bl[key];

      if (handler) {
        this._removeEventListenerFromNode(node, eventName, handler);

        bl[key] = null;
      }
    } /**
       * Override scrolling behavior to all direction, one direction, or none.
       *
       * Valid scroll directions:
       *   - 'all': scroll in any direction
       *   - 'x': scroll only in the 'x' direction
       *   - 'y': scroll only in the 'y' direction
       *   - 'none': disable scrolling for this node
       *
       * @param {string=} direction Direction to allow scrolling
       * Defaults to `all`.
       * @param {Element=} node Element to apply scroll direction setting.
       * Defaults to `this`.
       * @return {void}
       */

    setScrollDirection(direction, node) {
      setTouchAction( /** @type {Element} */node || this, DIRECTION_MAP[direction] || 'auto');
    } /* **** End Events **** */ /**
                                  * Convenience method to run `querySelector` on this local DOM scope.
                                  *
                                  * This function calls `Polymer.dom(this.root).querySelector(slctr)`.
                                  *
                                  * @param {string} slctr Selector to run on this local DOM scope
                                  * @return {Element} Element found by the selector, or null if not found.
                                  */

    $$(slctr) {
      return this.root.querySelector(slctr);
    } /**
       * Return the element whose local dom within which this element
       * is contained. This is a shorthand for
       * `this.getRootNode().host`.
       * @this {Element}
       */

    get domHost() {
      let root$$1 = this.getRootNode();
      return root$$1 instanceof DocumentFragment ? /** @type {ShadowRoot} */root$$1.host : root$$1;
    } /**
       * Force this element to distribute its children to its local dom.
       * This should not be necessary as of Polymer 2.0.2 and is provided only
       * for backwards compatibility.
       * @return {void}
       */

    distributeContent() {
      if (window.ShadyDOM && this.shadowRoot) {
        ShadyDOM.flush();
      }
    } /**
       * Returns a list of nodes that are the effective childNodes. The effective
       * childNodes list is the same as the element's childNodes except that
       * any `<content>` elements are replaced with the list of nodes distributed
       * to the `<content>`, the result of its `getDistributedNodes` method.
       * @return {!Array<!Node>} List of effective child nodes.
       * @suppress {invalidCasts} LegacyElementMixin must be applied to an HTMLElement
       */

    getEffectiveChildNodes() {
      const thisEl = /** @type {Element} */this;
      const domApi = /** @type {DomApi} */dom$1(thisEl);
      return domApi.getEffectiveChildNodes();
    } /**
       * Returns a list of nodes distributed within this element that match
       * `selector`. These can be dom children or elements distributed to
       * children that are insertion points.
       * @param {string} selector Selector to run.
       * @return {!Array<!Node>} List of distributed elements that match selector.
       * @suppress {invalidCasts} LegacyElementMixin must be applied to an HTMLElement
       */

    queryDistributedElements(selector) {
      const thisEl = /** @type {Element} */this;
      const domApi = /** @type {DomApi} */dom$1(thisEl);
      return domApi.queryDistributedElements(selector);
    } /**
       * Returns a list of elements that are the effective children. The effective
       * children list is the same as the element's children except that
       * any `<content>` elements are replaced with the list of elements
       * distributed to the `<content>`.
       *
       * @return {!Array<!Node>} List of effective children.
       */

    getEffectiveChildren() {
      let list = this.getEffectiveChildNodes();
      return list.filter(function ( /** @type {!Node} */n) {
        return n.nodeType === Node.ELEMENT_NODE;
      });
    } /**
       * Returns a string of text content that is the concatenation of the
       * text content's of the element's effective childNodes (the elements
       * returned by <a href="#getEffectiveChildNodes>getEffectiveChildNodes</a>.
       *
       * @return {string} List of effective children.
       */

    getEffectiveTextContent() {
      let cn = this.getEffectiveChildNodes();
      let tc = [];

      for (let i = 0, c; c = cn[i]; i++) {
        if (c.nodeType !== Node.COMMENT_NODE) {
          tc.push(c.textContent);
        }
      }

      return tc.join('');
    } /**
       * Returns the first effective childNode within this element that
       * match `selector`. These can be dom child nodes or elements distributed
       * to children that are insertion points.
       * @param {string} selector Selector to run.
       * @return {Node} First effective child node that matches selector.
       */

    queryEffectiveChildren(selector) {
      let e$ = this.queryDistributedElements(selector);
      return e$ && e$[0];
    } /**
       * Returns a list of effective childNodes within this element that
       * match `selector`. These can be dom child nodes or elements distributed
       * to children that are insertion points.
       * @param {string} selector Selector to run.
       * @return {!Array<!Node>} List of effective child nodes that match selector.
       */

    queryAllEffectiveChildren(selector) {
      return this.queryDistributedElements(selector);
    } /**
       * Returns a list of nodes distributed to this element's `<slot>`.
       *
       * If this element contains more than one `<slot>` in its local DOM,
       * an optional selector may be passed to choose the desired content.
       *
       * @param {string=} slctr CSS selector to choose the desired
       *   `<slot>`.  Defaults to `content`.
       * @return {!Array<!Node>} List of distributed nodes for the `<slot>`.
       */

    getContentChildNodes(slctr) {
      let content = this.root.querySelector(slctr || 'slot');
      return content ? /** @type {DomApi} */dom$1(content).getDistributedNodes() : [];
    } /**
       * Returns a list of element children distributed to this element's
       * `<slot>`.
       *
       * If this element contains more than one `<slot>` in its
       * local DOM, an optional selector may be passed to choose the desired
       * content.  This method differs from `getContentChildNodes` in that only
       * elements are returned.
       *
       * @param {string=} slctr CSS selector to choose the desired
       *   `<content>`.  Defaults to `content`.
       * @return {!Array<!HTMLElement>} List of distributed nodes for the
       *   `<slot>`.
       * @suppress {invalidCasts}
       */

    getContentChildren(slctr) {
      let children = /** @type {!Array<!HTMLElement>} */this.getContentChildNodes(slctr).filter(function (n) {
        return n.nodeType === Node.ELEMENT_NODE;
      });
      return children;
    } /**
       * Checks whether an element is in this element's light DOM tree.
       *
       * @param {?Node} node The element to be checked.
       * @return {boolean} true if node is in this element's light DOM tree.
       * @suppress {invalidCasts} LegacyElementMixin must be applied to an HTMLElement
       */

    isLightDescendant(node) {
      const thisNode = /** @type {Node} */this;
      return thisNode !== node && thisNode.contains(node) && thisNode.getRootNode() === node.getRootNode();
    } /**
       * Checks whether an element is in this element's local DOM tree.
       *
       * @param {!Element} node The element to be checked.
       * @return {boolean} true if node is in this element's local DOM tree.
       */

    isLocalDescendant(node) {
      return this.root === node.getRootNode();
    } /**
       * No-op for backwards compatibility. This should now be handled by
       * ShadyCss library.
       * @param  {*} container Unused
       * @param  {*} shouldObserve Unused
       * @return {void}
       */

    scopeSubtree(container, shouldObserve) {} // eslint-disable-line no-unused-vars
    /**
     * Returns the computed style value for the given property.
     * @param {string} property The css property name.
     * @return {string} Returns the computed css property value for the given
     * `property`.
     * @suppress {invalidCasts} LegacyElementMixin must be applied to an HTMLElement
     */

    getComputedStyleValue(property) {
      return styleInterface.getComputedStyleValue( /** @type {!Element} */this, property);
    } // debounce
    /**
     * Call `debounce` to collapse multiple requests for a named task into
     * one invocation which is made after the wait time has elapsed with
     * no new request.  If no wait time is given, the callback will be called
     * at microtask timing (guaranteed before paint).
     *
     *     debouncedClickAction(e) {
     *       // will not call `processClick` more than once per 100ms
     *       this.debounce('click', function() {
     *        this.processClick();
     *       } 100);
     *     }
     *
     * @param {string} jobName String to identify the debounce job.
     * @param {function():void} callback Function that is called (with `this`
     *   context) when the wait time elapses.
     * @param {number} wait Optional wait time in milliseconds (ms) after the
     *   last signal that must elapse before invoking `callback`
     * @return {!Object} Returns a debouncer object on which exists the
     * following methods: `isActive()` returns true if the debouncer is
     * active; `cancel()` cancels the debouncer if it is active;
     * `flush()` immediately invokes the debounced callback if the debouncer
     * is active.
     */

    debounce(jobName, callback, wait) {
      this._debouncers = this._debouncers || {};
      return this._debouncers[jobName] = Debouncer.debounce(this._debouncers[jobName], wait > 0 ? timeOut.after(wait) : microTask, callback.bind(this));
    } /**
       * Returns whether a named debouncer is active.
       *
       * @param {string} jobName The name of the debouncer started with `debounce`
       * @return {boolean} Whether the debouncer is active (has not yet fired).
       */

    isDebouncerActive(jobName) {
      this._debouncers = this._debouncers || {};
      let debouncer = this._debouncers[jobName];
      return !!(debouncer && debouncer.isActive());
    } /**
       * Immediately calls the debouncer `callback` and inactivates it.
       *
       * @param {string} jobName The name of the debouncer started with `debounce`
       * @return {void}
       */

    flushDebouncer(jobName) {
      this._debouncers = this._debouncers || {};
      let debouncer = this._debouncers[jobName];

      if (debouncer) {
        debouncer.flush();
      }
    } /**
       * Cancels an active debouncer.  The `callback` will not be called.
       *
       * @param {string} jobName The name of the debouncer started with `debounce`
       * @return {void}
       */

    cancelDebouncer(jobName) {
      this._debouncers = this._debouncers || {};
      let debouncer = this._debouncers[jobName];

      if (debouncer) {
        debouncer.cancel();
      }
    } /**
       * Runs a callback function asynchronously.
       *
       * By default (if no waitTime is specified), async callbacks are run at
       * microtask timing, which will occur before paint.
       *
       * @param {!Function} callback The callback function to run, bound to `this`.
       * @param {number=} waitTime Time to wait before calling the
       *   `callback`.  If unspecified or 0, the callback will be run at microtask
       *   timing (before paint).
       * @return {number} Handle that may be used to cancel the async job.
       */

    async(callback, waitTime) {
      return waitTime > 0 ? timeOut.run(callback.bind(this), waitTime) : ~microTask.run(callback.bind(this));
    } /**
       * Cancels an async operation started with `async`.
       *
       * @param {number} handle Handle returned from original `async` call to
       *   cancel.
       * @return {void}
       */

    cancelAsync(handle) {
      handle < 0 ? microTask.cancel(~handle) : timeOut.cancel(handle);
    } // other
    /**
     * Convenience method for creating an element and configuring it.
     *
     * @param {string} tag HTML element tag to create.
     * @param {Object=} props Object of properties to configure on the
     *    instance.
     * @return {!Element} Newly created and configured element.
     */

    create(tag, props) {
      let elt = document.createElement(tag);

      if (props) {
        if (elt.setProperties) {
          elt.setProperties(props);
        } else {
          for (let n in props) {
            elt[n] = props[n];
          }
        }
      }

      return elt;
    } /**
       * Polyfill for Element.prototype.matches, which is sometimes still
       * prefixed.
       *
       * @param {string} selector Selector to test.
       * @param {!Element=} node Element to test the selector against.
       * @return {boolean} Whether the element matches the selector.
       */

    elementMatches(selector, node) {
      return matchesSelector(node || this, selector);
    } /**
       * Toggles an HTML attribute on or off.
       *
       * @param {string} name HTML attribute name
       * @param {boolean=} bool Boolean to force the attribute on or off.
       *    When unspecified, the state of the attribute will be reversed.
       * @param {Element=} node Node to target.  Defaults to `this`.
       * @return {void}
       */

    toggleAttribute(name, bool, node) {
      node = /** @type {Element} */node || this;

      if (arguments.length == 1) {
        bool = !node.hasAttribute(name);
      }

      if (bool) {
        node.setAttribute(name, '');
      } else {
        node.removeAttribute(name);
      }
    } /**
       * Toggles a CSS class on or off.
       *
       * @param {string} name CSS class name
       * @param {boolean=} bool Boolean to force the class on or off.
       *    When unspecified, the state of the class will be reversed.
       * @param {Element=} node Node to target.  Defaults to `this`.
       * @return {void}
       */

    toggleClass(name, bool, node) {
      node = /** @type {Element} */node || this;

      if (arguments.length == 1) {
        bool = !node.classList.contains(name);
      }

      if (bool) {
        node.classList.add(name);
      } else {
        node.classList.remove(name);
      }
    } /**
       * Cross-platform helper for setting an element's CSS `transform` property.
       *
       * @param {string} transformText Transform setting.
       * @param {Element=} node Element to apply the transform to.
       * Defaults to `this`
       * @return {void}
       */

    transform(transformText, node) {
      node = /** @type {Element} */node || this;
      node.style.webkitTransform = transformText;
      node.style.transform = transformText;
    } /**
       * Cross-platform helper for setting an element's CSS `translate3d`
       * property.
       *
       * @param {number} x X offset.
       * @param {number} y Y offset.
       * @param {number} z Z offset.
       * @param {Element=} node Element to apply the transform to.
       * Defaults to `this`.
       * @return {void}
       */

    translate3d(x, y, z, node) {
      node = /** @type {Element} */node || this;
      this.transform('translate3d(' + x + ',' + y + ',' + z + ')', node);
    } /**
       * Removes an item from an array, if it exists.
       *
       * If the array is specified by path, a change notification is
       * generated, so that observers, data bindings and computed
       * properties watching that path can update.
       *
       * If the array is passed directly, **no change
       * notification is generated**.
       *
       * @param {string | !Array<number|string>} arrayOrPath Path to array from which to remove the item
       *   (or the array itself).
       * @param {*} item Item to remove.
       * @return {Array} Array containing item removed.
       */

    arrayDelete(arrayOrPath, item) {
      let index;

      if (Array.isArray(arrayOrPath)) {
        index = arrayOrPath.indexOf(item);

        if (index >= 0) {
          return arrayOrPath.splice(index, 1);
        }
      } else {
        let arr = get(this, arrayOrPath);
        index = arr.indexOf(item);

        if (index >= 0) {
          return this.splice(arrayOrPath, index, 1);
        }
      }

      return null;
    } // logging
    /**
     * Facades `console.log`/`warn`/`error` as override point.
     *
     * @param {string} level One of 'log', 'warn', 'error'
     * @param {Array} args Array of strings or objects to log
     * @return {void}
     */

    _logger(level, args) {
      // accept ['foo', 'bar'] and [['foo', 'bar']]
      if (Array.isArray(args) && args.length === 1 && Array.isArray(args[0])) {
        args = args[0];
      }

      switch (level) {
        case 'log':
        case 'warn':
        case 'error':
          console[level](...args);
      }
    } /**
       * Facades `console.log` as an override point.
       *
       * @param {...*} args Array of strings or objects to log
       * @return {void}
       */

    _log(...args) {
      this._logger('log', args);
    } /**
       * Facades `console.warn` as an override point.
       *
       * @param {...*} args Array of strings or objects to log
       * @return {void}
       */

    _warn(...args) {
      this._logger('warn', args);
    } /**
       * Facades `console.error` as an override point.
       *
       * @param {...*} args Array of strings or objects to log
       * @return {void}
       */

    _error(...args) {
      this._logger('error', args);
    } /**
       * Formats a message using the element type an a method name.
       *
       * @param {string} methodName Method name to associate with message
       * @param {...*} args Array of strings or objects to log
       * @return {Array} Array with formatting information for `console`
       *   logging.
       */

    _logf(methodName, ...args) {
      return ['[%s::%s]', this.is, methodName, ...args];
    }

  }

  LegacyElement.prototype.is = '';
  return LegacyElement;
});
var legacyElementMixin = {
  LegacyElementMixin: LegacyElementMixin
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
let metaProps = {
  attached: true,
  detached: true,
  ready: true,
  created: true,
  beforeRegister: true,
  registered: true,
  attributeChanged: true,
  // meta objects
  behaviors: true
}; /**
    * Applies a "legacy" behavior or array of behaviors to the provided class.
    *
    * Note: this method will automatically also apply the `LegacyElementMixin`
    * to ensure that any legacy behaviors can rely on legacy Polymer API on
    * the underlying element.
    *
    * @function
    * @template T
    * @param {!Object|!Array<!Object>} behaviors Behavior object or array of behaviors.
    * @param {function(new:T)} klass Element class.
    * @return {function(new:T)} Returns a new Element class extended by the
    * passed in `behaviors` and also by `LegacyElementMixin`.
    * @suppress {invalidCasts, checkTypes}
    */

function mixinBehaviors(behaviors, klass) {
  if (!behaviors) {
    klass = /** @type {HTMLElement} */klass; // eslint-disable-line no-self-assign

    return klass;
  } // NOTE: ensure the behavior is extending a class with
  // legacy element api. This is necessary since behaviors expect to be able
  // to access 1.x legacy api.


  klass = LegacyElementMixin(klass);

  if (!Array.isArray(behaviors)) {
    behaviors = [behaviors];
  }

  let superBehaviors = klass.prototype.behaviors; // get flattened, deduped list of behaviors *not* already on super class

  behaviors = flattenBehaviors(behaviors, null, superBehaviors); // mixin new behaviors

  klass = _mixinBehaviors(behaviors, klass);

  if (superBehaviors) {
    behaviors = superBehaviors.concat(behaviors);
  } // Set behaviors on prototype for BC...


  klass.prototype.behaviors = behaviors;
  return klass;
} // NOTE:
// 1.x
// Behaviors were mixed in *in reverse order* and de-duped on the fly.
// The rule was that behavior properties were copied onto the element
// prototype if and only if the property did not already exist.
// Given: Polymer{ behaviors: [A, B, C, A, B]}, property copy order was:
// (1), B, (2), A, (3) C. This means prototype properties win over
// B properties win over A win over C. This mirrors what would happen
// with inheritance if element extended B extended A extended C.
//
// Again given, Polymer{ behaviors: [A, B, C, A, B]}, the resulting
// `behaviors` array was [C, A, B].
// Behavior lifecycle methods were called in behavior array order
// followed by the element, e.g. (1) C.created, (2) A.created,
// (3) B.created, (4) element.created. There was no support for
// super, and "super-behavior" methods were callable only by name).
//
// 2.x
// Behaviors are made into proper mixins which live in the
// element's prototype chain. Behaviors are placed in the element prototype
// eldest to youngest and de-duped youngest to oldest:
// So, first [A, B, C, A, B] becomes [C, A, B] then,
// the element prototype becomes (oldest) (1) PolymerElement, (2) class(C),
// (3) class(A), (4) class(B), (5) class(Polymer({...})).
// Result:
// This means element properties win over B properties win over A win
// over C. (same as 1.x)
// If lifecycle is called (super then me), order is
// (1) C.created, (2) A.created, (3) B.created, (4) element.created
// (again same as 1.x)


function _mixinBehaviors(behaviors, klass) {
  for (let i = 0; i < behaviors.length; i++) {
    let b = behaviors[i];

    if (b) {
      klass = Array.isArray(b) ? _mixinBehaviors(b, klass) : GenerateClassFromInfo(b, klass);
    }
  }

  return klass;
} /**
   * @param {Array} behaviors List of behaviors to flatten.
   * @param {Array=} list Target list to flatten behaviors into.
   * @param {Array=} exclude List of behaviors to exclude from the list.
   * @return {!Array} Returns the list of flattened behaviors.
   */

function flattenBehaviors(behaviors, list, exclude) {
  list = list || [];

  for (let i = behaviors.length - 1; i >= 0; i--) {
    let b = behaviors[i];

    if (b) {
      if (Array.isArray(b)) {
        flattenBehaviors(b, list);
      } else {
        // dedup
        if (list.indexOf(b) < 0 && (!exclude || exclude.indexOf(b) < 0)) {
          list.unshift(b);
        }
      }
    } else {
      console.warn('behavior is null, check for missing or 404 import');
    }
  }

  return list;
} /**
   * @param {!PolymerInit} info Polymer info object
   * @param {function(new:HTMLElement)} Base base class to extend with info object
   * @return {function(new:HTMLElement)} Generated class
   * @suppress {checkTypes}
   * @private
   */

function GenerateClassFromInfo(info, Base) {
  /** @private */class PolymerGenerated extends Base {
    static get properties() {
      return info.properties;
    }

    static get observers() {
      return info.observers;
    } /**
       * @return {HTMLTemplateElement} template for this class
       */

    static get template() {
      // get template first from any imperative set in `info._template`
      return info._template || // next look in dom-module associated with this element's is.
      DomModule && DomModule.import(this.is, 'template') || // next look for superclass template (note: use superclass symbol
      // to ensure correct `this.is`)
      Base.template || // finally fall back to `_template` in element's prototype.
      this.prototype._template || null;
    } /**
       * @return {void}
       */

    created() {
      super.created();

      if (info.created) {
        info.created.call(this);
      }
    } /**
       * @return {void}
       */

    _registered() {
      super._registered(); /* NOTE: `beforeRegister` is called here for bc, but the behavior
                            is different than in 1.x. In 1.0, the method was called *after*
                            mixing prototypes together but *before* processing of meta-objects.
                            However, dynamic effects can still be set here and can be done either
                            in `beforeRegister` or `registered`. It is no longer possible to set
                            `is` in `beforeRegister` as you could in 1.x.
                           */

      if (info.beforeRegister) {
        info.beforeRegister.call(Object.getPrototypeOf(this));
      }

      if (info.registered) {
        info.registered.call(Object.getPrototypeOf(this));
      }
    } /**
       * @return {void}
       */

    _applyListeners() {
      super._applyListeners();

      if (info.listeners) {
        for (let l in info.listeners) {
          this._addMethodEventListenerToNode(this, l, info.listeners[l]);
        }
      }
    } // note: exception to "super then me" rule;
    // do work before calling super so that super attributes
    // only apply if not already set.
    /**
     * @return {void}
     */

    _ensureAttributes() {
      if (info.hostAttributes) {
        for (let a in info.hostAttributes) {
          this._ensureAttribute(a, info.hostAttributes[a]);
        }
      }

      super._ensureAttributes();
    } /**
       * @return {void}
       */

    ready() {
      super.ready();

      if (info.ready) {
        info.ready.call(this);
      }
    } /**
       * @return {void}
       */

    attached() {
      super.attached();

      if (info.attached) {
        info.attached.call(this);
      }
    } /**
       * @return {void}
       */

    detached() {
      super.detached();

      if (info.detached) {
        info.detached.call(this);
      }
    } /**
       * Implements native Custom Elements `attributeChangedCallback` to
       * set an attribute value to a property via `_attributeToProperty`.
       *
       * @param {string} name Name of attribute that changed
       * @param {?string} old Old attribute value
       * @param {?string} value New attribute value
       * @return {void}
       */

    attributeChanged(name, old, value) {
      super.attributeChanged(name, old, value);

      if (info.attributeChanged) {
        info.attributeChanged.call(this, name, old, value);
      }
    }

  }

  PolymerGenerated.generatedFrom = info;

  for (let p in info) {
    // NOTE: cannot copy `metaProps` methods onto prototype at least because
    // `super.ready` must be called and is not included in the user fn.
    if (!(p in metaProps)) {
      let pd = Object.getOwnPropertyDescriptor(info, p);

      if (pd) {
        Object.defineProperty(PolymerGenerated.prototype, p, pd);
      }
    }
  }

  return PolymerGenerated;
} /**
   * Generates a class that extends `LegacyElement` based on the
   * provided info object.  Metadata objects on the `info` object
   * (`properties`, `observers`, `listeners`, `behaviors`, `is`) are used
   * for Polymer's meta-programming systems, and any functions are copied
   * to the generated class.
   *
   * Valid "metadata" values are as follows:
   *
   * `is`: String providing the tag name to register the element under. In
   * addition, if a `dom-module` with the same id exists, the first template
   * in that `dom-module` will be stamped into the shadow root of this element,
   * with support for declarative event listeners (`on-...`), Polymer data
   * bindings (`[[...]]` and `{{...}}`), and id-based node finding into
   * `this.$`.
   *
   * `properties`: Object describing property-related metadata used by Polymer
   * features (key: property names, value: object containing property metadata).
   * Valid keys in per-property metadata include:
   * - `type` (String|Number|Object|Array|...): Used by
   *   `attributeChangedCallback` to determine how string-based attributes
   *   are deserialized to JavaScript property values.
   * - `notify` (boolean): Causes a change in the property to fire a
   *   non-bubbling event called `<property>-changed`. Elements that have
   *   enabled two-way binding to the property use this event to observe changes.
   * - `readOnly` (boolean): Creates a getter for the property, but no setter.
   *   To set a read-only property, use the private setter method
   *   `_setProperty(property, value)`.
   * - `observer` (string): Observer method name that will be called when
   *   the property changes. The arguments of the method are
   *   `(value, previousValue)`.
   * - `computed` (string): String describing method and dependent properties
   *   for computing the value of this property (e.g. `'computeFoo(bar, zot)'`).
   *   Computed properties are read-only by default and can only be changed
   *   via the return value of the computing method.
   *
   * `observers`: Array of strings describing multi-property observer methods
   *  and their dependent properties (e.g. `'observeABC(a, b, c)'`).
   *
   * `listeners`: Object describing event listeners to be added to each
   *  instance of this element (key: event name, value: method name).
   *
   * `behaviors`: Array of additional `info` objects containing metadata
   * and callbacks in the same format as the `info` object here which are
   * merged into this element.
   *
   * `hostAttributes`: Object listing attributes to be applied to the host
   *  once created (key: attribute name, value: attribute value).  Values
   *  are serialized based on the type of the value.  Host attributes should
   *  generally be limited to attributes such as `tabIndex` and `aria-...`.
   *  Attributes in `hostAttributes` are only applied if a user-supplied
   *  attribute is not already present (attributes in markup override
   *  `hostAttributes`).
   *
   * In addition, the following Polymer-specific callbacks may be provided:
   * - `registered`: called after first instance of this element,
   * - `created`: called during `constructor`
   * - `attached`: called during `connectedCallback`
   * - `detached`: called during `disconnectedCallback`
   * - `ready`: called before first `attached`, after all properties of
   *   this element have been propagated to its template and all observers
   *   have run
   *
   * @param {!PolymerInit} info Object containing Polymer metadata and functions
   *   to become class methods.
   * @return {function(new:HTMLElement)} Generated class
   */

const Class = function (info) {
  if (!info) {
    console.warn(`Polymer's Class function requires \`info\` argument`);
  }

  let klass = GenerateClassFromInfo(info, info.behaviors ? // note: mixinBehaviors ensures `LegacyElementMixin`.
  mixinBehaviors(info.behaviors, HTMLElement) : LegacyElementMixin(HTMLElement)); // decorate klass with registration info

  klass.is = info.is;
  return klass;
};

var _class = {
  mixinBehaviors: mixinBehaviors,
  Class: Class
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Legacy class factory and registration helper for defining Polymer
       * elements.
       *
       * This method is equivalent to
       *
       *     import {Class} from '@polymer/polymer/lib/legacy/class.js';
       *     customElements.define(info.is, Class(info));
       *
       * See `Class` for details on valid legacy metadata format for `info`.
       *
       * @global
       * @override
       * @function
       * @param {!PolymerInit} info Object containing Polymer metadata and functions
       *   to become class methods.
       * @return {function(new: HTMLElement)} Generated class
       * @suppress {duplicate, invalidCasts, checkTypes}
       */

const Polymer = function (info) {
  // if input is a `class` (aka a function with a prototype), use the prototype
  // remember that the `constructor` will never be called
  let klass;

  if (typeof info === 'function') {
    klass = info;
  } else {
    klass = Polymer.Class(info);
  }

  customElements.define(klass.is, /** @type {!HTMLElement} */klass);
  return klass;
};

Polymer.Class = Class;
var polymerFn = {
  Polymer: Polymer
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // Common implementation for mixin & behavior

function mutablePropertyChange(inst, property, value, old, mutableData) {
  let isObject;

  if (mutableData) {
    isObject = typeof value === 'object' && value !== null; // Pull `old` for Objects from temp cache, but treat `null` as a primitive

    if (isObject) {
      old = inst.__dataTemp[property];
    }
  } // Strict equality check, but return false for NaN===NaN


  let shouldChange = old !== value && (old === old || value === value); // Objects are stored in temporary cache (cleared at end of
  // turn), which is used for dirty-checking

  if (isObject && shouldChange) {
    inst.__dataTemp[property] = value;
  }

  return shouldChange;
} /**
   * Element class mixin to skip strict dirty-checking for objects and arrays
   * (always consider them to be "dirty"), for use on elements utilizing
   * `PropertyEffects`
   *
   * By default, `PropertyEffects` performs strict dirty checking on
   * objects, which means that any deep modifications to an object or array will
   * not be propagated unless "immutable" data patterns are used (i.e. all object
   * references from the root to the mutation were changed).
   *
   * Polymer also provides a proprietary data mutation and path notification API
   * (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient
   * mutation and notification of deep changes in an object graph to all elements
   * bound to the same object graph.
   *
   * In cases where neither immutable patterns nor the data mutation API can be
   * used, applying this mixin will cause Polymer to skip dirty checking for
   * objects and arrays (always consider them to be "dirty").  This allows a
   * user to make a deep modification to a bound object graph, and then either
   * simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath`
   * (e.g. `this.notifyPath('items')`) to update the tree.  Note that all
   * elements that wish to be updated based on deep mutations must apply this
   * mixin or otherwise skip strict dirty checking for objects/arrays.
   * Specifically, any elements in the binding tree between the source of a
   * mutation and the consumption of it must apply this mixin or enable the
   * `OptionalMutableData` mixin.
   *
   * In order to make the dirty check strategy configurable, see
   * `OptionalMutableData`.
   *
   * Note, the performance characteristics of propagating large object graphs
   * will be worse as opposed to using strict dirty checking with immutable
   * patterns or Polymer's path notification API.
   *
   * @mixinFunction
   * @polymer
   * @summary Element class mixin to skip strict dirty-checking for objects
   *   and arrays
   */

const MutableData = dedupingMixin(superClass => {
  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_MutableData}
   */class MutableData extends superClass {
    /**
     * Overrides `PropertyEffects` to provide option for skipping
     * strict equality checking for Objects and Arrays.
     *
     * This method pulls the value to dirty check against from the `__dataTemp`
     * cache (rather than the normal `__data` cache) for Objects.  Since the temp
     * cache is cleared at the end of a turn, this implementation allows
     * side-effects of deep object changes to be processed by re-setting the
     * same object (using the temp cache as an in-turn backstop to prevent
     * cycles due to 2-way notification).
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     * @protected
     */_shouldPropertyChange(property, value, old) {
      return mutablePropertyChange(this, property, value, old, true);
    }

  }

  return MutableData;
}); /**
     * Element class mixin to add the optional ability to skip strict
     * dirty-checking for objects and arrays (always consider them to be
     * "dirty") by setting a `mutable-data` attribute on an element instance.
     *
     * By default, `PropertyEffects` performs strict dirty checking on
     * objects, which means that any deep modifications to an object or array will
     * not be propagated unless "immutable" data patterns are used (i.e. all object
     * references from the root to the mutation were changed).
     *
     * Polymer also provides a proprietary data mutation and path notification API
     * (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient
     * mutation and notification of deep changes in an object graph to all elements
     * bound to the same object graph.
     *
     * In cases where neither immutable patterns nor the data mutation API can be
     * used, applying this mixin will allow Polymer to skip dirty checking for
     * objects and arrays (always consider them to be "dirty").  This allows a
     * user to make a deep modification to a bound object graph, and then either
     * simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath`
     * (e.g. `this.notifyPath('items')`) to update the tree.  Note that all
     * elements that wish to be updated based on deep mutations must apply this
     * mixin or otherwise skip strict dirty checking for objects/arrays.
     * Specifically, any elements in the binding tree between the source of a
     * mutation and the consumption of it must enable this mixin or apply the
     * `MutableData` mixin.
     *
     * While this mixin adds the ability to forgo Object/Array dirty checking,
     * the `mutableData` flag defaults to false and must be set on the instance.
     *
     * Note, the performance characteristics of propagating large object graphs
     * will be worse by relying on `mutableData: true` as opposed to using
     * strict dirty checking with immutable patterns or Polymer's path notification
     * API.
     *
     * @mixinFunction
     * @polymer
     * @summary Element class mixin to optionally skip strict dirty-checking
     *   for objects and arrays
     */
const OptionalMutableData = dedupingMixin(superClass => {
  /**
   * @mixinClass
   * @polymer
   * @implements {Polymer_OptionalMutableData}
   */class OptionalMutableData extends superClass {
    static get properties() {
      return {
        /**
         * Instance-level flag for configuring the dirty-checking strategy
         * for this element.  When true, Objects and Arrays will skip dirty
         * checking, otherwise strict equality checking will be used.
         */mutableData: Boolean
      };
    } /**
       * Overrides `PropertyEffects` to provide option for skipping
       * strict equality checking for Objects and Arrays.
       *
       * When `this.mutableData` is true on this instance, this method
       * pulls the value to dirty check against from the `__dataTemp` cache
       * (rather than the normal `__data` cache) for Objects.  Since the temp
       * cache is cleared at the end of a turn, this implementation allows
       * side-effects of deep object changes to be processed by re-setting the
       * same object (using the temp cache as an in-turn backstop to prevent
       * cycles due to 2-way notification).
       *
       * @param {string} property Property name
       * @param {*} value New property value
       * @param {*} old Previous property value
       * @return {boolean} Whether the property should be considered a change
       * @protected
       */

    _shouldPropertyChange(property, value, old) {
      return mutablePropertyChange(this, property, value, old, this.mutableData);
    }

  }

  return OptionalMutableData;
}); // Export for use by legacy behavior

MutableData._mutablePropertyChange = mutablePropertyChange;
var mutableData = {
  MutableData: MutableData,
  OptionalMutableData: OptionalMutableData
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // Base class for HTMLTemplateElement extension that has property effects
// machinery for propagating host properties to children. This is an ES5
// class only because Babel (incorrectly) requires super() in the class
// constructor even though no `this` is used and it returns an instance.

let newInstance = null; /**
                         * @constructor
                         * @extends {HTMLTemplateElement}
                         * @private
                         */

function HTMLTemplateElementExtension() {
  return newInstance;
}

HTMLTemplateElementExtension.prototype = Object.create(HTMLTemplateElement.prototype, {
  constructor: {
    value: HTMLTemplateElementExtension,
    writable: true
  }
}); /**
     * @constructor
     * @implements {Polymer_PropertyEffects}
     * @extends {HTMLTemplateElementExtension}
     * @private
     */
const DataTemplate = PropertyEffects(HTMLTemplateElementExtension); /**
                                                                     * @constructor
                                                                     * @implements {Polymer_MutableData}
                                                                     * @extends {DataTemplate}
                                                                     * @private
                                                                     */
const MutableDataTemplate = MutableData(DataTemplate); // Applies a DataTemplate subclass to a <template> instance

function upgradeTemplate(template, constructor) {
  newInstance = template;
  Object.setPrototypeOf(template, constructor.prototype);
  new constructor();
  newInstance = null;
} /**
   * Base class for TemplateInstance.
   * @constructor
   * @implements {Polymer_PropertyEffects}
   * @private
   */

const base = PropertyEffects(class {}); /**
                                         * @polymer
                                         * @customElement
                                         * @appliesMixin PropertyEffects
                                         * @unrestricted
                                         */

class TemplateInstanceBase extends base {
  constructor(props) {
    super();

    this._configureProperties(props);

    this.root = this._stampTemplate(this.__dataHost); // Save list of stamped children

    let children = this.children = [];

    for (let n = this.root.firstChild; n; n = n.nextSibling) {
      children.push(n);
      n.__templatizeInstance = this;
    }

    if (this.__templatizeOwner && this.__templatizeOwner.__hideTemplateChildren__) {
      this._showHideChildren(true);
    } // Flush props only when props are passed if instance props exist
    // or when there isn't instance props.


    let options = this.__templatizeOptions;

    if (props && options.instanceProps || !options.instanceProps) {
      this._enableProperties();
    }
  } /**
     * Configure the given `props` by calling `_setPendingProperty`. Also
     * sets any properties stored in `__hostProps`.
     * @private
     * @param {Object} props Object of property name-value pairs to set.
     * @return {void}
     */

  _configureProperties(props) {
    let options = this.__templatizeOptions;

    if (options.forwardHostProp) {
      for (let hprop in this.__hostProps) {
        this._setPendingProperty(hprop, this.__dataHost['_host_' + hprop]);
      }
    } // Any instance props passed in the constructor will overwrite host props;
    // normally this would be a user error but we don't specifically filter them


    for (let iprop in props) {
      this._setPendingProperty(iprop, props[iprop]);
    }
  } /**
     * Forwards a host property to this instance.  This method should be
     * called on instances from the `options.forwardHostProp` callback
     * to propagate changes of host properties to each instance.
     *
     * Note this method enqueues the change, which are flushed as a batch.
     *
     * @param {string} prop Property or path name
     * @param {*} value Value of the property to forward
     * @return {void}
     */

  forwardHostProp(prop, value) {
    if (this._setPendingPropertyOrPath(prop, value, false, true)) {
      this.__dataHost._enqueueClient(this);
    }
  } /**
     * Override point for adding custom or simulated event handling.
     *
     * @param {!Node} node Node to add event listener to
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to add
     * @return {void}
     */

  _addEventListenerToNode(node, eventName, handler) {
    if (this._methodHost && this.__templatizeOptions.parentModel) {
      // If this instance should be considered a parent model, decorate
      // events this template instance as `model`
      this._methodHost._addEventListenerToNode(node, eventName, e => {
        e.model = this;
        handler(e);
      });
    } else {
      // Otherwise delegate to the template's host (which could be)
      // another template instance
      let templateHost = this.__dataHost.__dataHost;

      if (templateHost) {
        templateHost._addEventListenerToNode(node, eventName, handler);
      }
    }
  } /**
     * Shows or hides the template instance top level child elements. For
     * text nodes, `textContent` is removed while "hidden" and replaced when
     * "shown."
     * @param {boolean} hide Set to true to hide the children;
     * set to false to show them.
     * @return {void}
     * @protected
     */

  _showHideChildren(hide) {
    let c = this.children;

    for (let i = 0; i < c.length; i++) {
      let n = c[i]; // Ignore non-changes

      if (Boolean(hide) != Boolean(n.__hideTemplateChildren__)) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (hide) {
            n.__polymerTextContent__ = n.textContent;
            n.textContent = '';
          } else {
            n.textContent = n.__polymerTextContent__;
          } // remove and replace slot

        } else if (n.localName === 'slot') {
          if (hide) {
            n.__polymerReplaced__ = document.createComment('hidden-slot');
            n.parentNode.replaceChild(n.__polymerReplaced__, n);
          } else {
            const replace = n.__polymerReplaced__;

            if (replace) {
              replace.parentNode.replaceChild(n, replace);
            }
          }
        } else if (n.style) {
          if (hide) {
            n.__polymerDisplay__ = n.style.display;
            n.style.display = 'none';
          } else {
            n.style.display = n.__polymerDisplay__;
          }
        }
      }

      n.__hideTemplateChildren__ = hide;

      if (n._showHideChildren) {
        n._showHideChildren(hide);
      }
    }
  } /**
     * Overrides default property-effects implementation to intercept
     * textContent bindings while children are "hidden" and cache in
     * private storage for later retrieval.
     *
     * @param {!Node} node The node to set a property on
     * @param {string} prop The property to set
     * @param {*} value The value to set
     * @return {void}
     * @protected
     */

  _setUnmanagedPropertyToNode(node, prop, value) {
    if (node.__hideTemplateChildren__ && node.nodeType == Node.TEXT_NODE && prop == 'textContent') {
      node.__polymerTextContent__ = value;
    } else {
      super._setUnmanagedPropertyToNode(node, prop, value);
    }
  } /**
     * Find the parent model of this template instance.  The parent model
     * is either another templatize instance that had option `parentModel: true`,
     * or else the host element.
     *
     * @return {!Polymer_PropertyEffects} The parent model of this instance
     */

  get parentModel() {
    let model = this.__parentModel;

    if (!model) {
      let options;
      model = this;

      do {
        // A template instance's `__dataHost` is a <template>
        // `model.__dataHost.__dataHost` is the template's host
        model = model.__dataHost.__dataHost;
      } while ((options = model.__templatizeOptions) && !options.parentModel);

      this.__parentModel = model;
    }

    return model;
  } /**
     * Stub of HTMLElement's `dispatchEvent`, so that effects that may
     * dispatch events safely no-op.
     *
     * @param {Event} event Event to dispatch
     * @return {boolean} Always true.
     */

  dispatchEvent(event) {
    // eslint-disable-line no-unused-vars
    return true;
  }

} /** @type {!DataTemplate} */

TemplateInstanceBase.prototype.__dataHost; /** @type {!TemplatizeOptions} */
TemplateInstanceBase.prototype.__templatizeOptions; /** @type {!Polymer_PropertyEffects} */
TemplateInstanceBase.prototype._methodHost; /** @type {!Object} */
TemplateInstanceBase.prototype.__templatizeOwner; /** @type {!Object} */
TemplateInstanceBase.prototype.__hostProps; /**
                                             * @constructor
                                             * @extends {TemplateInstanceBase}
                                             * @implements {Polymer_MutableData}
                                             * @private
                                             */
const MutableTemplateInstanceBase = MutableData(TemplateInstanceBase);

function findMethodHost(template) {
  // Technically this should be the owner of the outermost template.
  // In shadow dom, this is always getRootNode().host, but we can
  // approximate this via cooperation with our dataHost always setting
  // `_methodHost` as long as there were bindings (or id's) on this
  // instance causing it to get a dataHost.
  let templateHost = template.__dataHost;
  return templateHost && templateHost._methodHost || templateHost;
} /* eslint-disable valid-jsdoc */ /**
                                    * @suppress {missingProperties} class.prototype is not defined for some reason
                                    */

function createTemplatizerClass(template, templateInfo, options) {
  // Anonymous class created by the templatize
  let base = options.mutableData ? MutableTemplateInstanceBase : TemplateInstanceBase; /**
                                                                                        * @constructor
                                                                                        * @extends {base}
                                                                                        * @private
                                                                                        */
  let klass = class extends base {};
  klass.prototype.__templatizeOptions = options;

  klass.prototype._bindTemplate(template);

  addNotifyEffects(klass, template, templateInfo, options);
  return klass;
} /**
   * @suppress {missingProperties} class.prototype is not defined for some reason
   */

function addPropagateEffects(template, templateInfo, options) {
  let userForwardHostProp = options.forwardHostProp;

  if (userForwardHostProp) {
    // Provide data API and property effects on memoized template class
    let klass = templateInfo.templatizeTemplateClass;

    if (!klass) {
      let base = options.mutableData ? MutableDataTemplate : DataTemplate; /** @private */
      klass = templateInfo.templatizeTemplateClass = class TemplatizedTemplate extends base {}; // Add template - >instances effects
      // and host <- template effects

      let hostProps = templateInfo.hostProps;

      for (let prop in hostProps) {
        klass.prototype._addPropertyEffect('_host_' + prop, klass.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE, {
          fn: createForwardHostPropEffect(prop, userForwardHostProp)
        });

        klass.prototype._createNotifyingProperty('_host_' + prop);
      }
    }

    upgradeTemplate(template, klass); // Mix any pre-bound data into __data; no need to flush this to
    // instances since they pull from the template at instance-time

    if (template.__dataProto) {
      // Note, generally `__dataProto` could be chained, but it's guaranteed
      // to not be since this is a vanilla template we just added effects to
      Object.assign(template.__data, template.__dataProto);
    } // Clear any pending data for performance


    template.__dataTemp = {};
    template.__dataPending = null;
    template.__dataOld = null;

    template._enableProperties();
  }
} /* eslint-enable valid-jsdoc */

function createForwardHostPropEffect(hostProp, userForwardHostProp) {
  return function forwardHostProp(template, prop, props) {
    userForwardHostProp.call(template.__templatizeOwner, prop.substring('_host_'.length), props[prop]);
  };
}

function addNotifyEffects(klass, template, templateInfo, options) {
  let hostProps = templateInfo.hostProps || {};

  for (let iprop in options.instanceProps) {
    delete hostProps[iprop];
    let userNotifyInstanceProp = options.notifyInstanceProp;

    if (userNotifyInstanceProp) {
      klass.prototype._addPropertyEffect(iprop, klass.prototype.PROPERTY_EFFECT_TYPES.NOTIFY, {
        fn: createNotifyInstancePropEffect(iprop, userNotifyInstanceProp)
      });
    }
  }

  if (options.forwardHostProp && template.__dataHost) {
    for (let hprop in hostProps) {
      klass.prototype._addPropertyEffect(hprop, klass.prototype.PROPERTY_EFFECT_TYPES.NOTIFY, {
        fn: createNotifyHostPropEffect()
      });
    }
  }
}

function createNotifyInstancePropEffect(instProp, userNotifyInstanceProp) {
  return function notifyInstanceProp(inst, prop, props) {
    userNotifyInstanceProp.call(inst.__templatizeOwner, inst, prop, props[prop]);
  };
}

function createNotifyHostPropEffect() {
  return function notifyHostProp(inst, prop, props) {
    inst.__dataHost._setPendingPropertyOrPath('_host_' + prop, props[prop], true, true);
  };
} /**
   * Module for preparing and stamping instances of templates that utilize
   * Polymer's data-binding and declarative event listener features.
   *
   * Example:
   *
   *     // Get a template from somewhere, e.g. light DOM
   *     let template = this.querySelector('template');
   *     // Prepare the template
   *     let TemplateClass = Templatize.templatize(template);
   *     // Instance the template with an initial data model
   *     let instance = new TemplateClass({myProp: 'initial'});
   *     // Insert the instance's DOM somewhere, e.g. element's shadow DOM
   *     this.shadowRoot.appendChild(instance.root);
   *     // Changing a property on the instance will propagate to bindings
   *     // in the template
   *     instance.myProp = 'new value';
   *
   * The `options` dictionary passed to `templatize` allows for customizing
   * features of the generated template class, including how outer-scope host
   * properties should be forwarded into template instances, how any instance
   * properties added into the template's scope should be notified out to
   * the host, and whether the instance should be decorated as a "parent model"
   * of any event handlers.
   *
   *     // Customize property forwarding and event model decoration
   *     let TemplateClass = Templatize.templatize(template, this, {
   *       parentModel: true,
   *       forwardHostProp(property, value) {...},
   *       instanceProps: {...},
   *       notifyInstanceProp(instance, property, value) {...},
   *     });
   *
   * @summary Module for preparing and stamping instances of templates
   *   utilizing Polymer templating features.
   */

`TODO(modulizer): A namespace named Polymer.Templatize was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`; /**
                                       * Returns an anonymous `PropertyEffects` class bound to the
                                       * `<template>` provided.  Instancing the class will result in the
                                       * template being stamped into a document fragment stored as the instance's
                                       * `root` property, after which it can be appended to the DOM.
                                       *
                                       * Templates may utilize all Polymer data-binding features as well as
                                       * declarative event listeners.  Event listeners and inline computing
                                       * functions in the template will be called on the host of the template.
                                       *
                                       * The constructor returned takes a single argument dictionary of initial
                                       * property values to propagate into template bindings.  Additionally
                                       * host properties can be forwarded in, and instance properties can be
                                       * notified out by providing optional callbacks in the `options` dictionary.
                                       *
                                       * Valid configuration in `options` are as follows:
                                       *
                                       * - `forwardHostProp(property, value)`: Called when a property referenced
                                       *   in the template changed on the template's host. As this library does
                                       *   not retain references to templates instanced by the user, it is the
                                       *   templatize owner's responsibility to forward host property changes into
                                       *   user-stamped instances.  The `instance.forwardHostProp(property, value)`
                                       *    method on the generated class should be called to forward host
                                       *   properties into the template to prevent unnecessary property-changed
                                       *   notifications. Any properties referenced in the template that are not
                                       *   defined in `instanceProps` will be notified up to the template's host
                                       *   automatically.
                                       * - `instanceProps`: Dictionary of property names that will be added
                                       *   to the instance by the templatize owner.  These properties shadow any
                                       *   host properties, and changes within the template to these properties
                                       *   will result in `notifyInstanceProp` being called.
                                       * - `mutableData`: When `true`, the generated class will skip strict
                                       *   dirty-checking for objects and arrays (always consider them to be
                                       *   "dirty").
                                       * - `notifyInstanceProp(instance, property, value)`: Called when
                                       *   an instance property changes.  Users may choose to call `notifyPath`
                                       *   on e.g. the owner to notify the change.
                                       * - `parentModel`: When `true`, events handled by declarative event listeners
                                       *   (`on-event="handler"`) will be decorated with a `model` property pointing
                                       *   to the template instance that stamped it.  It will also be returned
                                       *   from `instance.parentModel` in cases where template instance nesting
                                       *   causes an inner model to shadow an outer model.
                                       *
                                       * All callbacks are called bound to the `owner`. Any context
                                       * needed for the callbacks (such as references to `instances` stamped)
                                       * should be stored on the `owner` such that they can be retrieved via
                                       * `this`.
                                       *
                                       * When `options.forwardHostProp` is declared as an option, any properties
                                       * referenced in the template will be automatically forwarded from the host of
                                       * the `<template>` to instances, with the exception of any properties listed in
                                       * the `options.instanceProps` object.  `instanceProps` are assumed to be
                                       * managed by the owner of the instances, either passed into the constructor
                                       * or set after the fact.  Note, any properties passed into the constructor will
                                       * always be set to the instance (regardless of whether they would normally
                                       * be forwarded from the host).
                                       *
                                       * Note that `templatize()` can be run only once for a given `<template>`.
                                       * Further calls will result in an error. Also, there is a special
                                       * behavior if the template was duplicated through a mechanism such as
                                       * `<dom-repeat>` or `<test-fixture>`. In this case, all calls to
                                       * `templatize()` return the same class for all duplicates of a template.
                                       * The class returned from `templatize()` is generated only once using
                                       * the `options` from the first call. This means that any `options`
                                       * provided to subsequent calls will be ignored. Therefore, it is very
                                       * important not to close over any variables inside the callbacks. Also,
                                       * arrow functions must be avoided because they bind the outer `this`.
                                       * Inside the callbacks, any contextual information can be accessed
                                       * through `this`, which points to the `owner`.
                                       *
                                       * @param {!HTMLTemplateElement} template Template to templatize
                                       * @param {Polymer_PropertyEffects=} owner Owner of the template instances;
                                       *   any optional callbacks will be bound to this owner.
                                       * @param {Object=} options Options dictionary (see summary for details)
                                       * @return {function(new:TemplateInstanceBase)} Generated class bound to the template
                                       *   provided
                                       * @suppress {invalidCasts}
                                       */

function templatize(template, owner, options) {
  options = /** @type {!TemplatizeOptions} */options || {};

  if (template.__templatizeOwner) {
    throw new Error('A <template> can only be templatized once');
  }

  template.__templatizeOwner = owner;
  const ctor = owner ? owner.constructor : TemplateInstanceBase;

  let templateInfo = ctor._parseTemplate(template); // Get memoized base class for the prototypical template, which
  // includes property effects for binding template & forwarding


  let baseClass = templateInfo.templatizeInstanceClass;

  if (!baseClass) {
    baseClass = createTemplatizerClass(template, templateInfo, options);
    templateInfo.templatizeInstanceClass = baseClass;
  } // Host property forwarding must be installed onto template instance


  addPropagateEffects(template, templateInfo, options); // Subclass base class and add reference for this specific template
  /** @private */
  let klass = class TemplateInstance extends baseClass {};
  klass.prototype._methodHost = findMethodHost(template);
  klass.prototype.__dataHost = template;
  klass.prototype.__templatizeOwner = owner;
  klass.prototype.__hostProps = templateInfo.hostProps;
  klass = /** @type {function(new:TemplateInstanceBase)} */klass; //eslint-disable-line no-self-assign

  return klass;
} /**
   * Returns the template "model" associated with a given element, which
   * serves as the binding scope for the template instance the element is
   * contained in. A template model is an instance of
   * `TemplateInstanceBase`, and should be used to manipulate data
   * associated with this template instance.
   *
   * Example:
   *
   *   let model = modelForElement(el);
   *   if (model.index < 10) {
   *     model.set('item.checked', true);
   *   }
   *
   * @param {HTMLTemplateElement} template The model will be returned for
   *   elements stamped from this template
   * @param {Node=} node Node for which to return a template model.
   * @return {TemplateInstanceBase} Template instance representing the
   *   binding scope for the element
   */

function modelForElement(template, node) {
  let model;

  while (node) {
    // An element with a __templatizeInstance marks the top boundary
    // of a scope; walk up until we find one, and then ensure that
    // its __dataHost matches `this`, meaning this dom-repeat stamped it
    if (model = node.__templatizeInstance) {
      // Found an element stamped by another template; keep walking up
      // from its __dataHost
      if (model.__dataHost != template) {
        node = model.__dataHost;
      } else {
        return model;
      }
    } else {
      // Still in a template scope, keep going up until
      // a __templatizeInstance is found
      node = node.parentNode;
    }
  }

  return null;
}

var templatize$1 = {
  templatize: templatize,
  modelForElement: modelForElement,
  TemplateInstanceBase: TemplateInstanceBase
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * @typedef {{
       *   _templatizerTemplate: HTMLTemplateElement,
       *   _parentModel: boolean,
       *   _instanceProps: Object,
       *   _forwardHostPropV2: Function,
       *   _notifyInstancePropV2: Function,
       *   ctor: TemplateInstanceBase
       * }}
       */
let TemplatizerUser; // eslint-disable-line
/**
 * The `Templatizer` behavior adds methods to generate instances of
 * templates that are each managed by an anonymous `PropertyEffects`
 * instance where data-bindings in the stamped template content are bound to
 * accessors on itself.
 *
 * This behavior is provided in Polymer 2.x-3.x as a hybrid-element convenience
 * only.  For non-hybrid usage, the `Templatize` library
 * should be used instead.
 *
 * Example:
 *
 *     import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';
 *     // Get a template from somewhere, e.g. light DOM
 *     let template = this.querySelector('template');
 *     // Prepare the template
 *     this.templatize(template);
 *     // Instance the template with an initial data model
 *     let instance = this.stamp({myProp: 'initial'});
 *     // Insert the instance's DOM somewhere, e.g. light DOM
 *     dom(this).appendChild(instance.root);
 *     // Changing a property on the instance will propagate to bindings
 *     // in the template
 *     instance.myProp = 'new value';
 *
 * Users of `Templatizer` may need to implement the following abstract
 * API's to determine how properties and paths from the host should be
 * forwarded into to instances:
 *
 *     _forwardHostPropV2: function(prop, value)
 *
 * Likewise, users may implement these additional abstract API's to determine
 * how instance-specific properties that change on the instance should be
 * forwarded out to the host, if necessary.
 *
 *     _notifyInstancePropV2: function(inst, prop, value)
 *
 * In order to determine which properties are instance-specific and require
 * custom notification via `_notifyInstanceProp`, define an `_instanceProps`
 * object containing keys for each instance prop, for example:
 *
 *     _instanceProps: {
 *       item: true,
 *       index: true
 *     }
 *
 * Any properties used in the template that are not defined in _instanceProp
 * will be forwarded out to the Templatize `owner` automatically.
 *
 * Users may also implement the following abstract function to show or
 * hide any DOM generated using `stamp`:
 *
 *     _showHideChildren: function(shouldHide)
 *
 * Note that some callbacks are suffixed with `V2` in the Polymer 2.x behavior
 * as the implementations will need to differ from the callbacks required
 * by the 1.x Templatizer API due to changes in the `TemplateInstance` API
 * between versions 1.x and 2.x.
 *
 * @polymerBehavior
 */
const Templatizer = {
  /**
   * Generates an anonymous `TemplateInstance` class (stored as `this.ctor`)
   * for the provided template.  This method should be called once per
   * template to prepare an element for stamping the template, followed
   * by `stamp` to create new instances of the template.
   *
   * @param {!HTMLTemplateElement} template Template to prepare
   * @param {boolean=} mutableData When `true`, the generated class will skip
   *   strict dirty-checking for objects and arrays (always consider them to
   *   be "dirty"). Defaults to false.
   * @return {void}
   * @this {TemplatizerUser}
   */templatize(template, mutableData) {
    this._templatizerTemplate = template;
    this.ctor = templatize(template, this, {
      mutableData: Boolean(mutableData),
      parentModel: this._parentModel,
      instanceProps: this._instanceProps,
      forwardHostProp: this._forwardHostPropV2,
      notifyInstanceProp: this._notifyInstancePropV2
    });
  },

  /**
   * Creates an instance of the template prepared by `templatize`.  The object
   * returned is an instance of the anonymous class generated by `templatize`
   * whose `root` property is a document fragment containing newly cloned
   * template content, and which has property accessors corresponding to
   * properties referenced in template bindings.
   *
   * @param {Object=} model Object containing initial property values to
   *   populate into the template bindings.
   * @return {TemplateInstanceBase} Returns the created instance of
   * the template prepared by `templatize`.
   * @this {TemplatizerUser}
   */stamp(model) {
    return new this.ctor(model);
  },

  /**
   * Returns the template "model" (`TemplateInstance`) associated with
   * a given element, which serves as the binding scope for the template
   * instance the element is contained in.  A template model should be used
   * to manipulate data associated with this template instance.
   *
   * @param {HTMLElement} el Element for which to return a template model.
   * @return {TemplateInstanceBase} Model representing the binding scope for
   *   the element.
   * @this {TemplatizerUser}
   */modelForElement(el) {
    return modelForElement(this._templatizerTemplate, el);
  }

};
var templatizerBehavior = {
  Templatizer: Templatizer
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * @constructor
       * @extends {HTMLElement}
       * @implements {Polymer_PropertyEffects}
       * @implements {Polymer_OptionalMutableData}
       * @implements {Polymer_GestureEventListeners}
       * @private
       */
const domBindBase = GestureEventListeners(OptionalMutableData(PropertyEffects(HTMLElement))); /**
                                                                                               * Custom element to allow using Polymer's template features (data binding,
                                                                                               * declarative event listeners, etc.) in the main document without defining
                                                                                               * a new custom element.
                                                                                               *
                                                                                               * `<template>` tags utilizing bindings may be wrapped with the `<dom-bind>`
                                                                                               * element, which will immediately stamp the wrapped template into the main
                                                                                               * document and bind elements to the `dom-bind` element itself as the
                                                                                               * binding scope.
                                                                                               *
                                                                                               * @polymer
                                                                                               * @customElement
                                                                                               * @appliesMixin PropertyEffects
                                                                                               * @appliesMixin OptionalMutableData
                                                                                               * @appliesMixin GestureEventListeners
                                                                                               * @extends {domBindBase}
                                                                                               * @summary Custom element to allow using Polymer's template features (data
                                                                                               *   binding, declarative event listeners, etc.) in the main document.
                                                                                               */

class DomBind extends domBindBase {
  static get observedAttributes() {
    return ['mutable-data'];
  }

  constructor() {
    super();
    this.root = null;
    this.$ = null;
    this.__children = null;
  } /** @return {void} */

  attributeChangedCallback() {
    // assumes only one observed attribute
    this.mutableData = true;
  } /** @return {void} */

  connectedCallback() {
    this.style.display = 'none';
    this.render();
  } /** @return {void} */

  disconnectedCallback() {
    this.__removeChildren();
  }

  __insertChildren() {
    this.parentNode.insertBefore(this.root, this);
  }

  __removeChildren() {
    if (this.__children) {
      for (let i = 0; i < this.__children.length; i++) {
        this.root.appendChild(this.__children[i]);
      }
    }
  } /**
     * Forces the element to render its content. This is typically only
     * necessary to call if HTMLImports with the async attribute are used.
     * @return {void}
     */

  render() {
    let template;

    if (!this.__children) {
      template = /** @type {HTMLTemplateElement} */template || this.querySelector('template');

      if (!template) {
        // Wait until childList changes and template should be there by then
        let observer = new MutationObserver(() => {
          template = /** @type {HTMLTemplateElement} */this.querySelector('template');

          if (template) {
            observer.disconnect();
            this.render();
          } else {
            throw new Error('dom-bind requires a <template> child');
          }
        });
        observer.observe(this, {
          childList: true
        });
        return;
      }

      this.root = this._stampTemplate(template);
      this.$ = this.root.$;
      this.__children = [];

      for (let n = this.root.firstChild; n; n = n.nextSibling) {
        this.__children[this.__children.length] = n;
      }

      this._enableProperties();
    }

    this.__insertChildren();

    this.dispatchEvent(new CustomEvent('dom-change', {
      bubbles: true,
      composed: true
    }));
  }

}

customElements.define('dom-bind', DomBind);
var domBind = {
  DomBind: DomBind
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Class representing a static string value which can be used to filter
       * strings by asseting that they have been created via this class. The
       * `value` property returns the string passed to the constructor.
       */

class LiteralString {
  constructor(string) {
    /** @type {string} */this.value = string.toString();
  } /**
     * @return {string} LiteralString string value
     * @override
     */

  toString() {
    return this.value;
  }

} /**
   * @param {*} value Object to stringify into HTML
   * @return {string} HTML stringified form of `obj`
   */

function literalValue(value) {
  if (value instanceof LiteralString) {
    return (/** @type {!LiteralString} */value.value
    );
  } else {
    throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${value}`);
  }
} /**
   * @param {*} value Object to stringify into HTML
   * @return {string} HTML stringified form of `obj`
   */

function htmlValue(value) {
  if (value instanceof HTMLTemplateElement) {
    return (/** @type {!HTMLTemplateElement } */value.innerHTML
    );
  } else if (value instanceof LiteralString) {
    return literalValue(value);
  } else {
    throw new Error(`non-template value passed to Polymer's html function: ${value}`);
  }
} /**
   * A template literal tag that creates an HTML <template> element from the
   * contents of the string.
   *
   * This allows you to write a Polymer Template in JavaScript.
   *
   * Templates can be composed by interpolating `HTMLTemplateElement`s in
   * expressions in the JavaScript template literal. The nested template's
   * `innerHTML` is included in the containing template.  The only other
   * values allowed in expressions are those returned from `htmlLiteral`
   * which ensures only literal values from JS source ever reach the HTML, to
   * guard against XSS risks.
   *
   * All other values are disallowed in expressions to help prevent XSS
   * attacks; however, `htmlLiteral` can be used to compose static
   * string values into templates. This is useful to compose strings into
   * places that do not accept html, like the css text of a `style`
   * element.
   *
   * Example:
   *
   *     static get template() {
   *       return html`
   *         <style>:host{ content:"..." }</style>
   *         <div class="shadowed">${this.partialTemplate}</div>
   *         ${super.template}
   *       `;
   *     }
   *     static get partialTemplate() { return html`<span>Partial!</span>`; }
   *
   * @param {!ITemplateArray} strings Constant parts of tagged template literal
   * @param {...*} values Variable parts of tagged template literal
   * @return {!HTMLTemplateElement} Constructed HTMLTemplateElement
   */

const html$1 = function html(strings, ...values) {
  const template = /** @type {!HTMLTemplateElement} */document.createElement('template');
  template.innerHTML = values.reduce((acc, v, idx) => acc + htmlValue(v) + strings[idx + 1], strings[0]);
  return template;
}; /**
    * An html literal tag that can be used with `html` to compose.
    * a literal string.
    *
    * Example:
    *
    *     static get template() {
    *       return html`
    *         <style>
    *           :host { display: block; }
    *           ${this.styleTemplate()}
    *         </style>
    *         <div class="shadowed">${staticValue}</div>
    *         ${super.template}
    *       `;
    *     }
    *     static get styleTemplate() {
    *        return htmlLiteral`.shadowed { background: gray; }`;
    *     }
    *
    * @param {!ITemplateArray} strings Constant parts of tagged template literal
    * @param {...*} values Variable parts of tagged template literal
    * @return {!LiteralString} Constructed literal string
    */

const htmlLiteral = function (strings, ...values) {
  return new LiteralString(values.reduce((acc, v, idx) => acc + literalValue(v) + strings[idx + 1], strings[0]));
};

var htmlTag = {
  html: html$1,
  htmlLiteral: htmlLiteral
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Base class that provides the core API for Polymer's meta-programming
       * features including template stamping, data-binding, attribute deserialization,
       * and property change observation.
       *
       * @customElement
       * @polymer
       * @constructor
       * @implements {Polymer_ElementMixin}
       * @extends HTMLElement
       * @appliesMixin ElementMixin
       * @summary Custom element base class that provides the core API for Polymer's
       *   key meta-programming features including template stamping, data-binding,
       *   attribute deserialization, and property change observation
       */
const PolymerElement = ElementMixin(HTMLElement);
var polymerElement = {
  PolymerElement: PolymerElement,
  html: html$1
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * @constructor
       * @implements {Polymer_OptionalMutableData}
       * @extends {PolymerElement}
       * @private
       */
const domRepeatBase = OptionalMutableData(PolymerElement); /**
                                                            * The `<dom-repeat>` element will automatically stamp and binds one instance
                                                            * of template content to each object in a user-provided array.
                                                            * `dom-repeat` accepts an `items` property, and one instance of the template
                                                            * is stamped for each item into the DOM at the location of the `dom-repeat`
                                                            * element.  The `item` property will be set on each instance's binding
                                                            * scope, thus templates should bind to sub-properties of `item`.
                                                            *
                                                            * Example:
                                                            *
                                                            * ```html
                                                            * <dom-module id="employee-list">
                                                            *
                                                            *   <template>
                                                            *
                                                            *     <div> Employee list: </div>
                                                            *     <dom-repeat items="{{employees}}">
                                                            *       <template>
                                                            *         <div>First name: <span>{{item.first}}</span></div>
                                                            *         <div>Last name: <span>{{item.last}}</span></div>
                                                            *       </template>
                                                            *     </dom-repeat>
                                                            *
                                                            *   </template>
                                                            *
                                                            * </dom-module>
                                                            * ```
                                                            *
                                                            * With the following custom element definition:
                                                            *
                                                            * ```js
                                                            * class EmployeeList extends PolymerElement {
                                                            *   static get is() { return 'employee-list'; }
                                                            *   static get properties() {
                                                            *     return {
                                                            *       employees: {
                                                            *         value() {
                                                            *           return [
                                                            *             {first: 'Bob', last: 'Smith'},
                                                            *             {first: 'Sally', last: 'Johnson'},
                                                            *             ...
                                                            *           ];
                                                            *         }
                                                            *       }
                                                            *     };
                                                            *   }
                                                            * }
                                                            * ```
                                                            *
                                                            * Notifications for changes to items sub-properties will be forwarded to template
                                                            * instances, which will update via the normal structured data notification system.
                                                            *
                                                            * Mutations to the `items` array itself should be made using the Array
                                                            * mutation API's on the PropertyEffects mixin (`push`, `pop`, `splice`,
                                                            * `shift`, `unshift`), and template instances will be kept in sync with the
                                                            * data in the array.
                                                            *
                                                            * Events caught by event handlers within the `dom-repeat` template will be
                                                            * decorated with a `model` property, which represents the binding scope for
                                                            * each template instance.  The model should be used to manipulate data on the
                                                            * instance, for example `event.model.set('item.checked', true);`.
                                                            *
                                                            * Alternatively, the model for a template instance for an element stamped by
                                                            * a `dom-repeat` can be obtained using the `modelForElement` API on the
                                                            * `dom-repeat` that stamped it, for example
                                                            * `this.$.domRepeat.modelForElement(event.target).set('item.checked', true);`.
                                                            * This may be useful for manipulating instance data of event targets obtained
                                                            * by event handlers on parents of the `dom-repeat` (event delegation).
                                                            *
                                                            * A view-specific filter/sort may be applied to each `dom-repeat` by supplying a
                                                            * `filter` and/or `sort` property.  This may be a string that names a function on
                                                            * the host, or a function may be assigned to the property directly.  The functions
                                                            * should implemented following the standard `Array` filter/sort API.
                                                            *
                                                            * In order to re-run the filter or sort functions based on changes to sub-fields
                                                            * of `items`, the `observe` property may be set as a space-separated list of
                                                            * `item` sub-fields that should cause a re-filter/sort when modified.  If
                                                            * the filter or sort function depends on properties not contained in `items`,
                                                            * the user should observe changes to those properties and call `render` to update
                                                            * the view based on the dependency change.
                                                            *
                                                            * For example, for an `dom-repeat` with a filter of the following:
                                                            *
                                                            * ```js
                                                            * isEngineer(item) {
                                                            *   return item.type == 'engineer' || item.manager.type == 'engineer';
                                                            * }
                                                            * ```
                                                            *
                                                            * Then the `observe` property should be configured as follows:
                                                            *
                                                            * ```html
                                                            * <dom-repeat items="{{employees}}" filter="isEngineer" observe="type manager.type">
                                                            * ```
                                                            *
                                                            * @customElement
                                                            * @polymer
                                                            * @extends {domRepeatBase}
                                                            * @appliesMixin OptionalMutableData
                                                            * @summary Custom element for stamping instance of a template bound to
                                                            *   items in an array.
                                                            */

class DomRepeat extends domRepeatBase {
  // Not needed to find template; can be removed once the analyzer
  // can find the tag name from customElements.define call
  static get is() {
    return 'dom-repeat';
  }

  static get template() {
    return null;
  }

  static get properties() {
    /**
     * Fired whenever DOM is added or removed by this template (by
     * default, rendering occurs lazily).  To force immediate rendering, call
     * `render`.
     *
     * @event dom-change
     */return {
      /**
       * An array containing items determining how many instances of the template
       * to stamp and that that each template instance should bind to.
       */items: {
        type: Array
      },
      /**
       * The name of the variable to add to the binding scope for the array
       * element associated with a given template instance.
       */as: {
        type: String,
        value: 'item'
      },
      /**
       * The name of the variable to add to the binding scope with the index
       * of the instance in the sorted and filtered list of rendered items.
       * Note, for the index in the `this.items` array, use the value of the
       * `itemsIndexAs` property.
       */indexAs: {
        type: String,
        value: 'index'
      },
      /**
       * The name of the variable to add to the binding scope with the index
       * of the instance in the `this.items` array. Note, for the index of
       * this instance in the sorted and filtered list of rendered items,
       * use the value of the `indexAs` property.
       */itemsIndexAs: {
        type: String,
        value: 'itemsIndex'
      },
      /**
       * A function that should determine the sort order of the items.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.sort`.
       * Using a sort function has no effect on the underlying `items` array.
       */sort: {
        type: Function,
        observer: '__sortChanged'
      },
      /**
       * A function that can be used to filter items out of the view.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.filter`.
       * Using a filter function has no effect on the underlying `items` array.
       */filter: {
        type: Function,
        observer: '__filterChanged'
      },
      /**
       * When using a `filter` or `sort` function, the `observe` property
       * should be set to a space-separated list of the names of item
       * sub-fields that should trigger a re-sort or re-filter when changed.
       * These should generally be fields of `item` that the sort or filter
       * function depends on.
       */observe: {
        type: String,
        observer: '__observeChanged'
      },
      /**
       * When using a `filter` or `sort` function, the `delay` property
       * determines a debounce time in ms after a change to observed item
       * properties that must pass before the filter or sort is re-run.
       * This is useful in rate-limiting shuffling of the view when
       * item changes may be frequent.
       */delay: Number,
      /**
       * Count of currently rendered items after `filter` (if any) has been applied.
       * If "chunking mode" is enabled, `renderedItemCount` is updated each time a
       * set of template instances is rendered.
       *
       */renderedItemCount: {
        type: Number,
        notify: true,
        readOnly: true
      },
      /**
       * Defines an initial count of template instances to render after setting
       * the `items` array, before the next paint, and puts the `dom-repeat`
       * into "chunking mode".  The remaining items will be created and rendered
       * incrementally at each animation frame therof until all instances have
       * been rendered.
       */initialCount: {
        type: Number,
        observer: '__initializeChunking'
      },
      /**
       * When `initialCount` is used, this property defines a frame rate (in
       * fps) to target by throttling the number of instances rendered each
       * frame to not exceed the budget for the target frame rate.  The
       * framerate is effectively the number of `requestAnimationFrame`s that
       * it tries to allow to actually fire in a given second. It does this
       * by measuring the time between `rAF`s and continuously adjusting the
       * number of items created each `rAF` to maintain the target framerate.
       * Setting this to a higher number allows lower latency and higher
       * throughput for event handlers and other tasks, but results in a
       * longer time for the remaining items to complete rendering.
       */targetFramerate: {
        type: Number,
        value: 20
      },
      _targetFrameTime: {
        type: Number,
        computed: '__computeFrameTime(targetFramerate)'
      }
    };
  }

  static get observers() {
    return ['__itemsChanged(items.*)'];
  }

  constructor() {
    super();
    this.__instances = [];
    this.__limit = Infinity;
    this.__pool = [];
    this.__renderDebouncer = null;
    this.__itemsIdxToInstIdx = {};
    this.__chunkCount = null;
    this.__lastChunkTime = null;
    this.__sortFn = null;
    this.__filterFn = null;
    this.__observePaths = null;
    this.__ctor = null;
    this.__isDetached = true;
    this.template = null;
  } /**
     * @return {void}
     */

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__isDetached = true;

    for (let i = 0; i < this.__instances.length; i++) {
      this.__detachInstance(i);
    }
  } /**
     * @return {void}
     */

  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'none'; // only perform attachment if the element was previously detached.

    if (this.__isDetached) {
      this.__isDetached = false;
      let parent = this.parentNode;

      for (let i = 0; i < this.__instances.length; i++) {
        this.__attachInstance(i, parent);
      }
    }
  }

  __ensureTemplatized() {
    // Templatizing (generating the instance constructor) needs to wait
    // until ready, since won't have its template content handed back to
    // it until then
    if (!this.__ctor) {
      let template = this.template = /** @type {HTMLTemplateElement} */this.querySelector('template');

      if (!template) {
        // // Wait until childList changes and template should be there by then
        let observer = new MutationObserver(() => {
          if (this.querySelector('template')) {
            observer.disconnect();

            this.__render();
          } else {
            throw new Error('dom-repeat requires a <template> child');
          }
        });
        observer.observe(this, {
          childList: true
        });
        return false;
      } // Template instance props that should be excluded from forwarding


      let instanceProps = {};
      instanceProps[this.as] = true;
      instanceProps[this.indexAs] = true;
      instanceProps[this.itemsIndexAs] = true;
      this.__ctor = templatize(template, this, {
        mutableData: this.mutableData,
        parentModel: true,
        instanceProps: instanceProps,
        /**
         * @this {this}
         * @param {string} prop Property to set
         * @param {*} value Value to set property to
         */forwardHostProp: function (prop, value) {
          let i$ = this.__instances;

          for (let i = 0, inst; i < i$.length && (inst = i$[i]); i++) {
            inst.forwardHostProp(prop, value);
          }
        },
        /**
         * @this {this}
         * @param {Object} inst Instance to notify
         * @param {string} prop Property to notify
         * @param {*} value Value to notify
         */notifyInstanceProp: function (inst, prop, value) {
          if (matches(this.as, prop)) {
            let idx = inst[this.itemsIndexAs];

            if (prop == this.as) {
              this.items[idx] = value;
            }

            let path = translate(this.as, 'items.' + idx, prop);
            this.notifyPath(path, value);
          }
        }
      });
    }

    return true;
  }

  __getMethodHost() {
    // Technically this should be the owner of the outermost template.
    // In shadow dom, this is always getRootNode().host, but we can
    // approximate this via cooperation with our dataHost always setting
    // `_methodHost` as long as there were bindings (or id's) on this
    // instance causing it to get a dataHost.
    return this.__dataHost._methodHost || this.__dataHost;
  }

  __functionFromPropertyValue(functionOrMethodName) {
    if (typeof functionOrMethodName === 'string') {
      let methodName = functionOrMethodName;

      let obj = this.__getMethodHost();

      return function () {
        return obj[methodName].apply(obj, arguments);
      };
    }

    return functionOrMethodName;
  }

  __sortChanged(sort) {
    this.__sortFn = this.__functionFromPropertyValue(sort);

    if (this.items) {
      this.__debounceRender(this.__render);
    }
  }

  __filterChanged(filter) {
    this.__filterFn = this.__functionFromPropertyValue(filter);

    if (this.items) {
      this.__debounceRender(this.__render);
    }
  }

  __computeFrameTime(rate) {
    return Math.ceil(1000 / rate);
  }

  __initializeChunking() {
    if (this.initialCount) {
      this.__limit = this.initialCount;
      this.__chunkCount = this.initialCount;
      this.__lastChunkTime = performance.now();
    }
  }

  __tryRenderChunk() {
    // Debounced so that multiple calls through `_render` between animation
    // frames only queue one new rAF (e.g. array mutation & chunked render)
    if (this.items && this.__limit < this.items.length) {
      this.__debounceRender(this.__requestRenderChunk);
    }
  }

  __requestRenderChunk() {
    requestAnimationFrame(() => this.__renderChunk());
  }

  __renderChunk() {
    // Simple auto chunkSize throttling algorithm based on feedback loop:
    // measure actual time between frames and scale chunk count by ratio
    // of target/actual frame time
    let currChunkTime = performance.now();
    let ratio = this._targetFrameTime / (currChunkTime - this.__lastChunkTime);
    this.__chunkCount = Math.round(this.__chunkCount * ratio) || 1;
    this.__limit += this.__chunkCount;
    this.__lastChunkTime = currChunkTime;

    this.__debounceRender(this.__render);
  }

  __observeChanged() {
    this.__observePaths = this.observe && this.observe.replace('.*', '.').split(' ');
  }

  __itemsChanged(change) {
    if (this.items && !Array.isArray(this.items)) {
      console.warn('dom-repeat expected array for `items`, found', this.items);
    } // If path was to an item (e.g. 'items.3' or 'items.3.foo'), forward the
    // path to that instance synchronously (returns false for non-item paths)


    if (!this.__handleItemPath(change.path, change.value)) {
      // Otherwise, the array was reset ('items') or spliced ('items.splices'),
      // so queue a full refresh
      this.__initializeChunking();

      this.__debounceRender(this.__render);
    }
  }

  __handleObservedPaths(path) {
    // Handle cases where path changes should cause a re-sort/filter
    if (this.__sortFn || this.__filterFn) {
      if (!path) {
        // Always re-render if the item itself changed
        this.__debounceRender(this.__render, this.delay);
      } else if (this.__observePaths) {
        // Otherwise, re-render if the path changed matches an observed path
        let paths = this.__observePaths;

        for (let i = 0; i < paths.length; i++) {
          if (path.indexOf(paths[i]) === 0) {
            this.__debounceRender(this.__render, this.delay);
          }
        }
      }
    }
  } /**
     * @param {function(this:DomRepeat)} fn Function to debounce.
     * @param {number=} delay Delay in ms to debounce by.
     */

  __debounceRender(fn, delay = 0) {
    this.__renderDebouncer = Debouncer.debounce(this.__renderDebouncer, delay > 0 ? timeOut.after(delay) : microTask, fn.bind(this));
    enqueueDebouncer(this.__renderDebouncer);
  } /**
     * Forces the element to render its content. Normally rendering is
     * asynchronous to a provoking change. This is done for efficiency so
     * that multiple changes trigger only a single render. The render method
     * should be called if, for example, template rendering is required to
     * validate application state.
     * @return {void}
     */

  render() {
    // Queue this repeater, then flush all in order
    this.__debounceRender(this.__render);

    flush$1();
  }

  __render() {
    if (!this.__ensureTemplatized()) {
      // No template found yet
      return;
    }

    this.__applyFullRefresh(); // Reset the pool
    // TODO(kschaaf): Reuse pool across turns and nested templates
    // Now that objects/arrays are re-evaluated when set, we can safely
    // reuse pooled instances across turns, however we still need to decide
    // semantics regarding how long to hold, how many to hold, etc.


    this.__pool.length = 0; // Set rendered item count

    this._setRenderedItemCount(this.__instances.length); // Notify users


    this.dispatchEvent(new CustomEvent('dom-change', {
      bubbles: true,
      composed: true
    })); // Check to see if we need to render more items

    this.__tryRenderChunk();
  }

  __applyFullRefresh() {
    let items = this.items || [];
    let isntIdxToItemsIdx = new Array(items.length);

    for (let i = 0; i < items.length; i++) {
      isntIdxToItemsIdx[i] = i;
    } // Apply user filter


    if (this.__filterFn) {
      isntIdxToItemsIdx = isntIdxToItemsIdx.filter((i, idx, array) => this.__filterFn(items[i], idx, array));
    } // Apply user sort


    if (this.__sortFn) {
      isntIdxToItemsIdx.sort((a, b) => this.__sortFn(items[a], items[b]));
    } // items->inst map kept for item path forwarding


    const itemsIdxToInstIdx = this.__itemsIdxToInstIdx = {};
    let instIdx = 0; // Generate instances and assign items

    const limit = Math.min(isntIdxToItemsIdx.length, this.__limit);

    for (; instIdx < limit; instIdx++) {
      let inst = this.__instances[instIdx];
      let itemIdx = isntIdxToItemsIdx[instIdx];
      let item = items[itemIdx];
      itemsIdxToInstIdx[itemIdx] = instIdx;

      if (inst) {
        inst._setPendingProperty(this.as, item);

        inst._setPendingProperty(this.indexAs, instIdx);

        inst._setPendingProperty(this.itemsIndexAs, itemIdx);

        inst._flushProperties();
      } else {
        this.__insertInstance(item, instIdx, itemIdx);
      }
    } // Remove any extra instances from previous state


    for (let i = this.__instances.length - 1; i >= instIdx; i--) {
      this.__detachAndRemoveInstance(i);
    }
  }

  __detachInstance(idx) {
    let inst = this.__instances[idx];

    for (let i = 0; i < inst.children.length; i++) {
      let el = inst.children[i];
      inst.root.appendChild(el);
    }

    return inst;
  }

  __attachInstance(idx, parent) {
    let inst = this.__instances[idx];
    parent.insertBefore(inst.root, this);
  }

  __detachAndRemoveInstance(idx) {
    let inst = this.__detachInstance(idx);

    if (inst) {
      this.__pool.push(inst);
    }

    this.__instances.splice(idx, 1);
  }

  __stampInstance(item, instIdx, itemIdx) {
    let model = {};
    model[this.as] = item;
    model[this.indexAs] = instIdx;
    model[this.itemsIndexAs] = itemIdx;
    return new this.__ctor(model);
  }

  __insertInstance(item, instIdx, itemIdx) {
    let inst = this.__pool.pop();

    if (inst) {
      // TODO(kschaaf): If the pool is shared across turns, hostProps
      // need to be re-set to reused instances in addition to item
      inst._setPendingProperty(this.as, item);

      inst._setPendingProperty(this.indexAs, instIdx);

      inst._setPendingProperty(this.itemsIndexAs, itemIdx);

      inst._flushProperties();
    } else {
      inst = this.__stampInstance(item, instIdx, itemIdx);
    }

    let beforeRow = this.__instances[instIdx + 1];
    let beforeNode = beforeRow ? beforeRow.children[0] : this;
    this.parentNode.insertBefore(inst.root, beforeNode);
    this.__instances[instIdx] = inst;
    return inst;
  } // Implements extension point from Templatize mixin
  /**
   * Shows or hides the template instance top level child elements. For
   * text nodes, `textContent` is removed while "hidden" and replaced when
   * "shown."
   * @param {boolean} hidden Set to true to hide the children;
   * set to false to show them.
   * @return {void}
   * @protected
   */

  _showHideChildren(hidden) {
    for (let i = 0; i < this.__instances.length; i++) {
      this.__instances[i]._showHideChildren(hidden);
    }
  } // Called as a side effect of a host items.<key>.<path> path change,
  // responsible for notifying item.<path> changes to inst for key


  __handleItemPath(path, value) {
    let itemsPath = path.slice(6); // 'items.'.length == 6

    let dot = itemsPath.indexOf('.');
    let itemsIdx = dot < 0 ? itemsPath : itemsPath.substring(0, dot); // If path was index into array...

    if (itemsIdx == parseInt(itemsIdx, 10)) {
      let itemSubPath = dot < 0 ? '' : itemsPath.substring(dot + 1); // If the path is observed, it will trigger a full refresh

      this.__handleObservedPaths(itemSubPath); // Note, even if a rull refresh is triggered, always do the path
      // notification because unless mutableData is used for dom-repeat
      // and all elements in the instance subtree, a full refresh may
      // not trigger the proper update.


      let instIdx = this.__itemsIdxToInstIdx[itemsIdx];
      let inst = this.__instances[instIdx];

      if (inst) {
        let itemPath = this.as + (itemSubPath ? '.' + itemSubPath : ''); // This is effectively `notifyPath`, but avoids some of the overhead
        // of the public API

        inst._setPendingPropertyOrPath(itemPath, value, false, true);

        inst._flushProperties();
      }

      return true;
    }
  } /**
     * Returns the item associated with a given element stamped by
     * this `dom-repeat`.
     *
     * Note, to modify sub-properties of the item,
     * `modelForElement(el).set('item.<sub-prop>', value)`
     * should be used.
     *
     * @param {!HTMLElement} el Element for which to return the item.
     * @return {*} Item associated with the element.
     */

  itemForElement(el) {
    let instance = this.modelForElement(el);
    return instance && instance[this.as];
  } /**
     * Returns the inst index for a given element stamped by this `dom-repeat`.
     * If `sort` is provided, the index will reflect the sorted order (rather
     * than the original array order).
     *
     * @param {!HTMLElement} el Element for which to return the index.
     * @return {?number} Row index associated with the element (note this may
     *   not correspond to the array index if a user `sort` is applied).
     */

  indexForElement(el) {
    let instance = this.modelForElement(el);
    return instance && instance[this.indexAs];
  } /**
     * Returns the template "model" associated with a given element, which
     * serves as the binding scope for the template instance the element is
     * contained in. A template model
     * should be used to manipulate data associated with this template instance.
     *
     * Example:
     *
     *   let model = modelForElement(el);
     *   if (model.index < 10) {
     *     model.set('item.checked', true);
     *   }
     *
     * @param {!HTMLElement} el Element for which to return a template model.
     * @return {TemplateInstanceBase} Model representing the binding scope for
     *   the element.
     */

  modelForElement(el) {
    return modelForElement(this.template, el);
  }

}

customElements.define(DomRepeat.is, DomRepeat);
var domRepeat = {
  DomRepeat: DomRepeat
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * The `<dom-if>` element will stamp a light-dom `<template>` child when
       * the `if` property becomes truthy, and the template can use Polymer
       * data-binding and declarative event features when used in the context of
       * a Polymer element's template.
       *
       * When `if` becomes falsy, the stamped content is hidden but not
       * removed from dom. When `if` subsequently becomes truthy again, the content
       * is simply re-shown. This approach is used due to its favorable performance
       * characteristics: the expense of creating template content is paid only
       * once and lazily.
       *
       * Set the `restamp` property to true to force the stamped content to be
       * created / destroyed when the `if` condition changes.
       *
       * @customElement
       * @polymer
       * @extends PolymerElement
       * @summary Custom element that conditionally stamps and hides or removes
       *   template content based on a boolean flag.
       */

class DomIf extends PolymerElement {
  // Not needed to find template; can be removed once the analyzer
  // can find the tag name from customElements.define call
  static get is() {
    return 'dom-if';
  }

  static get template() {
    return null;
  }

  static get properties() {
    return {
      /**
       * Fired whenever DOM is added or removed/hidden by this template (by
       * default, rendering occurs lazily).  To force immediate rendering, call
       * `render`.
       *
       * @event dom-change
       */ /**
           * A boolean indicating whether this template should stamp.
           */if: {
        type: Boolean,
        observer: '__debounceRender'
      },
      /**
       * When true, elements will be removed from DOM and discarded when `if`
       * becomes false and re-created and added back to the DOM when `if`
       * becomes true.  By default, stamped elements will be hidden but left
       * in the DOM when `if` becomes false, which is generally results
       * in better performance.
       */restamp: {
        type: Boolean,
        observer: '__debounceRender'
      }
    };
  }

  constructor() {
    super();
    this.__renderDebouncer = null;
    this.__invalidProps = null;
    this.__instance = null;
    this._lastIf = false;
    this.__ctor = null;
  }

  __debounceRender() {
    // Render is async for 2 reasons:
    // 1. To eliminate dom creation trashing if user code thrashes `if` in the
    //    same turn. This was more common in 1.x where a compound computed
    //    property could result in the result changing multiple times, but is
    //    mitigated to a large extent by batched property processing in 2.x.
    // 2. To avoid double object propagation when a bag including values bound
    //    to the `if` property as well as one or more hostProps could enqueue
    //    the <dom-if> to flush before the <template>'s host property
    //    forwarding. In that scenario creating an instance would result in
    //    the host props being set once, and then the enqueued changes on the
    //    template would set properties a second time, potentially causing an
    //    object to be set to an instance more than once.  Creating the
    //    instance async from flushing data ensures this doesn't happen. If
    //    we wanted a sync option in the future, simply having <dom-if> flush
    //    (or clear) its template's pending host properties before creating
    //    the instance would also avoid the problem.
    this.__renderDebouncer = Debouncer.debounce(this.__renderDebouncer, microTask, () => this.__render());
    enqueueDebouncer(this.__renderDebouncer);
  } /**
     * @return {void}
     */

  disconnectedCallback() {
    super.disconnectedCallback();

    if (!this.parentNode || this.parentNode.nodeType == Node.DOCUMENT_FRAGMENT_NODE && !this.parentNode.host) {
      this.__teardownInstance();
    }
  } /**
     * @return {void}
     */

  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'none';

    if (this.if) {
      this.__debounceRender();
    }
  } /**
     * Forces the element to render its content. Normally rendering is
     * asynchronous to a provoking change. This is done for efficiency so
     * that multiple changes trigger only a single render. The render method
     * should be called if, for example, template rendering is required to
     * validate application state.
     * @return {void}
     */

  render() {
    flush$1();
  }

  __render() {
    if (this.if) {
      if (!this.__ensureInstance()) {
        // No template found yet
        return;
      }

      this._showHideChildren();
    } else if (this.restamp) {
      this.__teardownInstance();
    }

    if (!this.restamp && this.__instance) {
      this._showHideChildren();
    }

    if (this.if != this._lastIf) {
      this.dispatchEvent(new CustomEvent('dom-change', {
        bubbles: true,
        composed: true
      }));
      this._lastIf = this.if;
    }
  }

  __ensureInstance() {
    let parentNode = this.parentNode; // Guard against element being detached while render was queued

    if (parentNode) {
      if (!this.__ctor) {
        let template = /** @type {HTMLTemplateElement} */this.querySelector('template');

        if (!template) {
          // Wait until childList changes and template should be there by then
          let observer = new MutationObserver(() => {
            if (this.querySelector('template')) {
              observer.disconnect();

              this.__render();
            } else {
              throw new Error('dom-if requires a <template> child');
            }
          });
          observer.observe(this, {
            childList: true
          });
          return false;
        }

        this.__ctor = templatize(template, this, {
          // dom-if templatizer instances require `mutable: true`, as
          // `__syncHostProperties` relies on that behavior to sync objects
          mutableData: true,
          /**
           * @param {string} prop Property to forward
           * @param {*} value Value of property
           * @this {this}
           */forwardHostProp: function (prop, value) {
            if (this.__instance) {
              if (this.if) {
                this.__instance.forwardHostProp(prop, value);
              } else {
                // If we have an instance but are squelching host property
                // forwarding due to if being false, note the invalidated
                // properties so `__syncHostProperties` can sync them the next
                // time `if` becomes true
                this.__invalidProps = this.__invalidProps || Object.create(null);
                this.__invalidProps[root(prop)] = true;
              }
            }
          }
        });
      }

      if (!this.__instance) {
        this.__instance = new this.__ctor();
        parentNode.insertBefore(this.__instance.root, this);
      } else {
        this.__syncHostProperties();

        let c$ = this.__instance.children;

        if (c$ && c$.length) {
          // Detect case where dom-if was re-attached in new position
          let lastChild = this.previousSibling;

          if (lastChild !== c$[c$.length - 1]) {
            for (let i = 0, n; i < c$.length && (n = c$[i]); i++) {
              parentNode.insertBefore(n, this);
            }
          }
        }
      }
    }

    return true;
  }

  __syncHostProperties() {
    let props = this.__invalidProps;

    if (props) {
      for (let prop in props) {
        this.__instance._setPendingProperty(prop, this.__dataHost[prop]);
      }

      this.__invalidProps = null;

      this.__instance._flushProperties();
    }
  }

  __teardownInstance() {
    if (this.__instance) {
      let c$ = this.__instance.children;

      if (c$ && c$.length) {
        // use first child parent, for case when dom-if may have been detached
        let parent = c$[0].parentNode;

        for (let i = 0, n; i < c$.length && (n = c$[i]); i++) {
          parent.removeChild(n);
        }
      }

      this.__instance = null;
      this.__invalidProps = null;
    }
  } /**
     * Shows or hides the template instance top level child elements. For
     * text nodes, `textContent` is removed while "hidden" and replaced when
     * "shown."
     * @return {void}
     * @protected
     */

  _showHideChildren() {
    let hidden = this.__hideTemplateChildren__ || !this.if;

    if (this.__instance) {
      this.__instance._showHideChildren(hidden);
    }
  }

}

customElements.define(DomIf.is, DomIf);
var domIf = {
  DomIf: DomIf
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ /**
       * Element mixin for recording dynamic associations between item paths in a
       * master `items` array and a `selected` array such that path changes to the
       * master array (at the host) element or elsewhere via data-binding) are
       * correctly propagated to items in the selected array and vice-versa.
       *
       * The `items` property accepts an array of user data, and via the
       * `select(item)` and `deselect(item)` API, updates the `selected` property
       * which may be bound to other parts of the application, and any changes to
       * sub-fields of `selected` item(s) will be kept in sync with items in the
       * `items` array.  When `multi` is false, `selected` is a property
       * representing the last selected item.  When `multi` is true, `selected`
       * is an array of multiply selected items.
       *
       * @polymer
       * @mixinFunction
       * @appliesMixin ElementMixin
       * @summary Element mixin for recording dynamic associations between item paths in a
       * master `items` array and a `selected` array
       */
let ArraySelectorMixin = dedupingMixin(superClass => {
  /**
   * @constructor
   * @extends {superClass}
   * @implements {Polymer_ElementMixin}
   * @private
   */let elementBase = ElementMixin(superClass); /**
                                                  * @polymer
                                                  * @mixinClass
                                                  * @implements {Polymer_ArraySelectorMixin}
                                                  * @unrestricted
                                                  */

  class ArraySelectorMixin extends elementBase {
    static get properties() {
      return {
        /**
         * An array containing items from which selection will be made.
         */items: {
          type: Array
        },
        /**
         * When `true`, multiple items may be selected at once (in this case,
         * `selected` is an array of currently selected items).  When `false`,
         * only one item may be selected at a time.
         */multi: {
          type: Boolean,
          value: false
        },
        /**
         * When `multi` is true, this is an array that contains any selected.
         * When `multi` is false, this is the currently selected item, or `null`
         * if no item is selected.
         * @type {?(Object|Array<!Object>)}
         */selected: {
          type: Object,
          notify: true
        },
        /**
         * When `multi` is false, this is the currently selected item, or `null`
         * if no item is selected.
         * @type {?Object}
         */selectedItem: {
          type: Object,
          notify: true
        },
        /**
         * When `true`, calling `select` on an item that is already selected
         * will deselect the item.
         */toggle: {
          type: Boolean,
          value: false
        }
      };
    }

    static get observers() {
      return ['__updateSelection(multi, items.*)'];
    }

    constructor() {
      super();
      this.__lastItems = null;
      this.__lastMulti = null;
      this.__selectedMap = null;
    }

    __updateSelection(multi, itemsInfo) {
      let path = itemsInfo.path;

      if (path == 'items') {
        // Case 1 - items array changed, so diff against previous array and
        // deselect any removed items and adjust selected indices
        let newItems = itemsInfo.base || [];
        let lastItems = this.__lastItems;
        let lastMulti = this.__lastMulti;

        if (multi !== lastMulti) {
          this.clearSelection();
        }

        if (lastItems) {
          let splices = calculateSplices(newItems, lastItems);

          this.__applySplices(splices);
        }

        this.__lastItems = newItems;
        this.__lastMulti = multi;
      } else if (itemsInfo.path == 'items.splices') {
        // Case 2 - got specific splice information describing the array mutation:
        // deselect any removed items and adjust selected indices
        this.__applySplices(itemsInfo.value.indexSplices);
      } else {
        // Case 3 - an array element was changed, so deselect the previous
        // item for that index if it was previously selected
        let part = path.slice('items.'.length);
        let idx = parseInt(part, 10);

        if (part.indexOf('.') < 0 && part == idx) {
          this.__deselectChangedIdx(idx);
        }
      }
    }

    __applySplices(splices) {
      let selected = this.__selectedMap; // Adjust selected indices and mark removals

      for (let i = 0; i < splices.length; i++) {
        let s = splices[i];
        selected.forEach((idx, item) => {
          if (idx < s.index) {// no change
          } else if (idx >= s.index + s.removed.length) {
            // adjust index
            selected.set(item, idx + s.addedCount - s.removed.length);
          } else {
            // remove index
            selected.set(item, -1);
          }
        });

        for (let j = 0; j < s.addedCount; j++) {
          let idx = s.index + j;

          if (selected.has(this.items[idx])) {
            selected.set(this.items[idx], idx);
          }
        }
      } // Update linked paths


      this.__updateLinks(); // Remove selected items that were removed from the items array


      let sidx = 0;
      selected.forEach((idx, item) => {
        if (idx < 0) {
          if (this.multi) {
            this.splice('selected', sidx, 1);
          } else {
            this.selected = this.selectedItem = null;
          }

          selected.delete(item);
        } else {
          sidx++;
        }
      });
    }

    __updateLinks() {
      this.__dataLinkedPaths = {};

      if (this.multi) {
        let sidx = 0;

        this.__selectedMap.forEach(idx => {
          if (idx >= 0) {
            this.linkPaths('items.' + idx, 'selected.' + sidx++);
          }
        });
      } else {
        this.__selectedMap.forEach(idx => {
          this.linkPaths('selected', 'items.' + idx);
          this.linkPaths('selectedItem', 'items.' + idx);
        });
      }
    } /**
       * Clears the selection state.
       * @return {void}
       */

    clearSelection() {
      // Unbind previous selection
      this.__dataLinkedPaths = {}; // The selected map stores 3 pieces of information:
      // key: items array object
      // value: items array index
      // order: selected array index

      this.__selectedMap = new Map(); // Initialize selection

      this.selected = this.multi ? [] : null;
      this.selectedItem = null;
    } /**
       * Returns whether the item is currently selected.
       *
       * @param {*} item Item from `items` array to test
       * @return {boolean} Whether the item is selected
       */

    isSelected(item) {
      return this.__selectedMap.has(item);
    } /**
       * Returns whether the item is currently selected.
       *
       * @param {number} idx Index from `items` array to test
       * @return {boolean} Whether the item is selected
       */

    isIndexSelected(idx) {
      return this.isSelected(this.items[idx]);
    }

    __deselectChangedIdx(idx) {
      let sidx = this.__selectedIndexForItemIndex(idx);

      if (sidx >= 0) {
        let i = 0;

        this.__selectedMap.forEach((idx, item) => {
          if (sidx == i++) {
            this.deselect(item);
          }
        });
      }
    }

    __selectedIndexForItemIndex(idx) {
      let selected = this.__dataLinkedPaths['items.' + idx];

      if (selected) {
        return parseInt(selected.slice('selected.'.length), 10);
      }
    } /**
       * Deselects the given item if it is already selected.
       *
       * @param {*} item Item from `items` array to deselect
       * @return {void}
       */

    deselect(item) {
      let idx = this.__selectedMap.get(item);

      if (idx >= 0) {
        this.__selectedMap.delete(item);

        let sidx;

        if (this.multi) {
          sidx = this.__selectedIndexForItemIndex(idx);
        }

        this.__updateLinks();

        if (this.multi) {
          this.splice('selected', sidx, 1);
        } else {
          this.selected = this.selectedItem = null;
        }
      }
    } /**
       * Deselects the given index if it is already selected.
       *
       * @param {number} idx Index from `items` array to deselect
       * @return {void}
       */

    deselectIndex(idx) {
      this.deselect(this.items[idx]);
    } /**
       * Selects the given item.  When `toggle` is true, this will automatically
       * deselect the item if already selected.
       *
       * @param {*} item Item from `items` array to select
       * @return {void}
       */

    select(item) {
      this.selectIndex(this.items.indexOf(item));
    } /**
       * Selects the given index.  When `toggle` is true, this will automatically
       * deselect the item if already selected.
       *
       * @param {number} idx Index from `items` array to select
       * @return {void}
       */

    selectIndex(idx) {
      let item = this.items[idx];

      if (!this.isSelected(item)) {
        if (!this.multi) {
          this.__selectedMap.clear();
        }

        this.__selectedMap.set(item, idx);

        this.__updateLinks();

        if (this.multi) {
          this.push('selected', item);
        } else {
          this.selected = this.selectedItem = item;
        }
      } else if (this.toggle) {
        this.deselectIndex(idx);
      }
    }

  }

  return ArraySelectorMixin;
}); /**
     * @constructor
     * @extends {PolymerElement}
     * @implements {Polymer_ArraySelectorMixin}
     * @private
     */
let baseArraySelector = ArraySelectorMixin(PolymerElement); /**
                                                             * Element implementing the `ArraySelector` mixin, which records
                                                             * dynamic associations between item paths in a master `items` array and a
                                                             * `selected` array such that path changes to the master array (at the host)
                                                             * element or elsewhere via data-binding) are correctly propagated to items
                                                             * in the selected array and vice-versa.
                                                             *
                                                             * The `items` property accepts an array of user data, and via the
                                                             * `select(item)` and `deselect(item)` API, updates the `selected` property
                                                             * which may be bound to other parts of the application, and any changes to
                                                             * sub-fields of `selected` item(s) will be kept in sync with items in the
                                                             * `items` array.  When `multi` is false, `selected` is a property
                                                             * representing the last selected item.  When `multi` is true, `selected`
                                                             * is an array of multiply selected items.
                                                             *
                                                             * Example:
                                                             *
                                                             * ```js
                                                             * import {PolymerElement} from '@polymer/polymer';
                                                             * import '@polymer/polymer/lib/elements/array-selector.js';
                                                             *
                                                             * class EmployeeList extends PolymerElement {
                                                             *   static get _template() {
                                                             *     return html`
                                                             *         <div> Employee list: </div>
                                                             *         <dom-repeat id="employeeList" items="{{employees}}">
                                                             *           <template>
                                                             *             <div>First name: <span>{{item.first}}</span></div>
                                                             *               <div>Last name: <span>{{item.last}}</span></div>
                                                             *               <button on-click="toggleSelection">Select</button>
                                                             *           </template>
                                                             *         </dom-repeat>
                                                             *
                                                             *         <array-selector id="selector"
                                                             *                         items="{{employees}}"
                                                             *                         selected="{{selected}}"
                                                             *                         multi toggle></array-selector>
                                                             *
                                                             *         <div> Selected employees: </div>
                                                             *         <dom-repeat items="{{selected}}">
                                                             *           <template>
                                                             *             <div>First name: <span>{{item.first}}</span></div>
                                                             *             <div>Last name: <span>{{item.last}}</span></div>
                                                             *           </template>
                                                             *         </dom-repeat>`;
                                                             *   }
                                                             *   static get is() { return 'employee-list'; }
                                                             *   static get properties() {
                                                             *     return {
                                                             *       employees: {
                                                             *         value() {
                                                             *           return [
                                                             *             {first: 'Bob', last: 'Smith'},
                                                             *             {first: 'Sally', last: 'Johnson'},
                                                             *             ...
                                                             *           ];
                                                             *         }
                                                             *       }
                                                             *     };
                                                             *   }
                                                             *   toggleSelection(e) {
                                                             *     const item = this.$.employeeList.itemForElement(e.target);
                                                             *     this.$.selector.select(item);
                                                             *   }
                                                             * }
                                                             * ```
                                                             *
                                                             * @polymer
                                                             * @customElement
                                                             * @extends {baseArraySelector}
                                                             * @appliesMixin ArraySelectorMixin
                                                             * @summary Custom element that links paths between an input `items` array and
                                                             *   an output `selected` item or array based on calls to its selection API.
                                                             */

class ArraySelector extends baseArraySelector {
  // Not needed to find template; can be removed once the analyzer
  // can find the tag name from customElements.define call
  static get is() {
    return 'array-selector';
  }

}

customElements.define(ArraySelector.is, ArraySelector);
var arraySelector = {
  ArraySelectorMixin: ArraySelectorMixin,
  ArraySelector: ArraySelector
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
'use strict';

const customStyleInterface$1 = new CustomStyleInterface();

if (!window.ShadyCSS) {
  window.ShadyCSS = {
    /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     * @param {string=} elementExtends
     */prepareTemplate(template, elementName, elementExtends) {},

    // eslint-disable-line no-unused-vars
    /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     */prepareTemplateDom(template, elementName) {},

    // eslint-disable-line no-unused-vars
    /**
     * @param {!HTMLTemplateElement} template
     * @param {string} elementName
     * @param {string=} elementExtends
     */prepareTemplateStyles(template, elementName, elementExtends) {},

    // eslint-disable-line no-unused-vars
    /**
     * @param {Element} element
     * @param {Object=} properties
     */styleSubtree(element, properties) {
      customStyleInterface$1.processStyles();
      updateNativeProperties(element, properties);
    },

    /**
     * @param {Element} element
     */styleElement(element) {
      // eslint-disable-line no-unused-vars
      customStyleInterface$1.processStyles();
    },

    /**
     * @param {Object=} properties
     */styleDocument(properties) {
      customStyleInterface$1.processStyles();
      updateNativeProperties(document.body, properties);
    },

    /**
     * @param {Element} element
     * @param {string} property
     * @return {string}
     */getComputedStyleValue(element, property) {
      return getComputedStyleValue(element, property);
    },

    flushCustomStyles() {},

    nativeCss: nativeCssVariables,
    nativeShadow: nativeShadow
  };
}

window.ShadyCSS.CustomStyleInterface = customStyleInterface$1; /**
                                                               @license
                                                               Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
                                                               This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
                                                               The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
                                                               The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
                                                               Code distributed by Google as part of the polymer project is also
                                                               subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
                                                               */
const attr = 'include';
const CustomStyleInterface$1 = window.ShadyCSS.CustomStyleInterface; /**
                                                                      * Custom element for defining styles in the main document that can take
                                                                      * advantage of [shady DOM](https://github.com/webcomponents/shadycss) shims
                                                                      * for style encapsulation, custom properties, and custom mixins.
                                                                      *
                                                                      * - Document styles defined in a `<custom-style>` are shimmed to ensure they
                                                                      *   do not leak into local DOM when running on browsers without native
                                                                      *   Shadow DOM.
                                                                      * - Custom properties can be defined in a `<custom-style>`. Use the `html` selector
                                                                      *   to define custom properties that apply to all custom elements.
                                                                      * - Custom mixins can be defined in a `<custom-style>`, if you import the optional
                                                                      *   [apply shim](https://github.com/webcomponents/shadycss#about-applyshim)
                                                                      *   (`shadycss/apply-shim.html`).
                                                                      *
                                                                      * To use:
                                                                      *
                                                                      * - Import `custom-style.html`.
                                                                      * - Place a `<custom-style>` element in the main document, wrapping an inline `<style>` tag that
                                                                      *   contains the CSS rules you want to shim.
                                                                      *
                                                                      * For example:
                                                                      *
                                                                      * ```html
                                                                      * <!-- import apply shim--only required if using mixins -->
                                                                      * <link rel="import" href="bower_components/shadycss/apply-shim.html">
                                                                      * <!-- import custom-style element -->
                                                                      * <link rel="import" href="bower_components/polymer/lib/elements/custom-style.html">
                                                                      *
                                                                      * <custom-style>
                                                                      *   <style>
                                                                      *     html {
                                                                      *       --custom-color: blue;
                                                                      *       --custom-mixin: {
                                                                      *         font-weight: bold;
                                                                      *         color: red;
                                                                      *       };
                                                                      *     }
                                                                      *   </style>
                                                                      * </custom-style>
                                                                      * ```
                                                                      *
                                                                      * @customElement
                                                                      * @extends HTMLElement
                                                                      * @summary Custom element for defining styles in the main document that can
                                                                      *   take advantage of Polymer's style scoping and custom properties shims.
                                                                      */

class CustomStyle extends HTMLElement {
  constructor() {
    super();
    this._style = null;
    CustomStyleInterface$1.addCustomStyle(this);
  } /**
     * Returns the light-DOM `<style>` child this element wraps.  Upon first
     * call any style modules referenced via the `include` attribute will be
     * concatenated to this element's `<style>`.
     *
     * @return {HTMLStyleElement} This element's light-DOM `<style>`
     */

  getStyle() {
    if (this._style) {
      return this._style;
    }

    const style = /** @type {HTMLStyleElement} */this.querySelector('style');

    if (!style) {
      return null;
    }

    this._style = style;
    const include = style.getAttribute(attr);

    if (include) {
      style.removeAttribute(attr);
      style.textContent = cssFromModules(include) + style.textContent;
    } /*
      HTML Imports styling the main document are deprecated in Chrome
      https://crbug.com/523952
       If this element is not in the main document, then it must be in an HTML Import document.
      In that case, move the custom style to the main document.
       The ordering of `<custom-style>` should stay the same as when loaded by HTML Imports, but there may be odd
      cases of ordering w.r.t the main document styles.
      */

    if (this.ownerDocument !== window.document) {
      window.document.head.appendChild(this);
    }

    return this._style;
  }

}

window.customElements.define('custom-style', CustomStyle);
var customStyle = {
  CustomStyle: CustomStyle
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
let mutablePropertyChange$1; /** @suppress {missingProperties} */

(() => {
  mutablePropertyChange$1 = MutableData._mutablePropertyChange;
})(); /**
       * Legacy element behavior to skip strict dirty-checking for objects and arrays,
       * (always consider them to be "dirty") for use on legacy API Polymer elements.
       *
       * By default, `Polymer.PropertyEffects` performs strict dirty checking on
       * objects, which means that any deep modifications to an object or array will
       * not be propagated unless "immutable" data patterns are used (i.e. all object
       * references from the root to the mutation were changed).
       *
       * Polymer also provides a proprietary data mutation and path notification API
       * (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient
       * mutation and notification of deep changes in an object graph to all elements
       * bound to the same object graph.
       *
       * In cases where neither immutable patterns nor the data mutation API can be
       * used, applying this mixin will cause Polymer to skip dirty checking for
       * objects and arrays (always consider them to be "dirty").  This allows a
       * user to make a deep modification to a bound object graph, and then either
       * simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath`
       * (e.g. `this.notifyPath('items')`) to update the tree.  Note that all
       * elements that wish to be updated based on deep mutations must apply this
       * mixin or otherwise skip strict dirty checking for objects/arrays.
       * Specifically, any elements in the binding tree between the source of a
       * mutation and the consumption of it must apply this behavior or enable the
       * `Polymer.OptionalMutableDataBehavior`.
       *
       * In order to make the dirty check strategy configurable, see
       * `Polymer.OptionalMutableDataBehavior`.
       *
       * Note, the performance characteristics of propagating large object graphs
       * will be worse as opposed to using strict dirty checking with immutable
       * patterns or Polymer's path notification API.
       *
       * @polymerBehavior
       * @summary Behavior to skip strict dirty-checking for objects and
       *   arrays
       */

const MutableDataBehavior = {
  /**
   * Overrides `Polymer.PropertyEffects` to provide option for skipping
   * strict equality checking for Objects and Arrays.
   *
   * This method pulls the value to dirty check against from the `__dataTemp`
   * cache (rather than the normal `__data` cache) for Objects.  Since the temp
   * cache is cleared at the end of a turn, this implementation allows
   * side-effects of deep object changes to be processed by re-setting the
   * same object (using the temp cache as an in-turn backstop to prevent
   * cycles due to 2-way notification).
   *
   * @param {string} property Property name
   * @param {*} value New property value
   * @param {*} old Previous property value
   * @return {boolean} Whether the property should be considered a change
   * @protected
   */_shouldPropertyChange(property, value, old) {
    return mutablePropertyChange$1(this, property, value, old, true);
  }

}; /**
    * Legacy element behavior to add the optional ability to skip strict
    * dirty-checking for objects and arrays (always consider them to be
    * "dirty") by setting a `mutable-data` attribute on an element instance.
    *
    * By default, `Polymer.PropertyEffects` performs strict dirty checking on
    * objects, which means that any deep modifications to an object or array will
    * not be propagated unless "immutable" data patterns are used (i.e. all object
    * references from the root to the mutation were changed).
    *
    * Polymer also provides a proprietary data mutation and path notification API
    * (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient
    * mutation and notification of deep changes in an object graph to all elements
    * bound to the same object graph.
    *
    * In cases where neither immutable patterns nor the data mutation API can be
    * used, applying this mixin will allow Polymer to skip dirty checking for
    * objects and arrays (always consider them to be "dirty").  This allows a
    * user to make a deep modification to a bound object graph, and then either
    * simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath`
    * (e.g. `this.notifyPath('items')`) to update the tree.  Note that all
    * elements that wish to be updated based on deep mutations must apply this
    * mixin or otherwise skip strict dirty checking for objects/arrays.
    * Specifically, any elements in the binding tree between the source of a
    * mutation and the consumption of it must enable this behavior or apply the
    * `Polymer.OptionalMutableDataBehavior`.
    *
    * While this behavior adds the ability to forgo Object/Array dirty checking,
    * the `mutableData` flag defaults to false and must be set on the instance.
    *
    * Note, the performance characteristics of propagating large object graphs
    * will be worse by relying on `mutableData: true` as opposed to using
    * strict dirty checking with immutable patterns or Polymer's path notification
    * API.
    *
    * @polymerBehavior
    * @summary Behavior to optionally skip strict dirty-checking for objects and
    *   arrays
    */
const OptionalMutableDataBehavior = {
  properties: {
    /**
     * Instance-level flag for configuring the dirty-checking strategy
     * for this element.  When true, Objects and Arrays will skip dirty
     * checking, otherwise strict equality checking will be used.
     */mutableData: Boolean
  },

  /**
   * Overrides `Polymer.PropertyEffects` to skip strict equality checking
   * for Objects and Arrays.
   *
   * Pulls the value to dirty check against from the `__dataTemp` cache
   * (rather than the normal `__data` cache) for Objects.  Since the temp
   * cache is cleared at the end of a turn, this implementation allows
   * side-effects of deep object changes to be processed by re-setting the
   * same object (using the temp cache as an in-turn backstop to prevent
   * cycles due to 2-way notification).
   *
   * @param {string} property Property name
   * @param {*} value New property value
   * @param {*} old Previous property value
   * @return {boolean} Whether the property should be considered a change
   * @this {this}
   * @protected
   */_shouldPropertyChange(property, value, old) {
    return mutablePropertyChange$1(this, property, value, old, this.mutableData);
  }

};
var mutableDataBehavior = {
  MutableDataBehavior: MutableDataBehavior,
  OptionalMutableDataBehavior: OptionalMutableDataBehavior
}; /**
   @license
   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */ // bc

const Base = LegacyElementMixin(HTMLElement).prototype;
var polymerLegacy = {
  Base: Base,
  Polymer: Polymer,
  html: html$1
}; /**
   @license
   Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at
   http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
   http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
   found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
   part of the polymer project is also subject to an additional IP rights grant
   found at http://polymer.github.io/PATENTS.txt
   */ /** @polymerBehavior */
const PaperSpinnerBehavior = {
  properties: {
    /**
     * Displays the spinner.
     */active: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: '__activeChanged'
    },
    /**
     * Alternative text content for accessibility support.
     * If alt is present, it will add an aria-label whose content matches alt
     * when active. If alt is not present, it will default to 'loading' as the
     * alt value.
     */alt: {
      type: String,
      value: 'loading',
      observer: '__altChanged'
    },
    __coolingDown: {
      type: Boolean,
      value: false
    }
  },
  __computeContainerClasses: function (active, coolingDown) {
    return [active || coolingDown ? 'active' : '', coolingDown ? 'cooldown' : ''].join(' ');
  },
  __activeChanged: function (active, old) {
    this.__setAriaHidden(!active);

    this.__coolingDown = !active && old;
  },
  __altChanged: function (alt) {
    // user-provided `aria-label` takes precedence over prototype default
    if (alt === 'loading') {
      this.alt = this.getAttribute('aria-label') || alt;
    } else {
      this.__setAriaHidden(alt === '');

      this.setAttribute('aria-label', alt);
    }
  },
  __setAriaHidden: function (hidden) {
    var attr = 'aria-hidden';

    if (hidden) {
      this.setAttribute(attr, 'true');
    } else {
      this.removeAttribute(attr);
    }
  },
  __reset: function () {
    this.active = false;
    this.__coolingDown = false;
  }
};
var paperSpinnerBehavior = {
  PaperSpinnerBehavior: PaperSpinnerBehavior
}; /**
   @license
   Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at
   http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
   http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
   found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
   part of the polymer project is also subject to an additional IP rights grant
   found at http://polymer.github.io/PATENTS.txt
   */
const template$1 = html$1`
<custom-style>
  <style is="custom-style">
    html {

      /* Material Design color palette for Google products */

      --google-red-100: #f4c7c3;
      --google-red-300: #e67c73;
      --google-red-500: #db4437;
      --google-red-700: #c53929;

      --google-blue-100: #c6dafc;
      --google-blue-300: #7baaf7;
      --google-blue-500: #4285f4;
      --google-blue-700: #3367d6;

      --google-green-100: #b7e1cd;
      --google-green-300: #57bb8a;
      --google-green-500: #0f9d58;
      --google-green-700: #0b8043;

      --google-yellow-100: #fce8b2;
      --google-yellow-300: #f7cb4d;
      --google-yellow-500: #f4b400;
      --google-yellow-700: #f09300;

      --google-grey-100: #f5f5f5;
      --google-grey-300: #e0e0e0;
      --google-grey-500: #9e9e9e;
      --google-grey-700: #616161;

      /* Material Design color palette from online spec document */

      --paper-red-50: #ffebee;
      --paper-red-100: #ffcdd2;
      --paper-red-200: #ef9a9a;
      --paper-red-300: #e57373;
      --paper-red-400: #ef5350;
      --paper-red-500: #f44336;
      --paper-red-600: #e53935;
      --paper-red-700: #d32f2f;
      --paper-red-800: #c62828;
      --paper-red-900: #b71c1c;
      --paper-red-a100: #ff8a80;
      --paper-red-a200: #ff5252;
      --paper-red-a400: #ff1744;
      --paper-red-a700: #d50000;

      --paper-pink-50: #fce4ec;
      --paper-pink-100: #f8bbd0;
      --paper-pink-200: #f48fb1;
      --paper-pink-300: #f06292;
      --paper-pink-400: #ec407a;
      --paper-pink-500: #e91e63;
      --paper-pink-600: #d81b60;
      --paper-pink-700: #c2185b;
      --paper-pink-800: #ad1457;
      --paper-pink-900: #880e4f;
      --paper-pink-a100: #ff80ab;
      --paper-pink-a200: #ff4081;
      --paper-pink-a400: #f50057;
      --paper-pink-a700: #c51162;

      --paper-purple-50: #f3e5f5;
      --paper-purple-100: #e1bee7;
      --paper-purple-200: #ce93d8;
      --paper-purple-300: #ba68c8;
      --paper-purple-400: #ab47bc;
      --paper-purple-500: #9c27b0;
      --paper-purple-600: #8e24aa;
      --paper-purple-700: #7b1fa2;
      --paper-purple-800: #6a1b9a;
      --paper-purple-900: #4a148c;
      --paper-purple-a100: #ea80fc;
      --paper-purple-a200: #e040fb;
      --paper-purple-a400: #d500f9;
      --paper-purple-a700: #aa00ff;

      --paper-deep-purple-50: #ede7f6;
      --paper-deep-purple-100: #d1c4e9;
      --paper-deep-purple-200: #b39ddb;
      --paper-deep-purple-300: #9575cd;
      --paper-deep-purple-400: #7e57c2;
      --paper-deep-purple-500: #673ab7;
      --paper-deep-purple-600: #5e35b1;
      --paper-deep-purple-700: #512da8;
      --paper-deep-purple-800: #4527a0;
      --paper-deep-purple-900: #311b92;
      --paper-deep-purple-a100: #b388ff;
      --paper-deep-purple-a200: #7c4dff;
      --paper-deep-purple-a400: #651fff;
      --paper-deep-purple-a700: #6200ea;

      --paper-indigo-50: #e8eaf6;
      --paper-indigo-100: #c5cae9;
      --paper-indigo-200: #9fa8da;
      --paper-indigo-300: #7986cb;
      --paper-indigo-400: #5c6bc0;
      --paper-indigo-500: #3f51b5;
      --paper-indigo-600: #3949ab;
      --paper-indigo-700: #303f9f;
      --paper-indigo-800: #283593;
      --paper-indigo-900: #1a237e;
      --paper-indigo-a100: #8c9eff;
      --paper-indigo-a200: #536dfe;
      --paper-indigo-a400: #3d5afe;
      --paper-indigo-a700: #304ffe;

      --paper-blue-50: #e3f2fd;
      --paper-blue-100: #bbdefb;
      --paper-blue-200: #90caf9;
      --paper-blue-300: #64b5f6;
      --paper-blue-400: #42a5f5;
      --paper-blue-500: #2196f3;
      --paper-blue-600: #1e88e5;
      --paper-blue-700: #1976d2;
      --paper-blue-800: #1565c0;
      --paper-blue-900: #0d47a1;
      --paper-blue-a100: #82b1ff;
      --paper-blue-a200: #448aff;
      --paper-blue-a400: #2979ff;
      --paper-blue-a700: #2962ff;

      --paper-light-blue-50: #e1f5fe;
      --paper-light-blue-100: #b3e5fc;
      --paper-light-blue-200: #81d4fa;
      --paper-light-blue-300: #4fc3f7;
      --paper-light-blue-400: #29b6f6;
      --paper-light-blue-500: #03a9f4;
      --paper-light-blue-600: #039be5;
      --paper-light-blue-700: #0288d1;
      --paper-light-blue-800: #0277bd;
      --paper-light-blue-900: #01579b;
      --paper-light-blue-a100: #80d8ff;
      --paper-light-blue-a200: #40c4ff;
      --paper-light-blue-a400: #00b0ff;
      --paper-light-blue-a700: #0091ea;

      --paper-cyan-50: #e0f7fa;
      --paper-cyan-100: #b2ebf2;
      --paper-cyan-200: #80deea;
      --paper-cyan-300: #4dd0e1;
      --paper-cyan-400: #26c6da;
      --paper-cyan-500: #00bcd4;
      --paper-cyan-600: #00acc1;
      --paper-cyan-700: #0097a7;
      --paper-cyan-800: #00838f;
      --paper-cyan-900: #006064;
      --paper-cyan-a100: #84ffff;
      --paper-cyan-a200: #18ffff;
      --paper-cyan-a400: #00e5ff;
      --paper-cyan-a700: #00b8d4;

      --paper-teal-50: #e0f2f1;
      --paper-teal-100: #b2dfdb;
      --paper-teal-200: #80cbc4;
      --paper-teal-300: #4db6ac;
      --paper-teal-400: #26a69a;
      --paper-teal-500: #009688;
      --paper-teal-600: #00897b;
      --paper-teal-700: #00796b;
      --paper-teal-800: #00695c;
      --paper-teal-900: #004d40;
      --paper-teal-a100: #a7ffeb;
      --paper-teal-a200: #64ffda;
      --paper-teal-a400: #1de9b6;
      --paper-teal-a700: #00bfa5;

      --paper-green-50: #e8f5e9;
      --paper-green-100: #c8e6c9;
      --paper-green-200: #a5d6a7;
      --paper-green-300: #81c784;
      --paper-green-400: #66bb6a;
      --paper-green-500: #4caf50;
      --paper-green-600: #43a047;
      --paper-green-700: #388e3c;
      --paper-green-800: #2e7d32;
      --paper-green-900: #1b5e20;
      --paper-green-a100: #b9f6ca;
      --paper-green-a200: #69f0ae;
      --paper-green-a400: #00e676;
      --paper-green-a700: #00c853;

      --paper-light-green-50: #f1f8e9;
      --paper-light-green-100: #dcedc8;
      --paper-light-green-200: #c5e1a5;
      --paper-light-green-300: #aed581;
      --paper-light-green-400: #9ccc65;
      --paper-light-green-500: #8bc34a;
      --paper-light-green-600: #7cb342;
      --paper-light-green-700: #689f38;
      --paper-light-green-800: #558b2f;
      --paper-light-green-900: #33691e;
      --paper-light-green-a100: #ccff90;
      --paper-light-green-a200: #b2ff59;
      --paper-light-green-a400: #76ff03;
      --paper-light-green-a700: #64dd17;

      --paper-lime-50: #f9fbe7;
      --paper-lime-100: #f0f4c3;
      --paper-lime-200: #e6ee9c;
      --paper-lime-300: #dce775;
      --paper-lime-400: #d4e157;
      --paper-lime-500: #cddc39;
      --paper-lime-600: #c0ca33;
      --paper-lime-700: #afb42b;
      --paper-lime-800: #9e9d24;
      --paper-lime-900: #827717;
      --paper-lime-a100: #f4ff81;
      --paper-lime-a200: #eeff41;
      --paper-lime-a400: #c6ff00;
      --paper-lime-a700: #aeea00;

      --paper-yellow-50: #fffde7;
      --paper-yellow-100: #fff9c4;
      --paper-yellow-200: #fff59d;
      --paper-yellow-300: #fff176;
      --paper-yellow-400: #ffee58;
      --paper-yellow-500: #ffeb3b;
      --paper-yellow-600: #fdd835;
      --paper-yellow-700: #fbc02d;
      --paper-yellow-800: #f9a825;
      --paper-yellow-900: #f57f17;
      --paper-yellow-a100: #ffff8d;
      --paper-yellow-a200: #ffff00;
      --paper-yellow-a400: #ffea00;
      --paper-yellow-a700: #ffd600;

      --paper-amber-50: #fff8e1;
      --paper-amber-100: #ffecb3;
      --paper-amber-200: #ffe082;
      --paper-amber-300: #ffd54f;
      --paper-amber-400: #ffca28;
      --paper-amber-500: #ffc107;
      --paper-amber-600: #ffb300;
      --paper-amber-700: #ffa000;
      --paper-amber-800: #ff8f00;
      --paper-amber-900: #ff6f00;
      --paper-amber-a100: #ffe57f;
      --paper-amber-a200: #ffd740;
      --paper-amber-a400: #ffc400;
      --paper-amber-a700: #ffab00;

      --paper-orange-50: #fff3e0;
      --paper-orange-100: #ffe0b2;
      --paper-orange-200: #ffcc80;
      --paper-orange-300: #ffb74d;
      --paper-orange-400: #ffa726;
      --paper-orange-500: #ff9800;
      --paper-orange-600: #fb8c00;
      --paper-orange-700: #f57c00;
      --paper-orange-800: #ef6c00;
      --paper-orange-900: #e65100;
      --paper-orange-a100: #ffd180;
      --paper-orange-a200: #ffab40;
      --paper-orange-a400: #ff9100;
      --paper-orange-a700: #ff6500;

      --paper-deep-orange-50: #fbe9e7;
      --paper-deep-orange-100: #ffccbc;
      --paper-deep-orange-200: #ffab91;
      --paper-deep-orange-300: #ff8a65;
      --paper-deep-orange-400: #ff7043;
      --paper-deep-orange-500: #ff5722;
      --paper-deep-orange-600: #f4511e;
      --paper-deep-orange-700: #e64a19;
      --paper-deep-orange-800: #d84315;
      --paper-deep-orange-900: #bf360c;
      --paper-deep-orange-a100: #ff9e80;
      --paper-deep-orange-a200: #ff6e40;
      --paper-deep-orange-a400: #ff3d00;
      --paper-deep-orange-a700: #dd2c00;

      --paper-brown-50: #efebe9;
      --paper-brown-100: #d7ccc8;
      --paper-brown-200: #bcaaa4;
      --paper-brown-300: #a1887f;
      --paper-brown-400: #8d6e63;
      --paper-brown-500: #795548;
      --paper-brown-600: #6d4c41;
      --paper-brown-700: #5d4037;
      --paper-brown-800: #4e342e;
      --paper-brown-900: #3e2723;

      --paper-grey-50: #fafafa;
      --paper-grey-100: #f5f5f5;
      --paper-grey-200: #eeeeee;
      --paper-grey-300: #e0e0e0;
      --paper-grey-400: #bdbdbd;
      --paper-grey-500: #9e9e9e;
      --paper-grey-600: #757575;
      --paper-grey-700: #616161;
      --paper-grey-800: #424242;
      --paper-grey-900: #212121;

      --paper-blue-grey-50: #eceff1;
      --paper-blue-grey-100: #cfd8dc;
      --paper-blue-grey-200: #b0bec5;
      --paper-blue-grey-300: #90a4ae;
      --paper-blue-grey-400: #78909c;
      --paper-blue-grey-500: #607d8b;
      --paper-blue-grey-600: #546e7a;
      --paper-blue-grey-700: #455a64;
      --paper-blue-grey-800: #37474f;
      --paper-blue-grey-900: #263238;

      /* opacity for dark text on a light background */
      --dark-divider-opacity: 0.12;
      --dark-disabled-opacity: 0.38; /* or hint text or icon */
      --dark-secondary-opacity: 0.54;
      --dark-primary-opacity: 0.87;

      /* opacity for light text on a dark background */
      --light-divider-opacity: 0.12;
      --light-disabled-opacity: 0.3; /* or hint text or icon */
      --light-secondary-opacity: 0.7;
      --light-primary-opacity: 1.0;

    }

  </style>
</custom-style>
`;
template$1.setAttribute('style', 'display: none;');
document.head.appendChild(template$1.content); /**
                                               @license
                                               Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
                                               This code may only be used under the BSD style license found at
                                               http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
                                               http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
                                               found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
                                               part of the polymer project is also subject to an additional IP rights grant
                                               found at http://polymer.github.io/PATENTS.txt
                                               */
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');
$_documentContainer.innerHTML = `<dom-module id="paper-spinner-styles">
  <template>
    <style>
      /*
      /**************************/
      /* STYLES FOR THE SPINNER */
      /**************************/

      /*
       * Constants:
       *      ARCSIZE     = 270 degrees (amount of circle the arc takes up)
       *      ARCTIME     = 1333ms (time it takes to expand and contract arc)
       *      ARCSTARTROT = 216 degrees (how much the start location of the arc
       *                                should rotate each time, 216 gives us a
       *                                5 pointed star shape (it's 360/5 * 3).
       *                                For a 7 pointed star, we might do
       *                                360/7 * 3 = 154.286)
       *      SHRINK_TIME = 400ms
       */

      :host {
        display: inline-block;
        position: relative;
        width: 28px;
        height: 28px;

        /* 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */
        --paper-spinner-container-rotation-duration: 1568ms;

        /* ARCTIME */
        --paper-spinner-expand-contract-duration: 1333ms;

        /* 4 * ARCTIME */
        --paper-spinner-full-cycle-duration: 5332ms;

        /* SHRINK_TIME */
        --paper-spinner-cooldown-duration: 400ms;
      }

      #spinnerContainer {
        width: 100%;
        height: 100%;

        /* The spinner does not have any contents that would have to be
         * flipped if the direction changes. Always use ltr so that the
         * style works out correctly in both cases. */
        direction: ltr;
      }

      #spinnerContainer.active {
        -webkit-animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite;
        animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite;
      }

      @-webkit-keyframes container-rotate {
        to { -webkit-transform: rotate(360deg) }
      }

      @keyframes container-rotate {
        to { transform: rotate(360deg) }
      }

      .spinner-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        white-space: nowrap;
        color: var(--paper-spinner-color, var(--google-blue-500));
      }

      .layer-1 {
        color: var(--paper-spinner-layer-1-color, var(--google-blue-500));
      }

      .layer-2 {
        color: var(--paper-spinner-layer-2-color, var(--google-red-500));
      }

      .layer-3 {
        color: var(--paper-spinner-layer-3-color, var(--google-yellow-500));
      }

      .layer-4 {
        color: var(--paper-spinner-layer-4-color, var(--google-green-500));
      }

      /**
       * IMPORTANT NOTE ABOUT CSS ANIMATION PROPERTIES (keanulee):
       *
       * iOS Safari (tested on iOS 8.1) does not handle animation-delay very well - it doesn't
       * guarantee that the animation will start _exactly_ after that value. So we avoid using
       * animation-delay and instead set custom keyframes for each color (as layer-2undant as it
       * seems).
       */
      .active .spinner-layer {
        -webkit-animation-name: fill-unfill-rotate;
        -webkit-animation-duration: var(--paper-spinner-full-cycle-duration);
        -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
        -webkit-animation-iteration-count: infinite;
        animation-name: fill-unfill-rotate;
        animation-duration: var(--paper-spinner-full-cycle-duration);
        animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
        animation-iteration-count: infinite;
        opacity: 1;
      }

      .active .spinner-layer.layer-1 {
        -webkit-animation-name: fill-unfill-rotate, layer-1-fade-in-out;
        animation-name: fill-unfill-rotate, layer-1-fade-in-out;
      }

      .active .spinner-layer.layer-2 {
        -webkit-animation-name: fill-unfill-rotate, layer-2-fade-in-out;
        animation-name: fill-unfill-rotate, layer-2-fade-in-out;
      }

      .active .spinner-layer.layer-3 {
        -webkit-animation-name: fill-unfill-rotate, layer-3-fade-in-out;
        animation-name: fill-unfill-rotate, layer-3-fade-in-out;
      }

      .active .spinner-layer.layer-4 {
        -webkit-animation-name: fill-unfill-rotate, layer-4-fade-in-out;
        animation-name: fill-unfill-rotate, layer-4-fade-in-out;
      }

      @-webkit-keyframes fill-unfill-rotate {
        12.5% { -webkit-transform: rotate(135deg) } /* 0.5 * ARCSIZE */
        25%   { -webkit-transform: rotate(270deg) } /* 1   * ARCSIZE */
        37.5% { -webkit-transform: rotate(405deg) } /* 1.5 * ARCSIZE */
        50%   { -webkit-transform: rotate(540deg) } /* 2   * ARCSIZE */
        62.5% { -webkit-transform: rotate(675deg) } /* 2.5 * ARCSIZE */
        75%   { -webkit-transform: rotate(810deg) } /* 3   * ARCSIZE */
        87.5% { -webkit-transform: rotate(945deg) } /* 3.5 * ARCSIZE */
        to    { -webkit-transform: rotate(1080deg) } /* 4   * ARCSIZE */
      }

      @keyframes fill-unfill-rotate {
        12.5% { transform: rotate(135deg) } /* 0.5 * ARCSIZE */
        25%   { transform: rotate(270deg) } /* 1   * ARCSIZE */
        37.5% { transform: rotate(405deg) } /* 1.5 * ARCSIZE */
        50%   { transform: rotate(540deg) } /* 2   * ARCSIZE */
        62.5% { transform: rotate(675deg) } /* 2.5 * ARCSIZE */
        75%   { transform: rotate(810deg) } /* 3   * ARCSIZE */
        87.5% { transform: rotate(945deg) } /* 3.5 * ARCSIZE */
        to    { transform: rotate(1080deg) } /* 4   * ARCSIZE */
      }

      @-webkit-keyframes layer-1-fade-in-out {
        0% { opacity: 1 }
        25% { opacity: 1 }
        26% { opacity: 0 }
        89% { opacity: 0 }
        90% { opacity: 1 }
        to { opacity: 1 }
      }

      @keyframes layer-1-fade-in-out {
        0% { opacity: 1 }
        25% { opacity: 1 }
        26% { opacity: 0 }
        89% { opacity: 0 }
        90% { opacity: 1 }
        to { opacity: 1 }
      }

      @-webkit-keyframes layer-2-fade-in-out {
        0% { opacity: 0 }
        15% { opacity: 0 }
        25% { opacity: 1 }
        50% { opacity: 1 }
        51% { opacity: 0 }
        to { opacity: 0 }
      }

      @keyframes layer-2-fade-in-out {
        0% { opacity: 0 }
        15% { opacity: 0 }
        25% { opacity: 1 }
        50% { opacity: 1 }
        51% { opacity: 0 }
        to { opacity: 0 }
      }

      @-webkit-keyframes layer-3-fade-in-out {
        0% { opacity: 0 }
        40% { opacity: 0 }
        50% { opacity: 1 }
        75% { opacity: 1 }
        76% { opacity: 0 }
        to { opacity: 0 }
      }

      @keyframes layer-3-fade-in-out {
        0% { opacity: 0 }
        40% { opacity: 0 }
        50% { opacity: 1 }
        75% { opacity: 1 }
        76% { opacity: 0 }
        to { opacity: 0 }
      }

      @-webkit-keyframes layer-4-fade-in-out {
        0% { opacity: 0 }
        65% { opacity: 0 }
        75% { opacity: 1 }
        90% { opacity: 1 }
        to { opacity: 0 }
      }

      @keyframes layer-4-fade-in-out {
        0% { opacity: 0 }
        65% { opacity: 0 }
        75% { opacity: 1 }
        90% { opacity: 1 }
        to { opacity: 0 }
      }

      .circle-clipper {
        display: inline-block;
        position: relative;
        width: 50%;
        height: 100%;
        overflow: hidden;
      }

      /**
       * Patch the gap that appear between the two adjacent div.circle-clipper while the
       * spinner is rotating (appears on Chrome 50, Safari 9.1.1, and Edge).
       */
      .spinner-layer::after {
        left: 45%;
        width: 10%;
        border-top-style: solid;
      }

      .spinner-layer::after,
      .circle-clipper::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 0;
        border-width: var(--paper-spinner-stroke-width, 3px);
        border-radius: 50%;
      }

      .circle-clipper::after {
        bottom: 0;
        width: 200%;
        border-style: solid;
        border-bottom-color: transparent !important;
      }

      .circle-clipper.left::after {
        left: 0;
        border-right-color: transparent !important;
        -webkit-transform: rotate(129deg);
        transform: rotate(129deg);
      }

      .circle-clipper.right::after {
        left: -100%;
        border-left-color: transparent !important;
        -webkit-transform: rotate(-129deg);
        transform: rotate(-129deg);
      }

      .active .gap-patch::after,
      .active .circle-clipper::after {
        -webkit-animation-duration: var(--paper-spinner-expand-contract-duration);
        -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
        -webkit-animation-iteration-count: infinite;
        animation-duration: var(--paper-spinner-expand-contract-duration);
        animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
        animation-iteration-count: infinite;
      }

      .active .circle-clipper.left::after {
        -webkit-animation-name: left-spin;
        animation-name: left-spin;
      }

      .active .circle-clipper.right::after {
        -webkit-animation-name: right-spin;
        animation-name: right-spin;
      }

      @-webkit-keyframes left-spin {
        0% { -webkit-transform: rotate(130deg) }
        50% { -webkit-transform: rotate(-5deg) }
        to { -webkit-transform: rotate(130deg) }
      }

      @keyframes left-spin {
        0% { transform: rotate(130deg) }
        50% { transform: rotate(-5deg) }
        to { transform: rotate(130deg) }
      }

      @-webkit-keyframes right-spin {
        0% { -webkit-transform: rotate(-130deg) }
        50% { -webkit-transform: rotate(5deg) }
        to { -webkit-transform: rotate(-130deg) }
      }

      @keyframes right-spin {
        0% { transform: rotate(-130deg) }
        50% { transform: rotate(5deg) }
        to { transform: rotate(-130deg) }
      }

      #spinnerContainer.cooldown {
        -webkit-animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite, fade-out var(--paper-spinner-cooldown-duration) cubic-bezier(0.4, 0.0, 0.2, 1);
        animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite, fade-out var(--paper-spinner-cooldown-duration) cubic-bezier(0.4, 0.0, 0.2, 1);
      }

      @-webkit-keyframes fade-out {
        0% { opacity: 1 }
        to { opacity: 0 }
      }

      @keyframes fade-out {
        0% { opacity: 1 }
        to { opacity: 0 }
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer.content); /**
                                                        @license
                                                        Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
                                                        This code may only be used under the BSD style license found at
                                                        http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
                                                        http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
                                                        found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
                                                        part of the polymer project is also subject to an additional IP rights grant
                                                        found at http://polymer.github.io/PATENTS.txt
                                                        */
const template$2 = html$1`
  <style include="paper-spinner-styles"></style>

  <div id="spinnerContainer" class-name="[[__computeContainerClasses(active, __coolingDown)]]" on-animationend="__reset" on-webkit-animation-end="__reset">
    <div class="spinner-layer">
      <div class="circle-clipper left"></div>
      <div class="circle-clipper right"></div>
    </div>
  </div>
`;
template$2.setAttribute('strip-whitespace', ''); /**
                                                 Material design: [Progress &
                                                 activity](https://www.google.com/design/spec/components/progress-activity.html)
                                                 
                                                 Element providing a single color material design circular spinner.
                                                 
                                                     <paper-spinner-lite active></paper-spinner-lite>
                                                 
                                                 The default spinner is blue. It can be customized to be a different color.
                                                 
                                                 ### Accessibility
                                                 
                                                 Alt attribute should be set to provide adequate context for accessibility. If
                                                 not provided, it defaults to 'loading'. Empty alt can be provided to mark the
                                                 element as decorative if alternative content is provided in another form (e.g. a
                                                 text block following the spinner).
                                                 
                                                     <paper-spinner-lite alt="Loading contacts list" active></paper-spinner-lite>
                                                 
                                                 ### Styling
                                                 
                                                 The following custom properties and mixins are available for styling:
                                                 
                                                 Custom property | Description | Default
                                                 ----------------|-------------|----------
                                                 `--paper-spinner-color` | Color of the spinner | `--google-blue-500`
                                                 `--paper-spinner-stroke-width` | The width of the spinner stroke | 3px
                                                 
                                                 @group Paper Elements
                                                 @element paper-spinner-lite
                                                 @hero hero.svg
                                                 @demo demo/index.html
                                                 */
Polymer({
  _template: template$2,
  is: 'paper-spinner-lite',
  behaviors: [PaperSpinnerBehavior]
});
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
      src: {
        type: String
      }
    };
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

class OrientationChanger extends LitElement {
  constructor() {
    super();
    const docEl = document.documentElement;
    this._requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    this._cancelFullScreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    this._orientation = screen.msOrientation || screen.orientation || screen.mozOrientation || {};
  }

  async lock(orientation) {
    this._requestFullScreen.call(document.documentElement);

    try {
      await this._orientation.lock(orientation);
    } catch (err) {
      console.log("screen.orientation.lock() is not available on this device.");

      this._cancelFullScreen.call(document);
    }
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
    `;
  }

}

customElements.define('orientation-changer', OrientationChanger);
var orientationChanger = {
  OrientationChanger: OrientationChanger
};

class SensorTestsPage extends LitElement {
  static get properties() {
    return {
      frequency: {
        type: Number
      },
      referenceFrame: {
        type: String
      },
      sensorType: {
        type: String
      },
      tests: {
        type: String
      },
      isSupported: {
        type: String
      },
      items: {
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.frequency = 10;
    this.referenceFrame = "device";
    this.isSupported = "supported";
    this.items = [];
  }

  get sensor() {
    return this.sensor_;
  }

  getItemText(state) {
    return state || "RUN";
  }

  isTestRunning(state) {
    return state === "RUNNING";
  }

  runAllTests() {// TODO(alex)
  }

  testRunning(index) {
    this.items[index].state = 'RUNNING';
    this.requestUpdate('items');
  }

  testPassed(index) {
    this.items[index].state = 'PASSED';
    this.requestUpdate('items');
    this.testCompleted(index);
  }

  testFailed(index) {
    this.items[index].state = 'FAILED';
    this.requestUpdate('items');
    this.testCompleted(index);
  }

  testCompleted(index) {
    clearTimeout(this.items[index].timeout_id);
    this.sensor.removeEventListener('reading', this.items[index].handler);
    this.sensor.stop();
  }

  firstUpdated() {
    fetch(this.tests).then(response => response.json()).then(json => {
      this.items = json;
      this.requestUpdate('items');
    });

    if (this.sensorType in window) {
      this.sensor_ = new window[this.sensorType]({
        frequency: this.frequency,
        referenceFrame: this.referenceFrame
      });

      this.sensor_.onreading = () => {
        this.sensor_.stop();
        this.sensor_.onreading = null;
      };

      this.sensor_.onerror = e => {
        if (e.error.name === 'NotReadableError') {
          this.isSupported = "not-supported";
          this.referenceFrame = "device";
          this.items = [];
          this.requestUpdate('items');
        }
      };

      this.sensor_.start();
    } else {
      this.isSupported = "not-supported";
      this.referenceFrame = "device";
    }
  }

  runTest(index) {
    let item = this.items[index]; // set state of test case to 'running'

    this.testRunning(index); // set timeout and save it's id

    this.items[index].timeout_id = setTimeout(() => {
      this.testFailed(index);
    }, item.duration * 1000);

    const compareReadings = (val, exp, eps) => {
      if (typeof exp == 'object' && "min" in exp) {
        return val >= exp.min;
      } else if (typeof exp == 'object' && "max" in exp) {
        return val <= exp.max;
      } else if (val instanceof Array && exp instanceof Array) {
        if (val.length != exp.length) {
          return false;
        }

        return Object.keys(val).every(key => compareReadings(val[key], exp[key], eps));
      } else if (typeof exp === 'number' && typeof val === 'number') {
        return Math.abs(val - exp) < eps;
      }

      return false;
    }; // if sensor value is same as expectation, pass test


    this.items[index].handler = () => {
      if (Object.keys(item.expected).every(key => compareReadings(this.sensor[key], item.expected[key], item.epsilon))) {
        this.testPassed(index);
      }
    }; // add onreading event listener to receive new events.


    this.sensor.addEventListener('reading', this.items[index].handler); // start sensor

    this.sensor.start();
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          padding: 10px;
        }
  
        div.not-supported {
          display: block;
        }
  
        div.supported {
          display: none;
        }
  
        div.device {
          display: none;
        }
  
        div.screen {
          display: block;
        }
  
        mwc-button {
          margin-left: 0px;
          margin-right: 10px;
          position: relative;
          float: right;
          --mdc-theme-primary: var(--app-primary-color);
        }
  
        mwc-button.LOCK {
          margin-bottom: 10px;
          float: none;
          --mdc-theme-primary: var(--app-primary-color);
        }
  
        mwc-button.PASSED {
          --mdc-theme-primary: var(--paper-green-500);
        }
  
        mwc-button.FAILED {
          --mdc-theme-primary: var(--paper-red-500);
        }
  
        mwc-button.RUNNING {
          --mdc-theme-primary: var(--app-primary-color);
        }
  
        paper-spinner-lite.green {
          margin: 6px 10px 0px 0px;
          --paper-spinner-color: var(--paper-green-500);
        }
  
        .item {
          @apply --layout-vertical;
          background-color: white;
          max-width: 100%;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
  
        .header {
          @apply --layout-horizontal;
        }
  
        h1 {
          margin: 10px 0 0 0;
          font-size: 20px;
        }
  
        .title {
          height: 40px;
          @apply --layout-flex;
        }
  
        .description {
          margin-top: 14px;
        }
  
        .image {
          @apply --layout-horizontal;
          @apply --layout-wrap;
          @apply --layout-center-justified;
          margin-top: 8px;
        }
      </style>
  
      <div class="${this.isSupported}">Sensor is not supported by the browser or the device.</div>

      <div class="${this.referenceFrame}">
        <orientation-changer></orientation-changer>
      </div>

      ${this.items.map((item, index) => html`
          <div>
            <div class="item">
              <div class="header">
                <div class="title"><h1>${item.name}</h1></div>
                <paper-spinner-lite ?active="${this.isTestRunning(item.state)}" class="green"></paper-spinner-lite>
                <mwc-button raised @click="${() => this.runTest(index)}" class="${item.state}" label="${this.getItemText(item.state)}"></mwc-button>
              </div>
              <div class="description">${item.description}</div>
              <div class="image">
                <lazy-image src="${item.illustration}"></lazy-image>
              </div>
            </div>
          </div>
      `)}
    `;
  }

}

customElements.define('sensor-tests-page', SensorTestsPage);
export { component as $component, foundation as $foundation, adapter as $adapter, constants as $constants, foundation$1 as $foundation$1, index$2 as $index, componentElement as $componentElement, formableComponentElement as $formableComponentElement, mdcWebComponent as $mdcWebComponent, selectionController as $selectionController, utils as $utils, mwcButtonCss as $mwcButtonCss, mwcButton as $mwcButton, mwcFormfieldCss as $mwcFormfieldCss, mwcFormfield as $mwcFormfield, mwcRadioCss as $mwcRadioCss, mwcRadio as $mwcRadio, mwcRippleCss as $mwcRippleCss, mwcRipple as $mwcRipple, adapter$2 as $adapter$1, constants$2 as $constants$1, foundation$3 as $foundation$2, index$3 as $index$1, adapter$1 as $adapter$2, constants$1 as $constants$2, foundation$2 as $foundation$3, index as $index$2, util as $util, index$1 as $index$3, decorators as $decorators, updatingElement as $updatingElement, litElement as $litElement, paperSpinnerBehavior as $paperSpinnerBehavior, arraySelector as $arraySelector, customStyle as $customStyle, domBind as $domBind, domIf as $domIf, domModule as $domModule, domRepeat as $domRepeat, _class as $class, legacyElementMixin as $legacyElementMixin, mutableDataBehavior as $mutableDataBehavior, polymerFn as $polymerFn, polymer_dom as $polymerDom, templatizerBehavior as $templatizerBehavior, dirMixin as $dirMixin, elementMixin as $elementMixin, gestureEventListeners as $gestureEventListeners, mutableData as $mutableData, propertiesChanged as $propertiesChanged, propertiesMixin as $propertiesMixin, propertyAccessors as $propertyAccessors, propertyEffects as $propertyEffects, templateStamp as $templateStamp, arraySplice as $arraySplice, async as $async, caseMap$1 as $caseMap, debounce as $debounce, flattenedNodesObserver as $flattenedNodesObserver, flush$2 as $flush, gestures$0 as $gestures, htmlTag as $htmlTag, mixin as $mixin, path as $path, renderStatus as $renderStatus, resolveUrl$1 as $resolveUrl, settings as $settings, styleGather as $styleGather, templatize$1 as $templatize, polymerElement as $polymerElement, polymerLegacy as $polymerLegacy, applyShimUtils as $applyShimUtils, applyShim as $applyShim$1, commonRegex as $commonRegex, commonUtils as $commonUtils, cssParse as $cssParse, customStyleInterface as $customStyleInterface$1, documentWait$1 as $documentWait, styleSettings as $styleSettings, styleUtil as $styleUtil, templateMap$1 as $templateMap, unscopedStyleHandler as $unscopedStyleHandler, classMap$1 as $classMap, defaultTemplateProcessor$1 as $defaultTemplateProcessor, directive$1 as $directive, dom as $dom, modifyTemplate as $modifyTemplate, part as $part, parts as $parts, render$1 as $render, shadyRender as $shadyRender, templateFactory$1 as $templateFactory, templateInstance as $templateInstance, templateResult as $templateResult, template as $template, litHtml as $litHtml, orientationChanger as $orientationChanger, MDCComponent as $componentDefault, MDCFoundation as $foundationDefault, MDCFormFieldAdapter as $adapterDefault, cssClasses, strings, MDCFormFieldFoundation as $foundationDefault$1, MDCFormField, MDCFormFieldFoundation, html, MDCWebComponentMixin, ComponentElement, MDCWebComponentMixin as MDCWebComponentMixin$1, html as html$1, FormableComponentElement, MDCWebComponentMixin as MDCWebComponentMixin$2, SelectionController, callWhenReady, afterNextRender, findAssignedNode, style, Button, style$2 as style$1, MDCWCFormField, Formfield, style$3 as style$2, MDCWCRadio, Radio, style$1 as style$3, MDCWCRipple, MDCWCRippleContainer, Ripple, MDCRadioAdapter as $adapterDefault$1, strings$2 as strings$1, cssClasses$2 as cssClasses$1, MDCRadioFoundation as $foundationDefault$2, MDCRadio, MDCRadioFoundation, MDCRippleAdapter as $adapterDefault$2, cssClasses$1 as cssClasses$2, strings$1 as strings$2, numbers, MDCRippleFoundation as $foundationDefault$3, MDCRipple, MDCRippleFoundation, RippleCapableSurface, util, supportsCssVariables, applyPassive, getMatchesProperty, getNormalizedEventCoords, MDCSelectionControlState, MDCSelectionControl, customElement, property, query, queryAll, notEqual, UpdatingElement, notEqual as notEqual$1, UpdatingElement as UpdatingElement$1, customElement as customElement$1, property as property$1, query as query$1, queryAll as queryAll$1, html as html$2, svg, LitElement, PaperSpinnerBehavior, ArraySelectorMixin, ArraySelector, CustomStyle, DomBind, DomIf, DomModule, DomRepeat, mixinBehaviors, Class, LegacyElementMixin, MutableDataBehavior, OptionalMutableDataBehavior, Polymer, matchesSelector, DomApi, dom$1 as dom, flush$1 as flush, enqueueDebouncer as addDebouncer, Templatizer, DirMixin, ElementMixin, instanceCount, registrations, register, dumpRegistrations, updateStyles, GestureEventListeners, MutableData, OptionalMutableData, PropertiesChanged, PropertiesMixin, PropertyAccessors, PropertyEffects, TemplateStamp, calculateSplices, timeOut, animationFrame, idlePeriod, microTask, dashToCamelCase, camelToDashCase, Debouncer, FlattenedNodesObserver, enqueueDebouncer, flush$1, gestures, recognizers, deepTargetFind, addListener, removeListener, register$1, setTouchAction, prevent, resetMouseCanceller, findOriginalTarget, add, remove, html$1 as html$3, htmlLiteral, dedupingMixin, isPath, root, isAncestor, isDescendant, translate, matches, normalize, split, get, set, isDeep, beforeNextRender, afterNextRender$1, flush as flush$2, resolveUrl, resolveCss, pathFromUrl, useShadow, useNativeCSSProperties, useNativeCustomElements, rootPath, setRootPath, sanitizeDOMValue, setSanitizeDOMValue, passiveTouchGestures, setPassiveTouchGestures, stylesFromModules, stylesFromModule, stylesFromTemplate, stylesFromModuleImports, cssFromModules, cssFromModule, cssFromTemplate, cssFromModuleImports, templatize, modelForElement, TemplateInstanceBase, html$1 as html$4, PolymerElement, Polymer as Polymer$1, html$1 as html$5, Base, invalidate, invalidateTemplate, isValid, templateIsValid, isValidating, templateIsValidating, startValidating, startValidatingTemplate, elementsAreInvalid, ApplyShim as $applyShimDefault, VAR_ASSIGN, MIXIN_MATCH, VAR_CONSUMED, ANIMATION_MATCH, MEDIA_MATCH, IS_VAR, BRACKETED, HOST_PREFIX, HOST_SUFFIX, updateNativeProperties, getComputedStyleValue, detectMixin, StyleNode, parse, stringify, removeCustomPropAssignment, types, CustomStyleProvider, CustomStyleInterface as $customStyleInterfaceDefault, CustomStyleInterfaceInterface, documentWait as $documentWaitDefault, nativeShadow, nativeCssVariables, toCssText, rulesForStyle, isKeyframesSelector, forEachRule, applyCss, createScopeStyle, applyStylePlaceHolder, applyStyle, isTargetedBuild, findMatchingParen, processVariableAndFallback, setElementClassRaw, getIsExtends, gatherStyleText, splitSelectorList, getCssBuild, elementHasBuiltCss, getBuildComment, templateMap as $templateMapDefault, scopingAttribute, processUnscopedStyle, isUnscopedStyle, classMap, DefaultTemplateProcessor, defaultTemplateProcessor, directive, isDirective, isCEPolyfill, reparentNodes, removeNodes, removeNodesFromTemplate, insertNodeIntoTemplate, noChange, isPrimitive, AttributeCommitter, AttributePart, NodePart, BooleanAttributePart, PropertyCommitter, PropertyPart, EventPart, parts$1 as parts, render, html as html$6, svg as svg$1, TemplateResult, render$2 as render$1, templateFactory, templateCaches, TemplateInstance, TemplateResult as TemplateResult$1, SVGTemplateResult, marker, nodeMarker, markerRegex, rewritesStyleAttribute, Template, isTemplatePartActive, createMarker, lastAttributeNameRegex, TemplateResult as TemplateResult$2, SVGTemplateResult as SVGTemplateResult$1, marker as marker$1, nodeMarker as nodeMarker$1, markerRegex as markerRegex$1, rewritesStyleAttribute as rewritesStyleAttribute$1, Template as Template$1, isTemplatePartActive as isTemplatePartActive$1, createMarker as createMarker$1, lastAttributeNameRegex as lastAttributeNameRegex$1, DefaultTemplateProcessor as DefaultTemplateProcessor$1, defaultTemplateProcessor as defaultTemplateProcessor$1, TemplateInstance as TemplateInstance$1, noChange as noChange$1, isPrimitive as isPrimitive$1, AttributeCommitter as AttributeCommitter$1, AttributePart as AttributePart$1, NodePart as NodePart$1, BooleanAttributePart as BooleanAttributePart$1, PropertyCommitter as PropertyCommitter$1, PropertyPart as PropertyPart$1, EventPart as EventPart$1, isCEPolyfill as isCEPolyfill$1, reparentNodes as reparentNodes$1, removeNodes as removeNodes$1, templateFactory as templateFactory$1, templateCaches as templateCaches$1, html as html$7, svg as svg$2, OrientationChanger };