import { useState, useEffect, useRef } from "react"
import Spinner from 'react-bootstrap/Spinner'
import Movie from "../movie/Movie"
import useAuth from "../../hooks/useAuth"
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button"
import usePrivateAxios from "../../hooks/usePrivateAxios"
import { useParams } from "react-router-dom"


const Review = () => {
    const reviewTextDOM = useRef()
    const [loading, setLoading] = useState(false)
    const {auth} = useAuth()
    const [error, setError] = useState()
    const [movie, setMovie] = useState({})

    const {imdb_id} = useParams();
    const privateAxios = usePrivateAxios();

    const handleSumbit = async (e) => {
        e.preventDefault()

        setLoading(true)

        const payload = {
            admin_review: reviewTextDOM.current.value
        }

        try {
            const response = await privateAxios.patch(`/updatereview/${imdb_id}`, payload)

            setMovie(() => ({
                ...movie,
                admin_review: response.data?.admin_review ?? movie.admin_review,
                ranking: {
                    ranking_name: response.data?.ranking_name ?? movie.ranking?.ranking_name
                }
            }))
        } catch(err) {
            if (err.response && err.response.status === 401) {
                console.error('Unauthorized access - redirecting to login page')
                localStorage.removeItem('user')
            } else {
                console.error('Error updating review', err)
            }
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {

        setLoading(true)

        const abortController = new AbortController()

        const fetchMovieByImdbId = async () => {
           try {
                const response = await privateAxios.get(`/movie/${imdb_id}`, {signal: abortController.signal})
                if (response.data.error) {
                    setError(response.data.error)
                    return
                }
                
                setMovie(response.data)
           } catch (err) {
                if (abortController.signal.aborted) {
                    return
                }
                if (err.response && err.response.status === 401) {
                    console.error('Unauthorized access - redirecting to login page')
                    localStorage.removeItem('user')
                } else {
                    console.error('Error updating review', err)
                }
                setError(err)
           } finally {
                setLoading(false)
           }
        }

        fetchMovieByImdbId()

        return () => {
            abortController.abort()
        }
    }, []) 
    
    if (error) {
        return <>{error}</>
    }
    
    return (
        <>
            {loading ? <Spinner/> : (
                <div className="container py-5">
                    <h2 className="text-center mb-4">Admin Review</h2>
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-4 mb-md-0">
                            <div className="w-100 shadow rounded p-3 bg-white d-flex justify-content-center align-items-center">
                                <Movie movie={movie}/>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex align-items-stretch">
                            <div className="w-100 shadow rounded p-4 bg-light">
                                {auth && auth.role === "ADMIN" 
                                    ? (
                                        <Form onSubmit={handleSumbit}>
                                            <Form.Group className="mb-3" controlId="adminReviewTextarea">
                                                <Form.Label>Admin Review</Form.Label>
                                                <Form.Control ref={reviewTextDOM} required as="textarea" rows={8} defaultValue={movie?.admin_review} placeholder="Write your review here"
                                                                style={{resize: "vertical"}}
                                                ></Form.Control>
                                            </Form.Group>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="info" type="submit">Submit Review</Button>
                                            </div>
                                        </Form>
                                    )
                                    :
                                    (
                                        <div className="alert alert-info">xx</div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Review