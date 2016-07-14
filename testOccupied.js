var Gpio = require('onoff').Gpio;
var sensor = new Gpio(21, 'in', 'both');
var amqp = require('amqplib/callback_api');

var channel;
var q = 'sensors';
amqp.connect('amqp://kitchenpi:387dkj23HG32ioK@172.19.10.10', function(err, conn) {
  if (err) throw err;
  conn.createChannel(function(err, ch) {
    ch.assertQueue(q, {durable: true});
    channel = ch;
  });
});

sensor.watch(function(err, value) {
  if (err) throw err;
  if (!channel) {
    console.log('not connected to rabbitmq');
    return;
  }

  if (value === 1) {
    channel.sendToQueue(q, new Buffer('movement!'));
    console.log('movement!');
  } else {
    channel.sendToQueue(q, new Buffer('no more movement'));
    console.log('no more movement');
  }
});

//process.on('SIGINT', function() {
//  sensor.unexport();
//});
