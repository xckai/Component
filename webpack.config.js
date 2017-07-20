const path =require("path")

module.exports = {
    //插件项
    //页面入口文件配置
    entry: {
        vicroad : './dist/Apps/Vicroad/main.js'
    },
    //入口文件输出配置
    output: {
        path:path.resolve("./release"),
        filename: '[name]/main.js'
    },
    module: {
        //加载器配置

    },
    //其它解决方案配置
    resolve: { //绝对路径
        alias: {
                leaflet:path.resolve(__dirname, 'vendor/leaflet/dist/leaflet-src'),
                underscore:path.resolve(__dirname, 'vendor/underscore/underscore'),
                jquery:path.resolve(__dirname, 'vendor/jquery/dist/jquery'),
                Backbone:path.resolve(__dirname, 'vendor/backbone/backbone'),
                d3:path.resolve(__dirname, 'vendor/d3/d3'),
                timepicker:path.resolve(__dirname, 'vendor/air-datepicker/dist/js/i18n/datepicker.en'),
                timepicker_main:path.resolve(__dirname, 'vendor/air-datepicker/dist/js/datepicker'),
                "CustomizedChart/Vicroad/VicroadChart":path.resolve(__dirname, 'dist/Apps/Vicroad/Chart/Vendor/VicroadChart'),
                moment:path.resolve(__dirname, 'vendor/moment/moment'),
                
        }
    },
    resolveLoader: {
        alias: {
            // Support for require('text!file.json').
           text:path.resolve(__dirname,"node_modules/text-loader/index")
        }
    }
};