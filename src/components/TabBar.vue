<script setup>
import { ref,onMounted} from "vue";
import { useCartStore } from "@/store/cart";
const cartStore = useCartStore();
onMounted(()=>{
  cartStore.changeCart();
})

const active = ref(0);

const props = defineProps({
  cartCount: {
    type: Number,
    default: null,
  },
});
</script>

<template>
  <div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/recommend" icon="balance-list-o"
        >种草</van-tabbar-item
      >
      <van-tabbar-item
        replace
        to="/cart"
        :badge="cartStore.count ? cartStore.count : ''"
        icon="cart-o"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item replace to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped lang="scss">
</style>