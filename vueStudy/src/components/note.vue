<template>
    <div id="note">
        <router-link to="/note/notechild">路由的子组件</router-link>
        <router-view></router-view>
        <h1 v-cloak>{{msg}}--插值表达式</h1>
        <h1 v-text="msg">这里是x-text</h1>
        <!-- {{}}和v-text的区别
            1. v-text不存在加载数据闪烁的问题
            2. v-text会覆盖元素里原本的内容，{{}}只会把自己的占位符替换，不会把其他内容替换
         -->
        <div v-html="msgHtml"></div>
        <!-- v-html绑定并渲染html结构 -->

        <button v-bind:title="titleTxt+'字符串'">按钮</button>
        <button :title="titleTxt+'字符串'">按钮</button>
        <!-- v-bind可以绑定属性
             简写：v-bind可以不写，只保留“:”就可以了 -->
        <button v-on:click="alert">按钮</button>
        <button @click="alert">按钮</button>
        <!-- v-on是用来绑定事件的
              简写：@-->

        <!-- 例子：跑马灯效果 -->
        <div class="pmd">
            <h2>跑马灯效果</h2>
            <button @click="lang">浪起来</button>
            <button @click="didiao">低调</button>
            <p>{{pmd}}</p>
        </div>

        <!-- 阻止冒泡修饰符 .stop 
            不加.stop会先执行按钮的事件，再执行div的事件
            加.stop，就会阻止button事件的冒泡，只触发button事件-->

        <!-- .capture是捕获事件，添加后会先执行div的事件 
                .stop就阻止不了冒泡了-->
        <div @click.capture="divHandler">
            <button @click.stop="btnHandler">阻止冒泡、捕获事件</button>
        </div>

        <!-- .self只有点击到本身才会触发，button冒泡也不会触发到div的事件
                .self也可以实现冒泡，但只限设置了.self本身，如果多层的话就阻止不了了 -->
        <div @click.self="divHandler">
            <button @click="btnHandler">self本身</button>
        </div>
        <!-- .once只允许执行一次,加了其他修饰符也只会执行一次 -->
        <div @click.prevent.once="divHandler">
            <button @click="btnHandler">once</button>
        </div>

        <!-- 阻止默认行为 .prevent,就不会跳转百度了-->
        <a href="http://www.baidu.com" @click.prevent="btnHandler"></a>

        <!-- v-model双向数据绑定 -->
        <input type="text" v-model="msg">

        <!-- v-model的简易计算器例子 -->
        <h2>v-model的简易计算器例子</h2>
        <input type="text" v-model="n1">
        <select v-model="opt">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
        </select>
        <input type="text" v-model="n2">
        <button @click="count">计算</button>
        <input type="text" v-model="result">

        <!-- 通过属性绑定class样式 
                1. 以数组的方式传多个class名，可以使用三元表达式
                2. 还可以写对象的形式：属性名为class名，值为布尔类型
                3. 还可以直接书写对象的形式，属性名可以不加引号，不用数组-->
        <h2 :class="['thin','red',flag?'active':'']">通过属性绑定class样式</h2>
        <h2 :class="['thin','red',{'active':flag}]">通过属性绑定class样式</h2>
        <!-- 对象还可以抽出来放在data中，进行绑定变量名 -->
        <h2 :class="{thin:true,red:true,acitve:flag}">通过属性绑定class样式</h2>
        <!-- 绑定style，可以直接用对象，也可以把多个对象定义为变量，用数组引用 -->        
        <h2 :style="{color:'#eeee'}">通过属性绑定class样式</h2>

        <!-- v-for的用法 -->
        <h2>v-for的用法</h2>
        <!-- v-for可以循环普通数组：
            v-for='item in numArr' 
            v-for='(item,index) in numArr' 
            item为内容，index为索引
        可以循环对象数组：同普通数组
        可以循环对象：
            v-for='(val,key,index) in numObj' 
            var为值，key为键，index为索引
        可以循环数字：循环数字从1开始
            v-for='num in 10' 
        在2.2.0以上的版本，v-for循环中，必须要绑定key值 ，
        key数的值只能为数字或者字符串  
         -->
        <ul>
            <li v-for='(item,index) in numArr' :key="item">{{index}}：索引,{{item}}：内容</li>
        </ul>
        <ul style="margin-top:20px">
            <li v-for='(num,index) in 10' :key='num'>{{index}}：索引,{{num}}：内容</li>
        </ul>

         <!-- v-if和v-show的用法 -->
        <h2>v-if和v-show的用法</h2>
        <!-- v-if: 整个dom结构都删除了，切换性能成本较大
             v-show ： 添加了一个display:none
         -->
        <button @click="flag = !flag">toggle</button>
        <p v-if="flag">v-if</p>
        <p v-show="flag">v-show</p>

        <!-- 过度动画 -->
        <div>
            <button @click="flag = !flag" style="margin-top:20px;">动画toggle</button>
        </div>
        <transition>
            <h3 v-show="flag">这是一个动画</h3>
        </transition>
        <form action="">
            <input type="text" v-model="firstName">
            <input type="text" v-model="lastName">
            <input type="text" v-model="fullName">
            <p>{{fullName}}</p>
            <p>{{fullName}}</p>
            <p>{{fullName}}</p>
        </form>
    </div>
