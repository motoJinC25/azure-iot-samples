# Azure IoT Samples

Azure IoT &amp; Azure IoT Edge samples

## For Device

### Prerequisites

```
$ git clone https://github.com/motoJinC25/azure-iot-samples.git
$ cd ./azure-iot-samples/device
$ npm install
```

### DPS Register Device

```

$ export PROVISIONING_HOST="global.azure-devices-provisioning.net"
$ export PROVISIONING_IDSCOPE="00000000000"
$ export PROVISIONING_REGISTRATION_ID="00000000000"
$ export PROVISIONING_SYMMETRIC_KEY="00000000000"
$ node dps_register_symkey.js
Registration succeeded
HostName=00000000000.azure-devices.net
DeviceId=00000000000
SharedAccessKey=00000000000
Client connected
Send status: MessageEnqueued
```

### DPS Register Device by Edge Gateway

```
$ export PROVISIONING_HOST="global.azure-devices-provisioning.net"
$ export PROVISIONING_IDSCOPE="00000000000"
$ export PROVISIONING_REGISTRATION_ID="00000000000"
$ export PROVISIONING_SYMMETRIC_KEY="00000000000"
$ export GATEWAY_HOSTNAME="gateway"
$ export EDGE_CA_CERTIFICATE_PATH="/home/user/azure-iot-test-only.root.ca.cert.pem"
$ node dps_register_symkey_gateway.js
Registration succeeded
HostName=00000000000.azure-devices.net
DeviceId=00000000000
SharedAccessKey=00000000000
GatewayHostName=gateway
Client connected
Send status: MessageEnqueued
```

### Send Telemetry by Edge Gateway

```
$ export DEVICE_HOSTNAME="00000000000.azure-devices.net"
$ export DEVICE_ID="00000000000"
$ export DEVICE_SHARED_ACCESS_KEY="00000000000"
$ export GATEWAY_HOSTNAME="gateway"
$ export EDGE_CA_CERTIFICATE_PATH="/home/user/azure-iot-test-only.root.ca.cert.pem"
$ node iot_telemetry_symkey_gateway.js
Client connected
Sending message: {"temperature":22.921282120803713}
Send status: MessageEnqueued
Sending message: {"temperature":27.314930218271417}
Send status: MessageEnqueued
Sending message: {"temperature":29.121976444944433}
Send status: MessageEnqueued
...
```
