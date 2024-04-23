import Phaser from "phaser";
import Bomb from "../../public/images/bomb.png";
import Dude from "../../public/images/dude.png";
import Platform from "../../public/images/platform.png";
import Sky from "../../public/images/sky.png";
import Star from "../../public/images/star.png";

export default class CollectingStarsScene extends Phaser.Scene {
  constructor() {
    super("collecting-stars-scene");
  }
  init() {
    this.platforms = [];
    this.stars = undefined;
  }

  preload() {
    this.load.image("ground", Platform);
    this.load.image("bomb", Bomb);
    this.load.image("sky", Sky);
    this.load.image("star", Star);
    this.load.spritesheet("dude", Dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 10,
      setXY: {
        x: 50,
        y: 0,
        stepX: 70,
      },
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.stars.children.iterate(function (child) {
      child.setBounceY(0.5);
    });
  }

  update() {}
}
