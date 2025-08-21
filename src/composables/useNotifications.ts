import { ref } from 'vue';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timeout?: number;
}

const notifications = ref<Notification[]>([]);

export function useNotifications() {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      timeout: notification.timeout || 5000
    };
    
    notifications.value.push(newNotification);
    
    // Auto remove after timeout
    if (newNotification.timeout && newNotification.timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.timeout);
    }
    
    return id;
  };
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };
  
  const clearAll = () => {
    notifications.value.splice(0);
  };
  
  const showSuccess = (title: string, message?: string) => {
    return addNotification({ type: 'success', title, message });
  };
  
  const showError = (title: string, message?: string) => {
    return addNotification({ type: 'error', title, message });
  };
  
  const showWarning = (title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message });
  };
  
  const showInfo = (title: string, message?: string) => {
    return addNotification({ type: 'info', title, message });
  };
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}