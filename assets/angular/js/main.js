var app = angular.module("susi", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../pages/main.html",
            controller: "mainController"
        })
        .when("/chat", {
            templateUrl: "./chat.htm"
        });
});
app.controller('mainController', function($scope) {

});

app.service('anchorSmoothScroll', function($document, $window) {

    var document = $document[0];
    var window = $window;

    function getCurrentPagePosition(window, document) {
        // Firefox, Chrome, Opera, Safari
        if (window.pageYOffset) return window.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
    }

    function getElementY(document, element) {
        var y = element.offsetTop;
        var node = element;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        }
        return y;
    }

    this.scrollDown = function(startY, stopY, speed, distance) {

        var timer = 0;

        var step = Math.round(distance / 25);
        var leapY = startY + step;

        for (var i = startY; i < stopY; i += step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY += step;
            if (leapY > stopY) leapY = stopY;
            timer++;
        }
    };

    this.scrollUp = function(startY, stopY, speed, distance) {

        var timer = 0;

        var step = Math.round(distance / 25);
        var leapY = startY - step;

        for (var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }
    };

    this.scrollToTop = function(stopY) {
        scrollTo(0, stopY);
    };

    this.scrollTo = function(elementId, speed) {

        var element = document.getElementById(elementId);

        if (element) {
            var startY = getCurrentPagePosition(window, document);
            var stopY = getElementY(document, element);

            var distance = stopY > startY ? stopY - startY : startY - stopY;

            if (distance < 100) {
                this.scrollToTop(stopY);

            } else {

                var defaultSpeed = Math.round(distance / 100);
                speed = speed || (defaultSpeed > 20 ? 20 : defaultSpeed);

                if (stopY > startY) {
                    this.scrollDown(startY, stopY, speed, distance);
                } else {
                    this.scrollUp(startY, stopY, speed, distance);
                }
            }

        }

    };

});

app.controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {

    $scope.gotoElement = function(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('');

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);
    };
});


// ---SPECS-------------------------


'use strict';

describe('anchorSmoothScroll', function() {

    var service;

    var obj = {};

    beforeEach(function() {
        module(function($provide) {
            $provide.value('$document', [{
                getElementById: function(id) {

                    if (id === "scrollToTopId") {
                        obj.offsetTop = 950;
                    } else if (id === "scrollDownId") {
                        obj.offsetTop = 3000;
                    } else if (id === "scrollUpId") {
                        obj.offsetTop = 90;
                    }

                    return obj;
                },
                documentElement: {},
                body: {}
            }]);

            $provide.value('$window', {});
        });
    });

    beforeEach(module("app"));

    beforeEach(inject(function(anchorSmoothScroll) {
        service = anchorSmoothScroll;
    }));

    it('should scroll down with default setting', function() {

        var scrollDownSpy = sinon.spy(service, "scrollDown");

        expect(scrollDownSpy.calledOnce).toBe(false);

        service.scrollTo('scrollDownId');

        expect(scrollDownSpy.calledOnce).toBe(true);
    });

    it('should scroll to top with distance less than a 100', inject(function($document) {

        $document[0].documentElement.scrollTop = 1000;

        var scrollToTopSpy = sinon.spy(service, "scrollToTop");

        expect(scrollToTopSpy.calledOnce).toBe(false);

        service.scrollTo('scrollToTopId', 10);

        expect(scrollToTopSpy.calledOnce).toBe(true);
    }));

    it('should scroll down with distance bigger than a 100 and offsetTop bigger', inject(function($document) {

        $document[0].documentElement.scrollTop = 1000;

        var scrollDownSpy = sinon.spy(service, "scrollDown");

        expect(scrollDownSpy.calledOnce).toBe(false);

        service.scrollTo('scrollDownId');

        expect(scrollDownSpy.calledOnce).toBe(true);
    }));

    it('should scroll up with distance bigger than a 100 and offsetTop smaller', inject(function($document) {

        $document[0].documentElement.scrollTop = 1000;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);
    }));

    it('should support anchor with pageYOffset', inject(function($window) {

        $window.pageYOffset = 1000;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);

    }));

    it('should support anchor with body.scrollTop', inject(function($document) {

        $document[0].body.scrollTop = 1000;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);

    }));

    it('should support anchor with element having offsetParent', function() {

        obj.offsetParent = 1;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);

    });
});
