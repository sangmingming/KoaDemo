var AV = require('leanengine');
var http = require('http');
var cheerio = require('cheerio');

AV.Cloud.define('hello', function(req, res){
    console.log(req);
    res.success('Hello world in cloud function');
});


var baseUrl = "http://www.meizitu.com/a/";
AV.Cloud.define("meiziSpider", function(request, response) {
    var query = new AV.Query("meiziIndex");
    query.equalTo("name", "meizitucom");
    query.first().then(function(obj) {
       var sInd = obj.get("lastIndex"); 
        var index = parseInt(sInd);
        index += 1;
        console.log("index:" + index);
        requestMeizitu(index);

    }, function(error) {
        requestMeizitu(1);
    });
});

function requestMeizitu(index) {
    var mUrl = baseUrl + index + ".html";
    http.get(mUrl, function(res) {

        var html = "";
        response.on('data', function(data) {
            html += data;
        });

        response.on('end', function() {
            console.log("html:" + html);
            parsehtml(index, html);
            var query = new AV.Query("meiziIndex");
            query.equalTo("name", "meizitucom");
            query.first().then(function(obj) {
                var index = parseInt(obj.get("lastIndex"));
                index += 1;
                obj.set("lastIndex", inde);
                obj.save();

            }, function(error) {
                var obj = new MeiziIndex();
                obj.set("name", "meizitucom");
                obj.set("lastIndex", 1);
                obj.save();
            });
        });
    });
}

function parsehtml(oid, htmlContent) {
    var $ = cheerio.load(htmlContent);
    var mzObj = new Meizitu();
    var titleName = $("div.metaRight h2 a").text();
    mzObj.set("title", titleName);
    var tags = $("div.metaRight p").text();
    tags = tags.replace("Tags:", "");
    var tagArray = tags.split(" , ");
    mzObj.set("tags", tagArray);
    var imageLinks = [];
    mzObj.set("mzId", oid);
    $("div.postConttent p img").each(function(index, element) {
        var imgUrl = $(element).attr("src");
        imageLinks.push(imgUrl);
    });
    mzObj.set("imgs", imageLinks);
    var otherText = $("div.postContent p").text();
    mzObj.set("text", otherText);
    mzObj.save();
}

var DoubanMusic = AV.Object.extend("DoubanMusic");
var Meizitu = AV.Object.extend("meizitu");
var MeiziIndex = AV.Object.extend("meiziIndex");

module.exports = AV.Cloud;
