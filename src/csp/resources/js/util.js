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
        console.log("utilJS ",result.children);
        d.resolve(method === "GET" ? result.children : result);
    }).fail(function (xhr) {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
}