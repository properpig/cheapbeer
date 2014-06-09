
  var waypoints = new Array();
  var routeDisplayed = false;

    function addToRoute(lat, lon) {
        console.log(lat,lon);
        waypoints.push({
          location: new google.maps.LatLng(lat, lon),
          stopover:true}
        );
        humane.log("Stop added", function(){ document.body.style.backgroundColor="#a66000" })
        $(window).trigger( "triggerCalcRoute" );
    }


(function ($) {
	var settings;
	var element;
	var map;
	var markers = new Array();
	var markerCluster;
	var clustersOnMap = new Array();
	var clusterListener;
	var styles = undefined;

	// Global DATA
  var locations = new Array();
  var contents = new Array();
  var types = new Array();
  var images = new Array();

  // Route data
  // var waypoints = new Array();

  var rendererOptions = {
	  draggable: true
	};

	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	var directionsService = new google.maps.DirectionsService();

	var methods = {
		init: function (options) {
			element = $(this);

			var defaults = $.extend({
				enableGeolocation: false,
				disableClickEvent: false,
				openAllInfoboxes: false,
				pixelOffsetX     : -100,
				pixelOffsetY     : -255
			});

			if (options.styles !== undefined) {
				styles = options.styles;
			}

			settings = $.extend({}, defaults, options);

			google.maps.visualRefresh = true;
			google.maps.event.addDomListener(window, 'load', loadMap);

			$(window).on('triggerCalcRoute', calcRoute);

			// google.maps.event.addDomListener(window, 'triggerCalcRoute', calcRoute);


    /***********************************************************
     * CUSTOM ICONS
     ***********************************************************/
     $('#cosplay,#bollywood,#ktv,#toilets,#atm,#minimart,#police,#jerkboss,#exlovers').click(function(e) {
        var typeid = $(this).attr('id');
        console.log(typeid);
        // toggle it off
        if ($(this).hasClass('on')) {

            // code to remove markers

          $(this).removeClass('on');
          $(this).addClass('off');
          // have to render layers again
        } else {
          // toggie it on
          // code to add the markers

          $(this).removeClass('off');
          $(this).addClass('on');
        }

        // code to load icons here
        	$.ajax({
						type   : 'GET',
						url    : 'assets/js/' + typeid + '.json',
						success: function (data) {
							// element.aviators_map('removeMarkers');

							// clear old data
							// locations = new Array();
							// types = new Array();
							// contents = new Array();
							// images = new Array();

							$.each(data, function (index) {
								var object = data[index];
								// console.log(object.lat);

								if (typeof object.name === "undefined") {
									object.name = "";
								}

								if (typeof object.address === "undefined") {
									object.address = "";
								}

								if (typeof object.price === "undefined") {
									object.price = "";
								}

								locations.push(Array(object.lat, object.lon));
								if (object.jsonType === 'beer') {
							  	contents.push('<div class="infobox"><div class="infobox-header"><h3 class="infobox-title"><a href="#">' + object.name + '</a></h3><h4 class="infobox-subtitle">' + object.address + '</h4></div><div class="infobox-picture"><a onclick="addToRoute(' + object.lat + ',' + object.lon + ');"><img src="' + object.url + ' " alt=""></a><div class="infobox-price">$' + object.price + '</div></div></div>');
							  } else {
							  	contents.push('<div class="infobox"><div class="infobox-header"><h3 class="infobox-title"><a href="#">' + object.name + '</a></h3><h4 class="infobox-subtitle">' + object.address + '</h4></div><div class="infobox-picture"><a><img src="' + object.url + ' " alt=""></a><div class="infobox-price">$' + object.price + '</div></div></div>');
							  }
							  images.push("assets/img/icons/" + typeid + ".png");
							});

							element.aviators_map('addMarkers', {
								locations: locations,
								types    : types,
								contents : contents,
								images   : images
							});


						}
					});

     });

			// if (settings.filterForm && $(settings.filterForm).length !== 0) {
			if (true) {
				$('#filterformsubmit').click(function (e) {
					e.preventDefault();
					// console.log("test");

					var form = $(this);
					var action = $(this).attr('action');


					$.ajax({
						type   : 'GET',
						url    : 'assets/js/allbeer.json',
						data   : form.serialize(),
						success: function (data) {
							// element.aviators_map('removeMarkers');

							// clear old data
							// locations = new Array();
							// types = new Array();
							// contents = new Array();
							// images = new Array();

							var bounds1 = new google.maps.LatLngBounds();

							$.each(data, function (index) {
								var object = data[index];
								// console.log(object.lat);
								locations.push(Array(object.lat, object.lon));
								if (object.jsonType === 'beer') {
							  	contents.push('<div class="infobox"><div class="infobox-header"><h3 class="infobox-title"><a href="#">' + object.name + '</a></h3><h4 class="infobox-subtitle">' + object.address + '</h4></div><div class="infobox-picture"><a onclick="addToRoute(' + object.lat + ',' + object.lon + ');"><img src="' + object.url + ' " alt=""></a><div class="infobox-price">$' + object.price + '</div></div></div>');
							  } else {
							  	contents.push('<div class="infobox"><div class="infobox-header"><h3 class="infobox-title"><a href="#">' + object.name + '</a></h3><h4 class="infobox-subtitle">' + object.address + '</h4></div><div class="infobox-picture"><a><img src="' + object.url + ' " alt=""></a><div class="infobox-price">$' + object.price + '</div></div></div>');
							  }
							  var number = 0;
							  number = (object.price/1).toFixed();

							  if (number >= 10) {
							  	number = 10;
							  }

							  images.push("assets/img/icons/beer" + number + ".png");
							  bounds1.extend(new google.maps.LatLng(object.lat, object.lon));
							});

							element.aviators_map('addMarkers', {
								locations: locations,
								types    : types,
								contents : contents,
								images   : images
							});

							map.fitBounds(bounds1);


						}
					});



				});
			}


			if (options.callback) {
				options.callback();
			}
			return $(this);
		},

		removeMarkers: function () {
			for (i = 0; i < markers.length; i++) {
				markers[i].infobox.close();
				markers[i].marker.close();
				markers[i].setMap(null);
			}

			markerCluster.clearMarkers();

			$.each(clustersOnMap, function (index, cluster) {
				cluster.cluster.close();
			});

			clusterListener.remove();
		},

		addMarkers: function (options) {
			markers = new Array();
			settings.locations = options.locations;
			settings.contents = options.contents;
			settings.types = options.types;
			settings.images = options.images;

			renderElements();
		},


	}

	$.fn.aviators_map = function (method) {
		// Method calling logic
		if (methods[method]) {
			return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on Map');
		}
	};

    function calcRoute() {


      console.log(waypoints);
			if (waypoints.length < 2) {
				return;
			}
			if (waypoints.length >= 3) {
				directionsDisplay.setOptions({preserveViewport: true});
			}
			waypts = new Array();

			for(var i=0; i<waypoints.length; i++) {
				console.log(waypoints[i].location.A);
				waypts.push(new google.maps.LatLng(waypoints[i].location.k, waypoints[i].location.A));
			}

      var request = {
        origin: waypts[0],
        destination: waypts[1],
        waypoints:waypoints.slice(2,waypoints.length),
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

      // prevent zooming next time
    }

	function loadMap() {
		var mapOptions = {
			zoom              : settings.zoom,
			mapTypeId         : google.maps.MapTypeId.ROADMAP,
			scrollwheel       : true,
			draggable         : true,
			mapTypeControl    : false,
			panControl        : false,
			zoomControl       : true,
			zoomControlOptions: {
				style   : google.maps.ZoomControlStyle.SMALL,
				position: google.maps.ControlPosition.LEFT_BOTTOM
			}
		};

		if (settings.enableGeolocation) {
			if (navigator.geolocation) {
				browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(function (position) {
					initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					map.setCenter(initialLocation);
					map.setZoom(12);
				}, function () {
					mapOptions.center = new google.maps.LatLng(settings.center.latitude, settings.center.longitude);
				});
			} else {
				browserSupportFlag = false;
				mapOptions.center = new google.maps.LatLng(settings.center.latitude, settings.center.longitude);
			}
		} else {
			mapOptions.center = new google.maps.LatLng(settings.center.latitude, settings.center.longitude);
		}

		if (styles != undefined) {
			mapOptions['mapTypeControlOptions'] = {
	            mapTypeIds: ['Styled']
	        };
	        mapOptions['mapTypeId'] = 'Styled';
		}

		map = new google.maps.Map($(element)[0], mapOptions);

		directionsDisplay.setMap(map);

		// google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
	 //    computeTotalDistance(directionsDisplay.getDirections());
	 //  });

		if (settings.mapMoveCenter) {
			map.panBy(settings.mapMoveCenter.x, settings.mapMoveCenter.y)
		}

    	if (styles !== undefined) {
    		var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
    		map.mapTypes.set('Styled', styledMapType);
    	}

    		// add the search bar
        var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

        var input1 = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input1'));

        var submitbutton = /** @type {HTMLInputElement} */(
        document.getElementById('filterformsubmit'));

        var backgroundhack = /** @type {HTMLInputElement} */(
        document.getElementById('backgroundhack'));

        var headerhack = /** @type {HTMLInputElement} */(
        document.getElementById('headerhack'));

          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(headerhack);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(input);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(input1);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(submitbutton);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(backgroundhack);


          var autocomplete = new google.maps.places.Autocomplete(input);
          var autocomplete1 = new google.maps.places.Autocomplete(input1);
          autocomplete.bindTo('bounds', map);
          autocomplete1.bindTo('bounds', map);

          var infowindow = new google.maps.InfoWindow();

          var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29),
            animation: google.maps.Animation.DROP
          });

          google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(true);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
              return;
            }

		        waypoints.push({
		          location: new google.maps.LatLng(place.geometry.location.k, place.geometry.location.A),
		          stopover:true}
		        );

		        console.log(waypoints);
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setIcon(/** @type {google.maps.Icon} */({
              url: place.icon,
              size: new google.maps.Size(140, 140),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(71, 71)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);

            console.log(place.geometry.location);
          });

					google.maps.event.addListener(autocomplete1, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(true);
            var place = autocomplete1.getPlace();
            if (!place.geometry) {
              return;
            }

            waypoints.push({
		          location: new google.maps.LatLng(place.geometry.location.k, place.geometry.location.A),
		          stopover:true}
		        );

		        console.log(waypoints);

            // If the place has a geometry, then present it on a map.
            // if (place.geometry.viewport) {
            //   map.fitBounds(place.geometry.viewport);
            // } else {
            //   map.setCenter(place.geometry.location);
            //   map.setZoom(17);  // Why 17? Because it looks good.
            // }
            marker.setIcon(/** @type {google.maps.Icon} */({
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);


            var address = '';
            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);

            $(window).trigger( "triggerCalcRoute" );

						routeDisplayed = true;

          });

		window.map = map;

		var dragFlag = false;
		var start = 0, end = 0;

		function thisTouchStart(e) {
			dragFlag = true;
			start = e.touches[0].pageY;
		}

		function thisTouchEnd() {
			dragFlag = false;
		}

		function thisTouchMove(e) {
			if (!dragFlag) {
				return
			}

			end = e.touches[0].pageY;
			window.scrollBy(0, ( start - end ));
		}
		var el = $(element.selector)[0];

		if (el.addEventListener) {
			el.addEventListener('touchstart', thisTouchStart, true);
			el.addEventListener('touchend', thisTouchEnd, true);
			el.addEventListener('touchmove', thisTouchMove, true);
		} else if (el.attachEvent){
			el.attachEvent('touchstart', thisTouchStart);
			el.attachEvent('touchend', thisTouchEnd);
			el.attachEvent('touchmove', thisTouchMove);
		}

		if (!settings.disableClickEvent) {
			google.maps.event.addListener(map, 'zoom_changed', function () {
				$.each(markers, function (index, marker) {
					marker.infobox.close();
					marker.infobox.isOpen = false;
				});
			});
		}

		renderElements();

		$('.infobox .close').click(function () {
			$.each(markers, function (index, marker) {
				marker.infobox.close();
				marker.infobox.isOpen = false;
			});
		});
	}

	function isClusterOnMap(clustersOnMap, cluster) {
		if (cluster === undefined) {
			return false;
		}

		if (clustersOnMap.length == 0) {
			return false;
		}

		var val = false;

		$.each(clustersOnMap, function (index, cluster_on_map) {
			if (cluster_on_map.getCenter() == cluster.getCenter()) {
				val = cluster_on_map;
			}
		});

		return val;
	}

	function addClusterOnMap(cluster) {
		// Hide all cluster's markers
		$.each(cluster.getMarkers(), (function () {
			if (this.marker.isHidden == false) {
				this.marker.isHidden = true;
				this.marker.close();
			}
		}));

		var newCluster = new InfoBox({
			markers               : cluster.getMarkers(),
			draggable             : true,
			content               : '<div></div>',
			disableAutoPan        : true,
			pixelOffset           : new google.maps.Size(-21, -21),
			position              : cluster.getCenter(),
			closeBoxURL           : "",
			isHidden              : false,
			enableEventPropagation: true,
			pane                  : "mapPane"
		});

		cluster.cluster = newCluster;

		cluster.markers = cluster.getMarkers();
		cluster.cluster.open(map, cluster.marker);
		clustersOnMap.push(cluster);
	}

	function renderElements() {
			$.each(settings.locations, function (index, location) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(location[0], location[1]),
				map     : map,
				icon    : settings.transparentMarkerImage,
				animation: google.maps.Animation.DROP
			});

			marker.infobox = new InfoBox({
				content               : settings.contents[index],
				disableAutoPan        : false,
				maxWidth              : 0,
				pixelOffset           : new google.maps.Size(settings.pixelOffsetX, settings.pixelOffsetY),
				zIndex                : null,
				closeBoxURL           : "",
				infoBoxClearance      : new google.maps.Size(1, 1),
				position              : new google.maps.LatLng(location[0], location[1]),
				isHidden              : false,
				pane                  : "floatPane",
				enableEventPropagation: false
			});
			marker.infobox.isOpen = false;

			marker.marker = new InfoBox({
				draggable             : true,
				// content               : '<div class="marker ' + settings.types[index] + '"><div class="marker-inner">' + settings.images[index] + '</div></div>',
				content               : '<img class="marker-inner" src="' + settings.images[index] + '"/>',
				disableAutoPan        : true,
				pixelOffset           : new google.maps.Size(-24, -50),
				position              : new google.maps.LatLng(location[0], location[1]),
				closeBoxURL           : "",
				isHidden              : false,
				pane                  : "floatPane",
				enableEventPropagation: true
			});

			marker.marker.isHidden = false;
			marker.marker.open(map, marker);
			markers.push(marker);

			if (settings.openAllInfoboxes) {
				marker.infobox.open(map, marker);
				marker.infobox.isOpen = true;
			}

			if (!settings.disableClickEvent) {
				google.maps.event.addListener(marker, 'click', function (e) {
					var curMarker = this;

					$.each(markers, function (index, marker) {
						// if marker is not the clicked marker, close the marker
						if (marker !== curMarker) {
							marker.infobox.close();
							marker.infobox.isOpen = false;
						}
					});

					if (curMarker.infobox.isOpen === false) {
						curMarker.infobox.open(map, this);
						curMarker.infobox.isOpen = true;
						map.setCenterWithOffset(curMarker.getPosition(), 100, -120);
					} else {
						curMarker.infobox.close();
						curMarker.infobox.isOpen = false;
					}
				});
			}

		});



		markerCluster = new MarkerClusterer(map, markers, {
            gridSize: 10,
			styles: [
				{
					height   : 53,
					url      : settings.transparentClusterImage,
					width    : 53,
					textColor: 'transparent'
				}
			]
		});

		clustersOnMap = new Array();

		clusterListener = google.maps.event.addListener(markerCluster, 'clusteringend', function (clusterer) {
			var availableClusters = clusterer.getClusters();
			var activeClusters = new Array();

			$.each(availableClusters, function (index, cluster) {
				if (cluster.getMarkers().length > 1) {
					activeClusters.push(cluster);
				}
			});

			$.each(availableClusters, function (index, cluster) {
				if (cluster.getMarkers().length > 1) {
					var val = isClusterOnMap(clustersOnMap, cluster);

					if (val !== false) {
						val.cluster.setContent('<div></div>');
						val.markers = cluster.getMarkers();
						$.each(cluster.getMarkers(), (function (index, marker) {
							if (marker.marker.isHidden == false) {
								marker.marker.isHidden = true;
								marker.marker.close();
							}
						}));
					} else {
						addClusterOnMap(cluster);
					}
				} else {
					// Show all markers without the cluster
					$.each(cluster.getMarkers(), function (index, marker) {
						if (marker.marker.isHidden == true) {
							marker.marker.open(map, this);
							marker.marker.isHidden = false;
						}
					});

					// Remove old cluster
					$.each(clustersOnMap, function (index, cluster_on_map) {
						if (cluster !== undefined && cluster_on_map !== undefined) {
							if (cluster_on_map.getCenter() == cluster.getCenter()) {
								// Show all cluster's markers/
								cluster_on_map.cluster.close();
								clustersOnMap.splice(index, 1);
							}
						}
					});
				}
			});

			var newClustersOnMap = new Array();

			$.each(clustersOnMap, function (index, clusterOnMap) {
				var remove = true;

				$.each(availableClusters, function (index2, availableCluster) {
					if (availableCluster.getCenter() == clusterOnMap.getCenter()) {
						remove = false;
					}
				});

				if (!remove) {
					newClustersOnMap.push(clusterOnMap);
				} else {
					clusterOnMap.cluster.close();
				}
			});

			clustersOnMap = newClustersOnMap;
		});
	}
})(jQuery);