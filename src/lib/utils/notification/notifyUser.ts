import webpush from 'web-push';
import { PUBLIC_VAPID_KEY } from '$app/env/public';
import { PRIVATE_VAPID_KEY } from '$app/env/private';

webpush.setVapidDetails('mailto:anda@domain.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export async function sendNotification(subscription: webpush.PushSubscription) {
	const payload = JSON.stringify({
		title: "You haven't push yet on this day",
		body: 'Lets push before you late!'
	});

	await webpush.sendNotification(subscription, payload);
}
