class Square
	constructor:(@map, x, y, @nr, @size) ->
		@size ?= 32
		@canvas = @map.canvas
		@coords =
			x:x
			y:y
		@rec = @canvas.rect @coords.x, @coords.y, @size, @size
		@draw()
		@add_events()
		@add_number()
		
	draw: ->
		@default_options =
			"fill-opacity":0,
			"stroke":	"#99182C",
			"fill":	"#99182C",
			"stroke-width":0.4,
			"stroke-opacity":1
		@rec.attr @default_options
	
	add_to_visited: ->
		@map.add_to_visited(@nr)
		
	clicked: (event) ->
		alert "You clicked square with coordinates x = #{@coords.x} , y = #{@coords.y}, bounds = #{@bounds[0].lat}, #{@bounds[0].lng}, #{@bounds[1].lat}, #{@bounds[1].lng}"
		@add_to_visited()
		@map.set_bounds(@bounds)
		@map.draw_map()
		
	hover: ->
		if @rec.attr("fill-opacity") == 0
			@rec.attr 
				"fill-opacity": 0.5
				"fill":"#00FFFF"
		else
			@rec.attr 
				"fill-opacity": 0
				"fill":"#99182C"
						
	add_events: ->
		$(@rec.node).click (event) => @clicked event	
		$(@rec.node).hover => @hover()
	
	add_number: () ->
		@number = @canvas.text @coords.x + 3, @coords.y + 7, "#{@nr}"
		@number.toFront()
		@number.attr
			font: '10px Helvetica, Arial'
			opacity: 1
			fill:"#99182C"
			"text-anchor":"start"
			
	add_bounds: (@bounds) ->
				
class Map
	constructor: (@bounds, @number_of_levels, @div_id) ->
		@number_of_levels ?= 3
		@div_id ?= "map_canvas"
		@map_width = @map_height = 512
		@map_type = "roadmap"
		@default_bounds = @bounds
		@canvas = Raphael @div_id, @map_width, @map_height
		@current_level = 1
		@breadcrumbs = []
		@breadcrumbs.push(0) for i in [0..@number_of_levels]
		@init_squares()
		
	#TODO: Again eveil hardcoding of map levels
	init_squares: ->
		@squares = []
		i = 0
		while i <= 255
		  @squares[i] = []
		  j = 0
		  while j <= 255
		    @squares[i][j] = []
		    j++
		  i++
		@squares
	
	map_center: ->
		geo_height = (@bounds[0].lat - @bounds[1].lat)
		geo_width = (@bounds[1].lng - @bounds[0].lng)
		"#{@bounds[0].lat - geo_height / 2},#{@bounds[1].lng + geo_width / 2}"
		
	map_base_url: ->
		@map_current_url @default_bounds

	map_current_url: (bounds) ->
		bounds ?= @bounds
		"http://maps.google.com/maps/api/staticmap?visible=#{ bounds[0].lat },#{ bounds[0].lng }|#{ bounds[1].lat },
		#{ bounds[1].lng }&center=#{@map_center()}&size=#{ @map_width }x#{ @map_height }&maptype=#{ @map_type }&sensor=false"
	
	indexes_to_bounds: (x,y) ->
		square_geo_height = (@bounds[0].lat - @bounds[1].lat) / 16
		square_geo_width = (@bounds[1].lng - @bounds[0].lng) / 16
		
		
		new_bounds = [ 
			lat:@bounds[0].lat - square_geo_height * (y-1) 
			lng:@bounds[0].lng + square_geo_width * (x-1) 
		,
			lat:@bounds[0].lat - square_geo_height * (y-1) - square_geo_height
			lng:@bounds[0].lng + square_geo_width * (x-1) + square_geo_width
		]

	draw_squares: ->
		@level_squares = []
		number = 1
		
		for i in [1..16]
			for j in [1..16]
				@level_squares.push new Square this, 32 * (j - 1), 32 * (i - 1), number
				@level_squares[number-1].add_bounds @indexes_to_bounds( j, i )
				# alert "#{@indexes_to_bounds(j,i)[0].lat}, #{@indexes_to_bounds(j,i)[0].lng}, #{@indexes_to_bounds(j,i)[1].lat}, #{@indexes_to_bounds(j,i)[1].lng}"
				number++
		@level_squares

	draw_map: ->
		map_image = @canvas.image @map_current_url(), 0, 0, @map_width, @map_height
		@draw_squares()
	
	get_square_index: (nr) ->
		index = []
		for i in [0..@number_of_levels-1]
				index[i] = @breadcrumbs[i]
				index[i] = nr if ( @breadcrumbs[i] == 0 ) and ( ( i == 0 ) or ( @breadcrumbs[i-1] > 0 ) )
		index
		
	add_to_visited: (square_nr) ->
		square_index = @get_square_index(square_nr)
		#TODO:evil hardcode - number of levels = 3
		alert square_index.join( " " )
		@squares[square_index[0]][square_index[1]][square_index[2]] = 1
	
	set_bounds: (@bounds) ->

$ ->
	bounds = [ { lat:56.99513, lng:24.01337 }, { lat:56.88688, lng:24.23309} ]
	map = new Map(bounds)
	map.draw_map()