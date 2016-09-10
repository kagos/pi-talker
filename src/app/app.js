'use strict';

angular.module('piTalkerApp', [
  'ngRoute',
  'ngAnimate',
  'actions',
  'sensors',
  'utilities'
]).config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      /* $routeProvider
        .when('/Book/:bookId', {
          templateUrl: 'book.html',
          controller: 'BookCtrl',
          controllerAs: 'book'
        })
        .when('/Book/:bookId/ch/:chapterId', {
          templateUrl: 'chapter.html',
          controller: 'ChapterCtrl',
          controllerAs: 'chapter'
        }); */

      //$locationProvider.html5Mode(true);
  }]
).controller('MainCtrl', ['$route', '$routeParams', '$location',
  function($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
}]);
