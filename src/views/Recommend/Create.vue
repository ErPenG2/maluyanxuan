<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addArticle } from "@/api/recommend";
import { showSuccessToast } from "vant";
// 标题
const title = ref("");
// 描述
const desc = ref("");
// 图片url
const pic_url = ref("");
// 详情
const detail = ref("");
// 进度条
const adding = ref(false);
const router = useRouter();
// 提交事件
const onSubmit = async (form) => {
    console.log(form);
  if (form) {
    // 开始加载
    adding.value = true;
    // 发起请求
    const res = await addArticle(form);
    // 加载完成
    adding.value = false;
    // 重置输入框
    title.value = "";
    desc.value = "";
    pic_url.value = "";
    detail.value = "";
    if (res.code === 1) {
      router.back();
      showSuccessToast({
        message: "新增成功",
        duration: 1500,
      });
    }
  }
};
</script>

<template>
  <van-nav-bar
    :title="$route.meta.title"
    placeholder
    fixed
    left-arrow
    @click-left="$router.back()"
  />
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model.trim="title"
        name="title"
        label="标题"
        placeholder="文章标题"
        :rules="[{ required: true, message: '请填写文章标题' }]"
      />
      <van-field
        v-model.trim="desc"
        name="desc"
        label="描述"
        rows="2"
        placeholder="文章描述"
        type="textarea"
        :rules="[{ required: true, message: '请填写文章描述' }]"
      />
      <van-field
        v-model="pic_url"
        name="pic_url"
        rows="3"
        label="图片"
        type="textarea"
        placeholder="请输入图片地址"
        :rules="[{ required: true, message: '请填写图片地址' }]"
      />
      <van-field
        v-model="detail"
        name="detail"
        rows="8"
        label="文章内容"
        autosize
        type="textarea"
        placeholder="请输入文章内容"
        maxlength="2000"
        show-word-limit
        :rules="[{ required: true, message: '请填写文章内容' }]"
        label-align="top"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        :loading="adding"
        native-type="submit"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style lang="scss" scoped>
.van-form {
  margin-top: 16px;
}
</style>
