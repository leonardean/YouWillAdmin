/**
 * Created by leonardo on 21/08/2014.
 */
app.controller('appCtrl', function ($scope, localStorageService) {
  $scope.init = function () {
    $scope.selected = 0;
    $scope.stranger = true;
    $scope.loggingIn = false;
    var accessToken = localStorageService.get("accessToken");
    if (accessToken) {
      $scope.loggingIn = true;
      KiiUser.authenticateWithToken(accessToken, {
        success: function (theUser) {
          $scope.loggingIn = false;
          console.log("user authenticated by access token login!");
          console.log(theUser);
          $scope.stranger = false;
          $scope.currentUserName = theUser.getUsername();
          $scope.$apply();
        },
        failure: function (theUser, errorString) {
          console.log("error authenticating: " + errorString);
        }
      })
    }
  }

  $scope.navItems = [
    {
      link: '#/welcome',
      display: 'Welcome',
      shy: false
    },
    {
      link: '#/config',
      display: 'Configuration',
      shy: true
    },
    {
      link: '#/productManagement',
      display: 'Product Management',
      shy: true
    },
    {
      link: '#/transaction',
      display: 'Transaction',
      shy: true
    }
  ];

  $scope.select = function (index) {
    $scope.selected = index;
  };

  $scope.doRegister = function () {
    $scope.loggingIn = true;
    var user = KiiUser.userWithUsername($scope.loginForm.userName, $scope.loginForm.password);
    user.register({
      success: function (theUser) {
        console.log('register success');
        $scope.doLogin();
      },
      failure: function (theUser, errString) {
        console.log("error authenticating: " + errString);
      }
    })
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    $scope.loggingIn = true;
    KiiUser.authenticate($scope.loginForm.userName, $scope.loginForm.password, {
      success: function (theUser) {
        console.log("user authenticated by username/password login!");
        console.log(theUser);
        $scope.loggingIn = false;
        $scope.stranger = false;
        $scope.currentUserName = theUser.getUsername();
        $scope.$apply();
        var accessToken = KiiUser.getCurrentUser().getAccessToken();
        localStorageService.set("accessToken", accessToken);
      },
      failure: function (theUser, errorString) {
        console.log("error authenticating: " + errorString);
      }
    });
  };

  $scope.doLogout = function(){
    KiiUser.logOut();
    $scope.stranger = true;
  }
})
