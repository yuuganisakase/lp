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