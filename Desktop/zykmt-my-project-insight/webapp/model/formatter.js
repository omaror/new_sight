sap.ui.define(["sap/ui/core/format/DateFormat", "sap/ui/core/ValueState", "sap/ui/core/format/FileSizeFormat",
	"sap/ca/ui/model/format/DateFormat", "sap/ca/ui/model/type/Date",
	"sap/ca/ui/model/type/DateTime",
	"sap/ui/Device"
], function (D, V, F, c, a, b, e, f) {
	"use strict";
	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		mediumDateTime: function (v) {
			if (v) {
				return D.getDateTimeInstance({
					style: "medium"
				}).format(v);
			}
			return "";
		},
		format: function (inputDate) {
			var date = new Date(inputDate);
			if (!isNaN(date.getTime())) {
				var day = date.getDate().toString();
				var month = (date.getMonth() + 1).toString();
				// Months use 0 index.

				return (month[1] ? month : '0' + month[0]) + '/' +
					(day[1] ? day : '0' + day[0]) + '/' +
					date.getFullYear();
			}
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
		applyBackendSearchPattern: function (f, b) {
			var F = [];
			b.aApplicationFilters = [];
			b.filter(F);
		},
				formatInterReason: function (reasonText) {
			if (reasonText === 'SAMPLE_REQ_FORM_SUBM') {
				return "Sample Request Form Submit";
			}
		},
		
		
		getCRMID: function (data, formatter) {
			var s = this;
			var i = 0;
			var o = [];
			var r = [];
			var l = "";
			//	l = t.ContactUUID;
			s.interactionList = [];
			if (data !== null) {
				var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + data + "')/ContactOriginData?$format=json";
				var aData = jQuery.ajax({
					type: "GET",
					url: "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + data + "')/ContactOriginData?$format=json",
					dataType: "json",
					contentType: "application/json",
					async: false,
					success: function (e, textStatus, jqXHR) {

						s.result = "";
						s.co = e.d.results.length;
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
										return s.result;
									} else {
										s.result = "";
									}
								}
							}
						}
						return s.result;
					},
					error: function (xhr, status) {

					},
					complete: function (xhr, status) {}
				});

				return s.result;
			}
		},
		UUIDFormatter: function (v) {
			if (v !== null) {
				if (v !== undefined) {
					v = v.replace(/-/g, '');
					return v.toUpperCase();
				}
			}
		}

	};

});