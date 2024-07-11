<script lang="ts" setup>
import { ref, computed, CSSProperties, watch, watchEffect, h } from 'vue';
import { UserAddOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useDraggable } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { getSearchUser, _addFriend } from '@/server/friend';

const emit = defineEmits(['change']);
const open = ref<boolean>(false);
const modalTitleRef = ref<HTMLElement | null>(null);
const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
const username = ref<string>('');
const description = ref<string>('暂无数据');

interface User {
  id: number;
  username: string;
  avatar: string;
  status: number;
}
const searchList = ref<User[]>([]);

watch([x, y], () => {
  if (!startedDrag.value) {
    if(!modalTitleRef.value) return;
    
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});
const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});

const showModal = () => {
  open.value = true;
  username.value = '';
  description.value = '暂无数据';
  searchList.value = [];
};

const handleSearch = async () => {
  const res = await getSearchUser(username.value);
  if(res.code == 0) {
    res.data.map(i => {
      i.avatar = `https://api.multiavatar.com/${i.username}.png`;
    })
    searchList.value = res.data;
  }else {
    description.value = res.msg;
  }
}

const addFriend = async (item: User) => {
  const data = {
    id: item.id,
    username: item.username
  }

  const res = await _addFriend(data);
  if(res.code == 0) {
    message.success('添加成功');
    emit('change');
  }
}
</script>

<template>
  <a-button class="button" type="primary" shape="circle" size="large" :icon="h(UserAddOutlined)" @click="showModal" />
  <a-modal ref="modalRef" v-model:open="open" :wrap-style="{ overflow: 'hidden' }" :footer="null">
    <a-input class="input" v-model:value="username" placeholder="请输入好友名称">
      <template #prefix>
        <user-outlined />
      </template>
    </a-input>
    <a-button class="button" type="primary" shape="circle" :icon="h(SearchOutlined)" @click="handleSearch" />
    
    <div class="content">
      <div class="list" v-if="searchList.length">
        <div class="item" v-for="item in searchList">
          <a-tooltip :title="item.username">
            <a-avatar shape="square" size="large" :src="item.avatar" />
          </a-tooltip>
          <a-tooltip :title="!item.status ? '添加好友' : '已添加该用户为好友'">
            <a-button type="primary" :disabled="item.status" shape="circle" :icon="h(PlusOutlined)" @click="addFriend(item)" />
          </a-tooltip>
        </div>
      </div>
      <a-empty v-else :description="description" />
    </div>

    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">添加好友</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.button {
  margin-left: 14px;
}

.input {
  width: calc(100% - 48px);
}

.content {
  margin-top: 14px;

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(98px, 1fr));
    grid-template-rows: repeat(auto-fill, 50px);
    grid-gap: 16px;
    .item {
      width: 98px;
      height: 50px;
      background-color: #f0f0f0;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>