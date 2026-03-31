# Website Bán Quần Áo Trực Tuyến (E-Commerce Clothing Store)

> Dự án Website thương mại điện tử chuyên cung cấp các sản phẩm thời trang, được xây dựng với kiến trúc Client-Server hiện đại. Dự án tích hợp nhiều tính năng nâng cao như thanh toán trực tuyến (VNPay, MoMo), đăng nhập qua Google, và đặc biệt là tính năng Thử đồ Ảo (Virtual Try-On) ứng dụng AI.

## Công Nghệ Sử Dụng (Tech Stack)

### Frontend (Client)
- Framework/Library: React 19, Vite
- Routing: React Router DOM v7
- UI/UX: React Bootstrap, Bootstrap 5
- Icons: React Icons, React Bootstrap Icons
- State/HTTP: Axios
- Biểu đồ/Thống kê: Chart.js, React-Chartjs-2
- Tiện ích khác: `@react-oauth/google` (Đăng nhập Google), `react-toastify` (Thông báo), `swiper` (Slider/Carousel)

### Backend (Server)
- Môi trường & Framework: Node.js, Express.js
- Cơ sở dữ liệu: MySQL (`mysql2`)
- Xác thực & Bảo mật: JSON Web Tokens (JWT), `bcryptjs`, `google-auth-library`
- Lưu trữ ảnh: Cloudinary, Multer
- Gửi Email & Tự động hoá: Nodemailer, `node-cron`
- Tích hợp AI/Machine Learning: `@gradio/client` (Xử lý tính năng Virtual Try-On)
- Cổng thanh toán: VNPay, MoMo (dựa trên tài liệu tích hợp)

---

## Chức Năng Nổi Bật (Key Features)

### Phía Người Dùng (Customer/User)
- Xác thực người dùng: Đăng ký, Đăng nhập (Tài khoản hệ thống & Google OAuth), Quên/Đặt lại mật khẩu.
- Duyệt sản phẩm: Xem danh sách sản phẩm, Lọc theo danh mục/kiểu dáng/kích cỡ, Xem chi tiết sản phẩm.
- Thử đồ ảo (Virtual Try-On): Cho phép người dùng xem thử trang phục trên người mẫu ảo thông qua công nghệ AI (Gradio).
- Giỏ hàng & Đặt hàng: Quản lý giỏ hàng, Thanh toán online an toàn.
- Quản lý đơn hàng: Theo dõi trạng thái đơn hàng, Xem lịch sử mua hàng, Yêu cầu hoàn/trả hàng.
- Tương tác: Đánh giá (Review) đồ đã mua, Thêm sản phẩm vào danh sách yêu thích (Wishlist).
- Thông tin khác: Trang tin tức thời trang/Blog, Chăm sóc khách hàng cơ bản.

### Phía Quản Trị (Admin Dashboard)
- Thống kê tổng quan: Dashboard trực quan sử dụng Chart.js để phân tích doanh thu, đơn hàng, và số lượng người dùng.
- Quản lý danh mục & sản phẩm: Thêm, sửa, xóa (CRUD) các nhóm hàng, quản lý thuộc tính (size, color...).
- Quản lý đơn hàng: Check và duyệt đơn hàng, theo dõi quá trình giao nhận hàng.
- Quản lý người dùng & Đánh giá: Phân quyền, khóa/mở khóa tài khoản, kiểm duyệt các lượt review.
- Quản lý Marketing: Tạo & theo dõi các mã giảm giá, voucher khuyến mãi.
- Quản lý Hậu mãi: Xử lý các yêu cầu đổi trả (Returns) từ khách hàng.

---

## Hướng Dẫn Cài Đặt (Setup Instructions)

### Yêu Cầu Kiểu Quyết (Prerequisites)
- [Node.js](https://nodejs.org/en/) (Khuyên dùng bản >= 18)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 1. Cài Đặt Cơ Sở Dữ Liệu
Bạn tìm thấy file `quanaoshop.sql` ở thư mục gốc của dự án. Hãy Import file SQL này vào MySQL Workbench hoặc phpMyAdmin để khởi tạo cấu trúc các bảng và dữ liệu mẫu cần thiết.

### 2. Cài Đặt Backend (Server)
Mở terminal và di chuyển vào thư mục `server`:
```bash
cd server
npm install
```

Tạo một file `.env` ở trong thư mục `server` và khai báo các biến môi trường cần thiết (ví dụ: Thông tin Database, Cloudinary API, JWT Secret, cấu hình Google Auth, v.v.).

Chạy server:
```bash
npm run dev # Dùng cho môi trường local/phát triển
```
> Backend API server sẽ chạy tại địa chỉ port đã cung cấp ở file `.env` (thường là 5000 hoặc 8080).

### 3. Cài Đặt Frontend (Client)
Mở một terminal mới (chuột phải split terminal) và di chuyển vào thư mục `client`:
```bash
cd client
npm install
```

Chạy client:
```bash
npm run dev
```
> Client sẽ bắt đầu và thường chạy ở địa chỉ mặc định của Vite: `http://localhost:5173`

---
*Về dự án này: Dự án được phát triển nhằm mục đích tích lũy thực tế cho Web Development (Full-stack), đồng thời áp dụng giao diện UI/UX đẹp mắt và hệ thống đa năng (Virtual Try-On, Thanh toán...) giúp ứng dụng trở nên thực tiễn hơn cho E-Commerce.*