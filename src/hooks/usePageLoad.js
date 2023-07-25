import { ref } from 'vue';

// 传入一个
export const usePageLoad = (apiCallback, queryParams) => {
    // 数据
    const data = ref([]);
    // 总数
    const count = ref(0);
    // 加载状态
    const loading = ref(false);
    // 完成状态
    const finished = ref(false);
    // 加载事件
    const onLoad = async () => {
        try {
            // 调用api
            const res = await apiCallback(queryParams);
            if (res.code === 1) {
                // 数量
                count.value = res.data.count;
                // 加载状态
                loading.value = false;
                if (res.data.list) {
                    // 新增数据
                    data.value.push(...res.data.list);
                }
            }
        } catch (error) {
            console.error(error);
        }
        // 每次判断总数和每次获取数之比，当已请求数page数大于总数和每次获取数之比时就停止加载
        if (queryParams.page++ > parseInt(count.value / queryParams.limit) + 1) {
            finished.value = true;
            return;
        }
    };
    return {
        data,
        onLoad,
        loading,
        finished,
        count
    };
};