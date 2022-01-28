import { createStore } from 'vuex'
import { addDays, differenceInDays } from 'date-fns'

const API_PATH =
	import.meta.env.PROD ? '/vue3-skeleton-data/' : '/data/'

const api = {
	DATA: API_PATH + 'data.json'
}

const state = {
	loadingCount: 0
}

type State = typeof state


export default createStore({
	state,
	mutations: {
		setLoading(state: State) {
			state.loadingCount++
		},
		setLoaded(state: State) {
			state.loadingCount--
		}
	},
	getters: {
		isLoading(state) {
			return state.loadingCount > 0
		}
	},
	actions: {
	}
})
