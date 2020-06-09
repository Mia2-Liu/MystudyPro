<template>
  <div class="addlog">
    <form v-if="!log.submited">
      <h1>添加博客</h1>
      <h2>通过$route.params获取路由参数----{{$route.params.id}}----{{$route.params.name}}</h2>
      <p>
        <label for="">博客标题：</label>
        <input type="text" v-model="log.title">
      </p>
      <p>
        <label for="">博客内容：</label>
        <textarea name="" id="" cols="30" rows="10" v-model="log.content"></textarea>
      </p>
      <p>
        <input type="checkbox" name="" value="vue.js" v-model="log.category" id="">
        <label for="">vue.js</label>
        <input type="checkbox" name="" value="node.js" v-model="log.category" id="">
        <label for="">node.js</label>
        <input type="checkbox" name="" value="react.js" v-model="log.category" id="">
        <label for="">react.js</label>
        <input type="checkbox" name="" value="angular.js" v-model="log.category" id="">
        <label for="">angular.js</label>
      </p>
      <p>
        <label for="">作者：</label>
        <select v-model="log.author">
          <option v-for="item in log.authorsArr" :key="item">{{item}}</option>
        </select>
      </p>
      <button v-on:click.prevent='submit'>提交</button>
    </form>
    <div class="yl" v-if="log.submited">
      <h2>恭喜你，博客发布成功！！！</h2>
      <h3>博客预览</h3>
      <p>博客标题：{{log.title}}</p>
      <p>博客内容：{{log.content}}</p>
      <p>博客类型：</p>
      <ul>
        <li v-for="item in log.category" :key="item"> {{item}}</li>
      </ul>
      <p>博客作者：{{log.author}}</p>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: 'addlog',
  data () {
    return {
      log:{
        title:'',
        content:'',
        category:[],
        authorsArr:['aaa','ddfdf','ddd'],
        author:'',
        submited:false
      },
    }
  },
  methods:{
    submit:function(){
      let self = this;
      this.$axios.post('posts',{
        title:self.log.title,
        body:self.log.content,
        userId:1
      }).then(function(data){
        self.log.submited = true;
        console.log(data);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
