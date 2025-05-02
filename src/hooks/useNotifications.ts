
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Notification, SupabaseNotification } from '@/types/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const mappedNotifications: Notification[] = (data as SupabaseNotification[]).map(notification => ({
            id: notification.id,
            sampleId: notification.sample_id || undefined,
            sampleNumber: notification.sample_number,
            message: notification.message,
            type: notification.type as 'info' | 'warning' | 'urgent',
            createdAt: notification.created_at,
            read: notification.read
          }));
          
          setNotifications(mappedNotifications);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();

    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as SupabaseNotification;
            const mappedNotification: Notification = {
              id: newNotification.id,
              sampleId: newNotification.sample_id || undefined,
              sampleNumber: newNotification.sample_number,
              message: newNotification.message,
              type: newNotification.type as 'info' | 'warning' | 'urgent',
              createdAt: newNotification.created_at,
              read: newNotification.read
            };
            
            setNotifications(prev => [mappedNotification, ...prev]);
            
            toast({
              title: newNotification.type === 'urgent' ? 'Notification urgente' : 'Notification',
              description: newNotification.message,
              variant: newNotification.type === 'urgent' ? 'destructive' : 'default'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead
  };
};
