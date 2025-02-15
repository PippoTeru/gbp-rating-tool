<script lang="ts">
	import '../css/global/index.scss';
</script>

<div class="base">
	<div class="container">
		<slot />
	</div>
</div>

<style>
	.base {
		display: flex;
		justify-content: center;
	}

	.container {
		display: flex;
		flex-direction: column;
		width: 1080px;
	}
</style>
