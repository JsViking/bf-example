<template>
	<div class="hello">
		<b-navbar toggleable="md" type="dark" variant="dark">

			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

			<b-navbar-brand class="title">
				<img :src="group.photo_200" alt="BV">
				{{ group.name }}
			</b-navbar-brand>

			<b-collapse is-nav id="nav_collapse">

				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">

					<b-nav-form @submit.prevent>
						<b-form-input v-model="searchStr" size="sm" class="mr-sm-2" type="text" placeholder="Поиск" @input="search()"/>
					</b-nav-form>

					<b-nav-item-dropdown text="Тип записи" :class="{active: typeActive}" right>
						<b-dropdown-item :active='types.text' @click="selectType('text', $event)">Текст</b-dropdown-item>
						<b-dropdown-item :active='types.photo' @click="selectType('photo', $event)">Фото</b-dropdown-item>
						<b-dropdown-item :active='types.doc' @click="selectType('doc', $event)">gif</b-dropdown-item>
						<b-dropdown-item :active='types.link' @click="selectType('link', $event)">Ссылка</b-dropdown-item>
						<b-dropdown-item :active='types.video' @click="selectType('video', $event)">Видео</b-dropdown-item>
						<b-dropdown-item :active='types.poll' @click="selectType('poll', $event)">Опрос</b-dropdown-item>
						<b-dropdown-item :active='types.all' @click="selectType('all', $event)">Все</b-dropdown-item>
					</b-nav-item-dropdown>

					<!-- <b-button @click="resetFilters" size="sm" class="my-2 my-sm-0" type="submit">Сброс</b-button> -->
					<b-nav-item @click="submitRemoveList" right>Удалить</b-nav-item>
					<b-nav-item @click="resetData" right>Сброс</b-nav-item>
					<b-nav-text>|</b-nav-text>
					<b-nav-item @click="exit" right>Выход</b-nav-item>
				</b-navbar-nav>

			</b-collapse>
		</b-navbar>
		<b-navbar toggleable="md" type="dark">
				<b-navbar-nav class="ml-auto">

					<b-nav-form @submit.prevent>
						<b-form-input v-model="groupID" size="sm" class="mr-sm-2" type="text" placeholder="Введите адрес группы"/>
						<app-date-picker :offset="offsetY"></app-date-picker>
					</b-nav-form>

					<b-button @click="searchGroup" size="sm" class="my-2 my-sm-0 submit-group-btn" type="submit">Начать поиск</b-button>
				</b-navbar-nav>			
		</b-navbar>
	</div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import DatePicker from '../components/DatePicker'

export default {
	name: 'navBar',
	props: ['group'],
	data() {
		return {
			types: {
				text: false,
				photo: false,
				doc: false,
				link: false,
				video: false,
				poll: false,
				all: false
			},
			typeActive: false,
			searchStr: '',
			timeout: null,
			offsetY: 0,
			groupID: ''
		}
	},
	computed: {
		...mapGetters(['getType', 'getRemoveList', 'getDate'])
	},
	methods: {
		...mapMutations(['updateType', 'updateSearch', 'reset', 'resetTrash']),
		...mapActions(['loadCurrentPosts', 'hidePost', 'getPostsUpdate']),
		selectType(type) {
			this.typeActive = false
			for (let i in this.types) {
				if (i == type) {
					if (i == 'all') {
						type = ''
						this.typeActive = false
					} else if (this.getType == i) {
						type = ''
						this.types[i] = false
					} else {
						this.types[i] = true
						this.typeActive = true
					}
				} else {
					this.types[i] = false
				}
			}
			this.updateType(type)
			this.loadCurrentPosts(1)
		},
		search(e) {
			clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				this.updateSearch(this.searchStr)
				this.loadCurrentPosts(1)
			}, 500)
		},
		resetFilters() {
			this.reset()
			this.searchStr = ''
			this.loadCurrentPosts(1)
		},
		exit() {
			let conf = confirm('Вы точно хотите выйти?')
			if (conf) {
				// this.reset()
				// this.$router.push({ name: 'Main' })
				location.reload(true)
			}
		},
		resetData() {
			let conf = confirm('Вы точно хотите сбрсить список отмеченных постов?')
			if (conf) {
				this.resetTrash()
			}
		},
		submitRemoveList() {
			if (this.getRemoveList.length > 0) {
				let conf = confirm('Удалить посты из выдачи?')
				if (conf) {
					this.hidePost()
				}
			} else {
				alert('Нет отмеченных постов!')
			}
		},
		searchGroup() {
			if (this.groupID && this.getDate) {
				let nameGroup = this.groupID.replace('https://', '')
				nameGroup = nameGroup.replace('http://', '')
				nameGroup = nameGroup.replace('vk.com/', '')
				this.getPostsUpdate(nameGroup)
			} else {
				alert('Введите адрес группы и дату')
			}
		}
	},
	components: {
		'app-date-picker': DatePicker
	}
}
</script>

<style scoped lang="less">
	.title {
		img {
			position: relative;
			width: 35px;
			height: 35px;
			border-radius: 5%;
		}
	}
	.hello {
		.submit-group-btn {
			margin-left: 8px;
		}
	}
</style>
