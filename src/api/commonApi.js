import axiosInstance from './axiosInstance';

export const uploadImage = async (formData) => {
    return axiosInstance.post('/common/upload',formData);
};
export const getSMS = async (phone) => {
  return axiosInstance.post('/common/sms',phone);
};
export const smsLogin = async (phone,code) => {
  return axiosInstance.post('/common/smsLogin',phone,code);
};