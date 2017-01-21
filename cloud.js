var AV = require('leanengine');
var http = require('http');
var cheerio = require('cheerio');

AV.Cloud.define('hello', function(req, res){
    console.log(req);
    res.success('Hello world in cloud function');
});

AV.Cloud.define('doubanMusic', function(req, res) {
    http.get("https://music.douban.com/chart", function(response) {
        var html = "";
        response.on('data', function(data) {
            html += data;
        });

        response.on('end', function() {
            callback(html);
        });
    });
} );

var DoubanMusic = AV.Object.extend("DoubanMusic");

function callback(html) {
    var $ = cheerio.load(html);
    var result = [];

    $("ul.col5 li.clearfix").each(function(index, element) {
        var url = $(element).find("a.face").attr("href");
        result.push('url');
        var doubanMusic = new DoubanMusic();
        doubanMusic.save({
            "icon": url
        }).then(function(object) {
            console.log("success");
        });
    
    })
}

AV.Cloud.beforeSave('Review', function(request, response) {
    response.error(JSON.stringify({
        code: 123,
        message: '自定义错误信息'
    }));
});

module.exports = AV.Cloud;
