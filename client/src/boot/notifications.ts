export default async () => {
  if ('Notification' in window) {
    const permission = Notification.permission;

    if (permission === 'default') {
      // Request permission from the user
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          console.log('System notifications are enabled.');
        } else {
          console.log('System notifications are disabled.');
        }
      });
    } else if (permission === 'granted') {
      console.log('System notifications are already enabled.');
    } else {
      console.log('System notifications are blocked.');
    }
  } else {
    console.warn('Browser does not support system notifications.');
  }
};
