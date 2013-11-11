// Load Web Audio Context for Web Audio API
var context;
var container;

try {
    if(typeof webkitAudioContext === 'function') { // webkit-based
      context = new webkitAudioContext();
    }
    else { // other browsers that support AudioContext
      context = new AudioContext();
    }
  }
  catch(e) {
    alert("Web Audio API is not supported in this browser");
  }

  // web audio api variables
  var source, sourceJs;
  var analyser;
  var buffer;
  var array = [];
  var startTime;
  var songPlaying;
  var request;
  var currentSource;
  var url = 'https://api.soundcloud.com/tracks/118852333/stream?client_id=9907b9176ff3ca255b472d3d22a880bb';


// STANDARD THREE VARIABLES
var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();
var clock = new THREE.Clock( true );

// ALL OBJECTS THAT MOVE TO THE MUSIC
var movingObjects = [];

// ARRAY FOR RAYCASTER COLLISION DETECTION
var allObjects = [];

// BIG SPHERE (SKY)
var bigSphere, sphereMaterial;

// MIRROR EFFECT VARIABLES
var mirrorCube, mirrorCubeCamera;
var mirrorSphere, mirrorSphereCamera;

// PARTICLE GENERATOR OBJECTS
var emitter, particleGroup;

// FALLING TEXT OBJECTS
var fallingTexts = [];

// COUNTING OBJECTS TOUCHED
var objectsTouched = 0;

// GRAFFITI WALL VARIABLES
var wall;
var messageLeft = false;
var userMessage = "";
var lastPress = Date.now();
var textCount = 0;
var sendAjax = true;
var textContents = [];

// CENTRAL PARK VARIABLES
var dancingGrass = [];

// GOOGLE COORDINATES
coordinates = [[40.740084,-73.990115], [40.736698,-73.990164], [40.736706,-74.001249], [40.748379,-74.000112], [40.749955,-73.988549], [40.754734,-73.987922], [40.754734,-73.987922], [40.758635,-73.977452], [40.76538,-73.979727], [40.768029,-73.981937], [40.763771,-73.976368], [40.761691,-73.970693], [40.755953,-73.972816], [40.752154,-73.977782], [40.745111,-73.984687], [40.737925,-73.981683], [40.740835,-73.99185] ];


var testWords = ["new york city", "#i love this town", "beautiful", "lol"];

// RAYCASTERS - NOT OPTIMIZED
var ray;
var xray;
var zray;

// PHYSIJS SETUP
Physijs.scripts.worker = 'assets/helper_libraries/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

      // POINTERLOCK CODE - FROM http://www.html5rocks.com/en/tutorials/pointerlock/intro/
      var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

      if ( havePointerLock ) {

        var element = document.body;

        var pointerlockchange = function ( event ) {

          if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controls.enabled = true;

            blocker.style.display = 'none';

          } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

          }

        }

        var pointerlockerror = function ( event ) {

          instructions.style.display = '';

        }

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {

          instructions.style.display = 'none';

          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

          if ( /Firefox/i.test( navigator.userAgent ) ) {

            var fullscreenchange = function ( event ) {

              if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                element.requestPointerLock();
              }

            };

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

          } else {

            element.requestPointerLock();

          }

        }, false );

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}
// LOAD AUDIO
loadAudioRequest( url );

// CALL MAIN INITIALIZE FUNCTION
init();

// INITIALIZE PARTICLE GENERATOR
initParticles();

// CALL ANIMATE FUNCTION
animate();

function init() {

// APPEND CONTAINER TO BODY
container = document.createElement( 'div' );
container.id = 'container';
document.body.appendChild( container );

// INITIALIZE RENDERER
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor( 0x000000 );
container.appendChild( renderer.domElement );

// STATS
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;
container.appendChild( stats.domElement );

// CHECK FOR WINDOW RESIZE
window.addEventListener( 'resize', onWindowResize, false );

// INITIALIZE NEW CAMERA
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );

