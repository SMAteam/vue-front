import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/blacklist/getList",
    method: "post",
    data,
  });
}

//自己加的测试方法，随时可以删掉
export function getTestList(data) {
  return request({
    url: "http://152.136.59.62:8001/ceshi/test",
    method: "get",
    data,
  });
}
