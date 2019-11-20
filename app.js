const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
const TaskStore = require('./src/task-store');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/search', async function (req, res) {
	res.json(TaskStore.getAll(req.query.searchTerm));
	res.status(200);
	res.end();
});

app.post('/all', async function (req, res) {
	res.json(TaskStore.getAll());
	res.status(200);
	res.end();
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	console.log('Node Endpoints working :)');
});

module.exports = server;
