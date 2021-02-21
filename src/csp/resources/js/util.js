var urlOrigin = window.location.origin;

function sendRequest(url, method, data) {
    var d = $.Deferred();

    method = method || "GET";

    $.ajax(url, {
        method: method || "GET",
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

// Utility method to get URL query string
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

// Utility method for login logic
function doLogin(user, password) {
    $.ajax(`${urlOrigin}/forms/login`, {
        headers: {
            "Authorization": `Basic ${btoa(`${user}:${password}`)}`
        },
        success: (data, textStatus, jqXHR) => {
            // todo: enhance this handling
            window.location.href = 'rad.html'
        },
        error: (jqXHR, textStatus, errorThrown) => {
            // todo: handle exception properly...
            console.log(jqXHR, textStatus, errorThrown);
            console.log(jqXHR.status)
            if (jqXHR.status === 401) {
                alert('User or passoword incorrent. Please, try again.')
            } else {
                alert('Sorry, can\'t login. See log for more detail.');
            }
        }
    });
}

// Utility method for logout logic
function doLogout() {
    $.ajax(`${urlOrigin}/forms/logout`, {
        success: (data, textStatus, jqXHR) => {
            // todo: enhance this handling
            window.location.href = 'login.html'
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR, textStatus, errorThrown);
            alert('Error on logout. See log for more detail.');
            window.location.href = 'login.html'
        }
    });
}