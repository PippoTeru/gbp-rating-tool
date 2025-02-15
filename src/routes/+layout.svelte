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
		background-image: url('/live.png');
		background-attachment: fixed;
		background-size: cover;
		background-position: center;
	}

	.container {
		display: flex;
		flex-direction: column;
		width: 1080px;
	}
</style>
