<script lang="ts">
    import { subOptions } from '#lib/utils/vapidKey.js';
    import { browser } from '$app/env';
    import { onMount } from 'svelte';
    import { getSeconds } from '#lib/utils.js';
    import { SvelteDate } from 'svelte/reactivity';
    import SearchEngine from '../components/modules/themes/SearchEngine.svelte';
    let { data } = $props();

    let streamedData = $state<Awaited<typeof data.streamResponse> | null>(null);

    async function subscribeUser() {
        if (!browser || !('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.ready;

            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                subscription = await registration.pushManager.subscribe(subOptions);
            }

            const response = await fetch('/api/subscribe', {
                method: 'POST',
                body: JSON.stringify({
                    userId: data.user.id,
                    subscription: subscription
                }),
                headers: { 'content-type': 'application/json' }
            });

            const parsedResponse: {
                success: boolean;
                message: string;
            } = await response.json();

            if (!response.ok) {
                throw new Error('API response is not OK: ' + parsedResponse.message);
            }
        } catch (e) {
            console.error('Failed adding subscription to api: ' + e);
        }
    }

    onMount(async () => {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification Pemission rejected.');
            return;
        }

        await subscribeUser();
    });

    const getPercent = () => {
        if (!streamedData) return null;
        // harcoded to 10 days
        const finalDate = new SvelteDate(streamedData.ball.createdAt);
        finalDate.setDate(finalDate.getDate() + 10);

        const finalSeconds = getSeconds(streamedData.ball.createdAt, finalDate);
        const nowSeconds = getSeconds(streamedData.ball.createdAt, new Date());

        return (nowSeconds / finalSeconds) * 100;
    };
    let percentNumber = $state(getPercent());

    $effect(() => {
        const interval = setInterval(() => {
            percentNumber = getPercent();
        }, 1000);

        return () => clearInterval(interval);
    });

    $effect(() => {
        data.streamResponse.then((data) => {
            streamedData = data;
        });
    });
</script>

<SearchEngine
    count={streamedData?.ball.count || 0}
    isClaimed={streamedData?.isClaimed || false}
    user={data.user}
    percentNumber={percentNumber || 0}
    searchHistory={streamedData?.searchHistory.history || []}
/>
