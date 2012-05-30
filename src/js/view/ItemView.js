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
			var that = this;
			var box = "<div class='item'></div>";
			
			var str = $(box).append(mv.render()).append(rv.render()).append("<div style='clear:both;'></div>");
			that.addEvent(str);
			return str;
		},
		addEvent:function(tar) {
			var time = 650;
			model.dislikeSignal.add(function() {
				console.log("dislike");
				tar.stop().animate({height: 0,opacity:0,marginBottom:0},
					{
						duration:time,
						easing: 'easeOutQuart',
						complete:remove
					});
			});
			
			var remove = function() {
				tar.remove();
			}
		}
	};
};