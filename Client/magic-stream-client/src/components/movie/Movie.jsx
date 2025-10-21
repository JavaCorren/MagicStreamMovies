import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "react-bootstrap/esm/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCirclePlay} from '@fortawesome/free-solid-svg-icons'
import './Movie.css'

const Movie = ({movie}) => {
    function showReviewBtn() {
        return auth?.role === "ADMIN"
    }

    const navigate = useNavigate()
    const {auth} = useAuth()
    
    const showReviewBtnFlag = showReviewBtn()
    const handleClick = () => {
        navigate(`/review/${movie.imdb_id}`)
    }

    return (
        <div className='col-md-4 mb-4'>
            <Link to={`/stream/${movie.youtube_id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <div className='card h-100 shadow-sm movie-card'>
                    <div style={{position:'relative'}}>
                        <img src={movie.poster_path} alt={movie.title} className='card-img-top' style={{
                            objectFit: "contain",
                            height: "250px",
                            width: "100%"
                        }}/>
                        <span className="play-icon-overlay">
                            <FontAwesomeIcon icon={faCirclePlay}/>
                        </span>
                    </div>
                    <div className='card-body d-flex flex-column'>
                        <h5 className='card-title'>{movie.title}</h5>
                        <p className='card-text mb-2'>{movie.imdb_id}</p>
                    </div>
                    {movie.ranking?.ranking_name && (
                        <span className='badge bg-dark m-3 p-2' style={{fontSize:'1 rem'}}>
                            {movie.ranking.ranking_name}
                        </span>
                    )}
                    {showReviewBtnFlag && (
                        <Button
                                variant="outline-info"
                                onClick={e => {
                                    e.preventDefault();
                                    handleClick(movie.imdb_id);
                                }}
                                className="m-3"
                            >
                                Review
                            </Button>
                    )}
                </div>
            </Link>
        </div>
     ) 
}

export default Movie;