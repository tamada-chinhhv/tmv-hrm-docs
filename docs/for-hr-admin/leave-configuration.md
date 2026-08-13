---
sidebar_position: 36
---

# Cấu hình & quản lý nghỉ phép

**Khi nào dùng:** Thiết lập cách hệ thống tính phép: số phép của nhân viên, quy tắc nghỉ không lương, loại phép và bộ lọc — cho khớp với chính sách nhân sự của công ty.

## Số phép (leave balance) hoạt động thế nào?

Số phép giống một "tài khoản" thời gian nghỉ của mỗi nhân viên: công ty **cấp** phép mỗi năm, nhân viên **dùng** khi nghỉ, phần còn lại là **số dư**.

Hệ thống lưu số phép theo **phút** để tính chính xác:

- 1 ngày công chuẩn = 480 phút (8 giờ × 60).
- Hiển thị theo **ngày** hoặc **phút** tùy cài đặt của công ty.

**Ví dụ:** 10 ngày phép = 4.800 phút. Nghỉ 1 ngày → trừ 480 phút; nghỉ 2 giờ → trừ 120 phút; còn lại 4.200 phút = 8,75 ngày.

**Độ dài ngày công khác nhau:** công ty có thể dùng ca 8 giờ (480 phút), 6 giờ (360 phút) hay 10 giờ (600 phút). Hệ thống tự quy đổi theo **số giờ ngày công** cấu hình tại **Cấu hình hệ thống** → **Ca làm việc** — hãy đảm bảo giá trị này đúng. Khi đổi số giờ ngày công, các quy đổi **sau đó** dùng mức mới; số phép hiện có giữ nguyên.

## Điều chỉnh số phép thủ công (override)

Bình thường nhân viên không thể nghỉ quá số phép còn lại. HR có thể **điều chỉnh thủ công** số phép cho các trường hợp đặc biệt: nhân viên mới vào giữa năm cần phép ngay, chính sách cho phép "ứng" phép, sửa lỗi tính toán, hoặc quyết định đặc cách.

**Các bước**

1. **Quản lý nhân sự** → **Nhân viên** → chọn nhân viên.
2. Mở tab **Số phép** → bấm **Điều chỉnh**.
3. Chọn loại phép; nhập **lượng điều chỉnh** (số dương để cộng, số âm để trừ).
4. Ghi **lý do** điều chỉnh (bắt buộc nên có, để tra soát sau) → **Lưu**.

Số phép cập nhật ngay và được ghi vào lịch sử hệ thống. Lưu ý: điều chỉnh ảnh hưởng mọi đơn nghỉ sau này; nếu nhập sai, tạo một điều chỉnh mới để sửa lại.

## Nghỉ không lương (đi muộn / về sớm)

Nghỉ không lương = nghỉ **không trừ vào số phép** (nhưng cũng không được trả lương cho thời gian đó). Thường dùng cho đơn **đi muộn / về sớm** khi nhân viên hết phép hoặc chính sách cho phép linh hoạt.

Khi nhân viên tạo đơn đi muộn / về sớm, có 2 lựa chọn: **trừ vào phép** (mặc định) hoặc **tính không lương** (số phép giữ nguyên).

**Bật tính năng:**

1. **Cấu hình hệ thống** → **Cấu hình nghỉ phép**.
2. Bật **Cho phép không lương với đi muộn / về sớm**.
3. Nhân viên sẽ thấy lựa chọn này khi tạo đơn đi muộn / về sớm.

Lưu ý: nghỉ không lương vẫn được **ghi nhận** trong hệ thống và vẫn cần **quản lý duyệt**; kiểm tra chính sách công ty trước khi bật.

## Loại phép & bộ lọc theo loại

**Thiết lập loại phép:**

1. **Cấu hình hệ thống** → **Loại nghỉ phép**.
2. Thêm / sửa loại. Mỗi loại có: **tên hiển thị** (ví dụ "Phép năm"), **mã** (ví dụ VACATION), **có lương hay không**, và **có yêu cầu số dư phép hay không**.
3. Lưu.

**Lọc đơn theo loại phép:** khi xem danh sách đơn (Duyệt nghỉ phép / Đơn xin phép), dùng **bộ lọc loại phép** để chỉ hiển thị một hoặc vài loại — ví dụ chỉ xem đơn nghỉ bệnh 3 tháng gần nhất để theo dõi, hoặc chỉ xem phép năm để sắp xếp người trực hè. Bộ lọc có ở: đơn của tôi, màn hình duyệt, báo cáo nghỉ phép, lịch sử nghỉ của từng nhân viên.

**Kết quả mong đợi:** Nhân viên thấy đúng các loại phép trong form xin phép; HR quản lý được số phép và theo dõi được từng loại nghỉ.

**Ví dụ thực tế**

- **Nhân viên mới vào giữa năm:** vào **Nhân viên** → chọn người → **Số phép** → điều chỉnh +5 ngày (2.400 phút), lý do "Phép theo tỷ lệ cho nhân viên vào giữa năm".
- **Hết phép nhưng cần nghỉ 3 giờ khám bệnh:** nhân viên gửi đơn; HR / quản lý duyệt theo dạng **không lương** — 3 giờ được ghi nhận nhưng không trừ phép.

**Gặp vấn đề?**

- Nhân viên hết phép không tạo được đơn → loại phép đang yêu cầu số dư; tắt **Yêu cầu số dư phép** trong cấu hình loại phép nếu công ty cho phép âm phép.
- Muốn hiển thị theo ngày thay vì phút → do cài đặt hiển thị của công ty; liên hệ quản trị hệ thống kiểm tra trong **Cấu hình hệ thống**.
- Đã duyệt không lương nhưng vẫn bị trừ phép → kiểm tra lựa chọn "không lương" khi duyệt và cấu hình loại phép; nếu sai, điều chỉnh lại số phép thủ công.
- Muốn xem số phép của tất cả nhân viên → **Quản lý nhân sự** → **Báo cáo số phép** (nếu có).

---
