export async function load() {
	const response = await fetch('https://bestdori.com/api/songs/all.7.json');

	return {
		posts: response.ok && (await response.json())
	};
}
