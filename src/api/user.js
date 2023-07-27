import request from '@/utils/request.js'
// 注册接口
export const userReginsterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}
// 登录接口
export const userLoginService = (data) => {
  return request.post('/api/login', data)
}
// 获取用户的基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新用户信息
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)

export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })

export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })