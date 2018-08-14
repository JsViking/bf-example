import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import Groups from './views/Groups.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Main',
			component: Main
		},
		{
			path: '/group',
			name: 'Groups',
			component: Groups
		}
	]
})
