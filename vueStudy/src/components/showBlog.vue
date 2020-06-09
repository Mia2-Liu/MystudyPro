<template>
  <div id="showBlog" v-theme:column="'wide'">
    <!-- 通过$route.query可以拿到url上的参数 -->
    <div style="margin-bottom:20px;">可以拿到url上传的参数-----{{this.$route.query.id}}</div>
    <input type="text" v-model="search" />
    <div class="list" v-for="item in filterBlogs" :key="item.id">
        <!-- key值不可以为对象，可以是字符串或者数字 -->
      <!-- 自定义属性v-rainbow -->
      <router-link v-bind:to='"/blog/"+item.id'><h2 v-rainbow>{{item.title}}</h2></router-link>
      <article>{{item.body | snippet}}</article>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "showBlog",
  data() {
    return {
      postList: [],
      search: ""
    };
  },
  created: function() {
    // console.log(this.$route.query.id)
    this.$axios.get("posts").then((data)=> {
        // console.log(data)
        this.postList = data.data.splice(0, 10);
      });
  },
  computed: {
    filterBlogs: function() {
      return this.postList.filter(blog => {
        return blog.title.match(this.search);
      });
    }
  },
  filters: {
    //自定义过滤器·
    //过滤器的第一个参数是管道符前面的值
    //过滤器可以传递多个参数
    snippet(value) {
      return value.slice(1, 100) + "...";
    }
  },
  directives: {
    // 自定义指令，指令名，不需要加“v-”,调用的时候需要加“v-”
    rainbow: {
      bind(el, binding, vnode) {
        /*
        *el: 绑定自定义属性的元素
        *binding.value: 自定义属性传的名字(v-rainbow="'wide'"),值为字符串，或者对象，或者数组。binding.wide,
        *binding.ary: (v-rainbow:normal='wide'),binding.arg.normal
        */
        el.style.color =
          "#" +
          Math.random()
            .toString(16)
            .slice(2, 8);
      }
    }
  }
};
</script>

<style lang="" scoped>
    #showBlog {
        padding: 20px;
        box-sizing: border-box;
    }
    .list {
        margin-top: 20px;;
        background: #ccc;
        padding: 20px;
    }
</style>