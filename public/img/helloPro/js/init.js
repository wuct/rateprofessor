// mi70

/* 網頁載入後執行 */
$(document).ready(function(){
	/*--------------*/
	/*-- 初始宣告 --*/
	/*--------------*/
	var aboutAnimateTotal=$('.aboutUs ul li').length;	//關於我們的kv輪播數目
	var mainNavTotal=$('.topSide nav li').length;		//主選單的數目
	var photoListTotal;		//照片列表數目
	var photoListInfo=new Array();	//照片資訊
	var photoViewOn=false;	//照片瀏覽是否開啟
	var nowPhoto=0;	//目前為第幾張照片
	var booklaunchOn=false;
	var introOn=false;
	
	/*----------------*/
	/*-- 初始值設定 --*/
	/*----------------*/
	$('.aboutUs ul li').not('.current').css('opacity','0');	
	resizeScreen();
	
	/*------------------*/
	/*-- 主選單的導覽 --*/
	/*------------------*/
	//導覽設定
	var moveNav=$('.navigate');
	//滑入時的變化
	$('.topSide nav a').hover(
		function(){
			//目前滑入的是誰
			var now=$(this).parent().index()+1;
			//移動導覽列
			moveNav.stop().animate({'right':(mainNavTotal-now)*100+'px'},500,'easeOutQuint');
		}
	 	,function(){
			//目前的頁面是誰
			var nowOut=$('.topSide nav li a.current').parent().index()+1;
			//移動導覽列
			moveNav.stop().animate({'right':(mainNavTotal-nowOut)*100+'px'},500,'easeOutQuint');
		}
	);
	
	
	/*--------------------*/
	/*-- 關於我們的輪播 --*/
	/*--------------------*/
	function aboutKvAnimate(){
		//目前顯示的是誰
		var alphaOut=$('.aboutUs ul li').filter('.current');
		//下一個顯示是第幾個
		var alphaIn=$('.aboutUs ul li').filter('.current').index()+1;
		//判斷有無超過最後一個
		if(alphaIn>=aboutAnimateTotal){
			alphaIn=0;
		}
		//開始跑動畫
		alphaOut.animate({'opacity':0},1500,function(){
			//跑完後執行
			$(this).removeClass('current');
		});
		$('.aboutUs ul li').eq(alphaIn).animate({'opacity':1},2000,function(){
			//跑完後執行
			$(this).addClass('current');
			setTimeout(aboutKvAnimate,5000);
		});
	}
	setTimeout(aboutKvAnimate,5000);
	
	
	
	/*----------------*/
	/*--- 作品集載入 ---*/
	/*----------------*/
	$.ajax({
		url:'xml/photoArray.xml'
		,type:'GET'
		,dataType:'xml'	
		,success:function(xml){				
		  photoListTotal=$(xml).find("photo").length;
		  $(xml).find('photo').each(function(s){
		
			/*---------------------*/
			/*--- 作品縮圖列表載入 ---*/
			/*---------------------*/
			var theContent='<li><figure>'+
				'<img src="'+$(this).attr('listSrc')+'" width="200" height="226" alt="'+
				$(this).find('imageTitle').text()+'">'+
				'<figcaption>'+$(this).find('imageTitle').text()+'</figcaption>'+
				'</figure></li>';
				
			$('.photoList ul').append(theContent);
						
			/*-------------------------------------------*/
			/*-- 作品集縮圖的滑入效果（這是前一章已完成的部份） --*/
			/*-------------------------------------------*/
			$('.photoList li').hover(
				function(){
					$(this).find('figcaption').stop()
						.animate({'bottom':'0px'},500,'easeOutQuint');
				}
				,function(){
					$(this).find('figcaption').stop()
						.animate({'bottom':'-27px'},500,'easeOutQuint');
				}
			);
			
			/*------------------------------------------*/
			/*--- 作品集縮圖的點選（這是前一章已完成的部份） ----*/
			/*------------------------------------------*/
			$('.photoList li').click(function(){
				nowPhoto=$(this).index();	//記錄點選到的li元素的索引號碼
				//設定顯示大圖的位置指定在對應的照片
				$('.photoView ul').css('left',0-nowPhoto*$('.photoView').width()+'px');
				photoViewOn=true;	//設定photoViewOn變數記錄已顯示照片大圖
				$('.photoView article p').html(photoListInfo[nowPhoto]);
				//判斷顯示的大圖照片是否大於0, 表示顯示的是第2張以後的照片, 那麼左邊按鈕設定顯示
				if(nowPhoto>0){
					$('.btnLeft').css('display','block');
				}
				//判斷顯示的大圖照片是否為最後一張, 那麼右邊按鈕設定不顯示
				if(nowPhoto>=photoListTotal-1){
					$('.btnRight').css('display','none');
				}
				//將.photoView顯示大圖照片的區域進行animate動畫, 使用1秒及easeOutQuint效果向左移動
				$('.photoView').stop()
					.animate({'left':'0px'},1000,'easeOutQuint',function(){
				//大圖照片向左移動完成後, 再將導覽列向上移出視窗
				$('.topSide').stop().animate({'top':'-100px'},500,'easeOutQuint');
				});
			});
			
			/*--------------------*/			
			/*---- 作品內容載入 ----*/
			/*--------------------*/
			var photoContent='<li><img src="'+$(this).attr('src')+
				'" width="1920" height="1280" alt="'+
				$(this).find('imageTitle').text()+'"></li>';
				
			$('.photoView ul').append(photoContent);
			photoListInfo[s]=$(this).find('imageDescription').text();
	
		  });//each End
	
		  //設定一次大小
		  resizeScreen();
		}//success end
	})//ajax end

	/*----------------------*/
	/*-- 大圖照片控制鈕的點選 --*/
	/*----------------------*/

	//點選關閉按鈕
	$('.closeIt').click(function(){
		photoViewOn=false;			//設定photoViewOn變數記錄不顯示照片大圖
		//設定大圖照片顯示區域停止前面的動畫後進行向右移出視窗的動畫
		$('.photoView').stop()
			.animate({'left':$('.photoView').width()+'px'},1000,'easeOutQuint',function(){
			//大圖照片移出動畫完成後, 再將導覽列向下移入視窗
				$('.topSide').stop().animate({'top':'0px'},500,'easeOutQuint');
			});
		return false;
	});
	
	//點選右邊按鈕
	$('.btnRight').click(function(){
		$('.btnLeft').css('display','block');	//顯示左邊的按鈕
		nowPhoto+=1;							//設定即將顯示大圖照片的索引號碼為累加1
		if(nowPhoto>=photoListTotal-1){			//假如索引號碼已超過最後一張照片的索引號碼
			nowPhoto=photoListTotal-1;			//就設定為最後一張
			$(this).css('display','none');		//並且設定右邊按鈕不顯示
		}
		//設定圖片自右向左滑入
		$('.photoView ul').stop()
			.animate({'left':0-nowPhoto*$('.photoView').width()+'px'}
				,500,'easeOutQuint',function(){
					//動畫完成後載入照片說明文字
					$('.photoView article p').html(photoListInfo[nowPhoto]);
				
		});
	})
	
	//點選左邊按鈕
	$('.btnLeft').click(function(){
		$('.btnRight').css('display','block');	//顯示右邊的按鈕
		nowPhoto-=1;							//設定即將顯示大圖照片的索引號碼為累減1
		if(nowPhoto<=0){						//假如索引號碼小於或等於第一張照片的索引號碼
			nowPhoto=0;							//就設定為第一張
			$(this).css('display','none');		//並且設定右邊按鈕不顯示
		}
		//設定圖片自左向右滑入
		$('.photoView ul').stop()
				.animate({'left':0-nowPhoto*$('.photoView').width()+'px'}
				,500,'easeOutQuint',function(){
					//動畫完成後載入照片說明文字
					$('.photoView article p').html(photoListInfo[nowPhoto]);
		});
	})

	
	
	/*--------------*/
	/*-- 畫面變動 --*/
	/*--------------*/
	function resizeScreen(){
		//設定照片瀏覽的位子
		$('.photoView ul').css('width',$('.photoView').width()*photoListTotal+'px')
						   .css('left',0-nowPhoto*$('.photoView').width()+'px');
		$('.photoView ul li').css('width',$('.photoView').width()+'px');
		//判斷照片是否瀏覽中
		if(!photoViewOn){
			$('.photoView').css('left',$('.photoView').width()+'px');
		}
		if(!booklaunchOn){
			$('.booklaunch').css('top',$('.aboutUs').height()+'px');
		}
		if(!introOn){
			$('.intro').css('top',$('.aboutUs').height()+'px');
		}
		//版權資訊的高有無大過內容
		if($('.booklaunch article').height()>$('.aboutUs').height()){
			$('.booklaunch article').css('height',$('.aboutUs').height()+'px');								    
		}
		//把版權資訊置中
		$('.booklaunch article').css('marginTop',0-$('.booklaunch article').height()/4+'px');	
		
		//作者資訊的高有無大過內容
		if($('.intro article').height()>$('.aboutUs').height()){
			$('.intro article').css('height',$('.aboutUs').height()+'px');								    
		}
		//把作者資訊置中
		$('.intro article').css('marginTop',0-$('.intro article').height()/4+'px');	
		
	}
	$(window).resize(resizeScreen);
	
	$(document).scroll(function(){
		var nowYPosition=$('body').scrollTop();
		var nowYPosition2=$('html').scrollTop();
		if(nowYPosition<=$('.aboutUs').height() || nowYPosition2<=$('.aboutUs').height()){
			$('.topSide nav a:eq(0)').addClass('current');
			//移動導覽列
			$('.navigate').stop().animate({'right':'100px'},500,'easeOutQuint');
		}
		if(nowYPosition>=$('.aboutUs').height() || nowYPosition2>=$('.aboutUs').height()){
			$('.topSide nav a:eq(1)').addClass('current');
			//移動導覽列
			$('.navigate').stop().animate({'right':'100px'},500,'easeOutQuint');
		}
	});
	
	
	/*------------------*/
	/*-- 點選主按鈕時 --*/
	/*------------------*/
	$('.topSide nav a:eq(0)').click(function(){
		//設定目前是誰
		 $('.topSide nav a').filter('.current').removeClass('current');
		 $(this).addClass('current');
		//捲動畫面
		 $('html,body').animate({
			 scrollTop:'0px'
		 }, 750, 'easeOutQuint');
		 
		 return false;
	});
	$('.topSide nav a:eq(1)').click(function(){
		//設定目前是誰
		
		 $('.intro').stop().animate({'top':'0px'},700,'easeOutQuint',function(){
			introOn=true;
		}); 
		 return false;
	});
	$('.topSide nav a:eq(2)').click(function(){
		//設定目前是誰
		 $('.topSide nav a').filter('.current').removeClass('current');
		 $(this).addClass('current');
		//捲動畫面
		 $('html,body').animate({
			 scrollTop: $('.aboutUs').height() + 'px'
		 }, 750, 'easeOutQuint');
		 
		 return false;
	});
	$('.topSide nav a:eq(3)').click(function(){
		//設定目前是誰
		
		 $('.booklaunch').stop().animate({'top':'0px'},700,'easeOutQuint',function(){
			booklaunchOn=true;
		}); 
		 return false;
	})
	
	/*--------------------*/
	/*-- 新書發表會關閉按鈕點選時 --*/
	/*--------------------*/
	 $('.closeItBookLaunch').click(function(){
		booklaunchOn=false;
		 $('.booklaunch').stop().animate({'top':$('.aboutUs').height()+'px'},700,'easeOutQuint'); 
		 return false;
	})
	
	/*--------------------*/
	/*-- 書本資訊關閉按鈕點選時 --*/
	/*--------------------*/
	 $('.closeItIntro').click(function(){
		introOn=false;
		 $('.intro').stop().animate({'top':$('.aboutUs').height()+'px'},700,'easeOutQuint'); 
		 return false;
	})
});




