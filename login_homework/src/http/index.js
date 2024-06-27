import axios from 'axios'


const baseUrl = "http://localhost:8080"
axios.defaults.baseURL = baseUrl

const defaultError = (e) => {
    console.log(e)
    ElMessage.error("发生未知错误")
}
const defaultFailure = (code, message) => {
    if (code === 403) {
        ElMessage.warning("拒绝访问")
    }
    ElMessage.warning(message)
}

function post(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        }).then(({data}) => {
        if (data.code === 200) {
            success(data.data, data.message)
        } else {
            failure(data.code, data.message);
        }
    }).catch(error)
}


function get(url, success, failure = defaultFailure, error = defaultError) {
    axios.get(url,
        {
            withCredentials: true
        }).then(({data}) => {
        if (data.code === 200) {
            success(data.data, data.message)
        } else {
            failure(data.code, data.message);
        }
    }).catch(error)
}

export {
    get,
    post
}






