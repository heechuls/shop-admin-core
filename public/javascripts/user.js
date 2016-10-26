var app = angular.module('shopAdminCore', ['ngMaterial', 'ui.router', 'smart-table']).
controller('userController', function($scope, $mdDialog, $http) {
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
                m_no: response.data[i].m_no,
                registeredDate: response.data[i].regdt.substring(0, 10),
                kidsSchoolName: response.data[i].nickname,
                noOfEquippedTools : "2개",
                noOfNeededTools : "3개",
                noOfEquippedToolImages : "2장",
                detail : "보기",
                nuribox : "보기"
            };
            dataSet.push(data);
            console.log(data);
            $window.alert(JSON.stringify(response.data[i]));
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
        });	
    }

    $scope.search = function (searchKeyword) {
        if(searchKeyword == null || searchKeyword.length == 0){
            alert("어린이집 이름을 입력해주세요.");
            return;
        }
        $http({
            method: 'GET',
            url: GLOBALS.API_HOME + 'user-list/' + searchKeyword
        }).then(function successCallback(response) {
            convertData(response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });	
    }

	$scope.itemsByPage=15;

    
    $scope.detail = function(row){
        alert(row.toString());
    }

    $scope.showTools = function (row, ev) {
        $mdDialog.show({
            controller: ToolsDialogController,
            templateUrl: 'templates/tools.html',
            parent: angular.element(document.body),
            locals: {
                showTools: $scope.showTools,
                row : row
            },
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

    function ToolsDialogController($scope, $mdDialog, showTools, row) {
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
                locals: {
                    showTools : showTools,
                    row : row
                },
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };
    }
    function AddToolController($scope, $mdDialog, showTools, row) {
        $scope.tools = [];
        $scope.selectedToolCategory = null;
        $scope.toolName = '';

        $scope.fetchInitialData = function () {
            $http({
                method: 'GET',
                url: GLOBALS.API_HOME + 'category-list'
            }).then(function successCallback(response) {
                convertData(response);
            }, function errorCallback(response) {
            });	
        };
        
        $scope.insertTool = function (tool, toolName, done) {
            $http({
                method: 'POST',
                url: GLOBALS.API_HOME + 'insert-own-tool/',
                data: {
                    sno : tool.sno,
                    toolName : toolName,
                    m_no : row.m_no
                }
            }).then(function successCallback(response) {
                if(done != null)
                    return done();

            }, function errorCallback(response) {
                alert("DB 접속에 문제가 생겼습니다.");
                if(done != null)
                    return done();
            });
        }

        function convertData(response) {
            var dataSet = [];
            for (var i in response.data) {
                var data = {
                    catnm: response.data[i].catnm,
                    sno: response.data[i].sno,
                };
                dataSet.push(data);
            }
            $scope.tools = dataSet;
        };

        $scope.close = function(){
            $mdDialog.hide();
            showTools(null);
        };

        $scope.add = function(tool, toolName){
            if(tool == undefined || toolName.length ==0){
                alert("보유 교구 카테고리와 이름을 정확히 입력해주세요");
                return;
            }
            $mdDialog.hide();
            $scope.insertTool(tool, toolName, function(){
                showTools(null);
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
});