// INITIALIZE NEW SCENE
// scene = new THREE.Scene();
scene = new Physijs.Scene;

// FOG OPTIONS
// scene.fog = new THREE.Fog( 0xff5588, 0, 2000 );
// scene.fog = new THREE.FogExp2( 0xff5566, 0.0015 );
// scene.fog = new THREE.FogExp2( 0x88888888, 0.0015 );


// ADD LIGHTS
var light = new THREE.DirectionalLight( 0x888888, 1.5 );
light.position.set( 1, 1, 1 );
scene.add( light );

var light = new THREE.DirectionalLight( 0x888888, 0.75 );
light.position.set( -1, - 0.5, -1 );
scene.add( light );

// var ambientLight = new THREE.AmbientLight( 0xff5577 );
var ambientLight = new THREE.AmbientLight(  0x404040 );
scene.add( ambientLight );

// ADD CONTROLS
controls = new THREE.PointerLockControls( camera );
scene.add( controls.getObject() );

// ADD RAYCASTER
ray = new THREE.Raycaster();
ray.ray.direction.set( 0, -1, 0 );
xray = new THREE.Raycaster();
xray.far = 100;
zray = new THREE.Raycaster();
zray.far = 100;
xray.ray.direction.set( 1, 0, 0 );
zray.ray.direction.set( 0, 0, 1 );

// INITIALIZE GEOMETRY
generateFloor();
addBigSphere( 0, 0 );

addMirrorSphere( 500, 400 );
addMirrorCube( 0, 400 );

dynamicBuildings( coordinates );
// words();
graffitiWall();
centralPark();


}

function animate() {

  requestAnimationFrame( animate );

  controlCheck();
  detectCollision();
  stats.update();
  render();

}

function render() {

  var timeElapsed = clock.getElapsedTime();

    // animate all shapes in "movingObjects" array based on song
    var k = 0;
    for( var i = 0; i < movingObjects.length; i++ ) {
      var scale = ( array[k] ) / 80;
      var rand = Math.floor(Math.random() * 10);
      if( rand % 3 === 0 ){
        movingObjects[i].scale.x = ( scale < 1 ? 1 : scale );
      }
      else if ( rand % 2 === 0 ) {
        movingObjects[i].scale.y = ( scale < 1 ? 1 : scale );
      }
      else {
        movingObjects[i].scale.z = ( scale < 1 ? 1 : scale );
      }
      k += ( k < array.length? 1 : 0 );
    }
  // time event to begin particles
  if( timeElapsed > 35 ) {
    particleGroup.tick( array[k] / 1000);
    // console.log("should be working");
  }
  if ( ( timeElapsed > 60 ) && ((( Math.round( timeElapsed * 10 ) % 100 === 0 )))) {
    words( testWords, coordinates );
    console.log( "words");
  }

  if( Math.round( timeElapsed * 5 ) % 50 === 0 ) {
    updateWall();

  }

  takeMirrorSnapshot();

  fallingWords();

  renderer.render( scene, camera );
}

function detectCollision() {
  unlockAllDirection();

  var rotationMatrix;
  var cameraDirection = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();

  if (controls.moveForward()) {
    // Nothing to do!
  }
  else if (controls.moveBackward()) {
    rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(180 * Math.PI / 180);
  }
  else if (controls.moveLeft()) {
    rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(90 * Math.PI / 180);
  }
  else if (controls.moveRight()) {
    rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY((360-90) * Math.PI / 180);
  }
  else return;

  if (rotationMatrix !== undefined){
    cameraDirection.applyMatrix4(rotationMatrix);
  }
  var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);
  intersects = rayCaster.intersectObjects(allObjects, true);

  if ((intersects.length > 0 && intersects[0].distance < 25)) {
    lockDirection();
  }
  if ( intersects.length > 0 && intersects[0].distance < 300 ) {
    if( intersects[0].object == wall ) {
      if( !messageLeft ) {
      // FORM POPS UP, WHEN THEY PRESS ENTER ADDS MESSAGE
      $( '#graffiti-form' ).css( "display", "block" );
      $( document.body ).on( "keypress", leaveAMessage );
    }
  }
}
}

