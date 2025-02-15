<script lang="ts">
	import { songsInitialData, songsData } from '$lib/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let songs = $state($songsData);

	let sortFlag = $state(0);
	let sortKey = $state('id');

	let filterKey = $state('');
	let filterValue = $state('');

	if (browser) {
		const data = localStorage.getItem('data');
		const sFlg = localStorage.getItem('sFlg');
		const sKey = localStorage.getItem('sKey');
		const fKey = localStorage.getItem('fKey');
		const fVal = localStorage.getItem('fVal');

		if (data != null) {
			songs = JSON.parse(data);
		}

		if (sFlg != null) {
			sortFlag = Number(sFlg);
		}

		if (sKey != null) {
			sortKey = sKey;
		}

		if (fKey != null) {
			filterKey = fKey;
		}

		if (fVal != null) {
			filterValue = fVal;
		}
	}

	let sortVisible = $state(0);

	function sortVision() {
		if (sortVisible == 0) {
			sortVisible = 11;
		} else {
			sortVisible = 0;
		}
	}

	function sortMode() {
		if (sortFlag == 0) {
			sortFlag = 1;
		} else {
			sortFlag = 0;
		}
		localStorage.setItem('sFlg', String(sortFlag));
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
		localStorage.setItem('sKey', sortKey);
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

	function getColorClass() {
		if (rate >= 31) {
			return 'c_gold';
		} else if (rate >= 30.5) {
			return 'c_silver';
		} else if (rate >= 30) {
			return 'c_copper';
		} else if (rate >= 28) {
			return 'c_special';
		} else if (rate >= 25) {
			return 'c_expert';
		} else if (rate >= 20) {
			return 'c_hard';
		} else if (rate >= 15) {
			return 'c_normal';
		} else if (rate >= 10) {
			return 'c_easy';
		} else {
			return 'c_none';
		}
	}

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

	// function activeInput() {
	// 	return 'numInput';
	// }

	// function enter(event: KeyboardEvent, index: number) {
	// 	let elements = document.querySelectorAll('.numInput');
	// 	console.log(elements, index);
	// 	if (event.key === 'Enter' || event.key === 'ArrowDown') {
	// 		elements[index + 4].focus();
	// 	} else if (event.key === 'ArrowUp') {
	// 		elements[index - 4].focus();
	// 	} else if (event.key === 'ArrowRight') {
	// 		elements[index + 1].focus();
	// 	} else if (event.key === 'ArrowLeft') {
	// 		elements[index - 1].focus();
	// 	}
	// }

	// function focused(index: number) {
	// 	let elements = document.querySelectorAll('.numInput');
	// 	elements[index].select();
	// }

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

<div class="top">
	<header class="header">
		<h1 class="heading">ガルパ レーティングツール</h1>
	</header>
	<div class="rateDisplay">
		<p class="rateText">
			あなたのレートは <span class="{getColorClass()} rateNumber">{rate.toFixed(2)}</span> です。
		</p>
		<!-- <a href={url}>JSONダウンロード</a> -->
		{#if sortVisible == 0}
			<button class="changeSort" onclick={() => sortVision()}>絞り込み</button>
		{/if}
		<button class="changeSort floatRight" onclick={() => resetData()}>データリセット</button>
	</div>
	{#if sortVisible == 11}
		<div class="options">
			<div class="flexContainer">
				<div class="filter">
					<h2 class="optionTitle">
						<span class="optionStar">★</span><span class="optionText">絞り込み</span>
					</h2>
					<h3 class="filterTitle">難易度</h3>
					<div class="filterButtons">
						<label
							><input
								checked={filterKey == '' && filterValue == ''}
								type="radio"
								name="radio"
								onclick={() => filterData('', '')}
							/>すべて</label
						>
						<label>
							<input
								checked={filterKey == 'difficulty' && filterValue == '0'}
								type="radio"
								name="radio"
								onclick={() => filterData('difficulty', '0')}
							/>EASY
						</label>
						<label>
							<input
								checked={filterKey == 'difficulty' && filterValue == '1'}
								type="radio"
								name="radio"
								onclick={() => filterData('difficulty', '1')}
							/>NORMAL
						</label>
						<label>
							<input
								checked={filterKey == 'difficulty' && filterValue == '2'}
								type="radio"
								name="radio"
								onclick={() => filterData('difficulty', '2')}
							/>HARD
						</label>
						<label>
							<input
								checked={filterKey == 'difficulty' && filterValue == '3'}
								type="radio"
								name="radio"
								onclick={() => filterData('difficulty', '3')}
							/>EXPERT
						</label>
						<label>
							<input
								checked={filterKey == 'difficulty' && filterValue == '4'}
								type="radio"
								name="radio"
								onclick={() => filterData('difficulty', '4')}
							/>SPECIAL
						</label>
					</div>
				</div>
				<div class="sort">
					<h2 class="optionTitle">
						<span class="optionStar">★</span><span class="optionText">ソート順</span>
					</h2>
					<div class="filterButtons">
						<label
							><input
								checked={sortKey == 'id'}
								type="radio"
								name="sort"
								onclick={() => sortedData('id')}
							/>デフォルト</label
						>
						<label
							><input
								checked={sortKey == 'title'}
								type="radio"
								name="sort"
								onclick={() => sortedData('title')}
							/>楽曲名順</label
						>
						<label
							><input
								checked={sortKey == 'difficulty'}
								type="radio"
								name="sort"
								onclick={() => sortedData('difficulty')}
							/>難易度順</label
						>
						<label
							><input
								checked={sortKey == 'level'}
								type="radio"
								name="sort"
								onclick={() => sortedData('level')}
							/>楽曲レベル順</label
						>
						<label
							><input
								checked={sortKey == 'constant'}
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
			<div class="closeContainer">
				<button class="changeSort" onclick={() => sortVision()}>閉じる</button>
			</div>
		</div>
	{/if}
</div>
<div class="tableBase">
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
							<!-- <input
									onkeydown={(event) => enter(event, index * 4)}
									onfocus={() => focused(index * 4)}
									class={activeInput()}
									type="text"
									bind:value={item.great}
								/>
							</td>
							<td>
								<input
									onkeydown={(event) => enter(event, index * 4 + 1)}
									onfocus={() => focused(index * 4 + 1)}
									class={activeInput()}
									type="text"
									bind:value={item.good}
								/>
							</td>
							<td>
								<input
									onkeydown={(event) => enter(event, index * 4 + 2)}
									onfocus={() => focused(index * 4 + 2)}
									class={activeInput()}
									type="text"
									bind:value={item.bad}
								/>
							</td>
							<td>
								<input
									onkeydown={(event) => enter(event, index * 4 + 3)}
									onfocus={() => focused(index * 4 + 3)}
									class={activeInput()}
									type="text"
									bind:value={item.miss}
								/>
							</td> -->
							<td><input class="numInput" type="text" bind:value={item.great} /></td>
							<td><input class="numInput" type="text" bind:value={item.good} /></td>
							<td><input class="numInput" type="text" bind:value={item.bad} /></td>
							<td><input class="numInput" type="text" bind:value={item.miss} /></td>
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
							<!-- <td>
								<input
									onkeydown={(event) => enter(event, index * 4)}
									onfocus={() => focused(index * 4)}
									class={activeInput()}
									type="text"
									bind:value={item.great}
								/>
							</td>
							<td>
								<input
									onkeydown={(event) => enter(event, index * 4 + 1)}
									onfocus={() => focused(index * 4 + 1)}
									class={activeInput()}
									type="text"
									bind:value={item.good}
								/>
							</td>
							<td>
								<input
									onkeydown={(event) => enter(event, index * 4 + 2)}
									onfocus={() => focused(index * 4 + 2)}
									class={activeInput()}
									type="text"
									bind:value={item.bad}
								/>
							</td>
							<td>
								<input
									onkeydown={(event) => enter(event, index * 4 + 3)}
									onfocus={() => focused(index * 4 + 3)}
									class={activeInput()}
									type="text"
									bind:value={item.miss}
								/>
							</td> -->
							<td><input class="numInput" type="text" bind:value={item.great} /></td>
							<td><input class="numInput" type="text" bind:value={item.good} /></td>
							<td><input class="numInput" type="text" bind:value={item.bad} /></td>
							<td><input class="numInput" type="text" bind:value={item.miss} /></td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.header {
		padding: 1rem;
	}

	.heading {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.rateDisplay {
		padding: 1rem;
	}

	.rateText {
		font-size: 1.25rem;
	}

	.rateNumber {
		font-size: 1.5rem;
		font-weight: bolder;
		padding: 0 1rem;
		color: #fff;
		font-family: sans-serif;
		border-radius: 5px;
	}

	.c_gold {
		background-image: linear-gradient(
			157deg,
			rgba(255, 241, 215, 1) 10%,
			rgba(255, 220, 101, 1) 40%,
			rgba(218, 165, 51, 1) 68%,
			rgba(166, 103, 11, 1) 90%
		);
		text-shadow:
			1px 1px 0px #000,
			-1px 1px 0px #000,
			1px -1px 0px #000,
			-1px -1px 0px #000,
			1px 0px 0px #000,
			0px 1px 0px #000,
			-1px 0px 0px #000,
			0px -1px 0px #000;
	}

	.c_silver {
		background-color: #808080;
	}

	.c_copper {
		background-color: #b87333;
	}

	.c_special {
		background-color: #ee2299;
	}

	.c_expert {
		background-color: #ff3333;
	}

	.c_hard {
		background-color: #ffcc33;
	}

	.c_normal {
		background-color: #66ff33;
	}

	.c_easy {
		background-color: #3366ff;
	}

	.c_none {
		background-color: #eee;
		color: #000;
	}

	.floatRight {
		float: right;
	}

	.options {
		padding: 1rem;
		clear: both;
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
		font-size: 1.15rem;
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
		min-width: 360px;
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
		font-size: 0.9rem;
		line-height: 2;
	}

	.sort {
		width: 50%;
		min-width: 360px;
		padding: 1rem;
	}

	.changeSort {
		margin-top: 1rem;
		font-size: 0.95rem;
		padding: 0 1rem;
		line-height: 2.5;
		background-color: #fafafa;
		border: 2px solid #ddd;
		border-radius: 10px;
	}

	.closeContainer {
		display: flex;
		justify-content: center;
	}

	.tableBase {
		padding: 0 1rem;
	}

	.tableContainer {
		margin-top: 1rem;
		width: 100%;
		overflow-x: scroll;
	}

	table {
		margin: 0 auto;
		border-collapse: collapse;
	}

	thead {
		background-color: #ddd;
	}

	th {
		font-size: 0.8rem;
		font-weight: normal;
		border: solid 1px;
		padding: 0.25rem;
		text-align: center;
		vertical-align: middle;
	}

	td {
		font-size: 0.9rem;
		border: solid 1px;
		padding: 0.25rem;
		vertical-align: middle;
	}

	.title {
		width: 30vw;
		max-width: 20rem;
	}

	.num {
		width: 7vw;
	}

	.numInput {
		width: 100%;
		min-width: 3rem;
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
