let url = require('url'), fs = require('fs');

module.exports = function (req, res) {
    try {
        let ext = '', pfile = __dirname + '/site';
        if (req.url === '/') {
            pfile = pfile + '/index.html';
            ext = 'html';
        }
        else {
            let bUrl = url.parse(req.url);
            let pathname = bUrl.pathname;
            ext = pathname.mtch(/\.(.+)$/, 1);
            pfile = pfile + bUrl.pathname;
            if (!pathname || !ext) return resNotFound(res);
        }
        if (fs.existsSync(pfile)) {
            let file = fs.readFileSync(pfile);
            res.writeHead(200, {'Content-Type': getMime(ext)});
            res.end(file);
        }
        else {
            resNotFound(res, req.url);
        }
    } catch (e) {resNotFound(res)}
};

function getMime(ext) {
    let mimetype = {
        ico: "image/x-icon",
        html: 'text/html',
        css: 'text/css',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        json: 'application/json',
        js: "application/javascript",
        txt: "text/plain",
        appcache: "text/cache-manifest",
        eot: "application/vnd.ms-fontobject",
        ttf: "application/x-font-ttf",
        svg: "image/svg+xml"
    };
    return mimetype[ext] || 'text/plain'
}

// ----------------------------------------------
function resNotFound(res, s) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(s || 'File not found');
}