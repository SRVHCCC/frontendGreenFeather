import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';

const Notifications = () => {
  // Minimal notifications page — backend real-time notifications are handled elsewhere
  const [items, setItems] = useState([]);
  useEffect(() => {
    // Placeholder: in future, fetch /api/notifications or use socket context
    setItems([]);
  }, []);

  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <h2>Notifications</h2>
        {items.length === 0 ? <p>No notifications yet.</p> : (
          <ul>
            {items.map((n, i) => <li key={i}>{n.title || n.message}</li>)}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
