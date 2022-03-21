//Eoghan Martin - C18342116 - Final Year Project - Cognito
import {Navbar,Nav,Form, NavDropdown, Button,Dropdown} from 'react-bootstrap';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useState} from 'react';
import { Link } from 'react-router-dom';
import UserService from '../services/UserService';
import {CurrentUser} from '../business/CurrentUser';


//Nav bar for user navigation
const NavigationBar = () =>{
  //Declare current user logged in, search value and notification values
  const {isAuthenticated,user} = useAuth0();
  const [value, setValue] = useState("");
  // const currentUser = new CurrentUser(user.name);
  const [userNotifications, setUserNotifications] = useState([]);

  //Update value everytime user types to enable search
  const handleChange = e => {
    setValue(e.target.value);
  };

  //return a function for each button on notification
  function getAcceptRequest(username,n){
    return function(){
      UserService.acceptReq(username, n);
    }
  }
  //Get notifications for a specific user
  function getnotification(user){
    UserService.getNotifications(user).then((response) =>{
      setUserNotifications(response.data)
    });
  }
  //if users is logged in
  if(isAuthenticated){
    const currentUser = new CurrentUser(user.name);
    //if user is an admin
    if(user['https://conito-app.ie/app_role'] === "Admin"){
    // setTimeout(
    // getnotification(currentUser.username)
    // ,5000);
      return(
      <Navbar bg="dark" variant="dark">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
      <img class="navicon" src="AppLogo.png" width="25" height="25" alt="brand"/>
      <NavDropdown className="navbar-brand" title="Cognito" id="navbarScrollingDropdown">
        <NavDropdown.Item href={"home"}>Home</NavDropdown.Item>
        <NavDropdown.Item href={"messages"}>Messages</NavDropdown.Item>
        <NavDropdown.Item href={"settings"}>Settings</NavDropdown.Item>
        {/* below is the difference between normal user and admin on nav bar, allows them to run spam cluster algorithm */}
        <NavDropdown.Item href={"spamcluster"}>SpamCluster</NavDropdown.Item>
        <NavDropdown.Item href={"help"}>Help</NavDropdown.Item>
      </NavDropdown>
      {/* Search on nav bar */}
        <Form className="me-auto">
          <input type="text" class="searchInput" placeholder="Search" value={value} onChange={handleChange}/>
          <Link className='navbar-brand' to="/searchresults" state={{search: value}}>Search</Link> 
        </Form>
      <Nav>
        {/* Nav bar link to users profile */}
        <Link to={"/profile"} state={{ search: currentUser.username}}className='navbar-brand'>{currentUser.username}</Link>
        <Dropdown id="notification">
          <Dropdown.Toggle id="dropdown-autoclose-true">
          <i class="fa fa-bell"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
          {/* get notifications for users */}
          {userNotifications.map((n) =>
            <div>
            {n.user2}
            <Button onClick={getAcceptRequest(currentUser.username,n.user2)}>Accept</Button>
            </div>
          )}
          </Dropdown.Menu>
        </Dropdown>
        <LogoutButton/>
      </Nav>
    </Navbar>
      );
    //if user is not admin
    }else if(user['https://conito-app.ie/app_role'] === "normal"){
      setTimeout(
        getnotification(currentUser.username)
        ,5000);
    return (
    <Navbar bg="dark" variant="dark">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
      <img class="navicon" src="AppLogo.png" width="25" height="25" alt="brand"/>
      <NavDropdown className="navbar-brand" title="Cognito" id="navbarScrollingDropdown">
      {/* nav items for drop down */}
        <NavDropdown.Item href={"home"}>Home</NavDropdown.Item>
        <NavDropdown.Item href={"messages"}>Messages</NavDropdown.Item>
        <NavDropdown.Item href={"settings"}>Settings</NavDropdown.Item>
        <NavDropdown.Item href={"help"}>Help</NavDropdown.Item>
      </NavDropdown>
      {/* Search on nav bar */}
        <Form className="me-auto">
          <input type="text" class="searchInput" placeholder="Search" value={value} onChange={handleChange}/>
          <Link className='navbar-brand' to="/searchresults" state={{search: value}}>Search</Link> 
        </Form>
      <Nav>
        {/* Nav bar link to users profile */}
        <Link to={"/profile"} state={{ search: currentUser.username}}className='navbar-brand'>{currentUser.username}</Link>
        <Dropdown id="notification">
          <Dropdown.Toggle id="dropdown-autoclose-true">
          <i class="fa fa-bell"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {/* get notifications for users */}
          {userNotifications.map((n) =>
            <div>
            {n.user2}
            <Button onClick={getAcceptRequest(currentUser.username,n.user2)}>Accept</Button>
            </div>
          )}
          </Dropdown.Menu>
        </Dropdown>
      <LogoutButton/>
      </Nav>
    </Navbar>
    );
  }}
  //if no one is logged in
  else{
    return(
    <Navbar bg="dark" variant="dark">
        <img class="navicon" src="AppLogo.png" width="25" height="25" alt="brand"/>
        <NavDropdown className="navbar-brand" title="Cognito" id="navbarScrollingDropdown">
        </NavDropdown>
        <Nav className="me-auto">
        </Nav>
        <LoginButton/>
    </Navbar>
     );
  }
}

export default NavigationBar;