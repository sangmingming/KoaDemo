var AV = require('leanengine');

AV.Cloud.define('hello', function(req, res){
    console.log(req);
    res.success('Hello world in cloud function');
});

AV.Cloud.beforeSave('Review', function(request, response) {
    response.error(JSON.stringify({
        code: 123,
        message: '自定义错误信息'
    }));
});

module.exports = AV.Cloud;
