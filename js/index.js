var s;
var scl = 20;
var fr = 20;
var play = false;
var dead = false;
var x = -1;
var y = -1;
document.getElementByName("start_game").onclick = function game() {
  draw()
}

function setup() {
  createModel();
  createCanvas(600, 600).parent("sketch");
  s = new Snake();
  frameRate(fr);
  pickLocation();
}

function draw() {
  if(dead) {
    play = false;
    return null;
  }
  if (!play) {
    background(110);
    textSize(30);
    fill(0);
    text('press \'Enter\' to play or pause', width/2 - 200, height/2 - 50, width/2 + 200, height/2 + 50);
    return null;
  }
  frameRate(fr);
  background(51);
  x = s.x;
  y = s.y;
  if(s.death()){
    return false;
  }
  s.update();
  if(s.x == x && s.y == y) {
    text('DoN\'t ToUcH wAlL :)\npress \'Enter\' to play or pause', width/2 - 200, height/2 - 50, width/2 + 200, height/2 + 50);
    dead = true;
    play = false;
    console.log('Starting over');
    s.x = 0;
    s.y = 0;
    s.x_speed = 1;
    s.y_speed = 0;
    s.total=0;
    s.tail = [];
    pickLocation();
    return dead;
  }
  s.show();
  fill(255, 10, 100);
  rect(food.x+1, food.y+1, scl-2, scl-2);
  if(s.eat(food)) pickLocation();
  document.getElementById("frameRate").innerHTML = "frame rate : " + fr;
}

function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor(height/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function mouseClicked() {
  if ( mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height)
    play = !play;
}

function keyPressed() {
  if(keyCode == UP_ARROW || keyCode==87) s.dir(0, -1);
  if(keyCode == DOWN_ARROW || keyCode==83) s.dir(0, 1);
  if(keyCode == LEFT_ARROW || keyCode==65) s.dir(-1, 0);
  if(keyCode == RIGHT_ARROW || keyCode==68) s.dir(1, 0);
  if(keyCode == ENTER) {
    play = !play;
    dead = false;
  }
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.x_speed = 1;
  this.y_speed = 0;
  this.total=0;
  this.tail = [];

  this.death = function() {
    document.getElementById("tailLength").innerHTML = "snake length = " + s.tail.length;
    for(var i=0; i<this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if(d < 5){
        background(110);
        textSize(30);
        fill(0);
        text('You loSt :)\npress \'Enter\' to play or pause', width/2 - 200, height/2 - 50, width/2 + 200, height/2 + 50);
        dead = true;
        play = false;
        console.log('Starting over');
        this.x = 0;
        this.y = 0;
        this.x_speed = 1;
        this.y_speed = 0;
        this.total=0;
        this.tail = [];
        pickLocation();
        return dead;
      }
    }
    return dead;
  }

  this.update = function() {
    for (var i=0; i<this.tail.length-1; i++) this.tail[i] = this.tail[i+1];
    this.tail[this.total-1] = createVector(this.x, this.y);
    this.x = this.x + this.x_speed*scl;
    this.y = this.y + this.y_speed*scl;
    this.x = constrain(this.x, 0, width-scl);
    this.y = constrain(this.y, 0, height-scl);
  }

  this.show = function() {
    fill(255);
    rect(this.x+1, this.y+1, scl-2, scl-2);
    fill(0);
    line(this.x + 10 + 5*this.x_speed, this.y + 10 + 5*this.y_speed, this.x + 10 + this.x_speed*10, this.y + 10 + this.y_speed*10);
    for(var i=0; i<this.tail.length; i++) {
      fill(175 + (80*(i+1)/(this.tail.length+1)));
      rect(this.tail[i].x + 1, this.tail[i].y + 1, scl-2, scl-2);
    }
  }

  this.dir = function(x, y) {
    if(this.x_speed * x != -1 && this.y_speed * y != -1) {
      this.x_speed = x;
      this.y_speed = y;
    }
  }

  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 5){
      fr = fr + 0.02;
      this.total++;
      return true;
    }
    else return false;
  }
}

function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 32, batchInputShape: [null, 50], activation: 'relu'}));
  model.add(tf.layers.dense({units: 4, activation: 'relu'}));
  console.log(JSON.stringify(model.outputs[0].shape));
  return model;
}
