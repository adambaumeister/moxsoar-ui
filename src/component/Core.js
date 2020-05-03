import React from 'react';
import './core.css'
import logo from '../moxsoar_logo.svg'
import Moxsoar from '../api/moxsoar'

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
        return(
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">{this.props.fieldName}</span>
                </div>
                <input type={this.props.type || "text"} className="form-control" aria-label={this.props.fieldName} name={this.props.fieldName} aria-describedby="basic-addon1"/>
            </div>
        ) 
    }
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.reactStringify = this.reactStringify.bind(this)
    }

    reactStringify(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();
        m.Auth(data.get("Username"), data.get("Password"));
        
    }

    render() {
        return (
            <div className="m-4 text-center">
                <form onSubmit={this.reactStringify}>
                    <TextInput fieldName='Username'/>
                    <TextInput fieldName='Password' type='password'/>
                    <LoginButton/>
                </form>
            </div>
        )
    }
}

class LoginBox extends React.Component {
    render() {
        var loggedIn = false;
        return(
            <div className="row h-100 justify-content-center align-items-center">
                <div className="card middle-box">
                    <img src={logo} height='50px' className="mt-4"></img>

                    <LoginForm/>
                </div>
            </div>
        )
    }
}

export class Container extends React.Component {
    render() {
        var loggedIn = false;
        return(
            <div className="container h-100">
                <LoginBox/>
            </div>
        )
    }
}



export default class Background extends React.Component {
    render() {
        var result;
        result = <div className="bg">
            <Container/>
        </div>
        return (result);
    }
}


