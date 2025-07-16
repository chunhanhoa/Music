# Music Playlist

Bạn có thể truy cập dự án tại đây nè :> [Music Playlis](https://chunhanhoa.github.io/Music/)

## Giới thiệu

Chào mừng bạn đến với **Music Playlist** – nơi nghe nhạc và thư giãn nè.

## Mô tả

Music Playlist là ứng dụng web tối giản với giao diện đẹp mắt, cho phép bạn thưởng thức những playlist nhạc được tuyển chọn kèm theo hiển thị thời gian thực và video nền thư giãn. Hoàn hảo cho việc học tập, làm việc hoặc thư giãn với đa dạng thể loại nhạc.

## Tính năng

-  **Phát playlist nhạc** đa dạng thể loại với chất lượng cao
-  **Danh sách nhạc** hiển thị đầy đủ với giao diện modal đẹp mắt
-  **Chọn bài trực tiếp** từ playlist với hiệu ứng chuyển mượt mà
-  **Hiển thị thời gian** và ngày tháng theo thời gian thực
-  **Video/GIF nền** tự động thay đổi theo từng bài hát
-  **Điều khiển đầy đủ**: play/pause, next/previous, volume, progress bar
-  **Phím tắt**: Space (play/pause), mũi tên trái/phải (chuyển bài)
-  **Responsive design** tương thích mọi thiết bị
-  **Auto fallback** thông minh khi không tìm thấy file
-  **Hiệu ứng chuyển bài** mượt mà cho cả nhạc và video

## Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic và audio/video API
- **CSS3**: Animations, glassmorphism effects, responsive design
- **JavaScript ES6**: Class-based architecture, async/await, error handling
- **Font Awesome**: Icon system cho giao diện

## Hướng dẫn cài đặt

### Sử dụng trực tiếp
Truy cập [https://chunhanhoa.github.io/Music/](https://chunhanhoa.github.io/Music/) để sử dụng ngay!

### Cài đặt local

1. **Clone repository:**
   ```bash
   git clone https://github.com/Chunhanhoa/Music.git
   cd Music
   ```

2. **Thêm file media:**
   - Tạo thư mục `audio/` và thêm file .mp3
   - Tạo thư mục `images/` và thêm file .mp4/.gif cho video nền
   - Đặt file logo với tên `logo.png` trong thư mục `images/`
   - Đảm bảo tên file khớp với danh sách trong `script.js`

3. **Chạy ứng dụng:**
   - Mở `index.html` bằng trình duyệt
   - Hoặc sử dụng Live Server cho development

## Tùy chỉnh

### Thêm bài hát mới vào playlist
Chỉnh sửa mảng `playlist` trong `script.js`:
```javascript
this.playlist = [
    {
        title: "Tên bài hát",
        artist: "Tên nghệ sĩ", 
        src: "audio/file.mp3",
        media: "images/video.mp4" // hoặc .gif
    }
    // ... thêm bài khác
];
```
## Cách sử dụng

1. **Phát nhạc**: Click nút play hoặc nhấn Space
2. **Xem playlist**: Click nút playlist (icon list) để xem danh sách bài hát
3. **Chọn bài**: Click vào bài hát bất kỳ trong playlist để chuyển ngay
4. **Điều khiển**: Sử dụng các nút prev/next hoặc phím mũi tên
5. **Tua nhạc**: Click vào thanh progress bar để tua đến vị trí mong muốn
6. **Âm lượng**: Kéo thanh volume để điều chỉnh

## Responsive Design

- **Desktop**: Layout đầy đủ với tất cả tính năng
- **Tablet**: Tự động điều chỉnh kích thước phù hợp
- **Mobile Portrait**: Layout compact tối ưu
- **Mobile Landscape**: Layout 2 cột linh hoạt

## Phím tắt

- **Space**: Play/Pause nhạc
- **← →**: Chuyển bài trước/sau
- **Click progress bar**: Tua nhạc
- **Click playlist item**: Chọn bài trực tiếp

## Tính năng đặc biệt

### Playlist Modal
- Hiển thị danh sách đầy đủ các bài hát
- Highlight bài đang phát với icon nhạc
- Click để chuyển bài ngay lập tức
- Đóng tự động sau khi chọn bài

### Hiệu ứng chuyển bài
- Video/GIF nền thay đổi mượt mà theo bài hát
- Fade transition cho thông tin bài hát
- Scale animation cho video container
- Smooth progress update

### Auto Fallback System
- Tự động thử file tiếp theo nếu lỗi
- Hiển thị thông báo lỗi rõ ràng
- Chuyển sang playlist fallback nếu cần
- Log chi tiết trong Developer Console

## Xử lý lỗi

Ứng dụng có hệ thống xử lý lỗi thông minh:
- **File không tìm thấy**: Tự động chuyển bài tiếp theo
- **Lỗi network**: Hiển thị thông báo và thử lại
- **Lỗi autoplay**: Hướng dẫn người dùng click để phát
- **Media error**: Fallback sang media mặc định

## Lời cảm ơn

Cảm ơn bạn đã quan tâm đến dự án playlist nhạc này! Nếu thấy hữu ích, đừng quên chia sẻ với bạn bè để cùng nhau tận hưởng những giai điệu tuyệt vời nhé! 🎶
