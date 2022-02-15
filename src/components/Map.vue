<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import 'leaflet/dist/leaflet.css'
import { LMap, LControl, LTileLayer } from '@vue-leaflet/vue-leaflet'
import 'vue-leaflet-covjson/dist/style.css'
import { LCovJson, LPaletteLegend, palettes } from 'vue-leaflet-covjson'
import * as CovJSON from 'covjson-reader'

const zoom = ref(6)
const mapOptions = {
	zoomAnimation: true,
}

const baseLayer = {
	name: 'OpenStreetMap',
	url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	maxZoom: 19,
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}

const map: any = ref(null)
let mapObject: any = reactive({})

const covJson: any = ref(null)

function onLoad(): void {
	mapObject = map.value.leafletObject
	CovJSON.read('/data/multipolygonseries.json').then((result: any) => {
		covJson.value = result
		console.log('covjson set')
	})
}

const palette = palettes.heatPalette
const paletteExtent = ref([0,15])
const time = ref(new Date(2021, 10, 18))

const layerOn = ref(true)

function clickFunc(e: any): void {
	console.log('Clicked!', e)
	time.value = new Date(time.value.getTime() + 1000 * 60 * 60 * 24)
    // paletteExtent.value = [0, paletteExtent.value[1] - 1]
}
</script>

<template>
	<div>
		<LMap
			ref="map"
			:zoom="zoom"
			:center="[52, -7]"
			:options="mapOptions"
			:zoomAnimation="true"
			@ready="onLoad"
		>
			<LTileLayer
				:url="baseLayer.url"
				:attribution="baseLayer.attribution"
				layer-type="base"
				:zIndex="1"
			></LTileLayer>

			<LControl position="bottomleft">
				<div class="buttons">
					<button @click="layerOn = !layerOn">
						Toggle layer {{ layerOn ? 'off' : 'on' }}
					</button>
				</div>
			</LControl>

			<LPaletteLegend position="bottomright" :paletteExtent="[-10, 100]" units="whatevers">
			</LPaletteLegend>

			<!-- <LCovJson
				v-if="layerOn"
				:covjson="covJson"
				parameter="PcpAcc_24hr_sum"
				:palette="palette"
				:paletteExtent="paletteExtent"
				:time="time"
				attribution="Me. I made this."
				pane="markerPane"
				@click="clickFunc"
			></LCovJson> -->
		</LMap>
	</div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/scssVars.scss';

#map {
	height: 100%;
	width: 100%;

	.buttons {
		display: flex;
		flex-direction: column;

		button {
			background-color: $bg;
			border-radius: 4px;
			margin-bottom: 8px;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}
</style>
