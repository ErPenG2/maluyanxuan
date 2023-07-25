<script setup>
import { getGoodsDetail } from "@/api/goods";
import { ref, onMounted } from "vue";
import { useRoute,useRouter } from "vue-router";
import { useCartStore } from "@/store/cart";
import { addCart, editCart } from "@/api/cart.js";
import {addcollection,delcollection} from '@/api/collection.js'
const route = useRoute();
// 返回上一步
const onClickLeft = () => history.back();
// 从路由获取商品id
const goodsId = route.params.goodsId;
// 商品详情
const goodsDetail = ref({});
const isStar = ref(false); 

//  添加收藏和取消收藏
const toggleStar = async (goodsInfo) => {
  if (!isStar.value) {
    try{
         // 收藏
    await addcollection({ type: 1, object_id: goodsInfo.id });
    }catch(err){
      console.log('添加收藏',err);
    }
  } else {
    try{
        // 取消收藏
    await delcollection({ type: 1, object_id: goodsInfo.id });
    }catch (err){
      console.log('取消收藏',err);
    }
  }
  const res = await getGoodsDetail(goodsId);
  goodsDetail.value = res.data;
  console.log(goodsDetail.value,'111');
  isStar.value = goodsDetail.value.is_collect;
};
// 点击立即购买
const router = useRouter()
const toBuy = () => {
  router.push({
    name: "addressList",
    // query传参 会把参数放在地址栏上
    // 从商品详情跳转到地址列表 传递商品id  数量1 商品详情 商品价格
    // 编码 orderInfo:{}
    query: {
      orderInfo: btoa(
        encodeURI(
          JSON.stringify({
            goods: [
              {
                goods_id: goodsDetail.value.id, //商品id
                count: 1, // 数量1
                goodsInfo: goodsDetail.value, //商品详情
              },
            ],
            price: goodsDetail.value.price, //价格
          })
        )
      ),
    },
  });
};
// 生命周期
onMounted(async () => {
  const res = await getGoodsDetail(goodsId);
  goodsDetail.value = res.data;
  //页面加载时获取购物车数量
  cartStore.changeCart();
});
// 购物车
const cartStore = useCartStore();
// 添加购物车
const addToCart = async (id) => {
  // const hasGoods = cartStore.data.reduce((num,item)=>{
  //   if(item.goods_id==id){
  //     num++
  //   }
  //   return num
  // },0)
  console.log(cartStore);

  const hasGoods = cartStore.data.find((item) => item.goods_id == id);

  if (hasGoods) {
    await editCart({ goods_id: id, count: hasGoods + 1, id: id });
  } else {
    await addCart({ goods_id: id, count: 1 });
  }
  cartStore.changeCart();
};
</script>
<template>
  <!-- 导航栏 -->
  <van-nav-bar 
  placeholder
      fixed
  title="商品详情" left-arrow @click-left="onClickLeft" />
  <div id="goodsDetail">
    <!-- 主体内容 -->
    <!-- 照片 -->
    <div class="detail-img">
      <img :src="goodsDetail.pic_url" alt="" />
    </div>
    <p class="price">￥{{ (goodsDetail.price / 100).toFixed(2) }}</p>
    <div class="goods_name">{{ goodsDetail.name }}</div>
    <p class="brands">品牌商：{{ goodsDetail.brand }}</p>
    <div class="express_prompt">
      <span>
        库存：<span>{{ goodsDetail.stock }}</span>
      </span>
      <span>免邮费 顺丰快递</span>
    </div>
    <div class="detail">
      <p class="title">商品详情</p>
      <p class="content">{{ goodsDetail.detail_info }}</p>
    </div>
    <!-- 动作栏 -->
    <van-action-bar placeholder>
      <van-action-bar-icon
        :badge="cartStore.count ? cartStore.count : ''"
        icon="cart-o"
        text="购物车"
        @click="$router.push('/cart')"
      />
      <van-action-bar-icon
        :icon="isStar ? 'star' : 'star-o'"
        text="收藏"
        color="#ff5000"
        @click="toggleStar(goodsDetail)"
      />
      <van-action-bar-button
        @click="addToCart(goodsId)"
        type="warning"
        text="加入购物车"
      />
      <van-action-bar-button type="danger" @click="toBuy"  text="立即购买" />
    </van-action-bar>
  </div>
</template>

<style scoped lang="scss">
#goodsDetail {
  margin: 0 8px;
  background-color: #fff;
  .detail-img {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .price {
    padding: 0 8px;
    color: #f63515;
    font-size: 22px;
    margin: 6px 0;
  }
  .goods_name {
    padding: 0 8px;
    background-color: white;
    font-size: 18px;
  }
  .brands,
  .express_prompt {
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    color: #999999;
    font-size: 14px;
    margin: 6px 0;
  }
  .detail {
    .title {
      margin: 10px 0;
      font-weight: bold;
      font-size: 14px;
      color: black;
      text-align: center;
    }
    .content {
      padding: 0 12px;
      font-size: 16px;
      color: rgb(84, 84, 84);
      text-indent: 2em;
    }
  }
}
</style>
