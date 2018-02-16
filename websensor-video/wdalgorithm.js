// This algorithm is adapted to and tested on a Pixel smartphone

// The walking detection algorithm
// Device dependent, tested on a Pixel smartphone
var ALGORITHM = (function () {
    var algo = {};

    // For storing acceleration data
    var accelerationData = [];
    var accelSeq = {x:null, y:null, z:null};
    var prevaccel = {x:null, y:null, z:null};
    var diff = {x:null, y:null, z:null};

    // Thresholds and other constant values for the algorithm

    const stepamt = 2;

    // Buffer size for step analysis
    // Should be about how long 2 steps will take (here stepamt seconds)
    var amtStepValues = stepamt*sensorFreq;

    // Thresholds

    // If acceleration changes less than this, ignore it(for removing noise)
    const accdiffthreshold = 0.15;

    // Lower values mean the algorithm is more sensitive to walking
    // and also more false positives will occur
    const stddevthreshold = 2.8, peakvalleyamtthreshold = 12;

    // Other constants for the algorithm
    const bias = 1, smoothingvalue = 8, alpha = 4;

    // These values will be set by the algorithm at runtime
    var stepaverage, peaktimethreshold, valleytimethreshold, discardedsamples, average_accel_nog,
        stddevpct, stddev_accel, fft_index;

    // Below are functions for the WD algorithm and functions used in the algorithm

    // Functions to process data

    // Function to convert from sensor readings (one for each reading)
    // to sequences (one for each coordinate)
    function toCoordSeq(buffer) {
            let seq_x = [];
            let seq_y = [];
            let seq_z = [];
            for (let i=0; i<buffer.length; i++) {
                    seq_x.push(buffer[i].x);        
                    seq_y.push(buffer[i].y);
                    seq_z.push(buffer[i].z);
            }
            var seq = {'x':seq_x, 'y':seq_y, 'z':seq_z};
            return seq;
    }

    function slice(obj, start, end) {
        var sliced = {};
        for (var k in obj) {
            sliced[k] = obj[k].slice(start, end);
        }

        return sliced;
    }

    // Calculates magnitude of a vector
    // or a sequence of magnitudes from a sequence of vectors
    function magnitude(data, mode = "vector") {
        if(mode === "seq") {
            let magseq = [];
            for (let k in data) {
                for (let i in data[k]) {
                    magseq[i] = Math.sqrt(data.x[i] * data.x[i] + data.y[i] * data.y[i] + data.z[i] * data.z[i]);
                }
            }
            return magseq;
        } else {
            return Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
        }
    }

    function standardDeviation(values) {
        let average = values => values.reduce( ( p, c ) => p + c, 0 ) / values.length;    
        let squareDiffs = values.map( value => (value - average) ** 2);
        let averageSquareDiff = squareDiffs => squareDiffs.reduce( ( p, c ) => p + c, 0 ) / squareDiffs.length;
        let stdDev = Math.sqrt(averageSquareDiff);
        return stdDev;
    }

    function pcorr(x, y) {
        let shortestArrayLength = 0;
         
        if(x.length == y.length) {
            shortestArrayLength = x.length;

        // Will ignore the extra elements of the arrays
        } else if(x.length > y.length) {
            shortestArrayLength = y.length;
        } else {
            shortestArrayLength = x.length;
        }

        let xy = [];
        let x2 = [];
        let y2 = [];

        for(let i=0; i<shortestArrayLength; i++) {
            xy.push(x[i] * y[i]);
            x2.push(x[i] * x[i]);
            y2.push(y[i] * y[i]);
        }

        let sum_x = 0;
        let sum_y = 0;
        let sum_xy = 0;
        let sum_x2 = 0;
        let sum_y2 = 0;

        for(let i=0; i< shortestArrayLength; i++) {
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += xy[i];
            sum_x2 += x2[i];
            sum_y2 += y2[i];
        }

        let v1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
        let v2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
        let v3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
        let v4 = Math.sqrt(v2 * v3);
        let corrcoeff = v1 / v4;

        return corrcoeff;
    }
   
    function smoothArray( values, smoothing ) {
        var value = values[0];  // First input a special case, no smoothing
        for (let i=1, len=values.length; i<len; ++i) {
            let currentValue = values[i];

            // Substract from previous, divide by smoothing and add to the "running value"
            value += (currentValue - value) / smoothing;
            values[i] = value;
        }
    }

    function clearVars() {  // Clear vars every loop iteration
        discardedsamples = 0;
        for (var k in accelSeq) delete accelSeq[k];
        accelerationData.splice(0);
        stepaverage = null;
        peaktimethreshold = null;
        valleytimethreshold = null;
    }

    // Tells if curr is a peak or not
    function isPeak(prev, curr, next, stepaverage, avg, variance) {
        return curr > prev && curr > next && (curr > stepaverage || !stepaverage) && curr > (avg+variance);
    }

    // Tells if curr is a valley or not
    function isValley(prev, curr, next, stepaverage, avg, variance) {
        return curr < prev && curr < next && (curr < stepaverage || !stepaverage) && curr < (avg-variance);
    }

    // Update the running time average (timethreshold) of either peak or valley data
    function updateTimeAverage(index, lasttime, timediff, timethreshold, data) {

        // Update time average regardless of valley accepted or not
        if(data.length >= 2) {
            timediff.push(index - lasttime);
            let diff_selected = timediff;
            let sum = diff_selected.reduce((previous, current) => current += previous);
            timethreshold = sum/diff_selected.length;      // Average of valley diffs
        } else {
            if(lasttime > 0 && index > lasttime) {
                timediff.push(index - lasttime);
            } else {
                timediff.push(index);
            }
        }
    }

    function detectPeaksValleys(seq) {
        let result = {"peaks":null, "valleys":null};
        let peakdiff = [], valleydiff = [], peaks = [], valleys = [];
        let variance = 0.5 + standardDeviation(seq)/alpha;
        let avg = seq.reduce(function(sum, a) { return sum + a; },0)/(seq.length||1);
        for (let i in seq) {
            let index = parseInt(i);
            let prev = seq[index-1];
            let curr = seq[index];
            let next = seq[index+1];
            let lastpeakmag = null;
            let lastvalleymag = null;
            let lastpeaktime = null;
            let lastvalleytime = null;

            if(isPeak(prev, curr, next, stepaverage, avg, variance)) {
                updateTimeAverage(index, lastpeaktime, peakdiff, peaktimethreshold, peaks);
                lastpeakmag = curr;
                lastpeaktime = index;
                peaks.push(index);
            } else if(isValley(prev, curr, next, stepaverage, avg, variance)) {
                updateTimeAverage(index, lastvalleytime, valleydiff, valleytimethreshold, valleys);
                lastvalleymag = curr;
                lastvalleytime = index;
                valleys.push(index);
            }

            // Update step average
            if(lastpeakmag && lastvalleymag) {
                stepaverage = (Math.abs(lastpeakmag) + Math.abs(lastvalleymag))/2.0;
            }
        }
        result.peaks = peaks;
        result.valleys = valleys;
        return result;
    }

    function exponent(k, len) {
        let x = -2 * Math.PI * (k / len);
        return { real: Math.cos(x), imag: Math.sin(x) };
    }

    function compAdd(a, b) {
      return { real: a.real + b.real, imag: a.imag + b.imag };
    }

    function compMult(a, b) {
      return { real: (a.real * b.real - a.imag * b.imag), imag: (a.real * b.imag + a.imag * b.real) };
    }

    function dft(seq) {
      let len = seq.length;
      let real = Array.apply(null, Array(len)).map(Number.prototype.valueOf, 0)
      let imag = Array.apply(null, Array(len)).map(Number.prototype.valueOf, 0)
      for (var i = 0; i < len; i++) {
        for (var n = 0; n < len; n++) {
          let term = compMult({real: seq[n], imag: 0}, exponent(i * n, len));
          let sum = compAdd({real: real[i], imag: imag[i]}, term);
          real[i] = sum.real;
          imag[i] = sum.imag;
        }
      }

      // Normalize and return.
      return {real: real.map(x => x/real.length), imag: imag.map(x => x/imag.length)};
    }

    // Calculates the FFT of a sequence
    function calculateFFT(seq) {
        // Create fft computation
        let dft_comp = dft(seq);

        let fft = [];
        for(let i=0; i< dft_comp.real.length; i++) {
            fft[i] = Math.hypot(dft_comp.real[i], dft_comp.imag[i]); // Magnitude of FFT
        }
        fft = fft.map(x => x/fft.reduce((a, b) => a + b, 0));
        return fft;
    }

    function highFreq(fft) {
        return fft.indexOf(Math.max(...fft)) > 4;
    }

    // Determines if the acceleration value that was read was a valid one (device movement) instead of noise
    function validAccel(prevaccel, accel) {
            return Math.abs(magnitude(accel) - magnitude(prevaccel)) > accdiffthreshold;
    }

    // Tells if the walking direction has changed
    function needToChangeDir(longitude) {

        // When the user is turned backwards, we still want to always keep the longitude above 0
        if(longitude < 0) {
            longitude = longitude + 2*Math.PI;
        }
        return (Math.abs(longitude - Math.PI) < (20 / 180) * Math.PI && rewinding == false) || 
               ((longitude < (10 / 180) * Math.PI || longitude > (350 / 180) * Math.PI ) && rewinding == true);
    }

    // The "public interfaces" are the stepDetection and saveSensorReading functions
    // Algorithm modified version of the algorithm from paper http://www.mdpi.com/1424-8220/15/10/27230

    // Returns 1 if there was a step in the given acceleration sequence, otherwise 0
    var stepDetection = function (seq) {

        // Calculate the combined magnitude sequence from the 3 distinct xyz sequences
        let magseq = magnitude(seq, "seq");

        // Smoothen (filter noise)
        smoothArray(magseq, smoothingvalue);        // Smoothens "in-place"
        let peaksvalleys = null;
        let peakdiff = [];
        let valleydiff = [];

        // Analyze sequence sample by sample - mimics real-time behavior
        for (var i = 0; i < magseq.length+1; i++) {
            peaksvalleys = detectPeaksValleys(magseq.slice(0, i));
        }
        let peaks = peaksvalleys.peaks;
        let valleys = peaksvalleys.valleys;

        // Now remove peak and valley candidates outside a pre-defined time range after each peak occurrence
        // Filter the non-valid peaks and valleys out
        peaks = peaks.filter(function(n){ return n > peaktimethreshold;});
        valleys = valleys.filter(function(n){ return n > valleytimethreshold;});
        let stepdiff = [];
        for (var ipeak in peaks) {
            for (var ivalley in valleys) {
                if(ipeak == ivalley) {
                    let stepdiffamt = Math.abs(peaks[ipeak] - valleys[ivalley]);

                    // If at least 10 samples between peak and valley
                    if(stepdiffamt >= 10) {
                        stepdiff.push(stepdiffamt);
                    }
                }
            }
        }
        let minDiff = Math.min( ...stepdiff );
        let stddev = standardDeviation(stepdiff);

        // Substract gravity from acceleration magnitudes
        var magseqnog = magseq.map( function(value) {
            return value - GRAVITY;
        });
        stddev_accel = standardDeviation(magseqnog);
        average_accel_nog = magseqnog.reduce(function(sum, a) { return sum + a; },0)/(magseqnog.length||1);
        stddevpct = stddev / minDiff;

        let fft = calculateFFT(magseqnog);

        // If the index of the largest FFT component is high enough,
        // then the user is definitely walking
        // as low-frequency changes in movement most likely mean 
        // the user is moving the device to look around and not walking
        if(highFreq(fft)) {
            return true;
        }
        if(stepdiff.length >= Math.floor(stepamt)) {
            if(stddevpct < stddevthreshold && !isNaN(stddevpct) && 
            Math.abs(peaks.length - valleys.length) <= peakvalleyamtthreshold && stddev_accel < 1.5) {
                return true;
            }
        } else {
            return false;
        }
    };

    // Function to save the sensor readings,
    // check if we need to switch video playback direction
    // and send the sensor readings to be analyzed for whether the user is walking or not
    var saveSensorReading = function() {
        accel = {"x": accel_sensor.x, "y": accel_sensor.y, "z": accel_sensor.z};
        if(validAccel(prevaccel, accel)) {
            accelerationData.push(accel);
            prevaccel = accel;
            discardedsamples = discardedsamples - 3;
        }

        // The change in acceleration was too small (possibly noise),
        // so the device might be stationary
        // If enough of these small changes accumulate,
        // then assume that the device is stationary
        else {
            discardedsamples = discardedsamples + 1;
        }

        // When the user turns around, video direction needs to be changed
        if(needToChangeDir(orientation_sensor.longitude)) {
            CONTROL.changeDirection();
        }

        // When we have enough data, decide whether the user is walking or not
        if(accelerationData.length >= amtStepValues) {
            accelSeq = toCoordSeq(accelerationData);
            var as = Object.assign({}, accelSeq);   // Copy by value
            stepvar = stepDetection(as);
            CONTROL.playPause();
            clearVars();
        }

        // If enough small acceleration changes have accumulated, the device is most likely stationary
        if(discardedsamples >= amtStepValues/8) {
            stepvar = 0;
            CONTROL.playPause();
            clearVars();
        }
    };

    return {
        stepamt: stepamt,
        stddevthreshold: stddevthreshold,
        bias: bias,
        smoothingvalue: smoothingvalue,
        stddevpct: stddevpct,
        stddev_accel: stddev_accel,
        stepDetection: stepDetection,
        saveSensorReading: saveSensorReading
        };
}());

