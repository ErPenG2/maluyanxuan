<script setup>
import { getCattleByType } from '@/api/cattle';
import ArticleList from '@/components/ArticleList.vue';
import { onMounted, ref } from 'vue';

// 数据
const dataList = ref([]);

// 获取数据
const getCattleListByType = async params => {
  const res = await getCattleByType(params);
  const dataList = res.data.list;
  // 格式化数据
  res.data.list = dataList
    ?.map(item => ({
      ...item,
      title: item.article.title,
      desc: item.article.desc,
      pic_url: item.article.picUrl,
      id: item.object_id,
    }))
    .reverse();
  return res;
};

onMounted(async () => {
  // 获取数据
  const res = await getCattleByType({ type: 2, page: 1, limit: 20 });
  dataList.value = res.data.list;

});
</script>

<template>
  <slot name="hello">

  </slot>
  <van-nav-bar
    :title="$route.meta.title"
    placeholder
    fixed
    @click-left="$router.back()"
    left-arrow
  />
  <div class="container">
    <ArticleList
      class="list"
      :api-fn="getCattleListByType"
      :params="{ type: 2, page: 1, limit: 20 }"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px 10px 0px 10px;
}
</style>