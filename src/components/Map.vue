<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import 'leaflet/dist/leaflet.css'
import { LMap, LControl, LTileLayer } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import LCovJson from './LCovJson.vue'
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

setTimeout(() => {
	CovJSON.read('/data/ben_ms.json').then(
		(result: any) => (covJson.value = result)
	)
}, 10000)

function onLoad(): void {
	mapObject = map.value.leafletObject

	console.log('Map loaded, mapObject:', mapObject)
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

			<LCovJson
				:cov-json="covJson"
				parameter="PcpAcc_24hr_sum"
				:paletteExtent="[5, 6]"
				:time="new Date(2021, 11, 1)"
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
