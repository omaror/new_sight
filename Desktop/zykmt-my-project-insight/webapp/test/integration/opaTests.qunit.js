/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"zymkt/my/project/insigth/ZYKMT_MY_PROJECT_INSIGHT/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});