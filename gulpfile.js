var gulp = require('gulp');
const browserSync = require('browser-sync')
var proxy = require('http-proxy-middleware')
var less = require('gulp-less');
var ts = require('gulp-typescript');
gulp.task("start",()=>{
    browserSync.create().init({server:{
        baseDir:"./",
        index:"dist/Pudong/index.html"
    }})
gulp.src(['./src/**/*.html','./src/**/*.js','./src/**/*.css'],{base:"src"})
    .pipe(gulp.dest("./dist/"))
gulp.watch(['./src/**/*.html','./src/**/*.js'],(e)=>{
           gulp.src(e.path,{base:"src"}).pipe(gulp.dest('./dist'))
          
        console.log(e.path+"-------js changed")
})
gulp.watch('./src/**/*.less',(e)=>{
    gulp.src('./src/Pudong/main.less',{base:"src"})
        .pipe(less())
        .pipe(gulp.dest("./dist/"))
   console.log(e.path+"-------css changed")
            
})
gulp.watch('./dist/**/*.*',()=>{
     browserSync.reload()
})
})
gulp.task('less', function() {
    var src = gulp.src('./src/**/*.ts',{base:"src"})
            .pipe(ts({
            "target": "es5",
                "module": "amd",
        })).pipe(gulp.dest('./dist'))
    // var chart= gulp.src('./node_modules/@types/smart_traffic_chart/src_new/**/*.ts',{base:"./node_modules/@types/smart_traffic_chart/src_new"})
    //         .pipe(ts({
    //         "target": "es5", 
    //             "module": "amd",
    // })).pipe(gulp.dest('./dist/smart_traffic_chart'))
 
});

gulp.task('tsall', function() {
    var src = gulp.src('./src/**/*.ts',{base:"src"})
            .pipe(ts({
            "target": "es5",
                "module": "amd",
        })).pipe(gulp.dest('./dist'))
    // var chart= gulp.src('./node_modules/@types/smart_traffic_chart/src_new/**/*.ts',{base:"./node_modules/@types/smart_traffic_chart/src_new"})
    //         .pipe(ts({
    //         "target": "es5", 
    //             "module": "amd",
    // })).pipe(gulp.dest('./dist/smart_traffic_chart'))
 
});


gulp.task("vicroad",["vicroadinit"],()=>{
    gulp.watch('src/**/*.less',{cwd:'./'},(e)=>{
        gulp.src('./src/Vicroad/main.less',{base:"src"})
            .pipe(less())
            .pipe(gulp.dest("./dist/"))
            console.log(e.path+"-------css changed")    
    })
    
    gulp.watch("src/**/*.ts",{cwd:'./'},(f)=>{
        gulp.src(f.path,{base:"src"})
            .pipe(ts({
                "target": "es5",
                "module": "amd",
        })).pipe(gulp.dest('./dist'))
    })
    
    gulp.watch(["src/**/*.js","src/**/*.json","src/**/*.html","src/**/*.css"],{cwd:'./'},(f)=>{
         gulp.src(f.path,{base:"src"})
            .pipe(gulp.dest('./dist'))
    })

    var server= browserSync.create()
    // server.init({server:{
    //     baseDir:"./",
    //     index:"dist/Vicroad/index.html"
    // }})
 
    var middleware=proxy(['/service','/apps','/lib','/sap_logon.html','/j_spring_security_check','/resources'], {
            target: 'http://10.58.75.98:8123'
        })
    server.init({
        port: 3000,
		server: {
			baseDir: ['./'],
            index:"dist/Vicroad/index.html"
		},
		middleware:middleware,
    })
    gulp.watch('dist/**/*.*',{cwd:'./'},()=>{
         server.reload()
    })

    ////copy all
   
})
gulp.task("vicroadinit",()=>{
    gulp.src('./src/**/*.ts',{base:"src"})
                .pipe(ts({
                "target": "es5",
                "module": "amd"
            })).pipe(gulp.dest('./dist'))
    gulp.src(["./src/**/*.js","./src/**/*.json","./src/**/*.html","src/**/*.css"],{base:"src"})
        .pipe(gulp.dest("./dist"))
    // gulp.src(["./src/**/*.js","./src/**/*.json","./src/**/*.html"],{base:"src"})
    //     .pipe(gulp.dest("./dist"))
    gulp.src('./src/Vicroad/main.less',{base:"src"})
            .pipe(less())
            .pipe(gulp.dest("./dist/"))
})
