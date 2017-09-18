var audioContext = new AudioContext();
var game_text = null;
var measurement = null;
var gauge = null;
var acl = null;
var speedCalculator = null;
var quotes = ["Punch not detected", "Great punch!", "Roll with the punches!"];


// Calculates the *first* velocity peak about X axis, or exiting on timeout.
class MaxSpeedCalculator {
 constructor(linearAccel, onresult, onpunchdetected, timeout /*in ms*/) {
   this.accel = linearAccel;
   this.measuring = false;
   this.onresult = onresult;
   this.onpunchdetected = onpunchdetected;
   this.punchDetected = false;
   this.maxSpeed = 0;

   this.vx = 0; // Velocity at time t.
   this.ax = 0; // Acceleration at time t.
   this.t = 0;

   this.timeoutId = 0;
   this.timeout = (timeout == null) ? 5000 : timeout;

   function onreading() {
     let dt = (this.accel.timestamp - this.t) * 0.001; // In seconds.
     let vx = this.vx + (this.accel.x + this.ax) / 2 * dt;
     let speed = Math.abs(vx);

     const punchTreashold = 3; // m/s
     if (this.maxSpeed < speed && speed >= punchTreashold) {
       this.maxSpeed = speed;
       if (!this.punchDetected && this.onpunchdetected) {
         this.punchDetected = true;
         this.onpunchdetected();
       }
     }

     if (this.maxSpeed > speed) {
       this.stop();
       this.onresult();
       return;
     }

     this.t = this.accel.timestamp;
     this.ax = this.accel.x;
     this.vx = vx;
   }

   function ontimeout() {
     if (this.measuring) {
       this.stop();
       this.onresult();
     }
   }

   this.onreading = onreading.bind(this);
   this.ontimeout = ontimeout.bind(this);
   this.onerror = this.stop.bind(this);
 }
 
 get result() {
   const kmPerHourCoef = 3.6;
   return Math.round(this.maxSpeed * kmPerHourCoef);
 }

 start() {
   if (this.accel.timestamp === null) {
     console.error("accelerometer must have initial values");
     return;
   }

   if (this.measuring) {
     console.error("already measuring");
     return;
   }

   this.measuring = true;
   this.maxSpeed = 0;
   this.punchDetected = false;

   this.vx = 0;
   this.vy = 0;
   this.vz = 0;

   this.ax = this.accel.x;
   this.ay = this.accel.y;
   this.az = this.accel.z;
   this.t = this.accel.timestamp;

   this.accel.addEventListener('reading', this.onreading);
   this.accel.addEventListener('error', this.onerror);
   this.timeoutId = setTimeout(this.ontimeout, this.timeout);
 }
 
 stop() {
   this.measuring = false;
   if (this.timeoutId) {
     clearTimeout(this.timeoutId);
     this.timeoutId = 0;
   }
   this.accel.removeEventListener('reading', this.onreading);
   this.accel.removeEventListener('error', this.onerror);
 }

}

function setGameText(text) {
  game_text.innerText = text;
  game_text.style.display="none";
  game_text.style.display="block";
}

function setMeasurement(val) {
  gauge.set(val);
  measurement.style.display="none";
  measurement.style.display="block";
}

function getQuote(val) {
  if (val < 2)
    return quotes[0];
  if (val < 15)
    return quotes[1];

  return quotes[2];
}

function setToInitialState() {
  var shaking = false;

  function onreading() {
    const shakeTreashold = 3 * 9.8;
    const stillTreashold = 1;
    let magnitude = Math.hypot(acl.x, acl.y, acl.z);
    if (magnitude > shakeTreashold) {
      shaking = true;
    } else if (magnitude < stillTreashold && shaking) {
      shaking = false;
      acl.removeEventListener('reading', onreading);
      setMeasurement(0);
      setGameText("Punch now!");
      speedCalculator.start();
    }
  }
  
  acl.addEventListener('reading', onreading);
}

function onresult() {
  setMeasurement(speedCalculator.result);
  setGameText(getQuote(speedCalculator.result) + " Shake to try again!");
  setTimeout(setToInitialState, 1000);
}

function generateKickSound() {
  let oscillator = audioContext.createOscillator();
  let gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  let startTime = audioContext.currentTime;
  let endTime = startTime + 0.1;

  oscillator.frequency.setValueAtTime(500, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(0.05, endTime);
  gain.gain.setValueAtTime(40, startTime);
  gain.gain.exponentialRampToValueAtTime(0.05, endTime);

  oscillator.start(startTime);
  oscillator.stop(endTime);
};


function main() {
  // Create gauge
  var opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#000000' // Fill color
    },
    percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
    limitMax: 50,     // If false, max value increases automatically if value > maxValue
    limitMin: 0,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,    // High resolution support
    staticLabels: {
      font: "10px sans-serif",  // Specifies font
      labels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],  // Print labels at these values
      color: "#000000",  // Optional: Label text color
      fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    }
  };

  var target = document.getElementById('gauge'); // your canvas element
  let width = window.screen.availWidth / 2;
  let height = window.screen.availHeight / 2;

  if (width < height) {
    target.width = height;
    target.height = width;
  } else {
    target.width = width;
    target.height = height;
  }

  gauge = new Gauge(target).setOptions(opts);
  gauge.setTextField(document.getElementById("preview"));
  gauge.maxValue = 50; // set max gauge value
  gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 32; // set animation speed (32 is default value)

  // Show game text element
  game_text = document.getElementById("game_text");
  measurement = document.getElementById("measurement");
  setGameText(game_text.innerText);
  setMeasurement(0);
  function startApp() {
    acl = new LinearAccelerationSensor({frequency: 60});
    speedCalculator = new MaxSpeedCalculator(acl, onresult, generateKickSound);

    acl.addEventListener('activate', setToInitialState);
    acl.addEventListener('error', error => {
       setGameText("Cannot fetch data from sensor due to an error.");
    });
    acl.start();
  }

  if ('LinearAccelerationSensor' in window) {
    navigator.permissions.query({ name: "accelerometer" }).then(result => {
      if (result.state != 'granted') {
        setGameText("Sorry, we're not allowed to access sensors " +
                    "on your device..");
        return;
      }
      startApp();
    }).catch(err => {
      console.log("Integration with Permissions API is not enabled, still try to start");
      startApp();
    });
  } else {
    setGameText("Your browser doesn't support sensors.");
    setMeasurement(0);
  }
}
