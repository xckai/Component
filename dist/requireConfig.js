 requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: './',
        paths:{
                leaflet:"../lib/leaflet/dist/leaflet-src",
                underscore:"../lib/underscore/underscore",
                jquery:"../lib/jquery/dist/jquery",
                bootstrap:"../lib/bootstrap/dist/js/bootstrap",
                d3:"../lib/d3/d3",
                text : "../lib/text/text",
                Backbone:"../lib/backbone/backbone",
                timepicker:"../lib/air-datepicker/dist/js/i18n/datepicker.en",
                timepicker_main:"../lib/air-datepicker/dist/js/datepicker"
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

