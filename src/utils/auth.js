// 引入 cookies
import Cookies from "js-cookie";
const TokenKey = 'userToken';

// 获取本地的token
export const getToken = () => Cookies.get(TokenKey)

// 设置本地token
export const setToken = (token, times) =>
    Cookies.set(TokenKey, token, {
        expires: new Date(Date.now() + times * 1000)
    });

// 删除本地token
export const removeToken = () => Cookies.remove(TokenKey);