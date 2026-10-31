/*
TO DO: 
Change existing and add new event listeners so
that when the user runs their cursor over the screens, 
clicks or double clicks,the screens interact with one another 
in interesting and perhaps unexpected ways.                                     
 
Use some of the ideas in the McCloud readings to think about how 
the screens might be related together.
*/

// the number of milliseconds between frames if the frame contains 
// an array of images
let pause_between_frames = 250;

const ultra = new Audio("images/shuwat.mp3");
const monster = new Audio("images/monster.mp3");

const screenPool = {
  screen0: ["screen1","screen2","screen3","screen6","drop-shadow(0px 0px 20px #ff0000)"],
  screen1: ["screen0","screen2","screen4","screen7","drop-shadow(0px 0px 20px #ff0000)"],
  screen2: ["screen0","screen1","screen5","screen8","drop-shadow(0px 0px 20px #ff0000)"],
  screen3: ["screen4","screen5","screen0","screen6","drop-shadow(0px 0px 20px #66ff33)"],
  screen4: ["screen3","screen5","screen1","screen7","drop-shadow(0px 0px 20px #66ff33)"],
  screen5: ["screen3","screen4","screen2","screen8","drop-shadow(0px 0px 20px #66ff33)"],
  screen6: ["screen7","screen8","screen0","screen3","drop-shadow(0px 0px 20px #0066ff)"],
  screen7: ["screen6","screen8","screen1","screen4","drop-shadow(0px 0px 20px #0066ff)"],
  screen8: ["screen6","screen7","screen2","screen5","drop-shadow(0px 0px 20px #0066ff)"],
};

