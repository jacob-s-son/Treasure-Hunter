// function Level(step_nr, bounds) {
// 	this.step_nr = parseInt(step_nr);
// 	this.step = 'step_' + step_nr;
// 	this.squares = new Array(2);
// 	this.is_last = false;
// 	this.bounds = bounds;
// 	
// 	this.opened_squares = function(){
// 		var counter = 0;
// 		
// 		for s in this.squares {
// 			if (s.visited) { counter++ };
// 		}
// 	}
// 	
// 	this.get_anchor_action = function(rec_bounds, step) {
// 		return "javascript:initialize(" + rec_bounds.getSouthWest().lat() + "," +  rec_bounds.getSouthWest().lng() + "," + 
// 		rec_bounds.getNorthEast().lat() + "," + rec_bounds.getNorthEast().lng() + "); set_current('step_" + step +"');";
// 	}
// 	
// 	this.create_dom_element = function(append_to) {
// 		parent_obj = $(append_to);
// 		
// 		$('step_1').clone.appendTo( parent_obj );
// 		new_obj = parent_obj.children().last();
// 		
// 		anchor = new_obj.children();
// 		anchor.attr( "href", this.get_anchor_action(this.bounds, this.step_nr) )
// 		new_obj.attr("id", "step_" + this.step_nr);
// 	}
// }

function Index(x, y, z) {
	this.x = x;
	this.y = y || 0;
	this.z = z || 0;
	
	this.level = function(){
		if (z > 0) {
			return 3;
		}
		else if ( y > 0) {
			return 2;
		}
		else {
			return 1;
		}
	}
	
	this.is_last = function() { return z > 0 };
}

function Square(map, sw, ne, index){
	//methods
	this.fill_opacity = function() { return ( this.visited ) ? ( this.last ?  1 : 0.3 ) : 0 }
	
	this.draw = function() {
		var rec_bounds = new google.maps.LatLngBounds( this.sw, this.ne );
		var rec_options = this.default_options;
		
		rec_options["fillOpacity"] = this.fill_opacity();
		this.map_square.setOptions(rec_options);
		
		this.setBounds(rec_bounds);
	}
	
	this.level = function() {
		return index.level();
	}
	
	this.number_of_visited_suqbsquares = function() {
		return this.last ? 0 : this.map_object.number_of_visited_subsquares(this.index);
	}
	
	this.has_unvisited_subsquares = function() {
		//TODO: Evil hardcoding kopējam kvadrātu skaitam vienā līmenī
		return !this.last && this.number_of_visited_suqbsquares() < 256
	}
	
	this.get_bounds = function() {
		this.map_square.getBounds();
	}
	
	//attributes
	this.index = index;
	this.sw = sw;
	this.ne = ne;
	//pašveidotais custom objekts, kas satur arī google karti
	this.map_object = map;
	//google karte
	this.map = this.map_object.current_map;
	this.default_options = {
  	map:map,
   	strokeColor:"#C11B17",
   	fillColor:"#C11B17",
   	fillOpacity:0,
		clickable:true,
		strokeWeight:0.3,
		strokeOpacity:1.0
	};
	
	this.visited = false;
	this.last = false;
	this.map_square = new google.maps.Rectangle(default_options);
	
	//listener
	google.maps.event.addListener(this.map_square, 'click', function(event) {
		this.map_object.increase_step();
		this.map_object.update_breadcrumb(index);
		this.map_object.add_to_visited(index);
		this.map.fitBounds( this.get_bounds() );
  });
}