<template>
    <div class="table-wrapper">
        <b-table
            ref="table"
            @sort-changed="sortingChanged"
            no-local-sorting
            striped
            small
            fixed
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="data"
            :fields="fields">
            <template slot="check" slot-scope="row">
                <b-form-checkbox
                    :id="row.item.post_id + ''"
                    v-model="row.item.check"
                    @change="updateRemoveList(row.item._id)"
                    v-b-tooltip.hover.right title="Нажмите чтобы убрать запись из выдачи"
                >
                </b-form-checkbox>
            </template>
            <template slot="content" slot-scope="row">
                <div v-for="i in row.item.attachments" class="content-wrapper">
                    <div v-if="i.type == 'photo'" class="image">
                        <img :src="i.photo.photo_604" alt="">
                    </div>
                    <div v-if="i.type == 'video'" class="image">
                        <img :src="i.video.photo_320" alt="">
                    </div>
                    <div v-if="i.type == 'link'" class="link">
                        <a :href="i.link.url" target="_blank">{{ i.link.url }}</a>
                    </div>
                    <div @click="hideGif" v-if="i.type == 'doc'" class="image" style="cursor: pointer;">
                        <!-- <div class="img" :style="{ backgroundImage: 'url(' + i.doc.url + ')'}" style="display:none"></div> -->
                        <!-- <div class="img" :style="{ backgroundImage: 'url(' + i.doc.preview.photo.sizes[0].src + ')' }"></div> -->
                        <img alt="" :gifUrl='i.doc.url' style="display:none" class="gifUrl">
                        <img :src="i.doc.preview.photo.sizes[0].src" alt="imgUrl" class="imgUrl">
                    </div>                       
                </div>
            </template>
            <template slot="link" slot-scope="row">
                <a :href="'https://vk.com/wall' + row.item.group_id + '_' + row.item.post_id" target="_blank">
                    <b-button size="sm" @click.stop class="mr-2">
                        Перейти
                    </b-button>
                </a>
            </template>
            <template slot="description" slot-scope="row">
                <!-- {{ row.item.description | highlight(getSearch) }} -->
                <div v-html="$options.filters.highlight(row.item.description, getSearch)"></div>
            </template>
        </b-table>
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
    props: ['data'],
    data () {
        return {
            sortBy: '',
            sortDesc: false,
            fields: [
                { key: 'description', label: 'Заголовок', sortable: false, class: 'description-col' },
                { key: 'content', label: 'Контент', sortable: false, class: 'content-col'},
                { key: 'dateFront', label: 'Дата', sortable: false },
                { key: 'likes', label: 'Лайки', sortable: true },
                { key: 'reposts', label: 'Репосты', sortable: true },
                { key: 'comments', label: 'Комм-рии', sortable: true },
                { key: 'check', label: '#', sortable: false, class: 'check-col' },
                { key: 'link', label: 'Ссылка', sortable: false, class: 'check-col' }
            ]
        }
    },
    methods: {
        ...mapActions(['loadCurrentPosts', 'hidePost']),
        ...mapMutations(['updateSort', 'updateRemoveList']),
        sortingChanged(e) {
            let sort = ''
            if (e.sortDesc) {
                sort = e.sortBy
            } else {
                sort = '-' + e.sortBy
            }
            this.updateSort(sort)
            this.loadCurrentPosts(1)
        },
        hideGif(e) {
            let arr = e.currentTarget.children
            let url = arr[0].getAttribute('gifUrl')
            arr[0].setAttribute("src", url)
            setTimeout(() => {
                arr[0].setAttribute("style", "display: inherit;")
                arr[1].setAttribute("style", "display: none;")                
            }, 300)
            this.$refs.table.refresh()
        },
        gifCleaner() {
            let gifUrl = document.querySelectorAll('.gifUrl')
            let imgUrl = document.querySelectorAll('.imgUrl')
            for (let elem of gifUrl) {
                elem.removeAttribute("src")
                elem.setAttribute("style", "display: none;")
            }
            for (let elem of imgUrl) {
                elem.setAttribute("style", "display: inherit;")
            }   
        }
    },
    computed: {
        ...mapGetters(['getSearch', 'getRemoveList'])
    },
    filters: {
        highlight(value, query) {
            let regexp = new RegExp(query, "ig")
            if (!value) return ''
            return value.replace(regexp, '<span class=\'highlight\'>' + query + '</span>')
        }
    },
    beforeUpdate() {
        for (let i of this.data) {
            let index = this.getRemoveList.indexOf(i._id)
            if (index == -1) {
                i.check = false
            } else {
                i.check = true
            }    
        }   
        this.gifCleaner() 
    }
}
</script>

<style lang="less">
    .description-col {
        position: relative;
        width: 30%;
        text-align: left;
        .highlight {
            background-color: orange;
        }
    }
    .table-wrapper {
        position: relative;
        margin-top: 108px;
    }
    .content-col {
        width: 302px;
        .content-wrapper {
            position: relative;
            .image {
                img {
                    width: 100%;
                }
                .img {
                    width: 100%;
                    height: 300px;
                    height: 250px;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
            .link {
                width: 100%;
                word-wrap: break-word;
            }
        }
    }
</style>

