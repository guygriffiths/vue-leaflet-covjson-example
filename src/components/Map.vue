<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import 'leaflet/dist/leaflet.css'
import { LMap, LControl, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
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
CovJSON.read('/data/ben_wales2.json').then(
	(result: any) => (covJson.value = result)
)

// setTimeout(() => {
// 	CovJSON.read('/data/ben_ms.json').then(
// 		(result: any) => (covJson.value = result)
// 	)
// }, 10000)

function onLoad(): void {
	mapObject = map.value.leafletObject

	console.log('Map loaded, mapObject:', mapObject)
}

const palette = palettes.turboPalette

const time = ref(new Date(2021, 10, 18))

function clickFunc(): void {
	console.log('Clicked!')
	time.value = new Date(time.value.getTime() + 1000 * 60 * 60 * 24)
}
</script>

<template>
	<div id="map-container">
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

			<LMarker :latLng="[52,-1]" attribution="My marker"></LMarker>

			<LCovJson
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
#map-container {
	height: 100%;
	width: 100%;
}
</style>
