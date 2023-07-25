import { createRouter, createWebHistory } from "vue-router";

import { getToken } from "@/utils/auth";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/Home/index.vue"),
      meta: {
        // 显示导航
        isShowNav: true,
      },
    },
    {
      path: "/recommend",
      name: "recommend",
      component: () => import("@/views/Recommend/index.vue"),
      meta: {
        isShowNav: true,
        // 需要登录的
        login: true,
        title: "种草推荐",
      },
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("@/views/Cart/index.vue"),
      meta: {
        isShowNav: true,
        // 需要登录的
        // login: true,
        title: "购物车",
      },
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/User/index.vue"),
      meta: {
        isShowNav: true,
        title: "我的",
      },
    },
    // 访问没有的路由直接跳往首页
    {
      path: "/:toHome*",
      name: "toHome",
      redirect: "/home",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/User/Login.vue"),
      meta: {
        // 标题
        title: "登录",
      },
    }, {
      path: '/goods/:goodsId',
      name: 'goodsDetail',
      component: () => import('@/views/Home/GoodsDetail.vue'),
      meta: {
        title: '商品详情',
      },
    },
    {
      path: '/address-list',
      name: 'addressList',
      component: () => import('@/views/Address/index.vue'),
      meta: {
        login: true,
        title: '收货地址',
      },
    },
    {
      path: '/edit-address',
      name: 'edit',
      component: () => import('@/views/Address/Edit.vue'),
      meta: {
        login: true,
        title: '编辑',
      },
    },
    {
      path: '/create-order',
      name: 'createOrder',
      component: () => import('@/views/Order/Create.vue'),
      meta: {
          title: '生成订单',
          login: true,
      },
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order/index.vue'),
    meta: {
        title: '我的订单',
        login: true,
    },
},
{
    path: '/article-detail',
    name: 'articleDetail',
    component: () => import('@/views/Recommend/Detail.vue'),
    meta: {
        login: true,
        title: '文章详情',
    },
},
{
  path: '/add-article',
  name: 'addArticle',
  component: () => import('@/views/Recommend/Create.vue'),
  meta: {
      login: true,
      title: '新增文章',
  },
},
{
  path: '/user-info',
  name: 'userInfo',
  component: () => import('@/views/User/Info.vue'),
  meta: {
      login: true,
      title: '个人信息',
  },
},
{
  path: '/edit-pwd',
  name: 'editPwd',
  component: () => import('@/views/User/EditPwd.vue'),
  meta: {
      login: true,
      title: '修改密码',
  },
},
{
  path: '/my-collection',
  name: 'myCollection',
  component: () => import('@/views/User/Collection.vue'),
  meta: {
      login: true,
      title: '我的收藏',
  },
},
{
  path: '/thumbs-up',
  name: 'ThumbsUp',
  component: () => import('@/views/User/ThumbsUp.vue'),
  meta: {
      title: '我的点赞',
      login: true,
  },
},
  ],
});

NProgress.configure({ showSpinner: false });
router.beforeEach((to, from, next) => {
  NProgress.start();
  const hasToken = getToken();
  if (hasToken) {
    // 有token  表示已登录
    if (to.path === "/login") {
      return next({ path: from.path });
    }
  } else {
    // 没有token, 需要去登录页面
    // 但是有些页面，不需要登录，不需要token也可以访问
    if (to.meta.login) {
      return next({ path: "/login" });
    }
  }
  return next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
