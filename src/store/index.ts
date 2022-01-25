import { createStore } from 'vuex'
import { addDays, differenceInDays } from 'date-fns'

const API_PATH =
	import.meta.env.PROD ? '/data/' : '/data/'

const api = {
	CLIMATOLOGY: API_PATH + 'climatology.json',
	RIVER_LEVEL: API_PATH + 'water_levels.json',
	FORECAST_DATA: API_PATH + 'forecasts.json',
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
