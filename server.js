const PythonShell = require('python-shell');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const router = express.Router();

const lightOn = () => {
  console.log("LightOn");

  PythonShell.run('python/lighton.py', function (err) {
    if (err) return err;

    console.log('lighton.py finished');

    return "OK";
  });
};

const lightOff = () => {
  console.log("LightOff");

  PythonShell.run('python/lightoff.py', function (err) {
   if (err) return err;

   console.log('lightoff.py finished');

   return "OK";
  });
};

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static(__dirname + '/src'));

app.get('/',
  function(req, res) {
    res.sendfile('src/index.html');
  }
).post('/',
  function(req, res) {

    const status = req.body.light.status;
    let response = (status == 1 ? lightOn() : lightOff()) || "OK";

    res.json({success: true, data: {pyResponse: response, status: status}});
  }
);

app.use('/api', router);
app.listen(PORT);

console.log('Server started on ' + PORT);
