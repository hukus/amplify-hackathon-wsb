<script>
	import { Circle2 } from 'svelte-loading-spinners'
	import API from '@aws-amplify/api'

	$: loading = false;
	$: titles = [];

	async function getWsbData() {
	loading = true;
    try {
      const response = await API.get('scrapi', '/wsb');
      titles = response.data.titles;
      console.log('titles:', {titles});
	  loading=false;
    } catch (error) {
      console.log('error getting data:', error);
    }
  }
</script>

<main>
	<h1>Hello Folks!</h1>
	<p>Just scrapping some meme data...</p>
	
	<div class="center">
		<button on:click="{getWsbData}">What is r/WallStreetBets talking about?</button>
		{#if loading}
			<Circle2 />
		{:else}
			{#each titles as title}
				<p>{title}</p>
			{/each}
		{/if}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.center {
		display: flex;
		margin: 42px auto;
		width: 90%;
		justify-content: center;
		align-items: center;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>