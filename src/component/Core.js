import React from 'react';
import './core.css'
import logo from '../moxsoar_logo.svg'

class LoginButton extends React.Component {
    render() {
        return (
            <button type="button" class="btn btn-primary">
                Login
            </button>
        )
    }
}

class TextInput extends React.Component {
    render() {
        return(
            <div class="input-group mb-3">
                <div className="input-group-prepend">
                    <span class="input-group-text">{this.props.fieldName}</span>
                </div>
                <input type="text" class="form-control" aria-label={this.props.fieldName} aria-describedby="basic-addon1"/>
            </div>
        ) 
    }
}

class LoginForm extends React.Component {

    render() {
        return (
            <div className="m-4 text-center">
                <TextInput fieldName='Username'/>
                <TextInput fieldName='Password'/>
                <LoginButton/>
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


