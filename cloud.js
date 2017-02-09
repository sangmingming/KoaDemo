var AV = require('leanengine');
var http = require('http');
var cheerio = require('cheerio');
var https = require("https");

function sendGank(content) {
    var data = JSON.stringify(content);
    var options = {
        hostname: 'hook.bearychat.com',
        port: 443,
        path:"/=bw88X/incoming/659242f9646cf54b6f62acd6dee9fbfc",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var req = http.request(options, function(res){
        console.log("STATUS" + res.statusCode);
    });
    req.write(data);
    req.end();

}

AV.Cloud.define('hello', function(req, res){
    console.log(req);
    res.success('Hello world in cloud function');
});

AV.Cloud.define("todayGank", function(request, response) {
        date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        url = "http://gank.io/api/day/" +year+ "/" + month + "/" + day;
    http.get(url, function(res) {
        if (res.statusCode !== 200) {
            sendGank({"text": "发生了错误"});
            return;
        }
        res.setEncoding("utf8");
        var rawData = '';
        res.on('data', function(chunk){
            rawData += chunk;
        });
        res.on('end', function() {
            parseData = JSON.parse(rawData);
            if (parseData.category.length == 0) {
                sendGank({"text":":joy: 今天休息没干货"});
                return;
            }
            datas = parseData.results;
            var text = "今日干货 " +year + "年" + month + "月" + day + "日";
            arr = new Array();
            for(key in datas) {
                if (key != "休息视频" && key != "福利") {
                    attachmentItem = {'title': key, 'text': '', 'color':"#409fff"};
                    itemData = datas[key];
                    for(items itemData) {
                        attachmentItem.text = attachmentItem.text + itemData[items].desc + " By:" + itemData[items].who + "\n" + itemData[items].url + "\n";
                    }
                    arr.push(attachmentItem);
                }

            } 
            sendGank({"text": text, "attachments": arr});
        });

    });
});



//var baseUrl = "http://www.meizitu.com/a/";
//AV.Cloud.define("meiziSpider", function(request, response) {
//    var query = new AV.Query("meiziIndex");
//    query.equalTo("name", "meizitucom");
//    query.first().then(function(obj) {
//       var sInd = obj.get("lastIndex"); 
//        var index = parseInt(sInd);
//        index += 1;
//        console.log("index:" + index);
//        requestMeizitu(index);
//
//    }, function(error) {
//        requestMeizitu(1);
//    });
//});

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
