<script lang="ts">
	let { song = $bindable() } = $props();

	let great = $state('');
	let good = $state('');
	let bad = $state('');
	let miss = $state('');

	let perfect = $derived.by(() => {
		if (great != '' || good != '' || bad != '' || miss != '') {
			return song.notes - Number(great) - Number(good) - Number(bad) - Number(miss);
		} else {
			return '';
		}
	});

	let base = $derived(10000000 / song.notes);
	let achievement = $derived(
		base * Number(perfect) + base * Number(great) * 0.8 + base * Number(good) * 0.5
	);
	let rate = $derived.by(() => {
		if (achievement > 0) {
			if (achievement >= 10000000) {
				return song.level + 2;
			} else if (achievement >= 9800000) {
				return song.level + 1 + (achievement - 9800000) / 200000;
			} else {
				return song.level + (achievement - 9500000) / 300000;
			}
		} else {
			return 0;
		}
	});
</script>

<tr>
	<td>{song.title}</td>
	<td>{song.difficulty}</td>
	<td>{song.level}</td>
	<td>{(achievement / 100000).toFixed(2)}</td>
	<td class="rate">{rate.toFixed(2)}</td>
	<td>{perfect}</td>
	<td><input class="input" type="text" bind:value={great} /></td>
	<td><input class="input" type="text" bind:value={good} /></td>
	<td><input class="input" type="text" bind:value={bad} /></td>
	<td><input class="input" type="text" bind:value={miss} /></td>
</tr>

<style>
	.input {
		width: 3rem;
	}
</style>
