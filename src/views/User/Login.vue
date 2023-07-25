<script setup>
// 导入vue中的内置函数
import { ref, reactive, watch, toRef } from "vue";
// 导入随机头像
import getAvatar from "@/utils/avatar";
// 导入api
import { userLogin, userRegister } from "@/api/auth";
import { showSuccessToast } from "vant";
import router from "@/router";
import { useUserStore } from "@/store/user";
import { setToken } from "@/utils/auth";
// 引入封装的本地存储工具
import { setData, getData, resetLogin } from "@/utils/userCache";
// 获取到默认头像
const avatarUrl = getAvatar();

// 声明一个变量来判断是注册还是登录
let isShow = ref(true); // 当为true 的时候是登录
// 用户注册的相关信息
const getUserInfo = () => ({
  name: "",
  password: "",
  sex: 1, //默认男
  sign: "",
  secret_answer: "",
  avatar: avatarUrl, //默认的头像地址
});
// 用户注册响应信息是响应式的
const userInfo = reactive(getUserInfo());
// 导航栏返回上一步
const onClickLeft = () => history.back();
// 表单信息
const onSubmit = async (values) => {
  if (isShow.value) {
    let res = await userLogin(values);
    // console.log(res);
    if (res.code === 1) {
      showSuccessToast({
        message: "登录成功",
        duration: 1500,
      });
      // 登录成功数据存储到仓库
      userStore.setInfo({
        name: values.name,
        avatar: res.data.avatar,
        sign: res.data.sign,
        sex: res.data.sex,
      });
      // 存储后端返回的token
      setToken(res.data.token, res.data.expire_in);
      // 本地存储
      // 重置上次存储的用户
      resetLogin();
      // 存储
      setData(values.name, {
        avatar: res.data.avatar,
        pwd: values.password,
        sign: res.data.sign,
        sex: res.data.sex,
        lastLogin: true,
      });
      router.replace("/home");
    }
  } else {
    let res = await userRegister(values);
    if (res.code === 1) {
      showSuccessToast({
        message: "注册成功",
        duration: 1500,
      });
      router.replace("/login");
      // 1.清空输入框
      Object.assign(userInfo, getUserInfo());

      // 2.回显
      userInfo.name = values.name;
      userInfo.avatar = values.avatar;

      // 3.将状态改为登录态
      isShow.value = true;
    }
  }
};
// 注册用户
const goLogin = () => {
  isShow.value = false;
};
// 返回登录
const getBack = () => {
  isShow.value = true;
};
// 获取到仓库里面的数据
const userStore = useUserStore();
// 已登录头像回显，监听到输入框的变化
let isHas = false;
watch(toRef(userInfo, "name"), (val) => {
  const avatar = getData(val).avatar;
  if (isHas) {
    userInfo.avatar = avatarUrl;
    isHas = false;
  } else if (avatar) {
    userInfo.avatar = avatar;
    isHas = true;
  }
});
</script>
<template>
  <div id="login">
    <!-- 导航栏 -->
    <van-nav-bar
      placeholder
      fixed
      :title="isShow ? '登录' : '注册'"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 头像 -->
    <div class="user-img">
      <!-- 需要封装一个随机头像 -->
      <img :src="userInfo.avatar" alt="" />
    </div>
    <!-- 表单 -->
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model.lazy.trim="userInfo.name"
          name="name"
          label="用户名"
          placeholder="用户名"
          :rules="[
            { required: true, message: '请填写用户名' },
            {
              pattern: /^[-_a-zA-Z0-9]{4,16}$/,
              message: '只能包含4-16位数字下划线减号',
            },
          ]"
        />
        <van-field
          v-model.lazy.trim="userInfo.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              pattern: /^[-_a-zA-Z0-9]{6,16}$/,
              message: '只能包含6-16位字母数字下划线减号',
            },
          ]"
        />
        <van-field
          v-if="!isShow"
          v-model.lazy.trim="userInfo.avatar"
          type="url"
          name="avatar"
          label="头像"
          placeholder="头像"
          :rules="[
            { required: true, message: '请填写头像' },
            {
              pattern:
                /^(http|ftp|https):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,
              message: '请输入有效的网址',
            },
          ]"
        />
        <van-field name="sex" v-if="!isShow" label="性别">
          <template #input>
            <van-radio-group
              v-model.lazy.trim="userInfo.sex"
              direction="horizontal"
            >
              <van-radio :name="1">男</van-radio>
              <van-radio :name="0">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-if="!isShow"
          v-model.lazy.trim="userInfo.sign"
          type="text"
          name="sign"
          label="签名"
          placeholder="个性签名"
          :rules="[{ required: true, message: '请填写签名' }]"
        />
        <van-field
          v-if="!isShow"
          v-model.lazy.trim="userInfo.secret_answer"
          type="text"
          name="secret_answer"
          label="密保"
          placeholder="验证密保"
          :rules="[{ required: true, message: '请填写密保' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          :type="isShow ? 'success' : 'primary'"
          native-type="submit"
        >
          {{ !isShow ? "注册" : "登录" }}
        </van-button>
        <van-button round block type="primary" v-if="isShow" @click="goLogin">
          注册
        </van-button>
        <van-button
          round
          block
          plain
          type="primary"
          v-if="!isShow"
          @click="getBack"
        >
          返回登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<style scoped lang="scss">
#login {
  .user-img {
    height: 100px;
    padding-top: 58px;
    margin-bottom: 28px;
    display: flex;
    justify-content: center;
    align-content: center;
    img {
      width: 88px;
      height: 88px;
      border-radius: 50%;
    }
  }
  :deep(.van-button) {
    margin: 10px 0;
  }
}
</style>
