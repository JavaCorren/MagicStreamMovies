import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import axiosClient from '../../api/axiosConfig'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/MagicStreamLogo.png'

const Register = () => {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [favouriteGenres, setFavouriteGenres] = useState([])
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleGenreChange = (e) => {
        const options = Array.from(e.target.selectedOptions)
        setFavouriteGenres(options.map(opt => ({
            genre_id: Number(opt.value),
            genre_name: opt.label
        })))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)

        const defaultRole = "USER"

        console.log(defaultRole)
        if (password !== confirmedPassword) {
            setError('Passwords do not match')
            return
        }
        
        setLoading(true)

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role: defaultRole,
                favourite_genres: favouriteGenres
            }

            const response = await axiosClient.post('/register', payload)
            if (response.data.error) {
                setError(response.data.error)
                return
            }

            // if registration is successful, redirect to login page
            navigate('/login', {replace: true})
        } catch(error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axiosClient.get('http://localhost:8080/genres')
                setGenres(response.data)
                console.log("Genres:", response.data)
            } catch(error) {
                console.log('Error fetcthing movie genres:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchGenres()
    }, [])

    return (
        <Container className='login-container d-flex align-items-center justify-content-center min-vh-100'>
            <div className='login-card shadow p-4 rounded bg-white' style={{maxWidth: 400, width:'100%'}}>
                <div className='text-center mb-4'>
                    <img src={logo} alt="LOGO" width={60} className='mb-2' />
                    <h2 className='fw-bold'>Register</h2>
                    <p className='text-muted'>Create your Magic Movie Stream account</p>
                    {error && <div className='alert alert-danger py-2'>{error}</div>}
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter first name' value={firstName} onChange={e => setFirstName(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter last name' value={lastName} onChange={e => setLastName(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' value={email} onChange={e => setEmail(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder='Confirm password' value={confirmedPassword} onChange={e => setConfirmedPassword(e.target.value)} isInvalid={!!confirmedPassword && password !== confirmedPassword} required/>
                        <Form.Control.Feedback type='invalid'>Passwords do not match</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Select multiple value={favouriteGenres.map(favG => String(favG.genre_id))} onChange={handleGenreChange}>
                            {genres && genres.length > 0 && genres.map(genre => (
                                <option key={genre.genre_id} value={genre.genre_id} label={genre.genre_name}>{genre.genre_name}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>Passwords do not match</Form.Control.Feedback>
                        <Form.Text className='text-muted'>
                            Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
                        </Form.Text>
                    </Form.Group>
                    <Button variant='primary' type='submit' className='w-100 mb-2' disabled={loading} style={{fontWeight:600, letterSpacing:1}}>
                        {loading 
                            ? 
                        (<>
                            <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                            Registering...
                        </>)
                        : 'Register'}
                    </Button>
                </Form>
            </div>
        </Container>
    )
}

export default Register