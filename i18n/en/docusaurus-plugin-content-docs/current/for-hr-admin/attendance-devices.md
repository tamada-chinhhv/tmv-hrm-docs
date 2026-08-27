---
sidebar_position: 34
---

# Attendance terminals (Hikvision)

**When to use:** Connect office time clocks so check-in/out times flow into HRM automatically, alongside app punches.

**Menu:** **System configuration** → **Attendance devices**

**Permissions:** view or manage attendance devices (see [Permissions](./permissions.md)).

---

## Two connection modes

| On-screen option | How it works | When to choose |
|------------------|--------------|----------------|
| **Direct connection** | HRM **pulls** data from the device on the local network | Device and server on same LAN; IT can reach the device |
| **Device sends data** | Device **pushes** to HRM when someone punches | HRM cannot connect to the device, or they are on different networks |

**Device sends data:** after adding a device, copy **Listening configuration** (host, URL, port, protocol) into the device’s **HTTP Listening** screen. **Save the URL token immediately** — it is shown only once on create or **Generate new token**.

Devices that **only** use HTTP Listening do not require ISAPI login credentials. If credentials are stored, HRM can also pull data on the sync schedule (like direct connection).

---

## Automatic sync schedule

At the top of **Attendance devices** → **Automatic sync schedule**:

| Setting | Default | Meaning |
|---------|---------|---------|
| **Normal sync interval** | 5 min | How often data is fetched **outside** peak shift windows |
| **Peak sync interval** | 1 min | How often data is fetched **around** shift start/end |
| **Peak sync window** | ±30 min | Time band for the faster interval |

Shift times come from **Work shift** (linked in the panel).

---

## Add a device

1. **Attendance devices** → **Add attendance device**.
2. Choose connection mode, name, IP, branch.
3. **Direct connection:** enter device username/password.
4. **Device sends data:** configure HTTP Listening on the device; save the URL token.

**Expected outcome:** Device appears in the list; status becomes **Online** after events or successful sync.

---

## Device detail

Click **View details** on a row:

| Tab | Purpose |
|-----|---------|
| **Overview** | Status, connection check, **Sync now** |
| **Configuration** | Edit name, branch; credentials; new URL token |
| **Employee mapping** | Map device user ID → HRM employee |
| **Attendance events** | Punch log and processing status |
| **Reconcile** | Direct connection only — compare device users vs mappings |

### Check vs sync

| Action | Purpose | Writes attendance? |
|--------|---------|-------------------|
| **Check push connection** (device sends data) | Review URL, received events, warnings | **No** |
| **Check connection** (list, direct) | Test connectivity | **No** |
| **Sync now** | Fetch and process events (including pending) | **Yes** (when live write is enabled) |

If the check shows **Pending** events — that is normal; use **Sync now**.

---

## Employee mapping

Each punch sends a **device user ID** (e.g. `251`):

1. **Automatic:** ID matches **employee code** or **HRM employee ID** → mapping is created on new events.
2. **Manual:** **Employee mapping** tab → **Add mapping** when IDs differ.

Without mapping, events appear under **Attendance events** but **not** in the attendance table. After mapping, click **Sync now**.

---

## How times are written

- **First** punch of the day → check-in; **last** → check-out.
- **Merged with app:** earliest check-in, latest check-out.
- Supports **face, card, fingerprint** (depending on device setup).
- Device branch is used as the attendance office — **no** app GPS/WiFi required.

### Event status (Attendance events tab)

| Status | Meaning |
|--------|---------|
| **Pending** | Received, not fully processed |
| **Shadow / test mode** | Processed in test mode, **not written** to attendance |
| **Processed** | Written to attendance |
| **Failed** | Error — try **Sync now** or contact IT |
| **Ignored** | Not a valid punch event |

If **Attendance events** has rows but attendance is empty, check **test mode** (IT) or **employee mapping**. Technical details: [Technical appendix](../appendix/technical-reference.md).

---

## Delete a device

Deleting a device **deactivates** it (hidden from the active list, URL token revoked). **Event history and recorded attendance are kept** for audit.

---

## Troubleshooting

| Symptom | Suggestion |
|---------|------------|
| Device sends data: no events | Check HTTP Listening on device; correct server URL; test punch |
| Host shows `localhost` | Ask IT to reconfigure, then **Generate new token** |
| Cannot connect to device | Check username/password on **Configuration** |
| Events but no attendance | **Employee mapping**; **Sync now**; ask IT about test mode |
| Face OK, card/fingerprint not | Check **Attendance events** tab; device config; **Sync now** |
| Report slow to update (direct) | Wait 1–5 min for sync schedule, or **Sync now** |

---

## Related

- [System configuration](./system-settings.md)
- [Attendance reports](./attendance-reports.md)
- [Check-in / out](../for-employees/check-in-out.md)

---
