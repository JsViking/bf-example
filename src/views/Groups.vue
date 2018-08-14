<template>
	<div class="groups">
		<app-nav-bar
			:group="getGroup"
		></app-nav-bar>
		<app-table
			:data="getСurrentPost.data"
		></app-table>
		<div v-if="getСurrentPost.data.length == 0" class="empty-wall">
			<h3>Нет постов...</h3>
		</div>
		<app-pagination>
		</app-pagination>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NavBar from '../components/NavBar'
import Table from '../components/Table'
import Pagination from '../components/Pagination'

export default {
	methods: {
		...mapActions(['loadCurrentPosts'])
	},
	computed: {
		...mapGetters(['getСurrentPost', 'getGroup', 'getCurrentGroupId'])
	},
	components: {
		'app-nav-bar': NavBar,
		'app-table': Table,
		'app-pagination': Pagination
	},
	created() {
		if (this.getCurrentGroupId) {
			// this.loadCurrentPosts(1)
		} else {
			this.$router.push({ name: 'Main'})
		}
	}
}
</script>

<style>
	.groups {
		position: relative;
	}
	.hello {
		position: fixed;
		z-index: 999;
		width: 100%;
		top: 0;
	}
	.empty-wall {
		position: relative;

	}
</style>


