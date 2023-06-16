//Initalizing the canvas and audio resources
container.addEventListener('click', function(){

    let audio1 = new Audio();
    audio1.src = "tune2.mp3";

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

//setting up the web Audio API variables

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let analyzer = null;

audio1.play();
audioSource = audioCtx.createMediaElementSource(audio1);
analyzer = audioCtx.createAnalyser();
audioSource.connect(analyzer);
analyzer.connect(audioCtx.destination);

//Calculating the visualizer's bar dimensions

analyzer.fftSize = 512;
const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / 2 / bufferLength;

//animating the bar

let x = 0;
function animate(){
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyzer.getByteFrequencyData(dataArray);

    drawVisualizer({
        bufferLength,
        dataArray,
        barWidth
    });
    requestAnimationFrame(animate);
}

const drawVisualizer =({
    bufferLength,
    dataArray,
    barWidth
}) => {
    let barHeight;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 3; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
        const red = (i * barHeight) / 10;
        const green = i * 4;
        const blue = barHeight / 4 - 12;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(
          canvas.width / 2 - x, // this will start the bars at the center of the canvas and move from right to left
          canvas.height - barHeight,
          barWidth,
          barHeight
        ); // draws the bar. the reason we're calculating Y weird here is because the canvas starts at the top left corner. So we need to start at the bottom left corner and draw the bars from there
        x += barWidth; // increases the x value by the width of the bar
      }
  
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 3; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
        const red = (i * barHeight) / 10;
        const green = i * 4;
        const blue = barHeight / 4 - 12;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); // this will continue moving from left to right
        x += barWidth; // increases the x value by the width of the bar
      }
};

animate();

});
