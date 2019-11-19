<template>
  <div class="no-data">
    <CHeader backBol="true" backUrl="/query"></CHeader>
    <div class="content-body has-header main-bg">
      <SimpleState imgSrc="/static/images/deal/img_nodata.svg" message="暂无数据" fontClass="main-text-color2"></SimpleState>
    </div>
  </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
import SimpleState from '@/components/common/SimpleState.vue'
export default {
  components: {
    CHeader,
    SimpleState
  }
}
</script>
