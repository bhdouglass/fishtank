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
    this.sprite = this.game.add.sprite(x, y, 'assets', asset, group);

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.anchor.set(0.5);

    this.boid = new Boid({
        wanderDistance: 20,
        wanderRadius: 1,
        wanderAngle: 0,
        wanderRange: 1,
    });
    this.boid.setBounds(bounds.width, bounds.height, origin.x, origin.y);
    this.boid.position.x = x;
    this.boid.position.y = y;
    this.boid.maxSpeed = this.game.rnd.realInRange(0.5, 0.75);

    this.facing = this.RIGHT;
    if (this.boid.velocity.x < 0) {
        this.facing = this.LEFT;
        this.sprite.scale.x *= -1;
    }

    //Prevent the fish from rapidly switching facings
    this.wiggle = 0;
}

Fish.FISH_ASSETS = FISH_ASSETS;
Fish.WANDER = 'wander';
Fish.SEEK = 'seek';
Fish.FLEE = 'flee';
Fish.WIGGLE_FACTOR = 20;

Fish.prototype.update = function(behavior, target) {
    if (behavior == Fish.WANDER) {
        this.boid.wander();
    }
    else if (behavior == Fish.SEEK) {
        this.boid.arrive(Boid.vec2(target.x, target.y));
    }
    else if (behavior == Fish.FLEE) {
        this.boid.flee(Boid.vec2(target.x, target.y));
    }

    this.boid.update();

    var dx = this.boid.position.x - this.sprite.x;
    var dy = this.boid.position.y - this.sprite.y;
    var rotation = Math.atan2(dy, dx);

    var facing = this.RIGHT;
    if (rotation > 0.5 * Math.PI || rotation < -0.5 * Math.PI) {
        facing = this.LEFT;
    }

    if (facing != this.facing) {
        if (this.wiggle > Fish.WIGGLE_FACTOR) {
            this.wiggle = 0;

            this.facing = facing;
            this.sprite.scale.x *= -1;
        }
        else {
            this.wiggle++;
        }
    }

    this.sprite.x = this.boid.position.x;
    this.sprite.y = this.boid.position.y;
}
