
var Upload = require('../controllers/upload');

module.exports = function(app) {

	app.post('/upload/:picId', Upload.reruffle);
	app.post('/upload', Upload.upload);

	app.get('/reruffle/:photoId', function(req, res, next){
		res.render('reruffle', { photoId: req.params.photoId });
	});

	app.get('/p/:photoId', function(req, res, next){
		res.render('photo', { photoId: req.params.photoId });
	});	
};