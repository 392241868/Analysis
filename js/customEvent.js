/*添加已有指标*/

//  crossDomainReq(httpUrl+'report-spark-web/customevent/selectAnalysisType',"",'selectAnalysisType','bb1');
//var d1=crossDomainReq(httpUrl + 'report-spark-web/quota/getAlgoriList', "analysisTypeId=" + sessionStorage.analysisTypeId, 'getAlgoriList', 'aa3'); //获取算法
if (sessionStorage.editEventId != undefined) {
  $.when(
    $.ajax({　　　　
      type: "get",
      url: httpUrl + 'report-spark-web/quota/getAlgoriList?analysisTypeId=' + sessionStorage.analysisTypeId,
      /*url写异域的请求地址*/
      dataType: "jsonp",
      jsonpCallback: "cb1",
      success: function(data) {
        getAlgoriList(data);
      }　
    }),
    $.ajax({　　　　
      type: "get",
      url: httpUrl + 'report-spark-web/quota/getLogInfo?projectId=' + sessionStorage.editProjectId,
      /*url写异域的请求地址*/
      dataType: "jsonp",
      jsonpCallback: "cb2",
      success: function(data) {
        getLogInfo(data);
      }　
    }), 　 //crossDomainReq(httpUrl + 'report-spark-web/project/selectProject', "userName=" + sessionStorage.username, 'getProIds', 'aa2');
    $.ajax({　　　　
      type: "get",
      url: httpUrl + 'report-spark-web/project/selectProject?userName=' + sessionStorage.username,
      /*url写异域的请求地址*/
      dataType: "jsonp",
      jsonpCallback: "cb3",
      success: function(data) {
        getProIds(data);
      }　
    }),
    $.ajax({　　 //crossDomainReq('http://112.124.105.3/report-ali-web/province_city/all', "", "province_city", 'success_jsonpCallback2'); //得到省　　
      type: "get",
      url: 'http://112.124.105.3/report-ali-web/province_city/all',
      /*url写异域的请求地址*/
      dataType: "jsonp",
      jsonpCallback: "cb4",
      success: function(data) {
        province_city(data);
      }　
    }), //crossDomainReq('http://api.log.skysrt.com/report-gz-web/model_size/model', "", "getModelChip1", 'success_jsonpCallback1'); //得到机型机芯
    $.ajax({　　　　
      type: "get",
      url: 'http://api.log.skysrt.com/report-gz-web/model_size/model',
      /*url写异域的请求地址*/
      dataType: "jsonp",
      jsonpCallback: "cb5",
      success: function(data) {
        getModelChip1(data);
      }　
    }), // crossDomainReq(httpUrl+'report-spark-web/customevent/selectAnalysisType',"",'selectAnalysisType','bb1');
    $.ajax({　　　　
      type: "get",
      url: httpUrl + 'report-spark-web/customevent/selectAnalysisType',
      /*url写异域的请求地址*/
      dataType: "jsonp",
      jsonpCallback: "cb6",
      success: function(data) {
        selectAnalysisType(data);
      }　
    })
  ).done(function() {
    switch (sessionStorage.analysisTypeId) {
      case "3":
        crossDomainReq(httpUrl + 'report-spark-web/customevent/getDistributeEvent', 'eventId=' + sessionStorage.editEventId, 'getCustomEvent', 'bb2');
        break;
      default:
        crossDomainReq(httpUrl + 'report-spark-web/customevent/getCustomEvent', 'eventId=' + sessionStorage.editEventId, 'getCustomEvent', 'bb2');
        break;
    }
  });
} else {
  crossDomainReq(httpUrl + 'report-spark-web/quota/getAlgoriList', "analysisTypeId=" + sessionStorage.analysisTypeId, 'getAlgoriList', 'aa3'); //获取算法
  crossDomainReq(httpUrl + 'report-spark-web/quota/getLogInfo', "projectId=" + sessionStorage.step1Data.split("&")[sessionStorage.step1Data.split("&").length - 1].split("=")[1], 'getLogInfo', 'aa4');
  crossDomainReq(httpUrl + 'report-spark-web/project/selectProject', "userName=" + sessionStorage.username, 'getProIds', 'aa2');
  crossDomainReq('http://112.124.105.3/report-ali-web/province_city/all', "", "province_city", 'success_jsonpCallback2'); //得到省市
  crossDomainReq('http://api.log.skysrt.com/report-gz-web/model_size/model', "", "getModelChip1", 'success_jsonpCallback1'); //得到机型机芯
}
// if(sessionStorage.analysisTypeId=='1'||sessionStorage.analysisTypeId=='2')
// crossDomainReq(httpUrl + 'report-spark-web/quota/list', "", 'quotaList', 'aa1'); //指标列表
/*获取算法*/
function getAlgoriList(data) {
  var options = new StringBuilder();
  $.each(data, function(i, v) {
    options.append("<option value='" + v.algoriId + "'>" + v.algoriName + "</option>");
  });
  $("#algoriId").html(options.toString());
  if ($("option:selected", "#algoriId").text() == '计数') {
    $("#statItem").hide();
    $("#statItem").parent().hide();
    $("#statItem").parent().prev().hide();
  } else {
    $("#statItem").show();
    $("#statItem").parent().show();
    $("#statItem").parent().prev().show();
  }
}

