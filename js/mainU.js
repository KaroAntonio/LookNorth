
var scene, camera, renderer, controls;
var container;
var loader;
var w = window.innerWidth;
var h = window.innerHeight;
var globalUniforms;
var time = 0;
var video, videoLoaded = false, camTex;
var scene1, scene2;
var rt1, rt2;
var material1, material2;
var planeGeometry;
var mesh1, mesh2;
var mouseX = 0.0, mouseY =1.0;
var time = 0.0;
var redx = 200;
var greenx = 0.0;
var bluex = 255;
var redy = 0.0;
var greeny = 0.0;
var bluey = 0.0;

var goo = 90;
var blurWidth = 1.0;
var lightWidth = 9;
var lightBrightness = 0.0;

var topLeft = document.getElementById("topLeft");
var topRight = document.getElementById("topRight");
var bottomLeft = document.getElementById("bottomLeft");
var bottomRight = document.getElementById("bottomRight");
var middle = document.getElementById("middle");
var length, squareCoords;
var halfWidth, halfHeight;
var volumeAmt = 1.0;
var volMult = 1.0;
var muted = false;


initScene();

$("#topLeft").bind("load",function(){
        $(".alert-success").html("Audio Loaded succesfully");
    });

function calculateSquare(){
	if(window.innerWidth>=window.innerHeight){
		length = window.innerHeight;
	} else {
		length = window.innerWidth;
	}
	var div = document.getElementById("squareDiv");

	squareCoords = {
		topLeft: new THREE.Vector2(0,0),
		topRight: new THREE.Vector2(window.innerWidth,0),
		bottomLeft: new THREE.Vector2(0,window.innerHeight),
		bottomRight: new THREE.Vector2(window.innerWidth,window.innerHeight)
	}
	halfWidth = window.innerWidth/2;
	halfHeight = window.innerHeight/2;
}

function initScene(){
    calculateSquare();
    alignSquares();
	container = document.createElement('div');
    document.body.appendChild(container);

    initGlobalUniforms();
	window.addEventListener( 'resize', onWindowResize, false );

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    //document.addEventListener('mousemove',updateAudio, false);
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    //document.addEventListener( 'touchstart', updateAudio, false );
    document.addEventListener( 'touchmove', updateAudio, false );
    //document.addEventListener( 'touchmove', updateAudio, false );
    document.addEventListener( 'touchend', onDocumentTouchEnd, false );
    document.addEventListener( 'touchcancel', onDocumentTouchEnd, false );
    document.addEventListener( 'touchleave', onDocumentTouchEnd, false );

}
function initGlobalUniforms(){
	globalUniforms = {
		time: {type: 'f', value: time},
		mouseX: {type: 'f', value: 0.0},
		mouseY: {type: 'f', value: 0.0}
	}
}

function alignSquares(){
    //centre squares vertically and h-ally
    $('.square').css({left:window.innerWidth/2-$('.square').width()/2});
}

var time = 2.0;

function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}
function onWindowResize( event ) {
    calculateSquare();
    alignSquares();

}
function onDocumentMouseMove(event){
    updateAudio( event )
}

