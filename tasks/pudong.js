let path=require("path")
let browserSync=require('browser-sync')
let less = require('gulp-less');
let ts = require('gulp-typescript');
let proxy = require('http-proxy-middleware')
let merge = require('merge2')
let requirejsOptimize = require('gulp-requirejs-optimize');
let webpack = require('webpack');
let rename=require("gulp-rename")
module.exports=function(gulp){
     let namespace = path.basename(__filename).split(".")[0]+"."
     let server = browserSync.create()
    /////////////Server//////////
    gulp.task(namespace + "initServer", ["common.start"], () => {
        server.init({
            server: {
                baseDir: "./",
                index: "dist/Apps/Pudong/index.html"
            },
            port: 3100,
        })
    })
    gulp.task(namespace + "start", [namespace + "initServer"])
}