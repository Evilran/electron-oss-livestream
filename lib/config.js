const config = {
  OSS: {
    1: "http://[bucket].[region].aliyuncs.com/[livestream]/[livestream].m3u8",
    2: "http://[bucket].[region].aliyuncs.com/[livestream]/[livestream].m3u8",
  },
  serverList: [
    { value: 1, name: "Server 1" },
    { value: 2, name: "Server 2" },
  ],
  chatServer: "http://localhost:3010",
  channelId: "[livestream]",
  channelConf: {
    Description: "this is channel 1",
    Status: "enabled",
    Target: {
      Type: "HLS",
      FragDuration: "10",
      FragCount: "5",
      PlaylistName: "[livestream].m3u8",
    },
  },
  OSSConf: {
    region: "[region]",
    accessKeyId: "[accessKeyId]",
    accessKeySecret: "[accessKeySecret]",
    bucket: "[bucket]",
  },
};
module.exports = config;
