let path = require("path")
let browserSync = require('browser-sync')
let less = require('gulp-less');
let ts = require('gulp-typescript');
let proxy = require('http-proxy-middleware')
let merge = require('merge2')
let requirejsOptimize = require('gulp-requirejs-optimize');
let webpack = require('webpack');
let rename = require("gulp-rename")
count = require('gulp-count');
module.exports = function (gulp) {
     let namespace = path.basename(__filename).split(".")[0]+"."
     let server = browserSync.create()
    /////////////Server//////////
    gulp.task(namespace + "startServer", ["common.start"], () => {
        let p1 = proxy(['/service/apps', '/apps', '/lib', '/sap_logon.html', '/j_spring_security_check', '/resources'],
            { target: 'http://10.58.75.98:8080' })
        let p2 = proxy(['/eventbus', '/socket.io', '/services/vicroad', '/eventbus/info'],
            { target: 'http://10.58.75.98:8089' })
        server.init({
            server: {
                baseDir: "./",
                index: "dist/Apps/Vicroad/index.html"
            },
            port: 3000,
            middleware: [p1, p2]
        })
    })
    gulp.task(namespace + "start", [namespace +"startServer"])
    /////////Bundle//////////
    let nodePath = path.resolve(__dirname, "./node_modules/") + "/"
    gulp.task(namespace + "bundlejs", () => {

        let js = gulp.src("./dist/Apps/Vicroad/main.js").pipe(requirejsOptimize({
            paths: {
                leaflet: nodePath + "leaflet/dist/leaflet-src",
                underscore: nodePath + "underscore/underscore",
                jquery: nodePath + "jquery/dist/jquery",
                bootstrap: nodePath + "bootstrap/dist/js/bootstrap",
                d3: nodePath + "d3/build/d3",
                text: nodePath + "text/text",
                Backbone: nodePath + "backbone/backbone",
                timepicker: nodePath + "air-datepicker/dist/js/i18n/datepicker.en",
                timepicker_main: nodePath + "air-datepicker/dist/js/datepicker",
                "CustomizedChart/Vicroad/VicroadChart": './Vendor/VicroadChart',
                "moment": nodePath + "moment/moment"
            },
            shim: {
                leaflet: {
                    exports: "L"
                },
                "underscore": {
                    exports: "_"
                },
                bootstrap: {
                    deps: ["jquery"]
                },
                timepicker: {
                    deps: ["jquery", "timepicker_main"]
                },
                timepicker_main: {
                    deps: ["jquery"]
                }
            },
            //optimize: 'none',
        })).pipe(gulp.dest("./release/Vicroad"))
        return js
    })
    gulp.task(namespace+"bundlecss", () => {
        webpack({
            //插件项
            //页面入口文件配置
            entry: {
                vicroad: './src/Apps/Vicroad/main.less'
            },
            //入口文件输出配置
            output: {
                path: path.resolve("./release/Vicroad"),
                filename: 'css/main.css.js'
            },
            module: {
                //加载器配置
                rules: [{
                    test: /\.less$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader" // compiles Less to CSS
                    }]
                }
                    , {
                    test: /\.(svg|png|jpg|)$/,
                    use: "file-loader?name=[name].[ext]&outputPath=./css/images/"
                }, {
                    test: /\.(eot|woff2|ttf|woff)$/,
                    use: "file-loader?name=[name].[ext]&outputPath=./css/fonts/"
                }]
            }
        }, function (err, stats) {
            if (err) {
                console.log(err)
            }
        })
    })
    gulp.task(namespace+"release",[namespace+"bundlecss",namespace+"bundlejs"],()=>{
    gulp.src("./src/Apps/Vicroad/circleLoader.*").pipe(gulp.dest("release/Vicroad/loader"))
    gulp.src("./src/Apps/Vicroad/index-release.html").pipe(rename("index.html")).pipe(gulp.dest("release/Vicroad"))
    gulp.src("./node_modules/requirejs/require.js").pipe(gulp.dest("release/Vicroad"))
})

}