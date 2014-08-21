/**
 * Created by leonardo on 21/08/2014.
 */
app.controller('appCtrl', function ($scope, $route, $rootScope, localStorageService) {
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
          $route.reload();
          $scope.loadConfig();
          console.log(theUser);
          $scope.stranger = false;
          $scope.currentUserName = theUser.getUsername();
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
        $route.reload();
        $scope.loggingIn = false;
        $scope.stranger = false;
        $scope.currentUserName = theUser.getUsername();
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
    $route.reload();
    $scope.stranger = true;
  }

  $scope.loadConfig = function() {
    var bucket = Kii.bucketWithName("configure");
    var query = KiiQuery.queryWithClause();

    var queryCallbacks = {
      success: function(queryPerformed, resultSet, nextQuery) {
        if (resultSet.length == 0) {
          console.log('virgin user');
          $scope.configure = {};
          $scope.virgin = true;
          return;
        } else {
          console.log('whoremaster coming');
          $scope.virgin = false;
          var configure = {
            paypalClientID: resultSet[0].get('paypalClientID'),
            paypalSecret: resultSet[0].get('paypalSecret'),
            paypalSandbox: resultSet[0].get('paypalSandbox'),
            paypalSandboxSecret: resultSet[0].get('paypalSandboxSecret'),
            alipayPartnerID: resultSet[0].get('alipayPartnerID'),
            alipayRSAPrivateKey: resultSet[0].get('alipayRSAPrivateKey'),
            alipaySecurityKey: resultSet[0].get('alipaySecurityKey'),
            iapSecurityKey: resultSet[0].get('iapSecurityKey')
          };
          $rootScope.configure = configure;
        }
        if(nextQuery != null) {
          bucket.executeQuery(nextQuery, queryCallbacks);
        }
      },
      failure: function(queryPerformed, anErrorString) {
        console.log('error querying config data', anErrorString)
      }
    }

    bucket.executeQuery(query, queryCallbacks);
  }
})
