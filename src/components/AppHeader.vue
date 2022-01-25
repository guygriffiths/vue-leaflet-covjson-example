<script setup lang="ts">
// import { withDefaults } from 'vue'
// interface Props {
// 	propName: string
// }

// const props = withDefaults(defineProps<Props>(), {
// 	propName: 'default value',
// })
</script>

<template>
	<header>
		<div id="header-title">Vue3 Skeleton</div>
	</header>
</template>

<style scoped lang="scss">
@import '@/assets/styles/scssVars.scss';

header {
	width: 100%;
}

#header-title {
	font-size: 1.25rem;
}
</style>
