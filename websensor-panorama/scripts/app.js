/*
*       360 degree beach panorama demo using generic sensors
*/

'use strict';

// This is an inclination sensor that uses RelativeOrientationSensor
// and converts the quaternion to Euler angles
class RelativeInclinationSensor extends RelativeOrientationSensor{
    constructor(options) {
        super(options);
        this.longitude_ = 0;
        this.latitude_ = 0;
        this.longitudeInitial_ = 0;
        this.initialOriObtained_ = false;
    }

    set onreading(func) {
        super.onreading = () => {
            // Conversion to Euler angles done in THREE.js so we have to create a
            // THREE.js object for holding the quaternion to convert from
            // Order x,y,z,w
            let quaternion = new THREE.Quaternion(super.quaternion[0], super.quaternion[1], super.quaternion[2], super.quaternion[3]);
            // euler will hold the Euler angles corresponding to the quaternion
            let euler = new THREE.Euler(0, 0, 0);  
            // Order of rotations must be adapted depending on orientation
            // for portrait ZYX, for landscape ZXY
            let angleOrder = null;
            screen.orientation.angle === 0 ? angleOrder = 'ZYX' : angleOrder = 'ZXY';
            euler.setFromQuaternion(quaternion, angleOrder);
            if(!this.initialOriObtained_) {
                // Initial longitude needed to make the initial camera orientation
                // the same every time
                this.longitudeInitial_ = -euler.z;
                if(screen.orientation.angle === 90) {
                    this.longitudeInitial_ = this.longitudeInitial_ + Math.PI/2;
                }
                this.initialOriObtained_ = true;
            }

            // Device orientation changes need to be taken into account
            // when reading the sensor values by adding offsets
            // Also the axis of rotation might change
            switch(screen.orientation.angle) {
                default:
                case 0:
                    this.longitude_ = -euler.z - this.longitudeInitial_;
                    this.latitude_ = euler.x - Math.PI/2;
                    break; 
                case 90:
                    this.longitude_ = -euler.z - this.longitudeInitial_ + Math.PI/2;
                    this.latitude_ = -euler.y - Math.PI/2;                 
                    break;     
                case 270:
                    this.longitude_ = -euler.z - this.longitudeInitial_ - Math.PI/2;
                    this.latitude_ = euler.y - Math.PI/2;
                    break;
            }
            func();
        };      
    }

    get longitude() {
        return this.longitude_;
    }

    get latitude() {
        return this.latitude_;
    }
}

// Camera constants
const farPlane = 200, fov = 75;

// Required for a THREE.js scene
var camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, farPlane),
    scene = new THREE.Scene(), 
    renderer = new THREE.WebGLRenderer(),
    oriSensor = new RelativeInclinationSensor({frequency: 60});

oriSensor.onreading = render;   // When sensor sends new values, render again using those

//Service worker registration
if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').then(function(registration) {
                        //Registration was successful
                }, function(err) {
                        //Registration failed
                console.log('ServiceWorker registration failed: ', err);
                });
        });
}

// This function sets up the THREE.js scene, initializes the orientation sensor and 
// adds the canvas to the DOM
function init() {

    const container = document.querySelector('#app-view');
    let image = "resources/beach_dinner.jpg";

    // ThreeJS scene setup below
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );

    // TextureLoader for loading the image file
    let textureLoader = new THREE.TextureLoader();
    // AudioLoader for loading the audio file
    let audioLoader = new THREE.AudioLoader();
    // Creating the sphere where the image will be projected and adding it to the scene
    let sphere = new THREE.SphereGeometry(100, 100, 40);
    // The sphere needs to be transformed for the image to render inside it
    sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    let sphereMaterial = new THREE.MeshBasicMaterial();
    // Use the image as the material for the sphere
    sphereMaterial.map = textureLoader.load(image);
    // Combining geometry and material produces the mesh with the image as its material
    let sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    scene.add(sphereMesh);

    // The sound needs to be attached to a mesh, here an invisible one,
    // in order to be able to be positioned in the scene.
    // Here the mesh is created and added to the scene
    let soundmesh = new THREE.Mesh( new THREE.SphereGeometry(), new THREE.MeshBasicMaterial() );
    // The position of the mesh is where the sound will come from
    // Important for directional sound
    soundmesh.position.set( -40, 0, 0 );
    scene.add( soundmesh );

    // Add an audio listener to the camera so we can hear the sound
    let listener = new THREE.AudioListener();
    camera.add( listener );

    // Here the sound is loaded and attached to the mesh
    let sound = new THREE.PositionalAudio( listener );
    audioLoader.load( 'resources/ocean.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setRefDistance( 40 );
        sound.setRolloffFactor(1);
        sound.play();
    });
    soundmesh.add( sound );
    container.appendChild( renderer.domElement );

    // Sensor initialization
    oriSensor.start();

    // On window resize, also resize canvas so it fills the screen
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    render();
}

// Renders the scene, orienting the camera according to the longitude and latitude
function render() {
        let targetX = (farPlane/2) * Math.sin(Math.PI/2 - oriSensor.latitude) * Math.cos(oriSensor.longitude);
        let targetY = (farPlane/2) * Math.cos(Math.PI/2 - oriSensor.latitude);
        let targetZ = (farPlane/2) * Math.sin(Math.PI/2 - oriSensor.latitude) * Math.sin(oriSensor.longitude);
        camera.lookAt(new THREE.Vector3(targetX, targetY, targetZ));

        renderer.render(scene, camera);
}
