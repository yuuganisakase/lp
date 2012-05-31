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
		getService:function() {
			return data.main.service;
		},
		getData:function() {
			return data;
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
			isCommentOpen = f;
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
						console.log("load template");
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
//MainItemView.js

var MainItemView = function(_model) {

	var model = _model;
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
			console.log("height :::");
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
//RecommendItemView.js

var RecommendItemView = function(_model) {
	var model = _model;
	var comments = model.getData().comment;
	var commentBox;
	var inputStr = "<input class='commentInput' type='text' name='example1' >";

	return{
		element : "",
		init : function() {

		},
		render : function() {
			var that = this;
			var data = model.getData();
			var comments = data.comment;
			var recommends = data.recommends;

			
			var service = model.getService();
			var actionedMessage;
			if(service === 0){
				actionedMessage = window.config.FBaction.actionedMessage;
			}else{
				actionedMessage = window.config.TWaction.actionedMessage;
			}
			var template = ich.recommendItem({
				actionedMessage: recommends.num + actionedMessage
			})[0];
			
			commentBox = $(template).find(".commentBoxWrapperInner");

			that.createComment(0,commentBox);
			var hh = that.setDisplayCommentNum(2,commentBox).height;
			commentBox.parent().css("height",hh + "px");

			var actionedIconBox = $(template).find(".actionedIcons");
			for (var j = 0; j < 6; j++) {
				var r = recommends.data[j];
				var img = "<img class='recIconImg' src=" + r.img + "></img>";
				actionedIconBox.append(img);
			}
			that.addEvent(template);
			return template;
		},
		setDisplayCommentNum:function(_num,parent) {
			var that = this;
			var hh = 0;
			var num = _num;

			var commentBoxes = parent.find(".commentBox");
			var margin = 0;
			for (var i = comments.length - 1; i >= 0; i--) {
				if(num > 0){
					var eq = commentBoxes.eq(i);
					var cl = eq.clone();
					var h = 0;
					if(i !== (comments.length - 1)){
						cl.append(that.commentHR);
						h += 5;
					}
					cl.find(".snsIcon").css("height","30px").css("width","30px");
					var rec = $("<div class='recommendItem'></div>");

					$("#container").append(rec);
					rec.append(cl);

					if(i === (comments.length-1) && num === comments.length){
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
			console.log(hh);
			return {
				"height": hh,
				"bottom": margin
			};
		},
		commentHR: "<hr class='commentLine'>",
		createComment:function(_num,parent) {
			var that = this;
			var num;
			var data = model.getData();
			if(_num === 0){
				num = data.comment.length;
			}else{
				num = _num;
			}
			for (var i = 0; i < num; i++) {
				var c = data.comment[i];
				var cmp = ich.commentPartial({
					url: c.url,
					snsIcon: c.snsIcon,
					commentName: c.commentName,
					commentTime: c.commentTime,
					commentContents: c.commentContents
				});
				parent.append(cmp);
				if(i !== (num-1)){
					parent.append(that.commentHR);
				}
			}
		},
		addEvent:function(template) {
			var that = this;
			var wrapper = $(template).find(".commentBoxWrapper");
			var inner = $(template).find(".commentBoxWrapperInner");
			var notClickedObj = wrapper.find(".snsIcon");
			notClickedObj.click(function(e) {
				e.stopPropagation();
			});

			wrapper.click(function(e) {

				console.log("comment click");
				console.log(e);
				if($(e.target).hasClass("commentInput")){
					console.log("comment input clicked");
					return;
				}
				var beforeHeight = wrapper.height();
				var afterHeight = that.setDisplayCommentNum(comments.length,inner).height;
				var easing = "easeOutCubic";
				var time = 250;
				var mb;
				var commentNumObj;
				if( model.getRecommendAnimationFlag() === false){
					if(model.getCommentOpen() === false){
						model.setRecommendAnimationFlag(true);
						//afterHeight = that.setDisplayCommentNum(comments.length,inner).height;
						//mb = that.setDisplayCommentNum(comments.length,inner).bottom;

						commentNumObj = that.setDisplayCommentNum(comments.length,inner);
						afterHeight = commentNumObj.height;
						mb = commentNumObj.bottom;

						wrapper.stop().animate( { height: afterHeight},
												{ duration: time*(Math.sqrt(Math.sqrt(comments.length))),
												easing: easing,
												complete: function() {
													model.setCommentOpen(true);
													model.setRecommendAnimationFlag(false);
													that.changeCommentBox();
												}} );
						inner.stop().animate({bottom:mb},{
							duration:time*0.7,
							complete:function() {
								//that.changeCommentBox();
							}
						});
					}else{
						model.setRecommendAnimationFlag(true);
						commentNumObj = that.setDisplayCommentNum(2,inner);
						afterHeight = commentNumObj.height;
						mb = that.setDisplayCommentNum(comments.length,inner).bottom;
						wrapper.stop().animate( { height: afterHeight},
												{ duration: time*1.2*(Math.sqrt(Math.sqrt(comments.length))),
												easing: easing,
												complete: function() {
													model.setCommentOpen(false);
													model.setRecommendAnimationFlag(false);
													that.changeCommentBox();
												}} );
						inner.stop().animate({bottom:-mb},{
							duration:time*0.7,
							complete:function() {
								//that.changeCommentBox();
							}
						});
					}
				}
			});
		},
		changeCommentBox:function() {
			var that = this;
			if(model.getCommentOpen() === true){
				commentBox.css("bottom",0);
				commentBox.append($(that.commentHR).addClass("lastHr")).append(inputStr);
				commentBox.find(".commentInput").fadeOut(0);
				commentBox.find(".commentInput").fadeIn(160);
			}else{
				commentBox.css("bottom",0);
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
$(function() {
	var eb = new signals.Signal();
	var lf = new LoadFeedCommand();
	var lc = new LoadTemplateCommand();
	var startFlag = false;
	var loadingFlag = false;

	lc.execute(["recommendItem", "commentPartial", "mainItem"]);
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
				$("#container").prepend(hv.render());
			}
		});





	});

	var onLoadFeedComplete = function(data) {
		loadingFlag = false;
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
			console.log("on load feed !!!!!")
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