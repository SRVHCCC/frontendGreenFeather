import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './UnifiedAuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        transports: ['websocket', 'polling'],
        autoConnect: true
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
        
        // Join user-specific rooms
        newSocket.emit('join-room', {
          userId: user.id,
          role: user.role
        });

        // Subscribe to product updates
        newSocket.emit('subscribe-to-products');

        // Subscribe to order updates if user has orders
        newSocket.emit('subscribe-to-orders', { userId: user.id });

        toast.success('Connected to real-time updates');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
        toast.error('Disconnected from real-time updates');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection error. Retrying...');
      });

      // Notification handlers
      newSocket.on('notification', (notification) => {
        console.log('Received notification:', notification);
        
        // Show toast notification based on type
        switch (notification.data?.type) {
          case 'product_created':
            toast.success(`New product: ${notification.data.productName}`, {
              duration: 5000,
              icon: '🛍️'
            });
            break;
          case 'product_approved':
            toast.success(`Product approved: ${notification.data.productName}`, {
              duration: 5000,
              icon: '✅'
            });
            break;
          case 'product_rejected':
            toast.error(`Product rejected: ${notification.data.productName}`, {
              duration: 5000,
              icon: '❌'
            });
            break;
          case 'order_created':
            toast.success(`New order: #${notification.data.orderNumber}`, {
              duration: 5000,
              icon: '📦'
            });
            break;
          case 'order_status_update':
            toast.info(`Order updated: #${notification.data.orderNumber}`, {
              duration: 5000,
              icon: '📋'
            });
            break;
          case 'seller_registration':
            toast.success(`New seller: ${notification.data.sellerName}`, {
              duration: 5000,
              icon: '👤'
            });
            break;
          case 'seller_approved':
            toast.success('Your seller account has been approved!', {
              duration: 5000,
              icon: '🎉'
            });
            break;
          case 'new_product':
            toast.success(`New product available: ${notification.data.productName}`, {
              duration: 5000,
              icon: '🆕'
            });
            break;
          case 'system_maintenance':
            toast.error(notification.message, {
              duration: 8000,
              icon: '⚠️'
            });
            break;
          case 'promotion':
            toast.success(notification.message, {
              duration: 6000,
              icon: '🎁'
            });
            break;
          default:
            toast(notification.message, {
              duration: 4000,
              icon: notification.type === 'error' ? '❌' : 
                    notification.type === 'warning' ? '⚠️' : 
                    notification.type === 'success' ? '✅' : 'ℹ️'
            });
        }
      });

      // Product update handlers
      newSocket.on('product-update', (data) => {
        console.log('Product update received:', data);
        
        // Emit custom event for components to listen to
        window.dispatchEvent(new CustomEvent('productUpdate', {
          detail: data
        }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  // Send notification to server
  const sendNotification = (type, data) => {
    if (socket && isConnected) {
      socket.emit('notification', { type, data });
    }
  };

  // Subscribe to specific events
  const subscribeToEvent = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      
      return () => {
        socket.off(event, callback);
      };
    }
  };

  // Emit custom events
  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    isConnected,
    sendNotification,
    subscribeToEvent,
    emitEvent
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
