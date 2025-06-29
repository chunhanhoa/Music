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
        this.backgroundMedia = document.getElementById('backgroundMedia'); // Đổi ID để hỗ trợ cả video và ảnh
        
        this.currentSongIndex = 0;
        this.isPlaying = false;
        
        // Danh sách nhạc
        this.playlist = [
            {
                title: "Coffee Lofi",
                artist: "Lofi Kitty",
                src: "audio/lofi1.mp3",
                media: "images/lofi1.mp4" // Đổi key từ 'video' thành 'media' để tổng quát hơn
            },
            {
                title: "Rainy Day Vibes", 
                artist: "Study Music",
                src: "audio/lofi2.mp3",
                media: "images/lofi2.mp4"
            },
            {
                title: "Studio Ghibli Animation OST",
                artist: "Studio Ghibli", 
                src: "audio/lofi3.mp3",
                media: "images/lofi3.mp4"
            },
            {
                title: "Fantasy Bard/Tavern Music",
                artist: "Celestial Draconis", 
                src: "audio/lofi4.mp3",
                media: "images/lofi4.jpg"
            }
        ];
        
        // Danh sách media nền (hỗ trợ .mp4, .jpg, .png, v.v.)
        this.backgroundMediaList = [
            "images/lofi1.mp4",
            "images/lofi2.mp4", 
            "images/lofi3.mp4",
            "images/lofi4.jpg",
            "images/lofi5.png" // Thêm .png để minh họa
        ];
        
        // Fallback files
        this.fallbackPlaylist = [
            {
                title: "Chill Study Beats",
                artist: "Lofi Hip Hop",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                media: null
            }
        ];
        
        this.fallbackMedia = [
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Ảnh trống
        ];
        
        this.currentMediaIndex = 0;
        this.mediaChangeInterval = null;
        
        this.init();
    }
    
    async init() {
        this.loadSong(this.currentSongIndex);
        this.updateTime();
        this.setupEventListeners();
        this.startMediaRotation();
        
        this.audioPlayer.volume = 0.5;
        this.volumeSlider.value = 50;
        
        setInterval(() => this.updateTime(), 1000);
        this.attemptAutoplay();
    }
    
    async attemptAutoplay() {
        try {
            this.audioPlayer.volume = 0;
            await this.audioPlayer.play();
            this.fadeInVolume();
            this.isPlaying = true;
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } catch (error) {
            console.log('Cần click để phát nhạc (autoplay policy)');
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
        
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        
        this.audioPlayer.src = song.src;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        
        if (song.media) {
            this.loadMedia(song.media);
        }
        
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
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        
        if (nextIndex === 0 && this.hasTriedAllSongs) {
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
    
    loadMedia(mediaSrc) {
        const mediaContainer = document.querySelector('.main-video');
        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(mediaSrc);
        
        // Xóa nội dung hiện tại
        mediaContainer.innerHTML = '';
        
        if (isImage) {
            // Tạo thẻ <img> cho ảnh
            const img = document.createElement('img');
            img.id = 'backgroundMedia';
            img.src = mediaSrc;
            img.alt = 'Background Media';
            mediaContainer.appendChild(img);
        } else {
            // Tạo thẻ <video> cho video
            const video = document.createElement('video');
            video.id = 'backgroundMedia';
            video.src = mediaSrc;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            mediaContainer.appendChild(video);
            
            video.onerror = (e) => {
                console.error(`Lỗi khi load media: ${mediaSrc}`, e);
                this.handleMediaError();
            };
            
            video.oncanplaythrough = () => {
                console.log(`Đã load xong media: ${mediaSrc}`);
                video.play().catch(console.error);
            };
        }
    }
    
    handleMediaError() {
        console.log('Lỗi media, dùng fallback');
        this.loadMedia(this.fallbackMedia[0]);
        this.showError("Không tìm thấy file media. Đã dùng media mặc định.");
    }
    
    showError(message) {
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
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
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        
        document.addEventListener('click', this.enableAutoplay.bind(this), { once: true });
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
    
    startMediaRotation() {
        if (this.backgroundMediaList.length === 0) {
            this.handleMediaError();
            return;
        }
        
        if (this.mediaChangeInterval) {
            clearInterval(this.mediaChangeInterval);
        }
        
        this.mediaChangeInterval = setInterval(() => {
            this.currentMediaIndex = (this.currentMediaIndex + 1) % this.backgroundMediaList.length;
            const mediaContainer = document.querySelector('.main-video');
            mediaContainer.style.opacity = '0.5';
            
            setTimeout(() => {
                this.loadMedia(this.backgroundMediaList[this.currentMediaIndex]);
                setTimeout(() => {
                    mediaContainer.style.opacity = '1';
                }, 200);
            }, 300);
            
        }, 900000); // 15 phút
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LofiPlayer();
});