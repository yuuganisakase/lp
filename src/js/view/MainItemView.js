//MainItemView.js

var MainItemView = function(_model) {

	var model = _model;
	var template;
	var color = new Color();
	return{
		init: function() {

		},
		render: function() {
			var that = this;

			var main = model.getData().main;
			var config = window.config;
			var snsI;
			var snsA;
			var s = main.service;
			if(s === 0){
				snsI = "img/fbMainIcon.png";
				snsA = config.FBaction;
			}else if(s === 1){
				snsI = "img/twMainIcon.png";
				snsA = config.TWaction;
			}

			
			var tar = ich.mainItem({
				snsImg : snsI,
				snsIcon : main.snsIcon,
				name : main.name,
				time : main.time,
				postTexts: main.postTexts,
				postImg: main.postImg,
				plestValue: main.plestValue,
				snsAction1: snsA.action1,
				snsAction2: snsA.action2,
				snsAction3: snsA.action3
			})[0];
			
			template = tar;

			that.changePlestSize(main.plestValue);

			var tarObj = $(tar);
			var h = tarObj.appendTo($("#container"));
			if(h.height() < 110){
				tar = that.addCssForActionedBox(tar);
			}
			tarObj.remove();
			that.addEvent(tar);
			console.log(h.height());
			return tar;
		},
		changePlestSize:function(val) {

			var rad = Math.floor((val / 18) + 35);
			var margin = Math.floor((50 - rad)/2);
			var left = 12;
			if(val < 100){
				left = 16;
			}
			if(val < 10){
				left = 20;
			}
			var base = color.RGBtoHSV(0,205,192);
			var cm = (250 - val)/10;
			var after = color.HSVtoRGB(base.h + cm, base.s, base.v - cm);

			var mainBase = color.RGBtoHSV(0,164,159);
			var mainColor = color.HSVtoRGB(mainBase.h + cm, mainBase.s, mainBase.v - cm);
			var col = "rgb(" + mainColor.r + "," + mainColor.g + "," + mainColor.b + ")";
			$(template).find(".plestBack").css({
				"width": rad + "px",
				"height": rad + "px",
				"-moz-border-radius": rad + "px",
				"-webkit-border-radius": rad + "px",
				"border-radius": rad + "px",
				"margin-left": margin + "px",
				"background": "rgb(" + after.r + "," + after.g + "," + after.b + ")",
				"border": "solid 1px " + "rgb(" + mainColor.r + "," + mainColor.g + "," + mainColor.b + ")",
				"-webkit-box-shadow":  "1px 1px 1px " + col + ", -1px -1px 1px " + col,
				"box-shadow": "1px 1px 1px " + col + ", -1px -1px 1px " + col
			}).end().find(".plestNumber").css({
				"left": left + "px",
				"top": (19 - margin) + "px"
			});

		},
		addCssForActionedBox: function(tar) {
			$(tar).find(".actionedBox")
					.css("margin-top","0px")
					.css("height","20px");
			return tar;
		},
		addEvent: function(tar) {
			var that = this;
			var target = $(tar);

			var time = 140;
			target.mouseenter(function() {
				target.find(".actionedBox").stop().animate( { opacity: "1"}, { duration: time, easing: 'easeOutQuad'} );
			}).mouseleave(function() {
				target.find(".actionedBox").stop().animate( { opacity: "0"}, { duration: time*1.2, easing: 'easeOutQuad'} );
			});
			target.find(".actionedBox").trigger("mouseleave");

			target.find(".plestLike").click(function() {
				model.togglePlestlike();
			});
			target.find(".plestDislike").click(function() {
				model.togglePlestDislike();
			});

			model.likeSignal.add(function(val) {
				console.log(val);
				var time = 50;
				var one = target.find(".plestLike1");
				var two = target.find(".plestLike2");
				if(val === true){
					if(_.isUndefined(one) === false){
						one.stop().animate({"opacity": "0"}, {duration:time});
					}
					if(_.isUndefined(two) === false){
						two.stop().animate({"opacity": "1"}, {duration:time*1.2});
					}
					
				}else{
					if(_.isUndefined(one) === false){
						one.stop().animate({"opacity": "1"}, {duration:time});
					}
					if(_.isUndefined(two) === false){
						two.stop().animate({"opacity": "0"}, {duration:time*1.2});
					}
				}
			});

		}
	};
};