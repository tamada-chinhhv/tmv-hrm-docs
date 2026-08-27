---
sidebar_position: 34
---

# Attendance terminals (Hikvision)

**When to use:** Connect physical time clocks (e.g. Hikvision DS-K1T342/343) so check-in/out times flow into HRM automatically—not only mobile/app punches.

**Menu:** **System configuration** → **Attendance devices**

**Permissions:**

| Permission | Allows |
|------------|--------|
| **ATTENDANCE_DEVICE_VIEW** | List devices, details, events, sync schedule |
| **ATTENDANCE_DEVICE_MANAGE** | Add / edit / delete devices, mappings, connection checks, save sync schedule |

---

## Connection modes

| Mode | How it works | When to choose |
|------|--------------|----------------|
| **Direct** | HRM server **polls** the device on LAN via ISAPI | Device and server on same network; IT can reach device IP |
| **Push** | Device **posts** events to HRM when someone punches (HTTP Listening on device) | Server cannot poll, or device can HTTP-post to server |

**Push note:** after creating a device, copy **Host / URL / Port / Protocol** into the device’s **HTTP Listening** screen. The URL must target the **backend port** (often `:3001`), not the web UI port `:3000`.

---

## Automatic sync schedule

At the top of **Attendance devices**:

| Setting | Default | Meaning |
|---------|---------|---------|
| **Normal interval** | 5 min | Poll frequency **outside** shift windows |
| **Shift-window interval** | 1 min | Frequency **before/after** shift start and end |
| **Shift window** | ±30 min | Time band for the faster interval |

Shift start/end come from **System configuration** → **Work shift** (linked in the panel).

Scheduled sync runs for:

- All **Direct** devices.
- **Push** devices with **stored ISAPI credentials** (supplemental pull).

Push-only devices without ISAPI still receive punches via HTTP Listening; proactive pull is optional.

---

## Add a device

1. **System configuration** → **Attendance devices** → **Add device**.
2. Choose **Direct** or **Push**, enter name, IP, branch (office location).
3. **Direct:** ISAPI username/password if required.
4. **Push:** after create, copy HTTP Listening values to the terminal; **save the token immediately**—shown only once on create/rotate.

**Expected outcome:** Device appears in the list; status becomes **Online** after events or successful sync.

---

## Device detail dialog

Click **View** on a row:

| Tab | Contents |
|-----|----------|
| **Overview** | Status, sync, **Push check** (Push mode), check results |
| **Configuration** | Edit name, location, branch; ISAPI credentials; rotate ingest token (Push) |
| **Mapping** | Map device user ID → HRM employee |
| **Events** | Punch log (paginated) |
| **Reconcile** | Direct only—compare device users vs mappings |

### Push check / health

- **Push:** **Push check**—ingest URL, received events, ISAPI pull (if credentials stored).
- **Direct:** health icon on the list—ISAPI connectivity test.

Results show line-by-line (green / amber / red) with a copyable URL when needed.

---

## Employee mapping

Each punch sends a **device user ID** (e.g. `251`). HRM must know who that is:

1. **Auto:** if the ID matches **employee code** or HRM employee ID, mapping is created on new events.
2. **Manual:** **Mapping** tab when device ID differs from HRM code.

Without mapping, events are stored but **not written** to attendance until mapped (pending events can be reprocessed).

---

## Writing to attendance

When the server is configured for live writes (`SHADOW_MODE=false`, write enabled):

- **First** punch of the day → **check-in**.
- **Last** punch → **check-out**.
- Merged with app punches: **earliest** check-in, **latest** check-out.

Device office location is used as the attendance office (device flow bypasses app geofence).

---

## Troubleshooting

| Symptom | Suggestion |
|---------|------------|
| Push: no events | Verify **HTTP Listening** on device; correct server IP + backend port; test punch |
| Host shows `localhost` | IT sets `PUBLIC_SITE_ORIGIN` (LAN IP + backend port), **regenerate / rotate token** |
| ISAPI 401 on pull | Fix username/password on **Configuration** tab |
| Events but no attendance row | Check **Mapping**; ask IT about shadow vs live write mode |
| Faster sync at peak times | Adjust **Automatic sync schedule** and **Work shift** |

Server env details: [Technical appendix](../appendix/technical-reference.md).

---

## Related

- [System configuration](./system-settings.md) — work shift, branches
- [Permissions](./permissions.md) — `ATTENDANCE_DEVICE_*`
- [Attendance reports](./attendance-reports.md)

---
