<script lang="ts">
	import { isYesterday } from '#lib/utils.js';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let activeDay = $derived(data.ball.count);
	let now = new Date();

	let claimed = $derived(!isYesterday(data.ball.updatedAt, now));

	let character_list = [
		{
			image: 'miyabi.png',
			name: 'HOSHIMI MIYABI',
			description: `Agent in Zenless Zone Zero, and the Chief of Hollow Special Operations Section 6. She has been awarded the title of "Void Hunter: Isshin Muga" and is the youngest person in New Eridu to bear such a title.`
		},
		{
			image: 'ramielle.png',
			name: 'RAMIELLE DAN',
			description: `playable Agent in Zenless Zone Zero, and a member of the Covenant of Dayat. She is also the Lieutenant Colonel of the Guard of Staves, and was one of the first seven people to be awarded the title of "Void Hunter" with her title being "Void Hunter: Temporal Lumiflux."`
		},
		{
			image: 'velina.jpg',
			name: 'VELINA AIRGRID',
			description: `Veline is a playable Agent in Zenless Zone Zero, and the Administrative Director of the External Strategy Department.`
		},
		{
			image: 'phaethon.png',
			name: 'PHAETHON',
			description: `Phaethon is a faction in Zenless Zone Zero. Phaethon is the alias of a legendary Proxy in New Eridu, who in actuality is a team comprising Wise and Belle. The siblings are commonly referred to as "Proxy" or "Manager" by people they know, the latter referring to their public business as the managers of Random Play.`
		}
	];

	function getCharacter(day: number) {
		const select = day % character_list.length;

		return character_list[select];
	}

	$effect(() => {
		document.getElementById(`element-${activeDay}`)?.scrollIntoView({ behavior: 'smooth' });
	});
</script>

{#snippet line()}
	<div class="hidden h-0.5 w-full bg-black lg:block"></div>
{/snippet}

{#snippet sidebar()}
	<div
		class="z-100 flex h-full w-40 max-w-40 cursor-default flex-col gap-2 overflow-hidden bg-white p-4 shadow-2xl shadow-black lg:w-60 lg:max-w-60 lg:gap-6 lg:p-6"
	>
		<div class="flex flex-col gap-1 lg:gap-2">
			<h1 class="text-center text-lg leading-4 font-medium text-balance lg:text-3xl lg:leading-7.5">
				another backday
			</h1>
			<p class="text-center text-[8px] font-medium lg:text-xs">theres another chocolate</p>
		</div>

		<p
			class="mt-1 bg-black p-4 pb-10 text-[10px] text-pretty text-white [clip-path:polygon(0_0,100%_0,100%_100%,40px_100%,0_calc(100%-40px))] lg:mt-10 lg:pb-20 lg:text-base"
		>
			"Life is like riding a bicycle. To keep your balance you must keep moving." — Albert Einstein
		</p>

		{@render line()}

		<div class="hidden lg:block">
			<p class="text-[10px] font-bold">ANOTHER BACKDAY</p>
			<p class="text-xl leading-5">
				<span class="font-bold">HELLO</span>
				{data.user.name.toUpperCase()}
			</p>
		</div>

		{@render line()}

		<div class="hidden lg:block">
			<p class="text-[10px] font-bold">ANOTHER BACKDAY</p>
			<p class="text-xl leading-5">
				ABSOLUTE <span class="font-bold">CINEMA</span>
			</p>
		</div>

		{@render line()}

		<p class="mt-4 text-sm font-bold lg:mt-0">
			PROGRESS <span class="font-light"
				>{activeDay - (claimed ? 0 : activeDay >= 0 ? 0 : 1)} / 30</span
			>
		</p>

		<div class="relative flex gap-1">
			<form method="post" action="?/signOut" class="flex" use:enhance>
				<button
					class="cursor-pointer bg-black px-2 py-2 text-[10px] font-medium text-white active:scale-98 lg:absolute lg:top-0 lg:left-0 lg:px-4 lg:py-3 lg:pr-6 lg:text-sm lg:[clip-path:polygon(0_0,100%_0,calc(100%-10px)_100%,0_100%)]"
					>LOGOUT</button
				>
			</form>
			<form method="post" class="flex w-full" action="?/push" use:enhance>
				<button
					disabled={claimed}
					class="cursor-pointer bg-accent lg:absolute lg:top-0 lg:right-0 {claimed
						? 'bg-black'
						: ''} w-full px-2 py-2 text-[10px] font-medium text-white active:scale-98 lg:w-fit lg:px-4 lg:py-3 lg:pl-10 lg:text-sm lg:[clip-path:polygon(10px_0,100%_0,100%_100%,0_100%)]"
					>PUSH</button
				>
			</form>
		</div>
	</div>
{/snippet}

<div class="relative flex h-dvh w-dvw">
	{@render sidebar()}

	<div class="flex flex-1 cursor-default scrollbar-none overflow-x-auto overflow-y-hidden">
		{#each { length: 31 } as p, i (`${p}` + i)}
			<div
				id="element-{i}"
				class="relative min-w-50 border-black p-6 transition-all hover:scale-102 hover:rotate-2 lg:min-w-90 lg:p-8 {activeDay ==
				i
					? 'bg-accent text-white'
					: ''} {activeDay == i && claimed ? 'bg-black' : ''}"
			>
				{#if activeDay == i}
					<div
						class="absolute top-0 left-0 h-full w-full animate-ping border-4 border-accent {claimed
							? 'border-black'
							: ''}"
					></div>
				{/if}
				<div class="h-1 w-6 bg-black lg:w-10 {activeDay == i ? 'bg-white' : ''}"></div>

				<div class="mt-10 text-7xl font-medium lg:mt-20 lg:text-9xl">{i}</div>

				<p class="mt-5 max-w-50 text-2xl font-bold text-balance lg:mt-10 lg:text-4xl">
					{getCharacter(i).name.split(' ')[0]}
				</p>
				<p class="-mt-2 max-w-50 text-2xl font-light text-balance lg:mt-0 lg:text-4xl">
					{getCharacter(i).name.split(' ')[1]}
				</p>

				<p class="mt-5 text-sm font-bold lg:mt-10 lg:text-base">ZENLESS ZONE ZERO</p>
				<p class="-mt-1 text-sm lg:-mt-2 lg:text-base">CHARACTERS</p>
			</div>
		{/each}
	</div>
</div>
