import { ref } from 'vue';
import { defineStore } from 'pinia';
import { cartList } from '@/api/cart.js';

export const useCartStore = defineStore('cart', () => {
    // 购物车商品数量
    const count = ref(0);
    // 购物车商品
    const data = ref([]);
    // 获取数据
    const changeCart = async () => {
        const res = await cartList({
            page: 1,
            limit: 100
        });
        console.log('res',res);
        if (res.code === 1) {
            count.value = res.data.count;
            data.value = res.data.list;
        }
    };
  
    // 重置数据
    const reset = () => {
        count.value = 0;
        data.value = [];
    };

    return {
        count,
        data,
        changeCart,
        reset
    };
});