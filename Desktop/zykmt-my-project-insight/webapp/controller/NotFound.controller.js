sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed : function () {
			this.getRouter().navTo("worklist");
		},
		onNavButtonPress:function(){
			this.getRouter().getTargets().display("worklist");	
		},

	});

});