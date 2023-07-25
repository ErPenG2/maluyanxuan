import request from "@/utils/request.js";

// 登录接口
export let userLogin = (data) => {
  return request({
    method: "POST",
    url: "/frontend/sso/login",
    data,
  });
};
// 注册接口
export let userRegister = (data) => {
  return request({
    method: "POST",
    url: "/frontend/sso/register",
    data,
  });
};

// 我的信息
export let getUserInfo = (data) => {
  return request({
    method: "POST",
    url: "/frontend/my/info/",
    data,
  });
};

// 退出登录
export let logout = (data) => {
  return request({
    method: "POST",
    url: "/frontend/sso/logout",
    data,
  });
};

// 修改密码
export let resetPwd = (data) => {
  return request({
    method: "POST",
    url: "/frontend/sso/password/update",
    data,
  });
};