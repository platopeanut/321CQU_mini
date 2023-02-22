import Taro from "@tarojs/taro";

export function stdSetStorageSync(key: string, data: any) {
  handleStorageIndex(key);
  Taro.setStorageSync(key, data);
}

export function stdGetStorageSync<T>(key: string) {
  return Taro.getStorageSync<T>(key);
}

const STORAGE_INDEX_NAME = "__STD_INDEX__";
function handleStorageIndex(key: string) {
  const storageIndex = Taro.getStorageSync<string[]>(STORAGE_INDEX_NAME) || [];
  if (!storageIndex.includes(key)) {
    storageIndex.push(key);
    Taro.setStorageSync(STORAGE_INDEX_NAME, storageIndex);
  }
}

export function printAllStorage() {
  const storageIndex = Taro.getStorageSync<string[]>(STORAGE_INDEX_NAME) || [];
  console.log(storageIndex);
  storageIndex.forEach(it => console.log(Taro.getStorageSync(it)));
}

export function clearAllStorage() {
  Taro.clearStorageSync();
  console.log("CLEAR ALL DONE");
}
