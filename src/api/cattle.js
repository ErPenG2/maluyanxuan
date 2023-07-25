import request from '@/utils/request';


// 点赞列表
export const getCattleByType = queryObj =>
    request({
        method: 'POST',
        url: '/frontend/praise/list/',
        params: queryObj,
    });

// 点赞
export const addCattle = ({ type, object_id }) =>
    request({
        method: 'POST',
        url: '/frontend/praise/add/',
        data: (() => {
            const data = new FormData();
            data.set('type', type);
            data.set('object_id', object_id);
            return data;
        })(),
    });

// 取消点赞根据id
export const deleteCattleById = id =>
    request({
        method: 'POST',
        url: '/frontend/praise/delete/',
        data: (() => {
            const data = new FormData();
            data.set('id', id);
            return data;
        })(),
    });


// 取消点赞
export const deleteCattleByType = ({ type, object_id }) =>
    request({
        method: 'POST',
        url: '/frontend/praise/delete/',
        data: (() => {
            const data = new FormData();
            data.set('type', type);
            data.set('object_id', object_id);
            return data;
        })(),
    });