var defaultFrameRate = 20;
var defaultScale = 20;
var defaultWidth = 800;
var defaultHeight = 800;

var componentSnake;
var componentFood;
var play = false;
var alive = true;
var currentFrameRate = defaultFrameRate;

var setup = function() {
  createCanvas(defaultWidth, defaultHeight).parent('sketch');
  frameRate(currentFrameRate);
  componentSnake = new Snake();
  componentFood = new Food();
}

var draw = function() {
  document.getElementById("frameRate").innerHTML = currentFrameRate;
  document.getElementById("tailLength").innerHTML = componentSnake.tailLength;
  frameRate(currentFrameRate);
  background(51);
  if (componentSnake.alive) if (!play) {
    background(110);
    textSize(30);
    fill(0);
    text('press \'Enter\' to play or pause', width/2 - 200, height/2 - 50, width/2 + 200, height/2 + 50);
    noLoop();
    return null;
  }
  if (componentSnake.alive) componentSnake.update();
  let aliveCode = componentSnake.isAlive();
  if (aliveCode == -2) {
    frameRate(defaultFrameRate);
    play = false;
    text('DoN\'t ToUcH wAlL :)\npress \'Enter\' to try to play again', width/2 - 200, height/2 - 50, width/2 + 200, height/2 + 50);
    console.log('press \'Enter\' to start over');
    noLoop();
    return null;
  }
  else if (aliveCode == -1) {
    frameRate(defaultFrameRate);
    play = false;
    textSize(30);
    fill(0);
    text('You make the snake eat itself :)\npress \'Enter\' to try to play again ', width/2 - 200, height/2 - 50, width/2 + 200, height/2 + 50);
    noLoop();
    return null;
  }
  if(isFoodEaten(componentSnake, componentFood)) {
    componentFood.changePosition();
    componentSnake.digest();
  }
  componentSnake.show();
  componentFood.show();
}

function keyPressed() {
  if(keyCode == UP_ARROW || keyCode==87) componentSnake.changeDirection(0, -1);
  if(keyCode == DOWN_ARROW || keyCode==83) componentSnake.changeDirection(0, 1);
  if(keyCode == LEFT_ARROW || keyCode==65) componentSnake.changeDirection(-1, 0);
  if(keyCode == RIGHT_ARROW || keyCode==68) componentSnake.changeDirection(1, 0);
  if(keyCode == ENTER) {
    play = !play;
    if (!componentSnake.alive) {
      currentFrameRate = defaultFrameRate;
      componentSnake.reinitializeSnake();
      componentFood.changePosition();
      console.log('Starting a new game');
    }
    if(play) loop();
  }
}

function isFoodEaten(snake, food) {
  if(dist(snake.x, snake.y, food.x, food.y) < defaultScale)
    return true;
  return false;
}

function mouseClicked() {
  componentSnake.tailLength++;
}

class Food {
  constructor() {
    this.x = floor(random(floor(width/defaultScale)))*defaultScale;
    this.y = floor(random(floor(height/defaultScale)))*defaultScale;
    console.log('component food has been created and displayed at ' + this.x + ',' + this.y);
  }

  show = function() {
    fill(255, 10, 100);
    rect(this.x+1, this.y+1, defaultScale-2, defaultScale-2);
    // console.log('component food has been displayed at ' + this.x + ',' + this.y);
  }

  changePosition = function() {
    this.x = floor(random(floor(width/defaultScale)))*defaultScale;
    this.y = floor(random(floor(height/defaultScale)))*defaultScale;
    console.log('food location has been updated');
  }
}

class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.speedX = 1;
    this.speedY = 0;
    this.tailLength = 0;
    this.tail = [];
    this.alive = true;
    console.log('new Snake component has been initialized');
  }

  reinitializeSnake = function(){
    this.x = 0;
    this.y = 0;
    this.speedX = 1;
    this.speedY = 0;
    this.tailLength = 0;
    this.tail = [];
    this.alive = true;
    console.log('snake has been reinitialized');
  }

  show = function() {
    fill(255);
    rect(this.x + 1, this.y + 1, defaultScale - 2, defaultScale - 2);
    fill(0);
    line(this.x + 10 + 5*this.speedX, this.y + 10 + 5*this.speedY, this.x + 10 + 10*this.speedX, this.y + 10 + 10*this.speedY);
    for(var i=0; i<this.tail.length; i++) {
      fill(175 + (80*(i+1)/(this.tail.length+1)));
      rect(this.tail[i].x + 1, this.tail[i].y + 1, defaultScale - 2, defaultScale - 2);
    }
    // console.log('snake has been drawn');
    return null;
  }

  isAlive = function() {
    if(this.x < 0 || this.x > width-defaultScale || this.y < 0 || this.y > height-defaultScale) {
      this.alive = false;
      console.log('Snake hit the wall');
      return -2;
    }
    for(var i=0; i<this.tail.length; i++) {
      var position = this.tail[i];
      var distance = dist(this.x, this.y, position.x, position.y);
      if( distance < defaultScale) {
        this.alive = false;
        console.log('snake ate itself');
        return -1;
      }
    }
    return 0;
  }

  update = function() {
    for(var i=0; i<this.tail.length-1; i++) this.tail[i] = this.tail[i+1];
    this.tail[this.tailLength-1] = createVector(this.x, this.y);
    this.x = this.x + this.speedX * defaultScale;
    this.y = this.y + this.speedY * defaultScale;
    this.x = constrain(this.x, -1, width - defaultScale +1);
    this.y = constrain(this.y, -1, height - defaultScale + 1);
    console.log('snake component has been updated');
    return null;
  }

  changeDirection = function(x, y) {
    if(this.speedX * x >= 0 && this.speedY * y >= 0){
      this.speedX = x;
      this.speedY = y;
    }
    console.log('direction has been updated')
    return null;
  }

  digest = function(position) {
    currentFrameRate = currentFrameRate + 0.02;
    console.log('frame rate has been increased by 0.02 frames per second');
    this.tailLength++;
    console.log('snake tail length has been increased');
    return null;
  }


}
