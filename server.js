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

const camera = {
  "snapshot": {
    activeScript: "camerapreview.py"
  }
}

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static(__dirname + '/src'));

app.get('/', (request, response) => {
  response.sendfile('src/angularIndex.html');

}).get('/utility/:uid/status', (request, response) => {
  const thisUtil = utilities[request.params.uid];

  utilities[request.params.uid].status = thisUtil.status == 0 ? 1 : 0;

  const activeScript = thisUtil.status == 0 ?
    thisUtil.offScript : thisUtil.onScript;

  PythonShell.run(activeScript, function(err, resp) {
    utilities[request.params.uid].pyResponse = (err) ? err : resp;
    response.json(utilities[request.params.uid].status);
  });
}).get('/sensor/:uid', (request, response) => {

  PythonShell.run(sensors[request.params.uid].activeScript, function(err, resp) {
    sensors[request.params.uid].pyResponse = {
      err: err,
      resp: resp
    }
    response.json(sensors[request.params.uid].pyResponse);
  });
}).get('/camera/:uid', (request, response) => {

  PythonShell.run(camera[request.params.uid].activeScript, function(err, resp) {
    camera[request.params.uid].imgSrc = resp;
    response.json({imgSrc: (resp || "/img/no_image.png")});
  });
});


app.use('/api', router);
app.listen(PORT);

console.log('Server started on ' + PORT);
