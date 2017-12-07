// @ts-check
const slot = window["__sensor__"] = Symbol("__sensor__");

let orientation = {};

if (screen.orientation) {
  orientation = screen.orientation;
} else if (screen.msOrientation) {
  orientation = screen.msOrientation;
} else {
  Object.defineProperty(orientation, "angle", {
    get: () => { return (window.orientation || 0)  * Math.PI / 180; }
  });
}

function defineProperties(target, descriptions) {
  for (const property in descriptions) {
    Object.defineProperty(target, property, {
      configurable: true,
      value: descriptions[property]
    });
  }
}

class EventTarget {
  constructor() {
    this[slot] = new WeakMap;
    const _listeners = {};

    const defineOnEventListener = type => {
      Object.defineProperty(this, `on${type}`, {
        set: value => {
          let listeners = _listeners[type] || (_listeners[type] = [ null ]);
          listeners[0] = { target: this, listener: value };
        },
        get: () => {
          let listeners = _listeners[type] || (_listeners[type] = [ null ]);
          return listeners[0];
        }
      });
    };

    const addEventListener = (type, listener, options) => {
      let listeners = _listeners[type] || (_listeners[type] = [ null ]);
      if (listeners.findIndex(entry => entry && entry.listener === listener) < 1) {
        listeners.push({ target: this, listener: listener, options: options });
      }
    };

    const removeEventListener = (type, listener, options) => {
      let listeners = _listeners[type];
      if (listeners) {
        const index = listeners.findIndex(entry => entry && entry.listener === listener);
        if (index > 0) {
          listeners.splice(index, 1);
        }
      }
    };

    const dispatchEvent = (event) => {
      const listeners = _listeners[event.type];
      if (listeners) {
        defineProperties(event, { currentTarget: this, target: this });

        for (const { target, listener, options } of listeners) {
          if (options && options.once) {
            removeEventListener.call(target, event.type, listener, options);
          }
          if (typeof listener === 'function') {
            listener.call(target, event);
          } else {
            listener.handleEvent(event);
          }
        }

        defineProperties(event, { currentTarget: null, target: null });
      }
      return true;
    }

    defineProperties(this, {
      addEventListener: addEventListener,
      removeEventListener: removeEventListener,
      dispatchEvent: dispatchEvent
    });

    this[slot].defineOnEventListener = defineOnEventListener
  }
}

function defineReadonlyProperties(target, slot, descriptions) {
  const propertyBag = target[slot] || (target[slot] = new WeakMap);
  for (const property in descriptions) {
    propertyBag[property] = descriptions[property];
    Object.defineProperty(target, property, {
      get: () => propertyBag[property]
    });
  }
}

export class Sensor extends EventTarget {
  constructor(options) {
    super();
    this[slot].defineOnEventListener("reading");
    this[slot].defineOnEventListener("activate");
    this[slot].defineOnEventListener("error");

    defineReadonlyProperties(this, slot, {
      activated: false,
      hasReading: false,
      timestamp: 0
    })

    this[slot].frequency = null;

    if (window && window.parent != window.top) {
      throw new DOMException("Only instantiable in a top-level browsing context", "SecurityError");
    }

    if (options && typeof(options.frequency) == "number") {
      if (options.frequency > 60) {
        this.frequency = options.frequency;
      }
    }
  }

  start() { }
  stop() { }
}

const DeviceOrientationMixin = (superclass, ...eventNames) => class extends superclass {
  constructor(...args) {
    super(args);

    for (const eventName of eventNames) {
      if (`on${eventName}` in window) {
        this[slot].eventName = eventName;
        break;
      }
    }
  }

  start() {
    super.start();

    let activate = new Event("activate");
    window.addEventListener(this[slot].eventName, this[slot].handleEvent, false);
    this[slot].activated = true;
    this.dispatchEvent(activate);
  }

  stop() {
    super.stop();

    window.removeEventListener(this[slot].eventName, this[slot].handleEvent, false);
    this[slot].activated = false;
  }
};

// Tait-Bryan angles of type Z-X'-Y'' (alpha, beta, gamma)

function toQuaternionFromMat(mat) {
  const w = Math.sqrt(1.0 + mat[0] + mat[5] + mat[10]) / 2.0;
  const w4 = (4.0 * w);
  const x = (mat[9] - mat[6]) / w4;
  const y = (mat[2] - mat[8]) / w4;
  const z = (mat[4] - mat[1]) / w4;

  return [x, y, z, w];
}

