<script lang="ts">
	import '../css/global/index.scss';
</script>

<div class="base">
	<div class="container">
		<header class="header">
			<h1 class="heading">ガルパ レーティングツール</h1>
		</header>
		<slot />
	</div>
</div>

<style>
	.base {
		display: flex;
		justify-content: center;
		height: 100vh;
		width: 100vw;
	}

	.container {
		display: flex;
		flex-direction: column;
		width: 1080px;
		height: 100vh;
	}

	.header {
		padding: 1rem;
	}

	.heading {
		font-size: 2rem;
	}
</style>
