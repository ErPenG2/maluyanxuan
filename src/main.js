// import './assets/main.css'

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Toast
import { showToast } from "vant";
import "vant/es/toast/style";
// Dialog
import { showDialog } from "vant";
import "vant/es/dialog/style";
// Notify
import { showNotify } from "vant";
import "vant/es/notify/style";
// ImagePreview
import { showImagePreview } from "vant";
import "vant/es/image-preview/style";

// 引入flexible适配
import "./assets/flexible";
// 引入重置样式
import "./assets/reset.css";

// 引入全局样式
import "./styles/index.scss";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
