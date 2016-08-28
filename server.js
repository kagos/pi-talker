const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const router = express.Router();

const PythonShell = require('python-shell');
PythonShell.defaultOptions = { scriptPath: './python' };

/* TODO:
+   Get init status of Utilities from API
+   Pic preview
++    Create /preview-img/ folder
+   ngFramework implemented
+   Video stream up
+   Config interface for NA
+   Security
++    config sudo per env
+   Utilities from data file
*/

// Define utilites
const utilities = {
  "greenLight": {
    display: "Green Light",
    onScript: "lighton.py",
    offScript: "lightoff.py",
    type: "toggle",
    status: 0
  },
  "light1": {
    display: "Light 1",
    onScript: "light1-on.py",
    offScript: "light1-off.py",
    type: "toggle",
    status: 0
  },
  "light2": {
    display: "Light 2",
    onScript: "light2-on.py",
    offScript: "light2-off.py",
    type: "toggle",
    status: 0
  },
  "outlet1": {
    display: "Outlet 1",
    onScript: "outlet1-on.py",
    offScript: "outlet1-off.py",
    type: "toggle",
    status: 0
  },
  "range": {
    display: "Range",
    activeScript: "range.py",
    type: "range"
  },
  "snapshot": {
    display: "Snapshot",
    activeScript: "camerapreview.py",
    type: "range"
  }
};

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static(__dirname + '/src'));

app.get('/', (request, response) => {
    response.sendfile('src/index.html');
  }
).post('/', (request, response) => {

    for(let thisUtil in request.body) {

      let activeScript;

      utilities[thisUtil].status = request.body[thisUtil];

      switch(utilities[thisUtil].type) {
        case "toggle":
          // Decide on activeScript based on current status
          activeScript = utilities[thisUtil].status == 1 ?
            utilities[thisUtil].onScript : utilities[thisUtil].offScript;
          break;

        default:
          activeScript = utilities[thisUtil].activeScript;
          break;
      };

      PythonShell.run(activeScript, function(err, resp) {
        utilities[thisUtil].pyResponse = (err) ? err : resp;

        response.json(utilities[thisUtil]);
      });
    }
  }
);

app.use('/api', router);
app.listen(PORT);

console.log('Server started on ' + PORT);
