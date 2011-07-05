/* DO NOT MODIFY. This file was compiled Tue, 05 Jul 2011 09:02:04 GMT from
 * /Users/jekabedg/Workspace/treasure-hunter/app/coffeescripts/application.coffee
 */

(function() {
  var Map, Square;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Square = (function() {
    function Square(map, x, y, nr, size) {
      var _ref;
      this.map = map;
      this.nr = nr;
      this.size = size;
            if ((_ref = this.size) != null) {
        _ref;
      } else {
        this.size = 32;
      };
      this.canvas = this.map.canvas;
      this.coords = {
        x: x,
        y: y
      };
      this.rec = this.canvas.rect(this.coords.x, this.coords.y, this.size, this.size);
      this.draw();
      this.add_events();
      this.add_number();
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
    Square.prototype.add_to_visited = function() {
      return this.map.add_to_visited(this.nr);
    };
    Square.prototype.log_bounds = function() {
      return $('#log').html("<p>bounds = " + this.bounds[0].lat + ", " + this.bounds[0].lng + ", " + this.bounds[1].lat + ", " + this.bounds[1].lng + "</p>");
    };
    Square.prototype.clicked = function(event) {
      alert("You clicked square with coordinates x = " + this.coords.x + " , y = " + this.coords.y + ", bounds = " + this.bounds[0].lat + ", " + this.bounds[0].lng + ", " + this.bounds[1].lat + ", " + this.bounds[1].lng);
      this.add_to_visited();
      this.map.set_bounds(this.bounds);
      return this.map.draw_map();
    };
    Square.prototype.hover = function() {
      this.log_bounds();
      if (this.rec.attr("fill-opacity") === 0) {
        return this.rec.attr({
          "fill-opacity": 0.5,
          "fill": "#00FFFF"
        });
      } else {
        return this.rec.attr({
          "fill-opacity": 0,
          "fill": "#99182C"
        });
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
    Square.prototype.add_number = function() {
      this.number = this.canvas.text(this.coords.x + 3, this.coords.y + 7, "" + this.nr);
      this.number.toFront();
      return this.number.attr({
        font: '10px Helvetica, Arial',
        opacity: 1,
        fill: "#99182C",
        "text-anchor": "start"
      });
    };
    Square.prototype.add_bounds = function(bounds) {
      this.bounds = bounds;
    };
    return Square;
  })();
  Map = (function() {
    function Map(bounds, number_of_levels, div_id, size_in_squares) {
      var i, _ref, _ref2, _ref3, _ref4;
      this.bounds = bounds;
      this.number_of_levels = number_of_levels;
      this.div_id = div_id;
      this.size_in_squares = size_in_squares;
            if ((_ref = this.size_in_squares) != null) {
        _ref;
      } else {
        this.size_in_squares = 8;
      };
            if ((_ref2 = this.number_of_levels) != null) {
        _ref2;
      } else {
        this.number_of_levels = 3;
      };
            if ((_ref3 = this.div_id) != null) {
        _ref3;
      } else {
        this.div_id = "map_canvas";
      };
      this.map_width = this.map_height = 512;
      this.square_size = this.map_width / this.size_in_squares;
      this.map_type = "roadmap";
      this.default_bounds = this.bounds;
      this.canvas = Raphael(this.div_id, this.map_width, this.map_height);
      this.current_level = 1;
      this.breadcrumbs = [];
      for (i = 0, _ref4 = this.number_of_levels; 0 <= _ref4 ? i <= _ref4 : i >= _ref4; 0 <= _ref4 ? i++ : i--) {
        this.breadcrumbs.push(0);
      }
      this.init_squares();
    }
    Map.prototype.init_squares = function() {
      var i, j;
      this.squares = [];
      i = 0;
      while (i <= Math.pow(this.size_in_squares, 2)) {
        this.squares[i] = [];
        j = 0;
        while (j <= Math.pow(this.size_in_squares, 2)) {
          this.squares[i][j] = [];
          j++;
        }
        i++;
      }
      return this.squares;
    };
    Map.prototype.map_center = function() {
      var geo_height, geo_width;
      geo_height = this.bounds[0].lat - this.bounds[1].lat;
      geo_width = this.bounds[1].lng - this.bounds[0].lng;
      return "" + (this.bounds[0].lat - geo_height / 2) + "," + (this.bounds[1].lng + geo_width / 2);
    };
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
    Map.prototype.indexes_to_bounds = function(x, y) {
      var new_bounds, square_geo_height, square_geo_width;
      square_geo_height = (this.bounds[0].lat - this.bounds[1].lat) / this.size_in_squares;
      square_geo_width = (this.bounds[1].lng - this.bounds[0].lng) / this.size_in_squares;
      return new_bounds = [
        {
          lat: this.bounds[0].lat - square_geo_height * (y - 1),
          lng: this.bounds[0].lng + square_geo_width * (x - 1)
        }, {
          lat: this.bounds[0].lat - square_geo_height * (y - 1) - square_geo_height,
          lng: this.bounds[0].lng + square_geo_width * (x - 1) + square_geo_width
        }
      ];
    };
    Map.prototype.draw_squares = function() {
      var i, j, number, _ref, _ref2;
      this.level_squares = [];
      number = 1;
      for (i = 1, _ref = this.size_in_squares; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        for (j = 1, _ref2 = this.size_in_squares; 1 <= _ref2 ? j <= _ref2 : j >= _ref2; 1 <= _ref2 ? j++ : j--) {
          this.level_squares.push(new Square(this, this.square_size * (j - 1), this.square_size * (i - 1), number, this.square_size));
          this.level_squares[number - 1].add_bounds(this.indexes_to_bounds(j, i));
          number++;
        }
      }
      return this.level_squares;
    };
    Map.prototype.draw_map = function() {
      var map_image;
      map_image = this.canvas.image(this.map_current_url(), 0, 0, this.map_width, this.map_height);
      return this.draw_squares();
    };
    Map.prototype.get_square_index = function(nr) {
      var i, index, _ref;
      index = [];
      for (i = 0, _ref = this.number_of_levels - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        index[i] = this.breadcrumbs[i];
        if ((this.breadcrumbs[i] === 0) && ((i === 0) || (this.breadcrumbs[i - 1] > 0))) {
          index[i] = nr;
        }
      }
      return index;
    };
    Map.prototype.add_to_visited = function(square_nr) {
      var square_index;
      square_index = this.get_square_index(square_nr);
      alert(square_index.join(" "));
      return this.squares[square_index[0]][square_index[1]][square_index[2]] = 1;
    };
    Map.prototype.set_bounds = function(bounds) {
      this.bounds = bounds;
    };
    return Map;
  })();
  $(function() {
    var bounds, map;
    bounds = [
      {
        lat: 56.99513,
        lng: 24.01337
      }, {
        lat: 56.88688,
        lng: 24.23309
      }
    ];
    map = new Map(bounds);
    return map.draw_map();
  });
}).call(this);
