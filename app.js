
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine("def", require("dot-emc").init({app: app, options: { templateSettings: { cache: app.get('env') != 'development' }}}).__express);
app.set('view engine', 'def');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// setup routes
require('./config/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Ruffle server listening on port ' + app.get('port'));
});
