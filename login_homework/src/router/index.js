import {createRouter, createWebHistory} from 'vue-router'
import Index from "@/views/Index.vue"
import IndexPage from '@/views/Index/IndexPage.vue'
import {useUserStore} from "@/stores/useUserScore.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            score: 'home',
            component: Index,
            redirect: "/index-page",
            children: [
                {
                    path: 'index-page',
                    score: 'IndexPage',
                    component: IndexPage
                },
                {
                    path: 'student-manage',
                    score: 'StudentManage',
                    component: () => import("@/views/Index/StudentManage.vue")
                },
                {
                    path: 'student-scores',
                    score: 'StudentScores',
                    component: () => import('@/views/Index/StudentScores.vue')
                },
                {
                    path: 'subject-manage',
                    score: 'SubjectManage',
                    component: () => import('@/views/Index/SubjectManage.vue')
                },
                {
                    path: 'subjects-choose',
                    score: 'SubjectChoose',
                    component: () => import('@/views/Index/SubjectChoose.vue')
                },
                {
                    path: 'teacher-manage',
                    score: 'TeacherManage',
                    component: () => import('@/views/Index/TeacherManage.vue')
                },
                {
                    path: 'class-manage',
                    score: 'ClassManage',
                    component: () => import('@/views/Index/ClassManage.vue')
                },
                {
                    path: 'subject-list',
                    score: 'SubjectList',
                    component: () => import('@/views/Index/SubjectList.vue')
                },
                {
                    path: 'my-score',
                    score: 'MyScore',
                    component: () => import('@/views/Index/MyScore.vue')
                }

            ]
        },
        {
            path: '/login',
            score: 'about',
            component: () => import('@/views/Login.vue'),
            redirect: "/login/sign-in",
            children: [
                {
                    path: 'sign-in',
                    score: 'SignIn',
                    component: () => import('@/views/Login/SignIn.vue'),
                },
                {
                    path: 'forget',
                    score: 'Forget',
                    component: () => import('@/views/Login/ForgetPassword.vue'),
                }
            ]
        }
    ]
})


router.beforeEach((to, from, next) => {
    const store = useUserStore()
    console.log(to.path)
    console.log(store.isExisted())
    if (to.path.includes("/login/")) {
        if (store.isExisted()) {
            next("/")
        } else {
            next()
        }
    } else {
        if (store.isExisted()) {
            next()
        } else {
            next("/login/sign-in")
        }
    }
})

export default router
