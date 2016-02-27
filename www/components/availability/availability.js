'use strict';

angular.module('App.availability', ['App.config'])
  .directive('availability', function() {
    return {
      restrict: 'AEC',
      scope: {
        datasource: '@',
        isowner: '@',
        showdays: '@',
        days: '@'
      },
      templateUrl: 'components/availability/availability.html',
      controller: function($scope, $http, $rootScope, $location, $attrs) {
        $scope.thisclass = 'unavailable';
        $scope.message = 'hello';
        $scope.datasource =  $attrs.datasource;
        $scope.availability = "Loading...";
        $scope.showdays = Boolean($attrs.showdays)
        $scope.$watch(
          "datasource",
          function handleFooChange( ) {
            if ($attrs.datasource != "{{product.id}}" && $attrs.datasource != "") {
              $scope.showLoading = false;
              $scope.datasource =  $attrs.datasource;
              //console.log($attrs.isowner);
              if ($attrs.isowner === 'true') {
                $http({
                  url: backend + '/owner/products/' + $attrs.datasource + '/availability',
                  method: 'GET',
                  headers: {
                    token: window.localStorage.token
                  }
                }).success(function(data, status, headers, config) {
                  console.log(data)
                  if (data.available) {
                    $scope.availability = "Available";
                    $scope.thisclass = 'available';
                    $scope.isDate = false;
                  } else {
                    $scope.isDate = true;
                    $scope.availability = data.date_due;
                  }
                }).
                error(function(data, status, headers, config) {
                  console.log(data)
                  $scope.thisclass = 'error';
                  $scope.error = true;
                });
              } else {
                $http({
                  url: backend + '/p/' + $attrs.datasource + '/availability',
                  method: 'GET',
                }).success(function(data, status, headers, config) {
                  if (data.available) {
                    $scope.availability = "Available";
                    $scope.thisclass = 'available';
                  } else {
                    $scope.availability = "Unavailable";
                    $scope.thisclass = 'unavailable';
                  }
                }).
                error(function(data, status, headers, config) {
                  $scope.error = true;
                });
              }


            } else {
              $scope.showLoading = true;
            }
          }
        );

      },
      link: function(scope, elem, attrs) {
        // Just for altering the DOM
        //scope.watch($scope.availability, function() {
        //  debugger;
        //  if (scope.availability === 'Available') {
        //    elem.addClass("available");
        //  } else if (scope.availability === 'UnAvailable') {
        //    elem.addClass("unavailable");
        //  } else {
        //    elem.addClass("error");
        //  }
        //})
      }
    };
  });
