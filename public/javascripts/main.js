var app = angular.module('shopAdminCore', ['ngMaterial', 'ui.router', 'smart-table'])
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/user');
    $stateProvider
        .state('user', {
            url: "/user",
            templateUrl: "/templates/user.html"
        })
        .state('product', {
            url: "/product",
            templateUrl: "/templates/product.html"
        })
        .state('referral', {
            url: "/referral",
            templateUrl: "/templates/referral.html"
        });
})
.controller('mainController', function ($scope, $location) {
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function (current, old) {
        switch (current) {
            case GLOBALS.TAB_USER:
                $location.url("/user");
                break;
            case GLOBALS.TAB_PRODUCT:
                $location.url("/product");
                break;
            case GLOBALS.TAB_REFERRAL:
                $location.url("/referral");
                break;
        }
    });
});