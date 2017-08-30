/*
*       Pong demo using generic sensors
*/

'use strict';

// If generic sensors are enabled and RelativeOrientationSensor is defined, create class normally
// Otherwise create a fake class
if('RelativeOrientationSensor' in window) {

    // This is a tilt sensor that uses RelativeOrientationSensor
    // It converts the quaternion to Euler angles,
    // and based on the angles calculates the tilting direction and angle of tilt
    window.TiltSensor = class RelativeInclinationSensor extends RelativeOrientationSensor {
        constructor(options) {
            super(options);
            this.direction_ = null;
            this.angle_ = 0;
            this.func_ = null;

            super.onreading = () => {

                // Conversion to Euler angles done in THREE.js so we have to create a
                // THREE.js object for holding the quaternion to convert from
                // Order x,y,z,w
                let quaternion = new THREE.Quaternion(super.quaternion[0], super.quaternion[1],
                                                      super.quaternion[2], super.quaternion[3]);

                // euler will hold the Euler angles corresponding to the quaternion
                let euler = new THREE.Euler(0, 0, 0);

                // Order of rotations must be adapted depending on orientation
                // for portrait ZYX, for landscape ZXY
                let angleOrder = null;
                screen.orientation.angle === 0 ? angleOrder = 'ZYX' : angleOrder = 'ZXY';
                euler.setFromQuaternion(quaternion, angleOrder);

                // Calculate tilt direction and angle
                // Here need to account for the screen orientation
                switch(screen.orientation.angle) {
                    default:
                    case 0:
                        euler.y < 0 ? this.direction_ = "left" : this.direction_ = "right";
                        this.angle_ = Math.sin(Math.abs(euler.y));
                    break;
                    case 90:
                        euler.x < 0 ? this.direction_ = "left" : this.direction_ = "right";
                        this.angle_ = Math.sin(Math.abs(euler.x));
                    break;
                    case 270:
                        euler.x < 0 ? this.direction_ = "right" : this.direction_ = "left";
                        this.angle_ = Math.sin(Math.abs(euler.x));
                    break;
                }

                if (this.func_ !== null)
                    this.func_();
            };
        }

        set onreading(func) {
            this.func_ = func;
        }

        get direction() {
                return this.direction_;
        }

        get angle() {
                return this.angle_;
        }
    };
} else {

    // Fake interface
    window.TiltSensor = class RelativeInclinationSensor {
        constructor(options) {
            this.start = function() {};
        }

        set onreading(func) {}

        get direction() {
            return null;
        }

        get angle() {
            return 0;
        }
    };

    // Inform the user that generic sensors are not enabled
    document.getElementById("no-sensors").style.display = "block";
}

if('LinearAccelerationSensor' in window) {

    // This is a shake detection sensor that uses LinearAccelerationSensor
    window.ShakeSensor = class ShakeSensor extends LinearAccelerationSensor {
            constructor() {
                    super();
                    this.shaking_ = false;
            }
            set onreading(func) {
                    super.onreading = () => {
                            this.shaking_ = Math.hypot(this.x, this.y, this.z) > 20;
                            func();
                    }            
            };

            get shaking() {
                return this.shaking_;
            }
    };
} else {

    // Fake interface
    window.ShakeSensor = class ShakeSensor {
        constructor(options) {
            this.start = function() {};
        }

        set onreading(func) {}

        get shaking() {
            return false;
        }
    };

    // Inform the user that generic sensors are not enabled
    document.getElementById("no-sensors").style.display = "block";
}

//Player class, represents a player
class Player {
        constructor() {
            this.score_ = 0;
            this.paddle_ = null;
        }
        increaseScore() {
            this.score_ += 1;
        }
        set paddle(paddle) {
            this.paddle_ = paddle;
        }
        get score() {
            return this.score_;
        }
        get paddle() {
            return this.paddle_;
        }
}

// Camera constants
const FOV = 50, ASPECT = 640 / 360, NEAR = 0.1, FAR = 10000;

// Required for a THREE.js scene
var camera, scene, renderer, tiltSensor, shakeSensor;

// Field variables
const fieldWidth = 400, fieldHeight = 200;

