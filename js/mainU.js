
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

window.mobilecheck = function() {
	  var check = false;
	    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	      return check;
}

console.log(window.mobilecheck())

//forward if we are on mobile
if (!window.mobilecheck()) { window.location = 'https://jonathankawchuk.com/home'; }

$(document).ready(function(){
initScene();
})


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
    $('.square').click(function() {window.top.location.href='http://jonathankawchuk.com/home'})
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
