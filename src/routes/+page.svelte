<script lang="ts">
	import { songsInitialData, songsData } from '$lib/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let songs = $state($songsData);

	let filterKey = $state('');
	let filterValue = $state('');

	if (browser) {
		const data = localStorage.getItem('data');
		const fKey = localStorage.getItem('fKey');
		const fVal = localStorage.getItem('fVal');

		if (data != null) {
			songs = JSON.parse(data);
		}

		if (fKey != null) {
			filterKey = fKey;
		}

		if (fVal != null) {
			filterValue = fVal;
		}
	}

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
		change();
	}

	function filterData(key: string, value: string) {
		filterKey = key;
		filterValue = value;
		localStorage.setItem('fKey', key);
		localStorage.setItem('fVal', value);
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

		localStorage.setItem('data', JSON.stringify(songs));

		$songsData = songs;
		blob = new Blob([JSON.stringify($songsData, null, '　')], { type: 'application/json' });
		url = URL.createObjectURL(blob);
	}

	function enter(event: KeyboardEvent, index: number) {
		let elements = document.querySelectorAll('input');
		if (event.key === 'Enter' || event.key === 'ArrowDown') {
			elements[index + 4 + 11].focus();
		} else if (event.key === 'ArrowUp') {
			elements[index - 4 + 11].focus();
		} else if (event.key === 'ArrowRight') {
			elements[index + 1 + 11].focus();
		} else if (event.key === 'ArrowLeft') {
			elements[index - 1 + 11].focus();
		}
	}

	function focused(index: number) {
		let elements = document.querySelectorAll('input');
		elements[index + 11].select();
	}

	function resetData() {
		songs = $songsInitialData;
		localStorage.setItem('data', JSON.stringify(songs));
		rate = 0;
	}

	let blob = new Blob([JSON.stringify($songsData, null, '　')], { type: 'application/json' });
	let url = $state(URL.createObjectURL(blob));

	onMount(() => {
		change();
		localStorage.setItem('data', JSON.stringify(songs));
	});
</script>

<div class="rateDisplay">
	<p>あなたの現在のレートは {rate.toFixed(2)} です。</p>
	<a href={url}>JSONダウンロード</a>
</div>
<div class="options">
	<div class="flexContainer">
		<div class="filter">
			<h2 class="optionTitle">
				<span class="optionStar">★</span><span class="optionText">絞り込み</span>
			</h2>
			<h3 class="filterTitle">難易度</h3>
			<div class="filterButtons">
				<label><input type="radio" name="radio" onclick={() => filterData('', '')} />すべて</label>
				<label>
					<input type="radio" name="radio" onclick={() => filterData('difficulty', '0')} />EASY
				</label>
				<label>
					<input type="radio" name="radio" onclick={() => filterData('difficulty', '1')} />NORMAL
				</label>
				<label>
					<input type="radio" name="radio" onclick={() => filterData('difficulty', '2')} />HARD
				</label>
				<label>
					<input type="radio" name="radio" onclick={() => filterData('difficulty', '3')} />EXPERT
				</label>
				<label>
					<input type="radio" name="radio" onclick={() => filterData('difficulty', '4')} />SPECIAL
				</label>
			</div>
		</div>
		<div class="sort">
			<h2 class="optionTitle">
				<span class="optionStar">★</span><span class="optionText">ソート順</span>
			</h2>
			<div class="filterButtons">
				<label><input type="radio" name="sort" onclick={() => sortedData('id')} />デフォルト</label>
				<label><input type="radio" name="sort" onclick={() => sortedData('title')} />楽曲名順</label
				>
				<label
					><input
						type="radio"
						name="sort"
						onclick={() => sortedData('difficulty')}
					/>難易度順</label
				>
				<label
					><input type="radio" name="sort" onclick={() => sortedData('level')} />楽曲レベル順</label
				>
				<label
					><input
						type="radio"
						name="sort"
						onclick={() => sortedData('constant')}
					/>譜面定数順</label
				>
			</div>
			<button class="changeSort" onclick={() => sortMode()}>
				{#if sortFlag == 0}
					降順
				{:else if sortFlag == 1}
					昇順
				{/if}
			</button>
		</div>
	</div>
	<div>
		<p></p>
		<button onclick={() => resetData()}>データリセット</button>
		<p></p>
	</div>
</div>
<div class="tableContainer">
	<table border="1">
		<thead>
			<tr>
				<!-- <th class="id">ID</th> -->
				<th class="title">楽曲名</th>
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
						<!-- <td>{item.id}</td> -->
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
						<!-- <td>{item.id}</td> -->
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
</div>

<style>
	.rateDisplay {
		padding: 1rem;
	}

	.options {
		padding: 1rem;
	}

	.optionTitle {
		font-weight: 600;
	}

	.optionStar {
		margin: 0 0.75rem 0 0.5rem;
		font-size: 1.75rem;
		font-family: 'Mairyo';
		color: #ff3b72;
		-webkit-text-stroke: 2px #fff;
	}

	.optionText {
		position: relative;
		top: -0.1rem;
		font-size: 1.1rem;
		color: #fff;
		text-shadow:
			1px 1px 0px #ff3b72,
			-1px 1px 0px #ff3b72,
			1px -1px 0px #ff3b72,
			-1px -1px 0px #ff3b72,
			1px 0px 0px #ff3b72,
			0px 1px 0px #ff3b72,
			-1px 0px 0px #ff3b72,
			0px -1px 0px #ff3b72;
	}

	.optionTitle::after {
		content: '';
		position: relative;
		z-index: -1;
		top: -1.25rem;
		display: block;
		width: 100%;
		height: 1.25rem;
		border-radius: 0.5rem;
		background-color: #ff3b72;
	}

	.flexContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.filter {
		width: 50%;
		min-width: 420px;
		padding: 1rem;
	}

	.filterTitle {
		font-weight: 600;
		display: inline-block;
		padding: 0.15rem 1rem;
		background-color: rgb(80, 80, 80);
		color: #fff;
		border-radius: 1.3rem;
		margin-bottom: 1rem;
	}

	.filterButtons {
		display: flex;
		flex-wrap: wrap;
	}

	.filterButtons label {
		width: 33%;
		text-align: start;
		font-size: 1.1rem;
		line-height: 2;
	}

	.sort {
		width: 50%;
		min-width: 420px;
		padding: 1rem;
	}

	.changeSort {
		margin-top: 1rem;
		font-size: 1.1rem;
	}

	.tableContainer {
		width: 100%;
		overflow: scroll;
	}

	table {
		margin: 0 auto;
		border-collapse: collapse;
		width: 100%;
		max-width: 100vw;
		min-width: calc(1080px - 2rem - 1px);
	}

	th {
		font-size: 0.8rem;
		border: solid 1px;
		padding: 0.25rem;
	}

	td {
		font-size: 0.9rem;
		border: solid 1px;
		padding: 0.25rem;
	}

	/* .id {
		width: 2rem;
	}

	.title {
		width: 20rem;
	} */

	.num {
		width: 4rem;
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
