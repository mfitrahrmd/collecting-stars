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
    this.cursor = undefined;
    this.scoreText = undefined;
    this.score = 0;
    this.bombs = undefined;
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
    this.cursor = this.input.keyboard.createCursorKeys();
    //animation to the left
    this.anims.create({
      key: "left", //--->nama animasi
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }), //--->frame yang digunakan
      frameRate: 10, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
    //animation idle
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    //animation to the right
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    this.scoreText = this.add.text(16, 16, `Score : ${this.score}`, {
      fontSize: "32px",
      fill: "yellow",
    });
    this.bombs = this.physics.add.group({
      key: "bomb",
      repeat: 5,
      setXY: {
        x: 30,
        y: 0,
        stepX: 120,
      },
    });
    this.physics.add.collider(this.bombs, this.platforms);
    this.bombs.children.iterate(function (child) {
      child.setBounceY(0.1);
    });
    this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);
  }

  update() {
    this.player.setVelocity(0, 200);
    this.player.anims.play("turn");
    if (this.cursor.left.isDown) {
      //Jika keyboard panah kiri ditekan
      this.player.setVelocityX(-200);
      //Kecepatan x : -200
      //Kecepatan y : 200
      //(bergerak ke kiri dan turun kebawah seolah terkena gaya gravitasi)
      this.player.anims.play("left", true);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
      //Memanggil nama animasi.True artinya animasi forever looping
    }
    /* Kecepatan X = 0
    kecepatan y = -200*/
    if (this.cursor.up.isDown) {
      this.player.setVelocityY(-200);
      this.player.anims.play("turn");
    }
  }

  collectStar(player, star) {
    star.destroy();
    this.score += 10;
    this.scoreText.setText(`Score : ${this.score}`);
    if (this.score >= 100) {
      this.gameOver({
        message: "You Win!!",
        size: "32px",
        color: "yellow",
      });
    }
  }
  hitBomb(player, bomb) {
    this.gameOver({
      message: "You Lose!!",
      size: "32px",
      color: "red",
    });
  }
  gameOver(text) {
    this.physics.pause();
    this.add.text(300, 300, text.message, {
      fontSize: text.size,
      fill: text.color,
    });
  }
}
