//ItemModel.js

var ItemModel = function(_data) {
	var data = _data;
	var recommendAnimationFlag = false;
	var isCommentOpen = false;
	var isActionedOpen = false;
	var likeFlag;
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
		getPlestLike:function() {
			var that = this;
			return that.likeFlag;
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