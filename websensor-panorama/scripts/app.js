/*
*       360 degree beach panorama demo using generic sensors
*/

'use strict';

//This is an inclination sensor that uses RelativeOrientationSensor and converts the quaternion to Euler angles
class RelativeInclinationSensor {
        constructor() {
        this.sensor_ = new RelativeOrientationSensor({ frequency: 60 });
        this.x_ = 0;
        this.y_ = 0;
        this.z_ = 0;
        this.longitudeInitial_ = 0;
        this.initialoriobtained_ = false;
        this.sensor_.onreading = () => {
                let quat = this.sensor_.quaternion;
                let quaternion = new THREE.Quaternion();        //Conversion to Euler angles done in THREE.js so we have to create a THREE.js object for holding the quaternion to convert from
                let euler = new THREE.Euler( 0, 0, 0);  //Will hold the Euler angles corresponding to the quaternion
                quaternion.set(quat[0], quat[1], quat[2], quat[3]);     //Order x,y,z,w
                //Order of rotations must be adapted depending on orientation - for portrait ZYX, for landscape ZXY
                let angleOrder = null;
                screen.orientation.angle === 0 ? angleOrder = 'ZYX' : angleOrder = 'ZXY';
                euler.setFromQuaternion(quaternion, angleOrder);     //ZYX works in portrait, ZXY in landscape
                this.x_ = euler.x;
                this.y_ = euler.y;
                this.z_ = euler.z;
                if(!this.initialoriobtained_) //Obtain initial longitude - needed to make the initial camera orientation the same every time
                {
                        this.longitudeInitial_ = -this.z_;
                        if(screen.orientation.angle === 90)
                        {
                                this.longitudeInitial_ = this.longitudeInitial_ + Math.PI/2;     //Offset fix
                        }
                        this.initialoriobtained_ = true;
                }
                if (this.onreading_) this.onreading_();
        };
        }
        start() { this.sensor_.start(); }
        stop() { this.sensor_.stop(); }
        get x() {
                return this.x_;
        }
        get y() {
                return this.y_;
        } 
        get z() {
                return this.z_;
        }
        get longitudeInitial() {
                return this.longitudeInitial_;
        }
        set onactivate(func) {
                this.sensor_.onactivate_ = func;
        }
        set onerror(err) {
                this.sensor_.onerror_ = err;
        }
        set onreading (func) {
                this.onreading_ = func;  
        }
}

const container = document.querySelector('#app-view');
var oriSensor = new RelativeInclinationSensor();
var image = "resources/beach_dinner.jpg";

//Required for a THREE.js scene
var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();

//Camera setup
var farPlane = 200;
var fov = 75;
var camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, farPlane);
camera.target = new THREE.Vector3(0, 0, 0);

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

//This function sets up the THREE.js scene, initializes the orientation sensor and adds the canvas to the DOM
(function init() {

        //ThreeJS scene setup below
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio( window.devicePixelRatio );

        //TextureLoader for loading the image file
        let textureLoader = new THREE.TextureLoader();
        //AudioLoader for loading the audio file
        let audioLoader = new THREE.AudioLoader();
        //Creating the sphere where the image will be projected and adding it to the scene
        let sphere = new THREE.SphereGeometry(100, 100, 40);
        sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));    //The sphere needs to be transformed for the image to render inside it
        let sphereMaterial = new THREE.MeshBasicMaterial();
        sphereMaterial.map = textureLoader.load(image); //Use the image as the material for the sphere
        // Combining geometry and material produces the mesh with the image as its material
        let sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        scene.add(sphereMesh);

        //The sound needs to be attached to a mesh, here an invisible one, in order to be able to be positioned in the scene. Here the mesh is created and added to the scene
        let soundmesh = new THREE.Mesh( new THREE.SphereGeometry(), new THREE.MeshBasicMaterial() );    //The mesh is invisible by default
        soundmesh.position.set( -40, 0, 0 ); //The position where the sound will come from, important for directional sound
        scene.add( soundmesh );

        //Add an audio listener to the camera so we can hear the sound
        let listener = new THREE.AudioListener();
        camera.add( listener );

        //Here the sound is loaded and attached to the mesh
        let sound = new THREE.PositionalAudio( listener );
        audioLoader.load( 'resources/ocean.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop(true);
                sound.setRefDistance( 40 );
                sound.setRolloffFactor(1);
                sound.play();
        });
        soundmesh.add( sound );
        container.innerHTML = "";
        container.appendChild( renderer.domElement );

        //Sensor initialization
        oriSensor.start();

        //On window resize, also resize canvas so it fills the screen
        window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        render();
})();

//Calculates the direction the user is viewing in terms of longitude and latitude and renders the scene
function render() {
        let longitude = 0;
        let latitude = 0;
        //When the device orientation changes, that needs to be taken into account when reading the sensor values by adding offsets, also the axis of rotation might change
        switch(screen.orientation.angle) {
                default:
                case 0:
                        longitude = -oriSensor.z - oriSensor.longitudeInitial;
                        latitude = oriSensor.x - Math.PI/2;
                        break; 
                case 90:
                        longitude = -oriSensor.z - oriSensor.longitudeInitial + Math.PI/2;
                        latitude = -oriSensor.y - Math.PI/2;                 
                        break;     
                case 270:
                        longitude = -oriSensor.z - oriSensor.longitudeInitial - Math.PI/2;
                        latitude = oriSensor.y - Math.PI/2;
                        break;
        }
        camera.target.x = (farPlane/2) * Math.sin(Math.PI/2 - latitude) * Math.cos(longitude);
        camera.target.y = (farPlane/2) * Math.cos(Math.PI/2 - latitude);
        camera.target.z = (farPlane/2) * Math.sin(Math.PI/2 - latitude) * Math.sin(longitude);
        camera.lookAt(camera.target);

        renderer.render(scene, camera);
        requestAnimationFrame(() => render());
}
