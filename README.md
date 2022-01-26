# What is this???

[![Git](https://app.soluble.cloud/api/v1/public/badges/5aed182f-5644-49ce-911e-b2b283808be7.svg?orgId=521549019486)](https://app.soluble.cloud/repos/details/github.com/brianbyers/ha-kitchenpi?orgId=521549019486)  

This is one part of my home automation setup. This particular project will detect motion for a few motion sensors and send those events on a RabbitMQ bus.

Why motion sensors you ask?
In an attempt to be smarter/lazier about turning on/off lights in our main living areas, I'm going to detect motion in these rooms and turn the main lights on/off depending on time of day.

Mind you, all automation for actually turning lights on/off is out of the scope for this project...this is merely a send and forget and let another piece of the puzzle pick it up and do something intelligible with it.

** Automagic **

Morning hours (when at work) - lights may get left on when we leave the house...would be great if there is motion for xx minutes, then the lights would automagically turn off.

Evening hours (when at home and may need light) - lights would automatically get turned on when there's movement, and after xx minutes of no motion, the lights would automagically turn off.

Sleepy time hours (self explanatory) - would be great if we didn't have to get out of bed to make sure we turned off lights...soooo same as morning, turn off lights when no one is moving.

** Manual Override **

There are definitely times when the normal schedule just isn't going to cut it...would be great to have a way to just pause the schedule and let lights be on or off as switched by a real person.

# Pi Setup

### Step 1: Install Raspbian
* Download [Raspbian Jessie Lite](https://www.raspberrypi.org/downloads/raspbian/)
* Download [Win32diskimager](http://sourceforge.net/projects/win32diskimager/files/latest/download)
* Write Raspbian image to SD card - [Instructions](http://www.raspberry-projects.com/pi/pi-operating-systems/win32diskimager)
* Put SD card in Pi, connect HDMI cable, keyboard and boot it up!
* Setup a static IP for the onboard wired LAN adapter
  * I personally prefer the wired LAN adapter vs wireless for initial setup since the connection is faster and more reliable
  * I personally like to do this via the DHCP server so the Raspberry Pi will always have the same IP

### Update Raspbian
* `$ sudo apt-get -y update`
* `$ sudo apt-get -y upgrade`
* `$ sudo apt-get -y install git` - Install the git client

### Install Node.js
* `curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -` - this command sets up the repositories so we can install node.js via `apt-get`
* `$ sudo apt-get install -y nodejs`
* `$ sudo npm install -g nodemon`

### Clone this git repo on the raspberry pi
* `git clone https://github.com/brianbyers/HA-kitchenpi.git`

### Start the sensor listener manually
* `cd HA-kitchenpi`
* `nodemon app.js`

### Start the sensor listener on Pi startup
* `sudo nano /etc/rc.local`
* copy this command and paste it before the `exit 0` at the end of the file `RABBIT_CONNECTION_STRING='username:password@rabbithost' nodemon /home/pi/HA-kitchenpi/app.js &`

### Development
I clone the repository locally on my computer and use the Atom editor to sync the files to my raspberry pi and use `nodemon` to restart the app whenever a file is changed. That way I don't have to manually SSH into the raspberry pi and restart the app every time I change a file.


### Resources
https://www.sitepoint.com/getting-started-with-the-raspberry-pi-gpio-pins-in-node-js/
https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/
