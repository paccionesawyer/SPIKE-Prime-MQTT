#!/usr/bin/env micropython
'''
Tufts University CEEO Fetlab (PTC), Summer 2021
spikeMain.py
By: Sawyer Bailey Paccione
Purpose: Constantly get data from any connected devices and send them from the
         ESP. Take any message from the ESP and execute it as it should come
         in the form of a python command.
'''

import hub, utime, ujson
from Backpack_Code import Backpack

# Setup Dongle
dongle = Backpack(hub.port.F, verbose=False)

# Get a list of what's connected to each port on the Spike Prime
ports = hub.status()["port"]

# Variables
portName = ["A", "B", "C", "D", "E", "F"]
colorSensor = forceSensor = distanceSensor = -1
lengths = [0, 0, 0, 0, 0, 0]

hub_ports = {"A": '', "B": '', "C": '', "D": '', "E": ''}
portType = ["none", "none", "none", "none", "none", "none"]

hub_data = {
    "AccelX": '',
    "AccelY": '',
    "AccelZ": '',
    "GyroX": '',
    "GyroY": '',
    "GyroZ": ''
}


def build_sensorJson():
    '''
    Automatically detect what type of devices are currently attached to which 
    port and build a python dictionary corresponding to the sensors.
    '''
    motor_counter = 0
    global colorSensor, forceSensor, distanceSensor
    # Each type of motor/sensor has a different array size, so we can figure out
    # which port has what on it based on how long the array is
    for i in range(5):
        lengths[i] = len(ports[portName[i]])
        if (lengths[i] == 1):
            exec("distance = hub.port." + portName[i] + ".device")
            hub_ports[portName[i]] = "distance"
            hub_data["dist"] = ''
            distanceSensor = i
        elif (lengths[i] == 3):
            exec("force = hub.port." + portName[i] + ".device")
            hub_ports[portName[i]] = "force"
            hub_data["force"] = ''
            forceSensor = i
        elif (lengths[i] == 4):
            motor_counter += 1
            exec("motor" + str(motor_counter) + "= hub.port." + portName[i] +
                 ".motor")
            #hub_data["motor" + str(motor_counter)] = ''
            hub_ports[portName[i]] = "motor"
        elif (lengths[i] > 4):
            exec("color = hub.port." + portName[i] + ".device")
            hub_data["color"] = ''
            hub_ports[portName[i]] = "color"
            colorSensor = i


def update_hub_data():
    '''
    Get the current sensor readings from all the connected devices
    and format them into a dictionary
    '''
    if (colorSensor != -1):
        hub_data["color"] = color.get()[1]
    if (distanceSensor != -1):
        hub_data["dist"] = distance.get()[0]
    if (forceSensor != -1):
        hub_data["force"] = force.get()[0]

    accel = hub.motion.accelerometer()
    gyro = hub.motion.gyroscope()

    hub_data["AccelX"] = accel[0]
    hub_data["AccelY"] = accel[1]
    hub_data["AccelZ"] = accel[2]
    hub_data["GyroX"] = gyro[0]
    hub_data["GyroY"] = gyro[1]
    hub_data["GyroZ"] = gyro[2]


def main():

    update_hub_data()

    msg = ujson.dumps(hub_data)  # Convert the dictionary into a string
    response = dongle.ask(msg)  # Send message to the WiFi dongle

    # Format the message back from the dongle ()
    response = response.replace('>', '')
    print("response:", response)
    if response == '' or response == ">>>":
        response = dongle.read()

    if response == 'custom':
        try:
            exec(open('custom_program.py').read())
        except:
            pass
    else:
        # Try to run the command that was sent from the edge server
        try:
            exec(response)
        except:
            pass


build_sensorJson()


while True:
    main()
    utime.sleep(0.5)
