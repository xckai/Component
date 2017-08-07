var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins=gulpLoadPlugins()
plugins.path=require("path")
plugins.browserSync=require('browser-sync')
plugins.less = require('gulp-less');
plugins.ts = require('gulp-typescript');
plugins.proxy = require('http-proxy-middleware')
plugins.merge = require('merge2')
plugins.requirejsOptimize = require('gulp-requirejs-optimize');
plugins.webpack = require('webpack');
plugins.rename=require("gulp-rename")
var fs=require("fs")
var tasksPath="./tasks"
fs.readdirSync(tasksPath).filter(f=>f.match(/js$/)).forEach(f=>require(tasksPath+'/'+f)(gulp,plugins))

// const path = require("path")
// const browserSync = require('browser-sync')
// var proxy = require('http-proxy-middleware')
// var less = require('gulp-less');
// var ts = require('gulp-typescript');
// var merge = require('merge2')
// var requirejsOptimize = require('gulp-requirejs-optimize');
// var webpack = require('webpack');
// var rename=require("gulp-rename")
// gulp.task("start", () => {
//     browserSync.create().init({
//         server: {
//             baseDir: "./",
//             index: "dist/Pudong/index.html"
//         }
//     })
//     gulp.src(['./src/**/*.html', './src/**/*.js', './src/**/*.css'], { base: "src" })
//         .pipe(gulp.dest("./dist/"))
//     gulp.watch(['./src/**/*.html', './src/**/*.js'], (e) => {
//         gulp.src(e.path, { base: "src" }).pipe(gulp.dest('./dist'))

//         console.log(e.path + "-------js changed")
//     })
//     gulp.watch('./src/**/*.less', (e) => {
//         gulp.src('./src/Pudong/main.less', { base: "src" })
//             .pipe(less())
//             .pipe(gulp.dest("./dist/"))
//         console.log(e.path + "-------css changed")

//     })
//     gulp.watch('./dist/**/*.*', () => {
//         browserSync.reload()
//     })
// })
// gulp.task('less', function () {
//     var src = gulp.src('./src/**/*.ts', { base: "src" })
//         .pipe(ts({
//             "target": "es5",
//             "module": "amd",
//         })).pipe(gulp.dest('./dist'))
//     // var chart= gulp.src('./node_modules/@types/smart_traffic_chart/src_new/**/*.ts',{base:"./node_modules/@types/smart_traffic_chart/src_new"})
//     //         .pipe(ts({
//     //         "target": "es5", 
//     //             "module": "amd",
//     // })).pipe(gulp.dest('./dist/smart_traffic_chart'))

// });

// gulp.task('tsall', function () {
//     var src = gulp.src('./src/**/*.ts', { base: "src" })
//         .pipe(ts({
//             "target": "es5",
//             "module": "amd",
//         })).pipe(gulp.dest('./dist'))
//     // var chart= gulp.src('./node_modules/@types/smart_traffic_chart/src_new/**/*.ts',{base:"./node_modules/@types/smart_traffic_chart/src_new"})
//     //         .pipe(ts({
//     //         "target": "es5", 
//     //             "module": "amd",
//     // })).pipe(gulp.dest('./dist/smart_traffic_chart'))

// });



// gulp.task("vicroad", ["vicroadinit"], () => {
//     gulp.watch('src/**/*.less', { cwd: './' }, (e) => {
//         gulp.src('./src/Apps/Vicroad/main.less', { base: "src" })
//             .pipe(less())
//             .pipe(gulp.dest("./dist/"))
//         console.log(e.path + "-------css changed")
//     })

//     gulp.watch("src/**/*.ts", { cwd: './' }, (f) => {
//         gulp.src(f.path, { base: "src" })
//             .pipe(ts.createProject('tsconfig.json')()).pipe(gulp.dest('./dist'))
//     })

//     gulp.watch(["src/**/*.js", "src/**/*.json", "src/**/*.html", "src/**/*.css"], { cwd: './' }, (f) => {
//         gulp.src(f.path, { base: "src" })
//             .pipe(gulp.dest('./dist'))
//     })

//     var server = browserSync.create()
//     // server.init({server:{
//     //     baseDir:"./",
//     //     index:"dist/Vicroad/index.html"
//     // }})

//     var middleware = proxy(['/service/apps',
//         '/apps', '/lib', '/sap_logon.html', '/j_spring_security_check', '/resources'], {
//             target: 'http://10.58.75.98:8123',

//             //target:"http://10.59.176.34:8080"
//         })
//     var middleware2 = proxy(['/eventbus', '/socket.io'], {
//         // target: 'http://10.59.176.34:8080',
//         target: 'http://10.58.75.98:8089',
//         ws: true,


//     })
//     var m3 = proxy(['/services/vicroad', '/eventbus/info'], {
//         target: 'http://10.58.75.98:8089',
//         //  target:"http://10.59.176.34:8080"

//     })
//     server.init({
//         port: 3000,
//         server: {
//             baseDir: ['./'],
//             index: "dist/Apps/Vicroad/index.html"
//         },
//         middleware: [middleware, middleware2, m3],
//     })
//     // gulp.watch('dist/**/*.*',{cwd:'./'},()=>{
//     //      server.reload()
//     // })