function getRandomInteger(min, max) {
  // Calculates a number between min and max (both included)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//fscreen constructor
function Fscreen(filename, isLooping = false, seqno) {
  let tag, container;
  //if is an array of images...
  if (filename instanceof Array) {
    this.mode = "images";
    this.frames = filename;
    container = document.createElement("img");
    this.currentFrame = 0;
    //or if it's a video...
  } else if (filename.includes("mp4") || filename.includes("webm")) {
    this.mode = "video";
    container = document.createElement("video");
    container.src = filename;
    container.loop = isLooping;
    container.autoplay = true;
    container.muted = true; // Comment this line out if you need the audio.
  }
  this.isLooping = isLooping;
  this.id = fscreens.length;
  container.id = "screen" + this.id;
  container.classList.add("fScreen");

  //script that runs when mouse enters...
  container.addEventListener("mouseenter", () => {
    //this.isLooping = false;
    screenArr = screenPool[container.id];
    document.getElementById(screenArr[0]).style.filter = screenArr[4];
    document.getElementById(screenArr[1]).style.filter = screenArr[4];
    document.getElementById(screenArr[2]).style.filter = "drop-shadow(0px 0px 20px #ffff66)";
    document.getElementById(screenArr[3]).style.filter = "drop-shadow(0px 0px 20px #ffff66)";
  });

  //and when it leaves...
  container.addEventListener("mouseleave", () => {
    //this.isLooping = true;
    screenArr = screenPool[container.id];
    document.getElementById(screenArr[0]).style.filter = "none";
    document.getElementById(screenArr[1]).style.filter = "none";
    document.getElementById(screenArr[2]).style.filter = "none";
    document.getElementById(screenArr[3]).style.filter = "none";
  });

  //and if we click...
  container.addEventListener("click", () => {
    if (seqno < 3) {
      if (this.container.muted == true) {
        this.container.playbackRate = 1;
        this.container.muted = false;        
      } else {
        this.container.playbackRate = 0.5;
        this.container.muted = true;
      }
    } else {
      //this.container.classList.toggle("invert");
	  if (getRandomInteger(1,100) > 50) {
        ultra.play();
	  } else {
        monster.play();
	  }
    }
  });

  //add container to the HTML body
  document.body.appendChild(container);
  this.container = container;
} //end Fscreen;

// wait until the page has loaded, and
// then start the animation
document.addEventListener("DOMContentLoaded", function () {
  animate();
});

// initialized as an empty array
let fscreens = [];

// TO DO: Replace the URLs of these videos with links
// to videos you have downloaded or created or that are 
// hosted on an accessible platform, like the 
// Internet Archive.  If they are your own copies
// you can store them on DropBox, or if you have
// a Standard or better account, on Vimeo.  You can
// use videos that are either of type MP4 or WEBM.

const videos = [
  "https://archive.org/download/turner_video_140324/140324.ia.mp4?t=00:00:03",
  "images/ultra-2.mp4",
  "images/ultra-3.mp4",
  "https://archive.org/download/ultramanepisode13englishdub/ULTRAMAN%20%20Episode%2006%20English%20Dub.mp4?t=00:10:56",
  "https://archive.org/download/return-of-ultraman-ep.-26-34/Ep.28%20Ultra%20Special%20Operation.ia.mp4?t=00:02:55",
  "https://archive.org/download/UMTIGA265/Ultraman%20Tiga%20-%20001.mp4?t=00:04:00",
  "https://archive.org/download/AnimeTheater10Ultraman/Anime%20Theater%2010%20-%20Ultraman.mp4?t=00:19:45",
  "https://archive.org/download/return-of-ultraman-ep.-26-34/Ep.26%20Mystery%21%20The%20Case%20of%20the%20Killer%20Beetle.ia.mp4?t=00:21:42",
  "https://archive.org/download/4-k-ultraman-tiga-gaiden-revival-of-the-ancient-giant/%5B4K%5DUltraman%20Tiga%2002.mp4?t=00:17:37"
 ];

// Put each videos in its own Fscreen.
for (let i = 0; i < 9; i++) {
  let screen = new Fscreen(videos[i], true, i);
  // screen.container.classList.toggle("invert");
  screen.container.playbackRate = 0.5;
  fscreens.push(screen);
}

// This is the main function that animates the frames of
// all of the screens.
async function animate() {
  //for each fscreen
  for (let fs of fscreens) {
    //if its mode is video...
    if (fs.mode === "video") {
      // if it should be playing and if it isn't
      // playing (using video property)
      if (fs.isLooping && !fs.container.playing) {
        fs.container.play();
      }
      // if it shouldn't be playing
      if (!fs.isLooping) {
        fs.container.pause();
      }
    } else {
      // it's an image!
      // if it's looping...
      if (fs.isLooping) {
        //advance currentFrame to the next frame
        fs.currentFrame = (fs.currentFrame + 1) % fs.frames.length;
        //update the img src to the new frame;
        fs.container.src = fs.frames[fs.currentFrame];
      } //end if
    } //end else
  } //end loop

  //take a moment
  await sleep();
  //and do it again
  animate();
}

//waits, by default for pause_between_frames.
async function sleep(ms = pause_between_frames) {
  return new Promise(function (resolve) {
    window.setTimeout(function () {
      resolve();
    }, ms);
  });
}

let usersManual = document.createElement("p");
// TO DO: Replace the string "This is a user's manual" 
// with the actual text of your user's manual.
usersManual.innerHTML = "<h3>Introduction</h3>" +
"These screens are selected from a long time Japanese TV series 'Ultraman'. They are originated from different periods: " +
"the 1960s, 1970s and 1990s respectively. You can interact with these screens using the following methods.<br>" +
"<ul><li>Mouse On: When you put your mouse on any one of the screens, it will show you the connection this screen with the others.</li>" +
"<li>Connection: The connection will be displayed as a highlight color at the border of the screen. Yellow border means they were " +
"come from the same period.</li>" +
"<li>Comparison: Other highlight colors are also used to display the comparison of these screens from different periods.</li>" +
"<li>Red Highlight: It is to hightlight the opening and theme song. You can compare their style of design.</li>" +
"<li>Green Highlight: It is to highlight the fashion and dressing of the 'Rangers' from different periods.</li>" +
"<li>Blue Highlight: It is to highlight the transformation (Henshin) of Ultraman. A lot of change on the outlook and material to produce the costume but something still persists.</li>" +
"<li>Mouse Off: All highlight will be removed.</li>" +
"<li>Mouse Click: For the top row of screens if you click on a screen you will be able to hear the theme song. Click again to mute it. For all the other screens, to make it a bit fun, if you click " +
"on it, you will randomly hear a 'Monster Roar' or the signature 'Shuwat' grunt from Ultraman!</li>";
document.body.appendChild(usersManual);
