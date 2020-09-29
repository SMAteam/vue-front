import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/table/getList",
    method: "post",
    data,
  });
}

export function doEdit(data) {
  return request({
    url: "/table/doEdit",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/table/doDelete",
    method: "post",
    data,
  });
}

export function getList1(data) {
  return request({
    url: "http://152.136.59.62:8000/earthquake_macroscopic/list1",
    method: "post",
    data,
  });
}
export function getLine1(data) {
  return request({
    url: "http://152.136.59.62:8000/earthquake_macroscopic/line1",
    method: "post",
    data,
  });
}
