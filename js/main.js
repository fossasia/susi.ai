var app = angular.module("susi", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
	  .when("/", {
	    templateUrl : "main.html",
      controller: "mainController"
	  })
	  .when("/chat", {
	    templateUrl : "chat.htm"
	  });
});
app.controller('mainController', function($scope){

})