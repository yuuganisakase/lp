//MainItemView.js

var MainItemView = function(_model) {

	var model = _model;
	var main = model.getMain();
	var config = window.config;
	var service = model.getService();
	var template;
	var color = new Color();
	return{
		init: function() {

		},
		render: function() {
			var that = this;
			
			var snsI;
			var snsA;
			
			if(service === 0){
				snsI = "img/fbMainIcon.png";
				snsA = config.FBaction;
			}else if(service === 1){
				snsI = "img/twMainIcon.png";
				snsA = config.TWaction;
			}

			
			var tar = ich.mainItem({
				snsImg : snsI,
				snsIcon : main.icon,
				name : main.name,
				time : timeConvert(main.time),
				postTexts: main.text,
				plestValue: model.getPlestValue(),
				snsAction1: snsA.action1,
				snsAction2: snsA.action2,
				snsAction3: snsA.action3
			})[0];
			
			template = tar;

			var contents = $(template).find(".contents");

			if(main.picture){
				contents.append("<img class='posImg' src=" + main.picture + " />");
			}else if(main.place){
				var place = main.place;
				var location = place.location;
				var lat = place.location.latitude;
				var lon = place.location.longitude;
				var address = location.state + " " + location.city + " " +location.street;

				contents.css({
					//"position":"absolute",
					"width":"403px",
					"height":"122px"
				});
				$(template).find(".mainItemInner").css("position","relative");

				var map = new Microsoft.Maps.Map(contents[0],
					{
						credentials: 'AmJ8I4iindTDfvD5k4--QDoLqVkks0BXGup2Cv2TMHYNQ1wV-Ld0RkFH_jwaPEyf',
						enableClickableLogo: false,
						showDashboard: false,
						enableSearchLogo: false,
						disableZooming: true,
						//disablePanning: true,
						showScalebar: false,
						useInertia: false,
						center: new Microsoft.Maps.Location(lat, lon),
						zoom: 14,
						width: 403,
						height:122
					});
				var infoboxOptions = {offset:new Microsoft.Maps.Point(-170,-25) ,showPointer:true,showCloseButton: false,width :352, height :62};
				var defaultInfobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions );
				map.entities.push(defaultInfobox);
				var col1 = 'rgb(59,90,152)';
				var col2 = 'rgb(135,135,135)';
				var html1 = '<div id="infoboxText" style="background-color:White; min-height:62px;width:352px;">';
				var html2 = '<span id="infoboxTitle" style="position:absolute; top:10px; left:10px; width:220px;">' + place.name + '</span>';
				var html3 = '<a id="infoboxDescription" style="position:absolute; top:30px; left:10px; width:220px;">' + address + '</a><img id="mapImg" src="img/mapIcon.png"></img></div>';
				var h2 = $(html2).css("color","#ff0000");
				console.log(h2[0]);
				var h22 = "" + h2[0];
				defaultInfobox.setHtmlContent(html1 + html2 + html3);
				setTimeout(function() {contents.find("#infoboxTitle").css({
						"color":col1,
						"position":"absolute",
						"top":"20px",
						"left":"70px",
						"font-size":"12px",
						"font-weight":"bold"
					}).end().find("#infoboxDescription").css({
						"color":col2,
						"position":"absolute",
						"top":"35px",
						"left":"70px",
						"font-size":"12px"
					}).end().find("#mapImg").css({
						"position":"absolute",
						"top":"7px",
						"left":"7px"
					}).end().find("#infoboxText").css({
						"border": "1px solid #8c8c8c"
					}).end().find(".CopyrightContainer").css({
						"margin-bottom":"-8px"
					});
				}, 590);
			}else if(main.inner){
				var inner = ich.mainItemInner({
					"innerName": main.inner.name,
					"innerImg": main.inner.picture,
					"innerCaption": main.inner.caption,
					"innerDescription": main.inner.description,
					"link": main.inner.link
				});
				contents.append(inner);
			}
			
			that.changePlestSize(model.getPlestValue());

			var tarObj = $(template);
			var h = tarObj.appendTo($("#container"));
			if(h.height() < 110){
				tar = that.addCssForActionedBox(tar, 0);
			}else if(main.place){
				tar = that.addCssForActionedBox(tar, 10);
			}else if(main.inner){
				tar = that.addCssForActionedBox(tar, 10);
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
		addCssForActionedBox: function(tar,mt) {
			$(tar).find(".actionedBox")
					.css("margin-top", mt + "px")
					.css("height","20px");
			return tar;
		},
		addEvent: function(tar) {
			var that = this;
			var target = $(tar);

			var time = 140;
			var ac = target.find(".snsActionBox").add(target.find(".plestDislike")).add(target.find(".plestLike1")).add(target.find(".plestLike2"));
			target.mouseenter(function() {
				var ttt;
				if(model.getPlestLike() === true){
					ttt = ac.not(target.find(".plestLike2")).not(target.find(".plestLike1"));
				}else{
					ttt = ac.not(target.find(".plestLike2"));
					target.find(".plestLike2").animate({"opacity":"0"},0);
				}
				ttt.stop().animate( { opacity: "1"}, { duration: time, easing: 'easeOutQuad'} );
			}).mouseleave(function() {
				var ttt;
				if(model.getPlestLike() === true){
					ttt = ac.not(target.find(".plestLike2")).not(target.find(".plestLike1"));
				}else{
					ttt = ac.not(target.find(".plestLike2"));
					target.find(".plestLike2").animate({"opacity":"0"},0);
				}

				ttt.stop().animate( { opacity: "0"}, { duration: time*1.2, easing: 'easeOutQuad'} );
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