import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavbarComponent = () =>{
    return (
        <>
        <Navbar bg="light" variant="light" expand="lg" sticky='top'>
            <Container fluid>
                {/* <Navbar.Brand href="/donateeasy"><i><img src=".../" alt="LOGO" style={{width:"30px", height:"20px"}}></img></i> Home Decor</Navbar.Brand> */}
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="ms-auto" style={{ maxHeight: '100%' }} navbarScroll>
                        {sessionStorage.getItem("signInStatus")&&<>
                        <Nav.Link href="/donateeasy/home">Home</Nav.Link>
                        {sessionStorage.getItem("role") === "Admin" ?
                        <>
                        <Nav.Link href="/donateeasy/adminDashboard/orphanage">Orphanages</Nav.Link>
                        <Nav.Link href="/donateeasy/adminDashboard/donor">Donors</Nav.Link>
                        </>:
                        sessionStorage.getItem("role") === "Donor" ?
                        <>
                        <Nav.Link href="/donateeasy/donorPage">Donor Page</Nav.Link>
                        <Nav.Link href="/donateeasy/donordonationHistory">Donation History</Nav.Link>
                        </>:
                        <>
                        <Nav.Link href="/donateeasy/donationhistory">Donation History</Nav.Link>
                        </>
                        }
                        <Nav.Link href="/donateeasy/userProfile">Profile</Nav.Link>
                        <Nav.Link href="/donateeasy/signout" active>Sign Out</Nav.Link>
                        </>}
                        {!sessionStorage.getItem("role") && <>
                        <Nav.Link href="/donateeasy/login" active>Login</Nav.Link>
                        <Nav.Link href="/donateeasy/register" active>Register</Nav.Link>
                        </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}
export default NavbarComponent;