function lockDirection() {
  if (controls.moveForward()) {
    controls.lockMoveForward(true);
  }
  else if (controls.moveBackward()) {
    controls.lockMoveBackward(true);
  }
  else if (controls.moveLeft()) {
    controls.lockMoveLeft(true);
  }
  else if (controls.moveRight()) {
    controls.lockMoveRight(true);
  }
}

function unlockAllDirection(){
  controls.lockMoveForward(false);
  controls.lockMoveBackward(false);
  controls.lockMoveLeft(false);
  controls.lockMoveRight(false);
}



function leaveAMessage(e) {
  controls.blockJump( true );
  thisPress = Date.now();
  e.preventDefault();
  var keycode = (e.keyCode ? e.keyCode : e.which );
  if( keycode == '13' ) {
    messageLeft = true;
    // $( '#graffiti-form' ).css( "display", "none" );
    $( '#graffiti-form' ).fadeOut(400);
    $( document.body ).off( "keypress", leaveAMessage );
    if ( sendAjax ) {
      $.ajax({
        type: "POST",
        data: {message: {message: userMessage}},
        url: '/messages.json'
      });
      sendAjax = false;
      controls.blockJump( false );
    }
  }
  else {
    c = String.fromCharCode( e.which );
    if( (thisPress - lastPress) > 50 ) {
      userMessage += c;
      $( '#user-input').append(c).fadeIn(200);
      console.log(userMessage);
      lastPress = thisPress;
    }
// record each keystroke as part of a variable, message
}
}




// THIS IS HOW YOU JUMP ON OBJECTS
function controlCheck() {

  controls.isOnObject( false );

  ray.ray.origin.copy( controls.getObject().position );
  ray.ray.origin.y -= 10;

  var intersections = ray.intersectObjects( allObjects );

  if( intersections.length > 0 ) {

    var distance = intersections[0].distance;

    if( distance > 0 && distance < 10 ) {

      controls.isOnObject( true );

    }
  }

  controls.update( Date.now() - time );
  renderer.render( scene, camera );

  time = Date.now();
}



function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


// LOAD AUDIO REQUEST TO/FROM SOUNDCLOUD API

function loadAudioRequest( url ) {
  request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  request.send();

  request.onload = loadAudioBuffer;
}

//  LOAD AUDIO BUFFER IN WEB AUDIO API

function loadAudioBuffer() {
  context.decodeAudioData(
    request.response,
    function(buffer) {
      if(!buffer) {
                // Error decoding file data
                alert("error decoding buffer");
                return;
              }

              sourceJs = context.createJavaScriptNode(2048);
              sourceJs.buffer = buffer;
              sourceJs.connect(context.destination);
              analyser = context.createAnalyser();
              analyser.smoothingTimeConstant = 0.6;
              analyser.fftSize = 512;

              source = context.createBufferSource();
              source.buffer = buffer;

              source.connect(analyser);
              analyser.connect(sourceJs);
              source.connect(context.destination);


              sourceJs.onaudioprocess = function(e) {
                array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
              };

              source.start(0);
              currentSource = source;
              songPlaying = true;
              startTime = new Date();
            },
            function(error) {
            // Decoding error
          }
          );
}

// UPDATE FUNCTIONS

function fallingWords() {
  var timeElapsed = clock.getElapsedTime();
  if ( timeElapsed< 120 ) {
    for( var i = 0; i < fallingTexts.length; i++ ) {
      fallingTexts[i].position.y -= 2;
    }
  }
  else if ( timeElapsed > 120 ) {
    for( var i = 0; i < fallingTexts.length; i++ ) {
      if( fallingTexts[i].position.y > 0 ) {
        fallingTexts[i].position.y -= 2;
      }
    }

  }
}

