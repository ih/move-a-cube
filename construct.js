var myDataRef = new Firebase('https://resplendent-fire-131.firebaseio.com/');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );

// From http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  isDown: function(keyCode) {
    return this.pressed[keyCode];
  },

  onKeydown: function(event) {
    this.pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this.pressed[event.keyCode];
  }
};

window.addEventListener(
  'keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener(
  'keydown', function(event) { Key.onKeydown(event); }, false);


function update() {
  var newPosition = _.pick(cube.position, 'x', 'y', 'z');
  myDataRef.on('value', function(snapshot) {
    newPosition = snapshot.val();
    cube.position.x = newPosition.x;
    cube.position.y = newPosition.y;
    cube.position.z = newPosition.z;
  });


  if (Key.isDown(Key.UP)) {
    cube.position.y += .5;
  }
  if (Key.isDown(Key.LEFT)) {
    cube.position.x -= .5;
  }
  if (Key.isDown(Key.DOWN)) {
    cube.position.y -= .5;
  }
  if (Key.isDown(Key.RIGHT)) {
    cube.position.x += .5;
  }
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;
  if (cube.position.x !== newPosition.x || cube.position.y !== newPosition.y || cube.position.z !== newPosition.z) {
    myDataRef.set(_.pick(cube.position, 'x', 'y', 'z'));
  }
}


scene.add( cube );
camera.position.z = 5;

function render() {
  requestAnimationFrame( render );
  update(cube);


  renderer.render( scene, camera );
}

render();
