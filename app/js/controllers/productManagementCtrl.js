/**
 * Created by leonardo on 21/08/2014.
 */
app.controller('productManagementCtrl', function($scope, $rootScope, $location, $modal, $log) {
  $scope.init = function() {
    if($rootScope.logged != true) {
      $location.path("#/welcome");
    } else {
      $scope.loading = true;
      $scope.currentPage = 1;
      $scope.maxSize = 10;
      $scope.pageLimit = 10;
      $scope.loadProduct();
    }
  }

  $scope.showProduct = function(product) {
    console.log("product detail showing ", product);

  }

  $scope.fields = [
    {name: "ProductID", value: "productID"},
    {name: "Name", value: "name"},
//    {name: "Description", value: "description"},
    {name: "Category", value: "category"},
    {name: "Price", value: "price"},
    {name: "New", value: "new"},
    {name: "Recommended", value: "recommended"},
    {name: "Consumable", value: "consumable"},
    {name: "Valid", value: "valid"}
  ]

  $scope.loadProduct = function () {
    var bucket = Kii.bucketWithName("product");
    var query = KiiQuery.queryWithClause();
    query.setLimit($scope.pageLimit);
    query.sortByDesc("_modified");
    var products = [];
    $scope.products = [];

    bucket.count({
      success: function(bucket, query, count) {
        console.log("Number of objects : " + count);
        $scope.totalItems = count;
        $scope.$apply();
      },
      failure: function(bucket, query, errorString) {
        console.log("Execution failed by : " + errorString);
      }})

    var queryCallbacks = {
      success: function(queryPerformed, resultSet, nextQuery) {
        if (resultSet != 0) {
          var productsSinglePage = [];
          for (var i = 0; i < resultSet.length; i++) {
            productsSinglePage.push(resultSet[i]);
          }
          products.push(productsSinglePage);
          $scope.products.push(productsSinglePage);
          $scope.loading = false;
          $scope.$apply();
        }
        if(nextQuery != null) {
          console.log('has next');
          bucket.executeQuery(nextQuery, queryCallbacks);
        } else if(nextQuery == null) {
          console.log(products)
        }
      },
      failure: function(queryPerformed, anErrorString) {
      }
    }
    bucket.executeQuery(query, queryCallbacks);

  }

  $scope.openModal = function (size) {
    var modalInstance = $modal.open({
      templateUrl: './partials/modalContent.html',
      controller: ModalInstanceCtrl,
      size: "lg",
      backdrop: 'static',
      resolve: {}
    });

    modalInstance.result.then(function (selectedItem) {
      console.log("modal closed and returned to product")
      $scope.loadProduct();
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  var ModalInstanceCtrl = function ($scope, $modalInstance) {
    $scope.init = function() {
      $scope.product = {
        new: false,
        recommended: false,
        consumable: false,
        valid: false
      };
      $scope.title = "New Product";
      $scope.uploader = {};
      $scope.btnLoading = false;
    }

    $scope.create = function () {
      $scope.btnLoading = true;
      var appBucket = Kii.bucketWithName("product");
      var obj = appBucket.createObject();
      obj.set("productID", $scope.product.productID);
      obj.set("name", $scope.product.name);
      obj.set("description", $scope.product.description);
      obj.set("category", $scope.product.category);
      obj.set("price", $scope.product.price);
      obj.set("new", $scope.product.new);
      obj.set("recommended", $scope.product.recommended);
      obj.set("consumable", $scope.product.consumable);
      obj.set("valid", $scope.product.valid);

      obj.save({
        success: function(theObject) {
          var srcData = new Blob([$scope.uploader.flow.files[0].file]);
          theObject.uploadBody(srcData, {
            success: function(obj) {
              console.log("Object and body saved!");
              console.log(theObject);
              $scope.btnLoading = false;
              $modalInstance.close();
            },
            failure: function(obj, anErrorString) {
              console.log("Error saving object: " + errorString);
            }
          })
        },
        failure: function(theObject, errorString) {
          console.log("Error saving object: " + errorString);
        }
      });
      console.log($scope.uploader.flow.files[0].file)
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };
})