const PythonShell = require('python-shell');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const router = express.Router();

// Define utilites
// TODO: data from sqllite3 file
const utilities = {
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
    offScript: "outlet2-off.py",
    type: "toggle",
    status: 0
  },
  "range": {
    display: "Range",
    readScript: "range.py",
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

      let pyShell;

      switch(utilities[thisUtil].type) {
        case "toggle":
          // Decide on activeScript based on current status
          // TODO: script to set current status on connect
          pyShell = new PythonShell('./python/' + ( thisUtil == 0 ? utilities[thisUtil].onScript : utilities[thisUtil].offScript));
          break;

        case "range":
          pyShell = new PythonShell('./python/' + utilities[thisUtil].readScript);
          break;
      };

      pyShell.on('message', (err, resp) => {

        if(err) {
          utilities[thisUtil].pyResponse = err;
        } else {
          utilities[thisUtil].status = request.body[thisUtil];
          utilities[thisUtil].pyResponse = resp;
        }

      }).on("error", (err) => {
        utilities[thisUtil].pyResponse = err;

      }).end(() => {
        response.json(utilities[thisUtil]);
      });
    }
  }
);

app.use('/api', router);
app.listen(PORT);

console.log('Server started on ' + PORT);
