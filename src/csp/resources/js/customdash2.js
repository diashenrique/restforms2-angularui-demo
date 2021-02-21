var urlOrigin = window.location.origin;
var urlREST = `${urlOrigin}/forms/form`;

var headers = {
  "Authorization": `Basic ${btoa('_system:SYS')}`
};

$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
  console.log(jqXHR.status, event, ajaxSettings, thrownError)
  if (jqXHR.status === 401) {
    window.location.href = 'https://uselooper.com/auth-signin-v1.html'; //'./login';
  }
});

var qs = window.location.search
  .substr(1)
  .split('&')
  .map(item => item.split('='))
  .reduce((acc, curr) => {
    acc[curr[0]] = curr[1];
    return acc;
  }, {});
var formName = qs.formName || 'Form.Test.Person';

$(document).ready(function () {

  $("#divFormName").text(` ${formName}`);

  var todoStore = new DevExpress.data.CustomStore({
    key: "ID",
    /*
    load: function () {
      var promise = new Promise((resolve, reject) => {
        $.ajax({
          url: `${urlREST}/objects/${formName}/allobj?size=1000000`,
          headers: headers,
          dataType: "json",
          success: (data) => {
            console.log(data.children);
            resolve(data.children)
          }
        });
      });
      return promise;
    },
    */
    load: function () {
      return sendRequest(`${urlREST}/objects/${formName}/allobj?size=1000000`);
    },
    insert: function (values) {
      return $.ajax({
        url: `${urlREST}/object/${formName}`,
        method: "POST",
        headers: headers,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: `${urlREST}/object/${formName}/${encodeURIComponent(key)}`,
        method: "PUT",
        headers: headers,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: `${urlREST}/object/${formName}/${encodeURIComponent(key)}`,
        method: "DELETE",
        headers: headers
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
    headers: headers,
    processData: false,
    contentType: "application/json",
    error: (jqXHR, textStatus, errorThrown) => {
      console.log(jqXHR.status, textStatus, errorThrown)
      if (jqXHR.status === 500) {
        alert(`Form not found: ${formName}`)
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
      // console.log(rf2FormInfo, cols);

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
});