import axiosInstance from "@/lib/axios";

export const getLogin = async () => {
    const res = await axiosInstance.post(`/api/login`);
    return res.data;
};