import React from 'react';
import './core.css';
import logo from '../moxsoar_logo.svg';
import Moxsoar from '../api/moxsoar';
import GetCookie from '../funcs/cookies';
import Main from './Packs';
import Navigation from './Packs';


class LoginButton extends React.Component {
    render() {
        return (
            <button type="submit" className="btn btn-primary">
                Login
            </button>
        )
    }
}

class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">{this.props.fieldName}</span>
                </div>
                <input type={this.props.type || "text"} className="form-control" aria-label={this.props.fieldName} name={this.props.fieldName} aria-describedby="basic-addon1" />
            </div>
        )
    }
}

class StatusBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var style;
        if (this.props.show) {
            style = { display: 'block' };
        } else {
            style = { display: 'none' };
        }
        return (
            <div className={this.props.type} style={style}>{this.props.msg}</div>
        )
    }
}

class LoginForm extends React.Component {
    /*
    Good example of an API based form that uses an external class and the async fetch to work
    */
    constructor(props) {
        super(props);
        this.reactStringify = this.reactStringify.bind(this)
        this.state = {
            failed: false,
            failMessage: ''
        }
    }

    reactStringify(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();
        // Here we pass authcb as a callback so it works in the async code
        // We also have to pass this into the callback so it can access it.
        var r = m.Auth(data.get("Username"), data.get("Password"), this);
    }

    authcb(result) {
        if (result.failed) {
            this.setState({ failed: true, failMessage: result.error });
        } else {
            this.props.onlogin();
        }
    }

    render() {
        return (
            <div className="m-4 text-center">
                <form onSubmit={this.reactStringify}>
                    <TextInput fieldName='Username' />
                    <TextInput fieldName='Password' type='password' />
                    <LoginButton />
                    <StatusBar show={this.state.failed} type="alert alert-danger mt-4 fade show" msg={this.state.failMessage} />
                </form>
            </div>
        )
    }
}

class LoginBox extends React.Component {
    render() {
        return (
            <div className="row h-100 justify-content-center align-items-center">
                <div className="card middle-box">
                    <img src={logo} height='50px' className="mt-4"></img>

                    <LoginForm onlogin={this.props.onlogin} />
                </div>
            </div>
        )
    }
}

export class Container extends React.Component {
    constructor(props) {
        super(props)
        this.setLoggedIn = this.setLoggedIn.bind(this);
        var cookie = GetCookie('token');

        if (cookie) {
            this.state = {
                loggedIn: true
            }
        } else {
            this.state = {
                loggedIn: false
            }
        }

    }

    // We need to pass self in, as this is accessed within a callback function.
    // This is a bit weird!
    setLoggedIn() {
        this.setState({
            loggedIn: true
        })
    }

    render() {

        var nav = new Navigation();
        var userNotLoggedIn =
            <div className="container h-100">
                <LoginBox onlogin={this.setLoggedIn} />
            </div>

        var userLoggedIn =
            <div className="container h-100">
                <div className="h-100 row justify-content-center align-items-center">
                    <div class="col">
                        <BackButton nav={nav}/>
                        <Main />
                    </div>
                </div>
            </div>

        if (this.state.loggedIn) {
            return (userLoggedIn);
        } else {

            return (userNotLoggedIn);
        }

    }
}


class BackButton extends React.Component {
    render() {
        return (
            <svg class="bi bi-arrow-left-short" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.854 4.646a.5.5 0 010 .708L5.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M4.5 8a.5.5 0 01.5-.5h6.5a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" clip-rule="evenodd" />
            </svg>
        )
    }
}

export default class Background extends React.Component {
    render() {
        var result;
        result = <div className="bg">
            <Container />
        </div>
        return (result);
    }
}


