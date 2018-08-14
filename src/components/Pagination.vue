<template>
    <b-pagination size="md" 
        @change="clickPagination"
        hide-goto-end-buttons
        align="center"
        :total-rows="getCurrentMaxPages" 
        :per-page="25"
        v-model="page"
        >
    </b-pagination>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            page: 1
        }
    },
    computed: {
		...mapGetters(['getCurrentMaxPages'])
    },
    methods: {
        ...mapActions(['loadCurrentPosts']),
        clickPagination(e) {
            window.scrollTo(0, 0)
            this.loadCurrentPosts(e)
        }
    },
    created() {
        this.$store.watch(
        (state)=>{
            return this.$store.state.pageTrigger
        },
        (newValue, oldValue)=>{
            this.page = 1
        })
    }
}
</script>

<style lang="less">

    .page-item.active .page-link {
        background-color: #6b757c!important;
        border-color: #22252a!important;
    }

</style>
