sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/ui/core/format/DateFormat"
], function (e, t, n, o, a, D) {
	"use strict";
	return e.extend("zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.controller.InteractionDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.view.InteractionDetail
		 */
		onInit: function () {
			var e, n = new t({
				busy: true,
				delay: 0
			});
			this.getRouter().getRoute("interactionDetail").attachPatternMatched(this._onObjectMatched, this);
			e = this.getView().getBusyIndicatorDelay();

			this.setModel(n, this.getOwnerComponent().getModel());
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
			var t = this;
			t.interactionUID = e.getParameter("arguments").interactionUUID;
			var sPath = "/http/API_MKT_INTERACTION_SRV/Interactions(guid'" + t.interactionUID + "')?$format=json";
			var aData = jQuery.ajax({
				type: "GET",
				url: sPath,
				dataType: "json",
				contentType: "application/json",
				success: function (e, textStatus, jqXHR) {

					if (e.d.length === 0) {

					} else {
						t.bindItem = e.d;
						t.getView().byId("InteractionType").setText(t.bindItem.InteractionType);
						t.getView().byId("InteractionTimeStampUTC").setText(t.dateFormatter(t.bindItem.InteractionTimeStampUTC));
						t.getView().byId("YY1_OPP_PROJECT_NAME_MIA").setText(t.bindItem.YY1_OPP_PROJECT_NAME_MIA);
						t.getView().byId("YY1_OPP_PROJECT_COUNTR_MIAT").setText(t.bindItem.YY1_OPP_PROJECT_COUNTR_MIAT);
						t.getView().byId("YY1_OPP_PROJECT_CITY_MIA").setText(t.bindItem.YY1_OPP_PROJECT_CITY_MIA);
						t.getView().byId("YY1_OPP_PROJECT_POSTAL_MIA").setText(t.bindItem.YY1_OPP_PROJECT_POSTAL_MIA);
						t.getView().byId("YY1_OPP_PROJECT_CATEGO_MIAT").setText(t.bindItem.YY1_OPP_PROJECT_CATEGO_MIAT);
						t.getView().byId("YY1_OPP_PROJECT_TYPE_MIAT").setText(t.bindItem.YY1_OPP_PROJECT_TYPE_MIAT);
						t.getView().byId("YY1_OPP_PROJECT_STARTP_MIAT").setText(t.bindItem.YY1_OPP_PROJECT_STARTP_MIAT);
						t.getView().byId("YY1_OPP_PROJECT_SIZE_MIAT").setText(t.bindItem.YY1_OPP_PROJECT_SIZE_MIAT);
						t.getView().byId("YY1_OPP_PROJECT_BUILD_MIA").setText(t.removeleadingzero(t.bindItem.YY1_OPP_PROJECT_BUILD_MIA));
						t.getView().byId("YY1_OPP_PROJECT_FLOORS_MIA").setText(t.removeleadingzero(t.bindItem.YY1_OPP_PROJECT_FLOORS_MIA));
						t.getView().byId("YY1_OPP_PROJECT_UNITS_MIA").setText(t.removeleadingzero(t.bindItem.YY1_OPP_PROJECT_UNITS_MIA));
						t.getView().byId("YY1_OPP_TYPE_MIAT").setText(t.bindItem.YY1_OPP_TYPE_MIAT);
						t.getView().byId("YY1_OPP_ENERG_LEVEL_MIAT").setText(t.bindItem.YY1_OPP_ENERG_LEVEL_MIAT);
						t.getView().byId("YY1_OPP_CURR_PHASE_MIAT").setText(t.bindItem.YY1_OPP_CURR_PHASE_MIAT);
						t.getView().byId("InteractionSourceDataURL").setText(t.bindItem.InteractionSourceDataURL);

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
		},
		removeleadingzero: function (t) {
			t = t.replace(/^0+/, '');
			return t;
		},
		directionUrl: function (t) {
			var e = t.getSource();
			var s = e.getProperty("text");
			window.open(s, '_blank')

		},
		onCancel: function () {
			window.history.go(-1);
		},
		dateFormatter: function (v) {
			if (v === null) {
				return "";
			} else {
				var a = new Date(parseInt(v.replace('/Date(', '')));
				return D.getDateInstance({
					style: "medium"
				}).format(a);
			}

		},
		onNavBack: function (e) {
			window.history.go(-1);
		},
		handleListItemPress: function () {
			this.getRouter().navTo("interactionDetail", {
				objectId: this.sObjectId
			});
		},
		_onBindingChange: function () {
			var e = this.getView(),
				t = this.getModel("objectView"),
				n = e.getElementBinding();
		}

	});

});