function getLogInfo(data) {
  $("#logId-error").hide();
  $("#logId").removeClass('error');
  getLogId(data);
}

function getProIds(data) {
  var option = new StringBuilder();
  $.each(data, function(i, v) {
    if (v.projId != '1')
      option.append('<option value="' + v.projId + '">' + v.projName + '</option>');
  });
  $("#projectId").html(option.toString());
  if (sessionStorage.projectId != undefined) {
    //if(sessionStorage.projectId!='1'){
    $("#projectId").attr("disabled", 'disabled');
    if (sessionStorage.editProjectId == undefined)
      $("#projectId").val(sessionStorage.step1Data.split("&")[sessionStorage.step1Data.split("&").length - 1].split("=")[1]);
    else
      $("#projectId").val(sessionStorage.editProjectId);
    //}
  }
  $("#projectId").change(function(i, v) {
    $("#logId").val('');
    crossDomainReq(httpUrl + 'report-spark-web/quota/getLogInfo', "projectId=" + $(this).val(), 'getLogInfo', 'aa3');
  });
}

function getQuotaList(data) {
  // debugger
  if (data.length == 0) {
    $(".addExistQuota").hide();
  } else {
    $(".addExistQuota").show();
  }
  var str = new StringBuilder();
  str.append('<select class="form-control" id="qParent1" >');
  $.each(data, function(i, v) {
    str.append('<option value="' + v.projectId + '">' + v.projName + '</option>');
  });
  str.append('</select>');
  str.append('<select class="form-control" id="qParent2" >');
  $.each(data, function(i, v) {
    $.each(v.logInfos, function(j, k) {
      if (data.length == 0) {
        $(".addExistQuota").hide();
      } else {
        $(".addExistQuota").show();
      }
      str.append('<option proId="' + v.projectId + '" value="' + k.logId + '" title="' + k.logDesc + '">' + k.logName + '</option>');
    })
  })
  str.append('</select>');
  str.append('<select class="form-control" id="qParent3" >');
  $.each(data, function(i, v) {
    $.each(v.logInfos, function(j, k) {
      $.each(k.algoriInfos, function(m, n) {
        var value = v.projectId + "-" + k.logId;
        var onlyV = v.projectId + "-" + k.logId + "-" + n.algoriId;
        str.append('<option proId="' + v.projectId + '" value="' + onlyV + '" algoriId="' + n.algoriId + '" proLog="' + value + '" logId="' + k.logId + '" >' + n.algoriName + '</option>');
      });
    })
  });
  str.append('</select>');

  /*表格*/
  // str.append('<select class="form-control" id="qParent4" >');
  var tbody = new StringBuilder();
  $.each(data, function(i, v) {
    $.each(v.logInfos, function(j, k) {
      $.each(k.algoriInfos, function(m, n) {
        $.each(n.results, function(a, b) {
          tbody.append("<tr proLogAlgoriId='" + v.projectId + "-" + k.logId + "-" + n.algoriId + "'><td style='width:100px;'><input value='" + b.quotaId + "' class='quotaIdList' name='quotaId' quotaStatusName='" + b.quotaStatusName + "' type='radio'/>" + b.quotaId + "</td><td>" + b.quotaName + "</td><td>" + b.filterConditions + "</td></tr>");
        });
      });
    })
  });
  $("#tb-data1 tbody").html(tbody.toString());
  $("#existQuotaList").html(str.toString());
  $("option[proId='" + $("#qParent1").val() + "']", "#qParent2").show();
  $("option[proId!='" + $("#qParent1").val() + "']", "#qParent2").hide();
  $("#qParent2").val($("option[proId='" + $("#qParent1").val() + "']", "#qParent2").eq(0).val());
  $("option[proLog='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").show();
  $("option[proLog!='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").hide();
  $("#qParent3").val($("option[proLog='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").eq(0).val());
  $("#tb-data1 tr[proLogAlgoriId='" + $("#qParent3").val() + "']").show();
  $("#tb-data1 tr[proLogAlgoriId!='" + $("#qParent3").val() + "']").hide();
  $("#qParent1").change(function() {
    $("option[proId='" + $("#qParent1").val() + "']", "#qParent2").show();
    $("option[proId!='" + $("#qParent1").val() + "']", "#qParent2").hide();
    $("#qParent2").val($("option[proId='" + $("#qParent1").val() + "']", "#qParent2").eq(0).val());
    $("option[proLog='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").show();
    $("option[proLog!='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").hide();
    $("#qParent3").val($("option[proLog='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").eq(0).val());
    $("#qParent2").change();
  });
  $("#qParent2").change(function() {
    $("option[proLog='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").show();
    $("option[proLog!='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").hide();
    $("#qParent3").val($("option[proLog='" + $("#qParent1").val() + "-" + $("#qParent2").val() + "']", "#qParent3").eq(0).val());
    //$("#showExistQuota").click();
    $("#tb-data1 tr[proLogAlgoriId='" + $("#qParent3").val() + "']").show();
    $("#tb-data1 tr[proLogAlgoriId!='" + $("#qParent3").val() + "']").hide();
  });
  $("#qParent3").change(function() {
    $("#tb-data1 tr[proLogAlgoriId='" + $("#qParent3").val() + "']").show();
    $("#tb-data1 tr[proLogAlgoriId!='" + $("#qParent3").val() + "']").hide();
  });
}
/*添加新指标*/
function getLogId(data) {
  var str = new StringBuilder();
  str.append('<select class="form-control" id="parent1" >');
  $.each(data, function(i, v) {
    str.append('<option value="' + v.productId + '">' + v.proName + '</option>');
  });
  str.append('</select>');
  str.append('<select class="form-control" id="parent2" >');
  $.each(data, function(i, v) {
    $.each(v.logIndexInfos, function(j, k) {
      str.append('<option proId="' + v.productId + '" value="' + k.logIndex + '">' + k.logIndex + '</option>');
    })
  })
  str.append('</select>');
  str.append('<select class="form-control" id="parent3" >');
  $.each(data, function(i, v) {
    $.each(v.logIndexInfos, function(j, k) {
      $.each(k.logInfos, function(m, n) {
        str.append('<option title="' + n.logDesc + '" proId="' + v.productId + '" logIndex="' + k.logIndex + '" proUniqueId="' + v.proUniqueId + '" conditions="' + n.conditions + '" value="' + n.logId + '" logType="' + n.logType + '">' + n.logName + '</option>');
      });
    })
  });
  str.append('</select><input type="button" class="btn btn-primary" id="addLogId"  value="确定">');
  $("#getLogIdList").html(str.toString());
  $("option[proId='" + $("#parent1").val() + "']", "#parent2").show();
  $("option[proId!='" + $("#parent1").val() + "']", "#parent2").hide();
  $("#parent2").val($("option[proId='" + $("#parent1").val() + "']", "#parent2").eq(0).val());
  $("option[logIndex='" + $("#parent2").val() + "']", "#parent3").show();
  $("option[logIndex!='" + $("#parent2").val() + "']", "#parent3").hide();
  $("#parent3").val($("option[logIndex='" + $("#parent2").val() + "']", "#parent3").eq(0).val());
  $("#parent1").change(function() {
    $("option[proId='" + $(this).val() + "']", "#parent2").show();
    $("option[proId!='" + $(this).val() + "']", "#parent2").hide();
    $("#parent2").val($("option[proId='" + $(this).val() + "']", "#parent2").eq(0).val());
    $("option[logIndex='" + $("#parent2").val() + "']", "#parent3").show();
    $("option[logIndex!='" + $("#parent2").val() + "']", "#parent3").show();
    $("#parent3").val($("option[logIndex='" + $("#parent2").val() + "']", "#parent3").eq(0).val());
  });
  $("#parent2").change(function() {
    $("option[logIndex='" + $(this).val() + "']", "#parent3").show();
    $("option[logIndex!='" + $(this).val() + "']", "#parent3").hide();
    $("#parent3").val($("option[logIndex='" + $(this).val() + "']", "#parent3").eq(0).val());
  });
}

