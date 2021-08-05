# SPIKE-Prime-MQTT Vuforia Edge Server Interface

A SPIKE Prime interface for the Vuforia Edge Server that utilizes a WiFi Dongle and MQTTP, to communicate from the microcontroller to the Server.

## Initial Setup Instructions

The steps outlined here only need to be followed once

### Step 1: Install Vuforia Spatial Edge Server

Start by downloading and installing the Vuforia Spatial Edge Server from one of the links below. You should end up with a folder on your computer called "vuforia-spatial-edge-server".

- [Install on a Mac](https://spatialtoolbox.vuforia.com/docs/use/connect-to-the-physical-world/install-on-mac)
- [Install on Windows](https://spatialtoolbox.vuforia.com/docs/use/connect-to-the-physical-world/install-on-windows)
- [Install on a Raspberry Pi](https://spatialtoolbox.vuforia.com/docs/vuforia-spatial-edge-server/raspberry-pi)

### Step 2: Install Interfaces Addons

Install the basic interfaces addon in the addons folder of your spatial edge server following [these instructions](https://github.com/ptcrealitylab/vuforia-spatial-basic-interfaces-addon).

Install the Robotics Interface addon in the addons folder of your spatial edge server following [these instructions](https://github.com/PTC-Education/vuforia-spatial-robotic-addon)

### Step 3: Setup a MQTT Broker

Mosquitto is an open source (EPL/EDL licensed) message broker that implements the MQTT protocol versions 5.0, 3.1.1 and 3.1. To install it on your local machine follow these [instructions](https://mosquitto.org/download/).

### Step 4: Clone this Repository

```bash
cd vuforia-spatial-robotic-addon/interfaces
git clone https://github.com/paccionesawyer/SPIKE-Prime-MQTT.git

cd .. 
npm install mqtt

cd ../..
npm install
```

### Step 5: Setup ESP8266 Dongle

**Physical Setup** Some soldering must be done to make the ESP8226 board compatible with the SPIKE Prime. Instructions on how to do so can be found [here](https://quickest-palladium-2e9.notion.site/ESP8266-505d37c06286455887f8698031602e19).

**Software Setup** Download and open the boot.py in this repository, you will need to edit the WIFI_CONFIG and MQTT_CONFIG variables to match your setup. The address of the mosquitto broker is the local IP Address of whatever device you installed it on. [How to Find My IP Address](https://www.avast.com/c-how-to-find-ip-address)

Now, save the files [boot.py](https://github.com/paccionesawyer/SPIKE-Prime-MQTT/blob/d7ea3397c4a614615350d4f895d85d0aefc250ca/ESP8266%20MQTT-Client/boot.py) and [main.py](https://github.com/paccionesawyer/SPIKE-Prime-MQTT/blob/d7ea3397c4a614615350d4f895d85d0aefc250ca/ESP8266%20MQTT-Client/main.py) in this repository on to the ESP8266. This can be done using ampy following these [instructions](https://pythonforundergradengineers.com/upload-py-files-to-esp8266-running-micropython.html)

### Step 6: Setup SPIKE-Prime

[Download](https://education.lego.com/en-us/downloads/spike-prime/software) the Spike Prime App. Open the app, connect your Spike Prime and create a new python (not word block) project. Copy and paste the [spikeMain.py](https://github.com/paccionesawyer/SPIKE-Prime-MQTT/blob/d7ea3397c4a614615350d4f895d85d0aefc250ca/SPIKE-Prime/spikeMain.py). Then navigate to the bottom right hand corner and press the zero next to the stop button, it should now say "Download to Hub". Now press download arrow and the program will be saved to whatever number you selected.

<https://user-images.githubusercontent.com/57788768/128289643-29b84313-bc5b-45dc-a86e-394347a98ddf.mp4>

## Run

The installation can take some time, however, it only needs to be done once. Therefore, the setup can be done entirely before hand. A Raspberry Pi image of the working system is saved (Not Included in this repository due to size 32GB). This Raspberry Pi is setup as a hotspot and the MQTT Broker. The ESP can be soldered and files downloaded on it before handed. An SD card with the Raspberry Pi Image, and the pre-soldered ESP8266 board can be shipped anywhere.

Once the setup is done, follow these steps each time you want to connect the SPIKE Prime to the edge server.

Start the mosquitto broker running in the background as a daemon.

```bash
pi@raspberry:~ $ mosquitto -d
```

Start the Edge Server

```bash
pi@raspberry:~ $ cd vuforia-spatial-edge-server
pi@raspberry:~ $ node server
```

Plug the ESP into Port F of the SPIKE Prime, turn on the SPIKE, and run the program number you saved [spikeMain.py](https://github.com/paccionesawyer/SPIKE-Prime-MQTT/blob/d7ea3397c4a614615350d4f895d85d0aefc250ca/SPIKE-Prime/spikeMain.py) to.

<https://user-images.githubusercontent.com/57788768/128292084-bece5e53-818e-4281-8b1f-6cff19acf9a3.mp4>

The first time you start the edge server you will need to enable the SPIKE-Prime-MQTT Interface by going to the 'Manage Hardware Interface' Tab and selecting on. Then by clicking on the yellow gear, you can set the information of the MQTT Broker. 

## Demo

<https://user-images.githubusercontent.com/57788768/128292378-1cafee53-77ac-4b8c-998a-6bd758e7997f.mp4>

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@sawyerpaccione](https://github.com/paccionesawyer)

## Related

Here are some related projects

- [Turning Raspberry Pi into a Hotspot](https://github.com/PTC-Education/RaspberryPi-SpatialToolbox-WifiHotspot) - If the Raspberry Pi is setup as a hotspot and has the edge server downloaded on it, then there is no need for an internet connection. The only thing that needs to change is the WIFI_CONFIG and MQTT_CONFIG, on the ESP8266 [boot.py](https://github.com/paccionesawyer/SPIKE-Prime-MQTT/blob/d7ea3397c4a614615350d4f895d85d0aefc250ca/ESP8266%20MQTT-Client/boot.py).

## Acknowledgements

- [MQTT Node Client Examples](https://github.com/mqttjs/MQTT.js)
- [Creating New Edge Server Interface](https://spatialtoolbox.vuforia.com/docs/develop/hardware-interfaces)
- [Numerous ESP Setup Tutorials](https://randomnerdtutorials.com/)
