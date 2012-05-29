//ItemModel.js

var ItemModel = function(_data) {
	var data = _data;
	return{
		getService:function() {
			return data.main.service;
		},
		getData:function() {
			return data;
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