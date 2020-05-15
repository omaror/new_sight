sap.ui.define(["sap/ui/base/Object", "sap/base/Log"], function (t, e) {
	"use strict";
	return t.extend("zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.controller.ListSelector", {
		constructor: function () {

			this._oWhenListHasBeenSet = new Promise(function (t) {
				this._fnResolveListHasBeenSet = t
			}.bind(this));
			this.oWhenListLoadingIsDone = new Promise(function (t, e) {
				this._oWhenListHasBeenSet.then(function (n) {

					var results = this._oList.getItems();
					if (results.length > 19) {

						for (var i = 0; i < results.length; i++) {

							var contact2 = this.asyncContactRevision(results[i]);
							results[i].LastChangedByUser = contact2;
							var context = results[i].mAggregations.content[0].mAggregations.items[0].getBindingContext();
							var obj = context.getProperty(null, context);
							this.allcount = 0;
							var contactid = this.asyncContactRevision(obj);
							//results[i].LastChangedByUser = contactid;
							obj.LastChangedByUser = contactid;
							//this.result = "";
						}
					}
					var sPath = n.getBinding("items").getPath(); //path to table's data
					var oModel = n.getBinding("items").getModel(); //model which is bound to the table
					n.getBinding("items").attachEventOnce("dataReceived", function (c) {

						if (this._oList.getItems().length) {
							t({
								list: n
							});
							var M = this._oList.getModel();
							M.setRefreshAfterChange(false);
						} else {
							e({
								list: n
							})
						}
					}.bind(this))
				}.bind(this))
			}.bind(this))
		},
		asyncContactRevision: function (t) {
			var s = this;
			var i = 0;
			var o = [];
			var r = [];
			var l = "";
			l = t.ContactUUID;
			s.interactionList = [];
			var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + l + "')/ContactOriginData?$format=json";
			var aData = jQuery.ajax({
				type: "GET",
				url: "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + l + "')/ContactOriginData?$format=json",
				dataType: "json",
				contentType: "application/json",
				async: false,
				success: function (e, textStatus, jqXHR) {

					t.co = e.d.results.length;
					i = 0;
					if (e === undefined) {
						s.result = "";
					} else {
						if (e.d.results.length === 0) {
							s.result = "";
						} else {
							i++;
							for (var j = 0; j < e.d.results.length; j++) {
								if (e.d.results[j].ContactOrigin === "SAP_CRM_BUPA") {
									s.result = e.d.results[j].ContactID;
									return;
								} else {
									s.result = "";
								}
							}
						}
					}

				},
				error: function (xhr, status) {
					console.log(xhr);
				},
				complete: function (xhr, status) {
					console.log(xhr);
				}
			});
		},
		setBoundMasterList: function (t) {
			// this._oList = t;
			// this._fnResolveListHasBeenSet(t)
		},
		selectAListItem: function (t) {
			this.oWhenListLoadingIsDone.then(function () {
				var e = this._oList,
					n;
				if (e.getMode() === "None") {
					return
				}
				n = e.getSelectedItem();
				if (n && n.getBindingContext().getPath() === t) {
					return
				}
				e.getItems().some(function (n) {
					if (n.getBindingContext() && n.getBindingContext().getPath() === t) {
						e.setSelectedItem(n);
						return true
					}
				})
			}.bind(this), function () {
				e.warning("Could not select the list item with the path" + t + " because the list encountered an error or had no items")
			})
		},
		clearMasterListSelection: function () {
			this._oWhenListHasBeenSet.then(function () {
				this._oList.removeSelections(true)
			}.bind(this))
		}
	})
});