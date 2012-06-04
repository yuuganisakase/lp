//ItemModel.js

var ItemModel = function(_data) {
	var data = _data;
	var recommendAnimationFlag = false;
	var isCommentOpen = false;
	var isActionedOpen = false;
	return{
		likeFlag:false,
		likeSignal: new signals.Signal(),
		dislikeSignal: new signals.Signal(),
		recommendSignal: new signals.Signal(),
		getService:function() {
			return data.service;
		},
		getData:function() {
			return data;
		},
		getMain:function() {
			return data.main;
		},
		getComments:function() {
			return data.comments.data;
		},
		getRecommends:function() {
			return data.recommends;
		},
		getPlestValue:function() {
			return data.plestValue;
		},
		togglePlestlike:function() {
			var that = this;
			that.likeFlag = !that.likeFlag;
			that.likeSignal.dispatch(that.likeFlag);
		},
		togglePlestDislike:function() {
			this.dislikeSignal.dispatch();
		},
		setRecommendAnimationFlag:function(f) {
			recommendAnimationFlag = f;
		},
		getRecommendAnimationFlag:function() {
			return recommendAnimationFlag;
		},
		setCommentOpen:function(f) {
			var that = this;
			if(isCommentOpen !== f){
				isCommentOpen = f;
				that.recommendSignal.dispatch("comment",f);
			}
		},
		getCommentOpen:function() {
			return isCommentOpen;
		},
		setActionedOpen:function(f) {
			isActionedOpen = f;
		},
		getActionedOpen:function() {
			return isActionedOpen;
		}

	};
}
//MainModel.js
//color.js
var Color = function() {


    return {
      RGBtoHSV: function(r, g, b, coneModel) {
        var h, // 0..360
        s, v, // 0..255
        max = Math.max(Math.max(r, g), b),
          min = Math.min(Math.min(r, g), b);

        // hue
        if (max == min) {
          h = 0; // 0
        } else if (max == r) {
          h = 60 * (g - b) / (max - min) + 0;
        } else if (max == g) {
          h = (60 * (b - r) / (max - min)) + 120;
        } else {
          h = (60 * (r - g) / (max - min)) + 240;
        }

        while (h < 0) {
          h += 360;
        }

        // saturation
        if (coneModel) {
          // ensui
          s = max - min;
        } else {
          s = (max === 0) ? 0 
          : (max - min) / max * 255;
        }

        // value
        v = max;

        return {
          'h': h,
          's': s,
          'v': v
        };
      },
      HSVtoRGB: function(h, s, v) {
        var r, g, b; // 0..255
        while (h < 0) {
          h += 360;
        }

        h = h % 360;

        // saturation = 0
        if (s === 0) {
          // RGB= V 
          v = Math.round(v);
          return {
            'r': v,
            'g': v,
            'b': v
          };
        }

        s = s / 255;

        var i = Math.floor(h / 60) % 6,
          f = (h / 60) - i,
          p = v * (1 - s),
          q = v * (1 - f * s),
          t = v * (1 - (1 - f) * s);

          switch (i) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
          }

        return {
          'r': Math.round(r),
          'g': Math.round(g),
          'b': Math.round(b)
        };
      }


    };
  };
var timeConvert = function(material) {
	var temp = material.split("T");
	var temp2 = temp[0].split("-");
	var temp3 = temp[1].split("+");

	
	return temp2[1] + "/" + temp2[2] + " " + temp3[0];
};
//LoadTemplateCommand.js
var LoadTemplateCommand = function() {

		return {
			completeSignal : new signals.Signal(),
			loadCount: 0,
			nameList: [],
			execute: function(_nameList) {
				var that = this;
				that.nameList = _nameList;

				_.each(that.nameList, function(n) {
					that.load(n);
				});
			},
			load: function(name) {
				var that = this;
				$.ajax({
					url: 'assets/' + name + '.html',
					dataType: 'html',
					cache:false,
					success: function(data) {
						ich.addTemplate(name, data);
						that.loadCount += 1;
						if(that.loadCount == that.nameList.length){
							that.completeSignal.dispatch();
						}
					}
				});
			}
		};
	};
//LoadFeedCommand.js
var LoadFeedCommand = function() {

		return {
			completeSignal : new signals.Signal(),
			execute: function(num) {
				var that = this;
				$.ajax({
					url: 'debug/alpha/feed1_' + num + '.json',
					dataType: 'json',
					cache: false,
					success: function(data) {
						console.log("load feed");
						that.completeSignal.dispatch(data);
					}
				});


			}
		};
	};
//ItemView.js

