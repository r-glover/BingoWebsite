 window.onload = function() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var imgCard = document.getElementById("bingocard");
  var imgDauber = document.getElementById("dauber"+1);
  var dauberSelect = document.getElementById("dauberSelectMenu");
  var patternSelect = document.getElementById("patternSelectMenu");
  var shuffleSelect = document.getElementById("shuffleCheckBox");
  var advance = document.getElementById("advanceButton"); 
  var BINGO = document.getElementById("BINGOdiv");    
  var calledLetters = document.getElementById("calledLetters"); 
  var numCalls = document.getElementById("numCallsLabel"); 
  
  var bingoElement = new Image;
  var mousePressed = false;
  var yborder = 0;
  var imgSize = 250;
  var numImages = 30; // <-----change this
  var bucket = [];
  var bingoCard = [];
  var bingoImageArr = [];
  var letters = ["B","I","N","G","O"]

  //resize canvas
  canvas.style.position="relative";
  canvas.style.top=0;
  canvas.width =  imgSize;
  canvas.height =  imgSize;
  canvas.style.left = Math.min (100,window.innerWidth - window.innerHeight) +'px';
  
  BINGO.style.position="relative";
  BINGO.style.left="100px";

  advance.style.position="relative";
  advance.style.left="100px";
 //load images into array 
  for (var i = 1; i<= numImages; i++) {
	bingoImageArr.push(  document.getElementById("img"+i));
  }

advance.addEventListener('click',advanceImage);


function advanceImage()  {
if (bucket.length == 0) {
	return;
}
	
if (shuffleSelect.checked == true) {    //shuffle outside of columns
	ctx.drawImage(bingoImageArr[getRandomFromBucket()-1], 0 , 0 + yborder,imgSize,imgSize);	
} else { //shuffle within column
	var drawedImg = getRandomFromBucket();
	console.log(drawedImg)
	ctx.drawImage(bingoImageArr[drawedImg-1], 0 , 0 + yborder,imgSize,imgSize);
	calledLetters.textContent = letters[Math.ceil(drawedImg/(numImages/5))-1];
}
	numCalls.textContent = numImages - bucket.length + "/" + numImages
}



	//create bucket for sampling
	bucket = [];
	for (var i=1;i<=numImages;i++) {
		bucket.push(i);
	}

//for random sampling of pictures  
function getRandomFromBucket() {
   var randomIndex = Math.floor(Math.random()*bucket.length);
   return bucket.splice(randomIndex, 1)[0];
}


};