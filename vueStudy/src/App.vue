<template lang='html'>
  <div id="app">
    <!-- <addlog></addlog>
    <showBlog></showBlog> -->
    <blogHeader></blogHeader>
    <transition mode='out-in'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import addlog from './components/addlog'
import showBlog from './components/showBlog'
import blogHeader from './components/blogHeader';

export default {
  name: 'App',
  data(){
    return{
      
    }
  },
  components: {
    addlog,
    showBlog,
    blogHeader
  },
  methods:{
    
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 1000px;
  margin: 0 auto;
  /* text-align: center; */
  color: #2c3e50;
}
.v-enter,
.v-leave-to{
  transform: translateX(50px);
}
.v-enter-active,
.v-leave-active{
  transition: all 0.5s;
}
</style>
