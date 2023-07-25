<script setup>
import { onMounted, reactive } from "vue";
import { getSwiperData, getProductData } from "@/api/home.js";
import Goods from "@/components/Goods.vue";

// 轮播图数据
let swiperData = reactive([]);
// 商品列表数据
let ProductData = reactive([]);

onMounted(async () => {
  // 轮播图接口
  try {
    let sdata = (await getSwiperData({ limit: 10, page: 1 })).data.list;
    swiperData.push(...sdata);
    // console.log(swiperData, "111");
  } catch (error) {
    console.log(error);
  }
  // 推荐商品接口
  try {
    let Pdata = (await getProductData({ limit: 10, page: 1 })).data.list;
    ProductData.push(...Pdata);
    // console.log(ProductData);
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <div>
    <!-- 轮播图 -->
    <van-swipe
      placeholder
      fixed
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item v-for="item in swiperData" :key="item.id">
        <img :src="item.pic_url" :alt="item.pic_url" />
      </van-swipe-item>
    </van-swipe>
    <!-- 商品展示 -->
    <Goods :ProductData="ProductData"> </Goods>
    <!-- 回到顶部 -->
    <van-back-top right="20px" bottom="60px"></van-back-top>
  </div>
</template>

<style scoped lang="scss">
.my-swipe .van-swipe-item {
  width: 100%;
  height: 180px;
  img {
    width: 100%;
  }
}
</style>
