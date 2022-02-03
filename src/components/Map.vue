<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import 'leaflet/dist/leaflet.css'
import { LMap, LControl, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { LCovJson, palettes } from 'vue-leaflet-covjson'
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

const store = useStore()

const map: any = ref(null)
let mapObject: any = reactive({})

const covJson: any = ref(null)

function selectPointSeries() {
	CovJSON.read('/data/pointseries.json').then(
		(result: any) => (covJson.value = result)
	)
}

function selectPolySeries() {
	CovJSON.read('/data/polygonseries.json').then(
		(result: any) => (covJson.value = result)
	)
}

function selectMultiPolySeries() {
	CovJSON.read('/data/multipolygonseries.json').then(
		(result: any) => (covJson.value = result)
	)
}

function empty() {
	covJson.value = null
}

// setTimeout(() => {
// 	CovJSON.read('/data/ben_ms.json').then(
// 		(result: any) => (covJson.value = result)
// 	)
// }, 10000)

function onLoad(): void {
	mapObject = map.value.leafletObject
	selectMultiPolySeries()
	console.log('Map loaded, mapObject:', mapObject)
}

const palette = palettes.turboPalette

const time = ref(new Date(2021, 10, 18))

const layerOn = ref(true)

function clickFunc(e: any): void {
	console.log('Clicked!', e)
	time.value = new Date(time.value.getTime() + 1000 * 60 * 60 * 24)
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
					<button @click="selectPointSeries">PointSeries</button>
					<button @click="selectPolySeries">PolygonSeries</button>
					<button @click="selectMultiPolySeries">MultiPolygonSeries</button>
					<button @click="empty">Empty</button>
				</div>
			</LControl>

			<!-- <LGeoJson v-if="layerOn" :geojson="geoJson"></LGeoJson> -->

			<LCovJson
				v-if="layerOn"
				:cov-json="covJson"
				parameter="PcpAcc_24hr_sum"
				:paletteExtent="[0, 17]"
				:palette="palette"
				:time="time"
				attribution="Me. I made this."
				pane="markerPane"
				@click="clickFunc"
			></LCovJson>
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
