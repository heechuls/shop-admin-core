var app = angular.module('shopAdminCore', ['ngMaterial', 'ui.router', 'smart-table']);

// create the controller and inject Angular's $scope
app.config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/user');
        $stateProvider
        .state('user', {
            url: "/user",
            templateUrl: "user.html"
        })
        .state('product', {
            url: "/product",
            templateUrl: "product.html"
        })
        .state('referral', {
            url: "/referral",
            templateUrl: "referral.html"
        });
})
.controller('mainController', function($scope, $location) {
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function (current, old) {
        switch (current) {
            case GLOBALS.TAB_USER :
                $location.url("/user");
                break;
            case GLOBALS.TAB_PRODUCT :
                $location.url("/product");
                break;
            case GLOBALS.TAB_REFERRAL :
                $location.url("/referral");
                break;
        }
    });
})
.controller('loginController', function($scope) {

    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
})
.controller('userController', function($scope, $mdDialog) {
    var nameList = ['피오나어린이집', '비구스어린이집', '현대몬테소리', '보성어린이집', '슈렉어린이집'];

    function createRandomItem() {
        var
            registeredDate = "2016.09.15",
            kidsSchoolName = nameList[Math.floor(Math.random() * 4)],
            noOfEquippedTools = "2개",
            noOfNeededTools = "3개",
            noOfEquippedToolImages = "2장",
            detail = "보기",
            nuribox = "보기";

        return{
            registeredDate: registeredDate,
            kidsSchoolName: kidsSchoolName,
            noOfEquippedTools: noOfEquippedTools,
            noOfNeededTools: noOfNeededTools,
            noOfEquippedToolImages: noOfEquippedToolImages,
            detail: detail,
            nuribox: nuribox
        };
    }

	$scope.itemsByPage=15;

    $scope.rowCollection = [];
    for (var j = 0; j < 30; j++) {
        $scope.rowCollection.push(createRandomItem());
    }

    $scope.detail = function(row){
        alert(row.toString());
    }

    $scope.showTools = function (row, ev) {
        $mdDialog.show({
            controller: ToolsDialogController,
            templateUrl: 'templates/tools.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };
    $scope.showNuribox = function (row, ev) {
        $mdDialog.show({
            controller: NuriboxDialogController,
            templateUrl: 'templates/nuribox.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    function ToolsDialogController($scope, $mdDialog) {
        $scope.tools = [{name: "성교육인형"}, {name: "병원놀이"}];
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        $scope.addTool = function (ev) {
            $mdDialog.show({
                controller: AddToolController,
                templateUrl: 'templates/addtool.html',
                parent: ToolsDialogController,
                locals: {local:$scope.showTools},
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };
    }
    function AddToolController($scope, $mdDialog, local) {
        //alert($scope.selectedToolCategory + $scope.toolName);
        $scope.selectedToolCategory = 0;

        $scope.close = function(){
            $mdDialog.hide();
            $scope.showTools();
        };

        $scope.add = function(){
            $mdDialog.hide();
            $scope.showTools(null);
            //$scope.local[0].showTools(null);
        };

        $scope.showTools = function (ev) {
            $mdDialog.show({
                controller: ToolsDialogController,
                templateUrl: 'templates/tools.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };
    }
    function NuriboxDialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        $scope.createNuribox = function() {
            alert("누리박스 생성");
        }
    }
})
.controller('productController', function($scope) {

    // create a message to display in our view
    $scope.message = 'Product';
});
app.controller('referralController', ['$scope', function (scope) {
    var
        nameList = ['피오나어린이집', '비구스어린이집', '현대몬테소리', '보성어린이집', '슈렉어린이집'];

    function createRandomItem() {
        var
            registeredDate = "2016.09.15",
            kidsSchoolName = nameList[Math.floor(Math.random() * 4)],
            noOfEquippedTools = "2개",
            noOfNeededTools = "3개",
            noOfEquippedToolImages = "2장",
            detail = "보기",
            nuribox = "보기";

        return{
            registeredDate: registeredDate,
            kidsSchoolName: kidsSchoolName,
            noOfEquippedTools: noOfEquippedTools,
            noOfNeededTools: noOfNeededTools,
            noOfEquippedToolImages: noOfEquippedToolImages,
            detail: detail,
            nuribox: nuribox
        };
    }

	scope.itemsByPage=15;

    scope.rowCollection = [];
    for (var j = 0; j < 30; j++) {
        scope.rowCollection.push(createRandomItem());
    }

    $scope.detail = function(row){
        alert(row.toString());
    }
}]);