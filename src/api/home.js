import request from "@/utils/request";

// 轮播图
export const getSwiperData = (queryObj) =>
  request({
    method: "POST",
    url: "/frontend/rotation/list",
    data: queryObj,
  });

// 商品推荐
export const getProductData = (queryObj) =>
  request({
    method: "POST",
    url: "/frontend/goods/list",
    params: queryObj,
  });

