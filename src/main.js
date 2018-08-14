import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import VueCookie from'vue-cookie'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'

import 'vue-airbnb-style-datepicker/dist/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { mapMutations } from 'vuex'

const datepickerOptions = {
	days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
	daysShort: ['Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Суб', 'Вск'],
	monthNames: [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	],
	texts: {
		apply: 'Применить',
		cancel: 'Отмена'
	},
	offsetY: '100px'
}
Vue.use(AirbnbStyleDatepicker, datepickerOptions)
Vue.use(BootstrapVue)
Vue.use(VueCookie)
Vue.use(VueSocketio, socketio('https://dev.bullfinch.tigermilk.ru', { path: '/backend/socket.io' }))
Vue.config.productionTip = false

new Vue({
	router,
	store,
	sockets: {
		connect: function() {
			console.log('socket connected')
		},
		customEmit: function(val){
			if (val.token == this.$store.getters.getSocketToken) {
				if (val.type == 'getpostupdate_done') {
					this.spinnerSwitch(false)
					router.push({ name: 'Groups'})
					this.$store.commit('loadCurrentPosts', 1)
				} else if (val.type == 'getpostupdate_error') {
					this.spinnerSwitch(false)
					alert('Превышен лимит запросов в ВК')
				} else if (val.type == 'getpostupdate_empty') {
					this.spinnerSwitch(false)
					alert('Для начала удалите посты')					
				}
			}
		}
	},
	methods: {
		...mapMutations(['spinnerSwitch'])
	},
	render: h => h(App)
}).$mount('#app')
