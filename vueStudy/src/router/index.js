import showBlog from '../components/showBlog.vue'
import addlog from '../components/addlog.vue'
import detail from '../components/detail.vue'
import note from '../components/note.vue'
import notechild from '../components/notechild.vue'
import list from '../components/listDome.vue'
export default[
    {path:'/',redirect: '/showBlog'},//redirect重定向组件的url地址
    // {path:'/',component: showBlog},
    {path:'/showBlog',component: showBlog},
    //path中设置了参数，route-link中要传递参数，否则无法加载组件
    {path:'/add/:id/:name',component: addlog},
    {
        path:'/note',
        component: note,
        children:[
            //子路由的path不加斜线，加了斜线是从根路径开始
            {path:'notechild',component: notechild}
        ]
    },
    {path:'/list',component: list},
    {path:'/blog/:id',component: detail}
]