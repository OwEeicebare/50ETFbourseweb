<template>
  <div class="simple-state font24">
    <img :src="imgSrc" alt="">
    <p :class="fontClass">{{message}}</p>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    fontClass: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
  .simple-state{
    text-align: center;
    padding-top: 50px;
  }
  .simple-state > img {
    max-width: 120px;
  }
</style>
