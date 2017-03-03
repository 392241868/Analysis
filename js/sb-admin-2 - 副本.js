var hasChildPage=['eventsDashboard.html'];
if(window.location.hash.search("default.html")>0){
   checkURLForIndex();
}
$(function() {
  $(window).on('hashchange', function () { 
    debugger;
       if(sessionStorage.isNotLeftMenu==undefined)
        checkURL();
       else{
       checkURLAgain();
       }
    });
$(document).on('click', '#side-menu a[href!="#"]', function(e) {
      sessionStorage.removeItem("isNotLeftMenu");
        e.preventDefault();
        var $this = $(e.currentTarget);
        window.location.hash = $this.attr('href');
    });
});
// CHECK TO SEE IF URL EXISTS
function checkURL() {
    //get the url by removing the hash
    var url = location.hash.replace(/^#/, '');

    container = $('#page-wrapper');
    // Do this if url exists (for page refresh, etc...)
    if (url&&$('#side-menu li a[href="' + url + '"]').length) {
        // remove all active class
        $('#side-menu li a.active').removeClass("active");
        // match the url and add the active class
        $('#side-menu li a[href="' + url + '"]').addClass("active");
        var title = ($('#side-menu a[href="' + url + '"]').attr('title'))
         $('#side-menu li a[href="' + url + '"]').parent().parent().parent().addClass("active");
        $('#side-menu').find("li.active").has("ul").children("ul").addClass("collapse in");

        // change page title from global var
        document.title = (title || document.title);
        //console.log("page title: " + document.title);

        // parse url to jquery
        loadURL(url + location.search, container);
    }else{
        // grab the first URL from nav
        var $this = $('#side-menu>li:first-child>ul>li:first-child > a[href!="#"]');
        //update hash
        window.location.hash = $this.attr('href');
    }
}
  function checkURLForIndex(){
    var url = location.hash.replace(/^#/, '');
    container = $('#page-wrapper');
     if (url){
       // change page title from global var
       // document.title = (title || document.title);
        //console.log("page title: " + document.title);

        // parse url to jquery
        loadURL(url + location.search, container);
     }
  }
   function checkURLAgain(){  
     var url = location.hash.replace(/^#/, '');
        container = $('#page-wrapper');
        $('#side-menu li a.active').removeClass("active");
        // match the url and add the active class
        $('#side-menu li a[href="' +  sessionStorage.LeftMenuUrl + '"]').addClass("active");
        var title = ($('#side-menu a[href="' + url + '"]').attr('title'))
         $('#side-menu li a[href="' +  sessionStorage.LeftMenuUrl + '"]').parent().parent().parent().addClass("active");
        $('#side-menu').find("li.active").has("ul").children("ul").addClass("collapse in");
        document.title = (title || document.title);
     loadURL(url + location.search, container);
  }
  
// LOAD AJAX PAGES
function loadURL(url, container) {
    //console.log(container)
    $.ajax({
        type : "GET",
        url : url,
        dataType : 'html',
        cache : true, // (warning: this will cause a timestamp and will call the request twice)
        beforeSend : function() {
            // cog placed
            container.html('<h1><i class="fa fa-cog fa-spin"></i> 加载中...</h1>');
        
            // Only draw breadcrumb if it is main content material
            // TODO: see the framerate for the animation in touch devices
            
            // if (container[0] == $("#content")[0]) {
            //     drawBreadCrumb();
            //     // scroll up
            //     $("html").animate({
            //         scrollTop : 0
            //     }, "fast");
            // } 
        },
        /*complete: function(){
            // Handle the complete event
            // alert("complete")
        },*/
        success : function(data) {
            // container.css({
            //     opacity : '1'
            // }).html(data).delay(50).animate({
            //     opacity : '1.0'
            // }, 300);
             container.html(data);
           

        },
        error : function(xhr, ajaxOptions, thrownError) {
            container.html('<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> 错误 404! 没有找到页面.</h4>');
        },
        async : false
    });

    //console.log("ajax request sent");
}

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }
        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });
});
/*custom JS by wang hai hua*/
function logout(){
    sessionStorage.clear();
    crossDomainReq(httpUrl+'report-spark-web/user/logout','','');
    window.location.href='login.html';
}
function StringBuilder(){
    this._string=[];
}
StringBuilder.prototype.append=function(str){
    this._string.push(str);
}
StringBuilder.prototype.toString=function(){
    return this._string.join("");
}
StringBuilder.prototype.toStringBySeparator=function(separator){
    return this._string.join(separator);
}
var httpUrl='http://api.log.skysrt.com';
var $logNameParent;//测试设备中更改产品ID值时，用$logNameParent记录相应的logName的父类

