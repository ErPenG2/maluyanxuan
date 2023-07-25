import request from "@/utils/request.js";

// 添加购物车
export const addCart = (data) =>
  request({
    method: "POST",
    url: "/frontend/cart/add/",
    data,
  });
// 编辑购物车
export const editCart = (data) =>
  request({
    method: "POST",
    url: "/frontend/cart/update/",
    data,
  });
// 购物车列表
export const cartList = (data) =>
  request({
    method: "POST",
    url: "/frontend/cart/list/",
    data,
  });
// 删除购物车
export const deleteCart = ids=>
  request({
    method: "POST",
    url: "/frontend/cart/delete/",
    data:{
      ids
    }
  });
