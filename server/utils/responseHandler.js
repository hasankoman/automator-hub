export const createApiResponse = (data, meta = {}) => {
  return {
    success: true,
    data,
    meta,
  };
};
