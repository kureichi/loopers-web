<script lang="ts">
    import { subOptions } from '#lib/utils/vapidKey.js';
    import { browser } from '$app/env';
    import { onMount } from 'svelte';
    import Simple from '../components/modules/themes/Simple.svelte';
    import { getSeconds } from '#lib/utils.js';
    import { SvelteDate } from 'svelte/reactivity';

    let { data } = $props();

    let count = $derived(data.ball.count);
    let isClaimed = $derived(data.isClaimed);

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
        // harcoded to 10 days
        const finalDate = new SvelteDate(data.ball.createdAt);
        finalDate.setDate(finalDate.getDate() + 10);

        const finalSeconds = getSeconds(data.ball.createdAt, finalDate);
        const nowSeconds = getSeconds(data.ball.createdAt, new Date());

        return (nowSeconds / finalSeconds) * 100;
    };
    let percentNumber = $state(getPercent());

    $effect(() => {
        const interval = setInterval(() => {
            percentNumber = getPercent();
        }, 1000);

        return () => clearInterval(interval);
    });
</script>

<Simple {count} {isClaimed} user={data.user} {percentNumber} />
