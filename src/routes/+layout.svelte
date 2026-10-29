<script lang="ts">
	// import DemoLinks from './demo/DemoLinks.svelte';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import Wrapper from '../components/ui/Wrapper.svelte';
	import Button from '../components/ui/Button.svelte';

	let isFullscreen = $state(false); // State untuk menyimpan status fullscreen

	function cekStatusFullscreen() {
		// Jika document.fullscreenElement tidak null, berarti sedang fullscreen
		isFullscreen = document.fullscreenElement !== null;
	}

	async function aktifkanFullscreenLandscape() {
		try {
			const element = document.documentElement;
			if (element.requestFullscreen) {
				await element.requestFullscreen();
			}
			if (screen.orientation?.lock) {
				await screen.orientation.lock('landscape');
			}
		} catch (error) {
			console.error(error);
		}
	}

	onMount(() => {
		// 1. Cek status awal saat halaman dimuat
		cekStatusFullscreen();

		// 2. Dengarkan perubahan status fullscreen (klik tombol, tekan Esc, dll)
		document.addEventListener('fullscreenchange', cekStatusFullscreen);

		// Bersihkan event listener saat komponen dihancurkan (destroy)
		return () => {
			document.removeEventListener('fullscreenchange', cekStatusFullscreen);
		};
	});

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isFullscreen}
	{@render children()}
{:else}
	<Wrapper>
		<div class="flex flex-col gap-2">
			<p>This website is not optimized for non fullscreen and non landscaped device.</p>
			<Button onclick={aktifkanFullscreenLandscape}>Full Screen</Button>
		</div>
	</Wrapper>
{/if}

<!-- <DemoLinks /> -->

<style>
	:global(html) {
		background-color: var(--background-color);
		color: var(--color-text-primary);
		font-family: 'Open Sauce Sans';
	}
</style>
