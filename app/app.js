'use strict'

var Gpio = require('onoff').Gpio;
var async = require('async');


var sensors = {
  "sensor:house:livingRoom:motion": new Gpio(20, 'in', 'rising', {
    debounceTimeout : 250
  }),
  "sensor:house:kitchen:motion": new Gpio(21, 'in', 'rising', {
    debounceTimeout : 250
  })
}

var amqp = require('amqplib');
var q = 'sensors';
var connectionString = 'amqp://' + process.env.RABBIT_CONNECTION_STRING;
var open = amqp.connect(connectionString);

open.then(function(conn) {
  return conn.createChannel();
}).then(function(channel) {
  channel.assertQueue(q).then(function(ok) {
    setupSensors(channel);
  });
});

var setupSensors = function(channel) {
  //iterate over each sensor and setup the watch
  async.eachOf(sensors, function(sensor, location) {
    //watch for movement
    sensor.watch(function(err, value) {
      if (err) throw err;
      sendMessage(channel, location, value);
    });
  });
}
var sendMessage = function(channel, location, value) {
  //by default, we really only care if there's movement
  if (value === 1) {
    var message = JSON.stringify({
      "sensor": location,
      "value": 'motion triggered',
      "timestamp": new Date()
    });
    channel.sendToQueue(q, new Buffer(message));
  }
};
