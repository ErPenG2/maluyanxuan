<script setup>
import { getArticleList } from '@/api/recommend.js';
import ArticleList from '@/components/ArticleList.vue';
</script>
<template>
  <div>
      <!-- 导航栏 -->
      <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      @click-left="$router.back()"
      left-arrow
      @click-right="$router.push('/add-article')"
    >
      <template #right>
        <van-icon name="add-o" size="18" />
      </template>
    </van-nav-bar>
    <ArticleList
      class="list"
      :api-fn="getArticleList"
      :params="{ page: 1, limit: 100 }"
    />
    <van-back-top right="20px" bottom="60px" />
  </div>
</template>
<style scoped lang="scss">
.list {
  margin: 10px;
}
</style>