/** 
 * 封装本地储存localStorage
 */
const store = {};
const storage = window.localStorage;

//设置
store.set = (key, val) => {
  if (undefined == key) {
    return null;
  }
  storage.setItem(key, JSON.stringify(val));
  return val;
}

//获取
store.get = (key) => {
  if (undefined == key) {
    return null;
  }
  return JSON.parse(storage.getItem(key));
}

//移除
store.remove = (key) => {
  if (undefined == key) {
    return null;
  }
  storage.removeItem(key);
}

//清空所有
store.clear = () => {
	storage.clear();
};

//获取所有
store.getAll = () => {
	let ret = {};
	store.forEach((key, val) => {
		ret[key] = val;
	})
	return ret;
};

//遍历
store.forEach = (callback) => {
	for (let i = 0; i < storage.length; i++) {
		let key = storage.key(i);
		callback(key, store.get(key));
	}
};

export default store;