# Demos for Generic Sensor API

This repository contains applications that demonstrate how to use the
[Generic Sensor API](https://www.w3.org/TR/generic-sensor/).

The [Generic Sensor API](https://www.w3.org/TR/generic-sensor/) is a set of
interfaces which expose sensor devices to the web platform. The API consists
of the base [Sensor](https://w3c.github.io/sensors/#the-sensor-interface)
interface and a set of concrete sensor classes built on top, such as
[Accelerometer](https://w3c.github.io/accelerometer/#accelerometer-interface),
[LinearAccelerationSensor](https://w3c.github.io/accelerometer/#linearaccelerationsensor-interface),
[Gyroscope](https://w3c.github.io/gyroscope/#gyroscope-interface),
[AbsoluteOrientationSensor](https://w3c.github.io/orientation-sensor/#absoluteorientationsensor-interface)
and [RelativeOrientationSensor](https://w3c.github.io/orientation-sensor/#relativeorientationsensor-interface).

The Generic Sensor API is very simple and easy-to-use! The Sensor interface has
<code>[start()](https://w3c.github.io/sensors/#sensor-start)</code> and
<code>[stop()](https://w3c.github.io/sensors/#sensor-stop)</code>  methods to control sensor state
and several event handlers for receiving notifications about sensor activation, errors and newly
available readings. The concrete sensor classes usually add their specific reading attributes to
the base class.

## Launch instructions

To launch a demo, it must be first hosted on a web server that supports HTTPS.
The simplest way is to fork this repository and enable
[GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)
for your fork. Another way is to set up the environment on your `localhost`,
for this we recommend using of
[Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb).
Then to run the demo on a mobile device you should set up
[port forwarding](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server)
on your local server, and you are ready to rock!

Before running the demos, please enable the
[chrome://flags/#enable-generic-sensor](chrome://flags/#enable-generic-sensor) Chrome flag.

## Demos description

### Punchmeter

Punchmeter is a simple application that calculates user's punch speed using
LinearAcceleration sensor. To try it the user should make a punch holding
mobile device in his/her hand.

### 360 degree beach panorama demo (websensor-panorama)

The demo presents a 360 degree panorama view of a beach with an added sound effect.
The user can look around the scene by moving their device.
The demo uses the orientation sensor to enable the user to look around.

### 360 degree video demo (websensor-video)

This demo presents a 360 degree video that the user can look around by moving their device.
The user can also play the video in both forward and reverse by holding the device and walking forward and backward, respectively.
The demo uses the orientation sensor to enable the user to look around and the accelerometer for walking detection to enable the user to control video playback by walking.


