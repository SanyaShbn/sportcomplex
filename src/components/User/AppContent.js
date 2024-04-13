import * as React from 'react';


import { request, setAuthHeader } from '../../helpers/axios_helper';
import Login from './Login'
import Dashboard from '../MainPage/Dashboard';
import NavBar from '../NavBar';


export default class AppContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome"
        }
    };

    login = () => {
        this.setState({componentToShow: "login"})
    };

    logout = () => {
        this.setState({componentToShow: "welcome"})
        setAuthHeader(null);
    };

    onLogin = (e, username, password) => {
        e.preventDefault();
        request(
            "POST",
            "/login",
            {
                login: username,
                password: password
            }).then(
            (response) => {
                setAuthHeader(response.data.token);
                this.setState({componentToShow: "main"});
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "welcome"})
            }
        );
    };

    onRegister = (event, firstName, lastName, username, password) => {
        event.preventDefault();
        request(
            "POST",
            "/register",
            {
                firstName: firstName,
                lastName: lastName,
                login: username,
                password: password
            }).then(
            (response) => {
                setAuthHeader(response.data.token);
                this.setState({componentToShow: "messages"});
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "welcome"})
            }
        );
    };

  render() {
    return (
      <>
        <Login />
        <NavBar />

        {this.state.componentToShow === "welcome" && <NavBar /> }
        {this.state.componentToShow === "login" && <Login onLogin={this.onLogin} onRegister={this.onRegister} />}
        {this.state.componentToShow === "main" && <Dashboard />}

      </>
    );
  };
}