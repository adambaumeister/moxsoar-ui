import React from 'react';
import './core.css';
import logo from '../moxsoar_logo.svg';
import Moxsoar from '../api/moxsoar';
import GetCookie from '../funcs/cookies';
import {Main} from './Packs';
import { ArrowLeft, Tools } from 'react-bootstrap-icons';



class LoginButton extends React.Component {
    render() {
        return (
            <button type="submit" className="btn btn-primary">
                Login
            </button>
        )
    }
}

export class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">{this.props.displayName || this.props.fieldName}</span>
                </div>
                <input type={this.props.type || "text"} className="form-control" aria-label={this.props.displayName || this.props.fieldName} name={this.props.fieldName} aria-describedby="basic-addon1" />
            </div>
        )
    }
}

export class StatusBar extends React.Component {
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
        this.setPage = this.setPage.bind(this);
        this.setPackPage = this.setPackPage.bind(this);
        this.setRoutePage = this.setRoutePage.bind(this);

        var cookie = GetCookie('token');

        var navigation = new Navigation();
        navigation.setRoutePage = this.setRoutePage;
        navigation.setPackPage = this.setPackPage;
        navigation.setPage = this.setPage;


        this.nav = navigation;

        if (cookie) {
            this.state = {
                loggedIn: true,
                page: "packs",
            }
        } else {
            this.state = {
                loggedIn: false,
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

    setPage(pageValue) {
        this.setState({page: pageValue})
    }

    setRoutePage(packName, integrationName) {
        console.log(packName);
        this.setState({
            page: "integration", 
            packName: packName, 
            integrationName: integrationName
        });
    }
    
    setPackPage(pageValue, packName) {
        this.setState({page: pageValue, packName: packName})
    }

    render() {

        var userNotLoggedIn =
            <div className="container h-100">
                <LoginBox onlogin={this.setLoggedIn} />
            </div>

        var userLoggedIn =
            <div className="container h-100">
                <div className="h-100 row justify-content-center align-items-center">
                    <div className="col">
                        <div className="m-2">
                            <BackButton onclick={this.setPage}/>
                            <SettingsButton onclick={this.setPage}/>
                        </div>

                        <Main page={this.state.page} nav={this.nav} packName={this.state.packName} integrationName={this.state.integrationName}/>
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

class SettingsButton extends React.Component {
    constructor(props) {
        super(props);

        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        this.props.onclick("settings")
    }

    render() {
        return (
            <Tools onClick={this.onclick} size={24} className="icon"/>
        )
    }
}

class BackButton extends React.Component {
    constructor(props) {
        super(props);

        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        this.props.onclick("packs")
    }

    render() {
        return (
            <ArrowLeft onClick={this.onclick} size={24} className="icon"/>
        )
    }
}

export class Background extends React.Component {
    render() {
        var result;
        result = <div className="h-100">
            <div  className="bg"/>
            <Container />
        </div>
        return (result);
    }
}


class Navigation {
    constructor() {
        this.setRoutePage = '';
        this.setPackPage = '';
        this.setPage = '';  
    }
}