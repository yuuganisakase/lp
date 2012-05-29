//ItemView.js

var ItemView = function(_model, _eb) {
	var model = _model;
	var eb = _eb;

	var rv = new RecommendItemView(model);
	var mv = new MainItemView(model);
	return {
		init: function() {

		},
		render: function() {
			var box = "<div class='item'></div>";
			return $(box).append(mv.render()).append(rv.render()).append("<div style='clear:both;'></div>");
		}
	};
};