function takeMirrorSnapshot() {
  mirrorCube.visible = false;
  mirrorCubeCamera.updateCubeMap( renderer, scene );
  mirrorCube.visible = true;

  mirrorSphere.visible = false;
  mirrorSphereCamera.updateCubeMap( renderer, scene );
  mirrorSphere.visible = true;
}

function updateWeather( temp ) {
  if( temp <= 0 ) {

  }

}

function updateWall() {
 $.ajax({
  type: "GET",
  url: '/messages.json'
}).done(function(data) {
  for( var i = 0; i < data.length; i ++ ) {
    if( textContents.indexOf( data[i].message ) == -1 ) {
      var newCanvas = document.createElement( 'canvas' );
      var newContext = newCanvas.getContext( '2d' );
      newContext.font = "Bold 20px Arial";
      newContext.fillStyle = "rgba(255, 255, 255, 0.8)";
      var message = data[i].message;
      textContents.push( message );
      newContext.fillText( message, 0, 50 );

      var newTexture = new THREE.Texture( newCanvas );
      newTexture.needsUpdate = true;

      var newMaterial = new THREE.MeshBasicMaterial( {
        map: newTexture,
        side: THREE.DoubleSide
      });
      newMaterial.transparent = true;
      var newGeometry = new THREE.PlaneGeometry( newCanvas.width, newCanvas.height );
      newGeometry.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI) );
      var newMesh = new THREE.Mesh(
        newGeometry, newMaterial );

      newMesh.position.x = 500 +  ( Math.random() * 500 );
      newMesh.position.z = 1450;
      newMesh.position.y = ( Math.random() * 50 ) + ( Math.random() * 100 );
      scene.add( newMesh );
    // textCount += 1;
    // console.log(textCount);
    // console.log(message);
  }
}
});
}






// GEOMETRY FUNCTIONS

function centralPark() {
  var xCoord = 1500;
  var zCoord = -2000;
  var centralParkGeometry = new THREE.Geometry();
  var geometry = new THREE.SphereGeometry( 50, 8, 8 );
  var material = new THREE.MeshPhongMaterial( {
    specular: 0x222222,
    color: 0x111111,
    emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.2, 0.9, Math.random() * 0.25 + 0.7 ),
    shininess: 100,
    overdraw: true
  });
  var sphere = new THREE.Mesh( geometry );
  for( i = 0; i < 50; i ++ ) {
    for( j = 0; j < 50; j ++) {
      sphere.position.y = 1;
      sphere.position.x = xCoord;
      sphere.position.z = zCoord;
      // sphere.receiveShadow = true;
      // sphere.castShadow = true;
      dancingGrass.push( sphere );
      xCoord += 100;
      THREE.GeometryUtils.merge( centralParkGeometry, sphere );
    }
    zCoord -= 100;
  }
  console.log("grass");
  var centralParkMesh = new THREE.Mesh( centralParkGeometry, material );
  scene.add( centralParkMesh );
}

function graffitiWall() {
  var geometry = new THREE.CubeGeometry( 800, 500, 10, 10 );
  var material = new THREE.MeshLambertMaterial( {
    specular: 0x222222,
    color: 0x000000,
    emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.8, 0.3, Math.random() * 0.25 + 0.2 ),
    overdraw: true
  } );
  wall = new Physijs.BoxMesh( geometry, material );
  wall.position.x = 1000;
  wall.position.y = 0;
  wall.position.z = 1500;
  scene.add( wall );
  allObjects.push( wall );
  console.log( "wall" );
}

function generateFloor() {
  // BASIC PLANE GEOMETRY
  var geometry = new THREE.PlaneGeometry( 4000, 4000, 200, 200 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2) );



 // OPTIONAL FLOOR PATTERN GENERATION
