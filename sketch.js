// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY;
let circleSize = 100;
let isDrawing = false; // Track if we are drawing the trail
let prevX, prevY; // Store the previous position of the thumb

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position at the center of the canvas
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let fingerInContact = false; // Track if any thumb is in contact with the circle

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the thumb tip (keypoint 4)
        let thumb = hand.keypoints[4];

        // Check if the thumb is touching the circle
        let d = dist(thumb.x, thumb.y, circleX, circleY);
        if (d < circleSize / 2) {
          // Move the circle to follow the thumb
          circleX = thumb.x;
          circleY = thumb.y;

          // Start drawing the trail
          if (!isDrawing) {
            isDrawing = true;
            prevX = thumb.x;
            prevY = thumb.y;
          } else {
            // Draw a green line from the previous position to the current position
            stroke(0, 255, 0);
            strokeWeight(2);
            line(prevX, prevY, thumb.x, thumb.y);
            prevX = thumb.x;
            prevY = thumb.y;
          }

          fingerInContact = true;
        }
      }
    }

    // If no thumb is in contact, stop drawing the trail
    if (!fingerInContact) {
      isDrawing = false;
    }
  } else {
    // If no hands are detected, stop drawing the trail
    isDrawing = false;
  }
}