var ItemView = function(_model, _eb) {
	var model = _model;
	var eb = _eb;
	var mv = new MainItemView(model);
	
	var rv = new RecommendItemView(model);
	
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
				tar.stop().animate({height: 0,opacity:0,marginBottom:0},
					{
						duration:time,
						easing: 'easeOutQuart',
						complete:remove
					});
			});
			
			var remove = function() {
				tar.remove();
			};
		}
	};
};
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
//RecommendItemView.js
var RecommendItemView = function(_model) {
		var model = _model;
		var comments = model.getComments();
		var recommends = model.getRecommends();
		var service = model.getService();
		var data = model.getData();
		var commentBox;
		var inputStr = "<input class='commentInput' type='text' name='example1' >";
		var config = window.config;
		var template;

		return {
			element: "",
			init: function() {

			},
			render: function() {
				var that = this;
								
				var actionedMessage;
				if (service === 0) {
					actionedMessage = config.FBaction.actionedMessage;
				} else {
					actionedMessage = config.TWaction.actionedMessage;
				}
				template = ich.recommendItem({
					actionedMessage: recommends.count + actionedMessage
				})[0];

				commentBox = $(template).find(".commentBoxWrapperInner");

				if(comments.length === 0){
					$(template).find(".recommentLine").remove().end()
								.find(".commentBoxWrapper").remove().end()
								.find(".actionedBox").css("margin-top","10px");
				}else{
					that.createComment(0, commentBox);
					var displayNum = 2;
					if(comments.length === 2){
						displayNum = 1;
					}else if(comments.length === 1){
						displayNum = 0;
					}
					var hh = that.setDisplayCommentNum(displayNum, commentBox).height;
					commentBox.parent().css("height", hh + "px");
				}

				var actionedIconBox = $(template).find(".actionedIcons");
				var recMax = Math.min(recommends.data.length,6);
				for (var j = 0; j < recMax; j++) {
					var r = recommends.data[j];
					var img = "<img class='recIconImg' src=" + r.icon + "></img>";
					actionedIconBox.append(img);
				}
				that.addEvent(template);
				return template;
			},
			setDisplayCommentNum: function(_num, parent) {
				var that = this;
				var hh = 0;
				var num = _num;

				var commentBoxes = parent.find(".commentBox");
				var margin = 0;
				for (var i = comments.length - 1; i >= 0; i--) {
					if (num > 0) {
						var eq = commentBoxes.eq(i);
						var cl = eq.clone();
						var h = 0;
						if (i !== (comments.length - 1)) {
							cl.append(that.commentHR);
							h += 5;
						}
						cl.find(".snsIcon").css("height", "30px").css("width", "30px");
						var rec = $("<div class='recommendItem'></div>");

						$("#container").append(rec);
						rec.append(cl);

						if (i === (comments.length - 1) && num === comments.length) {
							var before = cl.height();
							cl.append(that.commentHR);
							cl.append(inputStr);
							var after = cl.height();
							margin = after - before;
						}

						var hhh = cl.height();
						h += hhh;

						cl.remove();
						rec.remove();

						hh += h;
					}
					num -= 1;
				}
				return {
					"height": hh,
					"bottom": margin
				};
			},
			commentHR: "<hr class='commentLine'>",
			createComment: function(_num, parent) {
				var that = this;
				var num;
				if (_num === 0) {
					num = comments.length;
				} else {
					num = _num;
				}

				for (var i = 0; i < num; i++) {
					var c = comments[i];
					if (i === (comments.length - 1)) {
						c.commentMore = config.commentMore1 + comments.length + config.commentMore2;
					} else {
						c.commentMore = "";
					}
					if (service === 0) {
						c.commentAction = ""; //config.FBaction.action1;
					} else {
						c.commentAction = "";
					}
					var cmp = ich.commentPartial({
						url: c.url,
						snsIcon: c.icon,
						commentName: c.name,
						commentTime: timeConvert(c.time),
						commentContents: c.message,
						commentMore: c.commentMore,
						commentAction: c.commentAction
					});
					parent.append(cmp);
					if (i !== (num - 1)) {
						parent.append(that.commentHR);
					}
				}
			},
			toggleComment: function(f) {
				console.log("toggle comment");
				var that = this;
				var wrapper = $(template).find(".commentBoxWrapper");
				var inner = $(template).find(".commentBoxWrapperInner");
				var beforeHeight = wrapper.height();
				var afterHeight = that.setDisplayCommentNum(comments.length, inner).height;
				var easing = "easeOutCubic";
				var time = 250;
				var mb;
				var commentNumObj;

				if (model.getRecommendAnimationFlag() === false) {
					if (f === true) {
						model.setRecommendAnimationFlag(true);

						commentNumObj = that.setDisplayCommentNum(comments.length, inner);
						afterHeight = commentNumObj.height;
						mb = commentNumObj.bottom;
						inner.find(".commentMore").fadeOut(80);
						wrapper.stop().animate({
							height: afterHeight
						}, {
							duration: time * (Math.sqrt(Math.sqrt(comments.length))),
							easing: easing,
							complete: function() {
								//model.setCommentOpen(true);
								model.setRecommendAnimationFlag(false);
								that.changeCommentBox();
							}
						});
						inner.stop().animate({
							bottom: mb
						}, {
							duration: time * 0.7,
							complete: function() {
								//that.changeCommentBox();
							}
						});
					} else {
						model.setRecommendAnimationFlag(true);

						commentNumObj = that.setDisplayCommentNum(2, inner);
						afterHeight = commentNumObj.height;
						mb = that.setDisplayCommentNum(comments.length, inner).bottom;
						inner.find(".commentMore").fadeIn(80);
						wrapper.stop().animate({
							height: afterHeight
						}, {
							duration: time * 1.2 * (Math.sqrt(Math.sqrt(comments.length))),
							easing: easing,
							complete: function() {
								//model.setCommentOpen(false);
								model.setRecommendAnimationFlag(false);
								that.changeCommentBox();
							}
						});
						inner.stop().animate({
							bottom: -mb
						}, {
							duration: time * 0.7,
							complete: function() {
								//that.changeCommentBox();
							}
						});
					}
				}

			},
			addEvent: function(template) {
				var that = this;
				var wrapper = $(template).find(".commentBoxWrapper");
				var inner = $(template).find(".commentBoxWrapperInner");
				var notClickedObj = wrapper.find(".snsIcon");
				notClickedObj.click(function(e) {
					e.stopPropagation();
				});

				model.recommendSignal.add(function(what, val) {
					if (what === "comment") {
						that.toggleComment(val);
					}
				});

				wrapper.click(function(e) {
					console.log("comment click");
					console.log(e);
					if ($(e.target).hasClass("commentInput")) {
						return;
					}else if(model.getRecommendAnimationFlag() === true){
						return;
					}

					if (model.getCommentOpen() === true) {
						//model.setCommentOpen(false);
					} else {
						model.setCommentOpen(true);
					}
				});
			},
			changeCommentBox: function() {
				var that = this;
				if (model.getCommentOpen() === true) {
					commentBox.css("bottom", 0);
					commentBox.append($(that.commentHR).addClass("lastHr")).append(inputStr);
					commentBox.find(".commentInput").fadeOut(0);
					commentBox.find(".commentInput").fadeIn(160);
				} else {
					commentBox.css("bottom", 0);
					commentBox.find(".commentInput").remove();
					commentBox.find(".lastHr").remove();
				}
			}
		};
	};
