<script setup>
import { areaList } from "@vant/area-data";
import { useRouter, useRoute } from "vue-router";
import { addAddress, updateAddress, deleteAddress } from "@/api/address";
import { ref } from "vue";
import { showSuccessToast } from "vant";

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const addressList = ref({
  id: 0,
  isDefault: false,
  name: "",
  tel: "",
  province: "",
  city: "",
  county: "",
  addressDetail: "",
});

// 判断是否是编辑
if (route.query.addressInfo) {
  // 编辑态
  isEdit.value = true;
  const addAddressData = JSON.parse(decodeURI(atob(route.query.addressInfo)));

  // 反显
  addressList.value = {
    id: addAddressData.id,
    isDefault: addAddressData.is_default,
    name: addAddressData.name,
    tel: addAddressData.phone,
    province: addAddressData.province,
    city: addAddressData.city,
    county: addAddressData.town,
    addressDetail: addAddressData.detail,
  };
}

// 当点击保存的时候,判断是编辑还是提交
const onSave = async (info) => {
  // 新增
  if (!isEdit.value) {
    // console.log(123);
    let res = await addAddress({
      is_default: info.isDefault ? "1" : "0",
      name: info.name,
      phone: info.tel,
      province: info.province,
      city: info.city,
      town: info.county,
      street: null,
      detail: info.addressDetail,
    });
    if (res.code == 1) {
      showSuccessToast({
        message: "添加成功",
        duration: 1500,
      });
    }
  } else {
    // 编辑
    let res = await updateAddress({
      id: info.id, //编辑的时候多了一个id参数
      is_default: info.isDefault ? "1" : "0",
      name: info.name,
      phone: info.tel,
      province: info.province,
      city: info.city,
      town: info.county,
      street: null,
      detail: info.addressDetail,
    });
    if (res.code == 1) {
      showSuccessToast({
        message: "修改成功",
        duration: 1500,
      });
    }
  }
  //   回到地址列表
  router.replace({
    path: "/address-list",
    query: { orderInfo: route.query.orderInfo },
  });
};

// 删除事件
const onDelete = async (info) => {
  // 添加状态
  if (!isEdit.value) return;
  const res = await deleteAddress(info.id);
  if (res.code === 1) {
    showSuccessToast({
      message: "删除成功",
      duration: 1500,
    });
  }
  //   回到地址列表
  router.replace({
    path: "/address-list",
    query: { orderInfo: route.query.orderInfo },
  });
};
</script>
<template>
  <div class="container">
    <!-- 头部导航 -->
    <van-nav-bar
      :title="isEdit ? '编辑地址' : '新增地址'"
      left-arrow
      placeholder
      fixed
      @click-left="
        $router.replace({
          path: '/address-list',
          query: { orderInfo: route.query.orderInfo },
        })
      "
    />
    <!-- address-info 编辑数据反显 -->
    <!-- :show-delete 是否显示删除按钮 -->
    <van-address-edit
      :area-list="areaList"
      :address-info="addressList"
      :show-delete="isEdit"
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>
