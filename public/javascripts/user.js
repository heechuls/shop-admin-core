var app = angular.module('shopAdminCore')
app.controller('userController', function ($scope, $mdDialog, $http) {
  var nameList = ['피오나어린이집', '비구스어린이집', '현대몬테소리', '보성어린이집', '슈렉어린이집']
  var ctList = []
  var NuriboxTestSet = []
  var NuriboxTestSetOrg = []


  function createRandomItem() {
    var registeredDate = '2016.09.15',
      kidsSchoolName = nameList[Math.floor(Math.random() * 4)],
      noOfEquippedTools = '2개',
      noOfNeededTools = '3개',
      noOfEquippedToolImages = '2장',
      detail = '보기',
      nuribox = '보기'

    return {
      registeredDate: registeredDate,
      kidsSchoolName: kidsSchoolName,
      noOfEquippedTools: noOfEquippedTools,
      noOfNeededTools: noOfNeededTools,
      noOfEquippedToolImages: noOfEquippedToolImages,
      detail: detail,
      nuribox: nuribox
    }
  }

  $scope.rowCollection = []
  $scope.test = 'test'

  function convertData(response) {
    var dataSet = []
    for (var i in response.data) {
      var data = {
        m_no: response.data[i].m_no,
        registeredDate: response.data[i].regdt.substring(0, 10),
        kidsSchoolName: response.data[i].nickname,
        noOfEquippedTools: response.data[i].own_cnt + '개',
        noOfNeededTools: response.data[i].need_cnt + '개',
        noOfEquippedToolImages: response.data[i].own_img_cnt + '장',
        detail: '보기',
        nuribox: '보기'
      }
      dataSet.push(data)
      console.log(data)
    }
    $scope.rowCollection = dataSet
    // $scope.test = "done"
  }

  //상세보기 클릭시 모달 띄움
  $scope.fetchNecList = function (userno) {
    $http({
      method: 'GET',
      url: GLOBALS.API_HOME + 'nec-list/' + userno
    }).then(function successCallback(response) {
      window.alert(JSON.stringify(response));
    }, function errorCallback(response) { })
  },
    $scope.fetchInitialData = function () {
      $http({
        method: 'GET',
        url: GLOBALS.API_HOME + 'user-list-all'
      }).then(function successCallback(response) {
        convertData(response)
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      })
    }

  $scope.search = function (searchKeyword) {
    if (searchKeyword == null || searchKeyword.length == 0)
      api = 'user-list-all/'
    else api = 'user-list/'

    $http({
      method: 'GET',
      url: GLOBALS.API_HOME + api + searchKeyword
    }).then(function successCallback(response) {
      convertData(response)
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    })
  }

  $scope.itemsByPage = 15

  /*for (var j = 0; j < 30; j++) {
      $scope.rowCollection.push(createRandomItem())
  }*/

  $scope.detail = function (row) {
    alert(row.toString())
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
    })
  }
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
    })
  }

  function ToolsDialogController($scope, $mdDialog, showTools, row) {
    $scope.images = []
    function convertImageList(response) {
      var dataSet = []
      for (var i in response.data) {
        var data = {
          nuribox_own_no: response.data[i].nuribox_own_no,
          nuribox_own_image_url: response.data[i].nuribox_own_image_url,
          nuribox_own_category_no:response.data[i].nuribox_own_category_no
        }
        dataSet.push(data)
      }
      console.log(response)
      $scope.images = dataSet
    }
    $scope.necItems
    function fetchOwnNeedToolList() {

      $http.get(GLOBALS.API_HOME + 'nec-items/' + row.m_no)
        .success(function (data, status, headers, config) {
          //카테고리와 매칭
          var tmp = data;
          $http.get(GLOBALS.API_HOME + 'category-list')
            .success(function (ctData, status, headers, config) {

              for (var i = 0; i < tmp.length; i++) {
                for (var j = 0; j < ctData.length; j++) {
                  //카테고리 매칭

                  if (ctData[j].sno == tmp[i].nuribox_need_category_no) {
                    tmp[i].nuribox_need_category_no = ctData[j].catnm;
                    break;
                  }
                }
              }
              $scope.necItems = tmp;
            });
        })
    }




    $scope.items
    function fetchOwnToolList() {

      $http.get(GLOBALS.API_HOME + 'get-items/' + row.m_no)
        .success(function (data, status, headers, config) {
          $scope.items = data;
          // ctList 받아오기 ~
          $http.get(GLOBALS.API_HOME + 'category-list')
            .success(function (data, status, headers, config) {
              for (var myData in data) {

                $scope.ctList.push(myData)
              }
            })
        })
    }

    fetchOwnToolImageList = function () {
      $http({
        method: 'GET',
        url: GLOBALS.API_HOME + 'own-tool-image-list/' + row.m_no
      }).then(function successCallback(response) {
        convertImageList(response)
      }, function errorCallback(response) { })
    }

    $scope.fetchInitialData = function () {
      fetchOwnNeedToolList()
      fetchOwnToolImageList()
      fetchOwnToolList()

    }
    $scope.hide = function () {
      $mdDialog.hide()
    }

    $scope.cancel = function () {
      $mdDialog.cancel()
    }

    $scope.answer = function (answer) {
      $mdDialog.hide(answer)
    }

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
      })
    }
  }
  function AddToolController($scope, $mdDialog, $http, showTools, row) {
    $scope.tools = []
    $scope.selectedToolCategory = null
    $scope.toolName = ''

    $scope.fetchInitialData = function () {
      $scope.tools = ProductCategory.fetchCategoryList($http, function (list) {
        $scope.tools = list
      })
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
          return done()
      }, function errorCallback(response) {
        alert('DB 접속에 문제가 생겼습니다.')
        if (done != null)
          return done()
      })
    }

    $scope.close = function () {
      $mdDialog.hide()
      showTools(row)
    }

    $scope.add = function (tool, toolName) {
      if (tool == undefined || toolName.length == 0) {
        alert('보유 교구 카테고리와 이름을 정확히 입력해주세요')
        return
      }
      $mdDialog.hide()
      $scope.insertTool(tool, toolName, function () {
        showTools(row)
      })
    }
  }

  function NuriboxDialogController($scope, $mdDialog, showNuribox, row) {
    $scope.Nuribox = []
    /*        NuriboxList.isThirdFiltered($http, 3, 2, function(result){
                console.log(result)
            });*/
    $scope.showNuriboxDetail = function (nuribox_item, ev) {
      if (nuribox_item.selected_status == NuriboxList.STATUS_NEXT_SELECTED ||
        nuribox_item.selected_status == NuriboxList.STATUS_NONE ||
        nuribox_item.selected_status == NuriboxList.STATUS_FIRST_OWN
      )
        return;

      $mdDialog.show({
        controller: NuriboxDetailDialogController,
        templateUrl: 'templates/nuriboxdetail.html',
        parent: angular.element(document.body),
        locals: {
          showNuribox: showNuribox,
          nuribox_item
        },
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
    };




    function resetTestSet() {
      NuriboxList.fetchNuriboxList($http, row.m_no, function (list) {
        var moniter;
        NuriboxTestSet = []
        NuriboxTestSetOrg = []
        var inputList = [];
        for (var i in list) {
          if (list[i].own_or_need != NuriboxList.NURIBOX_OWN) {
            inputList.push(list[i])
          }
        }
        getTestMatrix(0, moniter, inputList);
      })
    }

    function makeTestSet(input) {
      var result = [];
      for (var i = 0; i < 4; i++) {
        result[i] = new Array();
        for (var j = 0; j < 4; j++) {
          var isOrder = 0;
          if (input.datas[j + i * 4].is_order == 1)
            isOrder = 1;
          else
            isOrder = 0;
          result[i][j] = isOrder;
        }
        result[i][4] = input.items[i].goodsno;
        result[i][5] = input.items[i].goodsnm;
        result[i][6] = input.items[i].tool_features;
        result[i][7] = input.mems[i].nickname;
      }
      return result
    }
    //NuriboxTestSet 생성
    function getTestMatrix(count, result, list) {
      var sno = list[count].sno;
      var mno = row.m_no;
      $http.get(GLOBALS.API_HOME + 'get-recent-item/' + mno + 'a' + sno)
        .success(function (data, status, headers, config) {
          var tmp = makeTestSet(data);
          for (var i = 0; i < tmp.length; i++) {
            if (data.target == tmp[i][4]) {
              //swap
              var tmpRow = tmp[i].slice(0);
              tmp[i] = tmp[0].slice(0);
              tmp[0] = tmpRow;
              break;
            }
          }
          NuriboxTestSetOrg[count] = tmp.slice(0);
          if (count < 3) {
            return getTestMatrix(++count, result, list);
          } else {
            for (var i in NuriboxTestSetOrg)
              NuriboxTestSet[i] = NuriboxTestSetOrg[i].slice(0)

            miningNuribox();
            return 1;
          }
        })
    }

    function miningNuribox() {
      NuriboxList.fetchNuriboxList($http, row.m_no, function (list) {

        var nuribox_list = [], j = 0, order = 0, selected_status = NuriboxList.STATUS_NONE
        for (var i in list) {
          var status = '', first_filtering = '', second_filtering = '', third_filtering = '', remark, selected_item = {}, third_filtered_reason, order = j;

          if (list[i].own_or_need == NuriboxList.NURIBOX_NEED) {
            status = '필요'
            if (j < NuriboxList.MAX_NURIBOX_RECOMMENDED_ITEM) {
              selected_item = NuriboxList.pickClosestrNuriboxItem(NuriboxTestSet[j])
              second_filtering = selected_item.goodsnm
              selected_status = NuriboxList.STATUS_FIRST_NEED
              j++ // Selected item counted
            }
            else selected_status = NuriboxList.STATUS_NEXT_SELECTED
          }
          else if (list[i].own_or_need == NuriboxList.NURIBOX_OWN) {
            status = '보유'
            first_filtering = '제거'
            selected_status = NuriboxList.STATUS_FIRST_OWN
          } else {
            if (j < NuriboxList.MAX_NURIBOX_RECOMMENDED_ITEM) {
              selected_item = NuriboxList.pickClosestrNuriboxItem(NuriboxTestSet[j])
              second_filtering = selected_item.goodsnm
              selected_status = NuriboxList.STATUS_SECOND_SELECTED
            }
            else selected_status = NuriboxList.STATUS_NEXT_SELECTED
          }


          var nuribox_item = {
            category: list[i].catnm,
            status: status, // Retrive whether it is owned
            first_filtering: first_filtering,
            second_filtering: second_filtering,
            third_filtering: third_filtering,
            nuribox: (selected_item != undefined ? selected_item.goodsnm : ''),
            remark: NuriboxList.getStatusText(selected_status, selected_item.tool_features),
            selected_item: selected_item,
            selected_status: selected_status,
            row: row,
            NuriboxVectorSet: NuriboxTestSetOrg[order], //Deliver Original Vector as NuriboxVectorSet is getting manipulated
            second_filtering_result: selected_status == NuriboxList.STATUS_SECOND_SELECTED ||
              selected_status == NuriboxList.STATUS_FIRST_NEED ? selected_item.result.slice(0) : undefined,
            highestValueIndex: selected_item.highestValueIndex
          }

          if (selected_status == NuriboxList.STATUS_SECOND_SELECTED) { // Third Filtering
            thirdFiltering($scope, $http, row.m_no, i, NuriboxTestSet[j], nuribox_item, 1)
            j++
          }
          nuribox_list.push(nuribox_item)
        }
        //end for
        $scope.Nuribox = nuribox_list
      })
    }
    var createNuribox = function () {
      resetTestSet(); // Test purpose only, this has to be replaced with the fucation brining initial vector data
    }
    $scope.hide = function () {
      $mdDialog.hide()
    }

    $scope.cancel = function () {
      $mdDialog.cancel()
    }
    $scope.answer = function (answer) {
      $mdDialog.hide(answer)
    }
    $scope.fetchInitialData = createNuribox
    $scope.createNuribox = createNuribox

    var thirdFiltering = function ($scope, $http, m_no, index, NuriboxVectorSet, nuribox_item, count) {
      thirdFilteringPromise($scope, $http, m_no, index, NuriboxVectorSet, nuribox_item, count)
        .then(function (param) {
          NuriboxVectorSet[param.nuribox_item.selected_item.highestValueIndex] = undefined
          param.nuribox_item.remark = NuriboxList.getStatusText(NuriboxList.STATUS_THIRD_SELECTED, param.nuribox_item.selected_item.tool_features)
          param.nuribox_item.selected_item = NuriboxList.pickClosestrNuriboxItem(NuriboxVectorSet)
          param.nuribox_item.third_filtering = param.nuribox_item.selected_item.goodsnm
          param.nuribox_item.selected_status = NuriboxList.STATUS_THIRD_SELECTED
          param.nuribox_item.nuribox = param.nuribox_item.selected_item.goodsnm

          // recursively find the right match till the sample exists
          thirdFiltering(param.$scope, $http, m_no, param.index, NuriboxVectorSet, param.nuribox_item, ++param.count) // recursive       
        },
        function (param) {
          if (param.count != 1) // When third filtering triggered, then replace the current second filtered item
            param.$scope.Nuribox[param.index] = param.nuribox_item
        })
    }

    var thirdFilteringPromise = function ($scope, $http, m_no, index, NuriboxVectorSet, nuribox_item, count) {
      return new Promise(function (resolve, reject) {
        NuriboxList.isThirdFiltered($http, m_no, nuribox_item.selected_item.tool_features, nuribox_item, function (result) {
          if (count == 3) {
            reject({ $scope, nuribox_item, index, count })
            return
          }
          if (result)
            resolve({ $scope, nuribox_item, index, count })
          else reject({ $scope, nuribox_item, index, count })
        })
      })
    }
  }
  function NuriboxDetailDialogController($scope, $mdDialog, $http, showNuribox, nuribox_item) {

    $scope.kidsSchoolNames = [nuribox_item.NuriboxVectorSet[0][7], nuribox_item.NuriboxVectorSet[1][7], nuribox_item.NuriboxVectorSet[2][7], nuribox_item.NuriboxVectorSet[3][7]];
    $scope.itemNames = [nuribox_item.NuriboxVectorSet[0][5], nuribox_item.NuriboxVectorSet[1][5], nuribox_item.NuriboxVectorSet[2][5], nuribox_item.NuriboxVectorSet[3][5]];
    $scope.result = nuribox_item.second_filtering_result;
    $scope.NuriboxVectorSet = nuribox_item.NuriboxVectorSet;
    $scope.highestValueIndex = nuribox_item.highestValueIndex;

    $scope.getPurchaseStatusText = function (value) {
      return value == 1 ? "구매" : "반송";
    }
    $scope.getVectorText = function (vector) {
      return "( " + vector[0] + ", " + vector[1] + ", " + vector[2] + ", " + vector[3] + " )"
    }

    $scope.close = function () {
      $mdDialog.hide();
      showNuribox(nuribox_item.row);
    }
  }
})