function getDatalist1(data) {
  $("#filterItems").parent().html('<select class="form-control" id="filterItems" ></select>');
  var options = new StringBuilder();
  var statItemOptions = new StringBuilder();
  var displayItemOptions = new StringBuilder();
  // statItemOptions.append("<option value=''></option>");
  options.append("<option value='1'>省市</option>");
  options.append("<option value='3'>省</option>");
  options.append("<option value='2'>机型机芯</option>");
  options.append("<option value='4'>机型</option>");
  displayItemOptions.append("<option value='province'>省</option>");
  displayItemOptions.append("<option value='city'>市</option>");
  displayItemOptions.append("<option value='model'>机型</option>");
  displayItemOptions.append("<option value='chip'>机芯</option>");
  $.each(data[0], function(i, v) {
    options.append('<option value="' + v + '">' + i + '</option>');
    displayItemOptions.append('<option value="' + v + '">' + i + '</option>');
    statItemOptions.append('<option value="' + v + '">' + i + '</option>');
  });
  $("#statItem").html(statItemOptions.toString());
  var selectedItem = '';
  $("#displayItem").html(displayItemOptions.toString());
  $("#displayItem").attr("multiple", 'multiple');
  $('#displayItem').multiselect({
    enableFiltering: true,
    numberDisplayed: 2,
    buttonWidth: '100%',
    onChange: function(option, checked, select) {
      selectedItem = option;
    },
    buttonText: function(options, a, b, c, d) {
      var maxLength = 2;
      if (options.length > maxLength) {
        $('#displayItem').multiselect('deselect', $(selectedItem).val());
        alert("最多选择两个");
      }
      if (options.length === 0) {
        return ' <b class="caret"></b>';
      } else {
        var selected = '';
        var li=new StringBuilder();
        if(options.length>maxLength){
                  options.each(function(i, v) {
                    if (v.value != $(selectedItem).val()){
                      selected += $(this).text() + ', ';
                      var j=i+1;
                      li.append('<li><span v="'+v.value+'">'+$(this).text()+'：</span><input type="number" name="'+$(this).text()+'" v="'+v.value+'" class="form-control" value="'+j+'" placeholder="输入排序序号"></li>');
                    }
                  });
                }else{
                       options.each(function(i, v) {
                      selected += $(this).text() + ', ';
                       var j=i+1;
                      li.append('<li><span v="'+v.value+'">'+$(this).text()+'：</span><input type="number" name="'+$(this).text()+'" v="'+v.value+'"   value="'+j+'" class="form-control" placeholder="输入排序序号"></li>');
                  });
                }
       $("#displayItemSort ul").html(li.toString());
       $("#displayItemSort").show();
        return "<span>" + selected.substr(0, selected.length - 2) + '</span><b class="caret"></b>';
      }
    }
  });
  $("#filterItems").html(options.toString());
  $("#filterItems").attr("multiple", 'multiple');
  $('#filterItems').multiselect({
    enableFiltering: true,
    buttonWidth: '100%',
    buttonText: function(options, a, b, c, d) {
      $("#otherC").html('');
      $(".proCity,.modelChip,.pro,.model").hide();
      if (options.length === 0) {
        return '<b class="caret"></b>';
      } else {
        for (var i = 0; i < options.length; i++) {
          switch (options[i].value) {
            case "1":
              $(".proCity").show()
              break;
            case "2":
              $(".modelChip").show()
              break;
            case "3":
              $(".pro").show()
              break;
            case "4":
              $(".model").show()
              break;
            default:
              $("#otherC").append("<dt class='otherC' title='" + options[i].innerHTML + "'>" + options[i].innerHTML + "：</dt>");
              $("#otherC").append('<dd class="otherC"><input type="text" key="' + options[i].value.replace("['", '-').replace("']", '') + '" name="' + options[i].value + '" id="' + options[i].value + '" class="form-control"></dd>');
              break;
          }
        }
        $("#filter").show();
        $("#otherC dd,#otherC dt").show();
        var selected = '';
        options.each(function() {
          selected += $(this).text() + ', ';
        });
        console.log(selected.length);
        selected = selected.substring(0, selected.length - 2);
        if (selected.length >= 35) {
          return "<span>" + selected.substr(0, 35) + '...</span><b class="caret"></b>';
        } else {
          return "<span>" + selected + '</span><b class="caret"></b>';
        }
      }
    }
  });
}
/*事件添加*/
$("#addTimeCycle").click(function() {
  crossDomainReq(httpUrl + 'report-spark-web/customevent/updateTimeCycle', "eventId=" + sessionStorage.eventId + "&timeCycle=" + $("input[name='timeCycle']:checked").val(), 'updateTimeCycle', 'aa1');
});
if (sessionStorage.timeCycle != undefined) {
  $("input[type=radio][value=" + sessionStorage.timeCycle + "]").attr("checked", 'checked')
  $("input[name='timeCycle']").attr("disabled", 'disabled');
}
$(".addExistQuota").click(function() {
  //debugger;
  $("#addExistQuota").modal('show');
});
$("#addQuotaBtn").click(function() {
  $("input[type='checkbox']:checked", ".multiselect-container").each(function() {
    $(this).click();
  });
  $('input[type="checkbox"]:checked', ".selections").each(function() {
    $(this).click();
  });
  $('input[type="checkbox"]:checked', "#model_chip .btn-group").each(function() {
    $(this).click();
  });
  $("#myModalLabel").html('新增指标');
  $("#addQuota").val('新增指标');
  $("#myModalLabel").html('新增指标');
  quotaId = 0;
  if ($("#tb-data tbody tr").length < 5) {
    $('#myModal').modal('show');
  } else {
    alert('最多添加5个指标！')
  }
});
$("#add-SQLQuota").click(function() {
  if ($("#tb-data tbody tr").length < 5) {
    $('#addSQLQuota').modal('show');
  } else {
    alert('最多添加5个指标！')
  }
});
$("#logId").click(function() {
  $("#getLogIdList").toggle();
});
$(document).on('click', '#addLogId', function() {
  $("#logId").val($("#parent3>option:selected").text()).attr("v", $("#parent3").val()).attr("logType", $("#parent3>option:selected").attr("logType")).attr("conditions", $("#parent3>option:selected").attr("conditions")).attr("proUniqueId", $("#parent3>option:selected").attr("proUniqueId"));
  $("#getLogIdList").hide();
  crossDomainReq(httpUrl + 'report-spark-web/quota/getDatalist', "logId=" + $("#logId").attr('v'), 'getDatalist', 'aa3');
});
$("#proCity").click(function() {
  $("#pro_city").toggle();
});
$("#province").click(function() {
  $("#provinceDiv").toggle();
});
$("#algoriId").change(function() {
  if ($("option:selected", this).text() == '计数') {
    // $("#statItem").attr("disabled", "disabled");
    $("#statItem").hide();
    $("#statItem").parent().hide();
    $("#statItem").parent().prev().hide();
  } else {
    //  $("#statItem").removeAttr("disabled");
    $("#statItem").show();
    $("#statItem").parent().show();
    $("#statItem").parent().prev().show();
  }
});
$("#addProCity").click(function() {
  var provinceAndCity = $('.selected .item', "#pro_city .tree-multiselect").map(function() {
    return $(".section-name", this).html() + "-" + $(this).attr('data-value');
  }).get().join(',');
  if (provinceAndCity.length > 30)
    $("#proCity").val(provinceAndCity.substring(0, 30) + "...");
  else
    $("#proCity").val(provinceAndCity);
  $("#proCity").attr('title', provinceAndCity);
  $("#pro_city").hide();
});
$("#addPro").click(function() {
  var provinceAndCity = $('.selected .item', "#provinceDiv .tree-multiselect").map(function() {
    return $(".section-name", this).html() + "-" + $(this).attr('data-value');
  }).get().join(',');
  if (provinceAndCity.length > 30)
    $("#province").val(provinceAndCity.substring(0, 30) + "...");
  else
    $("#province").val(provinceAndCity);
  $("#province").attr('title', provinceAndCity);
  $("#provinceDiv").hide();
});
$("#lastStep").click(function() {
  window.location.hash = 'addCustomEvent.html?projectMenuId=' + projectMenuId;
})
var filterCondition = '';

