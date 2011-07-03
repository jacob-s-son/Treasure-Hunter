class Square
	constructor:(@canvas, x, y, @size) ->
		@size ?= 32
		@coords =
			x:x
			y:y
		@rec = @canvas.rect @coords.x, @coords.y, @size, @size
		@rec.toFront()
		@draw()
		@add_events()
		
	draw: ->
		@default_options =
			"fill-opacity":0,
			"stroke":	"#99182C",
			"fill":	"#99182C",
			"stroke-width":0.4,
			"stroke-opacity":1
		@rec.attr @default_options
		
	clicked: (event) ->
		alert "You clicked square with coordinates x = #{@coords.x} , y = #{@coords.y}"
		
	hover: ->
		if @rec.attr("fill-opacity") == 0
			@rec.attr "fill-opacity", 0.5
		else
			@rec.attr "fill-opacity", 0
						
	add_events: ->
		$(@rec.node).click (event) => @clicked event	
		$(@rec.node).hover => @hover()
				
class Map
	constructor: (@bounds, @number_of_levels, @div_id) ->
		@number_of_levels ?= 3
		@div_id ?= "map_canvas"
		@map_width = @map_height = 512
		@map_type = "roadmap"
		@default_bounds = @bounds
		@canvas = Raphael @div_id, @map_width, @map_height
		@canvas
	map_base_url: ->
		@map_current_url @default_bounds
	map_current_url: (bounds) ->
		bounds ?= @bounds
		"http://maps.google.com/maps/api/staticmap?visible=#{ bounds[0].lat },#{ bounds[0].lng }|#{ bounds[1].lat },
		#{ bounds[1].lng }&size=#{ @map_width }x#{ @map_height }&maptype=#{ @map_type }&sensor=false"
	draw_squares: ->
		@squares = []
		for i in [1..16]
			for j in [1..16]
				@squares.push new Square @canvas, 32 * (j - 1), 32 * (i - 1)
		@squares
	draw_map: ->
		map_image = @canvas.image @map_current_url(), 0, 0, @map_width, @map_height
		# map_image.toBack()
		# $(map_image.node).bind "click", (event) =>
		# 	alert "lala"
		# map_image.hide()
		@draw_squares()

$ ->
	bounds = [ { lat:56.96887, lng:24.08205 }, { lat:56.92393, lng:24.16909} ]
	map = new Map(bounds)
	map.draw_map()