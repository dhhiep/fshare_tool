# Fshare Tool
Fshare tool is a utility to help to download/play upstream movie (via VLC) without signed-in.

### 1. Get Fshare API Keys
1. Go to https://www.fshare.vn/api-doc
2. Click `Lấy App Key` and input your information, FSHARE_APP_KEY and FSHARE_USER_AGENT will send to you email.

### 2. Start Server

```bash
git clone git@github.com:dhhiep/fshare_tool.git
cd fshare_tool
cp .env.template .env
[REPLACE YOUR KEY TO .env]
rake db:create db:migrate db:seed
rails s --port 7777
```

*Check your server ready:*
```bash
➜ curl 'http://localhost:7777'

{"message":"Welcome to Fshare Tool"}%
```

### 3. Install Chrome Extension

1. Go to [chrome://extensions/](chrome://extensions/)
2. Enable `Developer mode` (at right top corner)
3. Click `Load unpacked` browse to `browser_extenstions/chrome`
4. Go to Fshare file/folder link and enjoy
