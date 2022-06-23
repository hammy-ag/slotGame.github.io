
//Dummy JSON responses
let balance = 10000;
let baseCost = 50;
let data = [
    {
        "response": {
            "results": {
                "win": 400,
                "symbolIDs": [
                    [1, 2, 1, 0, 1],
                    [0, 0, 2, 3, 0],
                    [1, 1, 2, 1, 1],
                    [1, 3, 1, 0, 1]

                ]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 400,
                "symbolIDs": [
                    [1, 2, 1, 0, 1],
                    [0, 2, 0, 3, 0],
                    [1, 2, 1, 2, 3],
                    [1, 3, 1, 0, 1]
                ]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [
                    [1, 2, 1, 0, 1],
                    [0, 0, 0, 2, 0],
                    [1, 2, 3, 1, 1],
                    [1, 3, 1, 1, 1]
                ]
            }
        }
    },

]

// simple application configuration
let config = {
    width: 1536,
    height: 722
}

let app

// wait for DOM before creating application
window.addEventListener('load', function () {
    //Create a Pixi Application
    app = new PIXI.Application(config);

    //Add the symbol images.
    document.body.appendChild(app.view);
    app.loader
        .add('symbol_0', 'https://pixijs.io/examples/examples/assets/eggHead.png')
        .add('symbol_1', 'https://pixijs.io/examples/examples/assets/flowerTop.png')
        .add('symbol_2', 'https://pixijs.io/examples/examples/assets/helmlok.png')
        .add('symbol_3', 'https://pixijs.io/examples/examples/assets/skully.png')
        .load(onAssetsLoaded);

    app.screen.width;
    app.screen.height
    const REEL_WIDTH = 200;
    const SYMBOL_SIZE = 150;
    let randomNo = Math.floor(Math.random() * 3);
    let response = data[randomNo].response.results;
    let betlevel = [1, 2, 3, 4, 5];
    let betCount = 0;
    let bet = betlevel[0] * baseCost;
    const reels = [];
    const reelContainer = new PIXI.Container();
    function onAssetsLoaded() {
        const slotTextures = [
            PIXI.Texture.from('symbol_0'),
            PIXI.Texture.from('symbol_1'),
            PIXI.Texture.from('symbol_2'),
            PIXI.Texture.from('symbol_3'),
        ];
       createReelContainer();
        const top = new PIXI.Graphics();
        top.beginFill(0x000001);
        top.drawRect(0, 0, 1920, app.screen.height * 0.23);
        const bottom = new PIXI.Graphics();
        bottom.beginFill(0x000001);
        bottom.drawRect(0, app.screen.height, 1920, app.screen.height * 0.15);
        bottom.pivot.y = app.screen.height * 0.15;

        // Use to style text..
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#ffffff'

        });
        const styleButtons = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#0000FF'
        });

        const spinText = new PIXI.Text('SPIN', styleButtons);
        spinText.x = app.screen.width * 0.8;
        spinText.y = app.screen.height + bottom.height / 3;
        spinText._anchor._x = 0.5;
        spinText._anchor._Y = 0.5;
        bottom.addChild(spinText);

        const balanceText = new PIXI.Text('Balance : ' + balance, style);
        balanceText.x = app.screen.width * 0.22;
        balanceText.y = app.screen.height + bottom.height / 3;
        balanceText._anchor._x = 0.5;
        balanceText._anchor._Y = 0.5;
        bottom.addChild(balanceText);

        const plusText = new PIXI.Text('+', styleButtons);
        plusText.x = app.screen.width * 0.68;
        plusText.y = app.screen.height + bottom.height / 3;
        plusText._anchor._x = 0.5;
        plusText._anchor._Y = 0.5;
        bottom.addChild(plusText);


        plusText.interactive = true;
        plusText.buttonMode = true;
        plusText.addListener('pointerdown', () => {
            updateBet(true);
        });

        const minusText = new PIXI.Text('-', styleButtons);
        minusText.x = app.screen.width * 0.56;
        minusText.y = app.screen.height + bottom.height / 3;
        minusText._anchor._x = 0.5;
        minusText._anchor._Y = 0.5;
        bottom.addChild(minusText);

        minusText.interactive = false;
        minusText.buttonMode = true;
        minusText.addListener('pointerdown', () => {
            updateBet(false);

        });

        const betText = new PIXI.Text('BET : ' + bet, style);
        betText.x = app.screen.width * 0.62;
        betText.y = app.screen.height + bottom.height / 3;
        betText._anchor._x = 0.5;
        betText._anchor._Y = 0.5;
        bottom.addChild(betText);

        const winText = new PIXI.Text('Win : ' + response.win, style);
        winText.x = app.screen.width * 0.42;
        winText.y = app.screen.height + bottom.height / 3;
        winText._anchor._x = 0.5;
        winText._anchor._Y = 0.5;
        bottom.addChild(winText);


        // Add header text
        const headerText = new PIXI.Text('1x2 SLOT!', style);
        headerText.x = app.screen.width / 2;
        headerText.y = top.height / 2;
        headerText._anchor._x = 0.5;
        headerText._anchor._Y = 0.5;
        top.addChild(headerText);

        app.stage.addChild(top);
        app.stage.addChild(bottom);

        spinText.interactive = true;
        spinText.buttonMode = true;
        spinText.addListener('pointerdown', () => {
            spinText.interactive = false;
            plusText.interactive = false;
            minusText.interactive = false;
            updateBalance(true);
            startSpin();
            randomNo = Math.floor(Math.random() * 3);
            response = data[randomNo].response.results;
        });

        // use to create reels.
        function createReelContainer(){
            
            for (let i = 0; i < 4; i++) {
                const reelCont = new PIXI.Container();
                reelCont.x = i * REEL_WIDTH;
                reelContainer.addChild(reelCont);
    
                const reel = {
                    container: reelCont,
                    symbols: [],
                    position: 0,
                    previousPosition: 0,
                    blur: new PIXI.filters.BlurFilter(),
                };
                reel.blur.blurX = 0;
                reel.blur.blurY = 0;
                reelCont.filters = [reel.blur];
    
                for (let j = 0; j < 5; j++) {
                    const symbol = new PIXI.Sprite(slotTextures[response.symbolIDs[i][j]]);
                    symbol.y = j * SYMBOL_SIZE;
                    symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                    symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                    reel.symbols.push(symbol);
                    reelCont.addChild(symbol);
                }
                reels.push(reel);
            }
    
            // Build top & bottom covers and position reelContainer
            reelContainer.pivot.x = reelContainer.width / 2;
            reelContainer.pivot.y = reelContainer.height / 2;
            reelContainer.y = (app.screen.height / 2) * 1.5;
            reelContainer.x = app.screen.width / 2;
            app.stage.addChild(reelContainer);
        }
        let running = false;

        // Function to start playing.
        function startSpin() {
            if (running) return;
            running = true;
            for (let i = 0; i < reels.length; i++) {
                const r = reels[i];
                const target = r.position + 10 + i * 5;
                const time = 3000 + 500 * i;
                tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
            }
        }
        // funtion to update bet 
        function updateBet(value) {
            if (value) {
                minusText.interactive = true;
                betCount++;
                bet = baseCost * betlevel[betCount];
                if (betCount === betlevel.length - 1) {
                    plusText.interactive = false;
                }
            } else {
                plusText.interactive = true;
                betCount--;
                bet = baseCost * betlevel[betCount];
                if (betCount === 0) {
                    minusText.interactive = false;
                }
            }
            betText.text = "BET : " + bet;
        }

        //fuction to update balance
        function updateBalance(value) {
            if (value) {
                balance = balance - bet;
                winText.text = "Win : 0";
            } else {
                balance = balance + response.win;
                winText.text = "Win : " + response.win;
            }
            balanceText.text = "Balance : " + balance;
        }


        // Reels done handler.
        function reelsComplete() {
            running = false;
            console.log(response.win);
            spinText.interactive = true;
            if (betCount !== 0) {
                minusText.interactive = true;
            }
            if (betCount !== betlevel.length - 1) {
                plusText.interactive = true;
            }
            updateBalance(false);
        }

        // Listen for animate update.
        app.ticker.add((delta) => {
            for (let i = 0; i < reels.length; i++) {
                const r = reels[i];
                // Update blur filter y amount based on speed.
                r.blur.blurY = (r.position - r.previousPosition) * 8;
                r.previousPosition = r.position;

                // Update symbol positions on reel.
                for (let j = 0; j < r.symbols.length; j++) {
                    const s = r.symbols[j];
                    const prevy = s.y;
                    s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                    if (s.y < 0 && prevy > SYMBOL_SIZE) {
                        // Detect going over and swap a texture.
                        s.texture = slotTextures[response.symbolIDs[i][j]];
                        s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                        s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                    }
                }
            }
        });
    }

    //tweening utility function.
    const tweening = [];

    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        tweening.push(tween);
        return tween;
    }
    // Listen for animate update.
    app.ticker.add((delta) => {
        const now = Date.now();
        const remove = [];
        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    });

    // Basic lerp funtion.
    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }

    function backout(amount) {
        return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
    }

});