function crossDomainReqForCompareTime(url,data,type,success_jsonpCallback){
   if(success_jsonpCallback=="undefined")
        success_jsonpCallback='success_jsonpCallback'
    $.ajax({
        type:"post",
        async:true,
        url :url,
        dataType:"jsonp",
        data:data,
        jsonp: "callback",//服务端用于接收callback调用的function名的参数
        jsonpCallback:success_jsonpCallback,//callback的function名称
        error:function(){alert('error')},
        success : function(data){
            $(".loading").hide();
          if(data.flag=='fail'){
             // window.location.href='login.html';
              return false;
          }
            switch(type){
                   case "timeCompare":
                       timeCompareData(data);
                      break;
                  }
      }
  });
}
function crossDomainReq(url,data,type,success_jsonpCallback){
    $(".loading").show();
    if(success_jsonpCallback=="undefined")
        success_jsonpCallback='success_jsonpCallback'
    $.ajax({
        type:"post",
        async:true,
        url :url,
        dataType:"jsonp",
        data:data,
        jsonp: "callback",//服务端用于接收callback调用的function名的参数
        jsonpCallback:success_jsonpCallback,//callback的function名称
        error:function(){alert('error')},
        success : function(data){
            $(".loading").hide();
            // debugger;
          //  alert(data.flag)
          if(data.flag=='sessionOverdue'){
              window.location.href='login.html';
              return false;
          }
          if(data.flag=='fail'){
              alert('请求出错了');
              return false;
          }
            switch(type){
                  case "getProjectList":
                    var option=new StringBuilder();
                   option.append('<option value="">请选择项目</option>');
                    $.each(data,function(i,v){
                        option.append('<option value="'+v.projId+'">'+v.projName +'</option>');
                    });
                     $("#projectList").html(option.toString());
                     if($(".bootstrap-select").length==0){
                        $('#projectList').selectpicker({
                        liveSearch: true,
                        maxOptions: 1
                        });
                     }else{
                      alert('出错了');
                     }
                     $(".dropdown-menu li",$("#projectList").next()).click(function(){
                        sessionStorage.removeItem("isNotLeftMenu");

                        alert(11)

                        console.log(sessionStorage.isNotLeftMenu+"test");
                        var index=$(this).attr("data-original-index");
                        var id=$("#projectList>option").eq(index).attr("value");
                        sessionStorage.projectId=id;
                        sessionStorage.projectName=$(this).text();
                        crossDomainReq(httpUrl+'report-spark-web/proMenu/getMeun/',"projectId="+id+"&userName="+sessionStorage.username,'getMeun');
                     });
                     if(sessionStorage.projectId>0){
                      $("button[data-id='projectList']").attr(sessionStorage.projectName);
                       $('.pull-left',"button[data-id='projectList']").text(sessionStorage.projectName)
                      crossDomainReq(httpUrl+'report-spark-web/proMenu/getMeun/',"projectId="+sessionStorage.projectId+"&userName="+sessionStorage.username,'getMeun');
                     }
                    break;
                   case "getMeun":
                      var str=new StringBuilder();
                        data.result.sort(function(a,b){return a.sortId>b.sortId?1:-1});
                      $.each(data.result,function(i,v){
                        str.append('<li><a href="#"><b class="icon"></b>'+v.projectMenuName+'<span class="fa arrow"></span></a>');
                        str.append('<ul class="nav nav-second-level ">');
                        if(v.children==null)
                          return;
                        v.children.sort(function(a,b){
                          return a.sortId>b.sortId?1:-1
                        });
                        $.each(v.children,function(j,m){
                          str.append('<li><a href="'+m.realDisplayUrl+'?projectMenuId='+m.projectMenuId+'">'+m.projectMenuName+'</a> </li>');
                        })
                        str.append('</ul></li>');
                      });
                       $("#side-menu").html(str.toString());
                        $("#side-menu>li").each(function(){
                          var obj=this;
                          switch($(this).children("a").eq(0).text()){
                            case "用户分析":
                             $('b',obj).addClass('user_a');
                            break;
                            case "功能分析":
                             $('b',obj).addClass('fun_a');
                            break;
                             case "支付分析":
                             $('b',obj).addClass('pay_a');
                            break;
                             case "业务分析":
                             $('b',obj).addClass('business_a');
                            break;
                          }
                        });
                       $('#side-menu').metisMenu();
                        if($('#side-menu').length) {
                            if(sessionStorage.isNotLeftMenu==undefined)
                            checkURL();
                            else{
                              checkURLAgain();
                            }
                        };
                    break;
                     case "getMenuItemList":
                        setLatitude(data);
                     break;
                     case "dimension":
                      setLatitude1(data);
                     break;
                     case "setCommon":
                       setTableData(data);
                     break;
                     case "dashboardShow":
                       setDashboardShowData(data);
                     break;
                     case "launches":
                     setLaunchesData(data);
                      break;
                       case "pay_company":
                    var options="<option value=''>不区分业务</option>";
                    $.each(data.result,function(i,v){
                        options+="<option value='"+ v.app_code+"'>"+ v.app_name+"</option>";
                    });
                    $("#companyCode").html(options);
                    crossDomainReq(httpUrl+'report-spark-web/proMenuItem/getMenuItemList',"projectMenuId="+projectMenuId,'getMenuItemList');
                   // search();
                    break;
                     case "business-type":
                    var options="<option value=''>不区分业务</option>";
                    $.each(data,function(i,v){
                        options+="<option value='"+ v.businessType+"'>"+ v.businessName+"</option>";
                    });
                    $("#companyCode").html(options);
                    crossDomainReq(httpUrl+'report-spark-web/proMenuItem/getMenuItemList',"projectMenuId="+projectMenuId,'getMenuItemList');
                    break;
                    case "province_city":
                      if (data == null || data.length == 0) { alert('我只能说没有数据！'); return false; }
                      var str=new StringBuilder();
                      var strCity=new StringBuilder();
                      $.each(data,function(i,v){
                        strCity.append("<option value='"+v.p+"' data-section='所有省'>"+v.p+"</option>");
                        $.each(v.c,function(j,k){
                          str.append("<option value='"+k+"' data-section='"+v.p+"'>"+k+"</option>");
                        })
                      })
                      $("#proCity-select").html(str.toString());
                      $("#pro-select").html(strCity.toString());
                      $("#pro-select").treeMultiselect({ enableSelectAll: false, sortable: true,allowBatchSelection:false,collapsible:false,onChange:function(allSelectedObj,currentObj){
                        if(allSelectedObj.length>maxLength){
                          alert('最多选择'+maxLength+'个')
                          var $matchingSelection = $(".selections",$("#pro-select").next()).find("div.item[data-value='" + currentObj[0].value + "']");
                          var $matchingCheckbox = $matchingSelection.find("> input[type=checkbox]");
                          $matchingCheckbox.prop('checked', false);
                          $matchingCheckbox.change();
                          return false;
                        }
                      }});
                      $("#proCity-select").treeMultiselect({ enableSelectAll: false, sortable: true ,startCollapsed:true,allowBatchSelection:false,onChange:function(allSelectedObj,currentObj){
                          if(allSelectedObj.length>maxLength){
                          alert('最多选择'+maxLength+'个')
                          var $matchingSelection = $(".selections",$("#proCity-select").next()).find("div.item[data-value='" + currentObj[0].value + "']");
                          var $matchingCheckbox = $matchingSelection.find("> input[type=checkbox]");
                          $matchingCheckbox.prop('checked', false);
                          $matchingCheckbox.change();
                          return false;
                        }

                      }});
                      // <option value="blueberry" data-section="Smoothies">Blueberry</option>
                      // <option value="strawberry" data-section="Smoothies">Strawberries</option>
                      // <option value="peach" data-section="Smoothies">Peach</option>
                      // <option value="milk tea" data-section="Smoothies/Bubble Tea">Milk Tea</option>
                      // <option value="green apple" data-section="Smoothies/Bubble Tea">Green Apple</option>
                      // <option value="passion fruit" data-section="Smoothies/Bubble Tea" data-description="The greatest flavor" selected="selected">Passion Fruit</option>
                    break;
                    case "getModelChip":
                      var model=new StringBuilder();
                      var model_Chip=new StringBuilder();
                      var modelArr=[];
                      $.each(data,function(i,v){
                         var m=v.split('-')[0];
                        if(modelArr.indexOf(m)<0){
                            modelArr.push(m);
                            model.append("<option value='"+m+"' data-section='所有省'>"+m+"</option>");
                        }
                         model_Chip.append("<option value='"+v+"' data-section='所有省'>"+v+"</option>");
                      });
                      $("#model-select").html(model.toString());
                      $("#modelChip-select").html(model_Chip.toString());
                         $('#model-select,#modelChip-select').multiselect({
                            enableFiltering: true,
                            buttonWidth:'430px',
                            buttonText: function(options) {
                            if (options.length === 0) {
                               models=modelChips=[];
                                return 'None selected <b class="caret"></b>';
                            }
                            else {

                              if(options.length<maxLength){
                                        var selected = '';
                                        options.each(function() {
                                        selected += $(this).text() + ', ';
                                        });
                                          models=modelChips=selected.substr(0, selected.length -2);
                                    if(options.length>6){
                                      return options.length+" selected"+ ' <b class="caret"></b>';;
                                    }else{
                                        return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
                                    }
                              }else{
                                alert("最多选择"+maxLength+"个");
                                return false;
                              }
         
                            }
                           }
                        });
                   break;
                   case "dashboardList":
                    var str=new StringBuilder();
                    $.each(data.result,function(i,v){//pvuv_use_id
                      //str.append("<tr><td>"+v.pvuv_use_code+"</td><td>"+v.pvuv_use_name+"</td><td>"+v.create_time+"</td><td><a href='pvUv.html?pvuvUseId="+v.pvuv_use_id+"&projectId="+projectId+"'>查看</a></td></tr>");
                      str.append("<tr><td>"+v.pvuv_use_code+"</td><td>"+v.pvuv_use_name+"</td><td>"+v.create_time+"</td><td><a href='javascript:void(0)' onclick='showPvUvDetail("+v.pvuv_use_id+")'>查看</a></td></tr>");
                    })
                    $('#dashboard').html(str.toString());
                    $('#tb-data').DataTable();     
                   break;
                   case "adExposure":
                    var str=new StringBuilder();
                   // str.append(setHead(['时间','广告客户','订单名称','计划单名称','类型(图片/视频)','省份','地区','计划流量','实际流量','曝光率<b class="fa fa-question" title="实际流量除以计划流量乘以100"></b>']));
                    $.each(data.result,function(i,v){
                      str.append("<tr><td>"+v.stat_date.replace("00:00:00",'')+"</td><td>"+v.company+"</td><td>"+v.order_name+"</td><td>"+v.schedule_name+"</td><td>"+v.mediatype+"</td><td>"+v.province+"</td><td>"+v.city+"</td><td>"+v.total_traffic+"</td><td>"+v.pv+"</td><td>"+v.ratio+"%</td></tr>")
                    })
                    $("#tb-data").html(str.toString());
                   $('#tb-data').DataTable({ stateSave: true,'bScrollInfinite':true,'bDestroy':true,'iDisplayLength':50});
                    break;
                   case "pvUvDashboardList":
                        var option=new StringBuilder();
                        $.each(data.result,function(i,v){
                            option.append('<option value="'+v.pvuvUseId+'">'+v.pvuvUseName +'</option>');
                        });
                        $("#dashboardList").html(option.toString());
                        $("#dashboardList").val(pvuvUseId);
                         $('#dashboardList').selectpicker({
                          liveSearch: true,
                          maxOptions: 1
                        }); 
                        $(".dropdown-menu li",$("#dashboardList").next()).click(function(){
                        var index=$(this).attr("data-original-index");
                        var id=$("#dashboardList>option").eq(index).attr("value");
                        if(sessionStorage.pvuvUseId!=id){
                          sessionStorage.pvuvUseId=id;
                          crossDomainReq(httpUrl+'report-spark-web/events/dimension',"pvuvUseId="+id,'dimension');
                        }
                     });
                   break;
                   case "download":
                    if(data.flag=='success')
                     window.location.href= data.result;
                   else{
                    alert('下载失败')
                   }
                    break;
                }
        },
        error:function(a,b,c){
            console.log('error');
//            if(!document.getElementById("errorMessage"))
//                $(".loading").after("<b id='errorMessage' style='color: red;'>请求出错了,请完善搜索条件！</b>");
//            else
//                $("#errorMessage").show();
        }
    });
}

