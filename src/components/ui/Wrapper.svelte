<script lang="ts">
	let { children } = $props();
</script>

<div class="flex justify-center">
	<div class="flex w-200 max-w-dvw flex-col px-4">
		{@render children()}
	</div>
</div>
