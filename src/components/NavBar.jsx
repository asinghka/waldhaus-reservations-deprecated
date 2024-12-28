import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from 'react-router-dom';

function CustomLink({ to, children, ...props }) {
    return (
        <Nav.Item className="ms-2">
            <Nav.Link as={NavLink} to={to} style={{ fontSize: '25px' }} {...props}>{ children }</Nav.Link>
        </Nav.Item>
    )
}

// TODO: Überblick
function NavBar() {
    return (
        <Navbar defaultActiveKey="/" bg="dark" data-bs-theme="dark" className="pt-3 pb-3">
            <Navbar.Brand to="/" className="d-flex align-items-center ps-5">
                <img
                    src="assets/logo.png"
                    style={{height: '70px'}}
                />
                <div style={{textAlign: 'left'}}>
                    <h4 style={{marginTop: '10px', marginLeft: '10px'}}>Waldhaus 21</h4>
                    <h4 style={{marginTop: '-15px', marginLeft: '10px'}}>Reservierungen</h4>
                </div>
            </Navbar.Brand>
            <Nav className="ms-auto pe-5">
                <CustomLink to="/">Heute</CustomLink>
                <CustomLink to="/all">Alle Reservierungen</CustomLink>
                <CustomLink to="/overview">Überblick</CustomLink>
            </Nav>
        </Navbar>


    );
}

export default NavBar;