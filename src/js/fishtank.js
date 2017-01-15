function FishTankState(game) {
    this.game = game;

    this.fishGroup = null;
    this.fishes = [];

    this.behavior = Fish.WANDER;
};

FishTankState.prototype = {
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
