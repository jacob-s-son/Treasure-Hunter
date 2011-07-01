function Level(step_nr) {
	this.step_nr = parseInt(step_nr);
	this.step = 'step_' + step_nr;
	this.squares = new Array(2);
}

function Square(map, sw, ne){
	this.sw = sw;
	this.ne = ne;
	this.options = {
  	map:map,
   	strokeColor:"#C11B17",
   	fillOpacity:0,
		clickable:true,
		strokeWeight:0.3,
		strokeOpacity:1.0
	}