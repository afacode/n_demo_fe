export type Data = string | number | unknown[] | object;

export type StorageData = {
  key: string;
  data: Data;
};

export enum StorageName {
  localStorage = 'localStorage',
  sessionStorage = 'sessionStorage',
}

function storage() {
  const prefix = 'AFA_CODE';
  /**
   * 是否是字符串
   * @param val 参数
   * @returns
   */
  const isString = (val: string): boolean => {
    return typeof val === 'string' && val !== null && val !== '' && val !== undefined;
  };

  /**
   * 设置缓存
   * @param res 缓存的值
   * @param name 缓存的方式 sessionStorage | localStorage
   */
  const setStorage = (res: StorageData, name?: StorageName): void => {
    try {
      if (!isString(res.key)) throw new Error('请传入要缓存的key!');
      if (!name) name = StorageName.localStorage;
      res.key = `${prefix}_${res.key.toLocaleUpperCase()}`;
      window[name].setItem(res.key, JSON.stringify(res.data));
    } catch (error) {
      console.error('保存失败（setStorage）：', error);
    }
  };

  /**
   * 获取缓存
   * @param key 缓存的key
   * @param value
   * @param name
   * @returns
   */
  const getStorage = (key: string, value?: unknown, name?: StorageName) => {
    try {
      if (!isString(key)) throw new Error('请传入获取缓存的key!');
      if (!name) name = StorageName.localStorage;
      key = `${prefix}_${key.toLocaleUpperCase()}`;
      const data: string = window[name].getItem(key) || '';

      if (data) return JSON.parse(data);
      if (!data) return value;
      return '';
    } catch (error) {
      console.error('获取失败（getStorage）：', error);
      return value || '';
    }
  };

  /**
   * 删除缓存
   * @param key 缓存的key
   * @param name
   */
  const deleteStorage = (key: string, name?: StorageName, fn?: () => void): void => {
    try {
      if (!isString(key)) throw new Error('请传入删除缓存的key!');
      if (!name) name = StorageName.localStorage;
      key = `${prefix}_${key.toLocaleUpperCase()}`;
      window[name].removeItem(key);
      fn && fn();
    } catch (error) {
      console.error('删除失败（deleteStorage）：', error);
    }
  };

  /**
   * 清除全部
   * @param fn 回调
   * @param name
   */
  const clearStorage = (fn: () => void, name?: StorageName) => {
    try {
      if (name) {
        window[name].clear();
        fn && fn();
      } else {
        window.localStorage.clear();
        window.sessionStorage.clear();
        fn && fn();
      }
    } catch (error) {
      fn && fn();
      console.error('clearStorage', error);
    }
  };

  return { isString, setStorage, getStorage, deleteStorage, clearStorage };
}

export default storage();
