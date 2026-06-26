const startMotion = $('#motion1');
const stage = $('#wrapper');
const burst = $('#burst');

let speed = 0.12;

let motionInit = {
  move: ['#motion1', '#motion2', '#motion3', '#motion5', '#motion4', '#motion1'],
  strokeClr: ['red', 'yellow', 'blue', 'purple', 'green', 'red'],
  fillClr: ['#401100', '#3a2803', '#05152b', '#17041f', '#0a1d03', '#401100'],
  bgClr: ['#ea4b4b', '#f9ea9d', '#4ba7ea', '#d191f1', '#98f17d', '#ea4b4b'] };


const stagePlay = new TimelineMax({ repeat: -1 });
const masterPlay = new TimelineMax({ repeat: -1 });
const burstCircle1Play = new TimelineMax();
const burstCircle2Play = new TimelineMax();

//StageBg ColorTween
const playStageBg = () => {
  stagePlay.
  set(stage, { background: motionInit.bgClr[0] }).
  to(stage, speed, { background: motionInit.bgClr[1] }, "+=1").
  to(stage, speed, { background: motionInit.bgClr[2] }, "+=1").
  to(stage, speed, { background: motionInit.bgClr[3] }, "+=1").
  to(stage, speed, { background: motionInit.bgClr[4] }, "+=1").
  to(stage, speed, { background: motionInit.bgClr[5] }, "+=1");
};

//Burst Show
const playBurst = () => {

  burstCircle1Play.
  set(burst.find('.overlay'), { scale: 1, transformOrigin: "50% 50%", alpha: 1 }).
  to(burst.find('.overlay'), 1.1, { scale: 10, transformOrigin: "50% 50%", alpha: 0 });

  burstCircle2Play.
  set(burst.find('path'), { scale: 0, transformOrigin: "50% 50%", alpha: 1 }).
  to(burst.find('path'), 1.1, { scale: 2.5, transformOrigin: "50% 50%", alpha: 0 });
};

//Master KongFu
const playMasterMotion = function () {
  masterPlay.
  set(startMotion, { fill: motionInit.fillClr[0], stroke: motionInit.strokeClr[0] }).
  set(burst, { onComplete: replayBurst, x: 5, y: -100 }) //set brust Position
  .to(startMotion, speed, { onComplete: replayBurst, morphSVG: motionInit.move[1], stroke: motionInit.strokeClr[1], fill: motionInit.fillClr[1] }, "+=1").
  set(burst, { x: 100, y: -50 }) //set brust Position
  .to(startMotion, speed, { onComplete: replayBurst, morphSVG: motionInit.move[2], stroke: motionInit.strokeClr[2], fill: motionInit.fillClr[2] }, "+=1").
  set(burst, { x: -100, y: -90 }) //set brust Position
  .to(startMotion, speed, { onComplete: replayBurst, morphSVG: motionInit.move[3], stroke: motionInit.strokeClr[3], fill: motionInit.fillClr[3] }, "+=1").
  set(burst, { x: -70, y: -15 }) //set brust Position
  .to(startMotion, speed, { onComplete: replayBurst, morphSVG: motionInit.move[4], stroke: motionInit.strokeClr[4], fill: motionInit.fillClr[4] }, "+=1").
  set(burst, { x: 75, y: -110 }) //set brust Position
  .to(startMotion, speed, { onComplete: replayBurst, morphSVG: motionInit.move[5], stroke: motionInit.strokeClr[5], fill: motionInit.fillClr[5] }, "+=1");
};

//Replay the Burst Animation
const replayBurst = function () {
  burstCircle1Play.restart();
  burstCircle2Play.restart();
};

//OnStart
const startPlay = () => {
  playStageBg();
  playBurst();
  playMasterMotion();
};

//All Done, Play it!
startPlay();
