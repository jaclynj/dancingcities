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

  // variables for loadAudioRequest()

  var source, sourceJs;
  var analyser;
  var buffer;
  // var url = 'meltdown.mp3';
  var array = [];
  var startTime;
  var songPlaying;
  var request;
  var currentSource;
  var url = 'https://api.soundcloud.com/tracks/118852333/stream?client_id=9907b9176ff3ca255b472d3d22a880bb';


// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock( true );
var movingObjects = [];
var bigObjects = [];

// mirror shape variables
var mirrorCube, mirrorCubeCamera; // for mirror material
var mirrorSphere, mirrorSphereCamera; // for mirror material


// particle shader variables
var emitter, particleGroup;

loadAudioRequest( url );

init();
initParticles();
animate();

// FUNCTIONS
function init()
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400);
  camera.lookAt(scene.position);

  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setClearColor( 0x000000 );
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,250,0);
  scene.add(light);

  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);


  // FLOOR
  // var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
  // floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  // floorTexture.repeat.set( 10, 10 );
  // var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side:THREE.BackSide } );
  // geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  // geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2) );

  // for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

  //   var vertex = geometry.vertices[ i ];
  //   vertex.x += Math.random() * 20 - 10;
  //   vertex.y += Math.random() * 2;
  //   vertex.z += Math.random() * 20 - 10;

  // }

  // for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

  //   var face = geometry.faces[ i ];
  //   face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.75 );
  //   face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.75 );
  //   face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.75 );

  // }

  // material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

  // mesh = new THREE.Mesh( geometry, material );
  // scene.add( mesh );
  // scene.add(floor);

 // creating sky sphere
 var skyboxGeom = new THREE.SphereGeometry( 1500, 100, 100 );
 var skyboxMaterial = new THREE.MeshPhongMaterial();
 var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
 scene.add(skybox);
 skyboxMaterial.side = THREE.DoubleSide;
 skyboxMaterial.map = THREE.ImageUtils.loadTexture('images/sky-and-cloud.jpg');

 // scene.add( skybox );


 // var raycaster = new THREE.Raycaster( )

  addMirrorCube(-150, 60);

  addMirrorSphere(150, 60);

  addBigSphere(3000, 0);

}

function animate()
{
  requestAnimationFrame( animate );
  render();
  update();
}

function update()
{
  // keyboard listeners
  if ( keyboard.pressed('down') ) {
    camera.position.z += 5;
    console.log("down");
  }
  if ( keyboard.pressed('up') ) {
    camera.position.z -= 5;
  }
  if ( keyboard.pressed('left') ) {
    camera.position.x -= 5;
  }
  if ( keyboard.pressed('right') ) {
    camera.position.x += 5;
  }
  if( array.length > 1 ){
  checkZoomOut();
  }
  controls.update();
  stats.update();
}

function render()
{
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



  // move the CubeCamera to the position of the object
  //    that has a reflective surface, "take a picture" in each direction
  //    and apply it to the surface.
  // need to hide surface before and after so that it does not
  //    "get in the way" of the camera
  mirrorCube.visible = false;
  mirrorCubeCamera.updateCubeMap( renderer, scene );
  mirrorCube.visible = true;

  mirrorSphere.visible = false;
  mirrorSphereCamera.updateCubeMap( renderer, scene );
  mirrorSphere.visible = true;
  renderer.render( scene, camera );
}

function initParticles() {
  particleGroup = new ShaderParticleGroup({
    texture: THREE.ImageUtils.loadTexture('images/particle.png'),
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

function dynamicBuildings( locationPoints, elevationPoints ) {

}


function addBigSphere( x, y ) {
  var sphereGeom = new THREE.SphereGeometry(1500, 100, 100);
  var sphereMaterial = new THREE.MeshPhongMaterial();
  var sphere = new THREE.Mesh( sphereGeom, sphereMaterial );
  sphere.position.x = x;
  sphere.position.y = y;
  scene.add( sphere );
}

function addMirrorCube( x, y ) {
  var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
  mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
  // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add( mirrorCubeCamera );
  var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
  mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
  mirrorCube.position.set( x, y, 0 );
  mirrorCubeCamera.position = mirrorCube.position;
  scene.add(mirrorCube);
  movingObjects.push( mirrorCube );
}

function addMirrorSphere( x, y ) {
    var sphereGeom =  new THREE.SphereGeometry( 50, 32, 16 ); // radius, segmentsWidth, segmentsHeight
    mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
  // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add( mirrorSphereCamera );
  var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
  mirrorSphere = new THREE.Mesh( sphereGeom, mirrorSphereMaterial );
  mirrorSphere.position.set(x, y, 0);
  mirrorSphereCamera.position = mirrorSphere.position;
  scene.add(mirrorSphere);
  movingObjects.push( mirrorSphere );
}

function checkZoomOut(){
  // console.log(camera.position.z);
  if( camera.position.z < -2000 || camera.position.z > 2000 ) {
    if(songPlaying){
      currentSource.stop();
      songPlaying = false;
      console.log("hi");
    }
  }
  if( !songPlaying ){
    if( camera.position.z > -2000 && camera.position.z < 2000 ) {
      // console.log("i'm working but i shouldnt");
      // loadAudioRequest( url );
      var source2 = context.createBufferSource();
      source2.buffer = source.buffer;
      source2.connect(context.destination);
      // debugger;
      source2.start(0);
      currentSource = source2;
      songPlaying = true;
      clock = new THREE.Clock( true );
    }
  }
}

function loadAudioRequest( url ) {
  request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  request.send();

  request.onload = loadAudioBuffer;
}
// function timeCheck() {
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



