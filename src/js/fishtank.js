function FishTankState(game) {
    this.game = game;
    this.playMusic = true; //TODO save/load from localstorage

    this.fishes = [];

    this.tileOptions = [
        'ground_01',
        'ground_02',
        'ground_03',
        'ground_04',
        'ground_05',
        'ground_06',
    ];

    this.ornamentOptions = [
        'ornament_01',
        'ornament_02',
        'ornament_03',
        'ornament_04',
    ];

    this.soundOptions = [
        'bubbles',
        'swim',
        'water',
    ]

    this.behavior = Fish.WANDER;
};

FishTankState.prototype = {
    audioStart: function() {
        console.log('audio loaded');
        if (this.playMusic) {
            this.seashore.loopFull(0.5);
        }

        this.timer = this.game.time.create(false);
        this.timer.loop(2000, this.soundfx, this);
        this.timer.start();
    },

    soundfx: function() {
        if (this.playMusic && this.game.rnd.integerInRange(0, 5) == 0) {
            var sound = this.game.rnd.pick(this.soundOptions);
            this[sound].play(null, null, 0.5);
        }
    },

    toggleMusic: function() {
        console.log('music changed, new value:', !this.playMusic);

        if (this.playMusic) {
            this.musicCheckbox.loadTexture('checkbox_blank');

            this.playMusic = false;
            this.seashore.stop();
        }
        else {
            this.musicCheckbox.loadTexture('checkbox');

            this.playMusic = true;
            this.seashore.loopFull(0.5);
        }

        localStorage.setItem('play-music', this.playMusic ? 'true' : 'false');
    },

    create: function() {
        this.game.stage.backgroundColor = '#A1D6E7';

        //Setup sounds
        this.bubbles = this.game.add.audio('bubbles');
        this.swim = this.game.add.audio('swim');
        this.water = this.game.add.audio('water');
        this.seashore = this.game.add.audio('seashore-peace');
        var sounds = [this.bubbles, this.swim, this.water, this.seashore];

        this.game.sound.setDecodedCallback(sounds, this.audioStart, this);

        //Setup groups
        this.ornamentGroup = this.add.group();
        this.groundGroup = this.add.group();
        this.fishGroup = this.add.group();
        this.musicInputGroup = this.add.group();

        //Setup ground and ornament tiles
        var tiles = (this.game.width / 64) + 1;
        for (var i = 0; i < tiles; i++) {
            var asset = this.game.rnd.pick(this.tileOptions);
            this.groundGroup.create(64 * i, this.game.height - 64, asset);

            if (this.game.rnd.integerInRange(1, 3) == 1) {
                var ornamentAsset = this.game.rnd.pick(this.ornamentOptions);
                var offset = 12; //The ground tiles have some transparency on top
                this.ornamentGroup.create(64 * i, this.game.height - 64 - 64 + offset, ornamentAsset);
            }
        }

        //Setup the music checkbox
        this.musicInputGroup.inputEnableChildren = true;

        var checkbox_asset = 'checkbox'; //TODO save the checked state to local storage
        this.musicCheckbox = this.musicInputGroup.create(12, this.game.height - 44, checkbox_asset);
        this.game.add.text(60, this.game.height - 40, 'Music', null, this.musicInputGroup);

        var playMusic = localStorage.getItem('play-music');
        if (playMusic == 'false') {
            this.toggleMusic();
        }

        //Setup the fish
        var origin = {x: 32, y: 32}; //Don't let the fish hit the glass
        var bounds = {
            width: this.game.width - origin.x - 32,
            height: this.game.height - origin.y - 32 - 64, //Inlcude room for the ground
        };

        //Ensure that there is at least one of each fish
        Fish.FISH_ASSETS.forEach(function(asset) {
            this.fishes.push(new Fish(this.game, this.fishGroup, asset, origin, bounds));
        }, this);

        for (var i = 0; i < this.game.rnd.integerInRange(15, 25); i++) {
            this.fishes.push(new Fish(this.game, this.fishGroup, null, origin, bounds));
        }

        //Setup input
        this.musicInputGroup.onChildInputUp.add(this.toggleMusic, this);

        this.game.input.onDown.add(function() {
            this.behavior = Fish.SEEK;
        }, this);

        this.game.input.onUp.add(function() {
            this.behavior = Fish.WANDER;
        }, this);
    },

    update: function() {
        this.fishes.forEach(function(fish) {
            fish.update(this.behavior, this.game.input.activePointer);
        }, this);
    },
};
