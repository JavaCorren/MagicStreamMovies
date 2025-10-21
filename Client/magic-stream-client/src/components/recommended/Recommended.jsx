import { useEffect, useState } from "react"
import usePrivateAxios from "../../hooks/usePrivateAxios"
import Movies from "../movies/Movies"

const Recommended = () => {

    const privateAxios = usePrivateAxios()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {

        const abortController = new AbortController()

        setLoading(true)
        const fetchRecommendedMovies = async () => {
            try {
                const response = await privateAxios.get('/recommendedmovies', {signal: abortController.signal})
                if (response.data.length === 0) {
                    setMessage("No recommended movies")
                }
                setMovies(response.data)
            } catch (err) {
                if (abortController.signal.aborted) {
                    return
                }
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchRecommendedMovies()

        return () => {abortController.abort()}
    }, [])

    return (
        <>
            {loading ? (<h2>Loading</h2>) : (<Movies movies={movies} message={message}/>)}
        </>
    )
}
export default Recommended