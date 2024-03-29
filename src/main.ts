import Phaser from "phaser";
import AncientDices from "./App";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // width: 800,
  // height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [AncientDices],
};

export default new Phaser.Game(config);

