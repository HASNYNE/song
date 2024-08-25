// Function to load the ratings from a file and sort the videos
function loadRatings() {
    fetch('ratings.txt')
        .then(response => response.text())
        .then(data => {
            // Parse the ratings from the file
            const ratings = {};
            data.split('\n').forEach(line => {
                const [video, rating] = line.split(':');
                if (video && rating) {
                    ratings[video.trim()] = parseFloat(rating.trim());
                }
            });

            // Update the DOM with the ratings and sort the videos
            const videoList = document.getElementById('videoList');
            const videos = Array.from(videoList.getElementsByTagName('li'));

            // Update ratings in the DOM
            for (let i = 0; i < videos.length; i++) {
                const videoFile = videos[i].querySelector('a').getAttribute('data-video');
                if (ratings[videoFile] !== undefined) {
                    videos[i].querySelector('.rating').textContent = ratings[videoFile];
                }
            }

            // Sort videos by rating
            videos.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector('.rating').textContent) || 0;
                const ratingB = parseFloat(b.querySelector('.rating').textContent) || 0;
                return ratingB - ratingA;
            });

            // Re-arrange the videos in the DOM based on the sorted order
            videos.forEach(video => videoList.appendChild(video));
        })
        .catch(error => console.error('Error loading ratings:', error));
}

// Call the loadRatings function when the page loads
window.onload = function() {
    loadRatings();
    // Any other onload tasks...
};

// Get modal elements
var modal = document.getElementById("videoModal");
var videoPlayer = document.getElementById("videoPlayer");
var videoSource = document.getElementById("videoSource");
var closeBtn = document.getElementsByClassName("close")[0];

// Get all elements with class 'open-video' and set up event listeners
var videoLinks = document.getElementsByClassName("open-video");

// Autoplay settings
var isAutoplayOn = false;
var autoplayToggle = document.getElementById("autoplayToggle");
var autoplayIcon = autoplayToggle.querySelector("i");

// Track the current video index
var currentVideoIndex = -1; // Start with -1 so we can track it properly

// Toggle autoplay functionality
autoplayToggle.onclick = function() {
    isAutoplayOn = !isAutoplayOn;
    autoplayIcon.classList.toggle("fa-toggle-on", isAutoplayOn);
    autoplayIcon.classList.toggle("fa-toggle-off", !isAutoplayOn);
    autoplayToggle.innerHTML = `<i class="${isAutoplayOn ? 'fas fa-toggle-on' : 'fas fa-toggle-off'}"></i> Autoplay ${isAutoplayOn ? 'On' : 'Off'}`;
};

// Load video and play if autoplay is on
function playVideo(videoFile) {
    videoSource.src = videoFile;
    videoPlayer.load();
    videoPlayer.play();
    modal.style.display = "flex"; // Ensure the modal stays visible
}

// Set up event listeners for video links
for (let i = 0; i < videoLinks.length; i++) {
    videoLinks[i].onclick = function(event) {
        event.preventDefault();
        const videoFile = this.getAttribute("data-video");
        playVideo(videoFile);
    };
}

// Close the modal when the close button is clicked
closeBtn.onclick = function() {
    modal.style.display = "none";
    videoPlayer.pause(); // Stop the video when the modal is closed
};

// Close the modal if clicking outside of the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        videoPlayer.pause(); // Stop the video when the modal is closed
    }
};

// Event listener for video end to trigger autoplay
videoPlayer.onended = function() {
    if (isAutoplayOn) {
        const nextVideoIndex = (currentVideoIndex + 1) % videoLinks.length;
        playVideo(videoLinks[nextVideoIndex].getAttribute("data-video"));
        currentVideoIndex = nextVideoIndex;
    }
};

// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    var searchTerm = this.value.toLowerCase();
    for (var i = 0; i < videoLinks.length; i++) {
        var videoTitle = videoLinks[i].textContent.toLowerCase();
        if (videoTitle.includes(searchTerm)) {
            videoLinks[i].parentElement.style.display = '';
        } else {
            videoLinks[i].parentElement.style.display = 'none';
        }
    }
});
