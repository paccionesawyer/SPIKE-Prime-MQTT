/* 
 * Tufts University Fetlab, CEEO PTC 
 * index.js
 * By: Sawyer Paccione
 *
 * Description: Holds the main code for creating the interface for the
 *              SPIKE Prime which utilizes MQTT for Wireless communication.
 */

var server = require('@libraries/hardwareInterfaces');
var settings = server.loadHardwareInterface(__dirname);

exports.enabled = settings('enabled');
exports.configurable = true;

var mqtt_options = {
    retain: true,
    qos: 1,
};

var objectName = 'Spike-Prime-Web';
var TOOL_NAME = 'Spike-Prime-Web-Frame';
var runMotors = true

if (exports.enabled) {
    const mqtt = require('mqtt')

    var read_topic = "hub_data";
    var run_topic = "commands";

    // 1 - Get the settings defined in the Configuration Page
    exports.settings = {
        ip: settings('ip'), // Default: 192.168.50.10
        port: settings('port'), // Default: 1883
        complexity: settings('complexity'), // Default: intermediate
        updateRate: settings('updateRate')
    };

    // 2 - Attempt to connect to the MQTT Broker
    var mqtt_broker = "mqtt://" + exports.settings.ip + ":" + exports.settings.port

    var client = mqtt.connect(mqtt_broker, {
        clientId: "mqttjs01"
    })
    console.log("connected flag  " + client.connected);

    // 3 - Define the client behaviour and callback functions
    client.on("connect", function () {
        console.log("connected  " + client.connected);
        console.log("subscribing to ReadTopic");
        client.subscribe(read_topic, {
            qos: 0
        });
        publish(run_topic, "EDGE CONNECTED", mqtt_options)
    });

    //Handle incoming messages
    client.on("message", function (topic, message, packet) {
        try {
            parseSensorData(message)
        } catch (e) {}
    });

    client.on("error", function (error) {
        console.log("Error: " + error);
    });

    function publish(topic, msg, mqtt_options) {
        console.log("publishing", msg, "to", topic);

        if (client.connected == true) {
            console.log("here")
            client.publish(topic, msg, mqtt_options);
        }
    };

}

