var lastFire = 0;
var sensorReadingsList = new Array;
var sensorTimesList = new Array;
var segmentSize = 200;
var windowSize = segmentSize * 2;
var pressed = "not-pressed";
var clicked = "not-clicked";

function evaluateDataPointsModel(timestamp) {
  if (sensorReadingsList.length < 4) {
    return;
  }

  var baseLine = sensorReadingsList[sensorReadingsList.length - 1];

  var firstIndex = 0;
  for (var i = 0; i < sensorTimesList.length; i++) {
    if (timestamp - sensorTimesList[i] < segmentSize) {
      firstIndex = i;
      break;
    }
  }

  if (firstIndex == 0) {
    return;
  }

  var offsets = computeOffsets(firstIndex, baseLine);
  var range1 = offsets.slice(0, firstIndex);
  var min1 = Math.min.apply(null, range1);
  var range2 = offsets.slice(firstIndex, sensorReadingsList.length);
  var max2 = Math.max.apply(null, range2);

  if (min1 < 30 && max2 > 130) {
    lastFire = timestamp;
    pressed = "pressed";
  }
}

function computeOffsets (firstIndex, baseLine) {
  var offsets = new Array;
  for (var i = 0; i < sensorReadingsList.length; i++ ) {
    var data = sensorReadingsList[i];
    var o = [data[0] - baseLine[0], data[1] - baseLine[1], data[2] - baseLine[2]];
    var magnitude = Math.sqrt(o[0]*o[0] + o[1]*o[1] + o[2]*o[2]);
    offsets.push(magnitude);
  }
  return offsets;
};

function evaluateReadingTimes (timestamp) {
  while (sensorTimesList[0] < timestamp - windowSize) {
    sensorTimesList.shift();
    sensorReadingsList.shift();
  }

  if (timestamp - lastFire < segmentSize) {
    return;
  }
  evaluateDataPointsModel(timestamp);
};

AFRAME.registerComponent('move-on-click', {
  init: function () {
     this.el.addEventListener('raycaster-intersected', function () {
       if (pressed == "pressed") {
         if (clicked == "not-clicked") {
           this.el.emit('clicked', null, false);
           clicked = "clicked";
	 } else {
           this.el.emit('clicked-off', null, false);
           clicked = "not-clicked";
         }
         pressed = "not-pressed";
       }
     }.bind(this));

    if ('Magnetometer' in window) {
        this.magn = new Magnetometer({frequency: 10});
        var prev_val = 0;
        this.magn.onreading = function () {
        if (this.intersection == "false") {
          return;
        }
          var data = [this.magn.x, this.magn.y, this.magn.z];
          sensorReadingsList.push(data);
          var timestamp = this.magn.timestamp;
          sensorTimesList.push(timestamp);
          evaluateReadingTimes(timestamp);
        }.bind(this);

        this.magn.start();
    }
  }
});
