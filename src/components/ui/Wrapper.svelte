<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-dvh w-dvw items-center justify-center">
	<div class="flex max-w-200 flex-col p-4">
		{@render children()}
	</div>
</div>
