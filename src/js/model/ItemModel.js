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