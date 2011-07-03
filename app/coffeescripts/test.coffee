app =
	init: ->
		@paper = Raphael 'playspace', 320, 200
		@draw_circle()
		@draw_square()

	# simple circle with event-based on-click event
	draw_circle: ->
		circle = @paper.circle 50,40,30
		circle.attr
			fill: '#cc0'
			stroke: '#660'
		$(circle.node).click (e) => @kick e

	# square with object-based on-click event
	draw_square: ->
		square = @paper.rect 50,40,50,30
		square.attr
			fill: '#0cc'
			stroke: '#066'
		$(square.node).click (e) => @punt square
	
	kick: (e) -> @paper.text e.pageX+10, e.pageY+10, 'Raphaël\nkicks\nbutt!'

	punt: (obj) -> obj.translate 10,10

$(app.init())