function getFilterCondition() {
  if ($("#proCity:visible").length > 0) {
    filterCondition += "省市(" + $("#proCity").attr("title") + ")" + "</br>";
  }
  if ($("#province:visible").length > 0) {
    filterCondition += "省(" + $("#province").attr("title") + ")" + "</br>";
  }
  if ($('button:visible', "#model_chip").length > 0) {
    filterCondition += "机型机芯(" + $("#modelChip-select").next().find("button").eq(0).attr("title").replace(" ", "") + ")" + "</br>";
  }
  if ($('button:visible', "#model").length > 0) {
    filterCondition += "机型(" + $("#model-select").next().find("button").eq(0).attr("title").replace(" ", "") + ")" + "</br>";
  }
  if ($(".otherC").length > 0) {
    $("input", "#otherC").each(function() {
      filterCondition += $(this).parent().prev("dt").attr("title") + "(" + $(this).val() + ")" + "</br>";
    });
  }

}

function getQuota(data) {
  /*取消之前选中项*/
  $('input[type="checkbox"]:checked', ".selections").each(function() {
    $(this).click();
  });
  $('input[type="checkbox"]:checked', "#model_chip .btn-group").each(function() {
    $(this).click();
  });
  $('input[type="checkbox"]:checked', "#model .btn-group").each(function() {
    $(this).click();
  });
  $("#projectId").val(data.projectId);
  $("#algoriId").val(data.algoriId);
  $("#algoriId").change();
  $("#parent1").val(data.productId);　　　　
  $("#parent3").val(data.logId);
  $("#parent2").val($("#parent3>option:selected").attr("logindex"));
  $("#logId").val($("#parent3>option:selected").text()).attr("v", $("#parent3").val()).attr("logType", $("#parent3>option:selected").attr("logType")).attr("conditions", $("#parent3>option:selected").attr("conditions")).attr("proUniqueId", $("#parent3>option:selected").attr("proUniqueId"));
  $.when(
    $.ajax({　　　　
      type: "get",
      url: httpUrl + 'report-spark-web/quota/getDatalist?logId=' + $("#logId").attr('v'),
      /*url写异域的请求地址*/
      dataType: "jsonp",
      /*加上datatype*/
      jsonpCallback: "cb",
      /*设置一个回调函数，名字随便取，和下面的函数里的名字相同就行*/
      success: function(data) {
        getDatalist1(data);

      }　　　　
    })　　
  ).done(function() {
    $.each(data.displayItem.split(","), function(i, v) {
      $("#displayItem").multiselect('select', v.split("-")[0]);
    })
    $("#statItem").val(data.statItem);
    var filterItems = '';
    var $select = $("#filterItems").next(".btn-group").find('button').next(".dropdown-menu");
    if (data.hasOwnProperty("area")) {
      $("#filterItems").multiselect('select', "1");
      var cityList = data.area.split(",");
      $.each(cityList, function(i, v) {
        $("input", "div[data-value='" + v.split("-")[1] + "']").click();
      })
      $("#addProCity").click();
    }
    if (data.hasOwnProperty("province")) {
      $("#filterItems").multiselect('select', "3");
      var cityList = data.province.split(",");
      $.each(cityList, function(i, v) {
        $("input", "div[data-value='" + v.split("-")[1] + "']").click();
      })
      $("#addPro").click();
    }

    if (data.hasOwnProperty("modelChip")) {
      $("#filterItems").multiselect('select', "2");
      $.each(data.modelChip.split(","), function(i, v) {
        $("#modelChip-select").multiselect('select', v);
      })
    }
    if (data.hasOwnProperty("model")) {
      $("#filterItems").multiselect('select', "4");
      $.each(data.model.split(","), function(i, v) {
        $("#model-select").multiselect('select', v);
      })
    }
    if (data.hasOwnProperty("dataList")) {
      var dataList = data.dataList.split(",");
      $.each(dataList, function(i, v) {
        var key = v.split("-")[0];
        var value = v.split("-")[1];
        $('input[type="checkbox"][value="' + key + '"]', $select).click();
        key = key.replace("['", '-').replace("']", '')
        $("input[key='" + key + "']").eq(0).val(value);
      });
    }
    $("#myModalLabel").html('编辑指标');
    $("#addQuota").val('编辑指标');
    $("#myModalLabel").html('编辑指标');
    // $("#myModal").modal('show');
  });
}

