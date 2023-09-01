sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (bStatus) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (bStatus) {
			case false:
				return oResourceBundle.getText("StatusA");
			case true:
				return oResourceBundle.getText("StatusB");
			default:
				return bStatus;
			}
		}
	};
});