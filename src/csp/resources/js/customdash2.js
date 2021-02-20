var urlOrigin = window.location.origin;
var urlREST = `${urlOrigin}/forms/form`;

var headers = {
  "Authorization": `Basic ${btoa('_system:SYS')}`
};
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

  var todoStore = new DevExpress.data.CustomStore({
    key: "ID",
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
    }
  });

  // Field types
  // adapted from: https://github.com/intersystems-community/restforms-angular/blob/develop/src/app/services/data.service.ts
  var FieldType = {
    // Implemented
    "String": '%Library.String',
    "VarString": '%Library.VarString',
    "Date": '%Library.Date',
    "Numeric": '%Library.Numeric',
    "Integer": '%Library.Integer',
    "TimeStamp": '%Library.TimeStamp',
    "Time": 'time',
    "Boolean": '%Library.Boolean',
    "Serial": 'serial',
    "Form": 'form',
    "List": 'list',
    "Array": 'array'
  }

  // adapted from: https://github.com/intersystems-community/restforms-angular/blob/develop/src/app/services/data.service.ts
  var getSimpleType = function (type) {
    switch (type) {
      case '%Library.Char':
        return FieldType.String;
      case '%Library.DateTime':
        return FieldType.TimeStamp;
      case '%Library.BigInt':
      case '%Library.SmallInt':
      case '%Library.TinyInt':
        return FieldType.Integer;
      case '%Library.Decimal':
      case '%Library.Double':
      case '%Library.Float':
      case '%Library.Currency':
        return FieldType.Numeric;
      case '%Library.Time':
      case '%Library.PosixTime':
        return FieldType.Time;
    }
    return type;
  }

  // adapted from: https://github.com/intersystems-community/restforms-angular/blob/develop/src/app/services/data.service.ts
  var getPropType = function (prop) {
    switch (prop.collection) {
      case 'array': {
        return prop.jsonreference === 'ID' ? FieldType.List : FieldType.Array;
      }
      case 'list':
        return FieldType.List;
    }

    if (prop.category.toLowerCase() === 'datatype') {
      return getSimpleType(prop.type);
    }

    if (prop.category === 'form') {
      return FieldType.Form;
    }

    if (prop.category === 'serial') {
      return FieldType.Serial;
    }

    return FieldType.String;
  }

  var getDevExtremeFieldType = function (rf2Field) {
    const fieldType = getPropType(rf2Field);
    switch (fieldType) {
      case FieldType.Integer:
      case FieldType.Numeric:
        return "number";
      case FieldType.Date:
        return "date";
      case FieldType.Time:
      case FieldType.TimeStamp:
        return "datetime";
      case FieldType.Boolean:
        return "boolean";
      case FieldType.Form:
        return "number";
      default:
        return "string";
    }
  }

  $.ajax({
    url: `${urlREST}/info/${formName}`,
    method: "GET",
    headers: headers,
    processData: false,
    contentType: "application/json",
    error: () => {
      alert(`Form not found: ${formName}`)
    },
    complete: (resp) => {
      var rf2FormInfo = resp.responseJSON;
      var cols = rf2FormInfo.fields.map(rf2Field => {
        
        var objCol = {
          dataField: rf2Field.name,
          caption: rf2Field.displayName,
          dataType: getDevExtremeFieldType(rf2Field)
        }
        
        if(getPropType(rf2Field) == FieldType.Form){
          console.log("Campo relacionado ", objCol);  
          
          objCol.lookup = {
            dataSource: {
              store: new DevExpress.data.CustomStore({
                key: "_id",
                //loadMode: "raw",
                load: function () {
                  var lookupForm = rf2Field.type;
                  var fieldValue = rf2Field.name.valueOf();
                  return sendRequest(`${urlREST}/objects/${lookupForm}/info`);
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

      $("#divTodoList").dxDataGrid({
        dataSource: todoStore,
        showBorders: true,
        showBorders: true,
        columnHidingEnabled: true,
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