$("form#SQLquota").validate({
  onsubmit: true, // 是否在提交是验证
  onfocusout: true, // 是否在获取焦点时验证
  onkeyup: true, // 是否在敲击键盘时验证
  rules: {
    quotaName: {
      required: true
    },
    statSql: {
      required: true
    }
  },
  messages: {
    quotaName: {
      required: '不能为空'
    },
    statSql: {
      required: '不能为空'
    }
  },
  submitHandler: function(form) {
    var $obj = $('input[type="submit"]', form).eq(0);
    $obj.attr("disabled", "disabled");
    $('body').data('btn', $obj);
    operationType = 2;
    //通过之后回调projectId@timeCycle@quotaName@displayItem@statSql@planId@createStep@isUpdate@quotaId@quotaType@operationType@dataTable
    //projectId@timeCycle@quotaName@displayItem@statSql@planId@createStep@isUpdate@quotaId@quotaType@operationType@dataTable
    dataArr = [];
    if (sessionStorage.editProjectId != undefined)
      dataArr.push(sessionStorage.editProjectId);
    else
      dataArr.push(sessionStorage.step1Data.split("&")[sessionStorage.step1Data.split("&").length - 1].split("=")[1]);
    dataArr.push($("input[name='timeCycle']:checked").val());
    dataArr.push($("#quotaName").val());
    dataArr.push('null'); //displayItem
    dataArr.push(encodeURIComponent($("#statSql").val()));
    dataArr.push(0); //planId
    if (sessionStorage.analysisTypeId == '1')
      dataArr.push(0); //createStep
    else
      dataArr.push('createStep'); //createStep
    if (sessionStorage.editEventId == undefined)
      dataArr.push(0); //IsUpdate 0:不更新；1：更新
    else {
      dataArr.push(1); //IsUpdate 0:不更新；1：更新
    }
    dataArr.push(0); //quotaId
    dataArr.push(1); //quotaType 1：趋势分析；2：转化分析；3：分布分析
    dataArr.push(2); //operationType  1：log类型；2：sql类型；3：指标间运算
    dataArr.push('null'); //dataTable
    crossDomainReq(httpUrl + 'report-spark-web/customevent/isExistQuota', "quotaStr=" + dataArr.join("@"), 'isExistQuota', 'aa3');
  }
});