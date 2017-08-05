var regist = function (score, token) {
    //    $.ajax({
    //        type: "POST",
    //        url: "regist.php",
    //        data: "score="+score+"&token="+token,
    //        success: function(msg){
    //        }
    //    });
}

var step = 0.1;
var tmpMemory = 0;
var speed = 1.5;
var threshold = 500;

var resetSpeed = function(){
    speed = 1.5
}

var scoreCheckRegistSpeed = function (score) {

    if (Math.floor(score / 500) > tmpMemory) {
        speed += step;
        tmpMemory = Math.floor(score / 500);
    }else{
        
    }
    
    if(score > 3000){
        threshold = 1000;
        step = 0.3;
    } else if(score > 5000){
        threshold = 2000;
        step = 0.5;
    }

    return speed;

}