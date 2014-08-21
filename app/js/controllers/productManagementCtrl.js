/**
 * Created by leonardo on 21/08/2014.
 */
app.controller('productManagementCtrl', function($scope, $rootScope, $location) {
  $scope.init = function() {
    if($rootScope.logged != true) {
      $location.path("#/welcome");
    }
  }

})