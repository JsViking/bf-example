<template>
	<div class="flex">
		<div class="main-wrapper">
			<div class="logo">
				<img src="../assets/bullfinch-logo.jpg" alt="">
			</div>
			<b-input-group size="sm">
				<b-form-input  type="url" placeholder="Введите адрес группы" v-model="groupID"></b-form-input>
				<b-input-group-append>
					<b-btn @click="searchGroup" variant="success">Поиск</b-btn>
				</b-input-group-append>
			</b-input-group>
			<app-date-picker :offset="offsetY"></app-date-picker>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DatePicker from '../components/DatePicker'

export default {
	name: 'Main',
	data() {
		return {
			groupID: '',
			offsetY: -250
		}
	},
	methods: {
		...mapGetters(['getDate']),
		...mapActions(['getPostsUpdate']),
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

<style lang="less">
	.flex {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		.logo {
			position: relative;
			width: 400px;
			height: 268px;
			margin-bottom: 20px;
			img {
			    position: relative;
    			width: 100%;
			}
		}
	}
	.main-wrapper {
		position: relative;
		width: 400px;
		.datepicker-trigger {
			input {
				margin: 10px;
			}
		}
	}
</style>

