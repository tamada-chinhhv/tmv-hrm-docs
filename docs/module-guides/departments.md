---
sidebar_position: 10
---

# Phòng ban & Chức vụ

- **Phòng ban:** cây cha/con; cần `DEPARTMENT_VIEW` / `DEPARTMENT_MANAGE`.
- **Chức vụ:** danh mục **toàn công ty** (mã `code` unique); mỗi chức vụ **bắt buộc** gắn một role (`roleId`); không còn `level` / theo phòng ban. Nhân viên chọn phòng + chức vụ; nhóm quyền mặc định lấy từ chức vụ, có thể đổi trên form nhân viên.
