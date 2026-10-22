let canvas = document.querySelector("canvas");

ctx = canvas.getContext("2d");

const vertcolor = [
  "rgb(059,179,000)",
  "rgb(255,255,000)",
  "rgb(255,102,102)",
  "rgb(076,230,000)",
  "rgb(230,230,000)",
  "rgb(255,128,128)"
];
const hortcolor = [
  "rgb(071,209,071)",
  "rgb(077,136,255)",
  "rgb(230,230,000)",
  "rgb(051,204,255)",
  "rgb(255,077,148)"
];
const diagright = [
  "rgb(255,133,051)",
  "rgb(077,077,255)",
  "rgb(230,000,000)",
  "rgb(255,102,000)",
  "rgb(255,077,136)",
  "rgb(153,102,051)",
  "rgb(204,082,000)",
  "rgb(134,045,045)",
  "rgb(153,102,051)"
]
const diagleft = [
  "rgb(179,255,204)",
  "rgb(204,153,102)",
  "rgb(128,255,255)",
  "rgb(136,255,077)",
  "rgb(077,195,255)",
  "rgb(153,000,051)",
  "rgb(000,128,000)",
  "rgb(198,083,140)",
  "rgb(000,204,204)"
]

let startpoint = 50;

function drawBox(x0,y0,x1,y1) {

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  // Set start-point
  ctx.moveTo(x0,y0);

  // Set sub-points
  ctx.lineTo(x1,y0);
  ctx.lineTo(x1,y1);
  ctx.lineTo(x0,y1);

  // Set end-point
  ctx.lineTo(x0,y0);

  // Draw it
  ctx.stroke();
  ctx.closePath();
}

//drawBox(50,50,350,350);
//drawBox(400,50,700,350);
//drawBox(50,400,350,700);
//drawBox(400,400,700,700);

for (let i = 0; i < 6; i ++) {

  if (i > 0) {
    startpoint = startpoint + 50;
  }
  ctx.fillStyle = vertcolor[i];
  ctx.fillRect(startpoint,50,50,300);
  ctx.strokeStyle = vertcolor[i];
  ctx.strokeRect(startpoint,50,50,300);

}
startpoint = 50;
for (let j = 0; j < 5; j ++) {

  if (j > 0) {
    startpoint = startpoint + 60;
  }
  ctx.fillStyle = hortcolor[j];
  ctx.fillRect(400,startpoint,300,60);
  ctx.strokeStyle = hortcolor[j];
  ctx.strokeRect(400,startpoint,300,60);

}

ctx.save()
ctx.beginPath();
ctx.rect(50,400,300,300);
ctx.rect(400,400,300,300);
ctx.clip();

ctx.rotate((Math.PI/180)*45);

function rando(min, max) {
  return Math.random() * (max - min) + min;
}
let spoint = 300;
for (let i = 0; i < 9; i++) {
  if (i > 0) {
    spoint = spoint + 51;
  }
  ctx.fillStyle = diagright[i];
  ctx.fillRect(spoint,30,51,435);
}

ctx.rotate((Math.PI/180)*270);

//spoint = -121;
//spoint = -76;
spoint = -25;
for (let j = 4; j < 9; j++) {
  if (j > 4) {
    spoint = spoint + 51;
  }
  ctx.fillStyle = diagleft[j];
  ctx.fillRect(spoint,560,51,435);
}

ctx.fillStyle = "rgb(179,255,204)";
ctx.beginPath();
  ctx.moveTo(-229,725);
  ctx.lineTo(-178,725);
  ctx.lineTo(-178,830);
  ctx.lineTo(-229,830);
//  ctx.lineTo(261, 680);
  ctx.closePath();
  ctx.fill();
ctx.fillStyle = "rgb(204,153,102)";
ctx.beginPath();
  ctx.moveTo(-178,680);
  ctx.lineTo(-127,680);
  ctx.lineTo(-127,880);
  ctx.lineTo(-178,880);
//  ctx.lineTo(-70, 650);
  ctx.closePath();
  ctx.fill();
ctx.fillStyle = "rgb(128,255,255)";
ctx.beginPath();
  ctx.moveTo(-76,640);
  ctx.lineTo(-127,640);
  ctx.lineTo(-127,920);
  ctx.lineTo(-76,920);
//  ctx.lineTo(-19, 600);
  ctx.closePath();
  ctx.fill();

ctx.fillStyle = "rgb(136,255,077)";
ctx.beginPath();
  ctx.moveTo(-25,590);
  ctx.lineTo(-76,590);
  ctx.lineTo(-76,970);
  ctx.lineTo(-25,970);
//  ctx.lineTo(-19, 600);
  ctx.closePath();
  ctx.fill();