function doubleAxisChart(id,legend,xAxisData,yAxis,series){
  var myChart = echarts.init(document.getElementById(id));
  option = {
    tooltip: {
        trigger: 'axis'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend:legend,
    //  {
    //     data:legendData
    // },
    xAxis: [
        {
            type: 'category',
            data:xAxisData
            //data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis: yAxis,
    // [
    //     {
    //         type: 'value',
    //         name: '水量',
    //         min: 0,
    //         max: 250,
    //         interval: 50,
    //         axisLabel: {
    //             formatter: '{value} ml'
    //         }
    //     },
    //     {
    //         type: 'value',
    //         name: '温度',
    //         min: 0,
    //         max: 25,
    //         interval: 5,
    //         axisLabel: {
    //             formatter: '{value} °C'
    //         }
    //     }
    // ],
    series:series
    //  [
    //     {
    //         name:'蒸发量',
    //         type:'bar',
    //         data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    //     },
    //     {
    //         name:'降水量',
    //         type:'bar',
    //         data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    //     },
    //     {
    //         name:'平均温度',
    //         type:'line',
    //         yAxisIndex: 1,
    //         data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    //     }
    // ]
};
 myChart.setOption(option);
}
var myChart;
var echartOption='';
/*echart3.0 折线图*/
function lineChart3_0(id,legendData,xAxisData,series,yAxisName,yAxisMin,gridTop){
    if(yAxisMin==undefined||yAxisMin=='')
        yAxisMin=0;
  myChart=echarts.init(document.getElementById(id));
 echartOption={
    tooltip:{
        trigger: 'axis',
        formatter:function(obj,a,b){
         var str='';
           var dataIndex=0
         $.each(obj,function(i,v){
            if(v.seriesName.search('至')>0){
              if(i==0)
               {
                dataIndex=v.dataIndex
                str+=v.name+":<b style='color:red;'>"+v.data+"</b>("+yAxisName+")</br>";
               }
             else
                {//时间对比
                  if(dataIndex==v.dataIndex)
                   str+=myChart.getOption().series[i].time[v.dataIndex]+":<b style='color:red;'>"+v.data+"</b>("+yAxisName+")</br>";
                }
            }
            else
            str+=v.seriesName+":<b style='color:red;'>"+v.data+"</b>("+yAxisName+")</br>";
         });
         return str;
        }
    },
    legend: {
       // data:['邮件营销','联盟广>0告','视频广告','直接访问','搜索引擎']
       data:legendData
       // selected:{
       //  "系统升级":false
       // }
       // height:'auto',
       // formatter:function(a,b,c){
       //   if(a.length>20){
       //    return a.substring(0,15)+"...";
       //   }else
       //   return a;
       // }
    },
    grid: {
        left: '3%',
        right: '4%',
        top:gridTop==undefined?'10%':gridTop,
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data:xAxisData
           // data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis :
        {
            type : 'value',
           // name:yAxisName,
            axisLabel: {
                formatter: '{value}'+yAxisName
            },
            'min':yAxisMin
        },
    // series : [
    //    
    //         name:'邮件营销',
    //         type:'line',
    //         stack: '总量',
    //         data:[120, 132, 101, 134, 90, 230, 210]
    //     }
    // ]
    series:series
    
};
 myChart.setOption(echartOption);
}
/*验证邮箱*/
function validateEmail(obj){
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(emailReg.test(obj.value)){
        $(obj).next(".error").hide();
        return true;
    }else
    {
        $(obj).focus();
        $(obj).next(".error").show();
        return false;
    }
}
/*验证邮箱*/
function validateEmail1(obj,value){
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(emailReg.test(value)){
        $(obj).next(".error").hide();
        return true;
    }else
    {
        $(obj).focus();
        $(obj).next(".error").show();
        return false;
    }
}
function validateNumber(obj){
    var numberReg=/^[0-9]*$/;
    if(numberReg.test(obj.value)){
        $(obj).nextAll(".error").hide();
        return true;
    }else
    {
        $(obj).focus();
        $(obj).nextAll(".error").show();
        return false;
    }
}
function validateFiled(obj){
    var reg=/^[a-zA-Z][a-zA-Z0-9_]*$/;
    if(reg.test(obj.value)){
        $(obj).next("b").hide();
        $(obj).removeClass('red');
        $("#submitBt").removeAttr("disabled");
        return true;
    }else{
        $("#submitBt").attr("disabled","disabled");
        $(obj).next("b").show();
        $(obj).addClass('red').focus();
        return false;
    }
}
/*
 分页
 */
function pageInfor(){
    //  init(1,10);
    /*go按钮触发的事件*/
    $("#goSearch").click(function(){
        init($("#pageNum").val(),$("#pageSize").val());
    });
    $("#nextPage").click(function(){
        var pages=parseInt($("#pages").text());
        var page=parseInt($("#pageNum").val())+1;
        if(page>pages){
            alert("已经是最后一页了！")
        }else{
            init(page,$("#pageSize").val());
            $("#pageNum").val(page);
        }
    });
    $("#prePage").click(function(){
        var page=parseInt($("#pageNum").val())-1;
        if(page<1){
            alert("已经是第一页了！")
        }else{
            init(page,$("#pageSize").val());
            $("#pageNum").val(page);
        }
    });
    $("#pageSize").change(function(){
        $("#pages").html(Math.ceil(parseInt($("#pageTotal").text())/$("#pageSize").val()));
    })
}
function setTable(pagetotal,data,id,TdArr){
    if(data.length==0){
        $("#"+id).html("<tr><td colspan='"+TdArr.length+"'><b style='color: red;'>对不起，没有符合条件的数据</b></td></tr>")
        return false;
    }
    var tds=new StringBuilder();
    $("#pages").html(Math.ceil(pagetotal/$("#pageSize").val()));
    $("#pageTotal").html(pagetotal);
    if(pagetotal>$("#pageSize").val())
        $("#pager").show();
    $.each(data,function(i,v){
        tds.append("<tr>");
        for(var j=0;j<TdArr.length;j++){
            if(v[TdArr[j]]!=undefined)
                tds.append("<td >"+v[TdArr[j]]+"</td>");
            else
                tds.append("<td></td>");
        }
        tds.append("</tr>");
    })
    $("#"+id).html(tds.toString());
}
function setTableNoPage(data,id,TdArr){
    if(data.length==0){
        $("table tbody").html("<tr><td colspan='"+TdArr.length+"'><b style='color: red;'>对不起，没有符合条件的数据</b></td></tr>")
        return false;
    }
    var tds=new StringBuilder();
    $.each(data,function(i,v){
        tds.append("<tr>");
        for(var j=0;j<TdArr.length;j++){
            if(v[TdArr[j]]!=undefined){
                if(TdArr[j]=='stat_date')
                  tds.append("<td >"+v[TdArr[j]].replace("00:00:00",'')+"</td>");
               else
                tds.append("<td >"+v[TdArr[j]]+"</td>");
            }
            else
                tds.append("<td></td>");
        }
        tds.append("</tr>");
    })
    $("#"+id).html(tds.toString());
    $('#tb-data').DataTable();
}
function getSequenceMax(data){
    var arr=[];
    $.each(data,function(i,v){
        arr.push(parseInt($(v).attr("flag"))) ;
    });
    Array.prototype.max=function(){
        var max=parseInt(this[0]);
        for(var i=1;i<this.length;i++){
            if(parseInt(this[i])>max)
                max=parseInt(this[i])
        }
        return max;
    }
    var index=arr.max()+1;
    return index;
}
 function setTime(id,options){
 // var startDate=localStorage.getItem("startDate_"+localStorage.flag)==undefined?moment().subtract(6, 'days'):localStorage.getItem("startDate_"+localStorage.flag);
 // var endDate=localStorage.getItem("endDate_"+localStorage.flag)==undefined?moment():localStorage.getItem("endDate_"+localStorage.flag);
  var defaultOptions={
      "autoApply": false,
      "opens": 'left',
      format:'YYYY/MM/DD',
       autoUpdateInput: true,
      "ranges": {
          //'今天': [moment(), moment()],
          '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          '过去7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
          '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          '过去30天': [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
          '过去60天': [moment().subtract(60, 'days'), moment().subtract(1, 'days')]
      },
       "alwaysShowCalendars": true,
          "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确定",
            "cancelLabel": "取消",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "周日",
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        },
    "startDate":moment().subtract(30, 'days'),
    "endDate": moment().subtract(1, 'days')
    };
var option=$.extend(defaultOptions,options);
$('#'+id).daterangepicker(option,
function(start, end, label) {
 if($(this.element).attr('id')=='compare_time'){
  timeCompare(end.format('YYYY-MM-DD'));
 }
  $('#reportrange span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
  //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
}
);
  // $('#time').on('hide.daterangepicker', function(ev, picker){
  //   localStorage.setItem("startDate_"+localStorage.flag,picker.startDate);
  //   localStorage.setItem("endDate_"+localStorage.flag,picker.endDate);
  // });
}
function getStartTimeAndEndTime(separate){
    var timeRange=$('#time').val().split("-");
    var startArr=$.trim(timeRange[0]).split("/");
    var endArr=$.trim(timeRange[1]).split("/");
    return [startArr[0]+separate+startArr[1]+separate+startArr[2],endArr[0]+separate+endArr[1]+separate+endArr[2]];
}
    /*模型公用函数*/
   var provinceAndCity='',province='',models='',modelChips='';
    /*获取纬度*/
    function changeName(funCode){
      pre='day';
       if(funCode.indexOf('day')>=0){
         pre='day';
       }
        if(funCode.indexOf('week')>=0){
         pre='week';
       }
         if(funCode.indexOf('month')>=0){
         pre='month';
       }
         if(funCode.indexOf('hour')>=0){
         pre='hour';
       }
      switch(funCode){
        case pre:
          return "全部";
        break;
        case pre+"p":
          return "省";
        break;
        case pre+"pt":
          return "省、市";
        break;
        case pre+"pm":
          return '省、机型';
        break;
        case pre+"pmc":
          return '省、机型、机芯';
        break;
        case pre+"mc":
        return '机型、机芯';
         break;
        case pre+"ptmc":
        return '省、市、机型、机芯';
        break;
          case pre+"m":
        return '机型';
        break;
           case pre+"ptm":
        return '省、市、机型';
        break;
        case pre+"v":
        return '版本';
        break;
        case pre+"vp":
        return '省、版本';
        break;
         case pre+"vpm":
        return '省、版本、机型';
        break;
        case pre+"vpt": 
        return '省、市、版本';
        break;
        case pre+"vptm":
        return '省、市、机型、版本';
        break;
         case pre+"vptm":
        return '省、市、机型、版本';
        break;
         case pre+"vptmc":
        return '省、市、机型、机芯、版本';
        break;
         case pre+"vpmc":
        return '省、机型、机芯、版本';
        break;
         case pre+"vm":
        return '机型、版本';
        break;
          case pre+"vmc":
        return '机型、机芯、版本';
        break;
      }
    }
    function setLatitude(data){
        var dayAndWeek=[];
        var option=new StringBuilder();
        //var optionT=new StringBuilder();
        var flag='';
        // option.append("<option flag='all' code='all' value='all'>全部</option>");
        if(data.noteinfo.length>0){
            var noteInfor=JSON.parse(data.noteinfo[0].note_info);
            var m=0;
            if(noteInfor!=null&&noteInfor!=''){
                 $.each(noteInfor,function(i,v){
                 var tipContent=new StringBuilder();
                 $.each(v[0],function(j,k){
                    if(j=='default'){
                      tipContent.append('<h3>'+k+'</h3>');
                    }else{
                      tipContent.append('<div><div class="left">'+j+'：</div><div class="right">'+k+'</div></div>');
                    }
                 });
                 $("#tip"+m).next('.tipContent').html(tipContent.toString());
                 $("#tip"+m).qtip({
                   content: {
                       text: $("#tip"+m).next('.tipContent')
                   },
                    // hide: {  
                    //       event: true   //设置不自动关闭 可配合inactive组合使用  
                    //    //  inactive: 3000   //设置延时关闭  
                    //   },
                       style: {  
                          //换样式 阴影 圆角叠加  
                          classes: 'qtip-light    qtip-shadow qtip-rounded',
                          tip: {
                               
                                border: 1,
                                width: 15,
                                height: 15
                            }
                      },  
                     // hide: false,  
                      position: {  
                          my: 'center left',  
                          at: 'center center'  
                      }  
               }).show();
                 m++;
              });
            }

        }

        $.each(data.result,function(i,v){
            setTimeName(v.funcCode,'hour');
            setTimeName(v.funcCode,'day');
            setTimeName(v.funcCode,'month');
            setTimeName(v.funcCode,'week');
            option.append("<option flag='"+flag+"' code='"+v.funcCode.replace(flag,'')+"' value='"+v.menuItemId+"'>"+changeName(v.funcCode)+"</option>");
         });
        $.each(dayAndWeek,function(i,v){
           $("input[type='button'][flag='"+v+"']").removeAttr("disabled");
        });
         $("#latitude").html(option.toString());
          $("input.p").click(function(){
            $("#latitude>option[flag='"+$(this).attr('flag')+"']").show();
            $("#latitude").val($("#latitude>option[flag='"+$(this).attr('flag')+"']").eq(0).attr("value"));
            $("#latitude>option[flag!='"+$(this).attr('flag')+"']").hide();
            $("#latitude>option[flag='all']").show();
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass('active');
            localStorage.flag=$(this).attr('flag');
            if(localStorage.getItem("startDate_"+$(this).attr('flag'))!=undefined){
                $('#time').data('daterangepicker').setStartDate(localStorage.getItem("startDate_"+$(this).attr('flag')));
                $('#time').data('daterangepicker').setEndDate(localStorage.getItem("endDate_"+$(this).attr('flag')));
            }else{
                  switch($(this).attr('flag')){
                  case "day":
                     $('#time').data('daterangepicker').setStartDate(moment().subtract(30, 'days'));
                  break;
                  case "week":
                  debugger;
                     $('#time').data('daterangepicker').setStartDate(moment().subtract(7*7, 'days'));
                  break;
                  case "month":
                     $('#time').data('daterangepicker').setStartDate(moment().subtract(30*7, 'days'));
                  break;
                   case "hour":
                     $('#time').data('daterangepicker').setStartDate(moment().subtract(7, 'days'));
                       $('#time').data('daterangepicker').setEndDate(moment());
                  break;
                }
            }
            $("#latitude").change();
          });
          var li_index=0;
          if(typeof(defaultIndex)!='undefined'){
              li_index=defaultIndex;
              delete defaultIndex;
          }
          //alert($("input.p[disabled!='disabled']").eq(li_index).attr('flag'));
          console.log($("input.p[disabled!='disabled']").eq(li_index).attr('flag'))
           console.log(li_index);
          $("#latitude>option[flag='"+$("input.p").eq(li_index).attr('flag')+"']").show();
          $("#latitude").val( $("#latitude>option[flag='"+$("input.p").eq(li_index).attr('flag')+"']").eq(0).attr("value"));
          $("#latitude>option[flag!='"+$("input.p").eq(li_index).attr('flag')+"']").hide();
          $("#latitude>option[flag='all']").show(); 
          $("input.p").eq(li_index).parent().addClass("active");
          if($("input.p").eq(li_index).attr('flag')=='hour'){
             $('#time').data('daterangepicker').setStartDate(moment().subtract(7, 'days'));
          }
          localStorage.flag= $("input.p").eq(li_index).attr('flag');
          function setTimeName(funcCode,name){
              if(funcCode.indexOf(name)==0)
                {
                  flag=name;
                  if(dayAndWeek.indexOf(name)<0){
                      dayAndWeek.push(name);
                    }
                }
          }
      $("#search").click();
    }
    var maxLength=10;
    /*时间对比*/
    function timeCompareCommon(url,start,end){
      debugger;
        var p="projectMenuTd="+projectMenuId+"&start_date="+start+"&end_date="+end
         var codeType=$("#period li.active input").eq(0).attr("flag");
          switch($("option:selected","#latitude").attr("code")){
          case "p":
          if(province==''){
             alert('请选择省份，最好不要全选！');
             return false;
          }
           p+="&func_code="+codeType+"p&areas="+province;
           maxLength=10;
          break;
          case "pm":
           if(province==''){
             alert('请选择省份，最好不要全选！');
             return false;
           }
            if(models==''){
             alert('请选择机型，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"pm&areas="+province+"&modelChips="+models;
            maxLength=4;
          break;
          case "pmc":
            if(province==''){
             alert('请选择省份，最好不要全选！');
             return false;
           }
            if(modelChips==''){
             alert('请选择机型机芯，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"pmc&areas="+province+"&modelChips="+modelChips;
            maxLength=4;
          break;
          case "pt":
           if(provinceAndCity==''){
             alert('请选择省市，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"pt&areas="+provinceAndCity;
            maxLength=10;
          break;
          case "ptm":
           if(provinceAndCity==''){
             alert('请选择省市，最好不要全选！');
             return false;
           }
            if(models==''){
             alert('请选择机型，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"ptm&areas="+provinceAndCity+"&modelChips="+models;
             maxLength=4;
          break;
          case "ptmc":
           if(provinceAndCity==''){
             alert('请选择省市，最好不要全选！');
             return false;
           }
            if(modelChips==''){
             alert('请选择机型机芯，最好不要全选！')
             return false;
           }
           p+="&func_code="+codeType+"ptmc&areas="+provinceAndCity+"&modelChips="+modelChips;
             maxLength=4;
          break;
          case "m":
            if(models==''){
             alert('请选择机型，最好不要全选！')
             return false;
           }
          p+="&func_code="+codeType+"m&modelChips="+models;
            maxLength=10;
          break;
          case "mc":
            if(models==''){
             alert('请选择机型机芯，最好不要全选！')
             return false;
           }
           p+="&func_code="+codeType+"mc&modelChips="+modelChips;
             maxLength=10;
          break;
          case "v":
           p+="&func_code="+codeType;
           $("#modelAndChip,#model,#provinceAndC,#province").hide();
          break;
          default:
          p+="&func_code="+codeType;
            maxLength=10;
          break;
    }
       crossDomainReqForCompareTime(url,p,'timeCompare');
    }
    function search(url,isImport){
      debugger;
       // $("#search").click(function(){
         var beginTime=getStartTimeAndEndTime("-")[0];
         var endTime=getStartTimeAndEndTime('-')[1];
         var p="projectMenuTd="+projectMenuId+"&start_date="+beginTime+"&end_date="+endTime
         var codeType=$("#period li.active input").eq(0).attr("flag");
          switch($("option:selected","#latitude").attr("code")){
          case "p":
          if(province==''){
             alert('请选择省份，最好不要全选！');
             return false;
          }
           p+="&func_code="+codeType+"p&areas="+province;
           maxLength=10;
          break;
          case "pm":
           if(province==''){
             alert('请选择省份，最好不要全选！');
             return false;
           }
            if(models==''){
             alert('请选择机型，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"pm&areas="+province+"&modelChips="+models;
            maxLength=4;
          break;
          case "pmc":
            if(province==''){
             alert('请选择省份，最好不要全选！');
             return false;
           }
            if(modelChips==''){
             alert('请选择机型机芯，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"pmc&areas="+province+"&modelChips="+modelChips;
            maxLength=4;
          break;
          case "pt":
           if(provinceAndCity==''){
             alert('请选择省市，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"pt&areas="+provinceAndCity;
            maxLength=10;
          break;
          case "ptm":
           if(provinceAndCity==''){
             alert('请选择省市，最好不要全选！');
             return false;
           }
            if(models==''){
             alert('请选择机型，最好不要全选！');
             return false;
           }
           p+="&func_code="+codeType+"ptm&areas="+provinceAndCity+"&modelChips="+models;
             maxLength=4;
          break;
          case "ptmc":
           if(provinceAndCity==''){
             alert('请选择省市，最好不要全选！');
             return false;
           }
            if(modelChips==''){
             alert('请选择机型机芯，最好不要全选！')
             return false;
           }
           p+="&func_code="+codeType+"ptmc&areas="+provinceAndCity+"&modelChips="+modelChips;
             maxLength=4;
          break;
          case "m":
            if(models==''){
             alert('请选择机型，最好不要全选！')
             return false;
           }
          p+="&func_code="+codeType+"m&modelChips="+models;
            maxLength=10;
          break;
          case "mc":
            if(models==''){
             alert('请选择机型机芯，最好不要全选！')
             return false;
           }
           p+="&func_code="+codeType+"mc&modelChips="+modelChips;
             maxLength=10;
          break;
          case "v":
            p+="&func_code="+codeType+"v";
           $("#modelAndChip,#model,#provinceAndC,#province").hide();
          break;
          default:
          p+="&func_code="+codeType;
            maxLength=10;
          break;
    }
      if(isImport)
        {
           crossDomainReq(url,p+"&returnType=2",'download');
         }else
      {
        $(".echarts").html('<img src="img/loading.gif" class="loading">');
       $('.table-responsive').html("<img src='img/loading.gif' class='loading'><table class='table table-striped  table-bodered table-hover' id='tb-data'></table>");
       crossDomainReq(url,p,'setCommon');
      } 
  //  });
}
    function setTableData(data){
     // $('.table-responsive').html("<table class='table table-striped  table-bodered table-hover' id='tb-data'></table>");
      // if(data.result.length==0){
      //       alert('无数据');
      //       return ;
      //  }
        if(data.result.length<1)
       {
        errorTip();
        return;
       }
      if($("option:selected","#latitude").attr("code")==''){
        selectAllSetTableData(data);
      }else{
          switch($("option:selected","#latitude").attr("code")){
          case "p":
             bulidData(data,['province'],['省份']);
          break;
          case "pm":
             bulidData(data,['province','model'],['省份','机型']);
          break;
          case "pt":
           bulidData(data,['province','city'],['省','市']);
          break;
          case "pmc":
           bulidData(data,['province','model','chip'],['省','机型','机芯']);
          break;
          case "ptm":
            bulidData(data,['province','city','model'],['省','市','机型']);
          break;
          case "ptmc":
           bulidData(data,['province','city','model','chip'],['省','市','机型','机芯']);
          break;
          case "m":
           bulidData(data,['model'],['机型']);
          break;
          case "mc":
           bulidData(data,['model','chip'],['机型','机芯']);
          break;
          case "v":
          bulidData(data,['app_version'],['版本']);
          break;
          default:
          bulidData(data,['province'],['省']);
          break;
          case "hour":
           bulidData(data,['hour_num'],['小时']);
          break;
    }
      }
  }
   function setHead(arrHead,th_width){ 
          var str=new StringBuilder();
          str.append("<thead><tr>");
          $.each(arrHead,function(i,v){
            if(th_width!=undefined)
            str.append("<th><div style='width:"+th_width+"px;'>"+v+"</div></th>");
            else
            str.append("<th><div>"+v+"</div></th>"); 
          })
          str.append("</tr></thead>");
          return str.toString();
}
function init(){
    $(".addItem").click(function(){
      switch(modelType){
         case "province":
           province=$('.selected .item',".tree-multiselect").map(function(){
              return $(this).attr('data-value');
            }).get().join(',');
         break;
         case "provinceAndC":
             provinceAndCity=$('.selected .item',".tree-multiselect").map(function(){
              return $(".section-name",this).html()+"-"+$(this).attr('data-value');
            }).get().join(',');
         break;
         case "model":
          //  $('option', $('#model-select')).each(function(element) {
          //   $('#model-select').multiselect('deselect', $(this).val());
          // });
        break;
         case "modelAndChip":
          // $('option', $('#modelChip-select')).each(function(element) {
          //   $('#modelChip-select').multiselect('deselect', $(this).val());
          // });
        break;
      }
      $(".close").click();
    });

    // $("#selectAll").click(function(){
    //   if(modelType=='model'){
    //       $('option', $('#model-select')).each(function(element) {
    //         $('#model-select').multiselect('select', $(this).val());
    //       });
    //   }else{  
    //       $('option', $('#modelChip-select')).each(function(element) {
    //         $('#modelChip-select').multiselect('select', $(this).val());
    //       });
    //   }
    //  });
       var flag=false;
        $("#deSelect").click(function(){
      if(modelType=='model'){
            modelsArr=models.split(',');
           for(var i=0;i<modelsArr.length;i++){
            var name=$.trim(modelsArr[i]);
            $('#model-select').multiselect('deselect', name);
           }
      }else{  
          $('option', $('#modelChip-select')).each(function(element) {
            $('#modelChip-select').multiselect('deselect', $(this).val());
          });
            modelChipsArr=modelChips.split(',');
           for(var i=0;i<modelChipsArr.length;i++){
            var name=$.trim(modelChipsArr[i]);
            $('#modelChip-select').multiselect('deselect', name);
           }
      }
    });
   $("#latitude").change(function(){
     setItemShow($("option:selected",this).attr("code"));
   });
    setItemShow($("option:selected","#latitude").attr("code"));
   function setItemShow(code){
    switch(code){
          case "p":
          $("#province").show();
          $("#province").siblings("div.input-group-addon").hide();
          maxLength=10;
          break;
          case "pm":
          $("#province,#model").show();
          $("div.input-group-addon").not("#province,#model").hide();
            maxLength=4;
          break;
          case "pmc":
          $("#province,#modelAndChip").show();
          $("div.input-group-addon").not("#province,#modelAndChip").hide();
              maxLength=4;
          break;
          case "pt":
          $("#provinceAndC").show();
          $("div.input-group-addon").not("#provinceAndC").hide();
              maxLength=10;
          break;
          case "ptm":
          $("#provinceAndC,#model").show();
          $("div.input-group-addon").not("#provinceAndC,#model").hide();
           maxLength=4;
          break;
          case "ptmc":
          $("#provinceAndC,#modelAndChip").show();
          $("div.input-group-addon").not("#provinceAndC,#modelAndChip").hide();
           maxLength=4;
          break;
          case "m":
          $("#model").show();
          $("div.input-group-addon").not("#model").hide();
           maxLength=10;
          break;
          case "mc":
          $("#modelAndChip").show();
          $("div.input-group-addon").not("#modelAndChip").hide();
           maxLength=10;
          break;
          case "v":
           $("#modelAndChip,#model,#provinceAndC,#province").hide();
          break;
          case "hour":
            $("#modelAndChip,#model,#provinceAndC,#province").hide();
          break;
          default:
          $("div.input-group-addon").hide();
           maxLength=10;
          break;

    }
   }
   var modelType;
   $("#province,#provinceAndC").click(function(){
    $("select."+this.id).next(".tree-multiselect").show();
    $("select."+this.id).next(".tree-multiselect").siblings().hide();
    modelType=this.id;
    if(this.id=='province')
    $("#myModalLabel").html('选择省');
    else
    $("#myModalLabel").html('选择省市');
    })
    $("#model,#modelAndChip").click(function(){
     if(this.id=='model'){
       $(".btn-group .btn-group").hide();
       $("#model-select").next('.btn-group').show();
       $("#modelCLabel").html('选择机型');
     }else{
         $(".btn-group .btn-group").hide();
        $("#modelChip-select").next('.btn-group').show();
          $("#modelCLabel").html('选择机型机芯');
      }   
      modelType=this.id;
   })
}
function pie(id,legend,series){
   var myChart = echarts.init(document.getElementById(id));
  option = {
    // title : {
    //     text: '某站点用户访问来源',
    //     subtext: '纯属虚构',
    //     x:'center'
    // },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: legend
    },
    series : series
    // [
    //     {
    //         name: '访问来源',
    //         type: 'pie',
    //         radius : '55%',
    //         center: ['50%', '60%'],
    //         data:[
    //             {value:335, name:'直接访问'},
    //             {value:310, name:'邮件营销'},
    //             {value:234, name:'联盟广告'},
    //             {value:135, name:'视频广告'},
    //             {value:1548, name:'搜索引擎'}
    //         ],
    //         itemStyle: {
    //             emphasis: {
    //                 shadowBlur: 10,
    //                 shadowOffsetX: 0,
    //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
    //             }
    //         }
    //     }
    // ]
};
 myChart.setOption(option);
}


function errorTip(){
  
  $(".tip").fadeIn("slow");
  window.setTimeout(function(){
      $(".tip").fadeOut("slow");
  },1000);
}
/*是否显示对比时间*/
 function isCompare(){
           $("#latitude").change(function(){
                if($("#latitude>option:selected").text()=='全部'){
                $("#compareTime").show();
               }else{
                 $("#compareTime").hide();
               }
           });
     }