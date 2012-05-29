//ItemModel.js

var ItemModel = function(_data) {
	var data = _data;
	return{
		likeFlag:false,
		likeSignal: new signals.Signal(),
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
			var box = "<div class='item'></div>";
			return $(box).append(mv.render()).append(rv.render()).append("<div style='clear:both;'></div>");
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
				console.log("mouseover");
				target.find(".actionedBox").stop().animate( { opacity: "1"}, { duration: time, easing: 'easeOutQuad'} );
			}).mouseleave(function() {
				target.find(".actionedBox").stop().animate( { opacity: "0"}, { duration: time*1.2, easing: 'easeOutQuad'} );
			});
			target.find(".actionedBox").trigger("mouseleave");

			target.find(".plestLike").click(function() {
				model.togglePlestlike();
			});

			model.likeSignal.add(function(val) {
				console.log(val);
				var time = 60;
				var one = target.find(".plestLike1");
				var two = target.find(".plestLike2");
				if(val === true){
					if(_.isUndefined(one) === false){
						one.stop().animate({"opacity": "0"}, {duration:time});
					}
					if(_.isUndefined(two) === false){
						two.stop().animate({"opacity": "1"}, {duration:time});
					}
					
				}else{
					if(_.isUndefined(one) === false){
						one.stop().animate({"opacity": "1"}, {duration:time});
					}
					if(_.isUndefined(two) === false){
						two.stop().animate({"opacity": "0"}, {duration:time});
					}
				}
			});

		}
	};
};
//RecommendItemView.js

var RecommendItemView = function(_model) {
	var model = _model;
	return{
		element : "",
		init : function() {

		},
		render : function() {
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
			
			var commenbox = $(template).find(".commentBoxWrapper");

			for (var i = 0; i < 2; i++) {
				var c = comments[i];
				console.log("comment model");
				console.log(c);
				console.log(comments[0]);
				var cmp = ich.commentPartial({
					snsIcon: c.snsIcon,
					commentName: c.commentName,
					commentTime: c.commentTime,
					commentContents: c.commentContents
				});
				commenbox.append(cmp);
				if(i !== 1){
					commenbox.append("<hr class='commentLine'>");
				}
			}

			var actionedIconBox = $(template).find(".actionedIcons");
			for (var j = 0; j < 6; j++) {
				var r = recommends.data[j];
				var img = "<img class='recIconImg' src=" + r.img + "></img>";
				actionedIconBox.append(img);
			}

			return template;
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