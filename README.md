# Electron OSS Livestream Demo

通过阿里云对象储存 OSS 进行直播的 Electron 简单应用例子。

- [x] 通过 [ali-oss](https://github.com/ali-sdk/ali-oss) 创建直播 channel
- [x] 通过 [express](https://expressjs.com/) 及 [socket.io](https://socket.io) 进行聊天
- [x] 通过 [video.js](https://videojs.com/) 直播拉流


## Usage

```bash
# Clone this repository
git clone https://github.com/Evilran/electron-oss-livestream.git
# Go into the repository
cd electron-oss-livestream
# Install dependencies
npm install
# Run chat server and put OSS live channel
npm run server

[!] Use OBS or other softwares for live streaming and pushing to OSS live channel.

# Run the app
npm start
```

## Reference

 [**electron-chat-app-demo**](https://github.com/demian85/electron-chat-app-demo)  

