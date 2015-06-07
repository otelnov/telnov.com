$(document).ready(function () {

  /* affix the navbar after scroll below header */
  //$('#nav').affix({
  //  offset: {
  //    top: $('header').height() - $('#nav').height()
  //  }
  //});

  /* highlight the top nav as scrolling occurs */
  //$('body').scrollspy({target: '#nav'});

  /* smooth scrolling for scroll to top */
  $(document).on('click', '.scroll-top', function () {
    $('body,html').animate({scrollTop: 0}, 1000);
  });

  /* smooth scrolling for nav sections */
  $(document).on('click', '#nav .navbar-nav li>a', function () {
    var link = $(this).attr('href');
    var posi = $(link).offset().top;
    $('body,html').animate({scrollTop: posi}, 500);
  });

  google.maps.visualRefresh = true;

  var map;

  function initialize() {
    var geocoder = new google.maps.Geocoder();
    var address = $('#map-input').text();
    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    if (geocoder) {
      geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow({
              content: address,
              map: map,
              position: results[0].geometry.location
            });

            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: address
            });

          } else {
            //alert('No results found');
          }
        }
      });
    }
  }

  google.maps.event.addDomListener(window, 'load', initialize);

});
