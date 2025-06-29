# Lofi Music

Bạn có thể truy cập dự án tại đây nè :> [Lofi Music](https://chunhanhoa.github.io/Music/)

## Giới thiệu

Chào mừng bạn đến với **Lofi Music** – nơi âm nhạc lofi gặp gỡ thời gian, tạo nên không gian học tập và thư giãn hoàn hảo! 🎵✨

## Mô tả

Lofi Music là ứng dụng web tối giản với giao diện đẹp mắt, cho phép bạn thưởng thức những giai điệu lofi chill kèm theo hiển thị thời gian thực và video nền thư giãn. Hoàn hảo cho việc học tập, làm việc hoặc thư giãn.

## Tính năng

- 🎵 **Phát nhạc lofi** chất lượng cao với playlist được tuyển chọn
- ⏰ **Hiển thị thời gian** và ngày tháng theo thời gian thực
- 🖼️ **Video nền** tự động chuyển đổi tạo không gian thư giãn
- 🎛️ **Điều khiển đầy đủ**: play/pause, next/previous, volume
- ⌨️ **Phím tắt**: Space (play/pause), mũi tên trái/phải (chuyển bài)
- 📱 **Responsive design** tương thích mọi thiết bị
- 🔄 **Auto fallback** thông minh khi không tìm thấy file

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
   - Tạo thư mục `images/` và thêm file .mp4
   - Đảm bảo tên file khớp với danh sách trong `script.js`

3. **Chạy ứng dụng:**
   - Mở `index.html` bằng trình duyệt
   - Hoặc sử dụng Live Server cho development

## Tùy chỉnh

### Thêm nhạc mới
Chỉnh sửa mảng `playlist` trong `script.js`:
```javascript
this.playlist = [
    {
        title: "Tên bài hát",
        artist: "Tên nghệ sĩ", 
        src: "audio/file.mp3",
        video: "images/video.mp4"
    }
    // ... thêm bài khác
];
```

### Thay đổi video nền
Cập nhật mảng `backgroundVideos` và điều chỉnh thời gian chuyển video.

### Custom styling
Chỉnh sửa biến CSS trong `style.css` để thay đổi màu sắc và hiệu ứng.

## Responsive Design

- **Desktop**: Layout đầy đủ với tất cả tính năng
- **Tablet**: Tự động điều chỉnh kích thước phù hợp
- **Mobile Portrait**: Layout compact tối ưu
- **Mobile Landscape**: Layout 2 cột linh hoạt

## Phím tắt

- **Space**: Play/Pause nhạc
- **← →**: Chuyển bài trước/sau
- **Click progress bar**: Tua nhạc

## Xử lý lỗi

Ứng dụng có hệ thống fallback thông minh:
- Tự động thử file tiếp theo nếu lỗi
- Hiển thị thông báo lỗi rõ ràng
- Chuyển sang gradient nền nếu không có video
- Log chi tiết trong Developer Console


## Lời cảm ơn

Cảm ơn bạn đã quan tâm đến dự án âm nhạc nhỏ này! Nếu thấy hữu ích, đừng quên chia sẻ với bạn bè để cùng nhau tận hưởng những giai điệu lofi thư giãn nhé! 🎶
