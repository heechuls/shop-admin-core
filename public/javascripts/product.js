var app = angular.module('shopAdminCore');
app.controller('productController', function ($scope, $mdDialog, $http) {

    $scope.rowCollection = [];

    function convertData(response) {
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                category: response.data[i].catnm,
                goodsno: response.data[i].goodsno,
                goodsnm: response.data[i].goodsnm,
                toolFeatures: response.data[i].tool_features,
                toolFeaturesTxt: GLOBALS.getListToolFeatures(response.data[i].tool_features),
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

    $scope.itemsByPage = 15;

    $scope.changeFeatures = function (row, ev) {
        $mdDialog.show({
            controller: ToolFeaturesController,
            templateUrl: 'templates/changefeatures.html',
            parent: angular.element(document.body),
            locals: {
                row: row,
                fetchInitialData: $scope.fetchInitialData
            },
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    function ToolFeaturesController($scope, $http, row, fetchInitialData) {
        $scope.close = function () {
            $mdDialog.cancel();
        };
        $scope.change = function () {
            var tool_features = 0;
            for (var i in $scope.selected) {
                s = $scope.selected[i];
                idx = $scope.items.indexOf(s);
                tool_feature = GLOBALS.TOOL_FEATURES[idx];
                tool_features |= tool_feature;
            }
            if (row.toolFeatures != tool_features) {
                $scope.changeFeaturesInDB(row.goodsno, tool_features);
                fetchInitialData();
                $mdDialog.hide();
            }
        }

        $scope.changeFeaturesInDB = function (goodsno, tool_features) {
            $http({
                method: 'POST',
                url: GLOBALS.API_HOME + 'change-features/',
                data: {
                    tool_features: tool_features,
                    goodsno: goodsno
                }
            }).then(function successCallback(response) {
                convertData(response);
            }, function errorCallback(response) {

            });
        }
        $scope.items = ["품질", "리뷰", "가격", "안전"];
        $scope.selected = [];


        $scope.initSelect = function () {
            for (var i in GLOBALS.TOOL_FEATURES) {
                if ((row.toolFeatures & GLOBALS.TOOL_FEATURES[i]) == GLOBALS.TOOL_FEATURES[i])
                    $scope.selected.push($scope.items[i]);
            }
        }
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