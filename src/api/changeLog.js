import request from "@/utils/request";

export function getCLList(data) {
  return request({
    url: "/changeLog/getList",
    method: "post",
    data,
  });
}
