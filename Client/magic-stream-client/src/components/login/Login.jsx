import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import axiosClient from '../../api/axiosConfig'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import useAuth from "../../hooks/useAuth"
import logo from '../../assets/MagicStreamLogo.png'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {setAuth} = useAuth()
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const payload = {
            email,
            password
        }

        try {
            const response = await axiosClient.post('/login', payload)
            if (response.data.error) {
                setError(response.data.error)
                return
            }

            setAuth(response.data)
            const from = location.state?.from?.pathname || '/'
            console.log(from)
            navigate(from, {replace: true})
        } catch (err) {
            console.error(err)
            setError(err)
            return
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className='login-container d-flex align-items-center justify-content-center min-vh-100'>
            <div className='login-card shadow p-4 rounded bg-white' style={{maxWidth: 400, width:'100%'}}>
                <div className='text-center mb-4'>
                    <img src={logo} alt="LOGO" width={80} className="mb-4" />
                    <h2 className='fw-bold'>Sign In</h2>
                    <p className='text-muted'>Please sign in your Magic Movie Stream account</p>
                    {error && <div className='alert alert-danger py-2'>{error}</div>}
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' value={email} onChange={e => setEmail(e.target.value)} required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} required/>
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

export default Login