'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.bootstrap',
  'LocalStorageModule',
  'flow'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/config', {templateUrl: 'partials/config.html', controller: 'configCtrl'});
  $routeProvider.when('/productManagement', {templateUrl: 'partials/productManagement.html', controller: 'productManagementCtrl'});
  $routeProvider.when('/transaction', {templateUrl: 'partials/transaction.html', controller: 'transactionCtrl'});
  $routeProvider.when('/welcome', {templateUrl: 'partials/welcome.html', controller: 'welcomeCtrl'})
  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);

Kii.initializeWithSite("079d0279", "06c8dd6aefd1471d2bca3320ff6eade8", KiiSite.CN);
console.log('Kii sdk initialized')
