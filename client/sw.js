// Listen for push events
self.addEventListener('push', event => {
    const data = {title:"shouldUseFlatConfroiig",body:"kkk"} // Assuming the data is in JSON format
    console.log('Push received:', data);

    self.registration.showNotification(data.title, {
        body: data.body,
        
    });
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Open the site or specific URL
    );
});
