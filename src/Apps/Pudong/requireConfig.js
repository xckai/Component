var nodePath="./node_modules/" 
requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: './',
        paths:{
                leaflet:nodePath+"leaflet/dist/leaflet-src",
                jquery:nodePath+"jquery/dist/jquery",
                bootstrap:nodePath+"bootstrap/dist/js/bootstrap",
                d3:nodePath+"d3/build/d3",
                text : nodePath+"text/text",
                backbone:nodePath+"backbone/backbone",
                underscore:nodePath+"underscore/underscore",
                timepicker:nodePath+"air-datepicker/dist/js/i18n/datepicker.en",
                timepicker_main:nodePath+"air-datepicker/dist/js/datepicker",
                "CustomizedChart/Vicroad/VicroadChart":'./dist/Apps/Vicroad/Vendor/VicroadChart',
                "moment":nodePath+"moment/moment",
                "lodash":nodePath+"lodash/lodash",
                mustache:nodePath+"mustache/mustache"
        },
        shim:{
                leaflet:{
                        exports:"L"
                },
                "underscore": {
                        exports: "_"
                },
                bootstrap:{
                        deps:["jquery"]
                },
                lodash:{
                        exports:"_"
                },
                timepicker:{
                       deps:["jquery","timepicker_main"]
                },
                timepicker_main:{
                        deps:["jquery"]
                }
        }     
});

