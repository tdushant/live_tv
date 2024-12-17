import api from './axiosClient';

// export const fetchItems = async () => {
//   const response = await api.get('/items');
//   // return stringify(response.data);
//   return response.data;
// };

export const channelsList = async (item) => {
  const response = await api.post('/quick-channels');
  return response.data;
};




