import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavBar from 'react-bootstrap/NavBar'
import {useNavigate, NavLink} from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import axiosClient from '../../api/axiosConfig'
import logo from '../../assets/MagicStreamLogo.png'

const Header = () => {

    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();

    const handleLogout = async () => {
        try {
            const response = await axiosClient.post('logout', {user_id: auth.user_id})
            console.log(response.data)
            setAuth(null)
        } catch (err) {
            console.error('Error logging out', err)
        }
    }

    return (
        <NavBar bg='dark' variant='dark' expand="lg" className='shadow-sm'>
            <Container>
                <NavBar.Brand><img src={logo} alt="LOGO" width={30}  /> Magic Stream</NavBar.Brand>
            
                <NavBar.Toggle aria-controls='main-navbar-nav'/>
                <NavBar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link as = {NavLink} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as = {NavLink} to="/recommended">
                            Recommended
                        </Nav.Link>
                    </Nav>

                    <Nav className='ms-auto align-items-center'>
                        {auth ?
                            (
                                <>
                                <span className='me-2' style={{color: '#fff'}}>Hello, <strong>{auth.first_name}</strong></span>
                                <Button variant='outline-light' size='sm' className='me-2' onClick={handleLogout}>Logout</Button>
                                </>
                            )    : 
                            (
                                <>
                                <Button variant='outline-info' size='sm' className="me-2" onClick={() => navigate("/login")}>Login</Button>
                                <Button variant='info' size='sm' onClick={() => navigate("/register")}>Register</Button>
                                </>
                            )
                        }
                    </Nav>
                </NavBar.Collapse>
            </Container>
        </NavBar>
    )
}

export default Header