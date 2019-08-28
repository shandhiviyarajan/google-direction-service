/**
 * Teinturerie
 * @copyright  Teinturerie
 * @category   Javascript
 * @author - Shan Dhiviyarajan <prashasoft@gmail.com>
 * @date - March - 27 - 2016
 * MIT License
 * @license    http://www.opensource.org/licenses/mit-license.php  MIT License
 * @version - 1.0.0
 */

'use strict';

var l = 0;

var teinApp = teinApp || {};
var origin = "";
var destination = "";
var waypoints = [];

teinApp = (function ($) {
    // Constructor
    function teinApp() {
        return {
            init: function () {
                _init();
                _wow();
                // _smoothScroll();
                _darkHeader();
                _homeSlider();
                _darkMenu();
                _loadMap();
            }
        }
    }

    /**
     * init wow.js
     */
    function _wow() {
        $
        new WOW().init();
    }

    /**
     * init smooth scroll
     */

    function _smoothScroll() {
        $.srSmoothscroll({
            step: 200,
            speed: 300,
            ease: 'easeOutExpo'
        });
    }

    /**
     * init function
     * @private
     */
    function _init() {

        Pace.on('done', function () {
            $("#page").css({
                "opacity": 1
            });
            $("body").addClass("addAnimations");


            if(window.location.pathname=="/"){
                $("#map_route").trigger('click');
            }

            $('#map_route_modal').on('shown.bs.modal', function () {
                origin = {lat: 50.834406, lng: 4.356395};
                destination = {lat: 50.834606, lng: 4.3640935};
                waypoints = [{location: new google.maps.LatLng(50.832414, 4.359959)}];
                _loadMap();
            });


            $("button.direction_1").click(function () {
                origin = {lat: 50.834406, lng: 4.356395};
                destination = {lat: 50.834606, lng: 4.3640935};
                waypoints = [{location: new google.maps.LatLng(50.832414, 4.359959)}];
                _loadMap();
            });

            $("button.direction_2").click(function () {

                origin = {lat: 50.830956, lng: 4.360422};

                _loadMap();

            });


        });

        Pace.options = {
            elements: false,
            document: false,
            ajax: true,
            restartOnRequestAfter: false
        };

        $("#client-logos .col-md-12").owlCarousel({
            autoPlay: false,
            singleItem: false,
            items: 5
        });

        $(".home-blocks .row:nth-child(odd) a.btn").hover(function () {

            $(this).parent().parent().parent().addClass("move-left");

        }, function () {
            $(this).parent().parent().parent().removeClass("move-left");
        });

        $(".home-blocks .row:nth-child(even) a.btn").hover(function () {

            $(this).parent().parent().parent().addClass("move-right");

        }, function () {
            $(this).parent().parent().parent().removeClass("move-right");
        });

        $("#mobile_menu").click(function () {
            $("header").toggleClass("expanded");
        });


    }

    /**
     * home sliders
     */

    function _homeSlider() {
        $("#home-slider").owlCarousel({
            responsive: true,
            singleItem: true,
            autoPlay: 6000
        });
    }

    /**
     * dark header on scroll
     */
    function _darkHeader() {

        if ($(this).scrollTop() > 100) {
            $("header").addClass("dark");

        } else {
            $("header").removeClass("dark");
        }
        $(document).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $("header").addClass("dark");

            } else {
                $("header").removeClass("dark");
            }
        });
    }

    /**
     * contact us
     */
    function _darkMenu() {
        if ($("#contact").length > 0) {
            $("header").addClass("dark2");
            var ch = $(window).height();
            $("#contact").height(ch);

            $("#map_wrapper").css({
                "padding-top": (ch - 460) / 2
            });

            $(window).resize(function () {
                ch = $(window).height();
                $("#contact").height(ch);

                $("#map_wrapper").css({
                    "padding-top": (ch - 400) / 2
                });

            });
        }
    }

    /**
     * Google map
     */
    function _loadMap() {


        var center = new google.maps.LatLng(50.834606, 4.3640935);
        var mapOptions = {
            center: center,
            zoom: 15,
            zoomControl: true,
            navigationControl: false,
            scaleControl: true,
            scrollwheel: false,
            mapTypeControl: true
        };
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;


        // var mapMarker = "/pressing/wp-content/themes/pressing/assets/images/mapMarker.png";
        var infowindow = new google.maps.InfoWindow({
            content: '<div class="results-info-window"><a href=""><h4>  Teintutrerie-de-senne </h4><p>Rue de l\'Arbre BÃ©nit 10,1050 Ixelles<br>02 512 25 59<br>de 7h30 jusquâ€™a 18h00</p></a></div>'
        });

        if ($("#map-canvas").length > 0) {
            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            // directionsDisplay.setMap(map);

            var directionsDisplay = new google.maps.DirectionsRenderer({
                draggable: true,
                map: map
            });


            // var marker = new google.maps.Marker({
            //     position: center,
            //     map: map,
            //     //  icon: mapMarker,
            //     animation: google.maps.Animation.DROP,
            //     clickable: true
            // });


            // google.maps.event.addListener(marker, 'click', function () {
            //     infowindow.open(map, marker);
            // });
            google.maps.event.addDomListenerOnce(map, 'idle', function () {
                google.maps.event.addDomListener(window, 'resize', function () {
                    map.setCenter(center);
                });
            });
            // infowindow.open(map, marker);

            directionsService.route({
                origin: origin,
                destination: destination,
                waypoints: waypoints,

                //50.8330986,4.3569897
                travelMode: "DRIVING",
                avoidTolls: true
            }, function (response, s) {
                console.log(response);

                directionsDisplay.setDirections(response);
            });


        }

    }

    return teinApp;


})(jQuery);


var ebApp = new teinApp();
ebApp.init();

