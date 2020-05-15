/*
 * Copyright (C) 2009-2016 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/library", "sap/ui/model/json/JSONModel"], function(l, J) {
	"use strict";
	return {
		generateTemplateForEntity: function(m, e) {
			var t = {};
			var E = m.getServiceMetadata().dataServices.schema[0].entityType;
			for (var i = 0; i < E.length; i++) {
				if (E[i].name === e) {
					var p = E[i].property;
					for (var j = 0; j < p.length; j++) {
						switch (p[j].type) {
							case "Edm.Boolean":
								{
									t[p[j].name] = false;
									break;
								}
							case "Edm.DateTime":
								{
									t[p[j].name] = null;
									break;
								}
							default:
								t[p[j].name] = "";
						}
					}
					break;
				}
			}
			return t;
		},
		changesExist: function(s, t) {
			var c = false;
			for (var k in s) {
				if (t[k] !== undefined && s[k] !== t[k]) {
					c = true;
					break;
				}
			}
			return c;
		},
		getStartupParameters: function(c) {
			if (c && c.getOwnerComponent() && c.getOwnerComponent().getComponentData()) {
				return c.getOwnerComponent().getComponentData().startupParameters;
			}
		},
		getStartupParameter: function(c, p) {
			var s = this.getStartupParameters(c);
			if (s && s[p] && s[p].length) {
				return decodeURIComponent(s[p][0]);
			}
		},
		readOData: function(m, r, u, f, c, a) {
			var s = function(R) {
				var o = {};
				var k = r;
				o[k] = R.results;
				if (c) {
					c(o);
				}
			};
			var e = function(E) {
				if (a) {
					E.responseText = jQuery.parseJSON(E.responseText);
					E = {
						type: l.MessageType.Error,
						code: E.responseText.error.code,
						message: E.responseText.error.message.value,
						details: E.responseText.error.innererror.Error_Resolution.SAP_Note
					};
					a(E);
				} else {
					jQuery.sap.log.error("Read request failed in cus.crm.mytickets.model.util - readOData:" + E.responseText);
				}
			};
			m.read(r, {
				urlParameters: u,
				filters: f,
				success: s,
				error: e
			});
		},
		getCustomizingModel: function(c) {
			var a, C;
			if (c && c.getOwnerComponent()) {
				a = c.getOwnerComponent().byId("app").byId("idAppControl");
				C = a.getModel("Customizing");
				if (!C) {
					C = new J();
					a.setModel(C, "Customizing");
				}
			}
			return C;
		},
		isCustomizingRead: function(c, p) {
			var C = this.getCustomizingModel(c);
			if (C) {
				for (var i = 0; i < p.length; i++) {
					if (!C.getProperty(p[i])) {
						return false;
					}
				}
			} else {
				return false;
			}
			return true;
		},
		readCustomizing: function(c, a) {
			jQuery.sap.log.debug("cus.crm.mytickets.model.util - readCustomizing");
			var C = {
				"priorities": {
					data: "/CustomizingPriorityCollection",
					urlParameters: {},
					filters: []
				}
			};
			var o = this.getCustomizingModel(c);
			var A = function(R) {
				var p = R[C.priorities.data];
				if (p) {
					p.unshift({
						priorityID: "",
						priority: c.getModel("i18n").getResourceBundle().getText("none")
					});
					o.setProperty("/PriorityCustomizing", p);
				}
				if (a) {
					a.call(c);
				}
			};
			var r = [C.priorities];
			for (var i = 0; i < r.length; i++) {
				this.readOData(c.getModel(), r[i].data, r[i].urlParameters, r[i].filters, A);
			}
		},
		// readStatusCustomizing: function(c, a) {
		// 	jQuery.sap.log.debug("cus.crm.mytickets.model.util - readStatusCustomizing");
		// 	var C = {
		// 		"status": {
		// 			data: "/CustomizingStatusCollection",
		// 			urlParameters: {},
		// 			filters: this.getProcessTypeFilter(c)
		// 		}
		// 	};
		// 	var o = this.getCustomizingModel(c);
		// 	var A = function(R) {
		// 		var s = R[C.status.data];
		// 		if (s) {
		// 			o.setProperty("/StatusCustomizing", s);
		// 		}
		// 		if (a) {
		// 			a.call(c);
		// 		}
		// 	};
		// 	var r = [C.status];
		// 	for (var i = 0; i < r.length; i++) {
		// 		this.readOData(c.getModel(), r[i].data, r[i].urlParameters, r[i].filters, A);
		// 	}
		// },
		getProcessTypeFilter: function(c) {
			var f = [];
			var t = this.getStartupParameter(c, "typeID");
			if (t) {
				f.push(new sap.ui.model.Filter("typeID", sap.ui.model.FilterOperator.EQ, t));
			}
			return f;
		},
		getRefreshObject: function(m, c, e) {
			if (!this.refreshList) {
				this.refreshList = new sap.m.List();
			} else {
				this.refreshList.unbindElement();
				this.refreshList.setModel(null);
			}
			var L = this.refreshList;
			if (e) {
				L.bindElement(c, {
					expand: e
				});
			} else {
				L.bindElement(c);
			}
			L.setModel(m);
			var b = L.getElementBinding();
			var C = jQuery.proxy(function() {
				b = null;
			}, this);
			b.attachEventOnce("dataRequested", null, C, this);
			var r = {
				refresh: function(d) {
					if (d) {
						b.attachEventOnce("dataReceived", null, d, this);
					}
					if (b) {
						b.refresh();
					}
				},
				destroy: function() {
					C();
				}
			};
			return r;
		},
		getStatusIDForProperty: function(c, p) {
			var C = this.getCustomizingModel(c);
			if (C) {
				var s = C.getProperty("/StatusCustomizing");
				if (s) {
					for (var i = 0; i < s.length; i++) {
						var S = s[i];
						if (S[p]) {
							return S.statusID;
						}
					}
				}
			}
		}
	};
});