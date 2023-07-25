<script setup>
import { ref, onMounted, computed } from "vue";
import { getArticleInfo } from "@/api/recommend";
import { addCattle, deleteCattleByType } from "@/api/cattle";
// deleteCollectionByType
import { addcollection } from "@/api/collection";
import { useRoute, useRouter } from "vue-router";
import { addCommentApi } from "@/api/comment";

const route = useRoute();
const router = useRouter();
// 文章id
const articleId = route.query.articleId;
// 控制收藏
const isCollection = ref(false);
// 控制点赞
const isThumbs = ref(false);

if (!articleId) {
  router.replace("/recommend");
}
// 文章信息
const info = ref({});

// 获取服务器数据
const changeData = async () => {
  if (!articleId) return;
  const res = await getArticleInfo(articleId);
  if (res.code === 1) {
    // 评论反序
    res.data.comments = res.data.comments?.reverse?.();
    info.value = res.data;
  }
};

onMounted(async () => {
  await changeData();
  isThumbs.value = info.value.is_praise;
  isCollection.value = info.value.is_collect;
});

// 点赞逻辑
const giveTheThumbsUp = async () => {
  if (isThumbs.value) {
    // 取消点赞逻辑
    await deleteCattleByType({ type: 2, object_id: info.value.id });
  } else {
    // 点赞逻辑
    await addCattle({ type: 2, object_id: info.value.id });
  }
  // 重新获取服务器数据验证
  const newDetail = await getArticleInfo(articleId);
  info.value.praise = newDetail.data.praise;
  isThumbs.value = info.value.is_praise = newDetail.data.is_praise;
};
// 收藏
const collection = async () => {
  if (isCollection.value) {
    // 取消收藏
    await deleteCollectionByType({
      type: 2,
      object_id: info.value.id,
    });
  } else {
    // 收藏
    await addCollection({
      type: 2,
      object_id: info.value.id,
    });
  }
  // 同步数据
  const newDetail = await getArticleInfo(articleId);
  info.value.collect = newDetail.data.collect;
  isCollection.value = info.value.is_collect = newDetail.data.is_collect;
};
// 控制输入框显示
const show = ref(false);
// 评论收集
const comment = ref("");

const isHasComment = computed(() =>
  comment.value.length > 0 ? "#2ecc71" : "#ccc"
);

