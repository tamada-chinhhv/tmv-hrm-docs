---
sidebar_position: 3
---

# Requirements Before Use

#### 2.1 Supported browsers

Use a **recent version** of a browser on desktop or mobile:

| Browser | Recommended |
|---------|:-------------:|
| Google Chrome | Yes |
| Microsoft Edge | Yes |
| Mozilla Firefox | Yes |
| Safari (macOS / iOS) | Yes |

**Location-based attendance:** The system accepts **GPS inside a branch radius** or **office WiFi (BSSID match)** — either one is enough. On **web**, the browser must allow **Location**; browsers cannot read WiFi BSSID, so web check-in uses GPS only. On **mobile** (when integrated), the client sends `wifi.ssid` and `wifi.bssid`.

**Expected outcome:** The HRM page loads and the login form displays correctly.

#### 2.2 Access requirements

| Requirement | Description |
|-------------|-------------|
| **HRM account** | Created by HR or Admin when adding an employee record |
| **Username & password** | Provided by HR/IT initially |
| **Role & permissions** | Control which menus and actions you can use |
| **Network** | Access to the HRM server (URL below) |

New employees **cannot self-register** — HR must create the profile first.

#### 2.3 Login URL

| Environment | URL |
|-------------|-----|
| **Production** | [https://hrm.tamada.vn/](https://hrm.tamada.vn/) |
| **Login page** | [https://hrm.tamada.vn/login](https://hrm.tamada.vn/login) |

After a successful login, you are redirected to **Attendance** (`/time/attendance`) or the page you tried to open before being sent to login.

---
