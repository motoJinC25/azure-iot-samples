'use strict';

var fs = require('fs');
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var hostName = process.env.DEVICE_HOSTNAME;
var deviceId = process.env.DEVICE_ID;
var symmetricKey = process.env.DEVICE_SHARED_ACCESS_KEY;
var gatewayHostName = process.env.GATEWAY_HOSTNAME;
var edgeCertificateAuthorityCertificatePath = process.env.EDGE_CA_CERTIFICATE_PATH;
var options = {
  ca : fs.readFileSync(edgeCertificateAuthorityCertificatePath, 'utf-8'),
};

var connectionString = 'HostName=' + hostName + ';DeviceId=' + deviceId + ';SharedAccessKey=' + symmetricKey + ';GatewayHostName=' + gatewayHostName;
var hubClient = Client.fromConnectionString(connectionString, Mqtt);
hubClient.setOptions(options);

hubClient.open(function(err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');

    hubClient.on('message', function(msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      hubClient.complete(msg, printResultFor('Completed'));
    });

    var sendInterval = setInterval(function () {
      var temperature = 20 + (Math.random() * 10); // range: [20, 30]
      var message = new Message(JSON.stringify({temperature: temperature}));
      console.log('Sending message: ' + message.getData());
      hubClient.sendEvent(message, function(err, res) {
        if (err) console.log('Send error: ' + err.toString());
        if (res) console.log('Send status: ' + res.constructor.name);
      });
    }, 2000);

    hubClient.on('error', function (err) {
      console.error(err.message);
    });

    hubClient.on('disconnect', function () {
      clearInterval(sendInterval);
      hubClient.removeAllListeners();
    });
  }
});