//  for( var i = 0; i < geometry.faces.length; i ++ ) {
//   var face = geometry.faces[i];
//   face.vertexColors[0] = new THREE.Color(Math.random() * 0x111111 );
//   face.vertexColors[1] = new THREE.Color().setHSL( Math.random() * 0.7 + 0.9, 0.3, Math.random() * 0.25 + 0.9 );
//   face.vertexColors[2] = new THREE.Color().setHSL( Math.random() * 0.7 + 0.9, 0.3, Math.random() * 0.25 + 0.9 );
// }

//  SECOND OPTION
// for( var i = 0; i < geometry.faces.length; i ++ ) {
//   var face = geometry.faces[i];
//   face.vertexColors[0] = new THREE.Color(Math.random() * 0x111111 );
//   face.vertexColors[1] = new THREE.Color(Math.random() * 0x111111 );
//   face.vertexColors[2] = new THREE.Color(Math.random() * 0x111111 );
// }
  // var material = new THREE.MeshBasicMaterial( { color: 0x222222, wireframe: true });

 // MATERIAL FOR BASIC PLANE
 var material = new THREE.MeshPhongMaterial( {
  specular: 0x222222,
  color: 0xffffff,
  emissive: 0x773366,
    // vertexColors: THREE.VertexColors,
    // wireframe: true,
    overdraw: true

  });

// MESH FOR BASIC PLANE
var mesh = new Physijs.PlaneMesh( geometry, material );
scene.add( mesh );


  // SQUARE PLANE GEOMETRY
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( - 500, 0, 0 ) );
  geometry.vertices.push(new THREE.Vector3( 500, 0, 0 ) );

  linesMaterial = new THREE.LineBasicMaterial( { color: 0x787878, opacity: 0.2, linewidth: 0.1 } );

  for ( var i = 0; i <= 200; i ++ ) {

    var line = new THREE.Line( geometry, linesMaterial );
    line.position.z = ( i * 50 ) - 2000;
    scene.add( line );

    var line = new THREE.Line( geometry, linesMaterial );
    line.position.x = ( i * 50 ) - 2000;
    line.rotation.y = 90 * Math.PI / 180;
    scene.add( line );
  }
}



function initParticles() {
  particleGroup = new ShaderParticleGroup({
    texture: THREE.ImageUtils.loadTexture('assets/particle.png'),
    maxAge: 2,
    blending: THREE.AdditiveBlending
  });

  emitter = new ShaderParticleEmitter({
    positionSpread: new THREE.Vector3( 2000, 1000, 2000 ),
    acceleration: new THREE.Vector3( 0, 0, 10 ),
    velocity: new THREE.Vector3( 0, 0, 10 ),
    colorStart: new THREE.Color( 'pink' ),
    colorEnd: new THREE.Color( 'white' ),
    size: 50,
    sizeEnd: 2,
    opacityStart: 0,
    opacityMiddle: 1,
    opacityEnd: 0,
    particlesPerSecond: 5000
  });

  particleGroup.addEmitter( emitter );
  scene.add( particleGroup.mesh );

}

function words( wordArray, locationPoints ) {

  for( i = 0; i < wordArray.length; i++ ) {
    var text = new THREE.TextGeometry( wordArray[i], {
      size: 50,
      height: 10,
      curveSegments: 2,
      font: "helvetiker",
      weight: "normal",
      style: 'normal'

    });
    text.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI / 2) );
    var textMaterial = new THREE.MeshLambertMaterial( {
      specular: 0x222222,
      color: 0x000000,
      emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.2, 0.9, Math.random() * 0.25 + 0.7 ),
      overdraw: true
    });
    var textObj = new Physijs.ConcaveMesh( text, textMaterial );
    var lat = locationPoints[i][0];
    var lng = locationPoints[i][1];
    var xCoord = ( ( lat - 40 ) * 10 ) + Math.floor( Math.random() * 1000 ) ;
    var zCoord = ( ( lng - 70 ) / Math.round( Math.random() * 10 ) ) + Math.floor( Math.random() * 1000 );
    textObj.position.x = xCoord;
    textObj.position.y = 400 + ( Math.random() * 200 );
    textObj.position.z = zCoord;
    scene.add( textObj );
    fallingTexts.push( textObj );
    allObjects.push( textObj );
  }

  // var text = new THREE.TextGeometry( "hi", {font: 'helvetiker', weight: 'normal', style: 'normal'});
  // var material = new THREE.MeshPhongMaterial({ color: 0xdddddd });
  // var textMesh = new THREE.Mesh( text, material );
  // scene.add( textMesh );
}


