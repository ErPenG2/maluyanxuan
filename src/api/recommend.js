import request from '@/utils/request';

// 文章列表
export const getArticleList = (queyObj, id) =>
    request({
        method: 'POST',
        url: '/frontend/article/list',
        params: queyObj,
        data: (() => {
            const data = new FormData();
            data.set('id', id);
            return data;
        })(),
    });

// 添加种草文章
export const addArticle = articleInfo =>
    request({
        method: 'POST',
        url: '/frontend/article/add',
        data: (() => {
            const formData = new FormData();
            Object.keys(articleInfo).forEach(key =>
                formData.set(key, articleInfo[key])
            );
            return formData;
        })(),
    });

// 我的文章列表
export const myArticleList = queryObj =>
    request({
        method: 'POST',
        url: '/frontend/article/list',
        params: queryObj,
    });

// 文章详情
export const getArticleInfo = id =>
    request({
        method: 'POST',
        url: '/frontend/article/detail/',
        params: {
            id,
        },
    });