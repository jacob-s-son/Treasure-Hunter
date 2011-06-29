	var rectangles = new Array();
	var rectangle_bounds = new Array();
	
	function printObject(o) {
	  var out = '';
	  for (var p in o) {
	    out += p + ': ' + o[p] + '\n';
	  }
	  alert(out);
	}
	
	function find_rectangle(latlng){
		for (var i = 0; i < 256; i++) {
			rec = rectangles[i];

			if (rec.getBounds().contains(latlng)) {
				return rec;
			}
		}
	}
	
	function set_current(id)
	{
		obj = $("#" + id);
		current = $("div#breadcrumb_container li.current").children().first();
		
		alert(current.attr("id"));
		if (current.attr("id") == id) { return }
		
		alert(id);
		new_step = parseInt(id.match(/_([0-9])/)[1]);
		obj.parent().addClass("current");
		
		alert(new_step);
		for (i = new_step + 1; i <= 3; i++) {
			$("#step_" + i).parent().removeClass();
			$("#step_" + i).parent().addClass("hidden");
		}
	}
	
	function get_breadcrumb_action(rec_bounds, step) {
		return "javascript:initialize(" + rec_bounds.getSouthWest().lat() + "," +  rec_bounds.getSouthWest().lng() + "," + 
		rec_bounds.getNorthEast().lat() + "," + rec_bounds.getNorthEast().lng() + "); set_current('step_" + step +"');";
	}
	
	function update_breadcrumbs(rec_bounds) {
		farthest_step = $("div#breadcrumb_container li.current").children().first();
		farthest_step_nr = parseInt(farthest_step.attr("id").match(/_([1-3])/)[1]);
		
		new_farthest_step = $("#step_" + ( farthest_step_nr + 1) );

		new_farthest_step.parent().removeClass();
		new_farthest_step.parent().addClass("current");
		farthest_step.parent().removeClass();
		
		new_farthest_step.attr("href", get_breadcrumb_action(rec_bounds, farthest_step_nr + 1));
	}
	
	function show_coordinates(rectangle) {
//		var rectangle = rec;
		alert("SW = " + rectangle.getBounds().getSouthWest().lat() + ", " + rectangle.getBounds().getSouthWest().lng() + " ; NE = " + rectangle.getBounds().getNorthEast().lat() + ", " + rectangle.getBounds().getNorthEast().lng());
	}

  function initialize() {
    var myOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl : false,
			rotateControl : false,
			panControl : false,
			streetViewControl : false,
			overviewMapControl : false,
			scrollwheel : false,
			scaleControl : false,
			disableDoubleClickZoom : true,
			draggable : false
    }
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		if (arguments.length == 0) {
			var default_latlngs = new Array (new google.maps.LatLng(56.96887,24.08205), new google.maps.LatLng(56.92393,24.16909));
		}
		else {
			var default_latlngs = new Array ( new google.maps.LatLng( arguments[0], arguments[1] ) , new google.maps.LatLng( arguments[2], arguments[3] ) );
		}
		
		//  Create a new viewpoint bound
		var bounds = new google.maps.LatLngBounds ();
		//  Go through each...
		for (var i = 0, LtLgLen = default_latlngs.length; i < LtLgLen; i++) {
		  //  And increase the bounds to take this point
		  bounds.extend (default_latlngs[i]);
		}
		//  Fit these bounds to the map
		map.fitBounds (bounds);
		
		google.maps.event.addListener(map, "mousemove", function(event){
			var currentProjection = map.getProjection();
//			var xy = currentProjection.fromLatLngToPoint(latlng, map.getZoom());
			$("#log").html("Zoom:" + map.getZoom() + " WGS84:(" + event.latLng.lat().toFixed(5) + "," + event.latLng.lng().toFixed(5) );
			previousPos = event.latLng;
		});//onmouseover
		
		
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var map_sw = map.getBounds().getSouthWest();
   		var map_ne = map.getBounds().getNorthEast();
   		var width = map_ne.lng() - map_sw.lng();
   		var height = map_ne.lat() - map_sw.lat();
   		var square_width = width / 16;
   		var square_height = height / 16;
			var index = 0;
   		$("#squares").html("Width : " + width + ", Height : " + height + "; square_width : " + square_width + ", square_height : " + square_height);

   		for( i = 1; i <= 16; i++ ) {
   		  for( j = 1; j <= 16; j++ ) {
        	var sw = new google.maps.LatLng( map_ne.lat() - ( square_height * i ), map_ne.lng() - ( square_width * j ) );
          var ne = new google.maps.LatLng( sw.lat() + square_height, sw.lng() + square_width );
          var rec_bounds = new google.maps.LatLngBounds( sw, ne );
          rectangles[index] = new google.maps.Rectangle({
          	map:map,
           	strokeColor:"#C11B17",
           	fillOpacity:0,
						clickable:true,
						strokeWeight:0.3,
						strokeOpacity:1.0
         	});
					
					rectangles[index].setBounds(rec_bounds);
					rectangle_bounds[index] = rec_bounds;
					index++;
   		  }
   		}
			
			for (var i = 0; i < 256; i++) {
				rec = rectangles[i];

				google.maps.event.addListener(rec, 'click', function(event) {
					// printObject(event);
					f_rec = find_rectangle(event.latLng);
					// printObject(f_rec);
					// show_coordinates(f_rec);
					map.fitBounds(f_rec.getBounds());
					update_breadcrumbs(f_rec.getBounds());
			  });
			}
    });

  }
