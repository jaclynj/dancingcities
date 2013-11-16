// By Morgan Neiman and Jaclyn Jimenez, with many thanks to Mr. Doob and Lee Stemkoski for their extensive work with Three.js


// LOAD WEB AUDIO CONTEXT FOR WEB AUDIO API
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
    alert("Web Audio API is not supported in this browser - Sorry, but Dancing Cities won't work for you :( Have you considered Chrome?");
  }

  // WEB AUDIO API VARIABLES
  var source;
  var sourceJs;
  var analyser;
  var buffer;
  var array = [];
  var startTime;
  var songPlaying;
  var request;
  var currentSource;
  var url = 'https://api.soundcloud.com/tracks/120220655/stream?client_id=9907b9176ff3ca255b472d3d22a880bb';


// STANDARD THREE VARIABLES
var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();
var timeElapsed = 0;
var clock;

// ALL OBJECTS THAT MOVE TO THE MUSIC
var movingObjects = [];
var allBuildingMesh;

// ARRAY FOR RAYCASTER COLLISION DETECTION
var allObjects = [];

// BIG SPHERE (SKY)
var bigSphere, sphereMaterial;
var d = new Date();
var startTime = d.getHours();
var weatherCode = 100;
var weatherUpdated = false;
var rainTexture = THREE.ImageUtils.loadTexture('assets/rain.jpg');
var snowTexture = THREE.ImageUtils.loadTexture('assets/snowskyreal.jpg');
var nightTexture = THREE.ImageUtils.loadTexture('assets/Snowscatter.jpg');
var sunTexture = THREE.ImageUtils.loadTexture('assets/clouds_COLOR.png');
var angleOfRotation = 0;

// MIRROR EFFECT VARIABLES
var mirrorCube, mirrorCubeCamera;
var mirrorSphere, mirrorSphereCamera;

// PARTICLE GENERATOR OBJECTS
var emitter, particleGroup;

// FALLING TEXT OBJECTS & VARIABLES
var fallingTexts = [];
var tweetArray = [];
var wordPos = 0;
var tweetsGenerated;
var allTextMesh;

// COUNTING OBJECTS TOUCHED
var objectsTouched = 0;

// GRAFFITI WALL VARIABLES
var wall;
var messageLeft = false;
var leavingMessage = false;
var userMessage = "";
var lastPress = Date.now();
var textCount = 0;
var sendAjax = true;
var textContents = [];

// TIME BASED STUFF
var endingLight = false;
var endingLightAmbient;

// CENTRAL PARK VARIABLES
var dancingGrass = [];
var centralParkMesh;

// USER VARIABLES IF LOGGED IN
var userName;
var userImage= "http://pbs.twimg.com/profile_images/378800000490486404/abf4774fdb37f08ee36f5918c7bf2e1c_normal.jpeg";
var userTexture;

// USER COORDINATES
var userLat = 40.737925;
var userLng = -73.981683;

// CHECKS IF USER CONTENT HAS BEEN GENERATED ALREADY
var userContent = false;
var customUserGraphics = false;

// MESSAGES TO USER
var messageToUser = ["Welcome to New York, ", "New York loves you, ", "You look beautiful today, ", "Love is in the air, ", "This city never sleeps, ", "Take my hand, ", "You're going to love this town, ", "Do you know your favorite city yet, ", "So glad you're here, ", "Nothing like concrete and skyscrapers, "];
var allUserMessages = [];

// COORDINATES - PLACEHOLDER
var coordinates = [[40.740084,-73.990115], [40.736698,-73.990164], [40.736706,-74.001249], [40.748379,-74.000112], [40.749955,-73.988549], [40.754734,-73.987922], [40.754734,-73.987922], [40.758635,-73.977452], [40.76538,-73.979727], [40.768029,-73.981937], [40.763771,-73.976368], [40.761691,-73.970693], [40.755953,-73.972816], [40.752154,-73.977782], [40.745111,-73.984687], [40.737925,-73.981683], [40.740835,-73.99185] ];

var newYorkImages = [
THREE.ImageUtils.loadTexture('assets/statueofliberty.jpg'),
THREE.ImageUtils.loadTexture('assets/taxis.jpg'),
THREE.ImageUtils.loadTexture('assets/Certainty.jpg'),
THREE.ImageUtils.loadTexture('assets/drawing.jpg'),
THREE.ImageUtils.loadTexture('assets/linedrawing.jpg'),
THREE.ImageUtils.loadTexture('assets/newyorker.jpg'),
THREE.ImageUtils.loadTexture('assets/0698-cartoon-city.jpg'),
THREE.ImageUtils.loadTexture('assets/0720-new-york-cartoon-background.jpg'),
THREE.ImageUtils.loadTexture('assets/cartoon-map-new-york.jpg'),
THREE.ImageUtils.loadTexture('assets/new-york-cartoon-map.jpg'),
userTexture
];
var allNewYork;
// COORDINATES - FOURSQUARE
var placesArray = [];

// SPINNY THING
var spinnyThing;
var spinnyThing2;

var testWords = ["new york city", "#i love this town", "beautiful", "lol"];

