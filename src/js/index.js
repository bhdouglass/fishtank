function BootState() {}

BootState.prototype = {
    preload: function() {
        this.load.image('logo', 'img/logo.png');
        //this.load.image('loading', 'img/loading.png'); //TODO add loading image
    },
    create: function() {
        this.game.stage.backgroundColor = '#A1D6E7';

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.state.start('PreloadState');
    }
};

function PreloadState() {}

PreloadState.prototype = {
    preload: function() {
        this.logo = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            'logo'
        );
        this.logo.anchor.setTo(0.5);

        /*this.loading = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY + 128,
            'loading'
        );
        this.loading.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.loading);*/

        this.load.atlasJSONHash('assets', 'img/assets.png', 'img/assets.json');

        this.load.audio('bubbles', ['audio/jcpmcdonald/bubbles.ogg', 'audio/jcpmcdonald/bubbles.mp3']);
        this.load.audio('swim', ['audio/jcpmcdonald/swim.ogg', 'audio/jcpmcdonald/swim.mp3']);
        this.load.audio('water', ['audio/jcpmcdonald/water.ogg', 'audio/jcpmcdonald/water.mp3']);
        this.load.audio('seashore-peace', ['audio/socapex/seashore-peace.ogg', 'audio/socapex/seashore-peace.mp3']);
    },
    create: function() {
        this.game.state.start('FishTankState');
    }
};

function init() {
    //TODO listen to window resizing
    var game = new Phaser.Game(
        window.innerWidth,
        window.innerHeight,
        Phaser.CANVAS,
        'game'
    );

    game.state.add('BootState', BootState);
    game.state.add('PreloadState', PreloadState);
    game.state.add('FishTankState', FishTankState);

    game.state.start('BootState');
}

if (window.cordova !== undefined) {
    console.log('Cordova found, wating for device');
    document.addEventListener('deviceready', init);
}
else {
    console.log('Cordova not found, booting application');
    init();
}
