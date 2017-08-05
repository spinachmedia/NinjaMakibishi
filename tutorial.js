var startTutorial = function (scene,game) {
        //チュートリアル画像の表示
        $("#enchant-stage").append(
            "<div id='tutorialWrapper'>\
            <div id='tutorialImg'>\
                <img src='/pr/ninja_01.png'>\
            </div>\
            <div id='ityped' class='ityped'></div>\
        </div>");

        $("#tutorialImg").animate({
            left: "50%"
        }, 300, function () {

            ityped.init('#ityped', {
                strings: [
                'This game is quite an exercise.',
                'Because you can jump.',
                'If you want to jump, tap it.',
                'You can also click the space key or mouse.',
                '  '
            ],
                typeSpeed: 30,
                backSpeed: 10,
                startDelay: 200,
                backDelay: 1000,
                loop: false,
                showCursor: true,
                cursorChar: " ",
                onFinished: function () {
                    $("#tutorialImg").animate({
                        left: "-200%"
                    }, 300, function () {
                        tutorial2(scene,game);
                    });
                }
            }); //init
        }); //animate
    } //function

var tutorial2 = function (scene,game) {
    $("#tutorialImg img").attr("src", "/pr/ninja_02.png");
    $("#tutorialImg").animate({
        left: "50%"
    }, 300, function () {

        ityped.init('#ityped', {
            strings: [
                'Walk the ceiling with a jump while jumping.  ',
                'The explanation has been above.',
                '  '
            ],
            typeSpeed: 30,
            backSpeed: 10,
            startDelay: 200,
            backDelay: 1000,
            loop: false,
            showCursor: true,
            cursorChar: " ",
            onFinished: function () {
                $("#tutorialImg").animate({
                    left: "-200%"
                }, 300, function () {
                    $("#tutorialWrapper").animate({
                        opacity: 0
                    }, 500, function () {
                        game.removeScene(scene);
                        delete scene;
                        start(game);
                        localStorage.setItem('inited',true);
                    })

                });
            }
        });
    });
}