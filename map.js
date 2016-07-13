// クラス (コンストラクタ)
function MapObject(game)
{
    this.mapData = createFirstMap();
    this.bgData = createBgData();
    this.nextData = [[],[]];
    
}

//--------------------------------------
//--------------------------------------
// メソッド定義
//--------------------------------------
//--------------------------------------

MapObject.prototype = {
    //--------------------------------------
    createFirstMap : function() {
        var mapArray = [
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], 
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], 
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        return mapArray;
    },
    //--------------------------------------
    createBgData : function() {
        var mapArray = [
            [0,0,0,0,0,0,0,0,0,0,0,0], 
        ];
        return mapArray;
    },
    removeFirstMapData : function(mapArray) {
        for (i = 0; i < mapArray.length; i++) {
            mapArray[i].shift();
        }
        return mapArray;
    },
    addBgMap : function(mapArray){
        mapArray[0][mapArray.length] = 0;
        return mapArray;
    },
    addMap : function(mapArray) {
        for (i = 0; i < mapArray.length; i++) {
            if (i < stageHeight ){
                //上のカベ
                mapArray[i][mapArray[i].length] = 4;
            }else if( i >= mapArray.length - stageHeight) {
                //下のカベ
                mapArray[i][mapArray[i].length] = 1;
            } else if (i === stageHeight){
                //上のトラップ
                if(nextData[0] == null || nextData[0].length == 0){
                    var rnd = Math.random() * 9;
                    rnd = Math.floor(rnd);
                    if(score > 1000){
                        this.nextData = getAddMapDataLebel4(rnd);
                    }else if(score > 5000){
                        this.nextData = getAddMapDataLebel3(rnd);
                    }else if(score > 2000){
                        this.nextData = getAddMapDataLebel2(rnd);
                    }else{
                        this.nextData = getAddMapData(rnd);
                    }
                }
                if(this.nextData[0][0] == 0){
                    mapArray[i][mapArray[i].length] = 0;
                }else{
                    mapArray[i][mapArray[i].length] = 3;
                }
                this.nextData[0].shift();
            } else if(i === mapArray.length - stageHeight - 1) {
                //下のトラップ
                if(this.nextData[1][0] == 0){
                    mapArray[i][mapArray[i].length] = 0;
                }else{
                    mapArray[i][mapArray[i].length] = 2;
                }
                this.nextData[1].shift();

            } else {
                mapArray[i][mapArray[i].length] = 0;
            }
        }
        return mapArray;
    }
}
    
    
    
}
