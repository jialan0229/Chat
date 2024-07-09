<script setup>
import { ref, reactive, onMounted, nextTick, h } from 'vue';
import { storeToRefs } from 'pinia';
import multiavatar from '@multiavatar/multiavatar/esm';
import { CheckOutlined, SmileOutlined } from '@ant-design/icons-vue';

import AddFriend from '@/components/AddFriend/index.vue';

import { useUsersStore } from '@/store';
import { _getList, _updateStatus } from '@/server';
import { formatTime, getUserInfo } from '@/utils';
import { baseURLWs } from '@/config';

const store = useUsersStore();
// const { userInfo } = storeToRefs(store);
const userInfo = getUserInfo();
const chatState = reactive({
  personList: [],
  personInfo: {},
  messages: []
})
const chatRef = ref(null);
const audioRef = ref(null);
const lastMessge = ref(null);
// let socket = null;

onMounted(() => {
  getList();
  // audioRef.value.play();
})

async function setChatScrollTop() {
  await nextTick()
  if(!chatRef.value) return;
  chatRef.value.scrollTop = chatRef.value.scrollHeight;
}

async function getList() {
  const res = await _getList()
  if (res.code == 0) {
    res.data.forEach(i => {
      multiavatar(i.username);
      i.avatar = `https://api.multiavatar.com/${i.username}.png`;
      i.updated_at = formatTime(i.updated_at)
      initWebSocket(i)
    })

    chatState.personList = res.data;
  }
}

function setAciveChat(item) {
  chatState.personInfo = item;
  updateStatus();
  setChatScrollTop();
}

function initWebSocket(item) {
  if (item.socket) {
    item.socket.close();
    item.socket = null;
  }

  item.socket = new WebSocket(`${baseURLWs}/message/chat/list?sender_id=${userInfo.id}&room=${item.room}`);

  item.socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data instanceof Array) {
      chatState.messages = data;
    } else {
      // 列表更新最新消息
      chatState.personList.forEach(i => {
        if(i.room === data.room) {
          i.lastMsg = data.content
          i.lastMsgSenderId = data.sender_id
          i.unread ++
          data.sender_id != userInfo.id && audioRef.value.play();
        }
      })
      chatState.messages.push(data)
    }

    setChatScrollTop();

    lastMessge.value = Array.isArray(data) ? data[data.length - 1] : data;
    updateStatus();
  }

  item.socket.onerror = (error) => {
    console.log('WebSocket Error:', error);
  };
}

async function updateStatus() {
  if(lastMessge.value && lastMessge.value.sender_id != userInfo.id && !lastMessge.value.status && chatState.personInfo.id) {
    const res = await _updateStatus(lastMessge.value.id);
    if(res) {
      chatState.personList.forEach(i => {
        if(i.room === lastMessge.value.room) {
          i.unread = 0
        }
      })
    }
  }
}

