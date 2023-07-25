import {ref} from 'vue';
import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', () => {
    // 用户名
    const name = ref('');
    // 头像
    const avatar = ref('');
    // 性别
    const sex = ref(1);
    // 签名
    const sign = ref('');

    // 设置用户数据
    const setInfo = info => {
        name.value = info.name;
        avatar.value = info.avatar;
        sex.value = info.sex;
        sign.value = info.sign;
    };
    // 重置用户
    const reset = () => {
        name.value = '';
        avatar.value = '';
        sex.value = 1;
        sign.value = '';
    };

    return {
        name,
        avatar,
        sex,
        sign,
        setInfo,
        reset
    };
});