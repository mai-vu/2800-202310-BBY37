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

    // Create a new image element to display the captured image
    const capturedImage = new Image();
    capturedImage.src = imageData;

    // Append the captured image to a container in the DOM
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.appendChild(capturedImage);

    // Create a Blob object from the data URL
    const blob = dataURLToBlob(imageData);

    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append('imageFile', blob, 'image.jpg');

    // Call the getLabelsFromImage function with the image file
    getObjectsFromImage(formData);
}

// Add event listener to the capture button
captureButton.addEventListener('click', captureFrame);

async function getObjectsFromImage(imageFile) {
    console.log('Getting labels from image...');

    const response = await fetch("/webcam/getLabels", {
        method: 'POST',
        body: imageFile
    });

    const data = await response.json();
    if (data.objects && data.objects.length > 0) {
        const objects = data.objects;
        objects.forEach(object => console.log(object.name));
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
    return new Blob([u8arr], {
        type: mime
    });
}