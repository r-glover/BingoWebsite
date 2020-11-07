 window.onload = function() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var imgCard = document.getElementById("bingocard");
  var imgDauber = document.getElementById("dauber"+1);
  var dauberSelect = document.getElementById("dauberSelectMenu");
  var patternSelect = document.getElementById("patternSelectMenu");
  var shuffleSelect = document.getElementById("shuffleCheckBox");
  var BINGO = document.getElementById("BINGOdiv"); 
  var bingoElement = new Image;
  var mousePressed = false;
  var yborder = 0;
  var imgSize = Math.min(Math.floor((window.innerHeight-(canvas.offsetTop)-10)/5),Math.floor(window.innerWidth/5));
  var numImages = 30; // <-----change this
  var bucket = [];
  var bingoCard = [];
  var bingoImageArr = [];
  var bingoTracker = [];

  
  //resize canvas
  canvas.style.position="relative"
  dauberSelect.style.position="relative"
  patternSelect.style.position="relative"
  BINGO.style.position="relative"

  //shuffleSelect.style.position="relative"
  
  canvas.style.top=0
  canvas.width = 5* imgSize;
  canvas.height = 5* imgSize;
  
  if (window.innerHeight < window.innerWidth) {
	  canvas.style.left = Math.min (100,window.innerWidth - window.innerHeight) +'px';
	  dauberSelect.style.left = 100 +'px';
	  patternSelect.style.left = 500 +'px';
	  //shuffleSelect.style.left = 200 +'px'
	  BINGO.style.left = 100 +'px';
	  BINGO.style.width = 5* imgSize +'px';
  } else {
	  //no left padding
	  dauberSelect.style.left = 'px';
	  patternSelect.style.left = 400 +'px';
	  BINGO.style.width = 5* imgSize +'px'; 
  }
  
  //dauber colour select
  var dauberColour = dauberSelect.options[dauberSelect.selectedIndex].value;
  document.getElementById("dauberSelectMenu").addEventListener("change",changeColour);  
  

  var dauberColour = dauberSelect.options[dauberSelect.selectedIndex].value;
  imgDauber = document.getElementById("dauber"+dauberColour);
  

 //load images into array 
  for (var i = 1; i<= numImages; i++) {
	bingoImageArr.push(  document.getElementById("img"+i))
  }


//initialize bingo tracker
for (var i = 0; i < 5; i++) {
	bingoTracker.push([0])
	for (var j = 0; j < 5; j++) {		
		bingoTracker[i][j] = 0;		
	}
}

//event listener for daubing
canvas.addEventListener('mousedown', draw);
//window.addEventListener('resize',resizeCanvas);
shuffleSelect.addEventListener('change',reshuffle)

reshuffle(); //shuffle for first time
//create bingo card randomly

function reshuffle() {
	console.log(shuffleSelect.checked)
if (shuffleSelect.checked == true) {   //shuffle full card
	//create bucket for sampling
	bucket = [];
	for (var i=1;i<=numImages;i++) {
		bucket.push(i);
	}
	
	for (var i = 0; i < 5; i++) {
		bingoCard.push([0])
		for (var j = 0; j < 5; j++) {		
			bingoCard[i][j] = getRandomFromBucket();
			ctx.drawImage(bingoImageArr[bingoCard[i][j]-1], i*imgSize , j*imgSize + yborder,imgSize,imgSize);		
		}
	}
	console.log(bingoCard);
} else {									//shuffle by column
	for (var c = 0; c < 5; c++) {	
		//create bucket for sampling
		bucket = [];
		var n = Math.ceil(numImages/5);
		for (var i=1+Math.floor(numImages/5*(c));i<=numImages/5*(c+1);i++) {
			bucket.push(i);
		}
		
		bingoCard.push([0])
		for (var r = 0; r < 5; r++) {			
			bingoCard[c][r] = getRandomFromBucket();
			ctx.drawImage(bingoImageArr[bingoCard[c][r]-1], c*imgSize , r*imgSize + yborder,imgSize,imgSize);	
		}	
	}    
}
}

//draw dauber card
function draw(e) {
  // mouse left button must be pressed
  var canvasrelative = getCanvasrelative(e);
  var relX = canvasrelative.x
  var relY = canvasrelative.y

  if (e.buttons !== 1) return;
	if (bingoTracker[Math.floor(relX/imgSize)][Math.floor(relY/imgSize)] == 0) {
		bingoTracker[Math.floor(relX/imgSize)][Math.floor(relY/imgSize)] = 1;
		ctx.drawImage(imgDauber, Math.floor(relX/imgSize)*imgSize+10,Math.floor(relY/imgSize)*imgSize+yborder+10,Math.floor(220/250*imgSize),Math.floor(220/250*imgSize));
		//check if you won
		bingoLineWin();
	} else {
		bingoTracker[Math.floor(relX/imgSize)][Math.floor(relY/imgSize)] = 0;
		ctx.drawImage(bingoImageArr[bingoCard[Math.floor(relX/imgSize)][Math.floor(relY/imgSize)]-1], Math.floor(relX/imgSize)*imgSize , Math.floor(relY/imgSize)*imgSize + yborder,imgSize,imgSize);
	

	}
	
}

//for random sampling of pictures  
function getRandomFromBucket() {
   var randomIndex = Math.floor(Math.random()*bucket.length);
   return bucket.splice(randomIndex, 1)[0];
}

//change dauber colour 
function changeColour () {
  console.log(dauberSelect.options[dauberSelect.selectedIndex].value)
  dauberColour = dauberSelect.options[dauberSelect.selectedIndex].value;
  imgDauber = document.getElementById("dauber"+dauberColour);
}

function getCanvasrelative(e) {
    bx = canvas.getBoundingClientRect();
    var x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - bx.left,
    y = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - bx.top;
    return {
        x: x,
        y: y,
        bx: bx
    }
}

function bingoLineWin() {
	//check columns
	for (var c=0;c < 5;c++)
		if (bingoTracker[c].reduce((a,b)=> a+b,0) == 5) {
			console.log("you win");
		}
	//check rows
	for (var r=0;r < 5;r++) {
		if (bingoTracker.map(function(value,index) { return value[r]; }).reduce((a,b) => a+b,0) == 5) {
			console.log("you win");
		}
	}
	//check right diagonal
		for (var r=0;r < 5;r++) {
		if (bingoTracker.map(function(value,index) { return value[r]; }).reduce((a,b) => a+b,0) == 5) {
			console.log("you win");
		}
		}
	
}

};
