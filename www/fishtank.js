var FISH_ASSETS = ['green_fish', 'pink_fish', 'blue_fish', 'red_fish', 'orange_fish', 'puffer_fish'];

function Fish(game, group, asset, origin, bounds) {
    this.RIGHT = 'right';
    this.LEFT = 'left';

    this.game = game;
    this.target = Boid.vec2(0, 0);

    if (!asset) {
        asset = this.game.rnd.pick(FISH_ASSETS);
    }

    var x = this.game.rnd.integerInRange(0, bounds.width);
    var y = this.game.rnd.integerInRange(0, bounds.height);
    this.sprite = this.game.add.sprite(x, y, asset, null, group)

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.anchor.set(0.5);

    this.boid = new Boid();
    this.boid.setBounds(bounds.width, bounds.height, origin.x, origin.y);
    this.boid.position.x = x;
    this.boid.position.y = y;
    this.boid.velocity.x = this.game.rnd.integerInRange(-3, 3);
    this.boid.velocity.y = this.game.rnd.integerInRange(-3, 3);

    this.facing = this.RIGHT;
    if (this.boid.velocity.x < 0) {
        this.facing = this.LEFT;
        this.sprite.scale.x *= -1;
    }
}

Fish.prototype.update = function() {
    this.boid.update();

    var dx = this.boid.position.x - this.sprite.x;
    var dy = this.boid.position.y - this.sprite.y;
    var rotation = Math.atan2(dy, dx);

    var facing = this.RIGHT;
    if (rotation > 0.5 * Math.PI || rotation < -0.5 * Math.PI) {
        facing = this.LEFT;
    }
    if (facing != this.facing) {
        this.facing = facing;
        this.sprite.scale.x *= -1;
    }

    this.game.physics.arcade.moveToXY(
        this.sprite,
        this.boid.position.x,
        this.boid.position.y
    );
}

function FishTank(game) {
    this.game = game;

    this.fishGroup = null;
    this.fishes = [];
};

FishTank.prototype = {
    preload: function() {
        //TODO sprite map
        this.load.image('green_fish', 'assets/fishTile_072.png');
        this.load.image('pink_fish', 'assets/fishTile_074.png');
        this.load.image('blue_fish', 'assets/fishTile_076.png');
        this.load.image('red_fish', 'assets/fishTile_078.png');
        this.load.image('orange_fish', 'assets/fishTile_080.png');
        this.load.image('puffer_fish', 'assets/fishTile_100.png');
    },

    create: function() {
        this.game.stage.backgroundColor = '#A1D6E7';

        this.fishGroup = this.add.group();

        //Don't let the fish hit the glass
        var origin = {x: 32, y: 32};
        var bounds = {
            width: this.game.width - origin.x - 32,
            height: this.game.height - origin.y - 32,
        };

        //Ensure that there is at least one of each fish
        FISH_ASSETS.forEach(function(asset) {
            this.fishes.push(new Fish(this.game, this.fishGroup, asset, origin, bounds));
        }, this);

        for (var i = 0; i < this.game.rnd.integerInRange(15, 25); i++) {
            this.fishes.push(new Fish(this.game, this.fishGroup, null, origin, bounds));
        }
    },

    update: function() {
        this.fishes.forEach(function(fish) {
            fish.update();
        });
    },
};

function init() {
    //TODO listen to window resizing
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');
    game.state.add('FishTank', FishTank, true);
}

if (window.cordova !== undefined) {
    console.log('Cordova found, wating for device');
    document.addEventListener('deviceready', init);
}
else {
    console.log('Cordova not found, booting application');
    init();
}