// })
// gulp.task("vicroadinit", () => {
//     gulp.src(['./src/Jigsaw/**/*.ts', './src/Apps/Vicroad/**/*.ts'], { base: "src" })
//         .pipe(ts.createProject('tsconfig.json')()).pipe(gulp.dest('./dist'))
//     gulp.src(["./src/**/*.js", "./src/**/*.json", "./src/**/*.html", "src/**/*.css"], { base: "src" })
//         .pipe(gulp.dest("./dist"))
//     // gulp.src(["./src/**/*.js","./src/**/*.json","./src/**/*.html"],{base:"src"})
//     //     .pipe(gulp.dest("./dist"))
//     gulp.src('./src/Apps/Vicroad/main.less', { base: "src" })
//         .pipe(less())
//         .pipe(gulp.dest("./dist/"))
// })
// // gulp.task("bundle", () => {
// //     var tsResult = gulp.src('src/Apps/Vicroad/App.ts')
// //         .pipe(ts.createProject('tsconfig.json')({
// //             declaration: true,
// //             outFile: "main.js"
// //         }));
// //     var modules = ["backbone", "d3", "jquery", "leaflet", "moment", "underscore", "air-datepicker"]
// //     // var copy=gulp.src(modules.map(function(s){
// //     //     return "./node_modules/"+s+"/*.*"
// //     // }),{base:"node_modules"})
// //     var js = gulp.src("./dist_new/CustomizedChart/Vicroad/VicroadChart.js").pipe(requirejsOptimize({
// //         paths: {
// //             d3: "empty:",
// //             underscore: "empty:"
// //         },
// //         optimize: 'none',
// //     }))
// //     return merge([
// //         tsResult.js.pipe(gulp.dest('release/Vicroad')),
// //     ]);
// // })
// var nodePath = path.resolve(__dirname, "./node_modules/") + "/"
// gulp.task("bundlecss", () => {
//     webpack({
//         //插件项
//         //页面入口文件配置
//         entry: {
//             vicroad: './src/Apps/Vicroad/main.less'
//         },
//         //入口文件输出配置
//         output: {
//             path: path.resolve("./release/Vicroad"),
//             filename: 'css/main.css.js'
//         },
//         module: {
//             //加载器配置
//             rules: [{
//                 test: /\.less$/,
//                 use: [{
//                     loader: "style-loader" // creates style nodes from JS strings
//                 }, {
//                     loader: "css-loader" // translates CSS into CommonJS
//                 }, {
//                     loader: "less-loader" // compiles Less to CSS
//                 }]
//             }
//                 , {
//                 test: /\.(svg|png|jpg|)$/,
//                 use: "file-loader?name=[name].[ext]&outputPath=./css/images/"
//             }, {
//                 test: /\.(eot|woff2|ttf|woff)$/,
//                 use: "file-loader?name=[name].[ext]&outputPath=./css/fonts/"
//             }]
//         }
//     }, function (err, stats) {
//         if (err) {
//             console.log(err)
//         }
//     })
// })
// gulp.task("bundlejs", () => {
//     var js = gulp.src("./dist/Apps/Vicroad/main.js").pipe(requirejsOptimize({
//         paths: {
//             leaflet: nodePath + "leaflet/dist/leaflet-src",
//             underscore: nodePath + "underscore/underscore",
//             jquery: nodePath + "jquery/dist/jquery",
//             bootstrap: nodePath + "bootstrap/dist/js/bootstrap",
//             d3: nodePath + "d3/build/d3",
//             text: nodePath + "text/text",
//             Backbone: nodePath + "backbone/backbone",
//             timepicker: nodePath + "air-datepicker/dist/js/i18n/datepicker.en",
//             timepicker_main: nodePath + "air-datepicker/dist/js/datepicker",
//             "CustomizedChart/Vicroad/VicroadChart": './Vendor/VicroadChart',
//             "moment": nodePath + "moment/moment"
//         },
//         shim: {
//             leaflet: {
//                 exports: "L"
//             },
//             "underscore": {
//                 exports: "_"
//             },
//             bootstrap: {
//                 deps: ["jquery"]
//             },
//             timepicker: {
//                 deps: ["jquery", "timepicker_main"]
//             },
//             timepicker_main: {
//                 deps: ["jquery"]
//             }
//         },
//         //optimize: 'none',
//     })).pipe(gulp.dest("./release/Vicroad"))

// })
// gulp.task("release",["bundlecss","bundlejs"],()=>{
//     gulp.src("./src/Apps/Vicroad/circleLoader.*").pipe(gulp.dest("release/Vicroad/loader"))
//     gulp.src("./src/Apps/Vicroad/index-release.html").pipe(rename("index.html")).pipe(gulp.dest("release/Vicroad"))
//     gulp.src("./node_modules/requirejs/require.js").pipe(gulp.dest("release/Vicroad"))
// })
// gulp.task("copy",()=>{
//      gulp.src("./node_modules/requirejs/require.js").pipe(gulp.dest("release/Vicroad"))
// })
var path=require("path")
gulp.task("testname",()=>{
    console.log(path.basename(__filename))
})