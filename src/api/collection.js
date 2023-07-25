import request from "@/utils/request.js";

// 添加收藏
export const addcollection = (data) =>
  request({
    method: "POST",
    url: "/frontend/collection/add/",
    data,
  });

// 取消收藏
export const delcollection = (data) =>
  request({
    method: "POST",
    url: "/frontend/collection/delete/",
    data,
  });

  
// 我的收藏列表
export const getCollectionList = (data) =>
  request({
    method: "POST",
    url: "/frontend/collection/list/",
    data,
  });