enchant();

/**
 * TODO
 * 
 * - change stage...
 * - add tutorial.
 * - add afterimage
 * - 
 * - 
 * - 
 * 
 */

//床の高さ
var stageHeight = 5;
//スコア
var score = 0;
//操作可能時にtrue
var playFlg = true;

var WIDTH = 0;
var HEIGHT = 320;

//初回処理
window.onload = function () {

    WIDTH = window.parent.screen.width;
    if (WIDTH > 540) {
        WIDTH = 540;
    }

    var game = new Core(WIDTH, HEIGHT);
    game.fps = 60;
    game.preload('img.png', 'map.png', 'bg.png');
    game.onload = function () {
        game.keybind(' '.charCodeAt(0), 'A');
        game.keybind(13, 'B');
        pushStart(game);
    };

    game.start();
};

/**
 *
 * 開始直後の画面。
 * タップでゲーム開始。
 *
 */
function pushStart(game) {

    //シーン生成
    var scene = new Scene();
    game.pushScene(scene);

    //背景生成
    var bgData = createBg();
    var bgMap = setBg(game, bgData);
    scene.addChild(bgMap);

    //マップ生成
    var mapData = createFirstMap();
    var map = setMap(game, mapData);
    scene.addChild(map);

    //プレイヤー生成
    var player = new Player(game);
    scene.addChild(player.sprite);

    //背景のカバー生成（透明スプライト）
    var bgCover = setAlphaBg();
    scene.addChild(bgCover);

    //テキスト生成
    var pushStart = setText("PUSH START");
    scene.addChild(pushStart);

    //タッチイベントの生成
    scene.addEventListener('touchend', function (event) {
        game.removeScene(scene);
        delete scene;
        start(game);
    });
    scene.addEventListener('Abuttondown', function () {
        game.removeScene(scene);
        delete scene;
        start(game);
    });
    scene.addEventListener('Bbuttondown', function () {
        game.removeScene(scene);
        delete scene;
        start(game);
    });
}


/**
 *
 * ゲーム中の処理。
 *
 */
function start(game) {

    //操作可能に設定
    playFlg = true;
    score = 0;

    //スピードの設定
    var speed = 1;
    resetSpeed();

    //マップの更新用フラグ
    var resetFlg = false;

    //背景の更新用フラグ
    var bgResetFlg = false;

    //シーン生成
    var scene = new Scene();
    game.pushScene(scene);

    //背景生成
    var bgData = createBg();
    var bgMap = setBg(game, bgData);
    scene.addChild(bgMap);

    //マップ生成
    var mapData = createFirstMap();
    var map = setMap(game, mapData);
    scene.addChild(map);

    //プレイヤー生成
    var player = new Player(game);
    scene.addChild(player.sprite);

    //プレイヤーのスタンバイ
    player.status = 1;

    //スコア表示
    var scoreLabel = createScore(score);
    scene.addChild(scoreLabel)

    //ジャンプ処理
    scene.addEventListener('touchend', function (event) {
        if (!playFlg) {
            return;
        }
        player.jumpAction();
    });

    scene.addEventListener('Abuttondown', function () {
        if (!playFlg) {
            return;
        }
        player.jumpAction();
    });
    scene.addEventListener('Bbuttondown', function () {
        if (!playFlg) {
            return;
        }
        player.jumpAction();
    });

    //毎フレームの処理
    scene.addEventListener('enterframe', function () {
        if (!playFlg) {
            return;
        }

        //当たり判定
        if (player.deathCheck(mapData)) {
            gameover(game, scoreLabel, player.sprite, map, mapData);
        }

        //スコアによるスピードの変更
        speed = scoreCheckRegistSpeed(score);
        scoreLabel.text = Math.floor(score);
        score = score + speed;

        //　プレイヤーの操作
        player.action();

        //  マップの操作
        map.x = map.x - (2 * speed);
        if (resetFlg) {
            mapData = addMap(mapData);
            mapData = deleteMap(mapData);
            resetFlg = false;
        }
        if (map.x <= -16) {
            map.x = 0;
            resetFlg = true;
        }

        bgMap.x = bgMap.x - ((2 * speed) / 3);
        if (bgResetFlg) {
            bgData = addBgMap(bgData);
            bgData = deleteBgMap(bgData);
            bgResetFlg = false;
        }
        if (bgMap.x <= -35) {
            bgMap.x = 0;
            bgResetFlg = true;
        }

    });
}

