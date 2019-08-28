/**
 * Address page
 * */
(function (window, $) {
    'use strict';

    $(document).ready(function () {


        var AddressPage = (function ($) {
            function AddressPage() {
                return {
                    init: function () {

                        _address_gallery();
                        _address_page_function();
                        _address_backend();
                        _get_directions();

                    }
                }
            }

            function _get_directions() {
                // Get directions
                var address_map = $('#address_map_canvas');
                var get_directions_canvas = document.getElementById("get_directions_canvas");
                var center = new google.maps.LatLng({lat: 50.839383500000, lng: 4.349299900000}); // Belgium

                var origin = {lat: 50.839383500000, lng: 4.349299900000};
                if (address_map && address_map.length) {

                    var d_address = $(address_map).data("address");
                    var d_lat = parseFloat($(address_map).data("lat"));
                    var d_lng = parseFloat($(address_map).data('lon'));
                    var destination = {lat: d_lat, lng: d_lng};

                }
                var get_direction_modal = $('#get_directions_modal');

                $("a#get_directions_business").on('click', function (e) {
                    e.preventDefault();
                    get_direction_modal.modal('toggle');
                });

                get_direction_modal.on('shown.bs.modal', function (e) {
                    setTimeout(function () {

                        var directionsService = new google.maps.DirectionsService();
                        var directionsRenderer = new google.maps.DirectionsRenderer();


                        var directions_map_options = {
                            center: center,
                            zoom: 15,
                            zoomControl: true,
                            navigationControl: false,
                            scaleControl: false,
                            mapTypeControl: false,

                        };
                        var directions_map = new google.maps.Map(get_directions_canvas, directions_map_options);


                        let directions_marker = new google.maps.Marker({
                            position: center,
                            map: directions_map,
                            title: "Drag your location",
                            draggable: true,
                        });


                        var directionsDisplay = new google.maps.DirectionsRenderer({
                            draggable: false,
                            map: directions_map
                        });
                        _direction_service();

                        google.maps.event.addListener(directions_marker, 'dragend', function (event) {
                            origin = {lat: event.latLng.lat(), lng: event.latLng.lng()};
                            _direction_service();
                        });

                        function _direction_service() {
                            directionsService.route({
                                origin: origin,
                                destination: destination,
                                travelMode: 'DRIVING'
                            }, function (response, status) {
                                if (status === 'OK') {
                                    directionsDisplay.setDirections(response);
                                } else {
                                    window.alert('Directions request failed due to ' + status);
                                }
                            });
                        }

                        google.maps.event.addDomListenerOnce(directions_map, 'idle', function () {
                            google.maps.event.addDomListener(window, 'resize', function () {
                                directions_map.setCenter(center);
                            });
                        });


                    }, 300);
                });

            }

            function _address_backend() {
                // Address edit form
            @if($user && $user->isClient())
                $('#sel-main-address-category').select2({
                    ajax: {
                        url: '/api/v3/taxonomy/search?language={{ $language }}',
                        dataType: 'json',
                        processResults: function (data) {

                            if (data.status) {

                                //   console.log(data.payload);

                                return {
                                    results: data.payload
                                };

                            } else {
                                return {
                                    results: []
                                };
                            }
                        },
                        placeholder: 'Search for a category',
                        minimumInputLength: 3,
                    }
                });
            @endif
                $(".edit-address-drag-container").sortable();

                let drag_to_find_location = $('#drag_to_find_location');

                if (drag_to_find_location && drag_to_find_location.length) {
                    var map_container = document.getElementById("drag_to_find_location");
                    var center = new google.maps.LatLng(50.839383500000, 4.349299900000); // Belgium
                    var bounds = new google.maps.LatLngBounds();

                    var search_map_options = {
                        center: center,
                        zoom: 15,
                        zoomControl: true,
                        navigationControl: false,
                        scaleControl: false,
                        mapTypeControl: false,

                    };

                    let search_map = new google.maps.Map(map_container, search_map_options);

                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(50.839383500000, 4.349299900000),
                        map: search_map,
                        title: "Drag your location",
                        draggable: true,
                        icon: '/svg/drag-marker.svg'
                    });


                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        document.getElementById('v_lat').value = this.position.lat();
                        document.getElementById('v_lon').value = this.position.lng();
                    });


                    google.maps.event.addDomListenerOnce(search_map, 'idle', function () {
                        google.maps.event.addDomListener(window, 'resize', function () {
                            search_map.setCenter(center);
                        });
                    });
                }


            }

            function _address_gallery() {
                var all_gallery_img_urls = $("#gallery_thumbs a");
                var gallery_wrapper = "", address_gallery;

                if (all_gallery_img_urls.length > 9) {
                    $("a.thumb_image:eq(8)").addClass("last-item");
                }


                all_gallery_img_urls.on('click', function (e) {


                    gallery_wrapper = document.getElementById('business_gallery_wrapper');
                    gallery_wrapper.classList.add('active');
                    var img_index = parseInt($(this).data('index'));

                    if ($(window).width() > 767) {
                        address_gallery = new Swiper('.business_gallery', {
                            slidesPerView: 2,
                            fadeEffect: {
                                crossFade: true
                            },
                            lazy: true,
                            centeredSlides: true,
                            spaceBetween: 100,
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                            },
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }
                        });
                    } else {
                        address_gallery = new Swiper('.business_gallery', {
                            slidesPerView: 1,
                            fadeEffect: {
                                crossFade: true
                            },
                            lazy: true,
                            centeredSlides: true,
                            spaceBetween: 0,
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                            },
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },

                        });
                    }


                    address_gallery.slideTo(img_index);
                    e.preventDefault();
                });

                $(".close_gallery").on('click', function () {
                    gallery_wrapper.classList.remove('active');
                    address_gallery.destroy(true, false);
                });
            }

            function _address_page_function() {

                if ($(window).width() > 768) {
                    // $("#address_left_side").sticky({
                    //     context: '#address_body'
                    // });

                    // $("#action_button_list").sticky();
                }

                $("#address-nav li").on('click', function () {
                    $(this).addClass("wait active");
                });

                let address_map = $('#address_map_canvas');

                if (address_map && address_map.length) {

                    let address = $(address_map).data("address");
                    let lat = $(address_map).data("lat");
                    let lng = $(address_map).data('lon');

                    let address_center, mapOptions, address_maker;

                    if (lat && lng) {
                        setTimeout(function () {
                            address_map.show();

                            address_center = new google.maps.LatLng(lat, lng);
                            mapOptions = {
                                center: address_center,
                                zoom: 18,
                                zoomControl: false,
                                navigationControl: false,
                                scaleControl: true,
                                mapTypeControl: false
                            };

                            let address_google_map = new google.maps.Map(address_map[0], mapOptions);

                            address_maker = new google.maps.Marker({
                                position: address_center,
                                map: address_google_map,
                                //  icon: $(".comp_address_map").data("marker")
                            });
                        }, 500);
                    } else {

                        console.warn('WARNING: Geo location not found. Getting geo location from Google API');

                        $.ajax({
                            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + '&key=AIzaSyC-d6BEE-N_Ej0pPYkb-wnhmKfmPYK1GRo',
                            success: function (result) {
                                if (result.status === "OK") {
                                    address_center = new google.maps.LatLng(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
                                    mapOptions = {
                                        center: address_center,
                                        zoom: 18,
                                        zoomControl: false,
                                        navigationControl: false,
                                        scaleControl: true,
                                        mapTypeControl: false
                                    };

                                    let address_google_map = new google.maps.Map(address_map[0], mapOptions);

                                    address_maker = new google.maps.Marker({
                                        position: address_center,
                                        map: address_google_map,
                                    });

                                    //Search map resize function
                                    google.maps.event.addDomListenerOnce(address_google_map, 'idle', function () {
                                        google.maps.event.addDomListener(window, 'resize', function () {
                                            address_google_map.setCenter(address_center);
                                        });
                                    });

                                    google.maps.event.trigger(address_google_map, "resize");

                                } else {
                                    console.log("Google map - " + result.status);
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    }
                }


                $("#btn_tel").click(function () {
                    $(this).find("span").text($(this).data('number'));
                });


                if ($(".products-carousel").length) {
                    new Swiper('.products-carousel', {
                        slidesPerView: 3,
                        lazy: true,
                        centeredSlides: false,
                        spaceBetween: 5,
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });
                }

                var b_video = document.getElementById("business_video");

                if (b_video) {
                    b_video.play();
                }

                let ab = $(".address-branches");
                let h = ab.height();
                if (h > 110) {
                    ab.addClass("shrink");
                }

                $("#show_more_address").on('click', function () {
                    ab.toggleClass("shrink");
                });

                var overlay = $("#overlay");

                var place_post_form = $("#place_post_form");
                if (place_post_form) {
                    place_post_form.find(".textarea").focus(function () {
                        overlay.show();
                        $(this).addClass("on-edit");
                        place_post_form.addClass("expanded");
                    });

                    place_post_form.find(".close-status").on('click', function () {
                        overlay.hide();
                        place_post_form.find(".textarea").removeClass("on-edit");
                        place_post_form.removeClass("expanded show-image-upload");

                    });

                    $(".btn-post-image").click(function () {
                        place_post_form.find(".textarea").trigger('focus');
                        place_post_form.addClass("show-image-upload");
                    });
                }
            }


            return AddressPage;
        })(jQuery);

        new AddressPage().init();


    });
})(window, jQuery);