function toQuaternionFromEuler(alpha, beta, gamma) {
  const degToRad = Math.PI / 180

  const x = (beta || 0) * degToRad;
  const y = (gamma || 0) * degToRad;
  const z = (alpha || 0) * degToRad;

  const cZ = Math.cos(z * 0.5);
  const sZ = Math.sin(z * 0.5);
  const cY = Math.cos(y * 0.5);
  const sY = Math.sin(y * 0.5);
  const cX = Math.cos(x * 0.5);
  const sX = Math.sin(x * 0.5);

  const qx = sX * cY * cZ - cX * sY * sZ;
  const qy = cX * sY * cZ + sX * cY * sZ;
  const qz = cX * cY * sZ + sX * sY * cZ;
  const qw = cX * cY * cZ - sX * sY * sZ;

  return [qx, qy, qz, qw];
}

function toMat4FromQuat(mat, q) {
  const typed = mat instanceof Float32Array || mat instanceof Float64Array;

  if (typed && mat.length >= 16) {
    mat[0] = 1 - 2 * (q[1] ** 2 + q[2] ** 2);
    mat[1] = 2 * (q[0] * q[1] - q[2] * q[3]);
    mat[2] = 2 * (q[0] * q[2] + q[1] * q[3]);
    mat[3] = 0;

    mat[4] = 2 * (q[0] * q[1] + q[2] * q[3]);
    mat[5] = 1 - 2 * (q[0] ** 2 + q[2] ** 2);
    mat[6] = 2 * (q[1] * q[2] - q[0] * q[3]);
    mat[7] = 0;

    mat[8] = 2 * (q[0] * q[2] - q[1] * q[3]);
    mat[9] = 2 * (q[1] * q[2] + q[0] * q[3]);
    mat[10] = 1 - 2 * (q[0] ** 2 + q[1] ** 2);
    mat[11] = 0;

    mat[12] = 0;
    mat[13] = 0;
    mat[14] = 0;
    mat[15] = 1;
  }

  return mat;
}

// from: https://w3c.github.io/deviceorientation/spec-source-orientation.html#worked-example-2
function toMat4FromEuler(mat, alpha, beta, gamma) {
  const degToRad = Math.PI / 180

  const x = (beta || 0) * degToRad;
  const y = (gamma || 0) * degToRad;
  const z = (alpha || 0) * degToRad;

  var cX = Math.cos(x);
  var cY = Math.cos(y);
  var cZ = Math.cos(z);
  var sX = Math.sin(x);
  var sY = Math.sin(y);
  var sZ = Math.sin(z);

  const typed = mat instanceof Float32Array || mat instanceof Float64Array;

  if (typed && mat.length >= 16) {
    mat[0] = cZ * cY - sZ * sX * sY;
    mat[1] = - cX * sZ;
    mat[2] = cY * sZ * sX + cZ * sY;
    mat[3] = 0;

    mat[4] = cY * sZ + cZ * sX * sY;
    mat[5] = cZ * cX;
    mat[6] = sZ * sY - cZ * cY * sX;
    mat[7] = 0;

    mat[8] = - cX * sY;
    mat[9] = sX;
    mat[10] = cX * cY;
    mat[11] = 0;

    mat[12] = 0;
    mat[13] = 0;
    mat[14] = 0;
    mat[15] = 1;
  }

  return mat;
};

class SensorErrorEvent extends Event {
  constructor(type, errorEventInitDict) {
    super(type, errorEventInitDict);

    if (!errorEventInitDict || !errorEventInitDict.error instanceof DOMException) {
      throw TypeError(
        "Failed to construct 'SensorErrorEvent':" +
        "2nd argument much contain 'error' property"
      );
    }

    Object.defineProperty(this, "error", {
      configurable: false,
      writable: false,
      value: errorEventInitDict.error
    });
  }
};

export const RelativeOrientationSensor = window.RelativeOrientationSensor ||
class RelativeOrientationSensor extends DeviceOrientationMixin(Sensor, "deviceorientation") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.absolute || event.alpha === null) {
        // Spec: The implementation can still decide to provide
        // absolute orientation if relative is not available or
        // the resulting data is more accurate. In either case,
        // the absolute property must be set accordingly to reflect
        // the choice.

        let error = new SensorErrorEvent("error", {
          error: new DOMException("Could not connect to a sensor")
        });
        this.dispatchEvent(error);

