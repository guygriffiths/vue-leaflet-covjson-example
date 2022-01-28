<script>
import { onMounted, ref, inject, nextTick, watch } from 'vue'
import {
	remapEvents,
	WINDOW_OR_GLOBAL,
	GLOBAL_LEAFLET_OPT,
} from '@vue-leaflet/vue-leaflet/src/utils.js'
import { render } from '@vue-leaflet/vue-leaflet/src/functions/layer'

import * as C from 'leaflet-coverage'
import { turboPalette } from '../lib/palettes'

const props = {
	covJson: {
		default: null,
		required: true,
	},
	parameter: {
		type: String,
		required: true
	},
	paletteExtent: {
		type: Array,
		required: true
	},
	palette: {
		type: Object,
		default: turboPalette
	},
	saturateMin: {
		type: Boolean,
		default: true
	},
	saturateMax: {
		type: Boolean,
		default: true
	},
	time: {
		type: Date,
		required: false
	}
}

/**
 * CoverageJSON component, allows you to add CoverageJSON layers to a Leaflet map
 */
export default {
	name: 'LCovJson',
	props,
	setup(props, context) {
		const leafletRef = ref({})
		const ready = ref(false)
		const useGlobalLeaflet = inject(GLOBAL_LEAFLET_OPT)
		const addLayer = inject('addLayer')
		const removeLayer = inject('removeLayer')
		
		const loadCovJsonLayer = () => {
			ready.value = false
			// If we have a layer already, remove it.
			if (Object.keys(leafletRef.value).length > 0) {
				removeLayer({ leafletObject: leafletRef.value })
			}
			if (props.covJson === null) {
				// If we don't have any coverage JSON, we can't plot it
				ready.value = true
				return
			}
			leafletRef.value = C.dataLayer(props.covJson, {
				parameter: props.parameter,
				paletteExtent: props.paletteExtent,
				palette: turboPalette,
				extendMax: props.saturateMax,
				extendMin: props.saturateMin,
				time: props.time,
			})

			const listeners = remapEvents(context.attrs)
			DomEventFunc.on(leafletRef.value, listeners)

			// TODO Need to bind click events etc.  Perhaps this is related?
			// propsBinder(methods, leafletRef.value, props)

			addLayer({
				// Need to add layer-specific props here, things like "pane", "opacity", and whatever
				// ...props,
				// Not sure what this is going to require yet.
				// ...methods,
				leafletObject: leafletRef.value,
			})
			ready.value = true
		}

		let DomEventFunc = null
		onMounted(async () => {
			const { DomEvent } = useGlobalLeaflet
				? WINDOW_OR_GLOBAL.L
				: await import('leaflet/dist/leaflet-src.esm')
			DomEventFunc = DomEvent

			loadCovJsonLayer()
			watch(() => props.covJson, loadCovJsonLayer)

			ready.value = true
			// TODO Not sure if this needs to go in the loadCovJson method.
			nextTick(() => context.emit('ready', leafletRef.value))
		})
		return { ready, leafletObject: leafletRef }
	},

	render() {
		return render(this.ready, this.$slots)
	},
}
</script>