// Paddle variables
const paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1, paddleSpeed = 10;
var paddle1DirY = 0, paddle2DirY = 0;

// Ball variables
var ball;
const radius = 5;
var ballDirX = 1, ballDirY = 1;

const ballSpeedInitial = 2;     // The initial ball speed value stored for later use
var ballSpeed = ballSpeedInitial;

// Timer
var time = 0, timerVar = null;

var player1 = new Player(), player2 = new Player();

var winner = null;

const maxScore = 7, difficulty = 0.2; // Opponent difficulty between 0 and 1, greater is harder

// For the scoreboard canvas
var canvas1 = null, context1 = null, texture1 = null;

// Service worker registration
if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').then(function(registration) {
                }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
                });
        });
}

// This function sets up the three.js scene, initializes the sensors and adds the canvas to the DOM
function init() {

    const container = document.getElementById("gameCanvas");

    // three.js scene setup below
    camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
	scene.add(camera);
    tiltSensor = new TiltSensor( {frequency: 60} );
    shakeSensor = new ShakeSensor( {frequency: 60} );
    shakeSensor.onreading = () => { checkRestart(); };
	
	// Set up all the objects in the scene (table, ball, paddles)	
	createScene();

	container.appendChild(renderer.domElement);

    // Sensor initialization
    tiltSensor.start();
    shakeSensor.start();

    // On window resize, also resize canvas so it fills the screen
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
	
	loop();

    // Timer in ms, lowest possible value is 10, accurate enough though
    timerVar = setInterval(function(){time = time + 10;},10);
}

function createScene()  // A modified version of the scene from http://buildnewgames.com/webgl-threejs/
{
	// Set up the playing surface plane 
	let planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// Create materials for the objects
	let paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: "blue"
		});
	let paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: "red"
		});
	let planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: "green"
		});
	let tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: "black"
		});
	let pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: "orange"
		});
	let groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: "burlywood"
		});
		
		
	// Create the playing surface plane
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
	
	let table = new THREE.Mesh(

        new THREE.CubeGeometry(
        planeWidth * 1.05,
        planeHeight * 1.03,
        100,
        planeQuality,
        planeQuality,
        1),

        tableMaterial);

	table.position.z = -51;
	scene.add(table);
	table.receiveShadow = true;	
		
	// Create the ball
	let sphereMaterial =
    new THREE.MeshLambertMaterial(
    {
        color: "white"
    });
	ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 6, 6), sphereMaterial);
	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;

    let paddleGeom = new THREE.CubeGeometry(
	    paddleWidth,
	    paddleHeight,
	    paddleDepth,
	    paddleQuality,
	    paddleQuality,
	    paddleQuality);
		
	let paddle1 = new THREE.Mesh(
        paddleGeom,
        paddle1Material);

	
	let paddle2 = new THREE.Mesh(
		paddleGeom,
        paddle2Material);

    player1.paddle = paddle1;
    player2.paddle = paddle2;
	scene.add(paddle1);  
	scene.add(paddle2);
	
	// Position the paddles
	player1.paddle.position.x = -fieldWidth/2 + paddleWidth;
	player2.paddle.position.x = fieldWidth/2 - paddleWidth;
	player1.paddle.position.z = paddleDepth;
	player2.paddle.position.z = paddleDepth;
		
    // Create pillars
	for (let i = 0; i < 5; i++) {
		let backdrop = new THREE.Mesh(
		
		  new THREE.CubeGeometry( 
		  30, 
		  30, 
		  300, 
		  1, 
		  1,
		  1 ),

		  pillarMaterial);
		  
		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = 230;
		backdrop.position.z = -30;		
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		  
		scene.add(backdrop);	
	}
	for (let i=0; i<5; i++) {
		var backdrop = new THREE.Mesh(

		  new THREE.CubeGeometry( 
		  30, 
		  30, 
		  300, 
		  1, 
		  1,
		  1 ),

		  pillarMaterial);
		  
		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = -230;
		backdrop.position.z = -30;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		
		scene.add(backdrop);	
	}
	
	// Add a ground plane for decoration
	let ground = new THREE.Mesh(
        new THREE.CubeGeometry( 
        1000, 
        1000, 
        3, 
        1, 
        1,
        1 ),
        groundMaterial);
	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);		
		
	// Create a point light to make the scene look nicer
	let light = new THREE.PointLight(0xF8D898);
	light.position.x = -1000;
	light.position.y = 0;
	light.position.z = 1000;
	light.intensity = 2.9;
	light.distance = 10000;
	scene.add(light);

	// Scoreboard
	canvas1 = document.createElement('canvas');
	context1 = canvas1.getContext('2d');
	context1.fillStyle = "rgba(255,255,255,0.95)";
    context1.textAlign= "center";
    context1.textBaseline = 'middle';

	// Tell the player what score is needed to win
	context1.font = "Bold 20px Arial";
	context1.fillText("First to " + maxScore + " wins", canvas1.width/2, canvas1.height/2);
	context1.font = "Bold 40px Arial";
    
	// Canvas contents will be used for a texture
	texture1 = new THREE.Texture(canvas1);
    texture1.minFilter = THREE.LinearFilter;
	texture1.needsUpdate = true;
      
    let material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    let mesh1 = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
        material1
    );
	mesh1.position.set(fieldWidth/2, 0, 40);
	scene.add( mesh1 );

    // Rotate the text so it faces the player
    mesh1.rotateZ(-Math.PI/2);
    mesh1.rotateX(Math.PI/2);

	renderer.shadowMap.enabled = true;		
}

