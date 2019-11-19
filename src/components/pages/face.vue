<template>
    <div id="face">
        <div class="back" @click="back()"><img src="/static/images/header/transparent_arrow_left.svg"></div>
        <iframe :src="face_url+'&failRedirect=http://'+base_url+'/%23/authentication-video&successRedirect=http://'+base_url+'/%23/authenticate-success'" frameborder="0"></iframe>
    </div>
</template>
<script>
export default {
    data(){
        return{
            face_url:window.sessionStorage.getItem("FACEURL"),
            base_url:location.host
        }
    },
    beforeRouteEnter:(to,from,next)=>{
        // console.log(from)
        if(from.path=='/authentication' || from.path=='/'){
            next();
        }else{
            next('/')
        }
    },
    methods:{
        back(){
            this.$router.back(-1);
        }
    }
}
</script>
<style scoped>
    #face{
        height: 100%;
    }
    .back{
        width: 25px;
        height: 25px;
        position: absolute;
        left: 20px;
        top: 20px;
    }
    .back>img{
        width: 100%;
        height: 100%;
    }
    iframe{
        width: 100%;
        height: 100%;
        border: 0;
    }
</style>