// 评论
const addComment = async () => {
  if (!comment.value.length) return;
  // 新增评论
  await addCommentApi({
    type: 2,
    object_id: info.value.id,
    content: comment.value,
  });
  // 隐藏评论框
  show.value = false;
  // 情况输入框
  comment.value = "";
  // 重新获取数据
  changeData();
};
</script>
<template>
  <div id="detail">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      @click-left="$router.back()"
      left-arrow
      @click-right="$router.push('/add-article')"
    ></van-nav-bar>
    <!-- 详情 -->
    <div class="content">
      <van-image class="img" fit="cover" :src="info.picUrl" />
      <div class="body">
        <p class="title">{{ info.title }}</p>
        <div class="info">
          <p class="desc">{{ info.desc }}</p>
          <p class="created_time">{{ info.createdAt }}</p>
        </div>
        <div class="detail">
          {{ info.detail }}
        </div>
      </div>
    </div>
    <div class="comment" v-if="info.comments">
      <p>评论:</p>
      <div class="content_item" v-for="it in info.comments" :key="it.id">
        <div class="user_pic">
          <img :src="it.user.avatar" :alt="it.user.name" />
        </div>
        <div class="item_left">
          <div class="user_name">
            {{ it.user.name }}&emsp;<span class="createdTime">{{
              it.created_at
            }}</span>
          </div>
          <div class="user_content">{{ it.content }}</div>
        </div>
      </div>
    </div>
    <div class="action_box">
      <div class="add_comment" @click="show = true">
        <van-icon name="edit" size="20px" />&nbsp;评论
      </div>
      <div class="action">
        <div class="Thumbs_action" @click="giveTheThumbsUp">
          <van-icon
            :color="isThumbs ? '#3498db' : '#767676'"
            :name="`thumb-circle${isThumbs ? '' : '-o'}`"
            :badge="info.praise || ''"
            :badge-props="{ offset: ['10px', '5px'] }"
          />
        </div>
        <div class="star_action" @click="collection">
          <van-icon
            :color="isCollection ? '#f39c12' : '#767676'"
            :badge="info.collect || ''"
            :name="`star${isCollection ? '' : '-o'}`"
            :badge-props="{ offset: ['10px', '5px'] }"
          />
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="action_box">
      <div class="add_comment" @click="show = true">
        <van-icon name="edit" size="20px" />&nbsp;评论
      </div>
      <div class="action">
        <div class="Thumbs_action">
          <van-icon
            color="#3498db"
            name="thumb-circle"
            :badge="info.praise || ''"
            :badge-props="{ offset: ['10px', '5px'] }"
          />
        </div>
        <div class="star_action">
          <van-icon
            color="#f39c12"
            :badge="info.collect || ''"
            name="star"
            :badge-props="{ offset: ['10px', '5px'] }"
          />
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <van-popup
      class="comment_box"
      safe-area-inset-bottom
      v-model:show="show"
      position="bottom"
    >
      <div class="comment_header">
        <div>评论</div>
        <div class="left" @click="addComment">发布</div>
      </div>
      <van-field
        label-align="top"
        v-model.trim="comment"
        rows="6"
        type="textarea"
        maxlength="200"
        placeholder="请输入评论"
        show-word-limit
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
#detail {
  background-color: #fff;
  .content {
    .body {
      padding: 0 12px;
      .title {
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .info {
        margin-top: 10px;
        display: flex;
        color: gray;
        justify-content: space-around;
        justify-items: center;
        line-height: 100%;
        .desc {
          font-size: 14px;
        }
        .created_time {
          font-size: 14px;
        }
      }
      .detail {
        margin-top: 10px;
        text-indent: 2em;
        font-size: 16px;
        word-wrap: break-word;
        word-break: normal;
        white-space: normal;
      }
    }
  }
  .comment {
    border-top: 1px solid #ccc;
    margin-top: 10px;
    background: #f6f6f6;
    padding: 6px;
    padding-bottom: 50px;
    p {
      font-size: 16px;
    }
    .content_item {
      background: #fff;
      padding: 6px;
      display: flex;
      border-radius: 12px;
      margin-top: 12px;
      .user_pic {
        width: 42px;
        height: 42px;
        position: relative;
        img {
          width: 42px;
          height: 42px;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .item_left {
        margin-left: 10px;
        font-size: 14px;
        width: 100%;
        .user_name {
          margin-bottom: 6px;
          .createdTime {
            color: #86909c;
          }
        }
        .user_content {
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
  .action_box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 42px;
    background: #fff;
    border-top: 1px solid rgb(232, 232, 232);
    box-shadow: 0px -2px 10px rgb(232, 232, 232);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .add_comment {
      width: 100%;
      padding-left: 16px;
      height: 100%;
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 14px;
      color: #767676;
      &:active {
        background: #e8e8e8;
      }
    }
    .action {
      height: 100%;
      width: 100%;
      --van-badge-color: black;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      font-size: 20px;
      color: #767676;
      div {
        display: flex;
        align-items: center;
        justify-content: left;
        padding: 6px 6px 6px 26px;
        height: 100%;
        width: 100%;
        :deep(.van-badge) {
          color: #767676;
          background-color: rgba(0, 0, 0, 0);
          border: none;
          font-size: 8px;
          font-weight: normal;
        }
        &:active {
          background: #e8e8e8;
          height: 32px;
        }
      }
    }
  }
  .comment_box {
    width: 100%;
    height: 300px;
    .comment_header {
      padding: 10px 16px 0 16px;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      .left {
        color: v-bind(isHasComment);
      }
    }
  }
}
</style>
