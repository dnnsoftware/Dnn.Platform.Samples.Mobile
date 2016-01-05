(function () {
    var app;

    document.addEventListener("deviceready", function () {  
        navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body);
    }, false);

    window.app = app;
}());