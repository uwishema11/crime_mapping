// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// const apiUrl = import.meta.env.VITE_API_URL;

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [openId, setOpenId] = useState(null);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const userCookie = Cookies.get('user');
//       if (!userCookie) return;
//       const { token } = JSON.parse(userCookie);
//       const res = await axios.get(`${apiUrl}/notifications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(res.data.data);
//     };
//     fetchNotifications();
//   }, []);

//   return (
//     <Card className="max-w-xl mx-auto my-4">
//       <CardHeader>
//         <CardTitle className="text-lg">Notifications</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {notifications.map((notif) => (
//             <div
//               key={notif.id}
//               className={`bg-gray-50 rounded p-3 cursor-pointer border transition hover:bg-blue-50 ${
//                 openId === notif.id ? 'border-blue-400' : 'border-transparent'
//               }`}
//               onClick={() => setOpenId(openId === notif.id ? null : notif.id)}
//             >
//               <div className="font-semibold text-blue-700 truncate">
//                 {notif.title}
//               </div>
//               <div className="text-gray-600 truncate">
//                 {notif.message.slice(0, 60)}
//                 {notif.message.length > 60 ? '...' : ''}
//               </div>
//               {openId === notif.id && (
//                 <div className="mt-2 text-gray-700">{notif.message}</div>
//               )}
//             </div>
//           ))}
//           {notifications.length === 0 && (
//             <div className="text-gray-500 text-center">No notifications found.</div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Bell, ChevronDown, ChevronUp, CheckCircle, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const userCookie = Cookies.get('user');
    if (!userCookie) return;
    const { token } = JSON.parse(userCookie);

    try {
      const res = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async (id) => {
    const userCookie = Cookies.get('user');
    if (!userCookie) return;
    const { token } = JSON.parse(userCookie);

    try {
      await axios.patch(
        `${apiUrl}/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="w-full px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-600 h-6 w-6" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="text-sm text-gray-600">
          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Inbox className="mx-auto mb-2 h-10 w-10 text-gray-400" />
            No notifications found.
          </div>
        ) : (
          notifications.map((notif) => {
            const isOpen = openId === notif.id;
            return (
              <div
                key={notif.id}
                className={`rounded-lg p-4 border transition cursor-pointer ${
                  isOpen
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                } ${!notif.isRead ? 'shadow-sm' : 'opacity-80'}`}
                onClick={() => setOpenId(isOpen ? null : notif.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-blue-700">
                      {notif.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {notif.message.slice(0, 60)}
                      {notif.message.length > 60 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as read
                      </Button>
                    )}
                    {isOpen ? (
                      <ChevronUp className="text-gray-400 h-5 w-5" />
                    ) : (
                      <ChevronDown className="text-gray-400 h-5 w-5" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                        {notif.message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
