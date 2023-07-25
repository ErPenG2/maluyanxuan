
export const keyword = "user"

// 设置数据
// value是用户信息，用户信息是对象，对象不能直接存，
// 先利用JSON.stringify(value || [])转成普通的字符串
// encodeURI把字符串变成url编码，达到编码中文
// btoa url编码->base64编码
export const setData = (key, value) => {
  localStorage.setItem(`${keyword}-${key}`, btoa(encodeURI(JSON.stringify(value || []))))
}

// 获取数据
export const getData = key => {
  return JSON.parse(decodeURI(atob(localStorage.getItem(`${keyword}-${key}`) || '') || '') || '[]')
}

// 删除数据
export const deleteData = key => localStorage.removeItem(`${keyword}-${key}`);


// 获取上次登录者数据
export const lastLoginUser = () => {
  const uname = Object.keys(localStorage)
    .filter(it => it.startsWith(keyword))
    .find(it => getData(it?.replace(`${keyword}-`, '')).lastLogin)
    ?.replace(`${keyword}-`, '');
  const userInfo = getData(uname);
  userInfo.name = uname;
  return userInfo;
}


// 重置本地记录的所有的登录者中的标识   lastLogin
// 把所有的lastLogin变在false，当当前登录者用户的lastLoin变成true
// 退出登录也要调用resetLogin，
// user-demo01   UIFDUFLDSKFHUSHFLFNDSJHFSDHFDSFHJH  8  lastLogin = false
// user-malu001  FDFUEYWEGDGUIFDUFLDSKFHUSHFLFNDSHF  9  lastLogin = false
// user-malu002  FFDFSDFSDGDSGSDFUFLDSKFHUSHFLFNDSH  10  lastLogin = true
// cart-001  GUIFDUFLDSKFHUSHFLFND
export const resetLogin = () => {
  Object.keys(localStorage).filter(it => it.startsWith(keyword)).forEach(it => {
    const resetData = getData(it.replace(`${keyword}-`, ''))
    resetData.lastLogin = false;
    setData(it.replace(`${keyword}-`, ''), resetData)
  })
}




