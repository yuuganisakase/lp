//ItemModel.js

var ItemModel = function(_data) {
	var data = _data;
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
		}
	};
}