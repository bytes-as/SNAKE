var s;
var scl = 20;
var fr = 20;

function setup() {
  createCanvas(600, 600);
  s = new Snake();
  frameRate(fr);
  pickLocation();
}

function draw() {
  frameRate(floor(fr));
  background(51);
  s.death();
  s.update();
  s.show();
  fill(255, 10, 100);
  rect(food.x, food.y, scl, scl);
  if(s.eat(food)) pickLocation();

}

function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor(height/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function keyPressed() {
  if(keyCode == UP_ARROW) s.dir(0, -1);
  if(keyCode == DOWN_ARROW) s.dir(0, 1);
  if(keyCode == LEFT_ARROW) s.dir(-1, 0);
  if(keyCode == RIGHT_ARROW) s.dir(1, 0);
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.x_speed = 1;
  this.y_speed = 0;
  this.total=0;
  this.tail = [];

  this.death = function() {
    for(var i=0; i<this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if(d < 1){
        console.log('Starting over');
        this.total = 0;
        this.tail = [];
      }
    }
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
    rect(this.x, this.y, scl, scl);
    for(var i=0; i<this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl)
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
      fr = fr + 0.1;
      this.total++;
      return true;
    }
    else return false;
  }
}
