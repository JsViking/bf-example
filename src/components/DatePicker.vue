<template>
    <div>
        <div class="datepicker-trigger">
        <input
            type="text"
            id="datepicker-trigger"
            placeholder="Введите дату"
            :value="formatDates(dateOne, dateTwo)"
            @keyup.8="clrDate"
        >

        <AirbnbStyleDatepicker
            :trigger-element-id="'datepicker-trigger'"
            :mode="'range'"
            :fullscreen-mobile="true"
            :date-one="dateOne"
            :date-two="dateTwo"
            @date-one-selected="val => { dateOne = val }"
            @date-two-selected="val => { dateTwo = val }"
            @apply='addDateRange'
            :offsetY="offset"
        />
        </div>
    </div>
</template>

<script>
import format from 'date-fns/format'
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
    props: ['offset'],
    data() {
        return {
            dateFormat: 'D MMM YY',
            dateOne: '',
            dateTwo: ''
        }
    },
	computed: {
		...mapGetters(['getDate'])
	},
    methods: {
        ...mapMutations(['updateDate']),
    	...mapActions(['loadCurrentPosts']),
        formatDates(dateOne, dateTwo) {
            let formattedDates = ''
            if (dateOne) {
                formattedDates = format(dateOne, this.dateFormat)
            }
            if (dateTwo) {
                formattedDates += ' - ' + format(dateTwo, this.dateFormat)
            }
            return formattedDates
        },
        addDateRange() {
            let date = ''
            if (this.dateOne) {
                date = this.dateOne
            }
            if (this.dateTwo) {
                date += '/' + this.dateTwo
            } else {
                let arr = this.dateOne.split('-')
                arr[0] = this.dateOne.split('-')[0] * 1 + 5
                let dateTwoPluse = arr.join('-')
                date += '/' + dateTwoPluse
            }
            this.updateDate(date)
        },
        clrDate() {
            let date = ''
            this.dateOne = ''
            this.dateTwo = ''
            this.updateDate(date)
			if (this.getCurrentGroupId) {
				let payload = {
					page: 1,
					group_id: this.getCurrentGroupId
				}
				this.loadCurrentPosts(payload)
			}
        }
    },
    created() {
        if (document.location.pathname == "/group") {
            if (this.getDate) {
                let date = this.getDate.split('/')
                this.dateOne = date[0]
                this.dateTwo = date[1]
            }
        }
    }
}
</script>

<style lang="less">
    .datepicker-trigger {
        input {
            border-radius: 4px;
            border: 1px lightgrey solid;
            padding: 2px 8px;
        }
    }
</style>
