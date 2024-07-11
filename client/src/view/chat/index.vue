<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import { storeToRefs } from 'pinia';
import multiavatar from '@multiavatar/multiavatar/esm';

import AddFriend from '@/components/AddFriend/index.vue';

import { useUsersStore } from '@/store';
import { _getList, _updateStatus } from '@/server';
import { formatTime, getUserInfo } from '@/utils';
import { baseURLWs } from '@/config';

const store = useUsersStore();
// const { userInfo } = storeToRefs(store);
const userInfo = getUserInfo();
const chatState = reactive({
  content: '',
  personList: [],
  personInfo: {},
  messages: []
})
const chatRef = ref(null);
const audioRef = ref(null);
const inputRef = ref(null);
const emojiPickerRef = ref(null);
const optionsName = {
  'Smileys & Emotion': '笑脸&表情',
  'Food & Drink': '食物&饮料',
  'Animals & Nature': '动物&自然',
  'Travel & Places': '旅行&地点',
  'People & Body': '人物&身体',
  Objects: '物品',
  Symbols: '符号',
  Flags: '旗帜',
  Activities: '活动'
};

onMounted(() => {
  getList();
  // audioRef.value.play();
})

function appendText(val) {
  console.log(val);
  const { selectionStart, selectionEnd } = inputRef.value;
  let endIndex = 0;
  if (chatState.content != '') {
    if (selectionStart === selectionEnd) {
      let chars = [...chatState.content];
      chars.splice(inputRef.value.selectionStart, 0, val);
      chatState.content = chars.join('');
    } else {
      let oldStr = chatState.content.slice(selectionStart, selectionEnd);
      endIndex = -(oldStr.length - 1)
      chatState.content = chatState.content.replace(oldStr, val)
    }
  } else {
    chatState.content += val
  }
  emojiPickerRef.value.closePop();

  setTimeout(() => {
    // 设置光标位置
    inputRef.value.focus()
    endIndex && inputRef.value.setSelectionRange(selectionStart + 1, selectionEnd + endIndex)
  })
};

async function setChatScrollTop() {
  await nextTick()
  if (!chatRef.value) return;
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
  chatState.content = ''
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
      item.messages = data;
    } else {
      // 列表更新最新消息
      chatState.personList.forEach(i => {
        if (i.room === data.room) {
          i.lastMsg = data.content
          i.lastMsgSenderId = data.sender_id
          i.unread++
          data.sender_id != userInfo.id && audioRef.value.play();
        }
      })
      item.messages.push(data)
    }

    setChatScrollTop();

    item.lastMessge = Array.isArray(data) ? data[data.length - 1] : data;
    updateStatus();
  }

  item.socket.onerror = (error) => {
    console.log('WebSocket Error:', error);
  };
}

async function updateStatus() {
  if (!chatState.personInfo.lastMessge) return;

  const { sender_id, status, room } = chatState.personInfo.lastMessge;
  const flag = sender_id != userInfo.id && !status && chatState.personInfo.id;

  if (flag) {
    const res = await _updateStatus(room);
    if (res) {
      chatState.personList.forEach(i => {
        if (i.room === room) {
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

function handleCallWindow(type, title) {
  const options = {
    type,
    title,
  }

  electronAPI.callWindow(options)
}
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="left">
        <div class="top">
          <input type="text" placeholder="Search" />
          <AddFriend @change="getList()" />
        </div>
        <ul class="people">
          <li :class="['person', chatState.personInfo.id === item.id && 'active']" v-for="item in chatState.personList"
            @click="setAciveChat(item)" data-chat="person1">
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
              <template v-for="(item, index) in chatState.personInfo.messages">
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
            <div class="write-link">
              <img 
                src="@/assets/images/phone.png"
                alt="表情包" 
                @click="handleCallWindow(1, '语音通话')"
              >
            </div>
            <div class="write-link ml10">
              <img 
                src="@/assets/images/video.png" 
                alt="表情包" 
                @click="handleCallWindow(2, '视频通话')"
                >
            </div>

            <input 
              class="ml10" 
              type="text" 
              ref="inputRef" 
              v-model="chatState.content" 
              @keyup.enter="handleSend" 
              placeholder="唠会！"
            />

            <div class="write-link ml10">
              <V3Emoji ref="emojiPickerRef" @click-emoji="appendText" :recent="true" :optionsName="optionsName">
                <img src="@/assets/images/emoji.png" alt="表情包">
              </V3Emoji>
            </div>
            <div class="write-link ml10">
              <img src="@/assets/images/send.png" alt="表情包" @click="handleSend">
            </div>
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
  // background-color: @bg;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;

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
        height: calc(100% - 72px);

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
          height: calc(100% - 50px);
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
        left: 10px;
        height: 42px;
        padding-left: 8px;
        width: calc(100% - 20px);
        border-radius: 5px;
        display: flex;
        align-items: center;

        input {
          width: 100%;
          height: 42px;
          font-size: 16px;
          padding: 0 10px;
          color: @dark;
          border: 0;
          outline: none;
          background-color: #eceff1;
          font-family: "Source Sans Pro", sans-serif;
          font-weight: 400;
          border-radius: 5px;
        }

        .write-link {
          width: 25px;
          height: 25px;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
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
    margin-left: -50px;
    opacity: 0;
  }

  100% {
    margin-left: 0;
    opacity: 1;
  }
}

@keyframes slideFromRight {
  0% {
    margin-right: -50px;
    opacity: 0;
  }

  100% {
    margin-right: 0;
    opacity: 1;
  }
}
</style>