var AV = require('leanengine');

AV.Cloud.define('hello', function(req, res){console.log(req);res.success('Hello world in cloud function');})


