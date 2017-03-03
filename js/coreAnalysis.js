
$(function(){
	//alert(111)
 // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  	//debugger
    // 获取已激活的标签页的名称
 //  var activeTab = $(e.target).text(); 
 //   var activeTabName = $('#coreIndicatorsTab').text(); 
    // 获取前一个激活的标签页的名称
    //var previousTab = $(e.relatedTarget).text(); 
  //  if (activeTab == activeTabName) {
		      //define url
		      
		   //   var httpUrl = "http://120.132.133.227:8080/";
				  var coreUrl = httpUrl + "report-spark-web/openData/core_quota?date=";
				  var fluxUrl = httpUrl + "report-spark-web/openData/flux_analysis?dayTime=";
				  var payUrl = httpUrl + "report-spark-web/openData/pay_analysis?";
				  var userUrl = httpUrl + "report-spark-web/openData/arealdistribution?dayTime=";
				  
          //define today yesteerday and tomorrow
          
          var myDate = new Date();
          var yesterdayDate = new Date(myDate.getTime() - 24*60*60*1000);
          var tomorrowDate = new Date(myDate.getTime() + 24*60*60*1000);
          var lastSevenDate = new Date(myDate.getTime() - 7*24*60*60*1000);
          var today = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
          var yesterday = yesterdayDate.getFullYear()+"-"+(yesterdayDate.getMonth()+1)+"-"+yesterdayDate.getDate();
          var tomorrow = tomorrowDate.getFullYear()+"-"+(tomorrowDate.getMonth()+1)+"-"+tomorrowDate.getDate();
          var lastSevenday = lastSevenDate.getFullYear()+"-"+(lastSevenDate.getMonth()+1)+"-"+lastSevenDate.getDate();
          //get coreAnalysis p elements
          var coreDatalabelP = $('.coreDatalabel p');
          var coreDatalabelLastday = $('.coreDatalabel-lastday p');
          var coreDatalabelLastweekday = $('.coreDatalabel-lastweekday p');
          var payAnalysisButton = $('.payAnalysisButton li');
          var userAnalysisButton = $('.userAnalysisButton button');
          var fluxTbodyTr = $('.fluxTbody tr');
				  var coreL = coreDatalabelP.length;
				  var	uliWidth = $($('.picScroll-left li')[0]).width();
					var	uliMarginLeft = parseInt($($('.picScroll-left li')[0]).css('margin-left'));
					var	uliLeft0 = parseInt($('.picScroll-left ul').css('left'));
					var	uliLeft = uliMarginLeft*1.5+uliWidth
				  //dataAnalysis function
				  
					todayAnalysis(yesterday,coreUrl);
					payAnalysis(lastSevenday,yesterday,payUrl);
					userAnalysis(yesterday,userUrl);
					fluxAnalysis(yesterday,fluxUrl);	

	    $('.coreAnalysis').daterangepicker({
	      "startDate":yesterday,
		    "format":"YYYY-MM-DD",
		    "singleDatePicker": true,
		    "timePickerSeconds": true,
		    "linkedCalendars": false,
		    "autoUpdateInput": false,
		    "opens": "center"
		  }, function(start, end, label) {
				var date = $('.coreAnalysis').val();
				todayAnalysis(date,coreUrl); 
		  });
			$('.payAnalysis').daterangepicker({
				"startDate":lastSevenday,
				"format":"YYYY-MM-DD",
				"endDate":yesterday,
				"opens":"left",
	//			"singleDatePicker": true,
		    "timePickerSeconds": true,
		    "linkedCalendars": false,
		    "autoUpdateInput": false,
			},function(start,end,label){
				var startdate = start.format("YYYY-MM-DD");
				var enddate = end.format("YYYY-MM-DD");
				payAnalysis(startdate,enddate,payUrl);
				
			});
      $('.userAnalysis').daterangepicker({
		    "startDate":yesterday,
		    "format":"YYYY-MM-DD",
		    "singleDatePicker": true,
		    "timePickerSeconds": true,
		    "linkedCalendars": false,
		    "autoUpdateInput": false,
		    "opens": "center"
			}, function(start, end, label) {
			  var date = $('.userAnalysis').val();
				userAnalysis(date,userUrl);
			});
			$('.trafficAnalysis').daterangepicker({
	        "startDate":yesterday,
			    "format":"YYYY-MM-DD",
			    "singleDatePicker": true,
			    "timePickerSeconds": true,
			    "linkedCalendars": false,
			    "autoUpdateInput": false,
			    "opens": "center"
			}, function(start, end, label) {
			  var date = $('.trafficAnalysis').val();
				fluxAnalysis(date,fluxUrl);
			});				 
		  		
		  		//core analysis
		$('.prev').click(function(){
			uliLeft0 -= uliLeft;
			if (Math.abs(uliLeft0) >= uliLeft*3) {
				uliLeft0 = 0;
			}
			$('.picScroll-left ul').animate({left:uliLeft0},600);
		})
		$('.next').click(function(){
			if ( uliLeft0 < 0 ) {
				uliLeft0 += uliLeft;
			}
			if ( uliLeft0 >=0 ) {
			   	uliLeft0 = 0;
			}
			$('.picScroll-left ul').animate({left:uliLeft0},600)
		})
		  function todayAnalysis(date,url){
		  	var date = date;
		  	var url = url;
		  	$.ajax({
		     type: "get",
				 async: false,
				 url: url+date,
				 dataType: "jsonp",
				 jsonp: "callback",       
				 success: function(data){
				     coreAnalysisData = data.data;
				     if(coreAnalysisData.device_active_user.device_active_user == null){
				     	$("li p",'.list-unstyled').html("暂无数据");
				     	//$('.bd p').text("暂无数据");
				     }else{
				     	 coreAnalysis();
				     }
				 },
				 error: function(){
				     alert('fail,data must be wrong!!!');
				     }
				   });
		  }         
      function coreAnalysis(){
      	var core_user = [];
         var core_lastday = [];
         var core_lastweek = [];
         core_user.push(coreAnalysisData.device_active_user.device_active_user,coreAnalysisData.device_new_user.device_new_user,coreAnalysisData.device_total_user.device_total_user,coreAnalysisData.homepage_start_times.homepage_start_times,coreAnalysisData.pay_conversion_rate.pay_conversion_rate,coreAnalysisData.pay_success_money.pay_success_money);
         core_lastday.push(coreAnalysisData.device_active_user.device_active_user_compare_yesterday,coreAnalysisData.device_new_user.device_new_user_compare_yesterday,coreAnalysisData.device_total_user.device_total_user_compare_yesterday,coreAnalysisData.homepage_start_times.homepage_start_times_compare_yesterday,coreAnalysisData.pay_conversion_rate.pay_conversion_rate_compare_yesterday,coreAnalysisData.pay_success_money.pay_success_money_compare_yesterday);
         core_lastweek.push(coreAnalysisData.device_active_user.device_active_user_compare_lastweek,coreAnalysisData.device_new_user.device_new_user_compare_lastweek,coreAnalysisData.device_total_user.device_total_user_compare_lastweek,coreAnalysisData.homepage_start_times.homepage_start_times_compare_lastweek,coreAnalysisData.pay_conversion_rate.pay_conversion_rate_compare_lastweek,coreAnalysisData.pay_success_money.pay_success_money_compare_lastweek);
					for (var i = 0;i < coreL;i++) {
						$(coreDatalabelP[i]).text(core_user[i]);
						if(parseFloat(core_lastday[i].toFixed(3))>0) //Math.round(v.play_rate*100*100)/100
							$(coreDatalabelLastday[i]).html("<i>↑</i>"+Math.round(parseFloat(core_lastday[i])*10000)/100+"%");
						else
						$(coreDatalabelLastday[i]).html("<i>↓</i>"+Math.round(Math.abs(parseFloat(core_lastday[i]))*10000)/100+"%");
					   	if(parseFloat(core_lastweek[i].toFixed(3))>0)
							$(coreDatalabelLastweekday[i]).html("<i>↑</i>"+Math.round(parseFloat(core_lastweek[i])*10000)/100+"%");
						else
						$(coreDatalabelLastweekday[i]).html("<i>↓</i>"+Math.round(Math.abs(parseFloat(core_lastweek[i]))*10000)/100+"%");
						//$(coreDatalabelLastweekday[i]).text(parseFloat(core_lastweek[i].toFixed(3)));
					}
      }         
      $('.prevDay').click(function(){
      	var date = $('.coreAnalysis').val();
      	var dateTime = new Date(new Date(date.replace(/-/g,'/')).getTime() - 24*60*60*1000);
	    	var preday = dateTime.getFullYear()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getDate();
	    	$('.coreAnalysis').val(preday);
	    	todayAnalysis(preday,coreUrl);
      });
      $('.nextDay').click(function(){
      	var date = $('.coreAnalysis').val();
      	var dateTime = new Date(new Date(date.replace(/-/g,'/')).getTime() + 24*60*60*1000);
	    	var nextday = dateTime.getFullYear()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getDate();
	    	$('.coreAnalysis').val(nextday);
	    	todayAnalysis(nextday,coreUrl);
      });
			function payAnalysis(startdate,enddate,url){
				var startdate = startdate;
				var enddate = enddate;
		  	var url = url;
		  	$.ajax({
		     type: "get",
		     async: false,
		     url: url+"start_date="+startdate+"&end_date="+enddate,
		     dataType: "jsonp",
		     jsonp: "callback",       
		     success: function(data){
		         payAnalysisD = data.data;
		         payAnalysisData()
		     },
		     error: function(){
		         alert('fail,data must be wrong!!!');
		     }
		   });
			};		
			function payAnalysisData(){
			var payArr = [];
			var payArrL = 0;
			var xAxis = [];
			var yAxis = [];
			var pay_conversion_rate = payAnalysisD.pay_conversion_rate;
			var xpCR = [];
			var ypCR = [];
			var pay_new_user = payAnalysisD.pay_new_user;
			var xpNU = [];
			var ypNU = [];
			var pay_success_count = payAnalysisD.pay_success_count;
			var xpSC = [];
			var ypSC = [];
			var pay_success_money = payAnalysisD.pay_success_money;
			var xpSM = [];
			var ypSM = [];
			var pay_total_user = payAnalysisD.pay_total_user;
			var xpTU = [];
			var ypTU = [];
			for (var i in pay_total_user) {
				xpTU.push(i);
				ypTU.push(pay_total_user[i]);
			};
			for (var i in pay_success_money) {
				xpSM.push(i);
				ypSM.push(pay_success_money[i]);
			};for (var i in pay_success_count) {
				xpSC.push(i);
				ypSC.push(pay_success_count[i]);
			};for (var i in pay_new_user) {
				xpNU.push(i);
				ypNU.push(pay_new_user[i]);
			};for (var i in pay_conversion_rate) {
				xpCR.push(i);
				ypCR.push(Math.round(pay_conversion_rate[i]*10000)/100);
			};	
			payAnalysisButton.click(function(){
				$(this).addClass('active').siblings().removeClass('active');
				var index = $(this).index();
				if(index==0){
					echartPayShow(xpTU,ypTU,'累计支付用户数','个');
				}else if(index == 1){
					echartPayShow(xpNU,ypNU,'新增支付订单数','单');
				}else if(index == 2){
					echartPayShow(xpSC,ypSC,'支付成功订单数','单');
				}else if(index == 3){
					echartPayShow(xpSM,ypSM,'新增支付金额','元');
				}else if(index == 4){
					echartPayShow(xpCR,ypCR,'支付转化率','%');
				}
			});
			payAnalysisButton[0].click();
		};
		//echarts 
		  function echartPayShow(xData,data,name,yAxisName){
			    var id =id,xData=xData,data=data,name=name;
         
          var myChart = echarts.init(document.getElementById('payEchart'));

          var option = {
              title: {
                  text: ''
              },
              tooltip: {
              	trigger: 'axis'
              },
               toolbox: {
				        show: true,
				        feature: {
				            dataZoom: {
				                yAxisIndex: 'none'
				            },
				            dataView: {readOnly: false},
				            magicType: {type: ['line', 'bar']},
				            restore: {},
				            saveAsImage: {}
				        }
				    },
              legend: {
                data:['']
              },
              xAxis: {
              	boundaryGap: false,
                data: xData
              },
              yAxis: {
              	type: 'value',
              	 axisLabel: {
                formatter: '{value}'+yAxisName
                }
              },
              series: [{
                  name: name,
                  type: 'line',
                  stack:'总量',
                  data: data
              }]
          };
          myChart.setOption(option);
		}		  
		  function userAnalysis(date,url){
		 		var date = date;
		  	var url = url;
		  	$.ajax({
		     type: "get",
		     async: false,
		     url: url+date,
		     dataType: "jsonp",
		     jsonp: "callback",       
		     success: function(data){
		     	//debugger;
		        // userAnalysisD = data.data;
		         userAnalysisData(data.data);
		        // debugger;
		         
		     },
		     error: function(){
		         alert('fail,data must be wrong!!!');
		     }
		   });
		 }
		function userAnalysisData(data){
			var seriesDataObj={};
			seriesData=[];
			seriesDataObj.name='活跃用户分布';
			seriesDataObj.type='map',
            seriesDataObj.mapType='china',
            seriesDataObj.roam=false,
            seriesDataObj.itemStyle={
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            }
            var min=0,max=0;
          $.each(data,function(i,v){
            var obj={};
             if(i==0){
             	min=v.active_user;
             }
            if(v.active_user<min)
            	min=v.active_user
             if(v.active_user>max)
            	max=v.active_user
            obj.name=v.province.replace('市', '').replace('省', '').replace('自治区', '').replace('壮族', '').replace('维吾尔', '').replace('特别行政区', '').replace('回族', '');
            obj.value=v.active_user;
            seriesData.push(obj);
          })
          seriesDataObj.data=seriesData;
          //(id,legendData,seriesData,min,max)
          //debugger
          normalMap('userEchart',['活跃用户分布'],[seriesDataObj],min,max);
         // var dd =myChart.getOption();
         // dd.series.push(seriesDataObj)
         // dd.legend[0].data.push("活跃用户分布111")
         // myChart.setOption(dd);
		}
		  
		//row five flux analysis 
		  function fluxAnalysis(date,url){
          	var date = date;
          	var url = url;
          	$.ajax({
             type: "get",
             async: false,
             url: url+date,
             dataType: "jsonp",
             jsonp: "callback",       
             success: function(data){
                 fluxAnalysisD = data.data;
                 fluxAnalysisData()
             },
             error: function(){
                 alert('fail,data must be wrong!!!');
             }
           });
          }
      function fluxAnalysisData(){
          	var fluxL = 0;
          	var fluxArray = [];
          	for (var v in fluxAnalysisD) {
          		fluxL++;
          		var module = [];
          		module.push(fluxAnalysisD[v].module,fluxAnalysisD[v].pv,fluxAnalysisD[v].ratio_homepage,fluxAnalysisD[v].user_avg_time_long);
          		fluxArray.push(module);
          	}
          	for (var i = 0;i < fluxL;i++) {
          		var thisArray = fluxArray[i];
          		var tA0 = thisArray[0];
          		if (tA0 === 'edu') {
									thisArray.splice(0,1,'教育');	 
          		} else if(tA0 === 'game'){
									thisArray.splice(0,1,'游戏');	 
          		}else if(tA0 === 'mall'){
									thisArray.splice(0,1,'商城');	 
          		}else if(tA0 === 'movie'){
									thisArray.splice(0,1,'电影');	 
          		}else if(tA0 === 'music'){
									thisArray.splice(0,1,'音乐');	 
          		}else if(tA0 === 'trip'){
									thisArray.splice(0,1,'旅游');	 
          		}else if(tA0 === 'other'){
									thisArray.splice(0,1,'其它');	 
          		}
          		thisArray.splice(2,1,(100*thisArray[2]).toFixed(2)+" %");
          		if(thisArray[3]!=null){
          			thisArray.splice(3,1,(thisArray[3]).toFixed(2)+" min");
          		}

          		var fluxTbodyTd = $(fluxTbodyTr[i]).find('td');
          		var thisL =thisArray.length;
          		for (var j = 0;j < thisL;j++) {
          			$(fluxTbodyTd[j]).text(thisArray[j])
          		}
          	} 
          }           
   // }
 // });
});