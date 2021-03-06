'use strict'

var koa = require('koa');
var Router = require('koa-router');
var convert = require('koa-convert');
var AV = require('leanengine');

var app = new koa();
var router = new Router();

router.get("/", function(ctx, next) {
    ctx.body = "hello world";
});

require("./cloud");

app.use(convert(AV.koa()));
app.use(router.routes())
    .use(router.allowedMethods());
module.exports = app;