var ProductCategory = {
  convertCategoryList: function (response) {
    var dataSet = []
    for (var i in response.data) {
      var data = {
        catnm: response.data[i].catnm,
        sno: response.data[i].sno
      }
      dataSet.push(data)
    }
    return dataSet
  },

  fetchCategoryList: function ($http, done) {
    $http({
      method: 'GET',
      url: GLOBALS.API_HOME + 'category-list'
    }).then(function successCallback(response) {
      done(ProductCategory.convertCategoryList(response))
    }, function errorCallback(response) { })
  }
}

var NuriboxList = {
  convertNuriboxList: function (response) {
    var dataSet = []
    for (var i in response.data) {
      var own_or_need = NuriboxList.NURIBOX_NOT_OWN_AND_NEED
      if (response.data[i].need_cnt > 0) {
        own_or_need = NuriboxList.NURIBOX_NEED
      }
      else if (response.data[i].own_cnt > 0) {
        own_or_need = NuriboxList.NURIBOX_OWN
      }
      var data = {
        catnm: response.data[i].catnm,
        sno: response.data[i].sno,
        own_or_need: own_or_need
      }
      dataSet.push(data)
    }
    return dataSet
  },

  fetchNuriboxList: function ($http, userno, done) {
    $http({
      method: 'GET',
      url: GLOBALS.API_HOME + 'nuribox-list/' + userno
    }).then(function successCallback(response) {
      done(NuriboxList.convertNuriboxList(response))
    }, function errorCallback(response) { })
  },

  pickClosestrNuriboxItem: function (NuriboxVectorSet) {
    var result = []
    result[0] = -1
    var highestValueIndex = 0

    for (var i = 1; i < NuriboxVectorSet.length; i++) {
      var comparingValueSum = 0
      if (NuriboxVectorSet[i] != undefined) {
        for (var j = 0; j < 4; j++) {
          comparingValueSum += NuriboxVectorSet[0][j] & NuriboxVectorSet[i][j]
        }
      }
      else comparingValueSum = -1 // For third_filtering to except the second filtered item

      highestValueIndex = result[highestValueIndex] >= comparingValueSum ? highestValueIndex : i
      result.push(comparingValueSum)
    }
    return {
      goodsno: NuriboxVectorSet[highestValueIndex][4],
      goodsnm: NuriboxVectorSet[highestValueIndex][5],
      tool_features: NuriboxVectorSet[highestValueIndex][6],
      highestValueIndex: highestValueIndex,
      result: result
    }
  },

  NURIBOX_NOT_OWN_AND_NEED: 0,
  NURIBOX_OWN: 1,
  NURIBOX_NEED: 2,

  MAX_NURIBOX_RECOMMENDED_ITEM: 4,

  STATUS_NONE: 0,
  STATUS_FIRST_OWN: 1,
  STATUS_FIRST_NEED: 2,
  STATUS_SECOND_SELECTED: 3,
  STATUS_THIRD_SELECTED: 4,
  STATUS_NEXT_SELECTED: 5,

  getStatusText: function (status, third_reason) {
    switch (status) {
      case this.STATUS_NONE:
        return ''
      case this.STATUS_FIRST_OWN:
        return ''
      case this.STATUS_FIRST_NEED:
        return '필요교구 우선'
      case this.STATUS_SECOND_SELECTED:
        return '2차필터링 - 알고리즘 적용'
      case this.STATUS_THIRD_SELECTED:
        return '3차필터링 - ' + GLOBALS.getListToolFeatures(third_reason)
      case this.STATUS_NEXT_SELECTED:
        return '다음 누리박스에 적용'
    }
  },
  isThirdFilteredTest: function (tool_features) { // Find the returned record whose reason matches 
    return ((tool_features & GLOBALS.TOOL_FEATURE_PRICE) == GLOBALS.TOOL_FEATURE_PRICE)
  },
  isThirdFiltered: function ($http, m_no, return_type, nuribox_item, done) {
    $http({
      method: 'POST',
      url: GLOBALS.API_HOME + 'return_list_with_reason/',
      data: {
        m_no: m_no,
        return_type: return_type
      }
    }).then(function successCallback(response) {
      if (done != null)
        return done(response.data[0].count > 0 ? true : false)
    }, function errorCallback(response) {
      if (done != null)
        return done(false)
    })
  }
}




