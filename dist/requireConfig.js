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
                Backbone:"../lib/backbone/backbone"
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
                }
        }     
});

