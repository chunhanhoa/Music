class LofiPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.playlistBtn = document.getElementById('playlistBtn');
        this.progress = document.getElementById('progress');
        this.progressBar = document.querySelector('.progress');
        this.currentTimeMusic = document.getElementById('currentTimeMusic');
        this.totalTime = document.getElementById('totalTime');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.backgroundMedia = document.getElementById('backgroundMedia');
        this.playlistModal = document.getElementById('playlistModal');
        this.closePlaylist = document.getElementById('closePlaylist');
        this.playlistList = document.getElementById('playlistList');
        
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isDragging = false;
        this.progressThumb = null;
        this.isChangingSong = false;
        
        // Danh sách nhạc
        this.playlist = [
            {
                title: "You are falling in love",
                artist: "Love & Chill Vibes", 
                src: "audio/lofi1.mp3",
                media: "images/lofi1.mp4"
            },
            {
                title: "Coffee Lofi",
                artist: "Lofi Kitty",
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
                title: "Rainy Day Vibes", 
                artist: "Study Music",
                src: "audio/lofi4.mp3",
                media: "images/lofi4.mp4"
            },
            {
                title: "Fantasy Bard/Tavern Music",
                artist: "Celestial Draconis", 
                src: "audio/lofi5.mp3",
                media: "images/lofi5.mp4"
            },
            {
                title: "Fairy Tail Emotional Music",
                artist: "ich98", 
                src: "audio/lofi6.mp3",
                media: "images/lofi6.gif"
            },
            {
                title: "Korean RnB",
                artist: "Seoul Flow AI", 
                src: "audio/lofi7.mp3",
                media: "images/lofi7.gif"
            },
            {
                title: "A Mysterious Japanese Songs",
                artist: "White Girl [Chill Best Songs]", 
                src: "audio/lofi8.mp3",
                media: "images/lofi8.gif"
            },
            {
                title: "Камин",
                artist: "EMIN & JONY", 
                src: "audio/lofi9.mp3",
                media: "images/lofi9.gif"
            },
            {
                title: "ADRENALINE",
                artist: "CURSEDEVIL", 
                src: "audio/lofi10.mp3",
                media: "images/lofi10.gif"
            },
            {
                title: "latina energy playlist",
                artist: "nini ୨୧", 
                src: "audio/lofi11.mp3",
                media: "images/lofi11.gif"
            },
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
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        ];
        
        this.init();
    }
    
    async init() {
        this.loadSong(this.currentSongIndex);
        this.updateTime();
        this.setupEventListeners();
        this.createPlaylist();
        
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
    
    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.playlistBtn.addEventListener('click', () => this.showPlaylist());
        this.closePlaylist.addEventListener('click', () => this.hidePlaylist());
        this.progress.addEventListener('input', (e) => this.setProgress(e));
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        
        // Close playlist when clicking outside
        this.playlistModal.addEventListener('click', (e) => {
            if (e.target === this.playlistModal) {
                this.hidePlaylist();
            }
        });
        
        document.addEventListener('click', this.enableAutoplay.bind(this), { once: true });
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    createPlaylist() {
        this.playlistList.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <div class="playlist-number">${index + 1}</div>
                <div class="playlist-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="playlist-duration">--:--</div>
                ${index === this.currentSongIndex ? '<i class="fas fa-music now-playing-icon"></i>' : ''}
            `;
            
            playlistItem.addEventListener('click', () => {
                this.selectSong(index);
            });
            
            this.playlistList.appendChild(playlistItem);
        });
        
        this.updatePlaylistHighlight();
    }
    
    updatePlaylistHighlight() {
        const items = this.playlistList.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentSongIndex) {
                item.classList.add('active');
                item.innerHTML = item.innerHTML.replace(
                    '<i class="fas fa-music now-playing-icon"></i>',
                    ''
                ) + '<i class="fas fa-music now-playing-icon"></i>';
            } else {
                item.classList.remove('active');
                item.innerHTML = item.innerHTML.replace(
                    '<i class="fas fa-music now-playing-icon"></i>',
                    ''
                );
            }
        });
    }
    
    showPlaylist() {
        this.playlistModal.classList.add('show');
        this.updatePlaylistHighlight();
    }
    
    hidePlaylist() {
        this.playlistModal.classList.remove('show');
    }
    
    selectSong(index) {
        if (index === this.currentSongIndex && this.isPlaying) {
            this.hidePlaylist();
            return;
        }
        
        this.currentSongIndex = index;
        this.loadSong(this.currentSongIndex, true);
        this.updatePlaylistHighlight();
        
        setTimeout(() => {
            this.hidePlaylist();
        }, 300);
    }
    
    loadSong(index, withTransition = false) {
        if (this.isChangingSong) return;
        this.isChangingSong = true;
        
        const song = this.playlist[index];
        
        if (withTransition) {
            // Bắt đầu hiệu ứng chuyển bài
            this.startSongTransition();
        }
        
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        
        this.audioPlayer.src = song.src;
        
        // Cập nhật thông tin bài hát với hiệu ứng
        if (withTransition) {
            const songInfo = document.querySelector('.song-info');
            songInfo.classList.add('changing');
            
            setTimeout(() => {
                this.songTitle.textContent = song.title;
                this.songArtist.textContent = song.artist;
                songInfo.classList.remove('changing');
            }, 200);
        } else {
            this.songTitle.textContent = song.title;
            this.songArtist.textContent = song.artist;
        }
        
        if (song.media) {
            this.loadMedia(song.media, withTransition);
        }
        
        this.audioPlayer.onerror = (e) => {
            console.error(`Lỗi khi load nhạc: ${song.src}`, e);
            this.handleAudioError(index);
        };
        
        this.audioPlayer.oncanplaythrough = () => {
            console.log(`Đã load xong: ${song.title}`);
            this.isChangingSong = false;
            
            if (this.isPlaying) {
                this.audioPlayer.play();
            }
        };
    }
    
    startSongTransition() {
        const mainVideo = document.querySelector('.main-video');
        mainVideo.classList.add('changing');
        
        setTimeout(() => {
            mainVideo.classList.remove('changing');
        }, 500);
    }
    
    loadMedia(mediaSrc, withTransition = false) {
        const mediaContainer = document.querySelector('.main-video');
        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(mediaSrc);
        
        if (withTransition) {
            mediaContainer.style.opacity = '0.3';
            mediaContainer.style.transform = 'scale(0.95)';
        }
        
        setTimeout(() => {
            mediaContainer.innerHTML = '';
            
            if (isImage) {
                const img = document.createElement('img');
                img.id = 'backgroundMedia';
                img.src = mediaSrc;
                img.alt = 'Background Media';
                img.onload = () => {
                    if (withTransition) {
                        setTimeout(() => {
                            mediaContainer.style.opacity = '1';
                            mediaContainer.style.transform = 'scale(1)';
                        }, 100);
                    }
                };
                mediaContainer.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.id = 'backgroundMedia';
                video.src = mediaSrc;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                
                video.oncanplaythrough = () => {
                    console.log(`Đã load xong media: ${mediaSrc}`);
                    video.play().catch(console.error);
                    
                    if (withTransition) {
                        setTimeout(() => {
                            mediaContainer.style.opacity = '1';
                            mediaContainer.style.transform = 'scale(1)';
                        }, 100);
                    }
                };
                
                video.onerror = (e) => {
                    console.error(`Lỗi khi load media: ${mediaSrc}`, e);
                    this.handleMediaError();
                };
                
                mediaContainer.appendChild(video);
            }
        }, withTransition ? 200 : 0);
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
        this.loadSong(this.currentSongIndex, true);
        this.updatePlaylistHighlight();
        if (this.isPlaying) {
            this.audioPlayer.play();
        }
    }
    
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.loadSong(this.currentSongIndex, true);
        this.updatePlaylistHighlight();
        if (this.isPlaying) {
            this.audioPlayer.play().catch(() => {
                setTimeout(() => this.nextSong(), 500);
            });
        }
    }
    
    setProgress(e) {
        const duration = this.audioPlayer.duration;
        const newTime = (e.target.value / 100) * duration;
        this.audioPlayer.currentTime = newTime;
        this.progressBar.style.width = `${e.target.value}%`; // Cập nhật .progress
    }
    
    updateProgress() {
        const { duration, currentTime } = this.audioPlayer;
        const progressPercent = duration ? (currentTime / duration) * 100 : 0;
        this.progress.value = progressPercent;
        this.progressBar.style.width = `${progressPercent}%`; // Cập nhật .progress
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
}

document.addEventListener('DOMContentLoaded', () => {
    new LofiPlayer();
});