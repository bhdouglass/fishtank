function FishTankState(game) {
    this.game = game;
    this.playMusic = true;
    this.modal = new gameModal(game);

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
}

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
            this.musicCheckbox.loadTexture('assets', 'checkbox_blank');

            this.playMusic = false;
            this.seashore.stop();
        }
        else {
            this.musicCheckbox.loadTexture('assets', 'checkbox');

            this.playMusic = true;
            this.seashore.loopFull(0.5);
        }

        localStorage.setItem('play-music', this.playMusic ? 'true' : 'false');
    },

    create: function() {
        this.game.stage.backgroundColor = '#A1D6E7';

        //Setup the about modal
        this.modal.createModal({
            type: 'about',
            includeBackground: true,
            modalCloseOnInput: true,
            itemsArr: [
                {
                    type: 'text', //TODO use a bitmap font
                    content: 'Fish Tank',
                    fontSize: 42,
                    offsetY: -130,
                    color: "0xFFFFFF",
                }, {
                    type: 'text',
                    content: 'Author: Brian Douglass',
                    fontSize: 36,
                    offsetY: -80,
                    color: "0xFFFFFF",
                    callback: function () {
                        window.open('https://bhdouglass.com/');
                    }
                }, {
                    type: 'text',
                    content: 'Image Assets: Kenney',
                    fontSize: 36,
                    offsetY: -40,
                    color: "0xFFFFFF",
                    callback: function () {
                        window.open('http://www.kenney.nl');
                    }
                }, {
                    type: 'text',
                    content: 'Music: Philippe Groarke',
                    fontSize: 36,
                    offsetY: 0,
                    color: "0xFFFFFF",
                    callback: function () {
                        window.open('http://opengameart.org/content/seashore-peace-ambiance');
                    }
                }, {
                    type: 'text',
                    content: 'Sound FX: jcpmcdonald',
                    fontSize: 36,
                    offsetY: 40,
                    color: "0xFFFFFF",
                    callback: function () {
                        window.open('http://opengameart.org/content/skippy-fish-water-sound-collection');
                    }
                }, {
                    type: 'text',
                    content: 'Source Code on Github',
                    fontSize: 32,
                    offsetY: 90,
                    color: "0xFFFFFF",
                    callback: function () {
                        window.open('https://github.com/bhdouglass/fishtank');
                    }
                }
            ]
        });

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
        this.aboutGroup = this.add.group();

        //Setup ground and ornament tiles
        var tiles = (this.game.width / 64) + 1;
        for (var i = 0; i < tiles; i++) {
            var asset = this.game.rnd.pick(this.tileOptions);
            this.groundGroup.create(64 * i, this.game.height - 64, 'assets', asset);

            if (this.game.rnd.integerInRange(1, 3) == 1) {
                var ornamentAsset = this.game.rnd.pick(this.ornamentOptions);
                var offset = 12; //The ground tiles have some transparency on top
                this.ornamentGroup.create(64 * i, this.game.height - 64 - 64 + offset, 'assets', ornamentAsset);
            }
        }

        //Setup the music checkbox
        this.musicInputGroup.inputEnableChildren = true;

        this.musicCheckbox = this.musicInputGroup.create(12, this.game.height - 44, 'assets', 'checkbox');
        this.game.add.text(60, this.game.height - 40, 'Music', null, this.musicInputGroup);

        var playMusic = localStorage.getItem('play-music');
        if (playMusic == 'false') {
            this.toggleMusic();
        }

        //Setup the about button
        this.aboutGroup.inputEnableChildren = true;
        this.aboutGroup.create(this.game.width - 64, this.game.height - 48, 'assets', 'square_button');
        this.game.add.text(this.game.width - 47, this.game.height - 40, '?', null, this.aboutGroup);

        //Setup the fish
        var origin = {x: 32, y: 32}; //Don't let the fish hit the glass
        var bounds = {
            width: this.game.width - origin.x,
            height: this.game.height - origin.y - 64, //Include room for the ground
        };

        //Ensure that there is at least one of each fish
        Fish.FISH_ASSETS.forEach(function(asset) {
            this.fishes.push(new Fish(this.game, this.fishGroup, asset, origin, bounds));
        }, this);

        for (var j = 0; j < this.game.rnd.integerInRange(15, 25); j++) {
            this.fishes.push(new Fish(this.game, this.fishGroup, null, origin, bounds));
        }

        //Setup input
        this.musicInputGroup.onChildInputUp.add(this.toggleMusic, this);

        this.aboutGroup.onChildInputUp.add(function() {
            this.modal.showModal('about');
        }, this);

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