function parseSensorData(hub_dataString) {
    sensor_data = JSON.parse(hub_dataString)

    server.write(objectName, TOOL_NAME, "accelerometerX", server.map(sensor_data.AccelX, -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "accelerometerY", server.map(sensor_data.AccelY, -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "accelerometerZ", server.map(sensor_data.AccelZ, -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "gyroscopeX", server.map(sensor_data.GyroX, -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "gyroscopeY", server.map(sensor_data.GyroY, -5000, 5000, -5000, 5000), "f")
    server.write(objectName, TOOL_NAME, "gyroscopeZ", server.map(sensor_data.GyroZ, -5000, 5000, -5000, 5000), "f")

    if (sensor_data.color != undefined) {
        server.write(objectName, TOOL_NAME, "color", server.map(sensor_data.color, -5000, 5000, -5000, 5000), "f")
    }

    if (sensor_data.dist != undefined) {
        server.write(objectName, TOOL_NAME, "distance", server.map(sensor_data.dist, -5000, 5000, -5000, 5000), "f")
    }

    if (sensor_data.force != undefined) {
        server.write(objectName, TOOL_NAME, "force", server.map(sensor_data.force, -5000, 5000, -5000, 5000), "f")
    }
}

server.addEventListener('reset', function () {
    settings = server.loadHardwareInterface(__dirname);
    console.log('settings were updated');
    console.log('new ip = ' + settings('ip'));
    console.log('new updateRate = ' + settings('updateRate'));
});

function startHardwareInterface() {
    console.log('Spike Interface: Starting up')
    complexity = settings('complexity')
    server.enableDeveloperUI(true)

    // Adds sensor nodes to the object on the app
    server.addNode(objectName, TOOL_NAME, "stopMotors", "node", {
        x: 0,
        y: 125,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "color", "node", {
        x: 75,
        y: -175,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "distance", "node", {
        x: 0,
        y: -175,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "force", "node", {
        x: -75,
        y: -175,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "accelerometerX", "node", {
        x: -125,
        y: -100,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "accelerometerY", "node", {
        x: -125,
        y: -25,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "accelerometerZ", "node", {
        x: -125,
        y: 50,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "gyroscopeX", "node", {
        x: -200,
        y: -100,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "gyroscopeY", "node", {
        x: -200,
        y: -25,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "gyroscopeZ", "node", {
        x: -200,
        y: 50,
        scale: 0.25
    });

    // Adds motor nodes to the object on the app
    server.addNode(objectName, TOOL_NAME, "motor1", "node", {
        x: 125,
        y: -100,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "motor2", "node", {
        x: 125,
        y: -25,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "motor3", "node", {
        x: 125,
        y: 50,
        scale: 0.25
    });
    server.addNode(objectName, TOOL_NAME, "CustomProgram", "node", {
        x: 150,
        y: -175,
        scale: 0.25
    });

    // Removes nodes that are only found in beginner (otherwise they will stay spawned in when switching)
    server.removeNode(objectName, TOOL_NAME, "LED")
    server.removeNode(objectName, TOOL_NAME, "screen")
    server.removeNode(objectName, TOOL_NAME, "motors")

    if (complexity == 'beginner' || complexity == 'intermediate') {
        // Remove the accelerometer/gyroscope/FFT nodes
        server.removeNode(objectName, TOOL_NAME, "accelerometerX")
        server.removeNode(objectName, TOOL_NAME, "accelerometerY")
        server.removeNode(objectName, TOOL_NAME, "accelerometerZ")
        server.removeNode(objectName, TOOL_NAME, "gyroscopeX")
        server.removeNode(objectName, TOOL_NAME, "gyroscopeY")
        server.removeNode(objectName, TOOL_NAME, "gyroscopeZ")
        server.removeNode(objectName, TOOL_NAME, "CustomProgram")

        // Removing more nodes for beginner
        if (complexity == 'beginner') {
            server.removeNode(objectName, TOOL_NAME, "color")
            server.removeNode(objectName, TOOL_NAME, "force")
            server.removeNode(objectName, TOOL_NAME, "motor1")
            server.removeNode(objectName, TOOL_NAME, "motor2")
            server.removeNode(objectName, TOOL_NAME, "motor3")

            // Adding LED and Screen nodes and moving the distance node
            server.addNode(objectName, TOOL_NAME, "screen", "node", {
                x: -125,
                y: -25,
                scale: 0.25
            });
            server.addNode(objectName, TOOL_NAME, "LED", "node", {
                x: -125,
                y: 50,
                scale: 0.25
            });
            server.addNode(objectName, TOOL_NAME, "motors", "node", {
                x: 125,
                y: -25,
                scale: 0.25
            });
            server.moveNode(objectName, TOOL_NAME, "distance", 125, 50)

            // Increases the sensor refresh rate due to more things being sent
            sensorRefresh = 100
        }
        // Moving nodes for intermediate
        else {
            server.moveNode(objectName, TOOL_NAME, "color", -125, -100)
            server.moveNode(objectName, TOOL_NAME, "distance", -125, -25)
            server.moveNode(objectName, TOOL_NAME, "force", -125, 50)
        }
    }

    // Remove the motor nodes for sensor and moves other nodes
    if (complexity == 'sensor') {
        server.removeNode(objectName, TOOL_NAME, "motor1")
        server.removeNode(objectName, TOOL_NAME, "motor2")
        server.removeNode(objectName, TOOL_NAME, "motor3")
        server.removeNode(objectName, TOOL_NAME, "stopMotors")
        server.moveNode(objectName, TOOL_NAME, "color", 125, -100)
        server.moveNode(objectName, TOOL_NAME, "distance", 125, -25)
        server.moveNode(objectName, TOOL_NAME, "force", 125, 50)

        // Sets the refresh rate for the sensors to 10
        sensorRefresh = 10
    }

    // Moves nodes for advanced
    if (complexity == 'advanced') {
        server.moveNode(objectName, TOOL_NAME, "color", 75, -175)
        server.moveNode(objectName, TOOL_NAME, "distance", 0, -175)
        server.moveNode(objectName, TOOL_NAME, "force", -75, -175)
        server.moveNode(objectName, TOOL_NAME, "CustomProgram", 150, -175)
        server.addNode(objectName, TOOL_NAME, "screen", 150, -100)
    }

    // Listens for the stopMotors node
    server.addReadListener(objectName, TOOL_NAME, "stopMotors", function (data) {
        // When true, stop the Spike motors
        if (data.value == 1) {
            console.log('motors off')
            stopMotors()
        }
        // When false, allow the motors to run
        if (data.value == 0) {
            console.log('motors on')
            runMotors = true
        }
    });

    // Listen for the motor1 node
    server.addReadListener(objectName, TOOL_NAME, "motor1", function (data) {
        // If we are running motors, then run the motor at the speed of the value sent to the node
        if (runMotors) {
            setTimeout(() => {
                publish(run_topic, "motor1.pwm(" + Math.round(data.value) + ")\r\n")
            }, 0);
        }
        // Else stop the motors
        else {
            stopMotors()
        }
    });

    // Listen for the motor2 node
    server.addReadListener(objectName, TOOL_NAME, "motor2", function (data) {
        // If we are running motors, then run the motor at the speed of the value sent to the node
        if (runMotors) {
            setTimeout(() => {
                publish(run_topic, "motor2.pwm(" + Math.round(data.value) + ")\r\n")
            }, 0);
        }
        // Else stop the motors
        else {
            stopMotors()
        }
    });

    // Listen for the motor3 node
    server.addReadListener(objectName, TOOL_NAME, "motor3", function (data) {
        // If we are running motors, then run the motor at the speed of the value sent to the node
        if (runMotors) {
            setTimeout(() => {
                publish(run_topic, "motor3.pwm(" + Math.round(data.value) + ")\r\n")
            }, 0);
        }
        // Else stop the motors
        else {
            stopMotors()
        }
    });

    // Listens for the motors node (used in beginner mode to control all motors)
    server.addReadListener(objectName, TOOL_NAME, "motors", function (data) {
        // If we are running motors, then run all the motors at the speed of the value sent to the node
        if (runMotors) {
            if (motor1 != 'none') {
                setTimeout(() => {
                    publish(run_topic, "motor1.pwm(" + Math.round(data.value) + ")\r\n")
                }, 0);
            }
            if (motor2 != 'none') {
                setTimeout(() => {
                    publish(run_topic, "motor2.pwm(" + Math.round(data.value) + ")\r\n")
                }, 0);
            }
            if (motor3 != 'none') {
                setTimeout(() => {
                    publish(run_topic, "motor3.pwm(" + Math.round(data.value) + ")\r\n")
                }, 0);
            }
        }
        // Else stop the motors
        else {
            stopMotors()
        }
    });

    // Listen for the screen node 
    server.addReadListener(objectName, TOOL_NAME, "screen", function (data) {
        setTimeout(() => {
            publish(run_topic, "hub.display.show(\"" + data.value + "\")\r\n")
        }, 0);
    });

    // Listen for the LED node (beginner mode only)
    server.addReadListener(objectName, TOOL_NAME, "LED", function (data) {
        setTimeout(() => {
            publish(run_topic, "hub.led(" + data.value + ")\r\n")
        }, 0)
    });

    // Listen for the Custom Program Node (Advanced Only)
    server.addReadListener(objectName, TOOL_NAME, "CustomProgram", function (data) {
        setTimeout(() => {
            publish(run_topic, "custom")
        }, 0)
    });

    updateEvery(0, 10);
}

// Send commands to stop all the motors 
function stopMotors() {
    runMotors = false
    publish(run_topic, "EDGE disconnecting", mqtt_options)
    publish(run_topic, "motor1.pwm(0)", mqtt_options)
    publish(run_topic, "motor2.pwm(0)", mqtt_options)
    publish(run_topic, "motor3.pwm(0)", mqtt_options)
}

// Updates readListeners
function updateEvery(i, time) {
    setTimeout(() => {
        updateEvery(++i, time);
    }, time)
}

// Wait for the connection to be established with the Spike Prime before starting up
server.addEventListener("initialize", function () {
    if (exports.enabled) setTimeout(() => {
        startHardwareInterface()
    }, 10000)
});

// Stop motors on server shutdown
server.addEventListener("shutdown", function () {
    stopMotors()
    stopMotors()
});