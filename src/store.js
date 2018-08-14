import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		group: {},
		backend_host: 'https://dev.bullfinch.tigermilk.ru/backend',
		// backend_host: 'http://127.0.0.1:3333',
		spinnerActive: false,
		currentGroupId: '',
		currentPost: {
			data: []
		},
		currentMaxPages: 0,
		type: '',
		search: '',
		sort: '',
		date: '',
		pageTrigger: false,
		socketToken: '',
		removeList: []
	},
	getters: {
		getBackendHost: state => {
			return state.backend_host
		},
		getGroup: state => {
			return state.group
		},
		getSpinnerStatus: state => {
			return state.spinnerActive
		},
		getСurrentPost: state => {
			return state.currentPost
		},
		getCurrentMaxPages: state => {
			return state.currentMaxPages
		},
		getType: state => {
			return state.type
		},
		getSearch: state => {
			return state.search
		},
		getCurrentGroupId: state => {
			return state.currentGroupId
		},
		getDate: state => {
			return state.date
		},
		getSocketToken: state => {
			return state.socketToken
		},
		getRemoveList: state => {
			return state.removeList
		}
	},
	mutations: {
		getPostsUpdate (state, payload) {
			state.spinnerActive = true
			let url = `${state.backend_host}/api/v1/social/getPostsUpdate?group_id=${payload}&date=${state.date}&token=${state.socketToken}`
			axios.get(url).then((result) => {
				if (result.data) {
					state.group = result.data[0]
					state.currentGroupId = result.data[0].id
				} else {
					alert('Такой группы нет в ВК')
					state.spinnerActive = false
				}
			})
		},
		loadCurrentPosts (state, payload) {
			state.spinnerActive = true
			let search = encodeURIComponent(state.search)
			let url = `group_id=${state.currentGroupId}&page=${payload}&type=${state.type}&sort=${state.sort}&search=${search}&date_mark=${state.date}`

			axios.get(`${state.backend_host}/api/v1/social/getPostsList?${url}`).then((result) => {
				state.currentPost.data = result.data.posts
				state.currentMaxPages = result.data.count
				state.spinnerActive = false
			})
		},
		updateType(state, payload) {
			state.type = payload
			state.pageTrigger = !state.pageTrigger
		},
		updateSearch(state, payload) {
			state.pageTrigger = !state.pageTrigger
			state.search = payload
		},
		updateSort(state, payload) {
			state.pageTrigger = !state.pageTrigger
			state.sort = payload
		},
		updateDate(state, payload) {
			state.date = payload
		},
		hidePost (state) {
			state.spinnerActive = true
			let url = `${state.backend_host}/api/v1/social/hidePost`
			let data = {
				ids: state.removeList
			}
			axios.post(url, data).then((result) => {
				if (result.data) {
					for (let j of state.removeList) {
						for (let i = 0; i < state.currentPost.data.length; i++) {
							if (j == state.currentPost.data[i]._id) {
								state.currentPost.data.splice(i, 1)
							}
						}
					}
					state.removeList = []
				}
				state.spinnerActive = false
			})			
		},
		reset (state) {
			state.type = '',
			state.search = '',
			state.sort = '',
			state.date = '',
			state.groups = [],
			state.currentMaxPages = 0,
			state.currentGroupId = '',
			state.title = ''
		},
		spinnerSwitch (state, payload) {
			state.spinnerActive = payload
		},
		resetTrash (state) {
			state.spinnerActive = true
			let url = `${state.backend_host}/api/v1/social/resetTrash?group_id=${state.currentGroupId}&date=${state.date}&token=${state.socketToken}`
			axios.get(url).then(() => {
				state.removeList = []
			})				
		},
		makeToken(state) {
			let text = ""
			let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			
			for (var i = 0; i < 7; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length))
			}
			state.socketToken = text
		},
		updateRemoveList(state, payload) {
            let index = state.removeList.indexOf(payload)
            if (index == -1) {
                state.removeList.push(payload)
            } else {
                state.removeList.splice(index, 1)
            }
            console.log('removeList', state.removeList)			
		}
	},
	actions: {
		getPostsUpdate ({ commit }, payload) {
			commit('getPostsUpdate', payload)
		},
		loadCurrentPosts ({ commit }, payload) {
			commit('loadCurrentPosts', payload)
		},
		pagination ({ commit }, payload) {
			commit('pagination', payload)
		},
		hidePost ({ commit }, payload) {
			commit('hidePost', payload)
		}			
	}
})
