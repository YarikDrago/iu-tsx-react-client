let permissionRequest: Promise<NotificationPermission> | null = null;

export function isSystemNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestSystemNotificationPermission() {
  if (!isSystemNotificationSupported()) return 'denied' as NotificationPermission;

  if (Notification.permission !== 'default') {
    return Notification.permission;
  }

  if (!permissionRequest) {
    permissionRequest = Notification.requestPermission().finally(() => {
      permissionRequest = null;
    });
  }

  return permissionRequest;
}

type ShowSystemNotificationOptions = {
  body?: string;
  tag?: string;
};

export async function showSystemNotification(
  title: string,
  { body, tag }: ShowSystemNotificationOptions = {}
) {
  const permission = await requestSystemNotificationPermission();

  if (permission !== 'granted') return false;

  new Notification(title, {
    body,
    tag,
  });

  return true;
}
