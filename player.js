//マップの高さ上限
mapMax = 19;
//プレイヤーのx座標（固定）
playerX = 30;
//ジャンプの時間
jumpFrame = 20;
//空中待機時間
airWaitTime = 7;
//画面の高さ
windowHeight = 288;
//ブロックの高さ
blockHeight = 16;
//ブラックの積みレベル
blockLevel = 5;

animationCounter=0;

STATUS = {
    WAIT : 0,
    BOTTOM_RUNNING : 1,
    TOP_RUNNING : 2,
    JUMPING_FROM_BOTTOM : 3,
    JUMPING_FROM_TOP : 4,
    DOUBLE_JUMPING_FROM_BOTTOM : 5,
    DOUBLE_JUMPING_FROM_TOP : 6,
};

// クラス (コンストラクタ)
function Player(game)
{
    //スプライト定義
    this.sprite = new Sprite(32, 32);
    this.sprite.image = game.assets['img.png'];
    
    this.sprite.frame = 0;
    this.sprite.y = windowHeight - blockHeight * blockLevel;
    this.sprite.x = playerX;
    
    //ジャンプ中はtrue
    this.isJumping = false;
    
    this.status = STATUS.WAIT;
    
}

//--------------------------------------
//--------------------------------------
// メソッド定義
//--------------------------------------
//--------------------------------------

Player.prototype = {
    //毎フレーム実行
    action : function() {
        switch (this.status){
            case STATUS.BOTTOM_RUNNING:
                this.running();
                break;
            case STATUS.TOP_RUNNING:
                this.running();
                break;
        }        
    },
    jumpAction : function() {
        switch (this.status){
            case STATUS.BOTTOM_RUNNING:
                this.jump();
                break;
            case STATUS.TOP_RUNNING:
                this.jump();
                break;
            case STATUS.JUMPING_FROM_BOTTOM:
                this.doubleJump();
                break;
            case STATUS.JUMPING_FROM_TOP:
                this.doubleJump();
                break;
        }     
    },
    //--------------------------------------
    running : function() {
      if(animationCounter > 8){
        animationCounter = 0;
      }
      if (animationCounter < 4) {
        this.sprite.frame = 3;
      } else {
        this.sprite.frame = 2;
      }
      animationCounter++;
    },
    //--------------------------------------
    jump : function() {
        //走行中でなければ無効
        if (!(this.status == STATUS.TOP_RUNNING 
              || this.status == STATUS.BOTTOM_RUNNING)) {
            return;
        }
        //下からジャンプ
        if(this.status == STATUS.BOTTOM_RUNNING ){
            this.status = STATUS.JUMPING_FROM_BOTTOM;
            var charactor = this;
            this.sprite.tl
            .moveTo(playerX, 152, jumpFrame, enchant.Easing.CUBIC_EASEOUT)
            .moveTo(playerX, windowHeight - blockHeight * blockLevel, jumpFrame, enchant.Easing.CUBIC_EASEIN)
            .then(function() {
                charactor.status = STATUS.BOTTOM_RUNNING;
            });
        }
        //上からジャンプ
        if(this.status == STATUS.TOP_RUNNING){
            this.status = STATUS.JUMPING_FROM_TOP;
            var charactor = this;
            this.sprite.tl
            .moveTo(playerX, 152, jumpFrame, enchant.Easing.CUBIC_EASEOUT)
            .moveTo(playerX, blockHeight * blockLevel, jumpFrame, enchant.Easing.CUBIC_EASEIN)
            .then(function() {
                charactor.status = STATUS.TOP_RUNNING;
            });
        }
    },
    //--------------------------------------
    doubleJump : function() {
        //ジャンプ中じゃなければ無効
        if (!(this.status == STATUS.JUMPING_FROM_BOTTOM || this.status == STATUS.JUMPING_FROM_TOP)) {
            return;
        }
        
        score = score + 30;
        
        //下から二段ジャンプ
        if(this.status == STATUS.JUMPING_FROM_BOTTOM){
            this.status = STATUS.DOUBLE_JUMPING_FROM_BOTTOM;
            this.sprite.tl.clear();
            var charactor = this;
            //スタート 30, 16
            this.sprite.tl
            .scaleTo(1, -1, 1)
            .rotateBy(360, airWaitTime)
            .moveTo(playerX, blockHeight * blockLevel, 8, enchant.Easing.CUBIC_EASEOUT)
            .then(function() {
                charactor.status = STATUS.TOP_RUNNING;
            });
        }
            
        //上から二段ジャンプ
        if(this.status == STATUS.JUMPING_FROM_TOP){
            this.status = STATUS.DOUBLE_JUMPING_FROM_TOP;
            this.sprite.tl.clear();
            var charactor = this;
            //スタート 30, 16
            this.sprite.tl
            .scaleTo(1, 1, 1)
            .rotateBy(-360, airWaitTime)
            .moveTo(playerX, windowHeight - blockHeight * blockLevel, 8, enchant.Easing.CUBIC_EASEOUT)
            .then(function() {
                charactor.status = STATUS.BOTTOM_RUNNING;
            });
        }  
    },
    //--------------------------------------
    mistake : function() {
//        this.sprite.frame = 5;
//        this.sprite.tl.delay(20)
//            .moveTo(playerX, 152, 12, enchant.Easing.CIRC_EASEIN)
//            .rotateBy(720, 15)
//            .moveTo(playerX, 400, 15, enchant.Easing.CIRC_EASEIN)
//            .then(function(){
//            });
    },
    //--------------------------------------
    deathCheck : function(map) {
        switch (this.status){
            case 1:
                if(map[mapMax - blockLevel][3] === 2){
                    return true;   
                }
                break;
            case 2:
                if(map[blockLevel][3] === 3){
                    return true;   
                }
                break;
        }
    },
};