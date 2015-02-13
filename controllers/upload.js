
// uploads files to S3 for ruffle and sends ruffle
var knox = require('knox'),
	shortId = require('shortid'),
    request = require('request'),
    phone = require('node-phonenumber'),
    //im = require('gm').subClass({ imageMagick: true });
    im = require('imagemagick');

var util = require('util');

var s3 = knox.createClient({
    key: process.env.R_AWS_ACCESS_KEY_ID,
    secret: process.env.R_AWS_SECRET_ACCESS_KEY,
    bucket: process.env.R_S3_BUCKET_NAME
});

exports.reruffle = function(req, res, next) {

  var picId = req.params.picId;

  // parse the given phone number
  // this automatically errors for significantly invalid numbers
  var phoneUtil = phone.PhoneNumberUtil.getInstance();
  var phoneNumber = phoneUtil.parse(req.body.phonenumber, req.body.cell_countrycode);
  var toNumber = phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.E164);
  var isValid = phoneUtil.isValidNumber(phoneNumber);

  if(!isValid){
      return next(new Error('Invalid phonenumber provided for ruffling.'));
  }

  var from = 'RUFFLE.US';
  if(req.body.cell_countrycode == 'US' || req.body.cell_countrycode == 'CA'){
      var from = '12134657532';
  }

  //var url = s3response.client._httpMessage.url;
  var host = 'http://ruffle.us';
  //var from = 'RUFFLE.US';
  var to = toNumber;
  var msg = 'Somone is trying to send you a Ruffle. Click link to view picture: ' + host + '/p/' + picId;
  var api = 'https://rest.nexmo.com/sms/json?api_key=e64a9b36&api_secret=2e0ee542&from=' + from + '&to=' + to + '&text=' + msg;

  request(api, function(err, response, body){

      if(!err && response.statusCode == 200){                
          return res.render('confirmation', {});
      }else{
          return next(err);
      }
  });      
};

exports.upload = function(req, res, next) {
	
    // parse the given phone number
    // this automatically errors for significantly invalid numbers
    var phoneUtil = phone.PhoneNumberUtil.getInstance();
    var phoneNumber = phoneUtil.parse(req.body.phonenumber, req.body.cell_countrycode);
    var toNumber = phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.E164);
    var isValid = phoneUtil.isValidNumber(phoneNumber);

    if(!isValid){
        return next(new Error('Invalid phonenumber provided for ruffling.'));
    }

    if(!req.files || !req.files.photo || req.files.photo.name.length <= 0) {
        return next(new Error('No photo was uploaded for ruffling.'));
    }

    var photo = req.files.photo;
    var s3Headers = {
      'Content-Type': photo.type,
      'x-amz-acl': 'public-read'
    };

    // create an obfuscated name for the pic
    var picId = shortId.generate();

    var from = 'RUFFLE.US';
    if(req.body.cell_countrycode == 'US' || req.body.cell_countrycode == 'CA'){
        var from = '12134657532';
    }
 
    im.resize({
      srcPath: photo.path,
      dstPath: photo.path,
      width:   500
    }, function(err, stdout, stderr){
      if(err){ return next(err); }

      s3.putFile(photo.path, picId, s3Headers, function(err, s3response){
          if(err) { return next(err); }

          //var url = s3response.client._httpMessage.url;
          var host = 'http://ruffle.us';
          //var from = 'RUFFLE.US';
          var to = toNumber;
          var msg = 'Somone is trying to send you a Ruffle. Click link to view picture: ' + host + '/p/' + picId;
          var api = 'https://rest.nexmo.com/sms/json?api_key=e64a9b36&api_secret=2e0ee542&from=' + from + '&to=' + to + '&text=' + msg;

          request(api, function(err, response, body){

              if(!err && response.statusCode == 200){                
                  return res.render('confirmation', {});
              }else{
                  return next(err);
              }
          });      
      });
    });
};