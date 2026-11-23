<script lang="ts">
    import type { ThemeProps } from '#lib/types/ThemeProps.ts';
    import { enhance } from '$app/forms';
    import { untrack } from 'svelte';
    let pushLoading = $state(false);
    let now = $state(new Date());
    let hours = $derived(String(now.getHours()).padStart(2, '0'));
    let minutes = $derived(String(now.getMinutes()).padStart(2, '0'));
    let seconds = $derived(String(now.getSeconds()).padStart(2, '0'));

    let focus = $state(false);
    let query = $state<string>('');
    let suggestions = $state<string[]>([]);
    let selectedIndex = $state<number>(-1);
    let debounceTimer: ReturnType<typeof setTimeout>;
    let submitButton: HTMLButtonElement | null = $state(null);

    type GoogleSuggestResponse = [string, string[]];

    function fetchGoogleSuggestions(keyword: string): void {
        if (!keyword.trim()) {
            suggestions = [];
            return;
        }

        const callbackName = `googleSuggestCallback_${Date.now()}`;

        (window as unknown as Record<string, (data: GoogleSuggestResponse) => void>)[callbackName] =
            (data: GoogleSuggestResponse) => {
                suggestions = data[1] || [];
                selectedIndex = -1;

                delete (window as unknown as Record<string, unknown>)[callbackName];
                document.getElementById(callbackName)?.remove();
            };

        const script = document.createElement('script');
        script.id = callbackName;
        script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(keyword)}&callback=${callbackName}`;
        document.body.appendChild(script);
    }

    function handleInput(): void {
        clearTimeout(debounceTimer);

        if (!query.trim()) {
            suggestions = [];
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchGoogleSuggestions(query);
        }, 200);
    }

    function submitSearch(): void {
        if (!submitButton) return;

        submitButton.click();
    }

    const update = () => {
        now = new Date();
    };

    $effect(() => {
        update();

        const interval = setInterval(() => {
            update();
        }, 1000);
        return () => clearInterval(interval);
    });

    interface Props extends ThemeProps {
        searchHistory: string[];
    }

    let { searchHistory, ...props }: Props = $props();

    type Suggestions = {
        value: string;
        history: boolean;
    };

    let combinedSuggestions = $derived.by(() => {
        const suggestionsTransformed: Suggestions[] = suggestions.map((m) => ({
            value: m,
            history: false
        }));
        const clearedHistory = searchHistory.filter((m) =>
            m.startsWith(untrack(() => query).toLowerCase())
        );
        const historyTransformed: Suggestions[] = clearedHistory.map((m) => ({
            value: m,
            history: true
        }));

        return [...historyTransformed, ...suggestionsTransformed];
    });

    function handleKeydown(e: KeyboardEvent): void {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % combinedSuggestions.length;
            query = combinedSuggestions[selectedIndex].value;
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            selectedIndex =
                (selectedIndex - 1 + combinedSuggestions.length) % combinedSuggestions.length;
            query = combinedSuggestions[selectedIndex].value;
        } else if (e.key === 'Escape') {
            combinedSuggestions = [];
            selectedIndex = -1;
        } else if (e.key === 'Enter') {
            submitSearch();
        }
    }
</script>

<form class="hidden" action="?/submitSearch" method="post">
    <input type="text" name="query" value={query} />
    <button bind:this={submitButton} type="submit">submitHidden</button>
</form>

<div class="flex h-dvh w-dvw flex-col items-center justify-center bg-neutral-900">
    <!-- widget container -->
    <div class="flex w-full cursor-default justify-between gap-2 p-8">
        <!-- clock -->
        <div class="flex h-fit items-center gap-2 text-5xl font-medium tracking-tighter">
            <div>{hours}</div>
            <div class="text-lg">:</div>
            <div>{minutes}</div>
            <div class="self-end text-lg text-text-secondary">{seconds}</div>
        </div>
    </div>

    <!-- main container -->
    <div
        class="flex h-10 w-full max-w-200 flex-1 flex-col items-center justify-center gap-8 bg-neutral-900 p-4"
    >
        <div>
            <h1 class="text-3xl font-medium tracking-tight">Everything okay?</h1>
        </div>
        <div class="flex w-full flex-col gap-2">
            <div class="flex w-full items-center justify-center gap-2">
                <input
                    onfocusin={() => (focus = true)}
                    onfocusout={() => (focus = false)}
                    onkeydown={handleKeydown}
                    bind:value={query}
                    oninput={handleInput}
                    class="relative w-[80%] resize-none rounded-full border-2 border-neutral-700 bg-linear-to-t from-neutral-800 to-neutral-900 px-5 transition-all outline-none focus:border-neutral-500 focus:ring-0 {focus ||
                    suggestions.length > 0
                        ? 'w-full'
                        : ''}"
                    placeholder="Find what interests you"
                />
                <i class="ph ph-magnifying-glass flex h-10 w-10 items-center justify-center"></i>
            </div>

            <div
                class="w-full scrollbar-track-transparent overflow-y-auto rounded-2xl {suggestions.length >
                0
                    ? 'h-[20dvh] p-2'
                    : 'h-0'} transition-all"
            >
                <div class="flex flex-wrap gap-2">
                    {#each combinedSuggestions as item, index (item.value)}
                        {#if item.history}
                            <button
                                onclick={() => {
                                    query = item.value;
                                }}
                                class="flex h-fit cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-2 text-left transition-all hover:bg-neutral-800 {index ==
                                selectedIndex
                                    ? 'bg-neutral-800'
                                    : ''}"
                            >
                                <i class="ph ph-clock-counter-clockwise"></i>
                                {item.value}
                            </button>
                        {:else if !item.history}
                            <button
                                onclick={() => {
                                    query = item.value;
                                }}
                                class="h-fit cursor-pointer rounded-2xl px-4 py-2 text-left transition-all hover:bg-neutral-800 {index ==
                                selectedIndex
                                    ? 'bg-neutral-800'
                                    : ''}"
                            >
                                {item.value}
                            </button>
                        {/if}
                    {/each}
                    <!-- {#if query.length >= 2} -->
                    <!--     {#each searchHistory as item (item)} -->
                    <!--         {#if item.includes(query)} -->
                    <!--             <button -->
                    <!--                 onclick={() => { -->
                    <!--                     query = item; -->
                    <!--                     console.log('test'); -->
                    <!--                     // submitSearch(); -->
                    <!--                 }} -->
                    <!--                 class="flex h-fit cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-2 text-left transition-all hover:bg-neutral-800" -->
                    <!--             > -->
                    <!--                 <i class="ph ph-clock-counter-clockwise"></i> -->
                    <!--                 {item} -->
                    <!--             </button> -->
                    <!--         {/if} -->
                    <!--     {/each} -->
                    <!-- {/if} -->
                    <!-- {#each suggestions as item, index (item)} -->
                    <!--     <button -->
                    <!--         onclick={() => { -->
                    <!--             query = item; -->
                    <!--             console.log('test'); -->
                    <!--             // submitSearch(); -->
                    <!--         }} -->
                    <!--         class="h-fit cursor-pointer rounded-2xl px-4 py-2 text-left transition-all hover:bg-neutral-800 {index == -->
                    <!--         selectedIndex -->
                    <!--             ? 'bg-neutral-800' -->
                    <!--             : ''}" -->
                    <!--     > -->
                    <!--         {item} -->
                    <!--     </button> -->
                    <!-- {/each} -->
                </div>
            </div>
        </div>
    </div>

    <!-- widget container -->
    <div class="flex h-30 w-full justify-center gap-2 p-8">
        <!-- counter -->
        <form action="?/push" method="post" class="w-full max-w-80" use:enhance>
            <button
                class="flex w-full {pushLoading
                    ? 'animate-pulse'
                    : ''} items-center gap-4 {!props.isClaimed
                    ? 'cursor-pointer'
                    : 'cursor-default'} transition-all active:scale-98"
                disabled={props.isClaimed}
                type="submit"
                onclick={() => (pushLoading = true)}
            >
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral-600 {!props.isClaimed
                        ? 'bg-white text-black'
                        : 'bg-neutral-800  text-white'} text-sm font-medium"
                >
                    {props.count}
                </div>
                <div class="flex w-full flex-col gap-2">
                    <div class="h-2 w-full rounded-full bg-neutral-800">
                        <div
                            class="h-full rounded-full bg-white"
                            style="width: {props.percentNumber.toFixed(2)}%"
                        ></div>
                    </div>
                    <div class="flex justify-between text-sm font-medium">
                        <div>Progress</div>
                        <div>{props.percentNumber.toFixed(2)}%</div>
                    </div>
                </div>
            </button>
        </form>
    </div>
</div>
