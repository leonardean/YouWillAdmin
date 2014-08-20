'use strict';
angular.module('myApp.controllers', [])
	.controller('appCtrl', function($scope, $route, localStorageService) {
    $scope.init = function(){
      $scope.selected = 0;
      $scope.stranger= true;
      var accessToken = localStorageService.get("accessToken");
      if (accessToken) {
        KiiUser.authenticateWithToken(accessToken, {
          success: function(theUser){
            console.log("user authenticated by access token login!");
            $route.reload();
            console.log(theUser);
            $scope.stranger = false;
            $scope.currentUserName = theUser.getUsername();
          },
          failure: function(theUser, errorString){
            console.log("error authenticating: " + errorString);
          }
        })
      }
    }

    $scope.navItems = [{
        link: '#/config',
        display: 'Configuration'
      }, {
        link: '#/productManagement',
        display: 'Product Management'
      }, {
        link: '#/transaction',
        display: 'Transaction'
      }
    ];

    $scope.select= function(index) {
      $scope.selected = index;
    };

    $scope.doRegister = function(){
      var user = KiiUser.userWithUsername($scope.loginForm.userName, $scope.loginForm.password);
      user.register({
        success: function(theUser) {
          console.log('register success');
          $scope.doLogin();
        },
        failure: function(theUser, errString) {
          console.log("error authenticating: " + errString);
        }
      })
    }

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      KiiUser.authenticate($scope.loginForm.userName, $scope.loginForm.password, {
        success: function(theUser){
          console.log("user authenticated by username/password login!");
          console.log(theUser);
          $route.reload();
          $scope.stranger = false;
          $scope.currentUserName = theUser.getUsername();
          var accessToken = KiiUser.getCurrentUser().getAccessToken();
          localStorageService.set("accessToken", accessToken);
        },
        failure: function(theUser, errorString){
          console.log("error authenticating: " + errorString);
        }
      });
    };
	})
  .controller('configCtrl', ['$scope', function($scope) {
    $scope.saveConfig = function() {
      var appBucket = Kii.bucketWithName("configure");

      var obj = appBucket.createObject();
      obj.set("paypalClientID", $scope.configure.paypalClientID);
      obj.set("paypalSecret", $scope.configure.paypalSecret);
      obj.set("paypalSandbox", $scope.configure.paypalSandbox);
      obj.set("paypalSandboxSecret", $scope.configure.paypalSandboxSecret);
      obj.set("alipayPartnerID", $scope.configure.alipayPartnerID);
      obj.set("alipayRSAPrivateKey", $scope.configure.alipayRSAPrivateKey);
      obj.set("alipaySecurityKey", $scope.configure.alipaySecurityKey);
      obj.set("iapSecurityKey", $scope.configure.iapSecurityKey);

      obj.save({
        success: function(theObject) {
          console.log("Object saved!");
          console.log(theObject);
        },
        failure: function(theObject, errorString) {
          console.log("Error saving object: " + errorString);
        }
      });
    }

    $scope.restoreConfig = function() {

    }

  }])
  .controller('productManagementCtrl', ['$scope', function($scope) {

  }])
  .controller('transactionCtrl', ['$scope', function($scope) {

  }]);
