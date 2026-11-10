import { self } from '$app/service-worker';
import { get, set } from 'idb-keyval';

const getFormattedDate = (dateObj: Date) => {
	return new Intl.DateTimeFormat('sv-SE').format(dateObj);
};

interface NotificationCount {
	date: Date;
	count: number;
}

self.addEventListener('push', async (event) => {
	const data = event.data ? event.data.json() : { title: 'Pemberitahuan', body: 'Ada pesan baru!' };

	const options = {
		body: data.body,
		icon: '/img/kureichi.jpg',
		badge: '/img/kureichi.jpg'
	};

	const dateNow = new Date();
	const notificationCount: NotificationCount = (await get<NotificationCount>(
		'notificationCount'
	)) || {
		date: dateNow,
		count: 0
	};

	const isSameDay = getFormattedDate(dateNow) == getFormattedDate(notificationCount.date);
	const isMaxCount = isSameDay && notificationCount.count >= 3;

	if (isMaxCount) {
		console.log('[notification] Max notification on this day reached!');
		return;
	}

	const newNotificationCount: NotificationCount = {
		date: dateNow,
		count: isMaxCount ? 0 : notificationCount.count + 1
	};
	await set('notificationCount', newNotificationCount);

	event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
	const urlToOpen =
		event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

	event.notification.close();

	event.waitUntil(
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
			for (let i = 0; i < windowClients.length; i++) {
				const client = windowClients[i];
				if (client.url.includes(urlToOpen) && 'focus' in client) {
					return client.focus();
				}
			}
			if (self.clients.openWindow) {
				return self.clients.openWindow(urlToOpen);
			}
		})
	);
});
