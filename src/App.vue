<template>
	<div id="app">
		<app-spinner></app-spinner>
		<router-view/>
	</div>
</template>

<script>
import Spinner from './components/Spinner.vue'
import { mapMutations } from 'vuex'

export default {
	components: {
		'app-spinner': Spinner
	},
	created() {
		this.makeToken()
	},
	methods: {
		...mapMutations(['makeToken'])
	}
}
</script>

<style lang="less">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
}
</style>
