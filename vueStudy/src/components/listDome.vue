<template>
  <div id="list">
    <form>
      <label for>id：</label>
      <input type="text" v-model="id" />
      <label for>Name：</label>
       <!-- 键盘修饰符，可以自定义 f2的键盘码是113
            Vue.config.keyCodes.f2 = 113-->
      <input type="text" v-model="name"  @keydown.f2="add" />
      <!-- <input type="button" @click="add" value="添加" /> -->
      <!-- 键盘修饰符 -->
      <input type="button" @keydown.enter="add" value="添加" />
 
      <input type="text" v-model="keywords" v-focus />
    </form>
    <table>
      <tr v-for="item in search(keywords)" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.name}}</td>
        <td>{{item.time | formatter('yyyy-mm-dd')}}</td>
        <td>
          <a href @click.prevent="del(item.id)">删除</a>
        </td>
      </tr>
    </table>
    <h2 v-color='"pink"'>自定义指令binding的用法</h2>
  </div>
</template>

<script>
export default {
    name: "list",
  data() {
      return {
          id: "",
      name: "",
      keywords: "",
      list: [
          { id: 1, name: "宝马", time: new Date() },
        { id: 2, name: "奔驰", time: new Date() }
      ]
    };
  },
  methods: {

    add() {
      this.list.push({
        id: this.id,
        name: this.name,
        time: new Date()
      });
      // return this.list
      this.id = this.name = "";
    },
    del(id) {
      var i = this.list.findIndex(item => {
        if (item.id == id) {
          return true;
        }
      });
      this.list.splice(i, 1);
    },
    search(keywords) {
      var newList = [];
      this.list.forEach((item, index) => {
        if (item.name.indexOf(keywords) > -1) {
          newList.push(item);
        }
      });
      return newList;
    }
  },
  filters: {
      //如果私有过滤器和全局过滤器重名，优先调用私有过滤器
    formatter(time, pattern = "") {
      var date = new Date(time),
        y = date.getFullYear(),
        m = (date.getMonth()).toString().padStart(2,0),
        d = (date.getDate()).toString().padStart(2,0),
        h = (date.getHours()).toString().padStart(2,0),
        mi = (date.getMinutes()).toString().padStart(2,0),
        se = (date.getSeconds()).toString().padStart(2,0);
      if (pattern == "yyyy-mm-dd") {
        return `${y}-${m}-${d}`;
      }else{
          return `${y}-${m}-${d}:${h}-${mi}-${se}`;
      }
    }
  },
  directives:{
      focus:{
          bind(el){
              //样式相关可以再bind里设置，
              //即使元素还没有被插入到DOM，都被把样式渲染到dom上
              el.style.color= 'red';
          },
          inserted(el){// 当被绑定的元素插入到 DOM 中时……
            //和行为有关系的要用inseted，确保元素已经被插入DOM里了
              el.focus();
          }
      },
      color:{
          bind(el,binding){
              el.style.color = binding.value;
          }
      },
      color:function(el,binding){
          //自定义指令，如果只用bind和update，可以简写，
          //这里的function等于把代码写到了bind和update里去了
        el.style.color = binding.value;
      }

  }
};
</script>

<style lang="scss" scoped>
form {
  margin-top: 40px;
}
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
}
td {
  border: 1px solid #ccc;
  padding: 20px;
}
</style>