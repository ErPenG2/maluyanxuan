<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createOrder } from "../../api/order";

const route = useRoute();
const router = useRouter();

if (!route.query.orderInfo) {
  // url中没有orderInfo这个参数
  router.replace("/cart");
}
// 获取到路由传递过来的信息
const orderInfo = ref(
  JSON.parse(decodeURI(atob(route.query.orderInfo || "") || "") || "[]")
);
// console.log(orderInfo.value.isDefault);
// 订单地址
const addressList = reactive([
  {
    id: "1",
    name: orderInfo.value.consignee_name,
    tel: orderInfo.value.consignee_phone,
    address: orderInfo.value.consignee_address,
    isDefault: orderInfo.value.isDefault,
  },
]);
// 备注
const remark = ref("");
// 是否要弹出支付框
const show = ref(false);
const actions = [
  { name: "微信", pay_type: 1 },
  { name: "支付宝", pay_type: 2 },
  { name: "云闪付", pay_type: 3 },
];
// 选择的支付方式
const onSelect = async (item) => {
  // 要发送ajax请求
  const order_goods_infos = orderInfo.value.goods.map((item) => ({
    goods_id: item.goods_id,
    count: item.count,
  }));
  // 判断是否有商品没有就返回订单查看页
  if (!order_goods_infos.length) {
    router.replace("/order");
    return;
  }
  const order = {
        pay_type: item.pay_type,
        status: 2, // 已支付
        remark: remark.value,
        price: orderInfo.value.price,
        consignee_name: orderInfo.value.consignee_name,
        consignee_phone: orderInfo.value.consignee_phone,
        consignee_address: orderInfo.value.consignee_address,
        order_goods_infos: order_goods_infos, // 商品信息
    };
    // 发送创建订单请求
    await createOrder(order);
    // 清空购物车数据
    // 回到订单列表页面
    router.replace("/order");
};
// 点击了取消
const onCancel =async () => {
    // 获取每个商品的id/数量
    const order_goods_infos = orderInfo.value.goods.map(it => ({
        goods_id: it.goods_id,
        count: it.count,
    }));
    // 判断是否有商品没有就返回订单查看页
    if (!order_goods_infos.length) {
        router.replace('/order');
        return;
    }
    const order = {
        pay_type: 0,
        status: 1, // 未支付
        remark: remark.value,
        price: orderInfo.value.price,
        consignee_name: orderInfo.value.consignee_name,
        consignee_phone: orderInfo.value.consignee_phone,
        consignee_address: orderInfo.value.consignee_address,
        order_goods_infos: order_goods_infos,
    };
    // 发送创建订单请求
    await createOrder(order);

    // 回到订单页
    router.replace('/order');
};
// 提交订单
const onSubmit = () => {
  // 显示支付弹窗
  show.value = true;
};
// 返回上一步
const onClickLeft = () => {
  // 点击了确定,去订单列表了,现在没有订单列表路由
  showConfirmDialog({
    message: "退出生成订单?",
  })
    .then(() => {
      router.replace("/order");
    })
    .catch(() => {});
};
</script>
<template>
  <div id="create">
    <!-- 顶部 -->
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 地址栏 -->
    <div class="address">
      <van-address-list
        :list="addressList"
        :switchable="false"
        class="address_list"
      />
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 0' }"
        dashed
      ></van-divider>
    </div>
    <!-- 商品卡片 -->
    <van-card
      v-for="it in orderInfo.goods"
      :key="it.goods_id"
      :num="it.count"
      :price="(it.goodsInfo.price / 100).toFixed(2)"
      :desc="it.goodsInfo.detail_info"
      :title="it.goodsInfo.name"
      :thumb="it.goodsInfo.pic_url"
    />

    <!-- 提交订单栏 -->
    <van-submit-bar :price="3050" button-text="提交订单" @submit="onSubmit">
      <!-- 备注 -->
      <template #top>
        <van-field
          v-model.trim="remark"
          rows="3"
          autosize
          label="留言"
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
          :rules="[{ required: true, message: '请填写备注' }]"
        /> </template
    ></van-submit-bar>
    <!-- 弹出框 -->
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
      @select="onSelect"
    />
  </div>
</template>
<style scoped lang="scss">
#create {
  .address {
    padding-top: 20px;
    background-color: #fff;
    .address_list {
      // vant自带变量
      --van-address-list-padding: 0;
      :deep(.van-badge__wrapper) {
        display: none;
      }
      :deep(.van-address-list__bottom) {
        display: none;
      }
    }
  }
  .submit_box {
    background-color: #fff;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    padding: 10px;
  }
}
</style>
