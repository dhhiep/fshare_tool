# Fshare Tool

Fshare Tool is a utility designed to help you with the following tasks:

1. Download files directly from Fshare or non-Fshare pages.
2. Play upstream movies (via VLC) without needing to sign in.
3. Play or download files directly from Fshare folders.
4. View download activities (history) and get direct links, and play videos.
5. Support resume playback of previously played videos.

## Get Fshare API Keys

To obtain Fshare API keys, follow these steps:

1. Go to [https://www.fshare.vn/api-doc](https://www.fshare.vn/api-doc)
2. Click `Lấy App Key` and provide your information. `FSHARE_APP_KEY` and `FSHARE_USER_AGENT` will be sent to your email address.

## Setup Server

### Via Docker

```bash
touch ~/.config/rclone/rclone.conf # create config file if file config does not existed
```

```bash
docker run -d --name fshare_tool \
  --restart unless-stopped \
  -p 7777:3000 \
  -v ~/fshare_tool_dbs:/var/workspace/db/sqlite_dbs \
  -v ./log:/var/workspace/log \
  -v ~/.config/rclone/rclone.conf:/var/workspace/.config/rclone/rclone.conf \
  -e VLC_RC_HOST=host.docker.internal \
  -e VLC_RC_PORT=7654 \
  -e FSHARE_USER_EMAIL=REPLACE_YOUR_KEY@gmail.com \
  -e FSHARE_PASSWORD=REPLACE_YOUR_KEY \
  -e FSHARE_APP_KEY=REPLACE_YOUR_KEY \
  -e FSHARE_USER_AGENT=REPLACE_YOUR_KEY \
  hoanghiepitvnn/fshare_tool:latest
```

Note:
1. Because [windows does not recognize symbol "\\"](https://github.com/dhhiep/fshare_tool/issues/1) so we need using one line for command docker run:
```bash
docker run -d --name fshare_tool --restart unless-stopped -p 7777:3000 -v ~/fshare_tool_dbs:/var/workspace/db/sqlite_dbs -v ./log:/var/workspace/log -v ~/.config/rclone/rclone.conf:/var/workspace/.config/rclone/rclone.conf -e VLC_RC_HOST=host.docker.internal -e VLC_RC_PORT=7654 -e FSHARE_USER_EMAIL=REPLACE_YOUR_KEY@gmail.com -e FSHARE_PASSWORD=REPLACE_YOUR_KEY -e FSHARE_APP_KEY=REPLACE_YOUR_KEY -e FSHARE_USER_AGENT=REPLACE_YOUR_KEY hoanghiepitvnn/fshare_tool:latest
```

2. For [support NAS Synology run on docker](https://github.com/dhhiep/fshare_tool/issues/7) you switch to tag `:nas` instead of `:latest`
```
docker run -d --name fshare_tool \
  --restart unless-stopped \
  -p 7777:3000 \
  -v ~/fshare_tool_dbs:/var/workspace/db/sqlite_dbs \
  -v ./log:/var/workspace/log \
  -v ~/.config/rclone/rclone.conf:/var/workspace/.config/rclone/rclone.conf \
  -e VLC_RC_HOST=host.docker.internal \
  -e VLC_RC_PORT=7654 \
  -e FSHARE_USER_EMAIL=REPLACE_YOUR_KEY@gmail.com \
  -e FSHARE_PASSWORD=REPLACE_YOUR_KEY \
  -e FSHARE_APP_KEY=REPLACE_YOUR_KEY \
  -e FSHARE_USER_AGENT=REPLACE_YOUR_KEY \
  hoanghiepitvnn/fshare_tool:nas
```

### Check server is ready or not, please run command below

```bash
curl 'http://localhost:7777/api/v1/health-check'

=> {"message":"Welcome to Fshare Tool"}%
```

## Setup Chrome Extension

1. Go to [chrome://extensions/](chrome://extensions/)
2. Enable `Developer mode` (at right top corner).
3. Click `Load unpacked` browse to `[fshare_tool cloned]/browser_extensions/chrome`.
4. Click to Fshare Tool Extension Icon to open popup configuration `section 1` (image `config-popup`).
5. Input your server address at `section 2` (image `config-popup`).

+ **Note**:
  + config-popup: ![config-popup](/public/docs/config-popup.jpg)

## Enable VLC Telnet Remote Control

1. Open VLC Preferences
2. At Tab `Interface` click `Show All`
3. Choose Interface > Main Interfaces and check on:
   1. Remote Control Interface
   2. Lua Interpreter
   3. Telnet
4. At Interface > Main Interfaces > Lua, set field Lua CLI > TCP command input is `:7654` (your port)
5. Restart VLC
  ![vlc_lua_interface_config](/public/docs/vlc_lua_interface_config.jpg)

## Usage

### I. Fshare Folder

1. Goto Fshare Folder page (For example: [https://www.fshare.vn/folder/26CZMYLU8CN2](https://www.fshare.vn/folder/26CZMYLU8CN2)).
2. Waiting for processed section display.
![fshare-folder-processed-list](/public/docs/fshare-folder-processed-list.jpg)
3. Actions:
     1. Click on folder: Expand folder.
     2. Double click on line item is:
         1. Expand if line item is folder.
         2. Play in VLC if line item is `video` (For example: `MP4, AVI, MKV`).
         3. Add to VLC (playing) if line item is `subtitle` (For example: `SRT, SSA, SUB`).
         4. Download if line item is `other` (For example: `ISO, RAR, ZIP`).
     3. Right click on line item
      ![fshare-folder-context-menu](/public/docs/fshare-folder-context-menu.jpg)
     4. Click buttons in column `Actions`
      ![fshare-folder-column-actions](/public/docs/fshare-folder-column-actions.jpg)

### II. Fshare File

  1. Goto Fshare File page. For example: [https://www.fshare.vn/file/T3Q59LYOCEMQGVR](https://www.fshare.vn/file/T3Q59LYOCEMQGVR).
  2. Waiting for popup display.
   ![fshare-file-popup](/public/docs/fshare-file-popup.jpg)
  3. Actions:
      1. Download.
      2. Play in VLC.
      3. Copy Direct Link: Direct Link will copy to clipboard.

### III. Non-Fshare page

  1. Goto site contain fshare link (For example: [https://maclife.vn/bo-cai-macos-monterey-12-cac-phien-ban.html](https://maclife.vn/bo-cai-macos-monterey-12-cac-phien-ban.html)).
  2. Hover on fshare url
  ![non-fshare-page-hover-fshare-url](/public/docs/non-fshare-page-hover-fshare-url.jpg)

### IV. Activities (History)

1. Open Fshare Tool Extension - Configuration popup. Click on `Activities`
![fshare-config-activities](/public/docs/fshare-config-activities.jpg)
2. Activities page
![activities-page](/public/docs/activities-page.jpg)

#### IV. Playbacks

1. Open Fshare Tool Extension - Configuration popup. Click on `Playbacks`
![fshare-config-playbacks](/public/docs/fshare-config-playbacks.jpg)
2. Playbacks page
![playbacks-page](/public/docs/playbacks-page.jpg)

## License

Fshare Tool is licensed under the MIT license.

See LICENSE for the full license text.
