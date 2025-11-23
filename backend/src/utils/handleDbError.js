export const handleDbError = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error('DB Error:', err.message);
      throw new Error('Database operation failed');
    }
  };
};