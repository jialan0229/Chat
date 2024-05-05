<script setup>

</script>

<template>
  <footer class="flex_c">
    <span>温馨提示：尊敬的患者及家属，为了确保您顺利就诊，请注意以下事项：
      1. 提前到达，按序候诊。
      2. 过号需重新安排，请及时咨询。
      3. 保持安静，维护良好环境。
      4. 遵守卫生规定，佩戴口罩，勤洗手。
      5. 全面禁烟，保护健康。
      6. 照看儿童，注意安全。
      7. 妥善保管个人财物。
      8. 紧急情况，立即联系医护。
      9. 如有疑问，咨询窗口或使用自助服务。
      10. 推荐预约挂号，节省时间。
      11. 合理使用公共资源，节约能源。
      12. 医院严格保护您的隐私。
      13. 欢迎提出宝贵意见和建议。

      感谢您的合作，祝您早日康复。【医院名称】医疗服务团队。</span>
  </footer>
</template>

<style scoped lang="less">
footer {
  width: 100%;
  height: 30px;
  position: fixed;
  left: 0;
  bottom: 10px;
  overflow: hidden;
  white-space: nowrap;

  span {
    display: inline-block;
    color: red;
    font-size: 30px;
    position: absolute;
    animation: scroll 30s linear infinite;
    
  }

  @keyframes scroll {
    0% {
      transform: translateX(60%);
    }

    100% {
      transform: translateX(-60%);
    }
  }
}
</style>