function dynamicBuildings( locationPoints ) {

  for( var i = 0; i < locationPoints.length; i ++ ) {
    var lat = locationPoints[i][0];
    var lng = locationPoints[i][1];
    var xCoord = ( ( lat - 40 ) * 10 ) + Math.floor( Math.random() * 1000 ) ;
    var zCoord = ( ( lng - 70 ) / Math.round( Math.random() * 10 ) ) + Math.floor( Math.random() * 1000 );
    addCube( xCoord, 125, zCoord );
    console.log(xCoord);
    console.log(zCoord);
  }
}

function addCube( x, y, z ) {
  var geometry = new THREE.CubeGeometry( 50, 100, 50, 1, 1 );
  // var material = new THREE.MeshPhongMaterial();


  for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

    var face = geometry.faces[ i ];
    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );

  }

  material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

  var cube = new Physijs.BoxMesh( geometry, material );
  cube.position.x = x;
  // cube.position.y = y;
  cube.position.z = z;
  movingObjects.push( cube );
  scene.add( cube );
  allObjects.push( cube );
}

function addBigSphere( x, y ) {
  var sphereGeom = new THREE.SphereGeometry(3000, 100, 100);
  sphereMaterial = new THREE.MeshPhongMaterial(
   {    specular: 0x222222,
    color: 0x000000,
    emissive: 0x888888,
    side: THREE.DoubleSide,
    // vertexColors: THREE.VertexColors,
    // wireframe: true,
    // shininess: 100,
    overdraw: true });
  bigSphere = new THREE.Mesh( sphereGeom, sphereMaterial );
  bigSphere.position.x = x;
  bigSphere.position.y = y;
  scene.add( bigSphere );
}

function addMirrorSphere( x, y ) {
    var sphereGeom =  new THREE.SphereGeometry( 50, 32, 16 ); // radius, segmentsWidth, segmentsHeight
    mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
  // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add( mirrorSphereCamera );
  var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
  mirrorSphere = new Physijs.SphereMesh( sphereGeom, mirrorSphereMaterial );
  mirrorSphere.position.set(x, y, 0);
  mirrorSphereCamera.position = mirrorSphere.position;
  scene.add(mirrorSphere);
  movingObjects.push( mirrorSphere );
}


function addMirrorCube( x, y ) {
  var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
  mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
  // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add( mirrorCubeCamera );
  var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
  mirrorCube = new Physijs.BoxMesh( cubeGeom, mirrorCubeMaterial );
  mirrorCube.position.set( x, y, 0 );
  mirrorCubeCamera.position = mirrorCube.position;
  scene.add(mirrorCube);
  movingObjects.push( mirrorCube );

}



function generateSpheres() {
  var sphereGeometry = new THREE.SphereGeometry(20);
  var sphere = new THREE.Mesh( sphereGeometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  sphere.position.x = xPos;
  sphere.position.y = yPos;
  sphere.position.z = zPos;

        // objects.push( sphere );
        scene.add( sphere );
        console.log("sphere");
        // renderer.render( scene, camera );
        // render();
        stats.update();
        xPos += (Math.sin(theta) * 400) + 500;
        yPos += Math.sin(theta) * 400;
        zPos -= Math.sin(theta) * 400;
        theta += 1;
      }

      var cursorX;
      var cursorY;
      document.onmousemove = function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
      };