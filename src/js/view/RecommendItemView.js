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