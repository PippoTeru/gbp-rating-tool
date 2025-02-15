<script lang="ts">
	import { songsInitialData, songsData } from '$lib/store';
	import { onMount } from 'svelte';

	let songs = $state($songsData);

	let sortFlag = $state(0);
	let sortKey = 'id';

	function sortMode() {
		if (sortFlag == 0) {
			sortFlag = 1;
		} else {
			sortFlag = 0;
		}
		sortedData(sortKey);
	}

	function sortedData(key: string) {
		if (key != '') {
			sortKey = key;
		}
		$songsData = [...songs];
		if (key == 'title') {
			if (sortFlag == 0) {
				songs.sort((a, b) => (a[key] < b[key] ? -1 : 1));
			} else {
				songs.sort((a, b) => (a[key] > b[key] ? -1 : 1));
			}
		} else {
			if (sortFlag == 0) {
				songs.sort((a, b) => (Number(a[key]) < Number(b[key]) ? -1 : 1));
			} else {
				songs.sort((a, b) => (Number(a[key]) > Number(b[key]) ? -1 : 1));
			}
		}
	}

	let filterKey = $state('');
	let filterValue = $state('');

	function filterData(key: string, value: string) {
		filterKey = key;
		filterValue = value;
	}

	function getDifficulty(item: any) {
		if (item.difficulty == '0') {
			return 'EASY';
		} else if (item.difficulty == '1') {
			return 'NORMAL';
		} else if (item.difficulty == '2') {
			return 'HARD';
		} else if (item.difficulty == '3') {
			return 'EXPERT';
		} else {
			return 'SPECIAL';
		}
	}

	function getPerfect(item: any) {
		if (item.great != '' || item.good != '' || item.bad != '' || item.miss != '') {
			let perfect = item.notes - item.great - item.good - item.bad - item.miss;
			return perfect;
		} else {
			return '';
		}
	}

	function getAchievement(item: any) {
		let base = 10000000 / item.notes;
		let perfect = Number(getPerfect(item));
		let achievement = base * perfect + base * item.great * 0.8 + base * item.good * 0.5;
		return achievement;
	}

	function getRate(item: any) {
		if (getAchievement(item) > 0) {
			if (getAchievement(item) >= 10000000) {
				return Number(getConstant(item)) + 2;
			} else if (getAchievement(item) >= 9800000) {
				return Number(getConstant(item)) + 1 + (getAchievement(item) - 9800000) / 200000;
			} else {
				return Number(getConstant(item)) + (getAchievement(item) - 9500000) / 300000;
			}
		} else {
			return 0;
		}
	}

	function getConstant(item: any) {
		if (item.constant == '') {
			return item.level;
		}
		return item.constant;
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
		rate = Math.floor((sum / 30) * 100) / 100;

		$songsData = songs;
		blob = new Blob([JSON.stringify($songsData, null, '　')], { type: 'application/json' });
		url = URL.createObjectURL(blob);
	}

	function enter(event: KeyboardEvent, index: number) {
		let elements = document.querySelectorAll('input');
		if (event.key === 'Enter' || event.key === 'ArrowDown') {
			elements[index + 4].focus();
		} else if (event.key === 'ArrowUp') {
			elements[index - 4].focus();
		} else if (event.key === 'ArrowRight') {
			elements[index + 1].focus();
		} else if (event.key === 'ArrowLeft') {
			elements[index - 1].focus();
		}
	}

	function focused(index: number) {
		let elements = document.querySelectorAll('input');
		elements[index].select();
	}

	let blob = new Blob([JSON.stringify($songsData, null, '　')], { type: 'application/json' });
	let url = $state(URL.createObjectURL(blob));

	onMount(() => {
		change();
	});
</script>

<h1>ガルパ レーティングツール</h1>
<h2>あなたの現在のレートは {rate.toFixed(2)} です。</h2>
<a href={url}>JSONダウンロード</a>
<div>
	<p>絞り込み</p>
	<button onclick={() => filterData('', '')}>すべて</button>
	<button onclick={() => filterData('difficulty', '0')}>EASY</button>
	<button onclick={() => filterData('difficulty', '1')}>NORMAL</button>
	<button onclick={() => filterData('difficulty', '2')}>HARD</button>
	<button onclick={() => filterData('difficulty', '3')}>EXPERT</button>
	<button onclick={() => filterData('difficulty', '4')}>SPECIAL</button>
