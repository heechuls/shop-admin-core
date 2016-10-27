var app = angular.module('shopAdminCore', ['ngMaterial', 'ui.router', 'smart-table']);

// create the controller and inject Angular's $scope
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
    })
    .controller('loginController', function ($scope) {

        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    })
    .controller('userController', function ($scope, $mdDialog, $http) {
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
                                    window.alert("ddddd");
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
            $scope.createNuribox = function () {
                alert("누리박스 생성");
            }
        }
    })
    .controller('productController', function ($scope, $mdDialog, $http) {

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
app.controller('referralController', function ($scope, $http) {
    $scope.rowCollection = [];

    function convertData(response) {
        var dataSet = [];
        for (var i in response.data) {
            var data = {
                m_no: response.data[i].m_no,
                registeredDate: response.data[i].regdt,
                kidsSchoolName: response.data[i].aname,
                recommendingKidsSchoolName: response.data[i].bname + "(" + response.data[i].m_id + ")",
                isPaidUser: "전환",
                isCouponApplied: "적용"
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

    $scope.itemsByPage = 15;

    $scope.applyCoupon = function (row) {
        alert(row.m_no);
    }
});