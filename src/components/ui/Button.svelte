<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		theme?: string;
		children: Snippet;
	}

	let { children, theme, class: klass, ...rest }: Props = $props();

	let backgroundColor = $derived.by(() => {
		switch (theme) {
			case 'zzz':
				return 'bg-[#db4952]';
			default:
				return 'bg-white';
		}
	});

	let textColor = $derived.by(() => {
		switch (theme) {
			case 'zzz':
				return 'text-white';
			default:
				return 'text-black';
		}
	});
</script>

<button
	{...rest}
	class="rounded-full hover:opacity-95 {backgroundColor} px-6 py-3 font-medium {textColor} disabled:opacity-80 {klass} cursor-pointer transition-all active:scale-98"
>
	{@render children()}
</button>
