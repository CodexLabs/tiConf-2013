var ui = require('ui'),
	Status = require('Status');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

function loadRows() {
	Status.query(function(e) {
		$.index.remove($.loading.getView());
		if (e.success) {
			var td = [];
			for (var i = 0, l = e.statuses.length; i<l; i++) {
				var status = e.statuses[i];
				td.push(new ui.StatusRow(status));
			}
			$.table.setData(td);
		}
		else {
			ui.alert('networkGenericErrorTitle', 'activityStreamError');
		}
	});
}

//Listen for status update, and refresh.
Ti.App.addEventListener('app:status.update', loadRows);

//Fire manually when this view receives "focus"
$.on('focus', loadRows);

//Show a detail view for rows with an image
$.table.on('click', function(e) {
	if (e.rowData.statusObject.photo) {
		var w = Ti.UI.createView({
			top:'5dp',
			left:'5dp',
			right:'5dp',
			bottom:'5dp'
		});
		
		var close = Ti.UI.createImageView({
			image:'/img/post/close.png',
			top:0,
			left:0,
			zIndex:999
		});
		w.add(close);
		
		var container = Ti.UI.createView({
			backgroundColor:'#000',
			top:'10dp',
			left:'10dp',
			right:'10dp',
			bottom:'10dp'
		});
		w.add(container);
		
		if (OS_IOS) {
			var scroll = Ti.UI.createScrollView({
				contentHeight:'auto',
				contentWidth:'auto',
				maxZoomScale:5,
				minZoomScale:0.75
			});
			scroll.add(Ti.UI.createImageView({
				image:e.rowData.statusObject.photo.urls.medium_640
			}));
			container.add(scroll);
		}
		else {
			var web = Ti.UI.createWebView({
				backgroundColor:'#000',
				html:'<html style="width:1024px;height:1024px;"><body style="background-color:#000;width:1024px;;height:1024px;"><img src="'+ e.rowData.statusObject.photo.urls.medium_640 +'"/></body></html>',
				scalesPageToFit:true
			});
			container.add(web);
		}
		
		$.index.parent.parent.add(w);
		
		close.addEventListener('click', function() {
			$.index.parent.parent.remove(w);
			//force GC on constituent elements
			w = null;
			container = null;
			web = null;
			close = null;
		});
	}
});
