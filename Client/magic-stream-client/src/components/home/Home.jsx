import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosConfig';
import Movies from '../movies/Movies'


const Home = () => {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setMessage("");
            try {
                const response = await axiosClient.get("/movies")
                const movieData = response.data;
                setMovies(movieData)
                if (movieData.length == 0) {
                    setMessage('There are no movies available currently')
                }
            } catch (err) {
                console.error('Error fetching movies:', err)
                setMessage('Error fetching movies')
            } finally {
                setLoading(false)
            }
        };
        fetchMovies();
    }, []);

    return <>
        {loading ? <h2> loading... </h2> : <Movies movies={movies} message={message}/> }
    </>
}

export default Home