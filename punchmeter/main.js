var instructions = document.querySelector("#instructions");
var result  = document.querySelector("#result");

var audioContext = new AudioContext();

// Calculates the *first* velocity peak, or exiting on timeout.
class MaxSpeedCalculator {
 constructor(linearAccel, onresult, onpunchdetected, timeout /*in ms*/) {
   this.accel = linearAccel;
   this.measuring = false;
   this.onresult = onresult;
   this.onpunchdetected = onpunchdetected;
   this.maxSpeed = 0;
   // Velocity at time t.
   this.vx = 0;
   this.vy = 0;
   this.vz = 0;
   // Acceleration at time t.
   this.ax = 0;
   this.ay = 0;
   this.az = 0;
   this.t = 0;

   this.timeoutId = 0;
   this.timeout = (timeout == null) ? 5000 : timeout;

   function onreading() {
     let dt = (this.accel.timestamp - this.t) * 0.001; // In seconds.
     this.vx += (this.accel.x + this.ax) / 2 * dt;
     this.vy += (this.accel.y + this.ay) / 2 * dt;
     this.vz += (this.accel.z + this.az) / 2 * dt;

     let speed = Math.hypot(this.vx, this.vy, this.vz);
     const punchTreashold = 3; // m/s

     if (this.maxSpeed < speed && speed >= punchTreashold) {
       this.maxSpeed = speed;
       if (this.onpunchdetected) {
         this.onpunchdetected();
         this.onpunchdetected = null;
       }
     }

     if (this.maxSpeed > speed) {
       this.stop();
       this.onresult();
       return;
     }

     this.t = this.accel.timestamp;
     this.ax = this.accel.x;
     this.ay = this.accel.y;
     this.az = this.accel.z;
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

function setToInitialState() {
  instructions.innerText = "Shake the device to start measuring";

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
      instructions.innerText = "Punch now!";
      speedCalculator.start();
    }
  }
  
  acl.addEventListener('reading', onreading);
}

function onresult() {
  instructions.innerText = "";
  if (speedCalculator.result > 0) {
    generateKickSound();
    result.innerText =
        "Your punch speed was around " + speedCalculator.result + " km/h";
  } else {
    result.innerText = "Your punch was too weak.. We did not feel it.";
  }

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
  gain.gain.setValueAtTime(10, startTime);
  gain.gain.exponentialRampToValueAtTime(0.05, endTime);

  oscillator.start(startTime);
  oscillator.stop(endTime);
};

if ('LinearAccelerationSensor' in window) {
  var acl = new LinearAccelerationSensor({frequency: 60});
  var speedCalculator = new MaxSpeedCalculator(acl, onresult, generateKickSound);

  acl.addEventListener('activate', setToInitialState);
  acl.addEventListener('error', error => {
      instructions.innerText = "Could not access platform sensors.";
  });
  acl.start();
  instructions.innerText = "Wait a bit..";
} else {
  instructions.innerText = "Generic Sensor APIs are not enabled :(";
}
