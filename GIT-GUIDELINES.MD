# Version Control Guidelines

## 1. Cấu trúc thư mục dự án

Organization có 2 repo chính:

- `panpal/` — Frontend source code
- `panpal-backend/` — Backend source code

---

## 2. Quy trình làm việc với Git

### 2.1. Mỗi tính năng (feature) sẽ tạo một branch riêng để code

Branch **KHÔNG CODE TRỰC TIẾP TRÊN `main`**. Mọi thay đổi phải thông qua Pull Request (PR).

#### Cách đặt tên branch

Cấu trúc:

```bash
<folder>/<type>/<main-dev>/<short-description>
```

Trong đó:

- `<folder>`: `fe` hoặc `be`
- `<type>`:
  - `feature`: chức năng mới
  - `fix`: sửa lỗi
  - `refactor`: cải tiến code
  - `hotfix`: fix lỗi khẩn cấp
- `<short-description>`: mô tả ngắn gọn, dùng `-` nối từ
- `<main-dev>`: tên người thực hiện chính

**Ví dụ**:

- `fe/feature/thu/login-form`
- `be/fix/linh/user-authentication`
- `fe/refactor/quy/navbar-style`

---

## 3. Quy tắc viết commit message

### Format:

```bash
<type>: <short description>
```

#### Các `type`:

- `feat`: Thêm tính năng mới
- `fix`: Sửa lỗi
- `refactor`: Cải tiến code không ảnh hưởng đến hành vi
- `docs`: Thay đổi tài liệu
- `style`: Thay đổi về style/code format (không ảnh hưởng logic)
- `test`: Thêm/sửa test
- `chore`: Thay đổi nhỏ, cấu hình, build system...

**Ví dụ**:

- `feat: implement login with JWT`
- `fix: incorrect validation message for email`
- `refactor: simplify user service`
- `chore: update .gitignore`

---

## 4. Quy định tạo Pull Request (PR)

### Khi hoàn thành 1 tính năng:

1. Tạo Pull Request từ branch feature vào `main`.
2. Gán label: `FE`, `BE`, `feature`, `fix`, v.v.
3. Ghi mô tả rõ ràng về thay đổi.
4. Add người review để approve (ít nhất 2 người).

### ❗ Chỉ được merge khi:

- Có **ít nhất 2 người approve**.

---

## 5. Merge strategy

- **Không commit trực tiếp vào `main`**.
- Luôn dùng **Squash and Merge** để giữ log clean.
- Xoá branch sau khi merge để tránh rác.

---

## 6. Gợi ý công cụ hỗ trợ

- `prettier`, `eslint`, `husky` để giữ code format chuẩn
- `Conventional Commits` để tự động tạo changelog
- `GitHub Actions` hoặc `GitLab CI` để kiểm tra PR tự động

---

## 7. Cấu trúc dự án

- assets/: Chứa các tài nguyên tĩnh như hình ảnh, phông chữ và các tệp khác không cần phải xử lý bởi công cụ build (ví dụ: biểu tượng, logo).

- components/: Chứa các thành phần UI tái sử dụng như button, form, có thể được nhập vào các trang hoặc thành phần khác để tạo tính module cho ứng dụng.

- context/: Chứa các provider context để quản lý trạng thái toàn cục thông qua Context API của React.

- hooks/: Chứa các hook tùy chỉnh của React để quản lý trạng thái hoặc logic có thể tái sử dụng trong các thành phần.

- pages/: Chứa các thành phần trang của ứng dụng. Thư mục này có thể bao gồm các route cho các giao diện khác nhau của ứng dụng như trang Home, Profile.

  - private/: Bao gồm các trang/private routes yêu cầu người dùng phải đăng nhập để truy cập (ví dụ: Chat, MyNetwork, Profile).

  - public/: Bao gồm các trang công cộng có thể truy cập mà không cần xác thực (ví dụ: Home, Login, SignUp).

- routes/: Định nghĩa logic và các thành phần route để điều hướng giữa các trang hoặc giao diện khác nhau trong ứng dụng.

- services/: Chứa logic để tương tác với các hệ thống bên ngoài hoặc API (ví dụ: lấy dữ liệu từ backend hoặc xử lý xác thực).

- utils/: Chứa các hàm tiện ích hoặc phương thức trợ giúp có thể tái sử dụng trong toàn bộ ứng dụng, như định dạng, xác thực, hoặc các thao tác không liên quan đến logic nghiệp vụ.

---

Nếu bạn có thắc mắc hay cần hỗ trợ, hãy tag team lead hoặc mở issue.  
**Cảm ơn mọi người đã tuân thủ quy trình để đảm bảo chất lượng dự án!**
