
import { axiosInstance } from "./axioscfg";
export const getBlogList =()=>{
  return axiosInstance.get('/blog/list')
}
export const getBlogDetail =(id)=>{
  return axiosInstance.get(`/blog/detail?id=${id}`)
}
export const deleteBlog =(id)=>{
  return axiosInstance.get(`/blog/del?id=${id}`)
}
export const userLogin =(username,password)=>{
  return axiosInstance.post(`/user/login`,{
    username,password
  })
}
export const updateBlog=(id,title,content,author)=>{
  return axiosInstance.get(`/blog/update?id=${id}&title=${title}&content=${content}&author=${author}`)
}
export const newBlog=(title,content,author)=>{
  return axiosInstance.get(`/blog/new?title=${title}&content=${content}&author=${author}`)
}
export const userRegister =(username,password)=>{
  return axiosInstance.post("/user/register",{
    username,password
  })
}

