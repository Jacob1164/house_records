import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Post from '@/components/Post'
import Records from '@/components/Records'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Claim from '@/components/Claim'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      alias: '/Home'
    },
    {
      path: '/post',
      name: 'Post',
      component: Post
    },
    {
      path: '/records/:houseId',
      name: 'Records',
      component: Records
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/account/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/account/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/claim',
      name: 'Claim',
      component: Claim
    }
  ]
})
