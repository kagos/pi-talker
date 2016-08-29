'use strict';

// resp = { value: 100 || err: "[ExitCode=01]" }
const handleSensorResponse = (resp, units) => {
  if(!resp)
    return " is not responding"

  if(resp.err)
    return " is not returning a value; instead, \n" + JSON.stringify(resp.err);

  if(resp.status && !resp.units)
    return " is " + resp.status;

  return " is " + resp[0].value + " " + units;
};

const utilities = [
  {
    uid: "greenLight",
    label: "Green Light",
    icon: "fa-lightbulb-o",
    status: 0
  },
  {
    uid: "light1",
    label: "Bulb 1",
    icon: "fa-lightbulb-o",
    status: 0
  },
  {
    uid: "light2",
    label: "Bulb 2",
    icon: "fa-lightbulb-o",
    status: 0
  },
  {
    uid: "outlet1",
    label: "Outlet 1",
    icon: "fa-plug",
    status: 0
  }
];

const sensors = [
  {
    uid: "range",
    label: "Distance from sensor",
    units: "inches",
    statusMsgConfig: handleSensorResponse
  },
  {
    uid: "brightness",
    label: "Photo Cell",
    units: "Lumens",
    statusMsgConfig: handleSensorResponse
  },
  {
    uid: "garageDoor",
    label: "Garage Door",
    statusMsgConfig: handleSensorResponse
  }
];

const camera = [
  {
    uid: "snapshot",
    label: "Camera",
    icon: "fa-camera"
  }
];

angular.module('piTalkerApp', [
  'ngRoute',
  'ngAnimate'
]).controller('MainCtrl', ['$http',
  function($http) {

    this.updateUtilityStatus = function(util) {
      for(let x = 0; x < utilities.length; x++) {
        if(utilities[x].uid === util.uid) {
          $http.get("utility/" + util.uid + "/status").then(function (response) {
            utilities[x].status = response.data;
          });
        }
      }
    };

    this.triggerSensorReading = function(sensor) {
      for(let x = 0; x < sensors.length; x++) {
        if(sensors[x].uid === sensor.uid) {
          $http.get("sensor/" + sensor.uid).then(function (response) {
            sensors[x].resp = sensors[x].statusMsgConfig(response.data, sensors[x].units);
          });
        }
      }
    };

    this.triggerCamera = function(func) {
      for(let x = 0; x < camera.length; x++) {
        if(camera[x].uid === func.uid) {
          $http.get("camera/" + func.uid).then(function (response) {
            camera[x].imgSrc = response;
          });
        }
      }
    }

    this.utilities = utilities;
    this.sensors = sensors;
    this.camera = camera;
}]);
