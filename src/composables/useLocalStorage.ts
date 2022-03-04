export function useLocalStorage() {

    function getStorageItem(key) {
        try {
            const serializedData = localStorage.getItem(key)
            if (serializedData === null) {
                return undefined
            }

            return JSON.parse(serializedData)
        } catch (_) {
            return undefined
        }
    }

    function setStorageItem(key, value) {
        try {
            const serializedData = JSON.stringify(value)
            localStorage.setItem(key, serializedData)
        } catch (err) {
            console.warn(err)
        }
    }

    function removeStorageItem(key) {
        try {
            localStorage.removeItem(key)
        } catch (err) {
            console.warn(err)
        }
    }

    return { getStorageItem, setStorageItem, removeStorageItem }
}