</div>
<div>
	<p>ソート順</p>
	<div>
		<button onclick={() => sortMode()}>
			{#if sortFlag == 0}
				降順
			{:else if sortFlag == 1}
				昇順
			{/if}
		</button>
	</div>
	<button onclick={() => sortedData('id')}>デフォルト</button>
	<button onclick={() => sortedData('title')}>楽曲名順</button>
	<button onclick={() => sortedData('difficulty')}>難易度順</button>
	<button onclick={() => sortedData('level')}>楽曲レベル順</button>
	<button onclick={() => sortedData('constant')}>譜面定数順</button>
</div>

<table border="1">
	<thead>
		<tr>
			<th>ID</th>
			<th>楽曲名</th>
			<th class="num">難易度</th>
			<th class="num">レベル</th>
			<th class="num">譜面定数</th>
			<th class="num">達成率</th>
			<th class="num">レート</th>
			<th class="num">PERFECT</th>
			<th class="num">GREAT</th>
			<th class="num">GOOD</th>
			<th class="num">BAD</th>
			<th class="num">MISS</th>
		</tr>
	</thead>
	<tbody onchange={change}>
		{#each songs as item, index}
			{#if filterKey == '' && filterValue == ''}
				<tr class={getDifficulty(item)}>
					<td>{item.id}</td>
					<td>{item.title}</td>
					<td>{getDifficulty(item)}</td>
					<td>{item.level}</td>
					<td>{getConstant(item).toFixed(1)}</td>
					<td>{(getAchievement(item) / 100000).toFixed(2)}</td>
					<td class="rate">{getRate(item).toFixed(2)}</td>
					<td>{getPerfect(item)}</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4)}
							onfocus={() => focused(index * 4)}
							class="num"
							type="text"
							bind:value={item.great}
						/>
					</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4 + 1)}
							onfocus={() => focused(index * 4 + 1)}
							class="num"
							type="text"
							bind:value={item.good}
						/>
					</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4 + 2)}
							onfocus={() => focused(index * 4 + 2)}
							class="num"
							type="text"
							bind:value={item.bad}
						/>
					</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4 + 3)}
							onfocus={() => focused(index * 4 + 3)}
							class="num"
							type="text"
							bind:value={item.miss}
						/>
					</td>
				</tr>
			{:else if item[filterKey] === filterValue}
				<tr class={getDifficulty(item)}>
					<td>{item.id}</td>
					<td>{item.title}</td>
					<td>{getDifficulty(item)}</td>
					<td>{item.level}</td>
					<td>{getConstant(item).toFixed(1)}</td>
					<td>{(getAchievement(item) / 100000).toFixed(2)}</td>
					<td class="rate">{getRate(item).toFixed(2)}</td>
					<td>{getPerfect(item)}</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4)}
							onfocus={() => focused(index * 4)}
							class="num"
							type="text"
							bind:value={item.great}
						/>
					</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4 + 1)}
							onfocus={() => focused(index * 4 + 1)}
							class="num"
							type="text"
							bind:value={item.good}
						/>
					</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4 + 2)}
							onfocus={() => focused(index * 4 + 2)}
							class="num"
							type="text"
							bind:value={item.bad}
						/>
					</td>
					<td>
						<input
							onkeydown={(event) => enter(event, index * 4 + 3)}
							onfocus={() => focused(index * 4 + 3)}
							class="num"
							type="text"
							bind:value={item.miss}
						/>
					</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>

<style>
	.num {
		width: 4rem;
	}

	th {
		font-size: 0.8rem;
	}

	td {
		font-size: 0.9rem;
	}

	.EASY {
		background-color: #bbbbff;
	}

	.NORMAL {
		background-color: #aaffbb;
	}

	.HARD {
		background-color: #ffffbb;
	}

	.EXPERT {
		background-color: #ffbbbb;
	}

	.SPECIAL {
		background-color: #ffbbff;
	}
</style>
