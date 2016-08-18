const PythonShell = require('python-shell');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static(__dirname + '/src'));

app.get('*', function(req, res) {
  res.sendfile('src/index.html');
});

app.listen(PORT);

console.log('Server started on ' + PORT);

/*PythonShell.run('lighton.py', function (err) {
  if (err) throw err;
  console.log('lighton.py finished');
});


PythonShell.run('lightoff.py', function (err) {
 if (err) throw err;
 console.log('lightoff.py finished');
});
*/
