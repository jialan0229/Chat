<script setup>

</script>

<template>
  <header>
    <div class="left">
      <img src="@/assets/images/logo.png" alt="">
      <div class="text flex_c">
        <div>北京中医荣大学附属医院</div>
        <div>Afiiliated Hospital ofGansu Univcrsity ofChincse Medicinc</div>
      </div>
    </div>
    <div class="center">
      <img src="@/assets/images/green_bg.png" alt="">
      <div class="title">超声科</div>
    </div>
    <div class="right flex_between">
      <img src="@/assets/images/surface.png" alt="">
      <div class="date">
        <div>17:01</div>
        <span>2024-4-28</span> 
        <span>周四</span>
      </div>
    </div>
  </header>
</template>
 
<style lang="less" scoped>
header {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    padding-left: 10px;

    img {
      width: 65px;
      height: 67px;
      margin-top: 5px;
    }

    .text {
      margin-left: 16px;
      flex-direction: column;

      div:first-child {
        font-size: 40px;
        font-family: 方正狂草;
        text-align: center;
      }

      div:last-child {
        font-size: 16px;
        padding-left: 3px;
      }
    }
  }

  .center {
    width: 394px;
    height: 78px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }

    .title {
      position: absolute;
      inset: 0;
      margin: auto;
      line-height: 67px;
      font-size: 48px;
      color: #fff;
      background: transparent;
      letter-spacing: 12px;
      text-align: center;
      font-weight: 700;
    }
  }

  .right {
    width: 242px;
    height: 100%;
    background-color: #e9f4f2;
    border-radius: 70px 0 0 70px;
    padding: 0 26px 0 14px;

    img {
      width: 47px;
      height: 48px;
    }

    .date {
      font-size: 14px;
      color: #007d7e;

      div:first-child {
        font-size: 34px;
        text-align: center;
        font-weight: 900;
      }

      span:nth-child(2) {
        padding-right: 8px;
      }
    }
  }
}
</style>