//HeaderView.js

var HeaderView = function() {


	return {
		render: function() {
			return ich.header()[0];
		}
	};
}
//app.js
if(!console){
	console = {};
}
$(function() {
	var eb = new signals.Signal();
	var lf = new LoadFeedCommand();
	var lc = new LoadTemplateCommand();
	var startFlag = false;
	var loadingFlag = false;

	lc.execute(["recommendItem", "commentPartial", "mainItem","mainItemInner"]);
	lc.completeSignal.add(function() {
		console.log("load template end");

		$.ajax({
			url: 'assets/config.json',
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function(data) {
				console.log("config load!!!!!");
				console.log(data);
				window.config = data;
				lf.execute(1);
				lf.completeSignal.add(onLoadFeedComplete);

				var hv = new HeaderView();
				$("body").prepend(hv.render());
			}
		});


	});

	var onLoadFeedComplete = function(data) {
		console.log(data);
		loadingFlag = false;
		
		$(window).bind("resize", function() {
			var left = $("#container").offset().left;
			var wid = $("#container").width();
			var right = left + wid - 57 - 8;
			$("#logo").css("left",left + "px");
			$("#setting").css("left", right + "px");
		}).trigger("resize");

		if(startFlag === false){
			startFlag = true;
			setInterval(function() {
				var check = function() {
					var scrollTop  = $("body").scrollTop();
					var windowHeight = $("body").height();
					var allHeight = $(document).height();
					var remain = allHeight - windowHeight - scrollTop;
					console.log(remain);
					if(remain < 50){
						return true;
					}else{
						return false;
					}
				};
				if(check() === true && loadingFlag === false){
					loadingFlag = true;
					lf.execute(1);
				}
			},900);
		}
			console.log("on load feed !!!!!");
			console.log(data);
			var createFeed = function(obj) {
					var im = new ItemModel(obj);
					var iv = new ItemView(im, eb);
					iv.init();
					return iv;
				};
			for (var i = 0; i < data.list.length; i++) {
				var iv = createFeed(data.list[i]);
				$("#feed").append(iv.render());
			}
		};

});