function handleSend() {
  if (!chatState.content) return;

  const { user_id, friend_id, room, socket } = chatState.personInfo;
  const sendMasgges = {
    sender_id: friend_id,
    receiver_id: user_id,
    room,
    content: chatState.content
  };

  socket.send(JSON.stringify(sendMasgges));
  chatState.content = ''
}
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="left">
        <div class="top">
          <input type="text" placeholder="Search" />
          <AddFriend @change="getList()"/>
        </div>
        <ul class="people">
          <li :class="['person', chatState.personInfo.id === item.id && 'active']"
            v-for="item in chatState.personList" @click="setAciveChat(item)" data-chat="person1">
            <div class="avatar">
              <img :src="item.avatar" alt="" />
              <span v-if="item.lastMsgSenderId != userInfo.id && item.unread" class="unread">{{ item.unread }}</span>
            </div>
            <span class="name">{{ item.remark }}</span>
            <span class="time">{{ item.updated_at }}</span>
            <br>
            <span class="preview">{{ item.lastMsg }}</span>
          </li>
        </ul>
      </div>
      <div class="right">
        <template v-if="chatState.personInfo.id">
          <div class="main">
            <div class="top"><span class="name">{{ chatState.personInfo.remark }}</span></div>
            <div class="chat active-chat" ref="chatRef">
              <template v-for="(item, index) in chatState.messages">
                <div class="conversation-start">
                  <span>{{ formatTime(item.created_at) }}</span>
                </div>
                <div :class="['bubble', item.sender_id == userInfo.id ? 'me' : 'you']"
                  :style="{ '--animationDuration': ((index + 1) * 0.15) + 's' }">
                  {{ item.content }}
                </div>
              </template>
            </div>
          </div>
          <div class="write">
            <input v-model="chatState.content" @keyup.enter="handleSend" type="text" />
            <SmileOutlined :style="{ fontSize: '18px' }" class="write-link smiley" />
            <CheckOutlined :style="{ fontSize: '18px' }" class="write-link send" @click="handleSend" />
          </div>
        </template>
      </div>
    </div>

    <audio ref="audioRef">
      <source src="@/assets/mp3/gramStart.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: @bg;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  background-image: url("../../assets/images/chat_bg.png");
  background-size: cover;
  background-repeat: none;

  .container {
    position: relative;
    top: 50%;
    left: 50%;
    width: 90%;
    height: 80%;
    background-color: @white;
    transform: translate(-50%, -50%);

    .left {
      float: left;
      width: 37.6%;
      height: 100%;
      border: 1px solid @light;
      background-color: @white;

      .top {
        position: relative;
        width: 100%;
        height: 96px;
        padding: 29px;

        &:after {
          position: absolute;
          bottom: 0;
          left: 50%;
          display: block;
          width: 80%;
          height: 1px;
          content: "";
          background-color: @light;
          transform: translate(-50%, 0);
        }
      }

      input {
        float: left;
        width: 188px;
        height: 42px;
        padding: 0 15px;
        border: 1px solid @light;
        background-color: #eceff1;
        border-radius: 21px;
        font-family: "Source Sans Pro", sans-serif;
        font-weight: 400;
      }

      input:focus {
        outline: none;
      }

      .people {
        /* margin-left: -1px;
        border-right: 1px solid @light;
        border-left: 1px solid @light;
        width: calc(100% + 2px); */

        .person {
          position: relative;
          width: 100%;
          padding: 12px 10% 16px;
          cursor: pointer;
          background-color: @white;

          &:after {
            position: absolute;
            bottom: 0;
            left: 50%;
            display: block;
            width: 80%;
            height: 1px;
            content: "";
            background-color: @light;
            transform: translate(-50%, 0);
          }

          .avatar {
            float: left;
            width: 50px;
            height: 50px;
            margin-right: 12px;
            position: relative;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }

            .unread {
              position: absolute;
              right: -8px;
              top: -8px;
              width: 20px;
              height: 20px;
              font-size: 12px;
              line-height: 20px;
              text-align: center;
              border-radius: 10px;
              color: #fff;
              background-color: #fa5151;
              z-index: 9;
            }
          }

          .name {
            font-size: 14px;
            line-height: 22px;
            color: @dark;
            font-family: "Source Sans Pro", sans-serif;
            font-weight: 600;
          }

          .time {
            font-size: 14px;
            position: absolute;
            top: 16px;
            right: 10%;
            padding: 0 0 5px 5px;
            color: @grey;
            background-color: @white;
          }

          .preview {
            font-size: 14px;
            display: inline-block;
            overflow: hidden !important;
            width: 70%;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: @grey;
            padding-top: 8px;
          }

          &.active,
          &:hover {
            margin-top: -1px;
            margin-left: -1px;
            padding-top: 13px;
            border: 0;
            background-color: @blue;
            width: calc(100% + 2px);
            padding-left: calc(10% + 1px);
          }

          &.active span,
          &:hover span {
            color: @white;
            background: transparent;
          }

          &.active:after,
          &:hover:after {
            display: none;
          }
        }
      }
    }

    .right {
      position: relative;
      float: left;
      width: 62.4%;
      height: 100%;

      .main {
        width: 100%;
        height: 100%;

        .top {
          width: 100%;
          height: 47px;
          padding: 15px 29px;
          background-color: #eceff1;

          .name {
            color: @dark;
            font-family: "Source Sans Pro", sans-serif;
            font-weight: 600;
          }
        }

        .chat {
          position: relative;
          display: none;
          overflow: hidden;
          padding: 0 35px;
          border-width: 1px 1px 1px 0;
          border-style: solid;
          border-color: @light;
          height: calc(100% - 120px);
          flex-direction: column;
          overflow: auto;

          &.active-chat {
            display: block;
            display: flex;

            .bubble {
              transition-timing-function: cubic-bezier(0.4, -0.04, 1, 1);
              animation-duration: var(--animationDuration);
            }
          }
        }
      }


      .write {
        position: absolute;
        bottom: 15px;
        left: 30px;
        height: 42px;
        padding-left: 8px;
        border: 1px solid @light;
        background-color: #eceff1;
        width: calc(100% - 58px);
        border-radius: 5px;
        display: flex;
        align-items: center;

        input {
          font-size: 16px;
          float: left;
          width: calc(100% - 60px);
          height: 40px;
          padding: 0 10px;
          color: @dark;
          border: 0;
          outline: none;
          background-color: #eceff1;
          font-family: "Source Sans Pro", sans-serif;
          font-weight: 400;
        }

        .write-link {
          cursor: pointer;
          color: #888;

          &:hover {
            color: @blue;
          }
        }

        .write-link.send {
          margin-left: 11px;
        }
      }


      .bubble {
        font-size: 16px;
        position: relative;
        display: inline-block;
        clear: both;
        margin-bottom: 8px;
        padding: 13px 14px;
        vertical-align: top;
        border-radius: 5px;

        &:before {
          position: absolute;
          top: 19px;
          display: block;
          width: 8px;
          height: 6px;
          content: " ";
          transform: rotate(29deg) skew(-35deg);
        }

        &.you {
          float: left;
          color: @dark;
          background-color: #eceff1;
          align-self: flex-start;
          -webkit-animation-name: slideFromLeft;
          animation-name: slideFromLeft;
        }

        &.you:before {
          left: -3px;
          background-color: #eceff1;
        }

        &.me {
          float: right;
          color: @white;
          background-color: @blue;
          align-self: flex-end;
          -webkit-animation-name: slideFromRight;
          animation-name: slideFromRight;
        }

        &.me:before {
          right: -3px;
          background-color: @blue;
        }
      }


      .conversation-start {
        position: relative;
        width: 100%;
        margin-bottom: 27px;
        text-align: center;

        span {
          font-size: 14px;
          display: inline-block;
          color: @grey;

          &:before,
          &:after {
            position: absolute;
            top: 10px;
            display: inline-block;
            width: 30%;
            height: 1px;
            content: "";
            background-color: @light;
          }

          &:before {
            left: 0;
          }

          &:after {
            right: 0;
          }
        }

      }

    }
  }
}


@keyframes slideFromLeft {
  0% {
    margin-left: -200px;
    opacity: 0;
  }

  100% {
    margin-left: 0;
    opacity: 1;
  }
}

@-webkit-keyframes slideFromLeft {
  0% {
    margin-left: -200px;
    opacity: 0;
  }

  100% {
    margin-left: 0;
    opacity: 1;
  }
}

@keyframes slideFromRight {
  0% {
    margin-right: -200px;
    opacity: 0;
  }

  100% {
    margin-right: 0;
    opacity: 1;
  }
}

@-webkit-keyframes slideFromRight {
  0% {
    margin-right: -200px;
    opacity: 0;
  }

  100% {
    margin-right: 0;
    opacity: 1;
  }
}
</style>