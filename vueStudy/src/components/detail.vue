<template>
    <div class="detail">
        <h2>{{dataList.title}}</h2>
        <p>{{dataList.body}}</p>
        
    </div>
</template>

<script>
    // import axios from "axios";
    export default {
        name:'detail',
        data(){
            return{
                id:this.$route.params.id,
                dataList:{}
            }
        },
        created(){
            this.$axios.get("posts/"+this.id)
            .then((data)=>{
                this.dataList = data.data
            })
        }
    }
</script>

<style lang="" scoped>
    .detail{
        margin-top: 20px;
        padding: 20px;
        background: #ccc;
    }
</style>