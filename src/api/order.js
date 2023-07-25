import request from '@/utils/request';

// 我的订单
export const getOrder = queryObj =>
    request({
        method: 'POST',
        url: '/frontend/order/list/',
        params: queryObj,
    });
// 创建订单
export const createOrder = data =>
    request({
        method: 'POST',
        url: '/frontend/order/add/',
        data
    });
// 修改订单状态
export const editOrderStatus = info =>
    request({
        method: 'POST',
        url: '/frontend/order/add/',
        data: info,
    });