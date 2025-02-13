<script lang="ts">
	import Calc from '$lib/components/Calc.svelte';
	import { onMount } from 'svelte';
	import data from '$lib/assets/songs.json';

	let songs = [];
	for (let item in data) {
		let song = data[item];

		// let id = song['']
		let title = song['musicTitle'][0];
		if (title == null) {
			continue;
		} else if (title.startsWith('[超高難易度')) {
			continue;
		}
		let level = song['difficulty'][3]['playLevel'];
		let notes = Number(song['notes'][3]);

		songs.push({
			// id: id,
			title: title,
			difficulty: 'EXPERT',
			level: level,
			notes: notes
		});

		if (Object.keys(song['difficulty']).length == 5) {
			let level = song['difficulty'][4]['playLevel'];
			let notes = Number(song['notes'][4]);
			songs.push({
				title: title,
				difficulty: 'SPECIAL',
				level: level,
				notes: notes
			});
		}
		songs.sort((a, b) => (a.level > b.level ? -1 : 1));
	}

	let rate = $state(0);

	function change() {
		let elements = document.getElementsByClassName('rate');
		let list = [];
		for (let element of elements) {
			list.push(Number(element.innerHTML));
		}
		list.sort((a, b) => (a > b ? -1 : 1));
		list = list.slice(0, 30);
		let sum = 0;
		list.forEach((score) => {
			sum += score;
		});
		rate = sum / 30;
	}

	onMount(() => {
		change();
	});
</script>

<p>{rate.toFixed(2)}</p>
<table border="1">
	<thead>
		<tr>
			<th>楽曲名</th>
			<th>難易度</th>
			<th>レベル</th>
			<th>達成率</th>
			<th>レート</th>
			<th>PERFECT</th>
			<th>GREAT</th>
			<th>GOOD</th>
			<th>BAD</th>
			<th>MISS</th>
		</tr>
	</thead>
	<tbody onchange={change}>
		{#each songs as item}
			<Calc song={item} />
		{/each}
	</tbody>
</table>
