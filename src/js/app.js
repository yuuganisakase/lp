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


			}
		});

	});

	var onLoadFeedComplete = function(data) {
		var hv = new HeaderView();
		$("body").prepend(hv.render());

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