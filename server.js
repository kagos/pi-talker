const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const router = express.Router();

const PythonShell = require('python-shell');
PythonShell.defaultOptions = { scriptPath: './python' };

/* TODO:
+	 Get init status of Utilities from API
+	 Pic preview
++		Create /preview-img/ folder
+	 ngFramework implemented
+	 Video stream up
+	 Config interface for NA
+	 Security
++		config sudo per env
+	 Utilities from data file
*/

// Define utilites
const utilities = {
	"greenLight": {
		onScript: "lighton.py",
		offScript: "lightoff.py",
		status: 0
	},
	"light1": {
		onScript: "light1-on.py",
		offScript: "light1-off.py",
		status: 0
	},
	"light2": {
		onScript: "light2-on.py",
		offScript: "light2-off.py",
		status: 0
	},
	"outlet1": {
		onScript: "outlet1-on.py",
		offScript: "outlet1-off.py",
		status: 0
	}
};

const sensors = {
	"range": {
		activeScript: "range.py"
	},
	"brightness": {
		activeScript: "brightness.py"
	},
	"garageDoor": {
		activeScript: "garagedoor.py"
	}
};

const actions = {
  "camera": {
    "snapshot": {
      activeScript: "camerapreview.py"
    }
  },
  "garage": {
    "door": {
      activeScript: "garagedoor.py"
    }
  }
};

const runPyScript = (obj, resp) => {
  PythonShell.run(obj.activeScript, function(_err, _resp) {
    obj.msg = {
      err: _err,
      value: Array.isArray(_resp) ? _resp[0] : _resp,
      status: obj.status
    };
    resp.json(obj.msg);
  });
};

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static(__dirname + '/src'));

app.get('/', (request, response) => {
  response.sendfile('src/angularIndex.html');

}).get('/utility/:uid', (request, response) => {
  const _util = utilities[request.params.uid];

  utilities[request.params.uid].status = _util.status == 0 ? 1 : 0;

  _util.activeScript = _util.status == 0 ?
    _util.offScript : _util.onScript;

  runPyScript(_util, response);

}).get('/sensor/:uid', (request, response) =>
  runPyScript(sensors[request.params.uid], response)

).get('/action/:objUid/:uid', (request, response) => {
  runPyScript(actions[request.params.objUid][request.params.uid], response);

});

app.use('/api', router);
app.listen(PORT);

console.log('Server started on ' + PORT);
