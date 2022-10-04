'use strict';
let url = require('url'), util = require('util');
require('./string');
// *****************************************************************************************************
console.log('-----^^^-----');
let http = require('http'), ngame = require('./site/ngame'), file = require('./send');
let game = ngame.fgame({secure: false, timeout: 300000});
let server = http.createServer(function (req, res) {
    try {
        let u= req.url.mtch(/\/ghY34jkl\/\?data=(.+)/, 1);
        if (!u){return file(req, res)}
        req.url = decodeURIComponent(u);
        let host = url.parse(req.url).host;
        if (!host) return resEnd(res, 'Hello!!!');
        req.headers.host = host;
        game.web(req, res, {target: {...url.parse(req.url), path: null}});
    } catch (e) {
        console.log(e);
        resEnd(res, util.format(e));
    }
});
server.listen(8000);
game.on('error', function (err, req, res) {
    console.log(err);
    resEnd(res, 'err.on: \n' + util.format(err));
});

// ----------------------------------------------
function resEnd(res, s) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    return res.end(s);
}
// -----------------------------------------------------------------------------------------------------------










