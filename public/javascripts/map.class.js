
function Map(bounds, number_of_levels, div_id, options) {
	
	this.increase_step = function() {
		if (this.step <= this.number_of_levels) { this.current_step++ } ;
		if (this.current_level < this.number_of_levels) { this.current_level++ } ;
	}
	
	this.decrease_step = function() {
		if (this.step >= 2) { this.current_step-- } ;
		if ( ( this.current_level >= 2) && ( this.current_step < 3 ) ) { this.current_level-- };
	}
	
	this.save_breadcrumb = function(selected_index) {
		var result = selected_index.x;
		
		for (var coord in selected_index) {
			if (selected_index[coord] == 0) { break };
			result = selected_index[coord];
	  }
	
		this.breadcrumb[this.current_level - 1] = result;
	}
	
	this.update_breadcrumb = function(index,bounds) {
		this.save_breadcrumb(index);
		// this.update_breadcrumb_dom(index, bounds);
	}
	
	this.get_index_for_square = function(height, length) {
		if (this.current_level == 1) {
			return new Index( (height - 1 ) * 16 + length);
		} 
		else if (this.current_level == 2) {
			return new Index( this.breadcrumb[0], (height - 1 ) * 16 + length);
		}
		else {
			return new Index( this.breadcrumb[0], this.breadcrumb[1], (height - 1 ) * 16 + length);
		}
	}
	
	this.draw_squares = function() {
		var nr = 1;
		var map_sw = this.current_this.current_map.getBounds().getSouthWest();
 		var map_ne = this.current_map.getBounds().getNorthEast();
 		var width = map_ne.lng() - map_sw.lng();
 		var height = map_ne.lat() - map_sw.lat();
 		var square_width = width / 16;
 		var square_height = height / 16;
		
		for( i = 1; i <= 16; i++ ) {
 		  for( j = 1; j <= 16; j++ ) {
      	var sw = new google.maps.LatLng( map_ne.lat() - ( square_height * i ), map_ne.lng() - ( square_width * j ) );
        var ne = new google.maps.LatLng( sw.lat() + square_height, sw.lng() + square_width );
				 
				this.level_squares[nr] = Square(this, sw, ne, get_index_for_square(i,j));
				this.level_squares[nr].draw();
 		  }
 		}
	}
	
	this.number_of_visited_subsquares = function(index){
		result = 0;
		if ( index.z > 0 ) { return result };
		
		//TODO : Not dry
		if ( index.level() == 1) {
			for(i = 1; i <= 256; i++) {
				for(j = 1; j <= 256; j++) {
					if (this.squares[index.x, i, j] == 1) { result++ } ;
				}
			}
		}
		else
		{
			for(i = 1; i <= 256; i++) 
			{
				if (this.squares[index.x, index.y, i] == 1) { result++ } ;
			}
		}
		
		return result;
	}
	
	this.add_to_visited = function(index) {
		this.squares[ index.x, index.y, index.z ] = 1;
	}
	
	this.redraw_map = function() {
		if (this.step < this.number_of_levels + 1 ) { this.draw_squares() };
	}
	
	this.bounds = bounds;
	this.container_id = div_id || "map_canvas";
	this.number_of_levels = 3 || number_of_levels;
	this.number_of_steps = this.number_of_levels + 1;
	this.current_step = 1;
	this.current_level = 1;
	
	this.breadcrumb = new Array();
	this.breadcrumb[0] = null;
	this.squares = new Array(number_of_levels);
	this.level_squares = new Array(2);
	
	this.map_options = options || {
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
  };

	this.current_map = new google.maps.Map( document.getElementById(this.container_id), this.map_options );
	this.current_map.fitBounds(this.bounds);
	
	google.maps.event.addListener(this.current_map, 'bounds_changed', function() {
		redraw_map();
	});
}

// google.maps.Map.prototype.test = function() {
// 	alert("concept_works");
// }