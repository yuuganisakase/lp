//MainItemView.js

var MainItemView = function(_model) {

	var model = _model;
	return{
		init: function() {

		},
		render: function() {
			var main = model.getData().main;
			var si;
			var s = main.service;
			if(s === 0){
				si = "img/fbMainIcon.png";
			}else if(s === 1){
				si = "img/twMainIcon.png";
			}

			return ich.mainItem({
				snsImg : si,
				snsIcon : main.snsIcon,
				name : main.name,
				time : main.time,
				postTexts: main.postTexts,
				postImg: main.postImg,
				plestValue: main.plestValue
			})[0];
		}
	};
};