//setting the flag of mouse wheel
var wheel_active = true;
//setting projection extent
var projection = ol.proj.get('EPSG:4674');
projection.setExtent([-122.18, -59.86, -25.28, 32.72]);

//creating the mapquest layer of open street map
var source1 = new ol.source.MapQuest({layer: 'osm'});
var osmlayer = new ol.layer.Tile({source: source1});

//creating the tiled WMS layer named "C02_capitais_por_populacao_2010"
var sourceCapitaisPopulacao = new ol.source.TileWMS({
    url: 'http://www.geoservicos.ibge.gov.br/geoserver/CGEO/wms',
    params: {'LAYERS': 'CGEO:C02_capitais_por_populacao_2010'},
    // params: {'LAYERS': 'CGEO:Aeroporto_com_voos_regulares_(passageiros_ano)'},
    serverType: 'geoserver'
});
var capitaisPopulacaoLayer = new ol.layer.Tile({
    extent: ol.proj.transform([-78.815503422628, -35.0527569577518, -34.8578824071627, 0.87876502861196], 'EPSG:4674', 'EPSG:3857'),
    source: sourceCapitaisPopulacao
});

//creating the tiled WMS layer named "C05_imigrantes_estrangeiro_2010"
var sourceImigrantesEstrangeiro = new ol.source.TileWMS({
    url: 'http://www.geoservicos.ibge.gov.br/geoserver/CGEO/wms',
    params: {'LAYERS': 'CGEO:C05_imigrantes_estrangeiro_2010'},
    serverType: 'geoserver',
});

var imigrantesEstrangeirosLayer = new ol.layer.Tile({
    extent: ol.proj.transform([-78.0018526809999, -34.481679051, -32.4002203079999, 8.00069620500005], 'EPSG:4674', 'EPSG:3857'),
    source: sourceImigrantesEstrangeiro
});


// var iconFeature = new ol.Feature({
//   geometry: new ol.geom.Point(ol.proj.transform([-48, -10], 'EPSG:4674', 'EPSG:3857')),
//   name: 'Null Island',
//   population: 4000,
//   rainfall: 500
// });

// var iconFeature2 = new ol.Feature({
//   // geometry: new ol.geom.Point([10,10]),
//   geometry: new ol.geom.Point(ol.proj.transform([-37, -10], 'EPSG:4674', 'EPSG:3857')),
//   name: 'Null Island',
//   population: 4000,
//   rainfall: 500
// });

// var iconStyle = new ol.style.Style({
//   image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
//     // size : [250,250],
//     anchor: [0.5, 46],
//     anchorXUnits: 'fraction',
//     anchorYUnits: 'pixels',
//     opacity: 0.9,
//     src: 'assets/img/icon2.fw.png'
//   }))
// });

// iconFeature.setStyle(iconStyle);
// iconFeature2.setStyle(iconStyle);

// var vectorSource = new ol.source.Vector({
//   features: [iconFeature, iconFeature2]
// });

// var vector = new ol.layer.Vector({
//   source: vectorSource
// });



//creating the custom layer named "Aeroportos"
var sourceAeroportos = new ol.source.TileWMS({
    url: 'http://11d.fct.unesp.br:8080/geoserver261/renan/wms',
    params: {'LAYERS': 'renan:aeroportos'},
    serverType: 'geoserver',
});

var aeroportosLayer = new ol.layer.Tile({
    extent: ol.proj.transform([-72,7440514876942, -30,6863267425845, -35,219815136165, 2,39955907274236], 'EPSG:4674', 'EPSG:3857'),
    source: sourceAeroportos
});

function init(){

    //close popup
    // $("#popup-closer").click(function(){
    //     $("#popup").hide();
    // })

    //layerswitcher control
    $("#layer-switcher-toggle").click(function(){
        if($(".layer-switcher").hasClass("hidden")){
            $(".layer-switcher").removeClass("hidden");
            $(".layer-switcher").addClass("open");
        }else if($(".layer-switcher").hasClass("open")){
            $(".layer-switcher").removeClass("open");
            $(".layer-switcher").addClass("hidden");
        }
    });

    //scrollTo function in menu
    $("#menu a").click(function() {
        var scrollTo = "";
        if(this.id == "#map-menu"){
            scrollTo = "#map";
        }else if(this.id == "#application-menu"){
            scrollTo = "#application";
        }else if(this.id == "#author-menu"){
            scrollTo = "#author";
        }
        $('html, body').animate({
            scrollTop: $(scrollTo).offset().top
        }, 1000);
    });

    //popup close click event
    $("#close-feature-info").click(function(){
        $("#feature-info").css("display", "none");
    });

    //creating openlayer view object to set in the map
    var view = new ol.View({
        center: ol.proj.transform([-51, -15], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
    });

    //creating the map instance
    var map = new ol.Map({
        target: 'map',
        // interactions: ol.interaction.defaults({mouseWheelZoom:false}),
        controls: ol.control.defaults().extend([
            new ol.control.ScaleLine({
                units: 'metric'
            })
        ]),
        view: view,
    });

    //openlayer singleclick event to get feature properties
    map.on('singleclick', function(evt){
        // console.log(evt);
        // var feature = map.forEachFeatureAtPixel(evt.pixel,
        //     function(feature, vector) {
        //     return feature;
        // });
        // // console.log(feature);
        // //click for airports features

        // if (feature) {
        //     var geometry = feature.getGeometry();
        //     var coord = geometry.getCoordinates();
        //     popup.setPosition(coord);
        //     $(element).show();
        // }else{

            document.getElementById('info').innerHTML = '';
            document.getElementById('info2').innerHTML = '';
            // document.getElementById('info3').innerHTML = '';
            var viewResolution = /** @type {number} */(view.getResolution());

            //click event for layer "capitaisPopulacao"
            var url = sourceCapitaisPopulacao.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {'INFO_FORMAT':'text/html'});
            if(url){
                document.getElementById('info').innerHTML = '<iframe id="feature_info" width="340px" height="100px" src="' +url+ '"></iframe>';
                $("#feature-info").css("display", "block");
            }
            
            //click event for layer "ImigrantesEstrangeiro"
            var url2 = sourceImigrantesEstrangeiro.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {'INFO_FORMAT':'text/html'});
            if(url2){
                document.getElementById('info2').innerHTML = '<iframe id="feature_info" width="340px" height="100px" src="' +url2+ '"></iframe>';
                $("#feature-info").css("display", "block");
            }

            //click event for layer "Aeroportos"
            // var url2 = sourceAeroportos.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {'INFO_FORMAT':'text/html'});
            // if(url2){
            //  document.getElementById('info3').innerHTML = '<iframe id="feature_info" width="340px" height="100px" src="' +url3+ '"></iframe>';
            // }

        // }

    });

    //adding layer to the map
    map.addLayer(osmlayer);
    map.addLayer(imigrantesEstrangeirosLayer);
    map.addLayer(capitaisPopulacaoLayer);
    map.addLayer(aeroportosLayer);
    // map.addLayer(vector);


    var element = document.getElementById('popup');
    var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(popup);

}

//layer switcher
function layerVis(value){
    if(value == "osmlayer"){
        osmlayer.setVisible(document.getElementById("1").checked);
    }else if(value == "capitaisPopulacaoLayer"){
        capitaisPopulacaoLayer.setVisible(document.getElementById("2").checked);
    }else if(value == "imigrantesEstrangeirosLayer"){
        imigrantesEstrangeirosLayer.setVisible(document.getElementById("3").checked);
    }else if(value == "aeroportosLayer"){
        aeroportosLayer.setVisible(document.getElementById("3").checked);
    }
}