function onDocumentTouchStart( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
    	unMappedMouseTouchX = (event.touches[ 0 ].pageX );
	    unMappedMouseTouchY = (event.touches[ 0 ].pageY );
	    mouseX = map(unMappedMouseTouchX, window.innerWidth, -2.5,2.5);
	    mouseY = map(unMappedMouseTouchY, window.innerHeight, 0.5,1.5);

        var d2A = {  //distance to audio
	    	topLeft: new THREE.Vector2(squareCoords.topLeft.x - unMappedMouseTouchX, squareCoords.topLeft.y - unMappedMouseTouchY),
	    	topRight: new THREE.Vector2(squareCoords.topRight.x - unMappedMouseTouchX, squareCoords.topRight.y - unMappedMouseTouchY),
	    	bottomLeft: new THREE.Vector2(squareCoords.bottomLeft.x - unMappedMouseTouchX, squareCoords.bottomLeft.y - unMappedMouseTouchY),
	    	bottomRight: new THREE.Vector2(squareCoords.bottomRight.x - unMappedMouseTouchX, squareCoords.bottomRight.y - unMappedMouseTouchY),
	    	middle: new THREE.Vector2(halfWidth - unMappedMouseTouchX, halfHeight - unMappedMouseTouchY),
	    }    
	    distObj = { //object to hold distances
	    	topLeft: Math.sqrt((d2A["topLeft"].x*d2A["topLeft"].x) + (d2A["topLeft"].y*d2A["topLeft"].y)),
	    	topRight: Math.sqrt((d2A["topRight"].x*d2A["topRight"].x) + (d2A["topRight"].y*d2A["topRight"].y)),
	    	bottomLeft: Math.sqrt((d2A["bottomLeft"].x*d2A["bottomLeft"].x) + (d2A["bottomLeft"].y*d2A["bottomLeft"].y)),
	    	bottomRight: Math.sqrt((d2A["bottomRight"].x*d2A["bottomRight"].x) + (d2A["bottomRight"].y*d2A["bottomRight"].y)),
	    	middle: Math.sqrt((d2A["middle"].x*d2A["middle"].x) + (d2A["middle"].y*d2A["middle"].y))
		}
		handleAudio(distObj);
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length === 1 ) {
        event.preventDefault();
        
    	unMappedMouseTouchX = (event.touches[ 0 ].pageX );
	    unMappedMouseTouchY = (event.touches[ 0 ].pageY );
	    mouseX = map(unMappedMouseTouchX, window.innerWidth, -2.5,2.5);
	    mouseY = map(unMappedMouseTouchY, window.innerHeight, -1.0,1.5);

        var d2A = {  //distance to audio
	    	topLeft: new THREE.Vector2(squareCoords.topLeft.x - unMappedMouseTouchX, squareCoords.topLeft.y - unMappedMouseTouchY),
	    	topRight: new THREE.Vector2(squareCoords.topRight.x - unMappedMouseTouchX, squareCoords.topRight.y - unMappedMouseTouchY),
	    	bottomLeft: new THREE.Vector2(squareCoords.bottomLeft.x - unMappedMouseTouchX, squareCoords.bottomLeft.y - unMappedMouseTouchY),
	    	bottomRight: new THREE.Vector2(squareCoords.bottomRight.x - unMappedMouseTouchX, squareCoords.bottomRight.y - unMappedMouseTouchY),
	    	middle: new THREE.Vector2(halfWidth - unMappedMouseTouchX, halfHeight - unMappedMouseTouchY),
	    }    
	    distObj = { //object to hold distances
	    	topLeft: Math.sqrt((d2A["topLeft"].x*d2A["topLeft"].x) + (d2A["topLeft"].y*d2A["topLeft"].y)),
	    	topRight: Math.sqrt((d2A["topRight"].x*d2A["topRight"].x) + (d2A["topRight"].y*d2A["topRight"].y)),
	    	bottomLeft: Math.sqrt((d2A["bottomLeft"].x*d2A["bottomLeft"].x) + (d2A["bottomLeft"].y*d2A["bottomLeft"].y)),
	    	bottomRight: Math.sqrt((d2A["bottomRight"].x*d2A["bottomRight"].x) + (d2A["bottomRight"].y*d2A["bottomRight"].y)),
	    	middle: Math.sqrt((d2A["middle"].x*d2A["middle"].x) + (d2A["middle"].y*d2A["middle"].y))
		}
		// console.log(distObj);
		handleAudio(distObj);
    }
}

