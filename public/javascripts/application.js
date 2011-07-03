/* DO NOT MODIFY. This file was compiled Sun, 03 Jul 2011 21:58:13 GMT from
 * /Users/edgars/Documents/Workspace/Treasure-Hunter/app/coffeescripts/application.coffee
 */

(function() {
  var Map, Square;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Square = (function() {
    function Square(canvas, x, y, size) {
      var _ref;
      this.canvas = canvas;
      this.size = size;
            if ((_ref = this.size) != null) {
        _ref;
      } else {
        this.size = 32;
      };
      this.coords = {
        x: x,
        y: y
      };
      this.rec = this.canvas.rect(this.coords.x, this.coords.y, this.size, this.size);
      this.rec.toFront();
      this.draw();
      this.add_events();
    }
    Square.prototype.draw = function() {
      this.default_options = {
        "fill-opacity": 0,
        "stroke": "#99182C",
        "fill": "#99182C",
        "stroke-width": 0.4,
        "stroke-opacity": 1
      };
      return this.rec.attr(this.default_options);
    };
    Square.prototype.clicked = function(event) {
      return alert("You clicked square with coordinates x = " + this.coords.x + " , y = " + this.coords.y);
    };
    Square.prototype.hover = function() {
      if (this.rec.attr("fill-opacity") === 0) {
        return this.rec.attr("fill-opacity", 0.5);
      } else {
        return this.rec.attr("fill-opacity", 0);
      }
    };
    Square.prototype.add_events = function() {
      $(this.rec.node).click(__bind(function(event) {
        return this.clicked(event);
      }, this));
      return $(this.rec.node).hover(__bind(function() {
        return this.hover();
      }, this));
    };
    return Square;
  })();
  Map = (function() {
    function Map(bounds, number_of_levels, div_id) {
      var _ref, _ref2;
      this.bounds = bounds;
      this.number_of_levels = number_of_levels;
      this.div_id = div_id;
            if ((_ref = this.number_of_levels) != null) {
        _ref;
      } else {
        this.number_of_levels = 3;
      };
            if ((_ref2 = this.div_id) != null) {
        _ref2;
      } else {
        this.div_id = "map_canvas";
      };
      this.map_width = this.map_height = 512;
      this.map_type = "roadmap";
      this.default_bounds = this.bounds;
      this.canvas = Raphael(this.div_id, this.map_width, this.map_height);
      this.canvas;
    }
    Map.prototype.map_base_url = function() {
      return this.map_current_url(this.default_bounds);
    };
    Map.prototype.map_current_url = function(bounds) {
            if (bounds != null) {
        bounds;
      } else {
        bounds = this.bounds;
      };
      return "http://maps.google.com/maps/api/staticmap?visible=" + bounds[0].lat + "," + bounds[0].lng + "|" + bounds[1].lat + ",		" + bounds[1].lng + "&size=" + this.map_width + "x" + this.map_height + "&maptype=" + this.map_type + "&sensor=false";
    };
    Map.prototype.draw_squares = function() {
      var i, j;
      this.squares = [];
      for (i = 1; i <= 16; i++) {
        for (j = 1; j <= 16; j++) {
          this.squares.push(new Square(this.canvas, 32 * (j - 1), 32 * (i - 1)));
        }
      }
      return this.squares;
    };
    Map.prototype.draw_map = function() {
      var map_image;
      map_image = this.canvas.image(this.map_current_url(), 0, 0, this.map_width, this.map_height);
      return this.draw_squares();
    };
    return Map;
  })();
  $(function() {
    var bounds, map;
    bounds = [
      {
        lat: 56.96887,
        lng: 24.08205
      }, {
        lat: 56.92393,
        lng: 24.16909
      }
    ];
    map = new Map(bounds);
    return map.draw_map();
  });
}).call(this);
