function BootState() {}

BootState.prototype = {
    preload: function() {
        this.load.image('logo', 'img/logo.png');
        this.load.image('loading', 'img/loading.png'); //TODO add loading image
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

        this.loading = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY + 128,
            'loading'
        );
        this.loading.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.loading);

        //TODO sprite map
        this.load.image('green_fish', 'img/fishTile_072.png');
        this.load.image('pink_fish', 'img/fishTile_074.png');
        this.load.image('blue_fish', 'img/fishTile_076.png');
        this.load.image('red_fish', 'img/fishTile_078.png');
        this.load.image('orange_fish', 'img/fishTile_080.png');
        this.load.image('puffer_fish', 'img/fishTile_100.png');
    },
    create: function() {
        this.game.state.start('FishTankState');
    }
};


function init() {
    //TODO listen to window resizing
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');

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