// The game loop
function loop() {
	ballPhysics();
	paddlePhysics();
	cameraMovement();
	playerPaddleMovement();
	opponentPaddleMovement();
	renderer.render(scene, camera);
	requestAnimationFrame(loop);                
}

function ballPhysics() {

    // Increase ball speed with time
    ballSpeed = ballSpeedInitial + (ballSpeedInitial * time/10000);

    // Clamp the speed
    ballSpeed = Math.max(ballSpeedInitial, Math.min(ballSpeed, 6));

	// Ball goes off the player's side - opponent scores
	if (ball.position.x <= -fieldWidth/2) {	
	    player2.increaseScore();
        resetBall(player2);
        time = 0;       // Reset timer

        //Update scoreboard only if no winner
        if(winner === null) {
            updateScoreboard("Bold 40px Arial", player1.score + '-' + player2.score);
            matchScoreCheck();
        }

	// Ball goes off the CPU's side - player scores
    } else if (ball.position.x >= fieldWidth/2) {
        player1.increaseScore();
        resetBall(player1);
        time = 0;
        if(winner === null) {
            updateScoreboard("Bold 40px Arial", player1.score + '-' + player2.score);
            matchScoreCheck();
        }
	}
	
	// Bounce off table border to keep the ball on the table
	if (ball.position.y <= -fieldHeight/2) {
		ballDirY = -ballDirY;
    } else if (ball.position.y >= fieldHeight/2) {
		ballDirY = -ballDirY;
	}
	
	// Move the ball
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// Limit the ball's y-speed to make it easier
    // (ball does not go too fast in left-right direction)
    let maxYSpeed = Math.min(1.2 * ballSpeedInitial, ballSpeed);
	if (ballDirY > maxYSpeed) {
		ballDirY = maxYSpeed;
	} else if (ballDirY < -maxYSpeed) {
		ballDirY = -maxYSpeed;
	}
}

// Handles opponent paddle movement and logic
function opponentPaddleMovement() {
	// Move towards the ball on the y plane
	paddle2DirY = (ball.position.y - player2.paddle.position.y) * difficulty;
	
	// In case the above produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirY) <= paddleSpeed) {	
		player2.paddle.position.y += paddle2DirY;

	// If the value is too high, we have to limit speed to paddleSpeed
	} else {

		// If the paddle is going in positive direction
		if (paddle2DirY > paddleSpeed)
		{
			player2.paddle.position.y += paddleSpeed;
		}

		// If the paddle is going in negative direction
		else if (paddle2DirY < -paddleSpeed)
		{
			player2.paddle.position.y -= paddleSpeed;
		}
	}
}


