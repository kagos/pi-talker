const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const router = express.Router();

const PythonShell = require('python-shell');
PythonShell.defaultOptions = { scriptPath: './python' };

/* TODO:
+	 Get init status of Utilities from API
+	 Video stream up
+	 Config interface for NA
+    Finish DB creation & config
+	 Security
++		config sudo per env
*/

// temp static data
const dataObj = JSON.parse(require('fs').readFileSync('./db/static-data.json', 'utf8'));

const utilities = dataObj["utilities"];
const sensors = dataObj["sensors"];
const actions = dataObj["actions"];

const runPyScript = (obj, resp) => {
  PythonShell.run(obj.activeScript, obj.passableOptions, (_err, _resp) => {
    obj.msg = {
      err: _err.stack,
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
  response.sendfile('src/index.html');
  
}).get('/utilities', (request, response) => response.json(utilities)

).get('/utility/:uid', (request, response) => {
  
  for(var x = 0; x < utilities.length; x++) {
    if(utilities[x].uid === request.params.uid) {
      let utility = utilities[x];
      
      if(utility.status == 0) {
        utility.status = 1;
        utility.activeScript = utility.onScript;
      }
      else {
        utility.status = 0;
        utility.activeScript = utility.offScript;
      }
      runPyScript(utility, response);
    }
  }

}).get('/sensors', (request, response) => response.json(sensors)
       
).get('/sensor/:uid', (request, response) => {
  for(var y = 0; y < sensors.length; y++) {    
    if(sensors[y].uid == request.params.uid) runPyScript(sensors[y], response);
  }
}).get('/actions', (request, response) => response.json(actions)
  
).get('/action/:objUid/:uid', (request, response) => {
  for(let z0 = 0; z0 < actions.length; z0++) {
    const actionObj = actions[z0];
    if(actionObj.uid === request.params.objUid) { 
      for(let z1 = 0; z1 < actionObj.available.length; z1++) {
        const thisAction = actionObj.available[z1];
        if(thisAction.uid === request.params.uid) {
          runPyScript(thisAction, response);
        }
      }
    }
  }
});

app.use('/api', router);
app.listen(PORT);

console.log('Server started on ' + PORT);
