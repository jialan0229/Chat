<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const msg = new SpeechSynthesisUtterance('请33号患者到211号窗口');
  // 可选：设置语音参数
  // const voice = speechSynthesis.getVoices(); // 选择第一个语音
  // msg.voice = voice[0]; // 选择第一个语音
  msg.volume = '1'; // 声音的音量，区间范围是0到1，默认是1。
  msg.rate = 1;// 设置播放语速，范围：0.1 - 10之间    正常为1倍播放
  msg.pitch = '0'; // 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1。
  msg.lang = 'zh-cn'; // 使用的语言，字符串， 例如："zh-cn"
  msg.voiceURI = 'Ting-Ting'
  msg.voiceURI = 'Google 普通话（中国大陆）';

  console.log(msg);
  // 播放语音
  window.speechSynthesis.speak(msg);
})
</script>

<template>
  <h1>这是一个Vite + Vue3 + Electron模板</h1>
</template>

<style scoped>
</style>
