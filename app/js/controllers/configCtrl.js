/**
 * Created by leonardo on 21/08/2014.
 */
app.controller('configCtrl', function($scope, $rootScope, $route) {

  $scope.init = function() {
    $scope.virgin = undefined;
//    $scope.configure = $rootScope.configure;
    $scope.loadConfig();
  }

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
          $scope.configure = configure;
          console.log($scope.configure);
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

  $scope.restoreConfig = function() {

  }

})