
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
const database = ' mongodb://root:root123@ds121455.mlab.com:21455/userstory'


var http = require('http').Server(app);
var io = require('socket.io')(http);


//connect to database
mongoose.connect(database,{
    useNewUrlParser:true,
    useCreateIndex: true
});
//on connection
mongoose.connection.on('connected',()=>{
    console.log('connected to database'+database);
});

//on error
mongoose.connection.on('error',(err)=>{
    console.log('database error:'+err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);


app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});

http.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});
