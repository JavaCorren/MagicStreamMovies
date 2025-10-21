import axios from "axios"
import useAuth from "./useAuth"
import { useEffect } from "react"
const apiUrl = import.meta.env.VITE_API_BASE_URL

const usePrivateAxios = () => {

    const authorizedAxiosClient = axios.create({
        baseURL: apiUrl,
        withCredentials: true,
    })

    const {auth, setAuth} = useAuth()

    let isRefreshing = false
    let failedQueue = []


    // helper to process queued requests after token refresh
    const processQueue = (error, response = null) => {
        failedQueue.forEach(promise => {
            if (error) {
                promise.reject(error)
            } else {
                promise.resolve(response)
            }
        })

        failedQueue = []
    }

    useEffect(() => {
        authorizedAxiosClient.interceptors.request.use(
            response => response, 
            async error => {
                console.log('Interceptor caught error:', error)
                const originalRequest = error.config

                if (originalRequest.url.includes('refresh') && error.response.status === 401) {
                    console.error('Refresh token has expired or is invalid')
                    return Promise.reject(error) //fail directy, no retry 
                }

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({resolve, reject})
                        })
                        .then(() => authorizedAxiosClient(originalRequest))
                        .catch(err => Promise.reject(err))
                    }
                }

                originalRequest._retry = true
                isRefreshing = true

                return new Promise((resolve, reject) => {
                    authorizedAxiosClient
                    .post('/refresh')
                    .then(() => {
                        processQueue(null)
                        authorizedAxiosClient(originalRequest)
                        .then(resolve)
                        .catch(reject)
                    })
                    .catch(refreshErr => {
                        processQueue(refreshErr, null)
                        setAuth(null) // Clear auth state
                        reject(refreshErr)
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
                })
            })
    }, [auth])


    // authorizedAxiosClient.interceptors.request.use((cfg) => {
    //     if (auth) {
    //         cfg.headers.Authorization = `Bearer ${auth.token}`
    //     }
    //     return cfg
    // })

    return authorizedAxiosClient
}

export default usePrivateAxios