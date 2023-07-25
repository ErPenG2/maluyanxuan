import request from '@/utils/request';

// 获取数据
export const getGoodsDetail = id =>
    request({
        method: 'POST',
        url: '/frontend/goods/detail',
        params: {
            id,
        },
    });
