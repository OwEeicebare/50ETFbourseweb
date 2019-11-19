<template>
    <div id="return-link">
        <CHeader title="" backBol="true"></CHeader>
        <div class="content">
            <iframe :src="url" frameborder="0" id="advertisement" scrolling="auto"></iframe>
        </div>
    </div>
</template>
<script>
import CHeader from '@/components/common/IHeader.vue'
export default {
    data(){
        return{

        }
    },
    computed:{
        url(){
            return this.$route.query.u;
        }
    },
    components: {
      CHeader,
    },
}
</script>
<style scoped>
    .content{
        position: fixed;
        top: 45px;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
    }
    #advertisement{
        height: 100%;
        width: 100%;
        overflow-x:hidden;
    }
</style>
    