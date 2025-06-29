class LofiPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progress = document.getElementById('progress');
        this.progressBar = document.querySelector('.progress-bar');
        this.currentTimeMusic = document.getElementById('currentTimeMusic');
        this.totalTime = document.getElementById('totalTime');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.backgroundVideo = document.getElementById('backgroundVideo');
        
        this.currentSongIndex = 0;
        this.isPlaying = false;
        
        // Danh sách nhạc có sẵn - thay đổi tên file theo file thực tế của bạn
        this.playlist = [
            {
                title: "Chill Study",
                artist: "Lofi",
                src: "audio/lofi1.mp3",
                video: "images/lofi1.mp4"
            },
            {
                title: "Rainy Day Vibes", 
                artist: "Study Music",
                src: "audio/lofi2.mp3",
                video: "images/lofi2.mp4"
            },
            {
                title: "Studio Ghibli Animation OST",
                artist: "Studio Ghibli", 
                src: "audio/lofi3.mp3",
                video: "images/lofi3.mp4"
            }
        ];
        
        // Danh sách video nền (file .mp4)
        this.backgroundVideos = [
            "images/lofi1.mp4",
            "images/lofi2.mp4", 
            "images/lofi3.mp4",
            "images/lofi4.mp4",
            "images/lofi5.mp4"
        ];
        
        // Fallback files khi không tìm thấy file gốc
        this.fallbackPlaylist = [
            {
                title: "Chill Study Beats",
                artist: "Lofi Hip Hop",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // File demo
                video: null
            }
        ];
        
        this.fallbackVideos = [
            "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAASG1kYXQAAA==" // Video trống
        ];
        
        this.currentVideoIndex = 0;
        this.videoChangeInterval = null;
        
        this.init();
    }
    
    async init() {
        // Load bài nhạc đầu tiên
        this.loadSong(this.currentSongIndex);
        this.updateTime();
        this.setupEventListeners();
        this.startVideoRotation();
        
        // Set volume mặc định
        this.audioPlayer.volume = 0.5;
        this.volumeSlider.value = 50;
        
        // Cập nhật thời gian mỗi giây
        setInterval(() => this.updateTime(), 1000);
        
        // Thử phát nhạc tự động (một số browser cần user interaction trước)
        this.attemptAutoplay();
    }
    
    async attemptAutoplay() {
        try {
            // Thử phát nhạc với volume 0 để bypass autoplay policy
            this.audioPlayer.volume = 0;
            await this.audioPlayer.play();
            
            // Nếu thành công, tăng volume dần
            this.fadeInVolume();
            this.isPlaying = true;
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } catch (error) {
            console.log('Cần click để phát nhạc (autoplay policy)');
            // Reset volume
            this.audioPlayer.volume = 0.5;
        }
    }
    
    fadeInVolume() {
        let targetVolume = this.volumeSlider.value / 100;
        let currentVolume = 0;
        let fadeInterval = setInterval(() => {
            currentVolume += 0.05;
            if (currentVolume >= targetVolume) {
                currentVolume = targetVolume;
                clearInterval(fadeInterval);
            }
            this.audioPlayer.volume = currentVolume;
        }, 50);
    }
    
    loadSong(index) {
        const song = this.playlist[index];
        
        // Dừng nhạc hiện tại
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        
        // Load bài mới
        this.audioPlayer.src = song.src;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        
        // Load video nền theo bài nhạc
        if (song.video) {
            this.loadVideo(song.video);
        }
        
        // Error handling cho audio với fallback
        this.audioPlayer.onerror = (e) => {
            console.error(`Lỗi khi load nhạc: ${song.src}`, e);
            this.handleAudioError(index);
        };
        
        this.audioPlayer.oncanplaythrough = () => {
            console.log(`Đã load xong: ${song.title}`);
        };
    }
    
    handleAudioError(currentIndex) {
        console.log('Đang thử file tiếp theo...');
        
        // Thử bài tiếp theo
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        
        if (nextIndex === 0 && this.hasTriedAllSongs) {
            // Đã thử hết playlist, dùng fallback
            console.log('Không tìm thấy file nhạc nào, dùng fallback');
            this.useFallbackPlaylist();
        } else {
            this.hasTriedAllSongs = nextIndex === 0;
            setTimeout(() => {
                this.currentSongIndex = nextIndex;
                this.loadSong(nextIndex);
            }, 1000);
        }
    }
    
    useFallbackPlaylist() {
        this.playlist = this.fallbackPlaylist;
        this.currentSongIndex = 0;
        this.songTitle.textContent = "Không tìm thấy file nhạc";
        this.songArtist.textContent = "Hãy kiểm tra thư mục audio/";
        this.showError("Không tìm thấy file nhạc. Hãy thêm file .mp3 vào thư mục audio/");
    }
    
    loadVideo(videoSrc) {
        // Dừng video hiện tại
        this.backgroundVideo.pause();
        
        // Load video mới
        this.backgroundVideo.src = videoSrc;
        
        // Error handling cho video với fallback
        this.backgroundVideo.onerror = (e) => {
            console.error(`Lỗi khi load video: ${videoSrc}`, e);
            this.handleVideoError();
        };
        
        this.backgroundVideo.oncanplaythrough = () => {
            console.log(`Đã load xong video: ${videoSrc}`);
            this.backgroundVideo.play().catch(console.error);
        };
        
        // Load video
        this.backgroundVideo.load();
    }
    
    handleVideoError() {
        console.log('Lỗi video, dùng gradient nền');
        // Ẩn video và hiển thị gradient nền
        this.backgroundVideo.style.display = 'none';
        document.body.style.background = 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)';
    }
    
    showError(message) {
        // Xóa error cũ nếu có
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        // Tạo thông báo lỗi
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Tự động xóa sau 5 giây
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('currentTime').textContent = timeString;
        document.getElementById('currentDate').textContent = dateString;
    }
    
    setupEventListeners() {
        // Play/Pause button
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume slider
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        // Audio events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        
        // Video events
        this.backgroundVideo.addEventListener('loadstart', () => {
            console.log('Bắt đầu load video...');
        });
        
        this.backgroundVideo.addEventListener('canplay', () => {
            console.log('Video sẵn sàng phát');
        });
        
        // Thêm event để tự động phát khi user tương tác lần đầu
        document.addEventListener('click', this.enableAutoplay.bind(this), { once: true });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    enableAutoplay() {
        if (!this.isPlaying) {
            this.togglePlay();
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audioPlayer.play().catch(error => {
                console.error('Không thể phát nhạc:', error);
                this.showError('Không thể phát nhạc. Hãy kiểm tra file audio.');
            });
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        this.isPlaying = !this.isPlaying;
    }
    
    previousSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.audioPlayer.play();
        }
    }
    
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.audioPlayer.play().catch(() => {
                // Nếu không phát được, thử bài tiếp theo
                setTimeout(() => this.nextSong(), 500);
            });
        }
    }
    
    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audioPlayer.duration;
        
        this.audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    updateProgress() {
        const { duration, currentTime } = this.audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        
        this.progress.style.width = `${progressPercent}%`;
        this.currentTimeMusic.textContent = this.formatTime(currentTime);
    }
    
    updateDuration() {
        this.totalTime.textContent = this.formatTime(this.audioPlayer.duration);
    }
    
    setVolume() {
        this.audioPlayer.volume = this.volumeSlider.value / 100;
    }
    
    formatTime(time) {
        if (isNaN(time)) return '0:00';
        
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
        }
    }
    
    startVideoRotation() {
        if (this.backgroundVideos.length === 0) {
            this.handleVideoError();
            return;
        }
        
        // Xóa interval cũ nếu có
        if (this.videoChangeInterval) {
            clearInterval(this.videoChangeInterval);
        }
        
        // Chuyển video nền mỗi 15 phút (900000ms)
        this.videoChangeInterval = setInterval(() => {
            this.currentVideoIndex = (this.currentVideoIndex + 1) % this.backgroundVideos.length;
            
            // Fade out effect
            this.backgroundVideo.style.opacity = '0.5';
            
            setTimeout(() => {
                // Load video mới
                this.loadVideo(this.backgroundVideos[this.currentVideoIndex]);
                
                // Fade in effect
                setTimeout(() => {
                    this.backgroundVideo.style.opacity = '1';
                }, 200);
            }, 300);
            
        }, 900000); // 15 phút = 15 * 60 * 1000 = 900000ms
        
        console.log('Đã bắt đầu chu kỳ chuyển video 15 phút');
    }
}

// Khởi tạo player khi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    new LofiPlayer();
});
