// Debug utility để kiểm tra localStorage và authentication state
export const debugAuth = () => {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  
  console.log('🔍 DEBUG AUTH STATE:');
  console.log('  Token exists:', !!token);
  console.log('  Token value:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('  User data exists:', !!userStr);
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('  User data:', user);
    } catch (e) {
      console.log('  User data parse error:', e);
    }
  }
  
  return { token, userStr };
};

// Gọi trong console: debugAuth()
(window as any).debugAuth = debugAuth;