        this.stop();
        return;
      }

      this[slot].timestamp = performance.now();

      this[slot].alpha = event.alpha;
      this[slot].beta = event.beta;
      this[slot].gamma = event.gamma;
      this[slot].quaternion = toQuaternionFromEuler(event.alpha, event.beta, event.gamma);

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      quaternion: null
    });

    Object.defineProperty(this, "__quaternionQMatrix", {
      get: () => {
        let mat = new Float32Array(16);
        this.populateMatrix(mat);
        return toQuaternionFromMat(mat);
      }
    });
    Object.defineProperty(this, "__quaternionEMatrix", {
      get: () => {
        let mat = new Float32Array(16);
        this.__populateMatrixEuler(mat);
        return toQuaternionFromMat(mat);
      }
    });
  }

  populateMatrix(mat) {
    toMat4FromQuat(mat, this[slot].quaternion);
  }

  __populateMatrixEuler(mat) {
    toMat4FromEuler(mat, this[slot].alpha, this[slot].beta, this[slot].gamma);
  }
}

export const AbsoluteOrientationSensor = window.AbsoluteOrientationSensor ||
class AbsoluteOrientationSensor extends DeviceOrientationMixin(
  Sensor, "deviceorientationabsolute", "deviceorientation") {
  constructor(options) {
    super(options);

    this[slot].handleEvent = event => {
      // If absolute is set, or webkitCompassHeading exists,
      // absolute values should be available.
      const isAbsolute = event.absolute === true || "webkitCompassHeading" in event;
      const hasValue = event.alpha !== null || event.webkitCompassHeading !== null;
      if (!isAbsolute || !hasValue) {
        // Spec: If an implementation can never provide absolute
        // orientation information, the event should be fired with
        // the alpha, beta and gamma attributes set to null.

        let error = new SensorErrorEvent("error", {
          error: new DOMException("Could not connect to a sensor")
        });
        this.dispatchEvent(error);

        this.stop();
        return;
      }

      this[slot].hasReading = true;
      this[slot].timestamp = performance.now();
      this[slot].quaternion = toQuaternionFromEuler(
        event.alpha ? event.alpha : 360 - event.webkitCompassHeading,
        event.beta,
        event.gamma
      );

      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      quaternion: null
    });
  }

  populateMatrix(mat) {
    toMat4FromQuat(mat, this[slot].quaternion);
  }
}

export const Gyroscope = window.Gyroscope ||
class Gyroscope extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (false && event.rotationRate.alpha === null) {
        let error = new SensorErrorEvent("error", {
          error: new DOMException("Could not connect to a sensor")
        });
        this.dispatchEvent(error);

        this.stop();
        return;
      }

      this[slot].timestamp = performance.now();

      this[slot].alpha = event.rotationRate.alpha;
      this[slot].beta = event.rotationRate.beta;
      this[slot].gamma = event.rotationRate.gamma;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      alpha: null,
      beta: null,
      gamma: null
    });
  }
}

export const Accelerometer = window.Accelerometer ||
class Accelerometer extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.accelerationIncludingGravity.x === null) {
        let error = new SensorErrorEvent("error", {
          error: new DOMException("Could not connect to a sensor")
        });
        this.dispatchEvent(error);

        this.stop();
        return;
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.accelerationIncludingGravity.x;
      this[slot].y = event.accelerationIncludingGravity.y;
      this[slot].z = event.accelerationIncludingGravity.z;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      alpha: null,
      beta: null,
      gamma: null
    });
  }
}

export const LinearAccelerationSensor = window.LinearAccelerationSensor ||
class LinearAccelerationSensor extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.acceleration.x === null) {
        let error = new SensorErrorEvent("error", {
          error: new DOMException("Could not connect to a sensor")
        });
        this.dispatchEvent(error);

        this.stop();
        return;
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.acceleration.x;
      this[slot].y = event.acceleration.y;
      this[slot].z = event.acceleration.z;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      alpha: null,
      beta: null,
      gamma: null
    });
  }
}

export const GravitySensor = window.GravitySensor ||
 class GravitySensor extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.acceleration.x === null || event.accelerationIncludingGravity.x === null) {
        let error = new SensorErrorEvent("error", {
          error: new DOMException("Could not connect to a sensor")
        });
        this.dispatchEvent(error);

        this.stop();
        return;
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.accelerationIncludingGravity.x - event.acceleration.x;
      this[slot].y = event.accelerationIncludingGravity.y - event.acceleration.y;
      this[slot].z = event.accelerationIncludingGravity.z - event.acceleration.z;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      alpha: null,
      beta: null,
      gamma: null
    });
  }
}