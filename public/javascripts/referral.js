var app = angular.module('shopAdminCore', ['ngMaterial', 'ui.router', 'smart-table']);
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