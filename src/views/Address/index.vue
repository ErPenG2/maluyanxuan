<script setup>
import { ref } from "vue";
import { getAddressList } from "@/api/address";
import { useRouter, useRoute } from "vue-router";

// 注册
const router = useRouter();
const route = useRoute();
// 下拉刷新
const loading = ref(false);
const finished = ref(false);
// 地址
const addressScope = ref([]);
const addressList = ref([]);
const chosenAddressId = ref(null);
let page = 1;
let limit = 5;
let count = 0;
// 在地址列表页面获取订单数据（商品）
const orderInfo = ref(null);
if (route.query.orderInfo) {
  orderInfo.value = JSON.parse(
    decodeURI(atob(route.query.orderInfo || "") || "") || "{}"
  );
}

// onload一上来就会触发一次 每次到底部的时候还会再次触发
const onLoad = async () => {
  // 异步更新数据
  const res = await getAddressList({ page: page++, limit });
  console.log(res, "res");

  if (res.code === 1) {
    count = res.data.count; //地址总条数
    // 加载状态结束
    loading.value = false;
    if (res.data.list) {
      // 源数据
      addressScope.value.push(...res.data.list);
      // 筛选后的数据
      addressList.value.push(
        ...res.data.list.map((item) => ({
          id: item.id,
          name: item.name,
          tel: item.phone,
          address: item.province.concat(
            item.city,
            item.town,
            item.street !== "null" ? item.street : "",
            item.detail
          ),
          isDefault: item.is_default ? true : false,
        }))
      );

      chosenAddressId.value = addressList.value.find(
        (item) => item.isDefault
      )?.id;
    }
  }

  if (page > parseInt(count / limit) + 1) {
    finished.value = true;
    return;
  }
};

// 添加事件
let onAdd = () => {
  router.push({
    path: "/edit-address",
    query: {
      // 当前商品详情信息
      orderInfo: route.query.orderInfo,
    },
  });
};
// 编辑事件
let onEdit = (item, index) => {
  router.push({
    path: "/edit-address",
    query: {
      // 商品详情信息
      orderInfo: route.query.orderInfo,
      addressInfo: btoa(
        encodeURI(JSON.stringify({ ...addressScope.value[index] }))
      ),
    },
  });
};
// 地址选中
const selectAddress = (form) => {
  if (orderInfo.value) {
    if (orderInfo.value) {
      // 把商品数据和地址信息发到订单生成页
      router.replace({
        name: "createOrder",
        query: {
          orderInfo: btoa(
            encodeURI(
              JSON.stringify({
                ...orderInfo.value,
                consignee_name: form.name,
                consignee_phone: form.tel,
                consignee_address: form.address,
                isDefault: form.isDefault,
              })
            )
          ),
        },
      });
    }
  }
};
// 返回上一页
const onClickLeft = () => history.back();
</script>
<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar
      placeholder
      fixed
      title="收货地址"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 加载更多 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="selectAddress"
      />
    </van-list>
  </div>
</template>
