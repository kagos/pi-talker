'use strict';

const handleSensorResponse = (resp, sensorObj) => {
  if(resp.data.err) {
    sensorObj.msg.err = " is not returning a value; error: "
      + resp.data.err.traceback;
  }
  else if(resp.data.success) {
    sensorObj.msg.success = " is "
      + (sensorObj.conversion ?
        sensorObj.conversion(resp.data.success/1) :
        resp.data.success)
      + " " + sensorObj.units;
  }

  return sensorObj;
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
    label: "Distance",
    conversion: (val) => val * 2.56,
    units: "inches",
    msg: {
      success: "",
      err: ""
    }
  },
  {
    uid: "brightness",
    label: "Photo Cell",
    units: "Lumens",
    msg: {
      success: "",
      err: ""
    }
  }
];

const actions = [
  {
    uid: "camera",
    label: "Camera",
    "available": [
      {
        uid: "snapshot",
        label: "Snapshot",
        icon: "fa-camera"
      }
    ]
  },
  {
    uid: "garage",
    label: "Garage",
    "available": [
      {
        uid: "door",
        label: "Door",
        icon: "fa-car"
      }
    ]
  }
];

angular.module('piTalkerApp', [
  'ngRoute',
  'ngAnimate'
]).controller('MainCtrl', ['$http', '$interval',
  function($http, $interval) {
    let _this = this;

    _this.triggerUtilityStatusChange = (utilObj) =>
      $http.get("utility/" + utilObj.uid).then((response) =>
        utilObj.msg = response
      );

    _this.triggerSensorReading = (sensorObj) =>
      $http.get("sensor/" + sensorObj.uid).then((response) =>
        sensorObj = handleSensorResponse(response, sensorObj)
      );

    _this.triggerAction = (actionObjUid, actionUid) =>
      $http.get("action/" + actionObjUid + "/" + actionUid).then((response) => {
        const resp = response.data;

        if(resp.value) {
          for(let action in actions) {
            if(actions[action].uid === actionObjUid) {
              for(let avail in action) {
                if(actions[action].available[avail].uid === actionUid) {
                  actions[action].available[avail].msg = resp.value;
                }
              }
            }
          }
        }
      });

    _this.changeUtilityStatus = (util) => {
      for(let x = 0; x < utilities.length; x++) {
        if(utilities[x].uid === util.uid) {
          utilities[x].status = _this.triggerUtilityStatusChange(util);
        }
      }
    };

    _this.startSensorArray = (intervalLengthMS) => {
      for(let x = 0; x < sensors.length; x++) {
        if(this.resp && !this.resp.err) {
          $interval(() => {
            sensors[x].value = _this.triggerSensorReading(sensors[x]);
          }, intervalLengthMS);
        }
      }
    };

    _this.utilities = utilities;
    _this.sensors = sensors;
    _this.actions = actions;

    //this = _this;
}]);
