var regist = function(score,token){
//    $.ajax({
//        type: "POST",
//        url: "regist.php",
//        data: "score="+score+"&token="+token,
//        success: function(msg){
//        }
//    });
}

var scoreCheckRegistSpeed = function(score){
    
    var speed = 1;
    
    if(score > 300000){
                speed = 9;
    }else if(score > 100000){
        speed = 8;
    }else if(score > 50000){
        speed = 7;
    }else if(score > 30000){
        speed = 6;
    }else if(score > 10000){
        speed = 5;
    }else if(score > 5000){
        speed = 4;
    }else if(score > 2000){
        speed = 3;
    }else if(score > 500){
        speed = 2;
    }
    
    return speed;
    
}