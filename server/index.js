"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var ejs = require("ejs");
var embedcss_1 = require("./build/embedcss");
var app = express();
app.use("/assets", express.static(__dirname + '/assets'));
var cssFiles = [
    '/css/variables.css',
    '/css/base.css',
    '/css/layout.css',
    '/css/clickcircle.css',
    '/css/imagefigure.css',
    '/css/headline.css',
    '/css/pill.css'
].map(function (file) { return __dirname + file; });
app.get('/', function (req, res) {
    var indexHtml = fs.readFileSync(__dirname + '/templates/_index.ejs').toString('utf8');
    var styles = embedcss_1.embedCss(cssFiles);
    var html = ejs.render(indexHtml, { styles: styles });
    res.send(html);
});
app.get('/posts/:title', function (req, res) {
    var title = req.params['title'];
    var styles = embedcss_1.embedCss(__dirname);
    var html = renderPage(title, styles);
    res.send(html);
});
function renderPage(title, styles) {
    // const compiledPost = pug.compileFile(__dirname + '/templates/_post.handlerbars');
    // const content = pug.compileFile(__dirname + '/posts/' + title + '.handlerbars')();
    // return compiledPost({ title, styles, content });
    return '';
}
app.listen(3000, function () { return console.log('listening!'); });
