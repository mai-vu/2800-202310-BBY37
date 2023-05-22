const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasElement');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('captureButton');

// Access the webcam and start video capture
navigator.mediaDevices.getUserMedia({
    video: true
})
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing webcam:', error);
    });

// Function to capture a video frame and process it
function captureFrame() {
    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = canvas.toDataURL('image/jpeg');

    // Create a Blob object from the data URL
    const blob = dataURLToBlob(imageData);

    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append('imageFile', blob, 'image.jpg');

    // Call the getLabelsFromImage function with the image file
    getLabelsFromImage(formData);
}

// Add event listener to the capture button
captureButton.addEventListener('click', captureFrame);

async function getLabelsFromImage(imageFile) {
    console.log('Getting labels from image...');

    const response = await fetch("/webcam/getLabels", {
        method: 'POST',
        body: imageFile
    });

    const data = await response.json();
    if (data.labels && data.labels.length > 0) {
        const labels = data.labels;
        console.log('Labels:');
        labels.forEach(label => console.log(label.description));
    } else {
        console.log('No labels found in the image.');
    }
}

function dataURLToBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
