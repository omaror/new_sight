sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (e, t, n, o, a) {
	"use strict";
	return e.extend("zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.controller.ContactObject", {
		formatter: n,
		onInit: function () {
			var e, n = new t({
				busy: true,
				delay: 0
			});
			this.getRouter().getRoute("contactObject").attachPatternMatched(this._onObjectMatched, this);
			e = this.getView().getBusyIndicatorDelay();
			this.setModel(n, "objectView");
			// this.getOwnerComponent().getModel().sServiceUrl = "/http/API_MKT_CONTACT_SRV/";
			// this.getOwnerComponent().getModel().oMetadata.sUrl = "/http/API_MKT_CONTACT_SRV/$metadata?sap-language=EN";
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				n.setProperty("/delay", e)
			})
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
		handleListItemPress: function (oEvent) {
			var bCtx = oEvent.getSource().getBindingContext();
			var obj = bCtx.getObject();
			this.getRouter().navTo("interactionDetail", {
				interactionUUID: obj.InteractionUUID
			});
		},
		_onObjectMatched: function (e) {
			this.sContactId = e.getParameter("arguments").contactId;
			this.getView().byId("contactTextId").setText("SAP CRM ID:" + this.sContactId);
			this._bindView("/" + e);
		},
		_bindView: function () {
			var t = this;
			var n = [];
			var i = this.getModel("objectView"),
				s = this.getModel();
			n.push(new o("ContactOrigin", a.EQ, "SAP_CRM_BUPA"));
			n.push(new o("ContactID", a.EQ, t.sContactId));
			var url = "";
			for (var k = 0; k < n.length; k++) {
				if (n[k].sOperator === "Contains") {
					url = url + " and " + "substringof('" + n.oValue1 + "' ," + n[k].sPath + ")";
				} else {
					n[k].sOperator = n[k].sOperator.toLowerCase();
					url = url + " and " + n[k].sPath + " " + n[k].sOperator + " " + "'" + n[k].oValue1 + "'";
				}

			}
			url = url.slice(4);
			t.contactList = [];
			var aData = jQuery.ajax({
				type: "GET",
				url: "/http/API_MKT_CONTACT_SRV/ContactOriginData?$format=json&$top=100&$filter=" + url + "",
				contentType: "application/json",
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var contactGuid = data.d.results[0].ContactUUID;
					t.getView().byId("MCUIDTextId").setText(contactGuid);
					t.getView().byId("corrAcctNameTextId").setText("Corporate Account Name:" + data.d.results[0].CorporateAccountName);
					var e = t.getModel().createKey("ContactSet", {
						ContactUUID: contactGuid
					});
					e = "/" + e;
					var r = "/http/API_MKT_INTERACTION_SRV/Interactions?$filter=(InteractionContactUUID%20eq%20guid%27" + contactGuid +
						"%27%20and%20InteractionType%20eq%20%27WEB_PROJECT_INFO%27)&$top=10&$format=json";
					$.ajax({
						url: r,
						type: "GET",
						dataType: "json",
						contentType: "application/json",
						success: function (e, n, o) {
							var a = e.d.results;
							var i = t.getView().byId("lineItemsList");
							if (a.length === 0) {
								t.contactModel = new sap.ui.model.json.JSONModel();
								a = [];
								t.contactModel.setData({
									Interactions: a
								});
								i.setModel(t.contactModel);
								t.contactModel.refresh()
							} else {
								t.contactModel = new sap.ui.model.json.JSONModel();
								t.contactModel.setData({
									Interactions: a
								});
								i.setModel(t.contactModel);
								var template = i.getBindingInfo("items").template;
								i.bindAggregation("items", {
									path: "/Interactions",
									template: template
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
					t.getView().bindElement({
						path: e,
						events: {
							change: t._onBindingChange.bind(t),
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
				error: function (xhr, status) {

				},
				complete: function (xhr, status) {}
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
			t.setProperty("/shareSendEmailMessage", o.getText("shareSendEmailObjectMessage", [s, i, location.href]))
		}
	})
});