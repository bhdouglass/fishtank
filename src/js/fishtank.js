function FishTankState(game) {
    this.game = game;

    this.ornamentGroup = null;
    this.groundGroup = null;
    this.fishGroup = null;
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

    this.behavior = Fish.WANDER;
};

FishTankState.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#A1D6E7';

        this.ornamentGroup = this.add.group();
        this.groundGroup = this.add.group();
        this.fishGroup = this.add.group();

        var tiles = (this.game.width / 64) + 1;
        for (var i = 0; i < tiles; i++) {
            var asset = this.game.rnd.pick(this.tileOptions);
            this.groundGroup.create(64 * i, this.game.height - 64, asset, null);

            if (this.game.rnd.integerInRange(1, 3) == 1) {
                var ornamentAsset = this.game.rnd.pick(this.ornamentOptions);
                var offset = 12; //The ground tiles have some transparency on top
                this.ornamentGroup.create(64 * i, this.game.height - 64 - 64 + offset, ornamentAsset, null);
            }
        }

        //Don't let the fish hit the glass
        var origin = {x: 32, y: 32};
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
