<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { _getList } from '@/server/message.js';
import { formatTime } from '@/utils';
import { baseURLWs } from '@/config';

const chatState = reactive({
  personList: [
    {
      id: 1,
      avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/thomas.jpg',
      name: 'Thomas Bangalter',
      time: '2:09 PM',
      preview: 'I was wondering...'
    },
    {
      id: 2,
      avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/dog.png',
      name: 'Dog Woofson',
      time: '1:44 PM',
      preview: "I've forgotten how it felt before"
    }
  ],
  personInfo: {},
  messages: []
})
const chatRef = ref(null);
let socket = null;

onMounted(() => {
  getList();
  // initWebSocket();
})

async function setChatScrollTop() {
  await nextTick()
  chatRef.value.scrollTop = chatRef.value.scrollHeight;
}

async function getList() {
  const res = await _getList()
  if (res.code == 0) {
    res.data.forEach(i => {
      i.avatar = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/thomas.jpg';
      i.lastMsg = 'I was wondering...'
      i.updated_at = formatTime(i.updated_at)
    })

    chatState.personList = res.data;
  }
}

function setAciveChat(item) {
  chatState.personInfo = item;
  initWebSocket();
  setChatScrollTop();
}

function initWebSocket() {
  if(socket) {
    socket.close();
    socket = null;
  }

  socket = new WebSocket(`${baseURLWs}/message/chat/list?sender_id=${3}&room=${chatState.personInfo.room}`);

  socket.onopen = () => {
    console.log('webSocket 连接成功');
  }

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if(data instanceof Array) {
      chatState.messages = data;
    } else {
      chatState.messages.push(data)
    }

    setChatScrollTop();
  }

  socket.onerror = (error) => {
    console.log('WebSocket Error:', error);
  };

}

function handleSend () {
  if(!chatState.content) return;

  const { user_id, friend_id, room } = chatState.personInfo;
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
  <div class="chat-wrap">
    <div class="wrapper">
      <div class="container">
        <div class="left">
          <div class="top">
            <input type="text" placeholder="Search" />
            <a href="javascript:;" class="search"></a>
          </div>
          <ul class="people">
            <li :class="['person', chatState.personInfo.id === item.id && 'active']"
              v-for="item in chatState.personList" @click="setAciveChat(item)" data-chat="person1">
              <img :src="item.avatar" alt="" />
              <span class="name">{{ item.remark }}</span>
              <span class="time">{{ item.updated_at }}</span>
              <span class="preview">{{ item.lastMsg }}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="main">
            <div class="top"><span>To: <span class="name">{{ chatState.personInfo.remark }}</span></span></div>
            <div class="chat active-chat" ref="chatRef">
              <template v-for="(item, index) in chatState.messages">
              <div class="conversation-start">
                <span>{{ formatTime(item.created_at) }}</span>
              </div>
                <div :class="['bubble', item.sender_id == 3 ? 'me' : 'you']"
                  :style="{ '--animationDuration': ((index + 1) * 0.15) + 's' }">
                  {{ item.content }}
                </div>
              </template>
            </div>
          </div>
          <div class="write">
            <a href="javascript:;" class="write-link attach"></a>
            <input v-model="chatState.content" @keyup.enter="handleSend" type="text" />
            <a href="javascript:;" class="write-link smiley"></a>
            <a href="javascript:;" class="write-link send" @click="handleSend"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@charset "UTF-8";

*,
*:before,
*:after {
  box-sizing: border-box;
}

@white: #fff;
@black: #000;
@bg: #f8f8f8;
@grey: #999;
@dark: #1a1a1a;
@light: #e6e6e6;
@blue: #00b0ff;
@animationDuration: 0.5;

.chat-wrap {
  width: 100%;
  height: 100%;
  background-color: @bg;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/image.jpg");
  background-size: cover;
  background-repeat: none;
}

.wrapper {
  position: relative;
  left: 50%;
  width: 1000px;
  height: 800px;
  transform: translate(-50%, 0);

  .container {
    position: relative;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 75%;
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

      a.search {
        display: block;
        float: left;
        width: 42px;
        height: 42px;
        margin-left: 10px;
        border: 1px solid @light;
        background-color: @blue;
        background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/name-type.png");
        background-repeat: no-repeat;
        background-position: top 12px left 14px;
        border-radius: 50%;
      }

      .people {
        margin-left: -1px;
        border-right: 1px solid @light;
        border-left: 1px solid @light;
        width: calc(100% + 2px);

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

          img {
            float: left;
            width: 40px;
            height: 40px;
            margin-right: 12px;
            border-radius: 50%;
            -o-object-fit: cover;
            object-fit: cover;
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
  
          span {
            font-size: 15px;
            color: @grey;
          }
  
          span .name {
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
          justify-content: flex-end;
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

        input {
          font-size: 16px;
          float: left;
          width: 347px;
          height: 40px;
          padding: 0 10px;
          color: @dark;
          border: 0;
          outline: none;
          background-color: #eceff1;
          font-family: "Source Sans Pro", sans-serif;
          font-weight: 400;
        }
  
        .write-link.attach:before {
          display: inline-block;
          float: left;
          width: 20px;
          height: 42px;
          content: "";
          background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/attachment.png");
          background-repeat: no-repeat;
          background-position: center;
        }
  
        .write-link.smiley:before {
          display: inline-block;
          float: left;
          width: 20px;
          height: 42px;
          content: "";
          background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/smiley.png");
          background-repeat: no-repeat;
          background-position: center;
        }
  
        .write-link.send:before {
          display: inline-block;
          float: left;
          width: 20px;
          height: 42px;
          margin-left: 11px;
          content: "";
          background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/send.png");
          background-repeat: no-repeat;
          background-position: center;
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
          color: @white;
          background-color: @blue;
          align-self: flex-start;
          -webkit-animation-name: slideFromLeft;
          animation-name: slideFromLeft;
        }
  
        &.you:before {
          left: -3px;
          background-color: @blue;
        }
  
        &.me {
          float: right;
          color: @dark;
          background-color: #eceff1;
          align-self: flex-end;
          -webkit-animation-name: slideFromRight;
          animation-name: slideFromRight;
        }
  
        &.me:before {
          right: -3px;
          background-color: #eceff1;
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