/*
*       360 degree video demo
*/

'use strict';

// If generic sensors are enabled and RelativeOrientationSensor is defined, create class normally
// Otherwise create a fake class
if('RelativeOrientationSensor' in window) {

    // This is an inclination sensor that uses RelativeOrientationSensor
    // and converts the quaternion to Euler angles, returning the longitude and latitude
    window.RelativeInclinationSensor = class RelativeInclinationSensor extends RelativeOrientationSensor {
        constructor(options) {
            super(options);
            this.longitude_ = 0;
            this.latitude_ = 0;
            this.longitudeInitial_ = 0;
            this.initialOriObtained_ = false;
            this.quat_ = new THREE.Quaternion();
            this.euler_ = new THREE.Euler(0, 0, 0);
            this.func_ = null;

            super.onreading = () => {

                // Read the quaternion provided by the sensor
                this.quat_.fromArray(super.quaternion);

                // Order of rotations must be adapted depending on orientation
                // for portrait ZYX, for landscape ZXY
                let angleOrder = null;
                screen.orientation.angle === 0 ? angleOrder = 'ZYX' : angleOrder = 'ZXY';
                this.euler_.setFromQuaternion(this.quat_, angleOrder);
                if (!this.initialOriObtained_) {

                    // Initial longitude needed to make the initial camera orientation
                    // the same every time
                    this.longitudeInitial_ = -this.euler_.z;
                    if (screen.orientation.angle === 90) {
                        this.longitudeInitial_ = this.longitudeInitial_ + Math.PI/2;
                    }
                    this.initialOriObtained_ = true;
                }

                // Device orientation changes need to be taken into account
                // when reading the sensor values by adding offsets
                // Also the axis of rotation might change
                switch (screen.orientation.angle) {

                    // In case there are other screen orientation angle values,
                    // for example 180 degrees (not implemented in Chrome), default is used
                    default:    
                    case 0:
                        this.longitude_ = -this.euler_.z - this.longitudeInitial_;
                        this.latitude_ = this.euler_.x - Math.PI/2;
                        break; 
                    case 90:
                        this.longitude_ = -this.euler_.z - this.longitudeInitial_ + Math.PI/2;
                        this.latitude_ = -this.euler_.y - Math.PI/2;                 
                        break;     
                    case 270:
                        this.longitude_ = -this.euler_.z - this.longitudeInitial_ - Math.PI/2;
                        this.latitude_ = this.euler_.y - Math.PI/2;
                        break;
                }

                if (this.func_ !== null)
                    this.func_();
            };   
        }

        set onreading(func) {
            this.func_ = func;   
        }

        get longitude() {
            return this.longitude_;
        }

        get latitude() {
            return this.latitude_;
        };
    };
} else {

    // Fake interface
    window.RelativeInclinationSensor = class RelativeInclinationSensor {
        constructor(options) {
            this.start = function() {};
        }

        set onreading(func) {}

        get longitude() {
            return 0;
        }

        get latitude() {
            return 0;
        }
    };

    // Inform the user that generic sensors are not enabled
    document.getElementById("no-sensors").style.display = "block";
    document.getElementById("startbutton").remove();     // Hide button
}

var rewinding = false, stepvar = 0; // stepvar 0 when not walking, 1 when walking
const GRAVITY = 9.81;
const sensorFreq = 60;

// The video elements, these references will be used to control video playback
// video will always refer to the currently playing video
var videoF, videoB, video;

// Camera constants
const farPlane = 200, fov = 75;

// Required for a THREE.js scene
var camera, scene, renderer, orientation_sensor, accel_sensor;
var sphere, videoTexture, sphereMaterial, sphereMesh;

function startDemo() {

    // Need user input to play video, so here both the forward and the backward video are played and paused once in order to satisfy that requirement
    videoF.play().then(videoF.pause());
    videoB.play().then(videoB.pause());
    document.getElementById("startbutton").remove();     // Hide button

    accel_sensor = new Accelerometer({ frequency: sensorFreq });

    // Start saving acceleration data in order to determine if the user is walking
    accel_sensor.onreading = ALGORITHM.saveSensorReading;
    accel_sensor.start();
}

// Calculates the direction the user is viewing in terms of longitude and latitude and renders the scene
function render() {
    if(video.readyState === video.HAVE_ENOUGH_DATA) {
        videoTexture.needsUpdate = true;
    }

    camera.target.x = (farPlane/2) * Math.sin(Math.PI/2 - orientation_sensor.latitude) * Math.cos(orientation_sensor.longitude);
    camera.target.y = (farPlane/2) * Math.cos(Math.PI/2 - orientation_sensor.latitude);
    camera.target.z = (farPlane/2) * Math.sin(Math.PI/2 - orientation_sensor.latitude) * Math.sin(orientation_sensor.longitude);
    camera.lookAt(camera.target);
    renderer.render(scene, camera);
}

// The custom element where the video will be rendered
customElements.define("video-view", class extends HTMLElement {
    constructor() {
        super();

        // Set up two video elements, one forward and one backward, switching between them when the user changes walking direction
        videoF = document.createElement("video");
        videoF.src = "resources/forward2.mp4";
        videoF.crossOrigin = "anonymous";
        videoF.load();

        videoB = document.createElement("video");
        videoB.src = "resources/backward2.mp4";
        videoB.crossOrigin = "anonymous";
        videoB.load();

        // THREE.js scene setup
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, farPlane);
        camera.target = new THREE.Vector3(0, 0, 0);
        sphere = new THREE.SphereGeometry(100, 100, 40);

        // The sphere is transformed because the video will be rendered on the inside surface
        sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        video = videoF; // Start with the forward video
        video.load();
        videoTexture = new THREE.Texture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;

        sphereMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: 0.5 } );
        sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        scene.add(sphereMesh);

        // Rotate the projection sphere to align initial orientation with the path
        sphereMesh.rotateY(Math.PI+0.1);

        // On window resize, also resize canvas so it fills the screen
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

    }

    connectedCallback() {
        orientation_sensor = new RelativeInclinationSensor({frequency: sensorFreq});
        orientation_sensor.onreading = render;
        orientation_sensor.start();
        render();
    }
});

// The video playback control
var CONTROL = (function () {
    var ctrl = {};

    // Functions related to controlling video playback
    // Uses promises so might not work in all browsers
    function play() {
        rewinding ? videoB.play() : videoF.play();
    }

    ctrl.playPause = function () {
            if(stepvar) {
                play();
            } else {
                if(!video.paused) {
                    video.pause();
                }
            }
        };

        // Called when the video direction needs to be changed (F to B or B to F)
        ctrl.changeDirection = function () {

            if(!rewinding) {    // Forward
                let time = videoF.currentTime;
                videoF.pause();
                video = videoB;

                // We need to start from the opposite end of the video when 
                videoB.currentTime = videoB.duration - time;
                videoTexture = new THREE.Texture(videoB);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;
                videoTexture.needsUpdate = true;
                sphereMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: 0.5 } );
                sphereMesh.material = sphereMaterial;
                sphereMaterial.needsUpdate = true;
                rewinding = true;
            } else {    // Backward
                let time = videoB.currentTime;
                videoB.pause();
                video = videoF;
                videoF.currentTime = videoF.duration - time;
                videoTexture = new THREE.Texture(videoF);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;
                videoTexture.needsUpdate = true;
                sphereMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: 0.5 } );
                sphereMesh.material = sphereMaterial;
                sphereMaterial.needsUpdate = true;
                rewinding = false;
            }
        };
    return ctrl;
}());

