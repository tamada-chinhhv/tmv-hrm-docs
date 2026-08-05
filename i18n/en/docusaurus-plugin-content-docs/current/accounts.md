---
sidebar_position: 4
---

# Accounts & Login

#### 3.1 Step-by-step login

1. Open a browser (Chrome, Edge, etc.).
2. Go to **https://hrm.tamada.vn/login**
3. On the login form, enter:
   - **Username** — not email, not employee code.
   - **Password** — use the show/hide (eye) icon if needed.
4. Click **Login**.
5. If correct, you enter the main app (usually Attendance). If wrong, an error appears on the form.

**Login form fields:**

| Element | Description |
|---------|-------------|
| Logo / HRM title | Branding |
| **Username** | Required |
| **Password** | Required; minimum 6 characters for login |
| **Login** button | Submits credentials |
| Language switcher | Top bar (Vietnamese / English / Japanese) |

**Not on the form:** email field, “Forgot password” link, remember-me.

**Expected outcome:** You see the sidebar menu and your name in the top bar.

#### 3.2 Automatic username rules

When HR **creates a new employee**, the system suggests a username from **Full name** — **not** from email or employee code (`EMP001`, …).

**Processing steps:**

1. Trim leading/trailing spaces.
2. Convert to **lowercase** (login is not case-sensitive; stored as lowercase).
3. Remove diacritics (Vietnamese: ă→a, ê→e, …; **đ** → **d**).
4. Remove any character that is not `a–z` or `0–9` (spaces, hyphens, `@`, etc.).

**Examples:**

| Full name | Suggested username |
|-----------|-------------------|
| Nguyễn Văn An | `nguyenvanan` |
| Trần Thị Lan | `tranthilan` |
| Lê Văn Đức | `levanduc` |
| Nguyễn Văn A | `nguyenvana` |

**Employee code** (`EMP001`, `EMP002`, …) is auto-generated on save for records only — **not** used to log in.

##### Duplicate username

On save (manual create or Excel import), if the username is taken the system **auto-appends a numeric suffix**: `nguyenvanan` → `nguyenvanan1` → `nguyenvanan2` → …

- Default password (when omitted) equals the **allocated** username (after any suffix).
- The `admin` username remains reserved and is not used for normal accounts.

| Situation | Result |
|-----------|--------|
| `nguyenvanan` already exists, adding another Nguyễn Văn An | System stores `nguyenvanan1` (then `nguyenvanan2`, …) |
| Two names normalize to the same string | Each gets a distinct username via the numeric suffix |

##### Character limits

| Rule | Detail |
|------|--------|
| Length | 1–50 characters |
| Allowed characters | Only `a–z`, `0–9` after normalization |
| Case sensitivity | **No** — always stored lowercase |
| Change after create | **Not allowed** — username is locked permanently |

#### 3.3 Default password

| Question | Answer |
|----------|--------|
| Default password? | **Same as username** (e.g. `nguyenvanan` / `nguyenvanan`) |
| How is it set? | Uses username when HR does not enter a separate password on create |
| Forced change on first login? | **No** |
| Production system admin | `admin` / `admin123` on first deploy — backend auto-creates/restores after each deploy (`ensure-system-admin.mjs`); **change password immediately** after login |

**Example:** Employee **Nguyễn Văn An** → login: `nguyenvanan` / `nguyenvanan`.

> **Security:** Ask employees to **Change password** after account handover ([Section 3.4](#)).

#### 3.4 Change password

**Self-service (while logged in):**

1. Click your **name / avatar** (top right).
2. Choose **Change password**.
3. Enter current password, new password, and confirmation.
4. Click **Update password**.

**New password rules:**

| Rule | Valid example |
|------|----------------|
| Minimum 8 characters | `Abcdef1!` |
| At least 1 lowercase | `a` |
| At least 1 uppercase | `A` |
| At least 1 digit | `1` |
| At least 1 special character | `!` `@` `#` … |
| New = confirmation | Must match |

**Expected outcome:** After a successful change you **stay signed in** on the current browser; use the new password next time. Other tabs or devices may need to sign in again.

#### 3.5 Forgot password & admin reset

There is **no** “Forgot password” flow on the login page.

| Who | Action |
|-----|--------|
| **HR / Admin** (`EMPLOYEE_UPDATE`) | Open employee profile → **Reset password** → password becomes **username** again; employee must **sign in again** on all devices |
| **Employee** | Contact HR/IT — cannot recover from the login screen |

#### 3.6 Logout

1. Click your name (top) → **Logout**.
2. Confirm if prompted.

**Expected outcome:** You return to the login page; the session ends.

#### 3.7 System `admin` account (immutable)

Production always has username **`admin`** with role **ADMIN** and **all permissions**. Script `ensure-system-admin.mjs` runs automatically after migrations on backend startup.

| Rule | Detail |
|------|--------|
| First login | `admin` / `admin123` (if newly created) — change password immediately |
| Delete `admin` account | **Not allowed** |
| **Reset password** (HR button on profile) | **Not allowed** — cannot reset `admin` back to username |
| **Change password** (user menu → Change password) | **Allowed** — `admin` can change own password; redeploy **does not** revert to `admin123` |
| Change role / deactivate `admin` | **Not allowed** — always ADMIN + ACTIVE |
| Edit `admin` profile by other users | **Not allowed** |
| Assign **ADMIN** role to others | **Only** username `admin` |
| Edit **ADMIN** role permissions | **Only** username `admin`; system always grants full permissions to ADMIN |
| Username `admin` | **Reserved** — cannot create another employee with this username |

---
