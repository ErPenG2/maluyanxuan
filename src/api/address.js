import request from "@/utils/request.js";
// 获取收货地址列表
export let getAddressList = (queryObj) =>
  request({
    method: "POST",
    url: "/frontend/consignee/list/",
    params: queryObj,
  });

// 编辑地址
export const updateAddress = (info) =>
  request({
    method: "POST",
    url: "/frontend/consignee/update/",
    data: (() => {
      const formData = new FormData();
      Object.keys(info).forEach((key) => {
        formData.set(key, info[key]);
      });
      return formData;
    })(),
  });

// 添加地址
export const addAddress = (info) =>
  request({
    method: "POST",
    url: "/frontend/consignee/add/",
    data: (() => {
      const formData = new FormData();
      Object.keys(info).forEach((key) => {
        formData.set(key, info[key]);
      });
      return formData;
    })(),
  });

// 删除地址
export const deleteAddress = (id) =>
  request({
    method: "POST",
    url: "/frontend/consignee/delete/",
    data: (() => {
      const formData = new FormData();
      formData.set("id", id);
      return formData;
    })(),
  });
