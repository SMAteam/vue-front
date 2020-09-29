import request from "@/utils/request";

export function getEarthQuakeData(data) {
  return request({
    url: "http://152.136.59.62:8000/earthquake_macroscopic/map1",
    method: "post",
    data,
  });
}
export function getStormData(data) {
  return request({
    url: "/storm/getStormData",
    method: "post",
    data,
  });
}
export function getTyphoonData(data) {
  return request({
    url: "/typhoon/getTyphoonData",
    method: "post",
    data,
  });
}
