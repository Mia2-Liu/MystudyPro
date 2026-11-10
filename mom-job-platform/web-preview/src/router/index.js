import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/mom/jobs'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/role-select',
    name: 'RoleSelect',
    component: () => import('../pages/RoleSelect.vue')
  },
  {
    path: '/mom/jobs',
    name: 'MomJobs',
    component: () => import('../pages/mom/JobList.vue')
  },
  {
    path: '/mom/job/:id',
    name: 'MomJobDetail',
    component: () => import('../pages/mom/JobDetail.vue')
  },
  {
    path: '/mom/applications',
    name: 'MomApplications',
    component: () => import('../pages/mom/Applications.vue')
  },
  {
    path: '/mom/profile',
    name: 'MomProfile',
    component: () => import('../pages/mom/Profile.vue')
  },
  {
    path: '/mom/resume',
    name: 'MomResume',
    component: () => import('../pages/mom/Resume.vue')
  },
  {
    path: '/company/index',
    name: 'CompanyIndex',
    component: () => import('../pages/company/Index.vue')
  },
  {
    path: '/company/publish',
    name: 'CompanyPublish',
    component: () => import('../pages/company/Publish.vue')
  },
  {
    path: '/company/manage',
    name: 'CompanyManage',
    component: () => import('../pages/company/JobManage.vue')
  },
  {
    path: '/company/applicants/:jobId',
    name: 'CompanyApplicants',
    component: () => import('../pages/company/Applicants.vue')
  },
  {
    path: '/company/profile',
    name: 'CompanyProfile',
    component: () => import('../pages/company/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
