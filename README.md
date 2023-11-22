# Peer.js Cam

Can be used to use remove device camera via network.

## Supported Query Parameters

Example: `https://cam.zardoy.com/?reconnect=1`

### On Remote Device

| QS            | Action                                       |
| ------------- | -------------------------------------------- |
| `reconnect=1` | Will keep page refreshing for auto-reconnect |
<!-- | `hd=1`        | Force HD video for remote device             | -->
| `audio=1`     | Enables audio transmission             |

### On Host Device

| QS         | Action                                                                               |
| ---------- | ------------------------------------------------------------------------------------ |
| `stream=1` | ID of stream to use (defaults to 0, first one, can be 1 for second stream and so on) |