// RAYCASTERS - NOT OPTIMIZED
var ray;
var xray;
var zray;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var startMenu = document.getElementById( 'start-menu' );
var startButton = document.getElementById( 'start-button' );
var endMenu = document.getElementById( 'end-menu' );
blocker.style.display = 'none';
instructions.style.display = 'none';
endMenu.style.display = 'none';
startMenu.style.display = '';




      // POINTERLOCK CODE
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

        };

        var pointerlockerror = function ( event ) {

          instructions.style.display = '';

        };

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

endMenu.addEventListener( 'click', function ( event ) {

  endMenu.style.display = 'none';

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

startButton.addEventListener( 'click', function ( event ) {

  startMenu.style.display = 'none';

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


// // PREVENT BACKSPACE FROM GOING BACK
$(document).on("keydown", function (e) {
  if (e.which === 8) {
    if (leavingMessage === true) {
      e.preventDefault();
      console.log("i'm getting here");
      var c = userMessage[userMessage.length - 1];
      userMessage = userMessage.substring( 0, userMessage.length - 1 );
      $( "#user-input").replaceWith("<div id = 'user-input'>" + $( "#user-input:last-child").text().slice(0, -1) + "</div>");
      lastPress = thisPress;
    } else {
      e.preventDefault();
    }
  }
});

// // Prevent the backspace key from navigating back.
// $(document).unbind('keydown').bind('keydown', function (event) {
//     var doPrevent = false;
//     if (event.keyCode === 8) {
//         var d = event.srcElement || event.target;
//         if (d.className === 'user-input') {
//             ('#user-input').lastChild
//         }
//         else {
//             doPrevent = true;
//         }
//     }

//     if (doPrevent) {
//         event.preventDefault();
//     }
// });

if( !Detector.webgl ) {
  alert( "Sorry, but your browser doesn't support WebGL. Dancing cities won't work without WebGL - please try Chrome or Firefox!");
}

getUserLocation();

// LOAD AUDIO
loadAudioRequest( url );

// GET GEODATA
dynamicGrabFoursquare( userLat, userLng );
dynamicGrabFoursquare(40.740084,-73.990115);

getWeatherCode();

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
renderer.sortObjects = false;
renderer.sortElements = false;
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
scene = new THREE.Scene();
// scene = new Physijs.Scene;

// FOG OPTIONS
// scene.fog = new THREE.Fog( 0xff5588, 0, 2000 );
// scene.fog = new THREE.FogExp2( 0xff5566, 0.0015 );
// scene.fog = new THREE.FogExp2( 0x88888888, 0.0015 );


// ADD LIGHTS
var light = new THREE.DirectionalLight( 0x888888, 1.5 );
light.position.set( 1, 1, 1 );
scene.add( light );

// var light2 = new THREE.DirectionalLight( 0x888888, 0.75 );
// light2.position.set( -1, - 0.5, -1 );
// scene.add( light2 );

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
// addMirrorCube( 0, 400 );


// words();
graffitiWall();
centralPark();
// generateUserContent();
generateNewYorkShapes();

optimizedDynamicBuildings( placesArray );

// GET TWEETS BASED ON HASHTAG AND LOCATION
$.ajax({
  type: "GET",
  url: '/tweets.json',
  async: false
}).done( function( data ) {
  tweetArray = data;
  words( tweetArray, coordinates );
});

// UPDATE WEATHER MAP
// updateWeather( weatherCode );
}

function animate() {

  requestAnimationFrame( animate );

  controlCheck();
  detectCollision();
  stats.update();
  render();

}

function render() {

  if( clock !== undefined ) {
    timeElapsed = clock.getElapsedTime();
  }

  if( timeElapsed < 1 && !customUserGraphics ){
    checkLoggedIn();

    if( userContent ){
      getUserData();
    }
  }

    // animate all shapes in "movingObjects" array based on song
    var k = 0;
    for( var i = 0; i < movingObjects.length; i++ ) {
      var scale = ( array[k] ) / 80;
      var rand = Math.floor(Math.random() * 10);
      centralParkMesh.material.emissive.setRGB( array[k]/100, array[k]/100, array[k]/500 );
      if( rand % 3 === 0 ){
        movingObjects[i].scale.y = ( scale < 1 ? 1 : scale );
        allBuildingMesh.scale.y = ( scale < 1 ?  1 : scale );
      }
      else if ( rand % 2 === 0 ) {
        movingObjects[i].scale.z = ( scale < 1 ? 1 : scale );
        allBuildingMesh.scale.y = ( scale < 1 ?  1 : scale );
      }
      else {
        movingObjects[i].scale.x = ( scale < 1 ? 1 : scale );
        allBuildingMesh.scale.y = ( scale < 1 ?  1 : scale );

        // movingObjects[i].geometry.vertices[3].y = array[k];
      }
      movingObjects[i].geometry.verticesNeedUpdate = true;
      k += ( k < array.length? 1 : 0 );
    }

    if( timeElapsed > 244 ) {
      var endMenu = document.getElementById('end-menu');
      var instructions = document.getElementById('instructions');
      endMenu.style.display = "";
      blocker.style.display = 'none';

    }

    var j = 0;
    if( timeElapsed > 115 ) {
      for( var i = 0; i < dancingGrass.length; i++ ){
        var scale = ( array[j] / 100 );
        centralParkMesh.scale.y = ( scale < 0.6 ? 0.6 : scale );
        j += ( j < array.length? 1 : 0 );
      }
    }


      // if( timeElapsed > 130 && userMesh2 !== undefined ){

      // }


  // time event to begin particles
  if( timeElapsed > 35 && timeElapsed < 120 ) {
    particleGroup.tick( array[k] / 1000);
    // console.log("should be working");
  }
  if( timeElapsed > 105 ) {
    particleGroup.tick( array[k] / 500 );
  }
  // if ( ( timeElapsed > 60 ) && ((( Math.round( timeElapsed * 10 ) % 100 === 0 )))) {
  //   words( tweetArray, coordinates );
  // }

  // if( (timeElapsed > 60 ) && !tweetsGenerated ){
  //   words( tweetArray, coordinates );
  // }

  if( Math.round( timeElapsed * 30 ) % 300 === 0 ) {
    updateWall();

  }

  if( timeElapsed > 30 && customUserGraphics ) {
    if( Math.floor( timeElapsed * 10 ) % 100 === 0 ) {
      generateUserContent();
      animateUserContent();
    }
  }

  if( timeElapsed > 163 && !endingLight ) {
    generateEndingLight();
    bigSphere.material.map = nightTexture;
    bigSphere.material.needsUpdate = true;
  }
  if( timeElapsed > 163 && endingLight && ( array[k] % 2 === 0 ) ) {
    flashEndingLight();
  }

  if( weatherCode !== 100 && !weatherUpdated ) {
    updateWeather( weatherCode );
    weatherUpdated = true;
  }

  if( timeElapsed > 83 && Math.floor( timeElapsed % 5 ) === 0 ) {
    allBuildingMesh.material.emissive.setHex( array[j] * 0x772252 );
  }

  if( timeElapsed > 99 && timeElapsed < 115) {
    allNewYork.rotateZ( angleOfRotation );
    for( var j = 0; j < allNewYork.geometry.vertices.length; j ++ ) {
    // if( j % 3 === 0 ){

      allNewYork.geometry.vertices[j].y += 0.1 ;
    // }
    // else {
    //   allNewYork.geometry.vertices[j].y -=5 ;
    // }
        // fallingTexts[i].position.y -= 2;
      }
      allNewYork.geometry.verticesNeedUpdate = true;
    }

    if( timeElapsed > 115 ) {
      scene.remove( allNewYork );
    }

  // var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ) , angleOfRotation) ;
  // bigSphere.rotation.setEulerFromQuaternion( quaternion );
  bigSphere.rotateY( angleOfRotation );

  if( spinnyThing !== undefined ) {

    spinnyThing.rotateY( angleOfRotation );
  }

  if( spinnyThing2 !== undefined ){
    spinnyThing2.rotateZ( angleOfRotation );
  }
  angleOfRotation += 0.00001;


  takeMirrorSnapshot();

  if( timeElapsed > 50 ){
    fallingWords();
  }

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
  // else return;

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
    else if( intersects[0].object == allNewYork ) {
      allNewYork.material.map = newYorkImages[ Math.floor( Math.random() * 10 ) ];
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

  leavingMessage = true;
  controls.blockJump( true );
  thisPress = Date.now();
  e.preventDefault();
  var keycode = (e.keyCode ? e.keyCode : e.which );
  console.log( keycode );
  if( keycode == '13' ) {
    messageLeft = true;
    leavingMessage = false;
    // $( '#graffiti-form' ).css( "display", "none" );
    $( '#graffiti-form' ).fadeOut(400);
    $( document.body ).off( "keypress", leaveAMessage );
    controls.blockJump( false );
    unlockAllDirection();
    if ( sendAjax ) {
      $.ajax({
        type: "POST",
        data: {message: {message: userMessage}},
        url: '/messages.json'
      }).done( function() {
        updateWall();
      });
      sendAjax = false;
    }
  }
  else if( keycode == '8' ) {
    console.log("i'm getting here");
    var c = userMessage[userMessage.length - 1];
    userMessage = userMessage.substring( 0, userMessage.length - 1 );
    $( "#user-input").replaceWith("<div id = 'user-input'>" + $( "#user-input:last-child").text().slice(0, -1) + "</div>");
    lastPress = thisPress;
  }
  else {
    controls.lockMoveRight( true );
    controls.lockMoveLeft( true );
    controls.lockMoveBackward( true );
    controls.lockMoveForward( true );
    var c = String.fromCharCode( e.which );
    if( (thisPress - lastPress) > 30 ) {
      userMessage += c;
      $( '#user-input').append(c).fadeIn(200);
      console.log(userMessage);
      lastPress = thisPress;
    }
// record each keystroke as part of a variable, message
}
}

function getUserLocation() {
  if( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition( function( position ){
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      if( lat < 41 && lat > 40 && lng < -70 && lng > -74 ) {
        userLat = lat;
        userLng = lng;
        alert("Looks like you're in NYC. Lucky you. Generating a city based on your precise coordinates.");
      }
      else {
        alert("Looks like you're not in NYC. What a shame. Generating a city based on NYC coordinates.");
      }
    });
  }
  else {
    alert("Looks like we can't get your geolocation. What a shame. Generating a city based on NYC coordinates.");
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
      // debugger;
      // intersections[0].object.material.color.setHex( 0x64f544 );
      // intersections[0].object.material.needsUpdate = true;
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

// GRAB FOURSQUARE GEODATA

function dynamicGrabFoursquare(lat, lng) {
  //example: var lat = 40.7; var lng = -74
  places = $.ajax({
    type: "GET",
    url: "https://api.foursquare.com/v2/venues/explore?ll=" + lat + "," + lng + "&section=topPicks&limit=50&oauth_token=K4UCTP1LAKJNTMLHCF4ZGITHNAV1344HNO3BATADR0LFLVGI",
    async: false
  });
// debugger;
var parsedResponse = JSON.parse(places.responseText);
var locations = parsedResponse.response.groups[0].items;
for( var i = 0; i < locations.length; i++ ) {
  var place = [];
  var longitude = locations[i].venue.location.lng;
  var latitude = locations[i].venue.location.lat;
  var name = locations[i].venue.name;
  place.push( latitude, longitude, name );
  placesArray.push( place );
}
console.log( placesArray );
    // optimizedDynamicBuildings( placesArray );
  // });
}



function grabFoursquare() {
 places = $.ajax({
  type: "GET",
  url: "https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&section=topPicks&limit=50&oauth_token=K4UCTP1LAKJNTMLHCF4ZGITHNAV1344HNO3BATADR0LFLVGI",
  async: false
});
 // debugger;
 var locations = places.responseJSON.response.groups[0].items;
 for( var i = 0; i < locations.length; i++ ) {
  var place = [];
  var lng = locations[i].venue.location.lng;
  var lat = locations[i].venue.location.lat;
  var name = locations[i].venue.name;
  place.push( lat, lng, name );
  placesArray.push( place );

  console.log( placesArray );
    // optimizedDynamicBuildings( placesArray );
  // });
}
}

function getWeatherCode(){

  var weather = $.ajax({
    url: "http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%2710001%27&format=json",
    dataType: "jsonp",
    contentType: "application/json; charset=utf-8"
  }).done( function() {
    // debugger;
    var weatherCodeString = weather.responseJSON.query.results.channel.item.condition.code;
    weatherCode = parseInt( weatherCodeString, 10 );
    console.log(" hey i'm working at least ");
  });

}

// LOAD AUDIO REQUEST TO/FROM SOUNDCLOUD API

function loadAudioRequest( url ) {
  // GENERATE LOADING SCREEN
  // var loadingAnimation = document.createElement('div');
  // loadingAnimation.id = "loading-animation";
  // loadingAnimation.textContent = "Loading your city...";
  // document.body.appendChild( loadingAnimation );



  request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  request.send();

  // do {
  //   $('#loading-animation').fadeIn(100);
  //   $('#loading-animation').fadeOut(100);
  // } while( request.readyState !== 4 );

  request.onload = loadAudioBuffer;
}

//  LOAD AUDIO BUFFER IN WEB AUDIO API

function loadAudioBuffer() {
  clock = new THREE.Clock( true );
  $('#loading-animation').fadeOut(200);
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

function generateNewYorkShapes() {
  var allGeometry = new THREE.Geometry();
  for( var i = 0; i < 200; i++ ) {
    var geometry = new THREE.SphereGeometry( 10 );
    var material = new THREE.MeshPhongMaterial( {
      map: newYorkImages[i % 10]
    });
    var smallMesh = new THREE.Mesh( geometry, material );
    if( i % 2 === 0 ) {
      smallMesh.position.z = Math.random() * 650;
      smallMesh.position.x = Math.random() * 1000;
      smallMesh.position.y = Math.random() * 200 + 20;
    }
    else if( i % 3 === 0 ) {
      smallMesh.position.x = -Math.random() * 1000;
      smallMesh.position.z = -Math.random() * 1000;
      smallMesh.position.y = Math.random() * 200;
    }
    else {
      smallMesh.position.x = -Math.random() * 1000;
      smallMesh.position.z = Math.random() * 1000;
      smallMesh.position.y = Math.random() * 200;
    }
    THREE.GeometryUtils.merge( allGeometry, smallMesh );
  }
  allNewYork = new THREE.Mesh( allGeometry,
    new THREE.MeshLambertMaterial({
      map: newYorkImages[4]
    }));
  scene.add( allNewYork );
  allObjects.push( allNewYork );
  // movingObjects.push( allNewYork );
}

// UPDATE FUNCTIONS

function flashEndingLight() {
  endingLightAmbient.material.emissive.setHex( Math.random() * 0xffffff );

}

// function fallingWords() {
//   var timeElapsed = clock.getElapsedTime();
//   if ( timeElapsed < 120 ) {
//     for( var i = 0; i < fallingTexts.length; i++ ) {
//       if( fallingTexts[i].position.y > -10 ) {
//         for( var j = 0; j < fallingTexts[i].geometry.vertices.length; j ++ ) {
//           fallingTexts[i].geometry.vertices[j].y -= 2;
//         }
//         // fallingTexts[i].position.y -= 2;
//         fallingTexts[i].geometry.verticesNeedUpdate = true;
//       }
//       else {
//         scene.remove( fallingTexts[i] );
//       }
//     }
//   }
//   else if ( timeElapsed > 120 ) {
//     for( var i = 0; i < fallingTexts.length; i++ ) {
//       if( fallingTexts[i].position.y > 0 ) {
//         for( var j = 0; j < fallingTexts[i].geometry.vertices.length; j ++ ) {
//           fallingTexts[i].geometry.vertices[j].y -= 2;
//         }
//         // fallingTexts[i].position.y -= 2;
//         fallingTexts[i].geometry.verticesNeedUpdate = true;
//       }
//     }

//   }
// }

function fallingWords() {
  for( i = 0; i < allTextMesh.geometry.vertices.length; i++ ) {

    allTextMesh.geometry.vertices[i].y -= 5;
  }
  allTextMesh.geometry.verticesNeedUpdate = true;
}

function takeMirrorSnapshot() {
  // mirrorCube.visible = false;
  // mirrorCubeCamera.updateCubeMap( renderer, scene );
  // mirrorCube.visible = true;

  mirrorSphere.visible = false;
  mirrorSphereCamera.updateCubeMap( renderer, scene );
  mirrorSphere.visible = true;
}

function updateWeather( weatherCode ) {

  if( ( weatherCode < 13 && weatherCode !== 7) || weatherCode ===  17 || weatherCode === 35 || ( weatherCode > 36 && weatherCode <= 40 )  ) {
// RAIN
bigSphere.material.map = rainTexture;
bigSphere.material.needsUpdate = true;
}
else if( weatherCode === 7 || ( weatherCode > 12 && weatherCode <= 18) || ( weatherCode > 40 && weatherCode < 44) || weatherCode === 46 ){
    // SNOW
    bigSphere.material.map = snowTexture;
    bigSphere.material.needsUpdate = true;
  }
  else if( weatherCode === 27 || weatherCode === 29 || weatherCode === 31 || weatherCode === 33 ) {
    // NIGHT
    bigSphere.material.map = nightTexture;
    bigSphere.material.needsUpdate = true;
  }
  else {
    // CLEAR
    bigSphere.material.map = sunTexture;
    bigSphere.material.needsUpdate = true;
  }
}

function updateTime() {

}

function animateUserContent() {
  for( var i = 0; i < allUserMessages.length / 2; i++ ){
    var message = allUserMessages[i];
    scene.remove( message );

  }
  allUserMessages.splice( 0, allUserMessages.length / 2 );
}

function checkLoggedIn() {
  $.ajax({ 
    type: "GET", 
    url: '/checker.json' 
  }).done( function( data ) {
    if( data.session == "true" ) {
      userContent = true;
    }
    else {
      generateSpinnyThing();
    }
  })
}

function getUserData() {
  $.ajax({
    type: "GET",
    url: '/current_user.json'
  }).done( function( data ) {
    if ( data !== null ){
      userName = data.name;
      userImageURL = data.image;
      customUserGraphics = true;
      userContent = false;
      // debugger;
      getUserPicture( userImageURL );
    }
  })
}

function utf8_to_b64( str ) {
  return window.btoa(encodeURIComponent( str ));
}

function getUserPicture( URL ) {
  $.ajax({
    type: "GET",
    url: "/convert?image_url=" + URL
  }).done( function( data ) {
    // userImage = THREE.ImageUtils.loadTexture( data );
    // userImageSpheres();
    var canvas = document.createElement('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    var context = canvas.getContext('2d');
    var imgSrc = "data:image/png;base64, " + data;
    var threeImage = document.createElement('img');
    threeImage.src = imgSrc;
    // threeImage.width = 128;
    userTexture = new THREE.Texture( threeImage );

    threeImage.onload = function() {
      // var pattern = context.createPattern( this, "repeat" );
      // context.fillStyle = pattern;
      // context.rect(0, 0, 100, 100);
      // context.fill();
      userTexture.needsUpdate = true;
    }
    userImageSpinny();
  });
}

function userImageSpinny() {
  var geometry = new THREE.CircleGeometry( 50, 100 );
  var material = new THREE.MeshLambertMaterial({
    map: userTexture,
    overdraw: true,
    side: THREE.DoubleSide
  });
  spinnyThing = new THREE.Mesh( geometry, material );
  spinnyThing.position.y = 200;
  spinnyThing.position.z = -600
  spinnyThing.position.x = -20;
  scene.add( spinnyThing );
}

// function userImageSpheres() {
//   var geometry =  new THREE.CircleGeometry( 10 );
//   geometry.applyMatrix( new THREE.Matrix4().makeRotationX(  Math.PI / 2) );
//   var material = new THREE.MeshLambertMaterial({
//     map: userTexture,
//     overdraw: true,
//     side: THREE.DoubleSide
//   });
//   var bigGeometry1 = new THREE.Geometry();
//   var circle = new THREE.Mesh( geometry );
//   // material.transparent = true;
//   for( var i = 0; i < 50; i ++ ) {

//     circle.position.z = Math.random() * -500;
//     circle.position.x = Math.random() * 500;
//     circle.position.y = 2000;
//     THREE.GeometryUtils.merge(bigGeometry1, circle);
//   }

//   userMesh1 = new THREE.Mesh( bigGeometry1, material );

//   scene.add( userMesh1 );
//   console.log("sphere");
// }

function generateUserContent() {
  var direction = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
  var i = Math.floor( Math.random() * 10 );
  var str = messageToUser[i] + userName;
  var userMessageGeometry = new THREE.Geometry();
  var newCanvas = document.createElement( 'canvas' );
  newCanvas.height = window.innerHeight;
  newCanvas.width = window.innerWidth;
  var newContext = newCanvas.getContext( '2d' );
  newContext.font = "Bold 20px Arial";
  newContext.fillStyle = "rgba(180, 0, 180, 0.5)";
  newContext.fillText( str, 0, 50 );

  var newTexture = new THREE.Texture( newCanvas );
  newTexture.needsUpdate = true;

  var newMaterial = new THREE.MeshBasicMaterial( {
    map: newTexture,
    side: THREE.DoubleSide
  });
  newMaterial.transparent = true;
  var newGeometry = new THREE.PlaneGeometry( newCanvas.width, newCanvas.height );
  newGeometry.applyMatrix( new THREE.Matrix4().makeRotationY(  Math.PI / 6) );
  var newMesh = new THREE.Mesh(
    newGeometry );
  for( var i = 0; i < 20; i ++ ){
    // newGeometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -Math.PI/ 4 ) );
      // newGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/ 4 ) );

      newMesh.position.x = direction.x + 400 * Math.random();
      newMesh.position.z =  direction.z - 500 * Math.random();
      newMesh.position.y = direction.y - 200 * Math.random();
      THREE.GeometryUtils.merge( userMessageGeometry, newMesh );

    }
    var userMessageMesh = new THREE.Mesh( userMessageGeometry, newMaterial );
    scene.add( userMessageMesh );
    allUserMessages.push( userMessageMesh );

  }

  function updateWall() {
   $.ajax({
    type: "GET",
    url: '/messages.json'
  }).done(function(data) {
    var i = data.length;
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

        newMesh.position.x = 1100 - ( Math.random() * 400 );
        newMesh.position.z = 690;
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

function generateEndingLight() {
  var geometry =   new THREE.CylinderGeometry( 20, 20, 1000 );
  var cylinderMesh = new THREE.Mesh( geometry );
  var material = new THREE.MeshPhongMaterial({
    opacity: 0.25,
    transparent: true,
    shininess: 0,
    ambient: 0xffffff,
    emissive: 0xffffff
  });
  var endingLightGeom = new THREE.Geometry();

  for( var i = 0; i < 2000; i++ ) {
    var xCoord, zCoord;
    if ( i % 2 === 0 ) {
      var xCoord = ( Math.random() * 1000 );
      var zCoord = ( Math.random() * 600 );
    }
    else if ( i % 3 === 0 ) {
      var xCoord = ( -Math.random() * 1000 );
      var zCoord = ( Math.random() * 1000 );
    }
    else if ( i % 5 === 0 ) {
      var xCoord = ( Math.random() * 1000 );
      var zCoord = ( -Math.random() * 1000 );
    }
    else {
      var xCoord = ( -Math.random() * 1000 );
      var zCoord = ( -Math.random() * 1000 );
    }

    cylinderMesh.position.x = xCoord;
    cylinderMesh.position.z = zCoord;
    THREE.GeometryUtils.merge( endingLightGeom, cylinderMesh );
  }
  endingLightAmbient = new THREE.Mesh( endingLightGeom, material );
  scene.add( endingLightAmbient );
  endingLight = true;
}

function centralPark() {
  var xCoord = -1000;
  var zCoord = -500;
  var centralParkGeometry = new THREE.Geometry();
  var geometry = new THREE.SphereGeometry( 50, 8, 8 );
  geometry.dynamic = true;
  var material = new THREE.MeshPhongMaterial( {
    specular: 0x222222,
    color: 0x111111,
    emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.6, 0.9, Math.random() * 0.25 + 0.7 ),
    shininess: 100,
    overdraw: true
  });
  var sphere = new THREE.Mesh( geometry );
  sphere.dynamic = true;
  for( var i = 0; i < 8; i ++ ) {
    for( var j = 0; j < 8; j ++) {
      sphere.position.y = 1;
      sphere.position.x = xCoord;
      sphere.position.z = zCoord;
      // sphere.receiveShadow = true;
      // sphere.castShadow = true;
      dancingGrass.push( sphere );
      allObjects.push( sphere );
      xCoord += 100;
      THREE.GeometryUtils.merge( centralParkGeometry, sphere );
    }
    zCoord += 100;
    xCoord = -1000;
  }
  console.log("grass");
  centralParkMesh = new THREE.Mesh( centralParkGeometry, material );
  scene.add( centralParkMesh );
  allObjects.push( centralParkMesh );
  // movingObjects.push( centralParkMesh );
}

function graffitiWall() {
  var geometry = new THREE.CubeGeometry( 800, 500, 10, 10 );
  var material = new THREE.MeshLambertMaterial( {
    specular: 0x222222,
    color: 0x000000,
    emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.8, 0.3, Math.random() * 0.25 + 0.2 ),
    map: newYorkImages[1],
    overdraw: true
  } );
  wall = new THREE.Mesh( geometry, material );
  wall.position.x = 900;
  wall.position.y = 0;
  wall.position.z = 700;
  scene.add( wall );
  allObjects.push( wall );
  console.log( "wall" );
}

function generateFloor() {
  // BASIC PLANE GEOMETRY
  var geometry = new THREE.PlaneGeometry( 2500, 2500, 200, 200 );
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
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

var wireframeGeometry = new THREE.PlaneGeometry( 2000, 2000, 200, 200 );
wireframeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2) );

var wireframeMaterial = new THREE.MeshBasicMaterial({
  wireframe: true
});
var mesh2 = new THREE.Mesh( wireframeGeometry, wireframeMaterial );
mesh2.position.y = 1;

scene.add( mesh2 );


  // // SQUARE PLANE GEOMETRY
  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(new THREE.Vector3( 1000, 0, 0 ) );
  // geometry.vertices.push(new THREE.Vector3( -1000, 0, 0 ) );

  // linesMaterial = new THREE.LineBasicMaterial( { color: 0x787878, opacity: 0.2, linewidth: 0.1 } );

  // for ( var i = 0; i <= 20; i ++ ) {

  //   var line = new THREE.Line( geometry, linesMaterial );
  //   line.position.z = ( i * 50 ) - 1000;
  //   scene.add( line );

  //   var line = new THREE.Line( geometry, linesMaterial );
  //   line.position.x = ( i * 50 ) - 1000;
  //   line.rotation.y = 90 * Math.PI / 180;
  //   scene.add( line );
  // }
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
    colorEnd: new THREE.Color( 'pink' ),
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

// function optimizedWords( wordArray, locationPoints ) {
//   var wordPosAtStart = wordPos;
//   var textGeometry
// }

function words( wordArray, locationPoints ) {
  // debugger;
  // var wordPosAtStart = wordPos;
  var textGeometry = new THREE.Geometry();
  textGeometry.dynamic = true;
  var textMaterial = new THREE.MeshLambertMaterial( {
    specular: 0x222222,
    color: 0x000000,
    emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.2, 0.9, Math.random() * 0.25 + 0.7 ),
    overdraw: true
  });
  for( var i = 0; i < wordArray.length ; i++ ) {

    if( locationPoints[i] !== undefined && wordArray[i] !== undefined ) {

      var text = new THREE.TextGeometry( wordArray[i], {
        size: 50,
        height: 10,
        curveSegments: 1,
        font: "helvetiker",
        weight: "normal",
        style: 'normal'

      });
      var textMesh = new THREE.Mesh( text );
      text.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI / 2) );
      text.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.random() * Math.PI / 2) );
      var lat = locationPoints[i][0];
      var lng = locationPoints[i][1];
      var xCoord = ( ( lat - 40 ) * 10 ) + Math.floor( Math.random() * 1000 ) ;
      var zCoord = ( ( lng - 70 ) / Math.round( Math.random() * 10 ) ) + Math.floor( Math.random() * 1000 );
      textMesh.position.x = xCoord;
      textMesh.position.y = 5000 + ( i * 1000);
      textMesh.position.z = zCoord;
    // scene.add( textObj );
    // fallingTexts.push( textMesh );
    allObjects.push( textMesh );
    THREE.GeometryUtils.merge( textGeometry, textMesh );
  }

}

allTextMesh = new THREE.Mesh( textGeometry, textMaterial );
scene.add( allTextMesh );
console.log("words");
// fallingTexts.push( allTextMesh );
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

function optimizedDynamicBuildings( locationPoints ) {
  // debugger;
  if( placesArray.length < 40 ) {
    dynamicGrabFoursquare(40.72, -73.85);
    dynamicGrabFoursquare(40.76538,-73.979727);
  }
  var geometry = new THREE.CubeGeometry( 50, 100, 50, 1, 1 );
  geometry.dynamic = true;
  var buildingGeometry = new THREE.Geometry();
  var cube = new THREE.Mesh( geometry );
  cube.dynamic = true;

  for( var i = 0; i < locationPoints.length; i++ ) {
    var textGeom = new THREE.TextGeometry( locationPoints[i][2],
    {
      size: 10,
      height: 2,
      curveSegments: 1,
      font: "helvetiker",
      weight: "normal",
      style: "normal"
    });
    var textMesh = new THREE.Mesh( textGeom );
    var lat = locationPoints[i][0];
    var lng = locationPoints[i][1];

    // var xCoord = ( ( lat - 40 ) * 1000 ) -;
    // var zCoord = ( ( lng + 70 ) * 1000 );

    //  RANDOMIZED LOCATIONS
    if ( i % 2 === 0 ) {
      var xCoord = ( ( lat - 40 ) * 10 ) + Math.floor( Math.random() * 850 ) ;
      var zCoord = ( ( lng + 70 ) / Math.round( Math.random() * 10 ) + ( Math.random() * 600));
    }
    else if (i % 3 === 0) {
      var xCoord = ( ( lat - 40 ) * 10 );
      var zCoord = ( ( lng + 70 ) * 10 ) - Math.random() * 500;
    }
    else {
      var xCoord = ( ( lat - 40 ) * 10 ) + Math.floor( Math.random() * 1000 ) ;
      var zCoord = ( ( lng + 70 ) * 10 ) - Math.random() * 500;

    }

    textMesh.position.x = xCoord - 20;
    textMesh.position.z = zCoord - 20;
    textMesh.position.y = 90;
    cube.position.x = xCoord;
    cube.position.y = 0;
    cube.position.z = zCoord;
    // allObjects.push( cube );
    // movingObjects.push( cube );
    // debugger;
    // for ( var i = 0; i < geometry.faces.length; i ++ ) {

    //   var face = geometry.faces[ i ];
    //   face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );
    //   face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );
    //   face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );

    // }
    THREE.GeometryUtils.merge( buildingGeometry, textMesh );
    THREE.GeometryUtils.merge( buildingGeometry, cube );
  }
  // // debugger;
  var basicMaterial = new THREE.MeshPhongMaterial({
    specular: 0x222222,
    color: 0x000000,
    emissive: new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.5, Math.random() * 0.20 + 0.6 ),
    shininess: 100
  });
  allBuildingMesh = new THREE.Mesh( buildingGeometry, basicMaterial );
  scene.add( allBuildingMesh );
  allObjects.push( allBuildingMesh );
  // allBuildingMesh.geometry.computeBoundingBox();
  // allObjects.push( buildingGeometry );
  // movingObjects.push( buildingMesh );
}

// function optimizedDynamicBuildings( locationPoints ) {
//   var geometry = new THREE.CubeGeometry( 50, 100, 50, 1, 1 );
//   var buildingGeometry = new THREE.Geometry();
//   var cube = new THREE.Mesh( geometry );

//   for( var i = 0; i < locationPoints.length; i++ ) {
//     var lat = locationPoints[i][0];
//     var lng = locationPoints[i][1];
//     var xCoord = ( ( lat - 40 ) * 10 ) + Math.floor( Math.random() * 1000 ) ;
//     var zCoord = ( ( lng - 70 ) / Math.round( Math.random() * 10 ) ) + Math.floor( Math.random() * 1000 );
//     cube.position.x = xCoord;
//     cube.position.y = 0;
//     cube.position.z = zCoord;
//     allObjects.push( cube );
//     movingObjects.push( cube );

//     for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

//       var face = geometry.faces[ i ];
//       face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );
//       face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );
//       face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.9 + 0.5, 0.9, Math.random() * 0.25 + 0.9 );

//     }
//     // buildingMesh.material = colorMaterial;
//     THREE.GeometryUtils.merge( buildingGeometry, cube );
//   }
//   // debugger;
//   var basicMaterial = new THREE.MeshLambertMaterial({
//     vertexColors: THREE.VertexColors
//   });
//   var allBuildingMesh = new THREE.Mesh( buildingGeometry, basicMaterial );
//   scene.add( allBuildingMesh );
// }

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

  var cube = new THREE.Mesh( geometry, material );
  cube.position.x = x;
  // cube.position.y = y;
  cube.position.z = z;
  movingObjects.push( cube );
  scene.add( cube );
  allObjects.push( cube );
}

function addBigSphere( x, y ) {
  var sphereGeom = new THREE.SphereGeometry( 3000, 100, 100 );
  var skyColor;
  if( startTime >= 0 && startTime <= 5 ) {
    skyColor = new THREE.Color().setHSL(  0.1, 0.96, 0.60 );
  }
  else if( 12 >= startTime && startTime >= 5 ) {
    skyColor = new THREE.Color().setHSL( 0.6, 0.5, 0.5 );
  }
  else if( 16 >= startTime && startTime >= 12) {
    skyColor = new THREE.Color().setHSL( 0.6, 0.7, 0.4  );
  }
  else if( 20 >= startTime && startTime >= 16 ) {
    skyColor = new THREE.Color().setHSL( 0.7, 0.7, 0.2 );
  }
  else {
    skyColor = new THREE.Color().setHSL(  0.6, 0.4, 0.1);
  }


  sphereMaterial = new THREE.MeshPhongMaterial(
   {    specular: 0x222222,
    color: 0x000000,
    emissive: skyColor,
    side: THREE.DoubleSide,
    // vertexColors: THREE.VertexColors,
    // wireframe: true,
    shininess: 100,
    overdraw: true });
  // sphereMaterial.bumpMap = THREE.ImageUtils.loadTexture('assets/clouds_NRM.png');
  // sphereMaterial.bumpScale = 0.5;
  bigSphere = new THREE.Mesh( sphereGeom, sphereMaterial );
  bigSphere.position.x = x;
  bigSphere.position.y = y;
  bigSphere.material.map = sunTexture;
  scene.add( bigSphere );
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


// function addMirrorCube( x, y ) {
//   var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
//   mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
//   // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
//   scene.add( mirrorCubeCamera );
//   var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
//   mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
//   mirrorCube.position.set( x, y, 0 );
//   mirrorCubeCamera.position = mirrorCube.position;
//   scene.add(mirrorCube);
//   movingObjects.push( mirrorCube );

// }

function generateSpinnyThing() {
  var geometry = new THREE.TorusKnotGeometry();
  var material = new THREE.MeshLambertMaterial({
    emissive: 0x113377,
    wireframe: true,
  })
  spinnyThing2 = new THREE.Mesh( geometry, material );
  spinnyThing2.position.z = -600;
  spinnyThing2.position.x = -20;
  scene.add( spinnyThing2 );
  // movingObjects.push( spinnyThing );
  allObjects.push( spinnyThing2 );
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
