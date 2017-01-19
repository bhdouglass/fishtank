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

        //TODO sprite map
        this.load.image('green_fish', 'img/fishTile_073.png');
        this.load.image('pink_fish', 'img/fishTile_075.png');
        this.load.image('blue_fish', 'img/fishTile_077.png');
        this.load.image('red_fish', 'img/fishTile_079.png');
        this.load.image('orange_fish', 'img/fishTile_081.png');
        this.load.image('puffer_fish', 'img/fishTile_101.png');

        this.load.image('ground_01', 'img/fishTile_056.png');
        this.load.image('ground_02', 'img/fishTile_057.png');
        this.load.image('ground_03', 'img/fishTile_060.png');
        this.load.image('ground_04', 'img/fishTile_061.png');
        this.load.image('ground_05', 'img/fishTile_062.png');
        this.load.image('ground_06', 'img/fishTile_063.png');

        this.load.image('ornament_01', 'img/fishTile_032.png');
        this.load.image('ornament_02', 'img/fishTile_033.png');
        this.load.image('ornament_03', 'img/fishTile_084.png');
        this.load.image('ornament_04', 'img/fishTile_085.png');

        this.load.image('checkbox', 'img/blue_boxCheckmark.png');
        this.load.image('checkbox_blank', 'img/grey_box.png');

        this.load.audio('bubbles', 'audio/jcpmcdonald/bubbles.mp3');
        this.load.audio('swim', 'audio/jcpmcdonald/swim.mp3');
        this.load.audio('water', 'audio/jcpmcdonald/water.mp3');
        this.load.audio('seashore-peace', 'audio/socapex/seashore-peace.mp3');
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
