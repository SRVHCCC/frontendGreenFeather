export const TokenHelper = {
    setToken(token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user_token', token);
    },
  
    getToken() {
      return localStorage.getItem('token') || localStorage.getItem('user_token');
    },
 
    removeToken() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_token');
    },

    getAuthHeaders() {
      const token = this.getToken();
      if (!token) return {};
      
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    },

    isAuthenticated() {
      return !!this.getToken();
    }
  };
  
  // Usage example:
  // import { TokenHelper } from '../utils/tokenHelper';
  // 
  // const response = await fetch('http://localhost:5000/api/users/addresses', {
  //   headers: TokenHelper.getAuthHeaders()
  // });