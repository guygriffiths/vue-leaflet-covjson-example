<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import Loading from 'vue3-loading-overlay'
import AppHeader from './components/AppHeader.vue'
import Map from './components/Map.vue'

const store = useStore()
const isLoading = computed(() => store.getters.isLoading)

</script>

<template>
	<loading :active="isLoading" :isFullPage="true" id="loading"></loading>
	<AppHeader id="header" />
	<Map id="map" />
</template>

<style lang="scss">
@import '@/assets/styles/main.scss';

#app {
	width: 100vw;
	height: 100vh;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 4rem 1fr;
	grid-template-areas: 'header' 'map';

	#loading {
		width: 100vw;
		height: 100vh;
		position: absolute;
		margin: auto;
	}

	#header {
		grid-area: header;
	}

	#map {
		grid-area: map;
	}
}
</style>
