/* eslint-disable prefer-const */
import { readable, writable } from 'svelte/store';
import data from '$lib/assets/songs.json';

let temp = [];
for (const item in data) {
	let song = data[item];

	if (song.musicTitle[0] == null) {
		continue;
	} else if (song.musicTitle[0].startsWith('[超高難易度')) {
		continue;
	}

	for (const difficulty in song.difficulty) {
		temp.push({
			id: item,
			title: song.musicTitle[0],
			tag: song.tag,
			band: song.bandId,
			image: song.jacketImage[0],
			difficulty: difficulty,
			level: song.difficulty[difficulty].playLevel,
			notes: song.notes[difficulty],
			achievement: '',
			rate: '',
			perfect: '',
			great: '',
			good: '',
			bad: '',
			miss: ''
		});
	}
}

export const songsInitialData = readable(temp);
export const songsData = writable(temp);
