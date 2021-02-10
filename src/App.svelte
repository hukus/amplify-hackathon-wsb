<script>
	import { Circle2 } from 'svelte-loading-spinners'
	import API from '@aws-amplify/api'

	$: loading = false;
	$: posts = [];

	async function getWsbData() {
	loading = true;
    try {
      const response = await API.get('scrapi', '/wsb');
      posts = response.data;
      console.log('posts:',  {posts});
    } catch (error) {
      console.log('error getting data:', error);
    } finally {
	  loading=false;
	}
  }
</script>

<main>
	<h1>Hello Folks!</h1>
	<p>Just scrapping some meme data...</p>
	<p>(due diligence posts from wsb in last week)</p>
	
	<div class="center">
		<button on:click="{getWsbData}">What is r/WallStreetBets talking about?</button>
		
		{#if loading}
			<div class="center spinner"><Circle2 /></div>
		{:else}
			{#each posts as post}
				<p>{post.title}</p>
				<!-- <p>{post.text}</p> -->
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
		display: block;
		margin: 42px auto;
		width: 90%;
		justify-content: center;
		align-items: center;
	}

	.spinner {
		display: flex;
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