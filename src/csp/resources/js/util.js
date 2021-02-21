var headers = {
    "Authorization": `Basic ${btoa('_system:SYS')}`
};

function sendRequest(url, method, data) {
    var d = $.Deferred();

    method = method || "GET";

    $.ajax(url, {
        method: method || "GET",
        headers: headers,
        data: data,
        cache: false,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        var jsonResult = {}
        jsonResult.data = result.children;
        d.resolve(method === "GET" ? result.children : result);
    }).fail(function (xhr) {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
}

// utility method to get URL query string
function getQueryString() {
  return window.location.search
    .substr(1)
    .split('&')
    .map(item => item.split('='))
    .reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
}