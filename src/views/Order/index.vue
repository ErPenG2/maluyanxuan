<script setup>
import { defineAsyncComponent, ref, onMounted } from "vue";
import { getOrder } from "@/api/order";
const active = ref(0);
const orderData = ref([]);
// 公用组件
const OrderList = defineAsyncComponent(() =>
  import("@/components/OrderList.vue")
);

// 发送请求
onMounted(async () => {
  const res = await getOrder({ status: 0, limit: 30, page: 1 });
  if (res.code === 1) {
    orderData.value = res.data.list?.reverse?.() ?? [];
  }
});

// 标签切换显示不同数据
const changeTab = async (status) => {
  const res = await getOrder({ status: status, limit: 30, page: 1 });
  if (res.code === 1) {
    orderData.value = res.data.list?.reverse?.() ?? [];
  }
};
</script>
<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      placeholder
      fixed
      :title="$route.meta.title"
      left-arrow
      @click-left="$router.replace('/user')"
    />
    <!-- 标签栏 -->
    <van-tabs
      v-model:active="active"
      @change="changeTab"
      offset-top="45px"
      sticky
      swipeable
    >
      <van-tab title="全部">
        <Suspense>
          <template #default>
            <OrderList :orderData="orderData" />
          </template>
          <template #fallback> Loading... </template>
        </Suspense>
      </van-tab>
      <van-tab title="待支付">
        <OrderList :orderData="orderData" />
      </van-tab>
      <van-tab title="待发货">
        <OrderList :orderData="orderData" />
      </van-tab>
      <van-tab title="待收货">
        <OrderList :orderData="orderData" />
      </van-tab>
      <van-tab title="待评价">
        <OrderList :orderData="orderData" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style></style>