function updateAudio( event ) {
    unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -2.5,2.5);
    // mouseY = map(unMappedMouseY, window.innerHeight, 0.9,1.1);
    mouseY = map(unMappedMouseY, window.innerHeight, -1.5,1.5);

    var d2A = {  //distance to audio
    	topLeft: new THREE.Vector2(squareCoords.topLeft.x - unMappedMouseX, squareCoords.topLeft.y - unMappedMouseY),
    	topRight: new THREE.Vector2(squareCoords.topRight.x - unMappedMouseX, squareCoords.topRight.y - unMappedMouseY),
    	bottomLeft: new THREE.Vector2(squareCoords.bottomLeft.x - unMappedMouseX, squareCoords.bottomLeft.y - unMappedMouseY),
    	bottomRight: new THREE.Vector2(squareCoords.bottomRight.x - unMappedMouseX, squareCoords.bottomRight.y - unMappedMouseY),
    	middle: new THREE.Vector2(halfWidth - unMappedMouseX, halfHeight - unMappedMouseY),
    }    
    distObj = { //object to hold distances
    	topLeft: Math.sqrt((d2A["topLeft"].x*d2A["topLeft"].x) + (d2A["topLeft"].y*d2A["topLeft"].y)),
    	topRight: Math.sqrt((d2A["topRight"].x*d2A["topRight"].x) + (d2A["topRight"].y*d2A["topRight"].y)),
    	bottomLeft: Math.sqrt((d2A["bottomLeft"].x*d2A["bottomLeft"].x) + (d2A["bottomLeft"].y*d2A["bottomLeft"].y)),
    	bottomRight: Math.sqrt((d2A["bottomRight"].x*d2A["bottomRight"].x) + (d2A["bottomRight"].y*d2A["bottomRight"].y)),
    	middle: Math.sqrt((d2A["middle"].x*d2A["middle"].x) + (d2A["middle"].y*d2A["middle"].y))
	}
	handleEnv(distObj);
}
    
function onDocumentTouchEnd( event ) {
    mouseX = 0; 
    mouseY = 0;
}

function handleEnv(distance) {
    vols = handleAudio(distance)
    handleGrad(vols)
    handleImg(vols)
}
 
function handleGrad(vols) {
    x = 1 - (mouseX+2.5)/5
    y = 1 - (mouseY+1.5)/3
    w = window.innerWidth
    h = window.innerHeight
    g_left = x*w*0.5 + w*0.25 - $('#gradient').width()/2.
    g_top =  y*window.innerHeight - $('#gradient').height()/2.
    $('#gradient').css({top: g_top, left: g_left, position:'absolute'})
}

function handleImg(vols) {
    $('#square_tl').css({opacity:vols[0]})
    $('#square_tr').css({opacity:vols[1]})
    $('#square_m').css({opacity:vols[2]})
    $('#square_bl').css({opacity:vols[3]})
    $('#square_br').css({opacity:vols[4]})
    $('.square').click(function() {window.location='http://jonathankawchuk.com/home'})
}

function handleAudio(distance){
	// var max = Math.sqrt((window.innerWidth*window.innerWidth) + (window.innerHeight*window.innerHeight));
	// var max = Math.sqrt((length/2*length/2) + (length/2*length/2));
	// if(unMappedMouseX < window.innerWidth/2 &&  unMappedMouseY < window.innerHeight/2){
		
		max = length*Math.sqrt(2)/2;

	if(distance.topLeft>=max)distance.topLeft = max;
	if(distance.bottomLeft>=max)distance.bottomLeft = max;
	if(distance.topRight>=max)distance.topRight = max;
	if(distance.bottomRight>=max)distance.bottomRight = max;
	// console.log(distance);
    
	var volTopLeft = map(distance.topLeft, max, 0.0, 1.0);
	var volTopRight = map(distance.topRight, max, 0.0, 1.0);
	var volBottomLeft = map(distance.bottomLeft, max, 0.0, 1.0);
	var volBottomRight = map(distance.bottomRight, max, 0.0, 1.0);
	var volMiddle = map(distance.middle, max, 0.0,1.0)
    
    /*
    $('#info').html('tl: '+volTopLeft+
                    '<br>'+'tr: '+volTopRight+
                    '<br>'+'m: '+volMiddle+
                   '<br>'+'bl: '+volBottomLeft+
                   '<br>'+'br: '+volBottomRight)
                   */
	topLeft.volume = Math.max(0,volTopLeft*volMult);
	topRight.volume = Math.max(0,volTopRight*volMult);
	bottomLeft.volume = Math.max(0,volBottomLeft*volMult);
	bottomRight.volume = Math.max(0,volBottomRight*volMult);
	middle.volume = Math.max(0,volMiddle*volMult);

	topLeft.play();
	topRight.play();
	bottomLeft.play();
	bottomRight.play();
	middle.play();
    
    return [volTopLeft,volTopRight, volMiddle, volBottomLeft, volBottomRight]
}
