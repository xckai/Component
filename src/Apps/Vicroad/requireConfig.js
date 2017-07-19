 requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: './',
        paths:{
                leaflet:"../vendor/leaflet/dist/leaflet-src",
                underscore:"../vendor/underscore/underscore",
                jquery:"../vendor/jquery/dist/jquery",
                bootstrap:"../vendor/bootstrap/dist/js/bootstrap",
                d3:"../vendor/d3/d3",
                text : "../vendor/text/text",
                Backbone:"../vendor/backbone/backbone",
                timepicker:"../vendor/air-datepicker/dist/js/i18n/datepicker.en",
                timepicker_main:"../vendor/air-datepicker/dist/js/datepicker",
                "CustomizedChart/Vicroad/VicroadChart":'../dist/Apps/Vicroad/Chart/Vendor/VicroadChart',
                "moment":"../Vendor/moment/moment"
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
                timepicker:{
                       deps:["jquery","timepicker_main"]
                },
                timepicker_main:{
                        deps:["jquery"]
                }
        }     
});

