import "../App.css"
import { Outlet, Link } from "react-router-dom";
import {Nav, Navbar, Container, Image} from "react-bootstrap";
import headerPicture from "../images/meaty-logo.jpg";
import classes from "./layout.module.css"

const Layout = () => {
    return (
        <div className="page">
            <header>
                <Image src={headerPicture} className="header-picture"/>
            </header>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className={`${classes.navbar}`}>
                <Container className={classes.container}>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className={classes.navlinks}>
                        <Nav>
                            <Nav.Link as={Link} to="/">Recepty</Nav.Link>
                            <Nav.Link as={Link} to="/categoriesList">Kategorie</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="content">
                <div className="container">
                    <Outlet />
                </div>
            </div>
        </div>
    )
};

export default Layout;