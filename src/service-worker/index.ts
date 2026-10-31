import { self } from '$app/service-worker';

self.addEventListener('push', (event) => {
	const data = event.data ? event.data.json() : { title: 'Pemberitahuan', body: 'Ada pesan baru!' };

	const options = {
		body: data.body,
		icon: '/img/kureichi.jpg',
		badge: '/img/kureichi.jpg'
	};

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
