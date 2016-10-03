var app = angular.module('shopAdminCore', ['ngMaterial', 'ui.router', 'smart-table']);

// create the controller and inject Angular's $scope
app.config(function($stateProvider, $urlRouterProvider) {

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
.controller('userController', function($scope, $mdDialog, $http) {
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

    $scope.rowCollection = [];
    $scope.test = "test";

    function convertData(response){
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                registeredDate: response.data[i].regdt,
                kidsSchoolName: response.data[i].name,
                noOfEquippedTools : "2개",
                noOfNeededTools : "3개",
                noOfEquippedToolImages : "2장",
                detail : "보기",
                nuribox : "보기"
            };
            dataSet.push(data);
            console.log(data);
        }
        $scope.rowCollection = dataSet;
        //$scope.test = "done";
    }
    $scope.fetchInitialData = function () {
        $http({
            method: 'GET',
            url: GLOBALS.API_HOME + 'user-list-all'
        }).then(function successCallback(response) {
            convertData(response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });	}

	$scope.itemsByPage=15;

    /*for (var j = 0; j < 30; j++) {
        $scope.rowCollection.push(createRandomItem());
    }*/

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
.controller('productController', function($scope, $mdDialog, $http) {

    $scope.rowCollection = [];
 
    function convertData(response){
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                category : "성교육인형",
                goodsno: response.data[i].goodsno,
                goodsnm: response.data[i].goodsnm,
                toolFeatures : GLOBALS.getListToolFeatures(response.data[i].tool_features),
            };
            dataSet.push(data);
            //console.log(data);
        }
        console.log(response);
        $scope.rowCollection = dataSet;
    }

    $scope.fetchInitialData = function () {
        $http({
            method: 'GET',
            url: GLOBALS.API_HOME + 'tool-list'
        }).then(function successCallback(response) {
            convertData(response);
        }, function errorCallback(response) {
        });	
    }

	$scope.itemsByPage=15;

    $scope.changeFeatures2 = function(row){
        alert(row.goodsno);
    }

    $scope.changeFeatures = function (row, ev) {
        $mdDialog.show({
            controller: ToolFeaturesController,
            templateUrl: 'templates/changefeatures.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    function ToolFeaturesController($scope) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.items = ["품질", "리뷰", "가격", "안전"];
        $scope.selected = [2];
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.isIndeterminate = function () {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.items.length);
        };

        $scope.isChecked = function () {
            return $scope.selected.length === $scope.items.length;
        };

        $scope.toggleAll = function () {
            if ($scope.selected.length === $scope.items.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.items.slice(0);
            }
        };
    }
});
app.controller('referralController', function ($scope, $http) {
    $scope.rowCollection = [];
 
    function convertData(response){
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                m_no: response.data[i].m_no,
                registeredDate: response.data[i].regdt,
                kidsSchoolName: response.data[i].aname,
                recommendingKidsSchoolName : response.data[i].bname + "(" + response.data[i].m_id + ")",
                isPaidUser : "전환",
                isCouponApplied : "적용"
            };
            dataSet.push(data);
            //console.log(data);
        }
        console.log(response);
        $scope.rowCollection = dataSet;
    }

    $scope.fetchInitialData = function () {
        $http({
            method: 'GET',
            url: GLOBALS.API_HOME + 'recomm-list'
        }).then(function successCallback(response) {
            convertData(response);
        }, function errorCallback(response) {
        });	
    }

	$scope.itemsByPage=15;

    $scope.applyCoupon = function(row){
        alert(row.m_no);
    }
});