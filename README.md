# Fshare Tool
Fshare Tool is a utility to help to:
1. Download file directly from fshare/non-fshare page.
2. Play upstream movie (via VLC) without signed-in.
3. Play/download directly from Fshare folder.
4. View Activities (History) download, get Direct-Link, Play video.
5. Support resume previous video playback.

## Get Fshare API Keys
1. Go to https://www.fshare.vn/api-doc
2. Click `Lấy App Key` and input your information, FSHARE_APP_KEY and FSHARE_USER_AGENT will send to you email.

## Setup Server

```bash
git clone git@github.com:dhhiep/fshare_tool.git
cd fshare_tool
cp .env.template .env
[REPLACE YOUR KEY TO .env]
rake db:create db:migrate db:seed
foreman start
```

*Check your server ready:*
```bash
curl 'http://localhost:7777/api/v1/health-check'

=> {"message":"Welcome to Fshare Tool"}%
```

## Setup Chrome Extension

1. Go to [chrome://extensions/](chrome://extensions/)
2. Enable `Developer mode` (at right top corner).
3. Click `Load unpacked` browse to `[fshare_tool cloned]/browser_extenstions/chrome`.
4. Click to Fshare Tool Extension Icon to open popup configuration `section 1` (image `config-popup`).
5. Input your server address at `section 2` (image `config-popup`).

+ **Note**:
  - config-popup: ![config-popup](/public/docs/config-popup.jpg)

## Usage
#### I. Fshare Folder
1. Goto Fshare Folder page (For example: https://www.fshare.vn/folder/26CZMYLU8CN2).
2. Waiting for processed section display.
![fshare-folder-processed-list](/public/docs/fshare-folder-processed-list.jpg)
1. Actions:
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
#### II. Fshare File
  1. Goto Fshare File page. For example: https://www.fshare.vn/file/T3Q59LYOCEMQGVR.
  2. Waiting for popup display.
   ![fshare-file-popup](/public/docs/fshare-file-popup.jpg)
  3. Actions:
      1. Download.
      2. Play in VLC.
      3. Copy Direct Link: Direct Link will copy to clipboard.
      4. Share LAN Link: Share link download to other in LAN.
      ![fshare-file-share-lan-link](/public/docs/fshare-file-share-lan-link.jpg)

      **Note:** Re-click `Save` at `config-popup` (section III. Install Chrome Extension) update newest your LAN IP.
#### III. Non-Fshare page
  1. Goto site contain fshare link (For example: https://maclife.vn/bo-cai-macos-monterey-12-cac-phien-ban.html).
  2.  Hover on fshare url
  ![non-fshare-page-hover-fshare-url](/public/docs/non-fshare-page-hover-fshare-url.jpg)
#### IV. Activities (History)
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
