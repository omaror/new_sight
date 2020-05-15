sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/ui/Device", "sap/ui/core/Fragment", "sap/ui/core/routing/History", "sap/m/GroupHeaderListItem",
	"../model/util"
], function (t, e, s, a, n, i, o, r, G, u) {
	"use strict";
	return t.extend("zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.controller.Worklist", {
		formatter: s,
		util: u,
		onInit: function () {

			this.count = 0;
			this.interactionList = [];
			this.copyinteractionList = [];
			var l = this.byId("list"),
				v = this._createViewModel(),
				o = l.getBusyIndicatorDelay();
			this._oList = l;
			this.showBusyIndicator();
			this.criterion = "2";
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(v, "masterView");

			l.attachEvent("updateFinished", function () {
				if (v.getProperty("/delay") !== o) {
					v.setProperty("/delay", o);
				}
				if (!this.oPrevItem) {
					this.oPrevItem = this._oList.getSelectedItem();
				}
				if (this._oList.getSelectedItem()) {
					jQuery.sap.focus(this._oList.getSelectedItem().getFocusDomRef());
				}
			}.bind(this));
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(l);
				}.bind(this)
			});
			this.byId("searchField").addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.getRouter().getRoute("worklist").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
			//	var n = u.generateTemplateForEntity(this.getOwnerComponent().getModel(), "Note");
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oODataModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this._oODataModel.setRefreshAfterChange(false);

		},
		_createGroupHeader: function (g) {
			return new G({
				title: g.text,
				upperCase: false
			});
		},
		onFilterPress: function (t) {
			var b = this;
			b.filterPoint = "";
			b.showBusyIndicator();
			var s = "";
			var a = t.getParameters();
			if (a.sortItem) {
				s = a.sortItem.getProperty("key")
			}
			var n = [];
			b.interactionResult = [];
			b.contactList = [];
			b.interArray = [];
			//	b.interactionList = [];
			if (s === "1") {
				b.criterion = "1";
				b.mastername = "All Contacts";
				b.bindContactFilter();
			} else if (s === "2") {
				b.criterion = "2";
				b.mastername = "All Contacts with Project Information";
				b.bindInteractionContact();

			}
		},
		bindInteractionContact: function () {
			var b = this;
			b.showBusyIndicator();
			var s = "";
			var n = [];
			b.interactionResult = [];
			b.contactList = [];
			b.interArray = [];
			//	b.interactionList = [];
			b.mastername = "All Contacts with Project Information";
			var i =
				"/http/API_MKT_INTERACTION_SRV/Interactions?$filter=InteractionType%20eq%20%27WEB_PROJECT_INFO%27&$top=500&$inlinecount=allpages&$format=json";
			var aData = jQuery.ajax({
				url: i,
				type: "GET",
				dataType: "json",

				contentType: "application/json",
				success: function (t, s, a) {
					b.interactionCont = [];
					b.contactList = [];
					b.interArray = [];
					//	var r = [];
					var n = t.d.results;
					b.interArray.push(n);
					if (n.length === 0) {
						b.contactList = [];
						b.contactModel = new sap.ui.model.json.JSONModel;
						e.contactModel.setData({
							ContactSet: b.contactList
						});
						b.co = b.contactList.length;
						b._updateListItemCount(b.co);
						b._oList.setModel(b.contactModel);
						b._oList.bindElement("/");
					} else {}
				},
				error: function (xhr, status) {
					console.log(xhr);
				},
				complete: function (xhr, status) {

					b.interactionCont = [];
					b.interArray = b.interArray[0];
					for (var i = 0; i < b.interArray.length; i++) {
						b.intContId = b.interArray[i].InteractionContactUUID;
						var url = "";
						url = "ContactUUID%20eq%20guid%27" + b.intContId + "%27";
						b.contactList = [];
						var aData = jQuery.ajax({
							type: "GET",
							url: "/http/API_MKT_CONTACT_SRV/Contacts?$format=json&$top=20&$skip=0&$filter=" + url,
							contentType: "application/json",
							dataType: "json",
							async: false,
							success: function (data, textStatus, jqXHR) {

								b.interactionList = [];
								b.contactList = [];
								b.contactList.push(data.d.results[0]);

							},
							error: function (xhr, status) {
								console.log(xhr);
							},
							complete: function (xhr, status) {

								for (var k = 0; k < b.contactList.length; k++) {
									b.fullContact = b.contactList[k];
									var l = b.contactList[k].ContactUUID;
									var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + l + "')/ContactOriginData?$format=json";
									b.aData4 = jQuery.ajax({
										type: "GET",
										url: "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + l + "')/ContactOriginData?$format=json",
										dataType: "json",
										contentType: "application/json",
										success: function (rslt, textStatus, jqXHR) {
											b.interactionCont.push(rslt.d.results);
										},
										error: function (xhr, status) {

										},
										complete: function (xhr, status) {
											b.arrint = [];
											b.arrint = b.interactionCont;

										}
									});

								}
							}

						});
					}
					b.aData4.done(function (response, textStatus, jqXHR) {
						var arrk = [];
						var nestarr = [];
						if (b.arrint === undefined) {
							for (var z = 0; z < b.interactionCont.length; z++) {
								nestarr = b.interactionCont[z];
								for (var n = 0; n < nestarr.length; n++) {
									arrk.push(nestarr[n]);
								}
							}
						} else {
							for (var z = 0; z < b.arrint.length; z++) {
								nestarr = b.arrint[z];
								for (var n = 0; n < nestarr.length; n++) {
									arrk.push(nestarr[n]);
								}
							}
						}
						var result = [];
						// store flags
						var flags = [];

						for (i = 0; i < arrk.length; i++) {
							// dont run the rest of the loop if we already have this timestamp
							if (flags[arrk[i].ContactUUID]) continue;

							// if we didn't have the flag stored, then we need to record it in the result
							result.push(arrk[i]);

							// if we don't yet have the flag, then store it so we skip it next time
							flags[arrk[i].ContactUUID] = true;
						}
						var r = [];

						for (var j = 0; j < result.length; j++) {
							if (result[j].ContactOrigin === "SAP_CRM_BUPA") {
								var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + result[j].ContactUUID + "')?$format=json";
								b.aData4 = jQuery.ajax({
									type: "GET",
									url: "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + result[j].ContactUUID + "')?$format=json",
									dataType: "json",
									async: false,
									contentType: "application/json",
									success: function (rslt, textStatus, jqXHR) {
										result[j].ContactUUID = result[j].ContactUUID;
										result[j].FullName = rslt.d.FirstName + " " + rslt.d.LastName;
										result[j].EmailAddress = rslt.d.EmailAddress;
										result[j].CountryName = rslt.d.CountryName;
										result[j].LastChangedByUser = result[j].ContactID;
										r.push(result[j]);
									},
									error: function (xhr, status) {

									},
									complete: function (xhr, status) {

									}
								});

							} else {
								var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + result[j].ContactUUID + "')?$format=json";
								b.aData4 = jQuery.ajax({
									type: "GET",
									url: "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + result[j].ContactUUID + "')?$format=json",
									dataType: "json",
									async: false,
									contentType: "application/json",
									success: function (rslt, textStatus, jqXHR) {
										result[j].ContactUUID = result[j].ContactUUID;
										result[j].FullName = rslt.d.FirstName + " " + rslt.d.LastName;
										result[j].EmailAddress = rslt.d.EmailAddress;
										result[j].CountryName = rslt.d.CountryName;
										result[j].LastChangedByUser = "";
										r.push(result[j]);
									},
									error: function (xhr, status) {

									},
									complete: function (xhr, status) {

									}
								});
							}
						}
						b.interactionList.push(r);
						b.interactionList = b.interactionList[0];
						b.contactModel = new sap.ui.model.json.JSONModel();
						b.contactModel.setData({
							ContactSet: b.interactionList
						});
						b.co = b.interactionList.length;
						b._updateListItemCount(b.co);
						b._oList.setModel(b.contactModel);
						b._oList.bindAggregation("items", {
							path: "/ContactSet",
							sorter: [new sap.ui.model.Sorter("ContactUUID", false)],
							groupHeaderFactory: this._createGroupHeader,
							template: b._oList.getItems()[0].clone()
						});
						b.hideBusyIndicator();
						b.fullContact = "";
					});

				}
			});
		},
		onOpenViewSettings: function (t) {
			var e = "filter";
			if (t.getSource() instanceof sap.m.Button) {
				var s = t.getSource().getId();
				if (s.match("sort")) {
					e = "sort"
				} else if (s.match("group")) {
					e = "group"
				}
			}
			if (!this.byId("viewSettingsDialog")) {
				o.load({
					id: this.getView().getId(),
					name: "zymkt.my.project.insigth.ZYKMT_MY_PROJECT_INSIGHT.view.ViewSettingsDialog",
					controller: this
				}).then(function (t) {
					this.getView().addDependent(t);
					t.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					t.open(e)
				}.bind(this))
			} else {
				this.byId("viewSettingsDialog").open(e)
			}
		},
		_createViewModel: function () {
			return new e({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "ContactUUID",
				groupBy: "None"
			})
		},
		_onMasterMatched: function (t) {
			var e = this;
			e.bindContactSet();
		},
		bindContactSet: function () {
			var b = this;
			b.contactList = [];
			//	b.mastername = "";
			var e = [];
			var s = null;
			b.allcount = 0;
			b.co = e;
			b.filterPoint = "";
			var s = "";
			var n = [];
			b.interactionResult = [];
			b.interArray = [];
			b.bindInteractionContact();
		},
		onBypassed: function () {
			this._oList.removeSelections(true);
		},
		loadData2: function () {
			var e = this;
			var aItems = e._oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				var path = e._oList.getItems()[i].getBindingContextPath();
				var results = e._oList.getItems()[i].getBindingContext().getObject();
				e.contactResult = results;
				e.allcount = 0;
				e.asyncContact(e.contactResult, e.top);

			}
		},
		refreshList: function (d) {
			var that = this;
			var listItems = that.byId("list").mAggregations.items;
			if (listItems.length != 0) {
				for (var i = 0; i < d; i++) {
					var context = listItems[i].mAggregations.content[0].mAggregations.items[0].getBindingContext();
					var obj = context.getProperty(null, context);
					that.allcount = 0;
					that.asyncContactRevision(obj);
					obj.LastChangedByUser = that.result;
					that.result = "";
				}
				that.byId("list").getModel().refresh();
			}
		},
		asyncContactRevision: function (t) {
			var s = this;
			var i = 0;
			var o = [];
			var r = [];
			var l = "";
			l = t.ContactUUID;
			//	s.interactionList = [];
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

				}
			});
		},
		onUpdateFinished: function (t) {

			var e = this;
			var s = 0;
			var a = 0;
			var n = [];
			e.mastername = "";
			var i = t.getParameter("actual");
			e.byId("pullToRefresh").hide();
			var o = e.getView().getModel();
			if (t.getParameter("reason") === "Change") {
				if (e.interArray != undefined) {
					if (e.interArray.length != 0) {
						if (i === e.interArray.length) {
							var r = this._oList.getItems();
							for (var l = 0; l < r.length; l++) {
								var c = r[l];
								var u = c.getBindingContext();
								var d = u.getProperty(null, u);
								n.push(d)
							}
							if (n.length === r.length) {
								n = n.filter(function (t, e, s) {
									return s.indexOf(t) == e
								});
								var h = new sap.ui.model.json.JSONModel;
								h.setData({
									ContactSet: n
								});
								e._oList.setModel(h);
								e._oList.bindElement("/");
								e.interArray = [];
							}
						} else {
							return false;
						}
					}
				}
			} else if (t.getParameter("reason") === "Refresh" || t.getParameter("reason") === "Growing") {

			}
		},
		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		showBusyIndicator: function (t, e) {
			sap.ui.core.BusyIndicator.show(e);
			if (t && t > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}
			}
		},
		modelBind: function (t) {
			var e = this;
			var s = e.getView().getModel();
			e.contactList = [];
			if (t > 20) {
				e.showBusyIndicator();
				t = t + 20
			} else if (t === undefined) {
				t = 40
			} else if (t === 20) {
				e.showBusyIndicator();
				t = t + 20
			} else {
				return false
			}
			s.read("/ContactSet", {
				urlParameters: "$skip=" + t + "&$top=20",
				success: function (s) {
					for (var a = 0; a < s.results.length; a++) {
						e.contactResult = s.results[a];
						e.asyncContact(e.contactResult, t)
					}
				},
				error: function (t) {
					console.log(xhr);
				}
			})
		},
		bindFilter: function (t) {
			var e = this;
			e.url = "";
			e.filterPoint = "";
			e.showBusyIndicator();
			//	e.mastername = "";
			var n = "";
			if (t.bAnd === undefined) {
				n = " or "
			} else {
				n = " and "
			}
			if (t[0].aFilters !== undefined) {
				t = t[0].aFilters;
				for (var a = 0; a < t.length; a++) {
					if (t[a].sOperator === "Contains") {
						e.url = e.url + n + "substringof('" + t[a].oValue1 + "' ," + t[a].sPath + ")"
					} else {
						t[a].sOperator = t[a].sOperator.toLowerCase();
						e.url = e.url + n + t[a].sPath + " " + t[a].sOperator + " " + "'" + t[a].oValue1 + "'"
					}
				}
				e.url = e.url.slice(4);
				e.contactList = [];
				e.copyinteractionList = [];
				//	e.interactionList = [];
				var o = jQuery.ajax({
					type: "GET",
					url: "/http/API_MKT_CONTACT_SRV/Contacts?$format=json&$top=500&$filter=" + e.url + "",
					contentType: "application/json",
					dataType: "json",
					async: false,
					success: function (t, n, a) {
						e.filterPoint = "1";
						e.showBusyIndicator();
						e.countdatacount = t.d.results.length;
						for (var o = 0; o < t.d.results.length; o++) {
							e.contactResult = t.d.results[o];
							e.allcount = 0;
							e.asyncContact(e.contactResult, "5000")
						}
					},
					error: function (t, e) {
						console.log(t)
					},
					complete: function (t, e) {}
				})
			} else {
				var s = 0;
				e.url = "";
				for (var a = 0; a < t.length; a++) {
					if (t[a].sOperator === "Contains") {
						e.url = e.url + " and " + "substringof('" + t[a].oValue1 + "' ," + t[a].sPath + ")"
					} else {
						if (t[a].sPath === "ContactUUID") {
							s++;
							e.url = e.url + "ContactUUID%20eq%20guid%27" + t[a].oValue1 + "%27"
						} else {
							t[a].sOperator = t[a].sOperator.toLowerCase();
							e.url = e.url + " and " + t[a].sPath + " " + t[a].sOperator + " " + "'" + t[a].oValue1 + "'"
						}
					}
				}
				if (s === 1 && t.length === 1) {} else {
					e.url = e.url.slice(4)
				}
				var e = this;
				e.contactList = [];
				e.copyinteractionList = [];
				var i = jQuery.ajax({
					type: "GET",
					url: "/http/API_MKT_CONTACT_SRV/Contacts?$format=json&$top=500&$filter=" + e.url + "",
					contentType: "application/json",
					dataType: "json",
					success: function (t, n, a) {
						e.showBusyIndicator();
						e.filterPoint = "1";
						for (var o = 0; o < t.d.results.length; o++) {
							e.countdatacount = t.d.results.length;
							e.contactResult = t.d.results[o];
							e.allcount = 0;
							e.asyncContact(e.contactResult, "5000")
						}
					},
					error: function (t, e) {
						console.log(t)
					},
					complete: function (t, e) {}
				})
			}
		},
		asyncContact: function (t, e) {
			var n = this;
			var a = 0;
			var o = [];
			var s = [];
			var i = "";
			if (t.InteractionContactUUID === undefined) {
				i = t.ContactUUID
			} else {
				if (t.InteractionContactUUID !== "") {
					i = t.InteractionContactUUID
				} else {
					i = t.ContactUUID
				}
			}
			n.interactionList = [];
			var r = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + i + "')/ContactOriginData?$format=json";
			var l = jQuery.ajax({
				type: "GET",
				url: "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + i + "')/ContactOriginData?$format=json",
				dataType: "json",
				contentType: "application/json",
				async: true,
				success: function (e, o, i) {
					n.interactionList = [];
					var arrk = [];
					a = 0;
					if (e === undefined) {
						var e = {
							d: [{
								results: [{
									ContactUUID: t.ContactUUID,
									FullName: t.FullName,
									EmailAddress: t.EmailAddress,
									CountryName: t.CountryName,
									LastChangedByUser: ""
								}]
							}]
						}
					} else {
						if (e.d.results.length === 0) {
							e.d.results.ContactUUID = t.ContactUUID;
							e.d.results.FullName = t.FullName;
							e.d.results.EmailAddress = t.EmailAddress;
							e.d.results.CountryName = t.CountryName;
							e.d.results.LastChangedByUser = ""
						} else {
							a++;
							for (var r = 0; r < e.d.results.length; r++) {
								if (e.d.results[r].ContactOrigin === "SAP_CRM_BUPA") {
									e.d.results[0].ContactUUID = t.ContactUUID;
									e.d.results[0].FullName = t.FullName;
									e.d.results[0].EmailAddress = t.EmailAddress;
									e.d.results[0].CountryName = t.CountryName;
									e.d.results[0].LastChangedByUser = e.d.results[r].ContactID;
									break;
								} else {
									e.d.results[0].ContactUUID = t.ContactUUID;
									e.d.results[0].FullName = t.FullName;
									e.d.results[0].EmailAddress = t.EmailAddress;
									e.d.results[0].CountryName = t.CountryName;
									e.d.results[0].LastChangedByUser = ""
								}
							}
						}
					}
					if (n.interactionResult !== undefined) {
						if (n.interactionResult.length !== 0) {
							if (a === 1) {
								s.push(e.d.results[0]);
								n.interactionList.push(s[0]);
								n.contactModel = new sap.ui.model.json.JSONModel()
							} else {
								s.push(e.d.results[0]);
								n.interactionList.push(s[0]);
								n.interactionList = n.interactionList[0];
								n.contactModel = new sap.ui.model.json.JSONModel()
							}

							n.copyinteractionList.push(n.interactionList[0]);
							n.contactModel.setData({
								ContactSet: n.copyinteractionList
							});
							n._oList.setModel(n.contactModel);
							n.co = n.interactionList.length;
							n._updateListItemCount(n.copyinteractionList.length)
							n.hideBusyIndicator()
						} else {
							if (a === 1) {
								s.push(e.d.results[0]);
								n.interactionList.push(s[0]);
								n.contactModel = new sap.ui.model.json.JSONModel()
							} else {
								s.push(e.d.results[0]);
								n.interactionList.push(s[0]);
								n.contactModel = new sap.ui.model.json.JSONModel()
							}
							n.copyinteractionList.push(n.interactionList[0]);
							if (n.countdatacount === n.copyinteractionList.length) {
								arrk = n.copyinteractionList;
								var result = [];
								// store flags
								var flags = [];

								for (i = 0; i < arrk.length; i++) {
									// dont run the rest of the loop if we already have this timestamp
									if (flags[arrk[i].ContactUUID]) continue;

									// if we didn't have the flag stored, then we need to record it in the result
									result.push(arrk[i]);

									// if we don't yet have the flag, then store it so we skip it next time
									flags[arrk[i].ContactUUID] = true;
								}
								var r = [];
								n.contactModel.setData({
									ContactSet: result
								});
								n._oList.setModel(n.contactModel);
								n.co = n.interactionList.length;
								n._updateListItemCount(n.copyinteractionList.length)
								n.hideBusyIndicator()
							}
						}
					} else {
						if (a === 1) {
							s.push(e.d.results[0]);
							n.interactionList.push(s[0]);
							n.contactModel = new sap.ui.model.json.JSONModel
						} else {
							s.push(e.d.results[0]);
							n.interactionList.push(s[0]);
							n.contactModel = new sap.ui.model.json.JSONModel
						}
						if (n.countdatacount === n.copyinteractionList.length) {
							n.co = n.interactionList.length;
							n.copyinteractionList.push(n.interactionList[0]);
							n.contactModel.setData({
								ContactSet: n.copyinteractionList
							});
							n._updateListItemCount(n.co);
							n._oList.setModel(n.contactModel);
							n.hideBusyIndicator()
						}
						e.d.results = [];
						if (n.allcount === 1) {
							n.co = n.allresult;
							n._updateListItemCount(n.allresult)
							n.hideBusyIndicator()
						}
					}
				},
				error: function (t, e) {
					console.log(t)
				},
				complete: function (t, e) {}
			});
			if (n.filterPoint === "1") {
				var c = jQuery.ajax({
					type: "GET",
					url: "/http/API_MKT_CONTACT_SRV/Contacts/$count?$filter=" + n.url + "",
					contentType: "application/json",
					dataType: "json",
					success: function (t, e, a) {
						n.co = t;
						n._updateListItemCount(t)
					},
					error: function (t, e) {
						console.log(t)
					},
					complete: function (t, e) {}
				})
			}
		},
		_updateListItemCount: function (t) {
			var e;
			if (this.co === t && this.mastername === "") {
				//if (this._oList.getBinding("items").isLengthFinal()) {
				e = this.getResourceBundle().getText("masterTitleCount", [t]);
				this.getView().byId("page").setTitle(e);
				//	this.getModel().setProperty("/title", e)
				//}
			} else {
				e = this.mastername + " (" + t + ")";
				this.getView().byId("page").setTitle(e);
				//	this.getModel().setProperty("/title", e)
			}
		},
		onfilterSearch: function (t) {
			this.filterPoint = "";
			var e = t.getParameter("query");
			this._oListFilterState.aSearch = [];
			var n = [];
			this.mastername = "";
			if (this.criterion === "1") {
				this.mastername = "All Contacts";
				if (e === "") {
					this._oListFilterState.aSearch = [];
					this.bindContactFilter();
				} else {
					if (Object.values(e).indexOf("@") > -1) {
						n.push(new a("EmailAddress", sap.ui.model.FilterOperator.EQ, e));
						this.bindFilter(n)
					} else {
						if (e.length === 32) {
							this._oListFilterState.aSearch = [];
							var s = e.toLowerCase();
							var i = s.substr(0, 8) + "-" + s.substr(8, 4) + "-" + s.substr(12, 4) + "-" + s.substr(16, 4) + "-" + s.substr(20, 12);
							n.push(new a("ContactUUID", sap.ui.model.FilterOperator.EQ, i));
							this.bindFilter(n)
						} else if (e.length > 32) {
							if (Object.values(e).indexOf("-") > -1) {
								n.push(new a("ContactUUID", sap.ui.model.FilterOperator.EQ, e));
								this.bindFilter(n)
							}
						} else {
							var r = parseFloat(e);
							if (isNaN(r)) {
								n.push(new sap.ui.model.Filter({
									and: false,
									filters: [new sap.ui.model.Filter("FullName", sap.ui.model.FilterOperator.Contains, e), new sap.ui.model.Filter(
										"CountryName", sap.ui.model.FilterOperator.Contains, e)]
								}));
								this.bindFilter(n)
							} else {
								if (typeof r === "number") {
									if (e.length === 10) {
										n.push(new a("ContactOrigin", sap.ui.model.FilterOperator.EQ, "SAP_CRM_BUPA"));
										n.push(new a("ContactID", sap.ui.model.FilterOperator.EQ, e));
										this.contactFilter(n)
									} else {
										n.push(new a("ContactOrigin", sap.ui.model.FilterOperator.EQ, "SAP_CRM_BUPA"));
										n.push(new a("ContactID", sap.ui.model.FilterOperator.Contains, e));
										this.contactFilter(n)
									}
								} else {
									n.push(new a("ContactOrigin", sap.ui.model.FilterOperator.EQ, "SAP_CRM_BUPA"));
									n.push(new a("CountryName", sap.ui.model.FilterOperator.Contains, e));
									this.bindFilter(n)
								}
							}
						}
					}
				}
			} else if (this.criterion === "2") {
				this.mastername = "All Contacts with Project Information";
				n = [];
				if (e === "") {
					this._oListFilterState.aSearch = [];
					this.bindInteractionContact();
					n = [];
				} else {
					if (Object.values(e).indexOf("@") > -1) {
						n = new sap.ui.model.Filter("EmailAddress", sap.ui.model.FilterOperator.EQ, e);
						var filters = [];
						var list = this.getView().byId("list");
						var binding = list.getBinding("items");
						binding.filter([n]);

					} else {
						if (e.length === 32) {
							this._oListFilterState.aSearch = [];
							var s = e.toLowerCase();
							var i = s.substr(0, 8) + "-" + s.substr(8, 4) + "-" + s.substr(12, 4) + "-" + s.substr(16, 4) + "-" + s.substr(20, 12);
							n = new sap.ui.model.Filter("ContactUUID", sap.ui.model.FilterOperator.EQ, i);
							var filters = [];
							var list = this.getView().byId("list");
							var binding = list.getBinding("items");
							binding.filter([n]);

						} else if (e.length > 32) {
							if (Object.values(e).indexOf("-") > -1) {
								n = new sap.ui.model.Filter("ContactUUID", sap.ui.model.FilterOperator.EQ, e);
								var filters = [];
								var list = this.getView().byId("list");
								var binding = list.getBinding("items");
								binding.filter([n]);
							}
						} else {
							var r = parseFloat(e);
							if (isNaN(r)) {
								n = new sap.ui.model.Filter({
									and: false,
									filters: [new sap.ui.model.Filter("FullName", sap.ui.model.FilterOperator.Contains, e), new sap.ui.model.Filter(
										"CountryName", sap.ui.model.FilterOperator.Contains, e)]
								});
								var filters = [];
								var list = this.getView().byId("list");
								var binding = list.getBinding("items");
								binding.filter([n]);

							} else {
								if (typeof r === "number") {
									if (e.length === 10) {
										n.push(new a("ContactOrigin", sap.ui.model.FilterOperator.EQ, "SAP_CRM_BUPA"));
										n.push(new a("ContactID", sap.ui.model.FilterOperator.EQ, e));
										this.contactFilter(n)

									} else {

										n.push(new a("ContactOrigin", sap.ui.model.FilterOperator.EQ, "SAP_CRM_BUPA"));
										n.push(new a("ContactID", sap.ui.model.FilterOperator.Contains, e));
										this.contactFilter(n)

									}
								} else {
									n = new sap.ui.model.Filter({
										and: true,
										filters: [new sap.ui.model.Filter("ContactOrigin", sap.ui.model.FilterOperator.EQ, "SAP_CRM_BUPA"), new sap.ui.model.Filter(
											"CountryName", sap.ui.model.FilterOperator.Contains, e)]
									});

									var filters = [];
									var list = this.getView().byId("list");
									var binding = list.getBinding("items");
									binding.filter([n]);
								}
							}
						}
					}
				}

			}
		},
		bindContactFilter: function () {
			var b = this;
			b.showBusyIndicator();
			b.co = "";
			this.count = 0;
			//		this.interactionList = [];
			var l = this.byId("list"),
				v = this._createViewModel(),
				o = l.getBusyIndicatorDelay();
			this._oList = l;

			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/gw/odata/SAP/SCPYMKTCONTACTSODATA;v=1/ContactSet?$skip=0&$top=1000&$orderby=ContactUUID%20asc",
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					b.co = data.d.results.length;
					b.contactModel = new sap.ui.model.json.JSONModel();
					b.contactModel.setData({
						ContactSet: data.d.results
					});
					b._oList.setModel(b.contactModel);

					b._oList.bindAggregation("items", {
						path: "/ContactSet",
						sorter: [new sap.ui.model.Sorter("ContactUUID", false)],
						groupHeaderFactory: this._createGroupHeader,
						template: b._oList.getItems()[0].clone()
					});

					var aData = jQuery.ajax({
						type: "GET",
						contentType: "application/json",
						url: "/http/API_MKT_CONTACT_SRV/Contacts/$count",
						dataType: "json",
						success: function (data, textStatus, jqXHR) {
							b.co = data;
							b.allresult = data;
							b.mastername = "All Contacts";
							b._updateListItemCount(data);
							b.hideBusyIndicator();
						},
						error: function (xhr, status) {
							console.log(xhr);
						},
						complete: function (xhr, status) {}
					});
				},
				error: function (xhr, status) {
					console.log(xhr);
				},
				complete: function (xhr, status) {}
			});

		},
		contactFilter: function (t) {
			this.filterPoint = "";
			var url = "";
			//	this.mastername = "";
			for (var k = 0; k < t.length; k++) {
				if (t[k].sOperator === "Contains") {
					url = url + " and " + "substringof('" + t[k].oValue1 + "' ," + t[k].sPath + ")";
				} else {
					t[k].sOperator = t[k].sOperator.toLowerCase();
					url = url + " and " + t[k].sPath + " " + t[k].sOperator + " " + "'" + t[k].oValue1 + "'";
				}

			}
			url = url.slice(4);
			var e = this;
			e.contactList = [];
			e.copycontactList = [];
			//			e._oODataModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			if (this.criterion === "1") {
				var aData = jQuery.ajax({
					type: "GET",
					url: "/http/API_MKT_CONTACT_SRV/ContactOriginData?$format=json&$top=500&$filter=" + url + "",
					contentType: "application/json",
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						for (var i = 0; i < data.d.results.length; i++) {
							data.d.results[i].FullName = data.d.results[i].FirstName + " " + data.d.results[i].LastName;
							data.d.results[i].LastChangedByUser = data.d.results[i].ContactID;
							e.contactList.push(data.d.results[i]);
							e.contactModel = new sap.ui.model.json.JSONModel();
							e.contactModel.setData({
								ContactSet: e.contactList
							});
							e._oList.setModel(e.contactModel);
							e._oList.bindElement("/");
						}
						e.co = data.d.results.length;
						e._updateListItemCount(data.d.results.length);
					},
					error: function (xhr, status) {
						console.log(xhr);
					},
					complete: function (xhr, status) {

					}
				});
			} else if (this.criterion === "2") {
				var aData = jQuery.ajax({
					type: "GET",
					url: "/http/API_MKT_CONTACT_SRV/ContactOriginData?$format=json&$top=500&$filter=" + url + "",
					contentType: "application/json",
					dataType: "json",
					async: true,
					success: function (data, textStatus, jqXHR) {
						for (var i = 0; i < data.d.results.length; i++) {
							data.d.results[i].FullName = data.d.results[i].FirstName + " " + data.d.results[i].LastName;
							data.d.results[i].LastChangedByUser = data.d.results[i].ContactID;
							e.contactList.push(data.d.results[i]);
							var contactuid = data.d.results[0].ContactUUID;
							e.contactModel = new sap.ui.model.json.JSONModel();
							e.contactModel.setData({
								ContactSet: e.contactList
							});
							var r = "/http/API_MKT_INTERACTION_SRV/Interactions?$filter=(InteractionContactUUID%20eq%20guid%27" + contactuid +
								"%27%20and%20InteractionType%20eq%20%27WEB_PROJECT_INFO%27)&$top=10&$format=json";
							$.ajax({
								url: r,
								type: "GET",
								dataType: "json",
								contentType: "application/json",
								async: false,
								success: function (data, n, o) {

									if (data.d.results.length === 0) {
										e.contactList = [];
										e.contactModel.setData({
											ContactSet: e.contactList
										});
										e._oList.setModel(e.contactModel);
										e._oList.bindElement("/");
										e.co = e.contactList.length;
										e._updateListItemCount(e.contactList.length);
									} else {
										e._oList.setModel(e.contactModel);
										e._oList.bindElement("/");
										e.co = e.contactList.length;
										e._updateListItemCount(e.contactList.length);
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
						}
						// e.co = data.d.results.length;
						// e._updateListItemCount(data.d.results.length);
					},
					error: function (xhr, status) {
						console.log(xhr);
					},
					complete: function (xhr, status) {

					}
				});
			}
		},
		onSearch: function (t) {
			if (t.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return
			}
			var e = t.getParameter("query");
			if (e.length === 32) {
				this._oListFilterState.aSearch = [];
				var s = e.toLowerCase();
				var i = s.substr(0, 8) + "-" + s.substr(8, 4) + "-" + s.substr(12, 4) + "-" + s.substr(16, 4) + "-" + s.substr(20, 12);
				this._oListFilterState.aSearch = [new a("ContactUUID", n.EQ, i)]
			} else {
				if (e) {
					this._oListFilterState.aSearch = [new a("Name", n.Contains, e)];
					this._oListFilterState.aSearch = [new a("FirstName", n.Contains, e)];
					this._oListFilterState.aSearch = [new a("LastName", n.Contains, e)];
					this._oListFilterState.aSearch = [new a("CountryName", n.Contains, e)];
					this._oListFilterState.aSearch = [new a("ContactID", n.Contains, e)]
				} else {
					this._oListFilterState.aSearch = []
				}
			}
			this._applyFilterSearch()
		},
		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},
		directionUrl: function (t) {
			this.filterPoint = "";
			var e = t.getSource();
			var s = e.getBindingContext();
			var a = s.getPath();
			var n = this._oList.getModel();
			var i = n.getProperty(a);
			var o = i.ContactUUID;
			if (o === undefined || o === "") {
				this.getRouter().getTargets().display("objectNotFound");
			} else {
				this.getRouter().navTo("object", {
					objectId: o
				});
			}
		},
		contactDirectionUrl: function (t) {
			this.filterPoint = "";
			var that = this;
			var e = t.getSource();
			var s = e.getBindingContext();
			var a = s.getPath();
			var n = this._oList.getModel();
			var i = n.getProperty(a);
			//		var objectGuid = /'(.*?)'/.exec(d)[1];
			var path = "/http/API_MKT_CONTACT_SRV/Contacts(guid'" + i.ContactUUID +
				"')/ContactOriginData?$filter=ContactOrigin%20eq%20%27SAP_CRM_BUPA%27&$format=json";
			var aData = jQuery.ajax({
				type: "GET",
				url: path,
				dataType: "json",
				contentType: "application/json",
				success: function (e, textStatus, jqXHR) {

					if (e.d.results.length === 0 || e.d.results === "") {
						that.getRouter().getTargets().display("objectNotFound");
					} else {
						var odata = e.d.results[0].ContactID;
						that.getRouter().navTo("contactObject", {
							contactId: odata
						});
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				},
				complete: function (xhr, status) {

				}
			});

		},
		onPress: function (t) {

			var e = t.getSource(),
				s = t.getParameter("selected");
			if (!(e.getMode() === "MultiSelect" && !s)) {
				this._showObject(t.getParameter("listItem") || t.getSource())
			}
		},
		onShareInJamPress: function () {
			var t = this.getModel("masterView"),
				e = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: t.getProperty("/shareOnJamTitle")
						}
					}
				});
			e.open()
		},
		onRefresh: function () {
			var t = this.byId("list");
			t.getBinding("items").refresh()
		},
		_showObject: function (t) {
			var e = !i.system.phone;
			this.oPrevItem = t;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				objectId: t.getBindingContext().getProperty("ContactUUID")
			})
		},
		_applySearch: function (t) {
			var e = this.byId("table"),
				s = this.getModel("masterView");
			e.getBinding("items").filter(t, "Application");
			if (t.length !== 0) {
				s.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"))
			}
		}
	})
});