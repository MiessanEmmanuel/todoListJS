/**
 * 
 * @param {string} key 
 * @returns {JSON[]}
 */
export function getItemFromLocalStorage(key){
    return JSON.parse(localStorage.getItem(key))
}


/**
 * 
 * @param {string} key 
 * @param {JSON[]} value 
 */
export function setItemToLocalStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value))
}
