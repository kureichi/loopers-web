<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
	}

	let { children, class: klass, ...rest }: Props = $props();
</script>

<button
	{...rest}
	class="rounded-md bg-[#db4952] px-4 py-3 text-sm font-medium text-white {klass} cursor-pointer transition-transform active:scale-98"
>
	{@render children()}
</button>