// Handles player's paddle movement
function playerPaddleMovement() {
	if (tiltSensor.direction === "left") {

		// If the paddle is not touching the side of table then move
		if (player1.paddle.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * tiltSensor.angle;
		} else {
			paddle1DirY = 0;
		}
	}	
	else if (tiltSensor.direction === "right") {
		if (player1.paddle.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * tiltSensor.angle;
		} else {
			paddle1DirY = 0;
		}
	} else {

		// Stop the paddle (no direction)
		paddle1DirY = 0;
	}	
	player1.paddle.position.y += paddle1DirY;
}

// Handles camera and lighting logic
function cameraMovement() {

	// Move behind the paddle
	camera.position.x = player1.paddle.position.x - 100;
	camera.position.y += (player1.paddle.position.y - camera.position.y) * 0.05;
	camera.position.z = player1.paddle.position.z + 100 + 0.04 * (-ball.position.x + player1.paddle.position.x);
	
	// Rotate to face towards the opponent
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Handles paddle collision logic
function paddlePhysics() {
	
	// If the ball is aligned with paddle1 on x plane
	if (ball.position.x <= player1.paddle.position.x + paddleWidth &&
        ball.position.x >= player1.paddle.position.x - paddleWidth)
    {

	    // And if the ball is aligned with paddle1 on y plane
	    if (ball.position.y <= player1.paddle.position.y + paddleHeight/2 &&
            ball.position.y >= player1.paddle.position.y - paddleHeight/2)
		{

			// And if the ball is travelling towards player
			if (ballDirX < 0) {

				// Bounce
				ballDirX = -ballDirX;

				// Impact ball angle when hitting it to make it possible to direct the ball
				ballDirY -= paddle1DirY * 0.4;
			}
		}
	}

    // Same for opponent paddle
	if (ball.position.x <= player2.paddle.position.x + paddleWidth &&
        ball.position.x >= player2.paddle.position.x - paddleWidth)
	{
		if (ball.position.y <= player2.paddle.position.y + paddleHeight/2 &&
            ball.position.y >= player2.paddle.position.y - paddleHeight/2)
		{
			if (ballDirX > 0) {
				ballDirX = -ballDirX;
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser) {

	// Reset ball position
	ball.position.x = 0;
	ball.position.y = 0;
	
	// If the player lost the last point, we send the ball towards the opponent
	if (loser == player1) {
		ballDirX = -1;
	}

	// If opponent lost, we send ball towards the player
	else if (loser === player2) {
		ballDirX = 1;
	}
	
	// Set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}

// Checks if either player or opponent has reached max points
function matchScoreCheck() {

	// If player has max points
	if (player1.score >= maxScore && winner === null) {
        winner = player1;

		// Stop the ball
		ballSpeed = 0;
        updateScoreboard("Bold 20px Arial", "You win, congratulations!");
	}

	// If opponent has max points
	else if (player2.score >= maxScore && winner === null) {
        winner = player2;
		ballSpeed = 0;
        updateScoreboard("Bold 20px Arial", "Opponent wins!");
	}
}

function updateScoreboard(font, text) {
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
        context1.font = font;
        context1.fillText(text, canvas1.width/2, canvas1.height/2);
        texture1.needsUpdate = true;
}

function checkRestart() {
    if(shakeSensor.shaking) {

        // Save the paddles so they don't have to be created again
        let paddle1 = player1.paddle;
        let paddle2 = player2.paddle;

        // Initialize players, variables and scene again
        player1 = new Player();
        player2 = new Player();
        player1.paddle = paddle1;
        player2.paddle = paddle2;
        ballSpeed = ballSpeedInitial;
        winner = null;
        ball.position.x = 0;
        ball.position.y = 0;
        ball.position.z = radius;
        player1.paddle.position.x = -fieldWidth/2 + paddleWidth;
        player2.paddle.position.x = fieldWidth/2 - paddleWidth;
        player1.paddle.position.z = paddleDepth;
        player2.paddle.position.z = paddleDepth;
        time = 0;
        updateScoreboard("Bold 20px Arial","First to " + maxScore + " wins");
    }
}


