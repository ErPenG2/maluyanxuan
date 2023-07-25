<script setup>
import { getToken } from "@/utils/auth";
import { ref, computed } from "vue";
import { useCartStore } from "@/store/cart.js";
import { editCart, deleteCart } from "@/api/cart";
import { useRouter } from "vue-router";
const router = useRouter();
const cartStore = useCartStore();
const isStore=ref(false)
if(cartStore.data){
  if(cartStore.data.length){
    isStore.value=true;
  }
}

const loading = ref(false);
const finished = ref(false);
// 控制登录状态
const isLogin = ref(false);
// 如果有token的话隐藏
if (getToken()) {
  isLogin.value = true;
  // 当有token的时候 获取购物车的数据
  cartStore.changeCart();
}
// 点击提交按钮
const onSubmit = () => {
  // 格式化数据
  const goods = cartStore.data
    .filter?.((it) => it.checked)
    .map((it) => ({
      goods_id: it.goods_id,
      count: it.count,
      cartId: it.id,
      goodsInfo: it.goods_info,
    }));
    if(goods.length!==null){
      if (goods.length > 0) {
    router.push({
      name: "addressList",
      query: {
        orderInfo: btoa(
          encodeURI(
            JSON.stringify({
              goods,
              price: totalPrice.value,
            })
          )
        ),
      },
    });
  }
    }

};
// 返回上一步
const onClickLeft = () => history.back();

const onLoad = async () => {};

const changeSelected = () => {};
// 删除购物车
const deleteGoods = async (id) => {
  const res = await deleteCart([id]);
  if (res.code == 1) {
    cartStore.changeCart();
  }
};
// 全选状态
const selectedAll = computed({
  get: () => cartStore.data?.every?.((it) => it.checked),
  set: (val) => {
    cartStore.data.forEach?.((it) => {
      it.checked = val;
    });
  },
});
// 总价
const totalPrice = computed(() =>
  cartStore.data
    ?.filter((it) => it.checked)
    .reduce((pre, cur) => pre + cur.goods_info.price * cur.count, 0)
);
// 更改商品数量
const changeGoodsSum = async ({ goods_id, id, count }) => {
  const res = await editCart({ goods_id, id, count });
  if (res.code == 1) {
    // 获取到数据
    cartStore.changeCart();
  }
}
</script>
<template>
  <div id="cart">
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 商品卡片 -->
    <main v-if="isLogin" class="content">
      <!-- 购物车中可能有数据，也可能没有数据 -->
      <van-list
        class="goods_list"
        v-model:loading="loading"
        :finished="finished"
        v-if="isStore"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell
          class="goods_item"
          v-for="it in cartStore.data"
          :key="it"
        >
          <van-checkbox
            class="selected"
            v-model="it.checked"
            @select="changeSelected"
          />
          <div class="goods_box">
            <van-card
              class="goods_card"
              :key="it.id"
              :num="it.count"
              :price="((it.goods_info?.price / 100) * it.count).toFixed(2)"
              :desc="it.goods_info?.detail_info"
              :title="it.goods_info?.name"
              :thumb="it.goods_info?.pic_url"
            >
              <template #tags>
                <van-tag plain type="primary">{{
                  it.goods_info?.tags
                }}</van-tag>
              </template>
              <template #footer>
                <van-stepper @change="changeGoodsSum(it)" v-model="it.count" />
              </template>
            </van-card>
          </div>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="deleteGoods(it.id)"
            />
          </template>
        </van-swipe-cell>
      </van-list>
      <div class="is_null" v-else>
        <van-icon name="smile-o" size="50px" />
        <p class="cart_tip">购物车空空空如也</p>
        <van-button class="to_btn" type="primary" to="/home">去首页</van-button>
      </div>
    </main>
    <!-- 未登录状态 -->
    <div v-if="!isLogin" class="no_login_content">
      <van-empty class="thumbnail" description="未登录">
        <van-button
          type="primary"
          class="login_btn"
          @click="$router.push('/login')"
        >
          登录
        </van-button>
      </van-empty>
    </div>
    <van-submit-bar
      v-if="isLogin && isStore"
      :price="totalPrice"
      class="submit"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <van-checkbox v-model="selectedAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>
<style scoped lang="scss">
#cart {
  .login_btn {
    width: 180px;
  }
  main.content {
    margin-bottom: var(--van-submit-bar-height);
    .goods_list {
      .goods_item {
        position: relative;
        .selected {
          position: absolute;
          z-index: 2;
          left: 8px;
          top: 58px;
        }
        .goods_box {
          background: #f7f8fa;
          margin-top: 10px;
          .goods_card {
            margin-left: 30px;
          }
        }
        .delete-button {
          width: 100%;
          height: 100%;
        }
      }
    }
    .is_null {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 55vh;
      text-align: center;
      p.cart_tip {
        font-size: 18px;
      }
      .to_btn {
        margin-top: 16px;
        width: 180px;
      }
    }
  }
  .submit {
    bottom: var(--van-submit-bar-height);
  }
}
</style>
