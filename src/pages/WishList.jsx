import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { wishlistAPI, cartAPI } from '../lib/api';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await wishlistAPI.getWishlist();
      const list = res.wishlist?.items?.map(i => ({
        id: i.product._id || i.product.id,
        name: i.product.name,
        price: i.product.price || 0,
        image: (i.product.images && i.product.images[0]) || i.product.image || '',
        inStock: (i.product.stock || 0) > 0,
        raw: i.product
      })) || [];
      setItems(list);
    } catch (err) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await wishlistAPI.removeFromWishlist(id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const moveToCart = async (item) => {
    try {
      await cartAPI.addToCart(item.raw._id || item.id, 1);
      await wishlistAPI.removeFromWishlist(item.id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to move to cart');
    }
  };

  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <h2>My Wishlist</h2>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && items.length === 0 && <p>Your wishlist is empty.</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item => (
            <li key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
              <img src={item.image || ''} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div>₹{(item.price || 0).toLocaleString('en-IN')}</div>
                <div>{item.inStock ? 'In stock' : 'Out of stock'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => moveToCart(item)} disabled={!item.inStock}>Move to cart</button>
                <button onClick={() => remove(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Wishlist;
