sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (e, t, n, o, a) {
	"use strict";
	return e.extend("zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.controller.Object", {
		formatter: n,
		onInit: function () {

			var e, n = new t({
				busy: true,
				delay: 0
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			e = this.getView().getBusyIndicatorDelay();
			this.setModel(n, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				n.setProperty("/delay", e)
			});
		},
		onShareInJamPress: function () {
			var e = this.getModel("objectView"),
				t = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: e.getProperty("/shareOnJamTitle")
						}
					}
				});
			t.open()
		},
		onNavBack: function (e) {
			this.getRouter().getTargets().display("worklist")
		},
		_onObjectMatched: function (e) {
			this.sObjectId = e.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var e = this.getModel().createKey("ContactSet", {
					ContactUUID: this.sObjectId
				});
				this._bindView("/" + e)
			}.bind(this))
		},
		_bindView: function (d) {

			var t = this;
			var n = [];
			var i = this.getModel("objectView"),
				s = this.getModel();

			var r = "/http/API_MKT_INTERACTION_SRV/Interactions?$filter=(InteractionContactUUID%20eq%20guid%27" + t.sObjectId +
				"%27%20and%20InteractionType%20eq%20%27WEB_PROJECT_INFO%27)&$top=10&$orderby=InteractionTimeStampUTC desc&$format=json";
			$.ajax({
				url: r,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				success: function (e, n, o) {

					var a = e.d.results;
					var i = t.getView().byId("lineItemsList");
					if (a.length === 0) {
						t.contactModel = new sap.ui.model.json.JSONModel;
						a = [];
						t.contactModel.setData({
							Interactions: a
						});
						i.setModel(t.contactModel);
						t.contactModel.refresh()
					} else {
						t.contactModel = new sap.ui.model.json.JSONModel;
						t.contactModel.setData({
							Interactions: a
						});
						i.setModel(t.contactModel);
						var s = i.getBindingInfo("items").template;
						i.bindAggregation("items", {
							path: "/Interactions",
							template: s
						})
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				},
				complete: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
			var objectGuid = /'(.*?)'/.exec(d)[1];
			var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + objectGuid +
				"')/ContactOriginData?$filter=ContactOrigin%20eq%20%27SAP_CRM_BUPA%27&$format=json";
			var aData = jQuery.ajax({
				type: "GET",
				url: path,
				dataType: "json",
				contentType: "application/json",
				success: function (e, textStatus, jqXHR) {

					if (e.d.results.length === 0) {
						t.getView().byId("contactTextId").setText("SAP CRM ID:")
					} else {
						t.bindItem = e.d.results[0];
						var contactGuid = t.bindItem.ContactUUID;
						t.getView().byId("MCUIDTextId").setText(contactGuid);
						t.getView().byId("corrAcctNameTextId").setText("Corporate Account Name:" + t.bindItem.CorporateAccountName);
						t.getView().byId("contactTextId").setText("SAP CRM ID:" + t.bindItem.ContactID)
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				},
				complete: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
			this.getView().bindElement({
				path: d,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						s.metadataLoaded().then(function () {
							i.setProperty("/busy", true)
						})
					},
					dataReceived: function () {
						i.setProperty("/busy", false)
					}
				}
			});
		},
		handleListItemPress: function (oEvent) {
			var bCtx = oEvent.getSource().getBindingContext();
			var obj = bCtx.getObject();
			this.getRouter().navTo("interactionDetail", {
				interactionUUID: obj.InteractionUUID
			});
		},
		_onBindingChange: function () {
			var e = this.getView(),
				t = this.getModel("objectView"),
				n = e.getElementBinding();
			if (!n.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return
			}
			var o = this.getResourceBundle(),
				a = e.getBindingContext().getObject(),
				i = a.ContactUUID,
				s = a.FullName;
			t.setProperty("/busy", false);
			t.setProperty("/saveAsTileTitle", o.getText("saveAsTileTitle", [s]));
			t.setProperty("/shareOnJamTitle", s);
			t.setProperty("/shareSendEmailSubject", o.getText("shareSendEmailObjectSubject", [i]));
			t.setProperty("/shareSendEmailMessage", o.getText("shareSendEmailObjectMessage", [s, i, location.href]));
		}
	});
});