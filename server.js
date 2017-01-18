'use strict'

var AV = require('leanengine');

AV.init({
    appId: process.env.LEANCLOUD_APP_ID || 'bA83E8TI6T9NDRPlhbVrz4x8-gzGzoHsz',
    appKey: process.env.LEANCLOUD_APP_KEY || 'uHP8pjfrIG91gOYEeGx7x58u',
    masterKey: process.env.LEANCLOUD_MASTER_KEY || 'H1WLQ1S5OlYrUgTESyLaSE1G'
});

var app = require('./app');
app.use(AV.koa);

var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT);