</template>

<script>
    //调用data的数据或methods里面的方法，通过this.方法名来访问
    //this是new出来的实例对象
    export default {
        name:'note',
        data(){
            //实例中的data是一个对象data:{}
            //组件的data应该是一个function，并且必须return一个对象
            //组件中的data和实例出来的data使用方法一样
            return{
                //必须要return一个对象的原因是为了每次调用data数据的时候都指向的是一个新的堆内存地址，
                //达到调用的组件之前数据互不影响
                msg:'vue学习笔记',
                msgHtml:'<h2>html结构需要用v-html调用</h2>',
                titleTxt:'dddd',
                pmd:'我就是跑马灯，吼吼吼~~~',
                temerity: null,
                n1:0,
                n2:0,
                result:0,
                opt:'+',
                flag: false,
                numArr:[1,2,54,5,58,4,55],
                firstName:'',
                lastName:''
            }
        },
        methods: {
            count(){
                //方法一
                // switch(this.opt){
                //     case '+':
                //         this.result = parseInt(this.n1) + parseInt(this.n2);
                //     break;
                //     case '-':
                //         this.result = parseInt(this.n1) - parseInt(this.n2);
                //     break;
                //     case '*':
                //         this.result = parseInt(this.n1) * parseInt(this.n2);
                //     break;
                //     case '/':
                //         this.result = parseInt(this.n1) / parseInt(this.n2);
                //     break;
                // }

                //方法二
                var countStr = 'parseInt(this.n1)' +this.opt+ 'parseInt(this.n2)'
                this.result = eval(countStr);
            },

            alert(){
                alert('dddd');
            },
            lang(){//跑马灯效果
                //用箭头函数可以改变this指向跟外面保持一致
                if(this.temerity != null) return //防止多次操作

                this.temerity= setInterval(() => {
                    //获取到第一个字符
                    var startStr = this.pmd.substring(0,1);
                    //获取到除第一个字符外的其他字符
                    var endStr = this.pmd.substring(1);
                    this.pmd = endStr + startStr;
                }, 200);

            },
            didiao(){
                //清除定时器
                clearInterval(this.temerity)
                //为了防止多次操作的判断，清除之后要设为null
                this.temerity = null;
            },
            divHandler(){
                console.log('div')
            },
            btnHandler(){
                console.log('button')
            }
        },
        computed:{// 在 computed 中，可以定义一些 属性，这些属性，叫做 【计算属性】， 计算属性的本质就是一个方法，只不过，我们在使用 这些计算属性的时候，是把 它们的 名称，直接当作 属性来使用的；并不会把计算属性，当作方法去调用；
        //computed要return一个值
        // 注意1： 计算属性，在引用的时候，一定不要加 () 去调用，直接把它当作普通属性去使用就好了；
        // 注意2： 只要计算属性，这个function内部，所用到的任何 data 中的数据发送了变化，就会 立即重新计算 这个 计算属性的值
        // 注意3： 计算属性的求值结果，会被缓存起来，方便下次直接使用； 如果 计算属性方法中，所以来的任何数据，都没有发生过变化，则，不会重新对 计算属性求值；
        //多次调用，只执行了一次，计算结果北环存起来了，直接可以调用；优化了性能，提高了代码质量
            'fullName':function(){
                console.log('ok')
                return this.firstName +'--'+this.lastName
            }
        }
    }
</script>

<style lang="scss" scoped>
    [v-cloak]{
        display: none;
        /* 可以防止加载数据闪烁的问题 */
    }
    .red{
        color: red;
    }
    .thin{
        font-weight: 100;
    }
    .active{
        font-style: italic;
    }

    .v-enter,.v-leave-to{
        opacity: 0;
        transform: translateX(100px);
    }
    .v-enter-active,.v-leave-active{
        transition: all 1s ;
    }
</style>