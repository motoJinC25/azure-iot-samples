'use strict';

var fs = require('fs');
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

var provisioningHost = process.env.PROVISIONING_HOST;
var idScope = process.env.PROVISIONING_IDSCOPE;
var registrationId = process.env.PROVISIONING_REGISTRATION_ID;
var symmetricKey = process.env.PROVISIONING_SYMMETRIC_KEY;
var gatewayHostName = process.env.GATEWAY_HOSTNAME;
var edgeCertificateAuthorityCertificatePath = process.env.EDGE_CA_CERTIFICATE_PATH;
var options = {
  ca : fs.readFileSync(edgeCertificateAuthorityCertificatePath, 'utf-8'),
};

var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);
var provisioningDeviceClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), provisioningSecurityClient);
provisioningDeviceClient.setProvisioningPayload({a: 'b'});
provisioningDeviceClient.register(function(err, result) {
  if (err) {
    console.log("error registering device: " + err);
  } else {
    console.log('Registration succeeded');
    console.log('HostName=' + result.assignedHub);
    console.log('DeviceId=' + result.deviceId);
    console.log('SharedAccessKey=' + symmetricKey);
    console.log('GatewayHostName=' + gatewayHostName);
    var connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey + ';GatewayHostName=' + gatewayHostName;
    var hubClient = Client.fromConnectionString(connectionString, Mqtt);
    hubClient.setOptions(options);

    hubClient.open(function(err) {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Client connected');
        var message = new Message(JSON.stringify({message:'Hello world'}));
        hubClient.sendEvent(message, function(err, res) {
          if (err) console.log('Send error: ' + err.toString());
          if (res) console.log('Send status: ' + res.constructor.name);
          process.exit(1);
        });
      }
    });
  }
});
