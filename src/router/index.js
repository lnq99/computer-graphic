import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'Lab',
    component: () => import('../views/Lab.vue'),
    children: [
      {
        path: 'lab2',
        components: {
          default: () => import('../views/lab2/Svg.vue'),
          panel: () => import('../views/lab2/Panel.vue'),
        },
      },
      {
        path: 'lab3',
        components: {
          default: () => import('../views/lab3/Canvas.vue'),
          panel: () => import('../views/lab3/Panel.vue'),
        },
      },
      {
        path: 'lab4',
        components: {
          default: () => import('../views/lab4/Canvas.vue'),
          panel: () => import('../views/lab4/Panel.vue'),
        },
      },
      {
        path: 'lab5',
        components: {
          default: () => import('../views/lab56/Canvas.vue'),
          panel: () => import('../views/lab56/Panel.vue'),
        },
      },
      {
        path: 'lab6',
        components: {
          default: () => import('../views/lab56/Canvas.vue'),
          panel: () => import('../views/lab56/Panel.vue'),
        },
      },
      {
        path: 'lab7',
        components: {
          default: () => import('../views/lab789/Canvas.vue'),
          panel: () => import('../views/lab789/Panel.vue'),
        },
      },
      {
        path: 'lab8',
        components: {
          default: () => import('../views/lab789/Canvas.vue'),
          panel: () => import('../views/lab789/Panel.vue'),
        },
      },
      {
        path: 'lab9',
        components: {
          default: () => import('../views/lab789/Canvas.vue'),
          panel: () => import('../views/lab789/Panel.vue'),
        },
      },
    ],
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
