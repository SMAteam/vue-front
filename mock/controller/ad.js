const data = [
  {
    title: "敬请期待新版本，时间段内更新新功能",
    url: "https://chu1204505056.gitee.io/vue-admin-beautiful-pro/#/index",
  },
];
module.exports = [
  {
    url: "/ad/getList",
    type: "get",
    response() {
      return {
        code: 200,
        msg: "success",
        data,
      };
    },
  },
];
