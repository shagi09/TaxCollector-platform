"use client";
import React, { useState, useEffect } from 'react';

interface Notification {
  _id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type?: 'info' | 'warning' | 'success' | 'error';
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:7000/api/taxPayer/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const notifications = (data.notifications || []).map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          }));
          setNotifications(notifications);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setNotifications([]);
      }
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-500">No notifications found.</div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-4 rounded border ${notification.isRead ? 'bg-gray-100' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{notification.message}</span>
                  <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;