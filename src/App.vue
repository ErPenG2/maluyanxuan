
<template>
  <div>
    <RouterView></RouterView>
    <TabBar v-if="isShowNav"></TabBar>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import TabBar from "@/components/TabBar.vue";

const route = useRoute();

const isShowNav = ref(false);

watch(route, (newVal) => {
  isShowNav.value = newVal.meta.isShowNav;
});
</script>
 
<style scoped>
</style>
