/*
 * @Author: liuyaya 
 * @Date: 2019-09-17 16:19:37 
 * @Last Modified by:   liuyaya 
 * @Last Modified time: 2019-09-17 16:19:37 
 */
<template>
    <div class="nav">
        <!-- exact可以让点击的内容加样式，其他的去掉样式 -->
        <!-- 如果在路由中使用查询字符串，给路由传递参数，不需要在路由规则中修改path的配置
        但是直接访问不加参数的url没有选中样式
        
         -->
        <router-link to='/showBlog?id=111'>博客总览</router-link>
        <router-link to='/add/12/ls'>添加博客</router-link>
        <router-link to='/note'>学习笔记</router-link>
        <router-link to='/list'>管理列表的demo</router-link>
    </div>
</template>

<script>
    export default {
        name:'blog-header'
    }
</script>

<style lang="" scoped>
    .nav{
        background: red;
        padding: 20px;
        
    }
    a{
        margin-right:20px;
        text-decoration: none;
        color: #fff;
    }
    .router-link-active{
        background: rgba(255, 255, 255, .5);
        color: #333;
        padding: 10px;
        border-radius: 5px;
    }
    .myActive{
        background: rgba(255, 255, 255, .5);
        color: #333;
        padding: 10px;
        border-radius: 5px;
    }
</style>