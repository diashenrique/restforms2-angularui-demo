var urlOrigin = window.location.origin;
var urlREST = `${urlOrigin}/forms/form`;

$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
  console.log(jqXHR.status, event, ajaxSettings, thrownError)
  if (jqXHR.status === 401) {
    window.location.href = 'login.html';
  }
});

var qs = getQueryString();
var formName = qs.formName || 'Form.Test.Person';

$(document).ready(function () {
  $("#divFormName").text(` ${formName}`);
  createDefaultCRUDForm();
});

var createDefaultCRUDForm = function() {
  var todoStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return sendRequest(`${urlREST}/objects/${formName}/allobj?size=1000000`);
    },
    insert: function (values) {
      return $.ajax({
        url: `${urlREST}/object/${formName}`,
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: `${urlREST}/object/${formName}/${encodeURIComponent(key)}`,
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: `${urlREST}/object/${formName}/${encodeURIComponent(key)}`,
        method: "DELETE",
      });
    },
    onBeforeSend: function (method, ajaxOptions) {
      ajaxOptions.xhrFields = {
        withCredentials: true
      };
    }
  });

  $.ajax({
    url: `${urlREST}/info/${formName}`,
    method: "GET",
    processData: false,
    contentType: "application/json",
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(jqXHR.status, textStatus, errorThrown)
      if (jqXHR.status === 500) {
        notify(`Form not found: ${formName}`, NotificationEnum.ERROR);
      }
      return true;
    },
    complete: (resp) => {
      var rf2FormInfo = resp.responseJSON;
      var cols = rf2FormInfo.fields.map(rf2Field => {

        var objCol = {
          dataField: rf2Field.name,
          caption: rf2Field.displayName,
          dataType: getDevExtremeFieldType(rf2Field)
        }

        if (getPropType(rf2Field) == FieldType.Form) {
          console.log("Campo relacionado ", objCol);
          var lookupForm = rf2Field.type;
          var fieldValue = rf2Field.name.valueOf();
          objCol.lookup = {
            dataSource: {
              store: new DevExpress.data.CustomStore({
                key: "_id",
                //loadMode: "raw",
                load: function () {
                  console.log(`${urlREST}/objects/${lookupForm}/info`);
                  return sendRequest(`${urlREST}/objects/${lookupForm}/info`);
                },
                byKey: function (key) {
                  console.log(`${urlREST}/objects/${lookupForm}/${key}`);
                  return sendRequest(`${urlREST}/object/${lookupForm}/${key}`);
                }
              })
            },
            valueExpr: "_id",
            displayExpr: "displayName"
          }

        };

        return objCol;
      });

      $("#divRAD").dxDataGrid({
        dataSource: todoStore,
        showBorders: true,
        columnsAutoWidth: true,
        columnHidingEnabled: true,
        searchPanel: {
          visible: true,
          width: 240,
          placeholder: "Search..."
        },
        editing: {
          mode: "form",
          allowAdding: true,
          allowUpdating: true,
          allowDeleting: true
        },
        columns: cols
      });
    }
  });
}