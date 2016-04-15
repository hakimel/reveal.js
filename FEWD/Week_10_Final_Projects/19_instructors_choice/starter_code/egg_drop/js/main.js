var leftKeys=[37,65];
var rightKeys=[39,68];
var startKeys=[32,83,13,40];
var eggsMissed=0;
var score=0;
function startNewGame(){
	$(".egg").remove();
	score=0;
	$("#score").children("span").text(0);
	dropAnEgg("slow");
}
function dropAnEgg(speed){
	if($(".egg").length<=3){
		$("#egg-drop-game").prepend('<div class="egg '+speed+'-falling-egg" style="margin-left:'+randomStartPosition()+'px"><div class="egg-left"></div><div 	class="egg-right"></div></div>');
	}
}
function randomStartPosition(){
	return Math.random()*($("#egg-drop-game").width()-20);
}
function moveBasketLeft(){
	if($("#basket").css("margin-left")!="0px"){
		$("#basket").css("margin-left","-=25");
	}
}
function moveBasketRight(){
	if($("#basket").css("margin-left")!="450px"){
		$("#basket").css("margin-left","+=25");
	}
}
function pause(){
	var allEggs=$(".slow-falling-egg,.medium-falling-egg,.fast-falling-egg");
	if(allEggs.css("-webkit-animation-play-state")=="paused"){
		allEggs.css("-webkit-animation-play-state","running");
	}
	else{
		allEggs.css({"-webkit-animation-play-state":"paused"})
	}
}
function increaseScore(){
	$("#score").children("span").text(++score);
	if(score>5){
		dropAnEgg("medium");		
	}
	if(score>10){
		dropAnEgg("fast");
	}
}
$(document).ready(function(){
	$(window).on("keydown",function(e){
		if(e.which==32 && $(".egg").length>0){
			pause();
			return;
		}
		if(leftKeys.indexOf(e.which)!=-1){
			moveBasketLeft();
		}
		else if(rightKeys.indexOf(e.which)!=-1){
			moveBasketRight();
		}
		else if(startKeys.indexOf(e.which)!=-1){
			startNewGame();
		}
	});
	$("#egg-drop-game").on("animationEnd webkitAnimationEnd",".egg",function(){
		var eggMargin=parseInt($(this).css("margin-left"));
		var basketMargin=parseInt($("#basket").css("margin-left"));
		if(eggMargin>basketMargin && eggMargin<basketMargin+$("#basket").width()){
			$(this).remove();
			increaseScore();
		}
		else{
			$(this).children().addClass("break-egg");
		}
		dropAnEgg("slow");
	}).on("transitionEnd webkitTransitionEnd",".egg-left,.egg-right",function(){
		$(this).parent().remove();
		eggsMissed++;
		if(eggsMissed==10){
			$(".egg").remove();
			alert("Game over! You caught "+score+" eggs!");
		}
	});
});