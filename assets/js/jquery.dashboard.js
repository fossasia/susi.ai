/**
** Module/App: Dashboard Application
*/

!function($) {
    "use strict";

    var Dashboard = function() {
        this.$body = $("body")
    };

    //initializing various charts and components
    Dashboard.prototype.init = function() {
        /**
        * Morris charts
        */

        //Line chart
        Morris.Line({
            element: 'morris-line-example',
            data: [
                { y: '2012', a: 75,  b: 65},
                { y: '2013', a: 50,  b: 40},
                { y: '2014', a: 75,  b: 65},
                { y: '2015', a: 100, b: 90}
            ],
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Series A', 'Series B'],
            resize: true,
            lineColors: ['#1a2942', '#3bc0c3']
        });

        //Bar chart
        Morris.Bar({
            element: 'morris-bar-example',
            data: [
                    { y: 'Sunday', a: 75,  b: 65 , c: 20 },
                    { y: 'Monday', a: 50,  b: 40 , c: 50 },
                    { y: 'Tuesday', a: 75,  b: 65 , c: 95 },
                    { y: 'Wednesday', a: 50,  b: 40 , c: 22 },
                    { y: 'Thursday', a: 75,  b: 65 , c: 56 },
                    { y: 'Friday', a: 100, b: 90 , c: 60 },
                    { y: 'Saturday', a: 100, b: 90 , c: 60 }
            ],
            xkey: 'y',
            ykeys: ['a', 'b', 'c'],
            labels: ['Series A', 'Series B', 'Series c'],
            barColors: ['#3bc0c3', '#1a2942', '#dcdcdc']
        });


        //Chat application -> You can initialize/add chat application in any page.
        $.ChatApp.init();
    },
    //init dashboard
    $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard
    
}(window.jQuery),

//initializing dashboad
function($) {
    "use strict";
    $.Dashboard.init()
}(window.jQuery);



