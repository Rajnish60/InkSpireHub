document.addEventListener('DOMContentLoaded', function () {

    const videos = document.querySelectorAll('.hero-video');
    console.log('Found videos:', videos.length); 

    if (videos.length === 0) {
        console.error('No videos found');
        return;
    }

    // Convert NodeList to array and shuffle
    let videos_array = Array.from(videos);
    shuffleArray(videos_array);

    let currentVideoIndex = 0;

    // Function 1: Shuffle array to randomize videos
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function 2: Play video with fallback mute retry (handles autoplay restrictions)
    async function playVideo(video) {
        try {
            video.currentTime = 0;
            await video.play();
            console.log('Video playing successfully');
        } catch (error) {
            console.error('Video play failed:', error);
            video.muted = true;
            try {
                await video.play();
            } catch (e) {
                console.error('Even muted playback failed:', e);
            }
        }
    }

    // Function 3: Switch video for slideshow cycle
    function switchVideo() {
        videos_array[currentVideoIndex].classList.remove('active');

        currentVideoIndex = (currentVideoIndex + 1) % videos_array.length;

        if (currentVideoIndex === 0) {
            shuffleArray(videos_array);
        }

        videos_array[currentVideoIndex].classList.add('active');
        playVideo(videos_array[currentVideoIndex]);

        const prevIndex = (currentVideoIndex - 1 + videos_array.length) % videos_array.length;
        setTimeout(() => {
            videos_array[prevIndex].pause();
            videos_array[prevIndex].currentTime = 0;
        }, 2000);
    }

    // Initialize first video
    videos_array[0].classList.add('active');
    playVideo(videos_array[0]);

    // Run slideshow every 5 seconds
    setInterval(switchVideo, 5000);

    // Log when videos load or error
    videos_array.forEach(video => {
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded:', video.querySelector('source')?.src);
        });

        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
        });
    });
});

const video = document.querySelector('.hero-video');

if (video) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            video.play();
        } else {
            video.pause();
        }
    }, { threshold: 0.5 });

    observer.observe(video);

    // Show controls on hover
    video.addEventListener('mouseover', () => {
        video.controls = true;
    });

    video.addEventListener('mouseout', () => {
        video.controls = false;
    });
}
