import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import piniaPluginPersist from "pinia-plugin-persist";


export const useUserStore = defineStore(
    'user',
    () => {
        const user = reactive({})
        const getUser = computed(() => user.value)
        const setUser = (u) => user.value = u;
        const isExisted = () => user.value !== undefined && user.value != null
        const setNull = () => user.value = undefined
        return {
            getUser,
            setUser,
            isExisted,
            setNull
        }

    }, {
        persist: {
            enabled: true
        }
    }
)
