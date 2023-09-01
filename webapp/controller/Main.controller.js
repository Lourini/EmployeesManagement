sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Toolbar",
    "sap/m/ObjectAttribute",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Label",
    "sap/m/Input",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "lourini/employees/model/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    Toolbar,
    ObjectAttribute,
    Dialog,
    DialogType,
    Button,
    ButtonType,
    Label,
    Input,
    Filter,
    FilterOperator,
    FilterType,
    formatter,
    MessageBox,
    MessageToast,
    Sorter,
    Fragment
  ) {
    "use strict";

    return Controller.extend("lourini.employees.controller.Main", {
      //formatter of status
      formatter: formatter,
      //arrays of selection
      aContexts: [],
      onInit: function () {
        // this.oMyModel = new JSONModel();
        // this.oMyModel.loadData("./model/employees.json");
        // this.getView().setModel(this.oMyModel, "Employees");
        // var oCountry = new JSONModel();
        // oCountry.loadData("./model/country.json");
        // this.getView().setModel(oCountry, "country");
        // oCountry.setSizeLimit(200);
        var oData = this.getView().getModel("Employees").getData();
        var oCountry = { country: [] };
        for (var i = 0; i < oData.Employees.length; i++) {
          if (
            oData.Employees[i].country !== "" &&
            !oCountry.country.some((e) => e.name == oData.Employees[i].country)
          ) {
            oCountry.country.push({
              name: oData.Employees[i].country,
              value: 0,
            });
          }
        }
        this.getView().setModel(new JSONModel(oCountry), "country");
      },
      onCreateEmployee: function () {
        this.oCreateEmp.then(
          function (oDialog) {
            var oView = this.getView();
            // Get the Model in the view
            var oModel = oView.getModel("Employees");
            if (
              sap.ui.getCore().byId("idFirstName").getValue().length > 0 &&
              sap.ui.getCore().byId("idLastName").getValue().length > 0 &&
              sap.ui.getCore().byId("idEmail").getValue().length > 0 &&
              sap.ui.getCore().byId("idPhone").getValue().length > 0
            ) {
              // Get the Number of records in the OData Employees
              var EmployeesNumber = oModel.getProperty("/Employees").length;

              // Populate the new Employee ID
              var NewEmployeeID = EmployeesNumber + 1;

              var oEmployee = {
                id: NewEmployeeID,
                firstname: sap.ui.getCore().byId("idFirstName").getValue(),
                lastname: sap.ui.getCore().byId("idLastName").getValue(),
                gender: sap.ui.getCore().byId("idGender").getSelectedKey(),
                email: sap.ui.getCore().byId("idEmail").getValue(),
                phone: sap.ui.getCore().byId("idPhone").getValue(),
                position: sap.ui.getCore().byId("idPosition").getValue(),
                city: sap.ui.getCore().byId("idCity").getValue(),
                zipcode: sap.ui.getCore().byId("idZipcode").getValue(),
                country: sap.ui.getCore().byId("idCountry").getSelectedKey(),
                avatar: sap.ui.getCore().byId("idAvatar").getValue(),
                active: sap.ui.getCore().byId("idActive").getState(),
              };
              //Get the Employees
              var oEmployees = oModel.getProperty("/Employees");
              // Add the new Employee
              oEmployees.push(oEmployee);
              oModel.setProperty("/Employees", oEmployees);
              oDialog.close();
            }
          }.bind(this)
        );
      },
      onOpenCreate: function () {
        if (!this.oCreateEmp) {
          this.oCreateEmp = Fragment.load({
            name: "lourini.employees.view.fragment.CreateEmployee",
            controller: this,
          });
        }
        this.oCreateEmp.then(
          function (oDialog) {
            this.getView().addDependent(oDialog);
            oDialog.open();
          }.bind(this)
        );
      },
      onDeleteConfirmation: function (oEvent) {
        var aArray = oEvent
          .getSource()
          .getBindingContext("Employees")
          .getPath()
          .split("/");
        this.iPos = aArray[aArray.length - 1];
        if (!this.oDeleteDialog) {
          this.oDeleteDialog = Fragment.load({
            name: "lourini.employees.view.fragment.DeleteConfirm",
            controller: this,
          });
        }
        this.oDeleteDialog.then(
          function (oDialog) {
            this.getView().addDependent(oDialog);
            oDialog.open();
          }.bind(this)
        );
      },
      onDelete: function (oEvent) {
        var oModel = this.getView().getModel("Employees");
        oModel.getData().Employees.splice(this.iPos, 1);
        oModel.refresh(true);
        this.onCloseDelete();
      },
      onEditEmployee: function () {
        this.oEmp.firstname = sap.ui.getCore().byId("idFirstname").getValue();
        this.oEmp.lastname = sap.ui.getCore().byId("idLastname").getValue();
        this.oEmp.email = sap.ui.getCore().byId("idemail").getValue();
        this.oEmp.city = sap.ui.getCore().byId("idcity").getValue();
        this.oEmp.zipcode = sap.ui.getCore().byId("idzipcode").getValue();
        this.oEmp.gender = sap.ui.getCore().byId("idgender").getSelectedKey();
        this.oEmp.country = sap.ui.getCore().byId("idcountry").getSelectedKey();
        this.oEmp.phone = sap.ui.getCore().byId("idphone").getValue();
        this.oEmp.position = sap.ui.getCore().byId("idposition").getValue();
        this.oEmp.avatar = sap.ui.getCore().byId("idavatar").getValue();
        if (
          sap.ui.getCore().byId("idFirstname").getValue().length > 0 &&
          sap.ui.getCore().byId("idLastname").getValue().length > 0 &&
          sap.ui.getCore().byId("idemail").getValue().length > 0 &&
          sap.ui.getCore().byId("idphone").getValue().length > 0
        ) {
          this.getView().getModel("Employees").refresh(true);
          this.onCloseDialog();
        }
      },
      onOpenDialog: function (oEvent) {
        var oSource = oEvent.getSource();
        this.oEmp = oSource.getBindingContext("Employees").getObject();
        var oView = this.getView();
        // create dialog lazily
        // create dialog via fragment factory
        if (!this.oUpdateDialog) {
          this.oUpdateDialog = Fragment.load({
            name: "lourini.employees.view.fragment.UpdateDialog",
            controller: this,
          });
        }
        this.oUpdateDialog.then(
          function (oDialog) {
            oView.addDependent(oDialog);
            sap.ui.getCore().byId("idFirstname").setValue(this.oEmp.firstname);
            sap.ui.getCore().byId("idLastname").setValue(this.oEmp.lastname);
            sap.ui.getCore().byId("idcity").setValue(this.oEmp.city);
            sap.ui.getCore().byId("idemail").setValue(this.oEmp.email);
            sap.ui.getCore().byId("idzipcode").setValue(this.oEmp.zipcode);
            sap.ui.getCore().byId("idgender").setSelectedKey(this.oEmp.gender);
            sap.ui.getCore().byId("idphone").setValue(this.oEmp.phone);
            sap.ui
              .getCore()
              .byId("idcountry")
              .setSelectedKey(this.oEmp.country);
            sap.ui.getCore().byId("idposition").setValue(this.oEmp.position);
            sap.ui.getCore().byId("idavatar").setValue(this.oEmp.avatar);
            oDialog.open();
          }.bind(this)
        );
      },
      onInputChange: function (oEvent) {
        var oSource = oEvent.getSource();
        if (oSource.getValue() === "") oSource.setValueState("Error");
        else oSource.setValueState();
      },
      onCloseDialog: function () {
        this.oUpdateDialog.then(
          function (oDialog) {
            oDialog.close();
          }.bind(this)
        );
      },
      onCloseEmp: function () {
        this.oCreateEmp.then(
          function (oDialog) {
            oDialog.close();
          }.bind(this)
        );
      },
      onCloseEmpInfo: function () {
        this.DisplayDialog.then(
          function (oDialog) {
            oDialog.close();
          }.bind(this)
        );
      },
      onCloseDeleteAll: function () {
        this.oDeleteAllDialog.then(
          function (oDialog) {
            oDialog.close();
          }.bind(this)
        );
        this.getView().byId("idEmployeesTable").removeSelections();
      },
      onCloseDelete: function () {
        this.oDeleteDialog.then(
          function (oDialog) {
            oDialog.close();
          }.bind(this)
        );
      },
      onSearch: function (oEvent) {
        // build filter array
        var aFilter = [];
        var sQuery = oEvent.getSource().getValue();
        // filter binding
        var oTable = this.byId("idEmployeesTable");
        var oBinding = oTable.getBinding("items");
        if (sQuery) {
          aFilter.push(
            new Filter({
              filters: [
                new Filter({
                  path: "firstname",
                  operator: FilterOperator.Contains,
                  value1: sQuery,
                }),
                new Filter({
                  path: "lastname",
                  operator: FilterOperator.Contains,
                  value1: sQuery,
                }),
              ],
            })
          );
          oBinding.filter(aFilter);
        } else {
          oBinding.filter("");
        }
      },
      onSelectionChange: function (oEvent) {
        var oList = oEvent.getSource();
        this.aContexts = oList.getSelectedContexts(true);
      },
      onDeleteAllConfirmation: function () {
        if (this.aContexts.length > 0) {
          var oEmps = {
            nombre: this.aContexts.length,
          };
          var oEmpLength = new JSONModel({
            nombre: this.aContexts.length,
          });
          this.getView().setModel(oEmpLength, "EmpLength");
          var oView = this.getView();

          if (!this.oDeleteAllDialog) {
            this.oDeleteAllDialog = Fragment.load({
              name: "formation.TpUI5.view.fragment.DeleteAllConfirm",
              controller: this,
            });
          }
          this.oDeleteAllDialog.then(
            function (oDialog) {
              oView.addDependent(oDialog);
              oDialog.open();
            }.bind(this)
          );
        } else {
          MessageBox.information(
            "Please select the choices before clicking here"
          );
        }
      },
      onDeleteAll: function () {
        var oModel = this.getView().getModel("Employees");
        var oEmplyees = oModel.getData().Employees;

        var Ipos;
        for (var i = this.aContexts.length - 1; i >= 0; i--) {
          Ipos = this.aContexts[i].getPath().split("/")[2];
          oEmplyees.splice(Ipos, 1);
        }
        //refresh the model after delete
        oModel.refresh();
        //Empty array of selection
        this.aContexts = [];
        //close fragment DeleteAll
        this.onCloseDeleteAll();
      },
      handleSortButtonPressed: function () {
        var oView = this.getView();
        if (!this.oSorterDialog) {
          this.oSorterDialog = Fragment.load({
            name: "lourini.employees.view.fragment.SortDialog",
            controller: this,
          });
        }
        this.oSorterDialog.then(
          function (oDialog) {
            oView.addDependent(oDialog);
            oDialog.open();
          }.bind(this)
        );
      },
      handleSortDialogConfirm: function (oEvent) {
        var oTable = this.byId("idEmployeesTable"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          sPath,
          bDescending,
          aSorters = [];

        sPath = mParams.sortItem.getKey();
        bDescending = mParams.sortDescending;
        aSorters.push(new Sorter(sPath, bDescending));

        // apply the selected sort and group settings
        oBinding.sort(aSorters);
        this.onCloseSorter();
      },
      onCloseSorter: function () {
        this.oSorterDialog.then(
          function (oDialog) {
            oDialog.close();
          }.bind(this)
        );
      },
      onDetail: function (oEvent) {
        var oSource = oEvent.getSource();
        this.oEmp = oSource.getBindingContext("Employees").getObject();
        var oEmpInfo = new JSONModel({
          id: this.oEmp.id,
          firstname: this.oEmp.firstname,
          lastname: this.oEmp.lastname,
          gender: this.oEmp.gender,
          email: this.oEmp.email,
          phone: this.oEmp.phone,
          position: this.oEmp.position,
          city: this.oEmp.city,
          zipcode: this.oEmp.zipcode,
          country: this.oEmp.country,
          avatar: this.oEmp.avatar,
          active: this.oEmp.active,
        });
        this.getView().setModel(oEmpInfo, "Emp");
        if (!this.DisplayDialog) {
          this.DisplayDialog = Fragment.load({
            name: "lourini.employees.view.fragment.EmployeeInfos",
            controller: this,
          });
        }
        this.DisplayDialog.then(
          function (oDialog) {
            this.getView().addDependent(oDialog);
            oDialog.open();
          }.bind(this)
        );
      },
      onDetails: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var Male = 0;
        var Female = 0;
        var active = 0;
        var inactive = 0;
        var oCountry = this.getView().getModel("country").getData().country;
        if (this.aContexts.length > 0) {
          for (var i = this.aContexts.length - 1; i >= 0; i--) {
            if (this.aContexts[i].getObject().gender === "Male") {
              Male++;
            } else {
              Female++;
            }
            if (this.aContexts[i].getObject().active === true) {
              active++;
            } else {
              inactive++;
            }
          }
          for (var j = 0; j < oCountry.length; j++) {
            oCountry[j].value =
              (this.aContexts.filter(
                (e) => e.getObject().country == oCountry[j].name
              ).length *
                100) /
              this.aContexts.length;
          }
          Male = (Male * 100) / this.aContexts.length;
          Female = (Female * 100) / this.aContexts.length;
          active = (active * 100) / this.aContexts.length;
          inactive = (inactive * 100) / this.aContexts.length;
          var listGender = {
            List: [
              {
                name: "Male",
                value: Male,
              },
              {
                name: "Female",
                value: Female,
              },
            ],
          };
          var listActive = {
            List: [
              {
                name: "Active",
                value: active,
              },
              {
                name: "In-Active",
                value: inactive,
              },
            ],
          };
          oCountry = oCountry.filter(e=>e.value!==0);
          var listCountry = { List: [...oCountry] };
          this.getView().byId("idEmployeesTable").removeSelections();
          listGender = new JSONModel(listGender);
          listActive = new JSONModel(listActive);
          listCountry = new JSONModel(listCountry);
          //display model by default
          this.getOwnerComponent().setModel(listGender, "List");
          //gender model
          this.getOwnerComponent().setModel(listGender, "ListGender");
          //active model
          this.getOwnerComponent().setModel(listActive, "listActive");
          this.getOwnerComponent().setModel(listCountry, "ListCountry");
          //remove the choices selected
          this.getView().byId("idEmployeesTable").removeSelections();
          //Empty array of selection
          this.aContexts = [];
          //navigation to Details page
          oRouter.navTo("Details");
        } else {
          MessageBox.information(
            "Please select the choices before clicking here"
          );
        }
      },
      onSelectChange: function () {
        //recuperate MultiComboBox arrays
        this.aActive = this.getView().byId("slActive").getSelectedKeys();
        this.aGender = this.getView().byId("slGender").getSelectedKeys();
        this.aCountry = this.getView().byId("slCountry").getSelectedKeys();
        // filter binding
        this.getView()
          .byId("idEmployeesTable")
          .getBinding("items")
          .filter(this.getFilters());
      },

      getFilters: function () {
        //build array filter
        var aFilters = [];
        var aActive = this.aActive.map(function (sCriteria) {
          return new Filter("active", FilterOperator.EQ, sCriteria === "true");
        });
        var aGender = this.aGender.map(function (sCriteria) {
          return new Filter("gender", FilterOperator.EQ, sCriteria);
        });
        var aCountry = this.aCountry.map(function (sCriteria) {
          return new Filter("country", FilterOperator.EQ, sCriteria);
        });
        //add all arrays filters in one array
        aFilters = [...aActive, ...aGender, ...aCountry];

        return aFilters;
      },
    });
  }
);
