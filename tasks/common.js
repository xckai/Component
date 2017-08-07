let path=require("path")
let browserSync=require('browser-sync')
let less = require('gulp-less');
let ts = require('gulp-typescript');
let proxy = require('http-proxy-middleware')
let merge = require('merge2')
let requirejsOptimize = require('gulp-requirejs-optimize');
let webpack = require('webpack');
let rename=require("gulp-rename")
let gutil=require("gulp-util")
let plumber=require("gulp-plumber")
let clean = require('gulp-clean');
module.exports=function(gulp){
    let namespace = path.basename(__filename).split(".")[0]+"."
    let baseSrc = 'src', cwdSrc = './', baseDist = "dist", cwdDist = "./"

    let staticFileType = ["html", "js", "css", "svg", "jpg", "png"]
    let staticFiles = staticFileType.map((s) => {
        return path.resolve(cwdSrc, baseSrc, "./**/*." + s)
    })
    gulp.task(namespace + "clean", () => {
        gulp.src(path.resolve(cwdDist, baseDist), { read: false }).pipe(clean({ force: true })).pipe(count("## files deleted"))
    })
    gulp.task(namespace + "init", () => {
        let tsSteam = gulp.src(path.resolve(cwdSrc, baseSrc, "./**/*.ts"), { base: baseSrc })
            .pipe(ts.createProject('tsconfig.json')())
            .pipe(gulp.dest(path.resolve(cwdDist, baseDist)))
            .pipe(count("## ts files compiled"))

        let lessSteam = gulp.src(path.resolve(cwdSrc, baseSrc, "./**/*.less"), { base: baseSrc })
            .pipe(plumber())
            .pipe(less().on("error",function(e){
                    gutil.log(e)
                    this.emit("end")
                }))
            .pipe(gulp.dest(path.resolve(cwdDist, baseDist)))
            .pipe(count("## less files compiled"))
            .on("error",function(){
                this.emit("end")
            })
        let staticFileType = ["html", "js", "css", "svg", "jpg", "png"]
        let staticFiles = staticFileType.map((s) => {
            return path.resolve(cwdSrc, baseSrc, "./**/*." + s)
        })
        let staticSteam = gulp.src(staticFiles, { base: baseSrc })
            .pipe(gulp.dest(path.resolve(cwdDist, baseDist)))
            .pipe(count("## files copy"))
        return merge([tsSteam, lessSteam, staticSteam])
    })
    gulp.task(namespace + "watchFile", [namespace + "init"], () => {
        gulp.watch('**/*.ts', { cwd: path.resolve(cwdSrc, baseSrc) }, (e) => {
            console.log(e)
            gulp.src(e.path, { base: baseSrc })
                .pipe(ts.createProject("tsconfig.json")())
                .pipe(gulp.dest(path.resolve(cwdDist, baseDist)))
        })
        gulp.watch('**/*.less', { cwd: path.resolve(cwdSrc, baseSrc) }, e => {
            console.log(e)
            gulp.src(path.resolve(cwdSrc, baseSrc, "./**/main.less"), { base: baseSrc })
                .pipe(plumber())
                .pipe(less().on("error",function(e){
                    gutil.log(e)
                    this.emit("end")
                }))
                .pipe(gulp.dest(path.resolve(cwdDist, baseDist)))
                .pipe(count("## less files compiled"))
                .on("error",function(e){
                    this.emit("end")
                })
        })
        let staticFileType = ["html", "js", "css", "svg", "jpg", "png"]
        let staticFiles = staticFileType.map((s) => {
            return "**/*." + s
        })
        gulp.watch(staticFiles, { cwd: path.resolve(cwdSrc, baseSrc) }, e => {
            console.log(e)
            gulp.src(e.path, { base: baseSrc })
                .pipe(gulp.dest(path.resolve(cwdDist, baseDist)))
        })
    })
    gulp.task(namespace + "start", [namespace + "watchFile"])

}