function gameover(game, label, player, map, mapData) {

    //HTMLからトークンの取得
    var token = $("#token").html();
    //スコアの送信
    regist(score, token);

    label.tl.hide();
    playFlg = false;
    player.frame = 4;
    player.tl.delay(20).moveTo(30, 152, 25, enchant.Easing.CIRC_EASEIN)
        .rotateBy(720, 20)
        .moveTo(30, 400, 25, enchant.Easing.CIRC_EASEIN)
        .then(function () {

            //ゲームオーバー
            var second = new Scene();
            var bg = new Sprite(WIDTH, HEIGHT);
            var surf = new Surface(WIDTH, HEIGHT);
            surf.context.beginPath();
            surf.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            surf.context.fillRect(0, 0, WIDTH, HEIGHT);
            bg.image = surf;
            second.addChild(bg);

            // シーンにメッセージを登録
            var secondMessage = new Label("GAMEOVER");
            secondMessage.x = WIDTH / 2 - secondMessage.width / 2;
            secondMessage.y = HEIGHT / 2 - secondMessage.height - 40;
            secondMessage.textAlign = "center";
            secondMessage.font = '40px "Arial"';
            secondMessage.color = "#FFF";
            second.addChild(secondMessage);

            // シーンにメッセージを登録
            var scoreLabel = new Label("SCORE:" + Math.floor(score));
            scoreLabel.x = WIDTH / 2 - secondMessage.width / 2;
            scoreLabel.y = HEIGHT / 2 - secondMessage.height - 0;
            scoreLabel.textAlign = "center";
            scoreLabel.font = '30px "Arial"';
            scoreLabel.color = "#FFF";
            second.addChild(scoreLabel);

            // シーンにメッセージを登録
            var pushStart = new Label("PUSH RESTART");
            pushStart.x = WIDTH / 2 - secondMessage.width / 2;
            pushStart.y = HEIGHT / 2 - secondMessage.height + 50;
            pushStart.textAlign = "center";
            pushStart.font = '19px "Arial"';
            pushStart.color = "#F0F0F0";
            pushStart.tl.fadeOut(50)
                .fadeIn(50)
                .loop();
            second.addChild(pushStart);
            game.pushScene(second);

            second.addEventListener('touchend', function (event) {
                game.removeScene(second);
                game.removeScene(game.currentScene);
                start(game);
            });

            second.addEventListener('Abuttondown', function () {
                game.removeScene(second);
                game.removeScene(game.currentScene);
                start(game);
            });
            second.addEventListener('Bbuttondown', function () {
                game.removeScene(second);
                game.removeScene(game.currentScene);
                start(game);
            });

        });
}


//-------------------------------------------
var setBg = function (game, bgData) {
    var bgMap = new Map(35, HEIGHT);
    bgMap.image = game.assets['bg.png'];
    bgMap.loadData(bgData);
    return bgMap;
}

var setMap = function (game, baseMap) {
    var map = new Map(16, 16);
    map.image = game.assets['map.png'];
    map.loadData(baseMap);
    return map;
}

var setAlphaBg = function () {
    var bg = new Sprite(WIDTH, HEIGHT);
    var surf = new Surface(WIDTH, HEIGHT);
    surf.context.beginPath();
    surf.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    surf.context.fillRect(0, 0, WIDTH, HEIGHT);
    bg.image = surf;
    return bg;
}

var setText = function (text) {
    var pushStart = new Label(text);
    pushStart.x = WIDTH / 2 - pushStart.width / 2;
    pushStart.y = HEIGHT / 2 - pushStart.height / 2;
    pushStart.textAlign = "center";
    pushStart.font = '30px "Arial"';
    pushStart.color = "#F0F0F0";
    pushStart.tl.fadeOut(50)
        .fadeIn(50)
        .loop();
    return pushStart;
}

var createScore = function (score) {
    var label = new Label("SCORE:" + score);
    label.x = 15;
    label.y = 5;
    label.font = '30px "Arial"';
    label.textAlign = "left";
    label.color = '#FFF';
    return label;
}

//-----------------------------


function createFirstMap() {
    var mapArray = [
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    ];
    return mapArray;
}

function createBg() {
    var mapArray = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
    return mapArray;
}

function deleteMap(mapArray) {
    for (i = 0; i < mapArray.length; i++) {
        mapArray[i].shift();
    }
    return mapArray;
}

var nextData = [
            [],
            []
            ];

function addBgMap(mapArray) {
    mapArray[0][mapArray.length] = 0;
    return mapArray;
}

function deleteBgMap(mapArray) {
    mapArray[0][0] = 0;
    return mapArray;
}

function addMap(mapArray) {
    for (i = 0; i < mapArray.length; i++) {
        if (i < stageHeight) {
            //上のカベ
                if(i < stageHeight - 1){
                    mapArray[i][mapArray[i].length] = 5;
                } else {
                    mapArray[i][mapArray[i].length] = 4;
                }
        } else if (i >= mapArray.length - stageHeight) {
            //下のカベ
                if(i >= mapArray.length - stageHeight + 1){
                    mapArray[i][mapArray[i].length] = 5;
                } else {
                    mapArray[i][mapArray[i].length] = 1;
                }
        } else if (i === stageHeight) {
            //上のトラップ
            if (nextData[0] == null || nextData[0].length == 0) {
                var rnd = Math.random() * 9;
                rnd = Math.floor(rnd);
                if (score > 1000) {
                    nextData = getAddMapDataLebel4(rnd);
                } else if (score > 10000) {
                    nextData = getAddMapDataLebel3(rnd);
                } else if (score > 5000) {
                    nextData = getAddMapDataLebel2(rnd);
                } else {
                    nextData = getAddMapData(rnd);
                }
            }
            if (nextData[0][0] == 0) {
                mapArray[i][mapArray[i].length] = 0;
            } else {
                mapArray[i][mapArray[i].length] = 3;
            }
            nextData[0].shift();
        } else if (i === mapArray.length - stageHeight - 1) {
            //下のトラップ
            if (nextData[1][0] == 0) {
                mapArray[i][mapArray[i].length] = 0;
            } else {
                mapArray[i][mapArray[i].length] = 2;
            }
            nextData[1].shift();

        } else {
            mapArray[i][mapArray[i].length] = 0;
        }
        console.log(nextData);
    }
    return mapArray;
}