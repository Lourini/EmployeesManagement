sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/ui/model/BindingMode',
	'sap/ui/model/json/JSONModel'
], function (Controller, History, BindingMode, JSONModel) {
	"use strict";

	return Controller.extend("formation.TpUI5.controller.Details", {
		onInit: function () {
			//return to page if model List empty
			if(this.getOwnerComponent().getModel("List")===undefined){
				this.getOwnerComponent().getRouter().navTo("Main", {}, true);
			}
			//initialize global variable of vizframe
			this.oVizFrame = this.getView().byId("idVizFrame");
			//initialize local variable of popOver
			var oPopOver = this.getView().byId("idPopOver");
			//connect Popover with vizframe
			oPopOver.connect(this.oVizFrame.getVizUid());

		},
		onSelectChange: function () {
			if (this.getView().byId("slData").getSelectedKey() === "status") {
				this.dataModel = this.getOwnerComponent().getModel("listActive");
				this.getOwnerComponent().setModel(this.dataModel, "List");
			} else if(this.getView().byId("slData").getSelectedKey() === "gender") {
				this.dataModel = this.getOwnerComponent().getModel("ListGender");
				this.getOwnerComponent().setModel(this.dataModel, "List");
			}else{
				this.dataModel = this.getOwnerComponent().getModel("ListCountry");
				this.getOwnerComponent().setModel(this.dataModel, "List");
			}
		},
		//return to Main View
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				this.getView().byId("dataLabelSwitch").setState(false);
				this.getView().byId("slData").setSelectedKey("gender");
				if (this.oVizFrame) {
				this.oVizFrame.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: this.getView().byId("dataLabelSwitch").getState()
						}
					}
				});
			}
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("Main", {}, true);
			}
		},
		//display percentage of gender or status
		onDataLabelChanged: function (oEvent) {
			if (this.oVizFrame) {
				this.oVizFrame.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: oEvent.getParameter('state')
						}
					}
				});
			}
		}
	});

});