<template>
    <div class="search_contract">
        <div class="font32 custom-header main-bg normal-border-color">
            <img :src="theme ? '/static/images/header/transparent_arrow_left.svg' : '/static/images/header/arrow_left.svg'" alt="返回按钮" class="back"  @click="back" >
            <div class="search"><input type="text" placeholder="请输入合约代码或名称" @focus="get_allcontract" @input="get_likecontract" v-model="input_val" class="assist-color3 main-text-color1"/></div>
        </div>
        <div class="content_wrap  main-bg">
            <!-- 搜索记录 -->
            <div class="search_recod" v-if="is_input">
                <div>
                    <span>搜索记录</span>
                    <span @click="clear_recod">清空</span>
                </div>
                <div class="recod_content">
                    <span v-if="recode.length==0" style="background:none;position: absolute;top:20%;left:50%;transform: translate(-50%,-50%);color:#b3b3b3;">暂无搜索记录</span>
                    <div v-else v-for="item in temp_recode" :key="item.Code" :data-value="item.Code" :data-num="item.Num" :data-name="item.Name" @click="selectCode">{{item.Code}} - {{item.Name}}</div>
                </div>
            </div>
            <!-- 实时搜索 -->
            <div class="input_content" v-if="!is_input">
                <div v-for="item in temp_likecontractlist" :key="item.Code" :data-value='item.Code' @click="add_history(item.Code, item.Num,item.Name)" class="normal-border-color"><span>{{item.Code}}</span><span>{{item.Name}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
export default {
    data(){
        return{
            recode:[],//搜索记录
            contractlist:[],//所有合约
            likecontractlist:[],//与搜索相似的合约
            input_val:'',//文本框的值
            is_input:true,//是否聚焦输入

            search_type:'',//搜索类型
            temp_recode:[],//临时变量，符合搜索类型的相似合约记录
            temp_likecontractlist:[],//临时变量，符合搜索类型的相似合约
            
        }
    },
    created(){
        //获取搜索类型
        this.search_type =JSON.parse(sessionStorage.getItem("cross")).change_type==="gou"?"购":"沽";
        this.get_data()
        this.get_recodelist();
        
    },
    computed: {
      backUrl () {
        return this.$route.query.type ? this.$route.query.type : '';
      },
      theme () {
        // console.log(localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0);
        return localStorage.getItem('theme') != null ? JSON.parse(localStorage.getItem('theme')).theme : 0;
      }
    },
    methods:{
        back () {//返回
            this.$router.back(-1);
        },
        get_recodelist(){//页面加载时获取本地搜索记录
            if (localStorage.getItem("recode")) {
                const rec =JSON.parse(localStorage.getItem("recode"));
                if(rec!=null){
                    this.recode = rec;
                    for(var i = 0,len=this.recode.length;i<len;i++){
                        if(this.recode[i].Name.indexOf(this.search_type)!=-1){
                            this.temp_recode.push(this.recode[i])
                        }
                    }
                }
            }
        },
        get_allcontract(){//聚焦时获取本地所有合约
            var all =JSON.parse(localStorage.getItem("contractList"));
            if(all != null){
                this.contractlist = all;
            }
        },
        get_likecontract(){//输入时获取含有输入字符的合约
            this.likecontractlist=[];
            this.temp_likecontractlist=[];
            if(this.input_val.trim().length==0) {
                this.is_input = true;
            }else{
                this.is_input = false;
                for(var i = 0;i < this.contractlist.length;i++){
                    var this_key = this.contractlist[i].Code;
                    var this_name = this.contractlist[i].Name;
                    if(this_key.includes(this.input_val) || this_name.includes(this.input_val)){
                        this.likecontractlist.push(this.contractlist[i]);
                    }
                    if((this_key.includes(this.input_val) || this_name.includes(this.input_val)) && (this_name.indexOf(this.search_type)!=-1)){
                       this.temp_likecontractlist.push(this.contractlist[i]);
                    }
                }
            }
        },
        get_data () {//获取合约数据
            this.$http.post(Api.search).then(res => {
              if (res.data.Status === '1') {
                localStorage.setItem("contractList",JSON.stringify(res.data.Data));
              }
            })
        },
        add_history(par, num,name){//点击搜索合约时加入搜索记录并跳转
            for(var i = 0;i < this.likecontractlist.length;i++){//加入搜索记录
                if(this.likecontractlist[i].Code.includes(par)){
                    if(this.recode.length!=0){//如果搜索记录不为空，查看是否有重复搜索记录，有则删除
                        for(var z = 0;z < this.recode.length;z++){
                            if(this.recode[z].Code===par){
                                this.recode.splice(z,1);
                                break;
                            }
                        }
                    }
                    this.recode.unshift(this.likecontractlist[i]);
                    break;
                }
            }
            localStorage.setItem("recode",JSON.stringify(this.recode));
            this.changeCode(par);
                

        },
        selectCode (e) {//点击记录合约时跳转
            let code = e.target.dataset.value;
            let num = e.target.dataset.num;
            let name = e.target.dataset.name;
            this.changeCode(code);
        },
        changeCode(stock){//更改跨式合约
            var cross =JSON.parse(sessionStorage.getItem("cross"));
            
            //如果是认购类型并且改变认购合约，则需要改变对应的认沽合约
            if(cross.type==="gou"){
                if(cross.change_type==="gou"){
                    this.$http.post(Api.oneCross,stock).then(res=>{
                        if(res.data.Status==="1"){
                            cross.cord_gou=stock;//选中的认购合约
                            cross.cord_gu=res.data.Data[0];//查询的认沽合约
                            sessionStorage.setItem("cross",JSON.stringify(cross))
                            this.$router.push({path:'/one_cross_rgou'});
                        }
                    })
                }else if(cross.change_type==="gu"){//如果是认购类型改的是认沽合约，则不用改变相应的认购合约
                    cross.cord_gu=stock;//选中的为认沽合约
                    sessionStorage.setItem("cross",JSON.stringify(cross))
                    this.$router.push({path:'/one_cross_rgou'});
                }
            }else if(cross.type==="gu"){
                if(cross.change_type==="gu"){
                    this.$http.post(Api.oneCross,stock).then(res=>{
                        if(res.data.Status==="1"){
                            cross.cord_gu=stock;//选中的认沽合约
                            cross.cord_gou=res.data.Data[0];//查询的认沽合约
                            sessionStorage.setItem("cross",JSON.stringify(cross))
                            this.$router.push({path:'/one_cross_rgou'});
                        }
                    })
                }else if(cross.change_type==="gou"){//如果是认购类型改的是认沽合约，则不用改变相应的认购合约
                    cross.cord_gou=stock;//选中的为认购合约
                    sessionStorage.setItem("cross",JSON.stringify(cross))
                    this.$router.push({path:'/one_cross_rgou'});
                }
            }
           
        }
    }
};
</script>

<style scoped>
.search_contract{
    height: 100%;
    background: #fff;
    font-size: 14px;

}
.content_wrap  {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top:45px;
    overflow:auto;
}
.custom-header {
  position: fixed;
  height: 24px;
  line-height: 24px;
  width: 100vw;
  text-align: center;
  top: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 1001;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.back,
.else-fun {
  position: absolute;
  height: 20px;
  top: 2px;
  cursor: pointer;
  padding: 10px;
}
.back {
  left: 0;
}
.search{
    /* padding: 0 10px 0 40px; */
    position: absolute;
    top: 10px;
    height: 25px;
    left: 32px;
    right: 10px;
}
.search input{
    width: 100%;
    height: 100%;
    /* background: #e6e6e6; */
    padding: 0 10px;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
}
.search_recod>div:first-child{
    text-align: left;
    color: #b3b3b3;
    padding: 10px;
    padding-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.recod_content{
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
}
.recod_content>div{
    background: #F0F0F0;
    color: #999;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 3px 15px;
    border-radius: 20px;
}
.input_content{
    padding: 0 10px;
    /* background: #fff; */
}
.input_content>div{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    /* border-bottom: 1px solid #e6e6e6; */
}
</style>
