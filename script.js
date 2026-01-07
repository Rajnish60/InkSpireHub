document.addEventListener('DOMContentLoaded', function() {
    const pagesInput = document.getElementById('pages');
    const wordsInput = document.getElementById('words');
    const totalCost = document.getElementById('total-cost');

    function calculateTotal() {
        const pages = parseInt(pagesInput.value) || 0;
        const words = parseInt(wordsInput.value) || 0;
        const total = (pages * 100) + (words * 1);
        totalCost.textContent = total;
    }

    pagesInput.addEventListener('input', calculateTotal);
    wordsInput.addEventListener('input', calculateTotal);

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Get all FAQ questions
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            // Get the answer that follows this question
            const answer = question.nextElementSibling;
            
            // Toggle the answer visibility
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                question.classList.remove('active');
            } else {
                // Hide all other answers first
                document.querySelectorAll('.faq-answer').forEach(a => {
                    a.style.display = 'none';
                });
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });
                
                // Show this answer
                answer.style.display = 'block';
                question.classList.add('active');
            }
        });
    });

    const videos = document.querySelectorAll('.hero-video');
    console.log('Found videos:', videos.length); // Debug

    if (videos.length === 0) {
        console.error('No videos found');
        return;
    }

    // Convert NodeList to Array and shuffle it
    let videos_array = Array.from(videos);
    shuffleArray(videos_array);

    let currentVideoIndex = 0;

    // Shuffle function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to play video with error handling
    async function playVideo(video) {
        try {
            video.currentTime = 0;
            await video.play();
            console.log('Video playing successfully');
        } catch (error) {
            console.error("Video play failed:", error);
            video.muted = true;
            try {
                await video.play();
            } catch (e) {
                console.error("Even muted playback failed:", e);
            }
        }
    }

    // Function to switch videos
    function switchVideo() {
        // Remove active class from current video
        videos_array[currentVideoIndex].classList.remove('active');
        
        // Update index
        currentVideoIndex = (currentVideoIndex + 1) % videos_array.length;
        
        // If we've shown all videos, reshuffle the array
        if (currentVideoIndex === 0) {
            shuffleArray(videos_array);
        }
        
        // Add active class to new video
        videos_array[currentVideoIndex].classList.add('active');
        
        // Play the new video
        playVideo(videos_array[currentVideoIndex]);
        
        // Pause previous video after transition
        const prevIndex = (currentVideoIndex - 1 + videos_array.length) % videos_array.length;
        setTimeout(() => {
            videos_array[prevIndex].pause();
            videos_array[prevIndex].currentTime = 0;
        }, 2000); // Match this with CSS transition time
    }

    // Initialize first video
    videos_array[0].classList.add('active');
    playVideo(videos_array[0]);

    // Switch videos every 5 seconds
    setInterval(switchVideo, 5000);

    // Add event listeners for video end
    videos_array.forEach(video => {
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded:', video.querySelector('source').src);
        });

        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
        });
    });
});

// Get the video element
const video = document.querySelector('.hero-video');

// Create an IntersectionObserver instance
const observer = new IntersectionObserver((entries) => {
    // If the video is visible, play it
    if (entries[0].isIntersecting) {
        video.play();
    } else {
        // If the video is not visible, pause it
        video.pause();
    }
}, {
    // Set the threshold to 0.5, so the video plays when 50% of it is visible
    threshold: 0.5
});

// Observe the video element
observer.observe(video);

// Add event listeners for hover and mouseout
video.addEventListener('mouseover', () => {
    // Show play options and unmute option on hover
    video.controls = true;
});

video.addEventListener('mouseout', () => {
    // Hide play options and unmute option on mouseout
    video.controls = false;
});