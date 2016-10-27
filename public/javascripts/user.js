var app = angular.module('shopAdminCore');
app.controller('userController', function ($scope, $mdDialog, $http) {
    var nameList = ['피오나어린이집', '비구스어린이집', '현대몬테소리', '보성어린이집', '슈렉어린이집'];
    var ctList = [];
    function createRandomItem() {
        var
            registeredDate = "2016.09.15",
            kidsSchoolName = nameList[Math.floor(Math.random() * 4)],
            noOfEquippedTools = "2개",
            noOfNeededTools = "3개",
            noOfEquippedToolImages = "2장",
            detail = "보기",
            nuribox = "보기";

        return {
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

    function convertData(response) {
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                m_no: response.data[i].m_no,
                registeredDate: response.data[i].regdt.substring(0, 10),
                kidsSchoolName: response.data[i].nickname,
                noOfEquippedTools: response.data[i].own_cnt + "개",
                noOfNeededTools: response.data[i].need_cnt + "개",
                noOfEquippedToolImages: response.data[i].own_img_cnt + "장",
                detail: "보기",
                nuribox: "보기"
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
        });
    }

    $scope.search = function (searchKeyword) {
        if (searchKeyword == null || searchKeyword.length == 0) {
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

    $scope.itemsByPage = 15;

    /*for (var j = 0; j < 30; j++) {
        $scope.rowCollection.push(createRandomItem());
    }*/

    $scope.detail = function (row) {
        alert(row.toString());
    }

    $scope.showTools = function (row, ev) {
        $mdDialog.show({
            controller: ToolsDialogController,
            templateUrl: 'templates/tools.html',
            parent: angular.element(document.body),
            locals: {
                showTools: $scope.showTools,
                row: row
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
            locals: {
                showNuribox: $scope.showNuribox,
                row: row
            },
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    function ToolsDialogController($scope, $mdDialog, showTools, row) {

        $scope.images = [];
        function convertImageList(response) {
            var dataSet = [];
            for (var i in response.data) {
                var data = {
                    nuribox_own_no: response.data[i].nuribox_own_no,
                    nuribox_own_image_url: response.data[i].nuribox_own_image_url,
                };
                dataSet.push(data);
            }
            console.log(response);
            $scope.images = dataSet;
        }


        fetchOwnNeedToolList = function () {

        };
        $scope.items;
        function fetchOwnToolList() {
            $http.get(GLOBALS.API_HOME + 'get-items/' + row.m_no)
                .success(function (data, status, headers, config) {
                    $scope.items = data;
                    //ctList 받아오기 ~
                    $http.get(GLOBALS.API_HOME + 'category-list')
                        .success(function (data, status, headers, config) {
                            for (var myData in data) {
                                //window.alert("ddddd");
                                myData.items = fetchOwnList(myData.sno);
                                $scope.ctList.push(myData);
                            }
                        });
                });
        };


        function fetchOwnList(ctId) {
            for (var item in $scope.items) {
                if (item.nuribox_own_category_no == ctId) {
                    result += item.nuribox_own_nm + " ";
                }
            }
            return "dddd";
        }
        fetchOwnToolImageList = function () {
            $http({
                method: 'GET',
                url: GLOBALS.API_HOME + 'own-tool-image-list/' + row.m_no
            }).then(function successCallback(response) {
                convertImageList(response);
            }, function errorCallback(response) {
            });
        };



        $scope.fetchInitialData = function () {
            fetchOwnNeedToolList();
            fetchOwnToolImageList();
            fetchOwnToolList();
        }
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
                    showTools: showTools,
                    row: row
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

        /*$scope.fetchInitialData = function () {
            $http({
                method: 'GET',
                url: GLOBALS.API_HOME + 'category-list'
            }).then(function successCallback(response) {
                convertData(response);
            }, function errorCallback(response) {
            });
        };*/

        $scope.fetchInitialData = function(){
            $scope.tools = ProductCategory.fetchCategoryList($http, function(list){
                $scope.tools = list;
            });
        }

        $scope.insertTool = function (tool, toolName, done) {
            $http({
                method: 'POST',
                url: GLOBALS.API_HOME + 'insert-tool/',
                data: {
                    sno: tool.sno,
                    toolName: toolName,
                    m_no: row.m_no
                }
            }).then(function successCallback(response) {
                if (done != null)
                    return done();

            }, function errorCallback(response) {
                alert("DB 접속에 문제가 생겼습니다.");
                if (done != null)
                    return done();
            });
        }

        /*function convertData(response) {
            var dataSet = [];
            for (var i in response.data) {
                var data = {
                    catnm: response.data[i].catnm,
                    sno: response.data[i].sno,
                };
                dataSet.push(data);
            }
            $scope.tools = dataSet;
        };*/


        $scope.close = function () {
            $mdDialog.hide();
            showTools(row);
        };

        $scope.add = function (tool, toolName) {
            if (tool == undefined || toolName.length == 0) {
                alert("보유 교구 카테고리와 이름을 정확히 입력해주세요");
                return;
            }
            $mdDialog.hide();
            $scope.insertTool(tool, toolName, function () {
                showTools(row);
            });
        };
    }/*
    var Nuribox = {
    category : "",
    status : false,
    first_filtering : false,
    second_filtering : GLOBALS.NURIBOX_NOT_APPLICABLE,
    third_filtering : GLOBALS.NURIBOX_NOT_APPLICABLE,
    selected_product_no : GLOBALS.NURIBOX_NOT_APPLICABLE,
    };*/

    function NuriboxDialogController($scope, $mdDialog, showNuribox, row) {

        $scope.Nuribox = [];

        $scope.fetchInitialData = function(){
            $scope.tools = NuriboxList.fetchNuriboxList($http, row.m_no, function(list){
                var nuribox_list = [];
                for (var i in list) {
                    var status = "";
                    if(list[i].own_or_need == GLOBALS.NURIBOX_NEED)
                        status = "필요";
                    else if(list[i].own_or_need == GLOBALS.NURIBOX_OWN)
                        status = "보유";
                
                    var nuribox_item = {
                        category: list[i].catnm,
                        status: status, //Retrive whether it is owned
                        first_filtering: "", //
                        second_filtering: "", //GLOBALS.NURIBOX_NOT_APPLICABLE,
                        third_filtering: "", //GLOBALS.NURIBOX_NOT_APPLICABLE,
                        selected_product_no: "", //GLOBALS.NURIBOX_NOT_APPLICABLE,
                        remark: ""
                    }
                    nuribox_list.push(nuribox_item);
                }
                $scope.Nuribox = nuribox_list;
            });
        }
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        $scope.createNuribox = function () {
            alert("누리박스 생성");
        }
    }
});

var Nuribox = {
    category : "",
    status : false,
    first_filtering : false,
    second_filtering : GLOBALS.NURIBOX_NOT_APPLICABLE,
    third_filtering : GLOBALS.NURIBOX_NOT_APPLICABLE,
    selected_product_no : GLOBALS.NURIBOX_NOT_APPLICABLE,
}

var ProductCategory = {
    convertCategoryList: function (response) {
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                catnm: response.data[i].catnm,
                sno: response.data[i].sno,
            };
            dataSet.push(data);
        }
        return dataSet;
    },

    fetchCategoryList : function ($http, done) {
        $http({
            method: 'GET',
            url: GLOBALS.API_HOME + 'category-list'
        }).then(function successCallback(response) {
            done(ProductCategory.convertCategoryList(response));
        }, function errorCallback(response) {
        });
    }
}

var NuriboxList = {
    convertNuriboxList: function (response) {
        var dataSet = [];
        for (var i in response.data) {
            var own_or_need = GLOBALS.NURIBOX_NOT_OWN_AND_NEED;
            if(response.data[i].need_cnt > 0)
                own_or_need = GLOBALS.NURIBOX_NEED;
            else if(response.data[i].own_cnt > 0)
                own_or_need = GLOBALS.NURIBOX_OWN;

            var data = {
                catnm: response.data[i].catnm,
                sno: response.data[i].sno,
                own_or_need : own_or_need
            };
            dataSet.push(data);
        }
        return dataSet;
    },

    fetchNuriboxList : function ($http, userno, done) {
        $http({
            method: 'GET',
            url: GLOBALS.API_HOME + 'nuribox-list/' + userno 
        }).then(function successCallback(response) {
            done(NuriboxList.convertNuriboxList(response));
        }, function errorCallback(response) {
        });
    }
}



