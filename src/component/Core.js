import React from 'react';
import './core.css';
import logo from '../moxsoar_logo.svg';
import Moxsoar from '../api/moxsoar';
import { ElasticSearchStatusSimple, ElasticSearch } from '../api/Tracker'
import GetCookie from '../funcs/cookies';
import { Main, EditorControls } from './Packs';
import { ArrowLeft, Tools, QuestionCircle, Plus, Dash, Check } from 'react-bootstrap-icons';



class LoginButton extends React.Component {
    render() {
        return (
            <button type="submit" className="btn btn-primary">
                Login
            </button>
        )
    }
}

export class SelectInput extends React.Component {
    /*
    generic SelectInput controller
    Props
        options (array) : List of items to display as selectable values
        name (str)      : Name of select field.
    */
    constructor(props) {
        super(props);
    }

    render() {
        const selectOptions = this.props.options.map((option) =>
            <option key={option} value={option}>{option}</option>
        );
        return (
            <select name={this.props.name} className="form-control">
                {selectOptions}
            </select>
        )
    }
}

export class TextInput extends React.Component {
    /*
    generic TextInput controller
    Props
        type (str)              : Input type -> defaults to "text"
        inputClass (str)        : Class to add in addition to bootstrap defaults
        fieldname (str)         : Name of input field
        displayName (str)       : Human readable name of input field
        onchange (func(input value))       : Function pointer for callback to run when field changes. 
        placeholder (str)       : Initial or placeholder value
        value (str)             : 
    */
    constructor(props) {
        super(props);
        this.onchange = this.onchange.bind(this);
    }

    onchange(event) {
        if (this.props.onchange) {
            this.props.onchange(event.target.value);
        }
    }
    render() {
        var inputGroupClass = "input-group-prepend " + (this.props.displayNameWidth || "w-25")
        return (
            <div className={this.props.outerClass || "input-group mb-3"}>
                <div className={inputGroupClass}>
                    <span className="input-group-text w-100">{this.props.displayName || this.props.fieldName}</span>
                </div>
                <input
                    onChange={this.onchange}
                    type={this.props.type || "text"}
                    className={"form-control " + this.props.inputclass}
                    aria-label={this.props.displayName || this.props.fieldName}
                    name={this.props.fieldName}
                    aria-describedby="basic-addon1"
                    placeholder={this.props.placeholder || ""}
                />
            </div>
        )
    }
}


export class TextAreaInput extends React.Component {
    /*
    generic TextArea controller
    Props
        type (str)              : Input type -> defaults to "text"
        inputClass (str)        : Class to add in addition to bootstrap defaults
        fieldname (str)         : Name of input field
        displayName (str)       : Human readable name of input field
        onchange (func(input value))       : Function pointer for callback to run when field changes. 
    */
    constructor(props) {
        super(props);
        this.onchange = this.onchange.bind(this);
    }

    onchange(event) {
        if (this.props.onchange) {
            this.props.onchange(event.target.value);
        }
    }
    render() {
        return (
            <textarea onChange={this.onchange} type={this.props.type || "text"} className={"form-control " + this.props.inputclass} aria-label={this.props.displayName || this.props.fieldName} name={this.props.fieldName} />
        )
    }
}


export class ConfirmButton extends React.Component {
    /*
    A little tickbox that does soemthing and returns the status
    */

    constructor(props) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    clicked(event) {
    }

    render() {
        return (
            <Check
                className="icon m-2"
                size={24}
                onClick={this.clicked}
            />
        )
    }
}

export class StatusBar extends React.Component {
    /*
    Generic status bar. useful for error and status messages.
    Props
        show (bool)      : Display the bar (or not)
        type (str)       : CSS class of statusbar
        msg               : msg to display in bar

    */
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

class RadioButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var c = "btn btn-light";
        if (this.props.active) {
            c = c + " active"
        }

        return (
            <label className={c}>
                <input
                    type="radio"
                    name={this.props.name}
                    id={this.props.value}
                    onChange={this.props.callback}
                    value={this.props.value}
                    checked={this.props.active}
                /> {this.props.value}
            </label>
        )
    }

}

export class RadioButtons extends React.Component {
    constructor(props) {
        super(props);

        this.buttonChanged = this.buttonChanged.bind(this);

        var radioOptions = this.props.options.map((option) => {
            if (option === this.props.active) {
                return <RadioButton
                    key={option}
                    name={this.props.name}
                    value={option}
                    callback={this.buttonChanged}
                    active={true}
                    checked={true}
                />
            } else {
                return <RadioButton
                    key={option}
                    name={this.props.name}
                    value={option}
                    callback={this.buttonChanged}
                    active={false}
                />
            }

        }



        );
        this.state = ({
            radioOptions: radioOptions
        })
    }

    buttonChanged(event) {
        var active = event.target.value;
        var radioOptions = this.props.options.map((option) => {
            if (option === active) {

                return <RadioButton
                    key={option}
                    name={this.props.name}
                    value={option}
                    callback={this.buttonChanged}
                    active={true}
                />
            } else {
                return <RadioButton
                    key={option}
                    name={this.props.name}
                    value={option}
                    callback={this.buttonChanged}
                    active={false}
                />
            }
        });

        this.props.callback(active);
        this.setState({
            radioOptions: radioOptions
        })
    }

    render() {
        return (
            <div className="btn-group btn-group-toggle w-50" data-toggle="buttons">
                {this.state.radioOptions}
            </div>
        )
    }
}

export class ToggleButton extends React.Component {
    /*
    Generic Toggle button. Click it and it changes!

    props
        callback(func())    : Callback to run onClick
    */
    constructor(props) {
        super(props);
        this.state = ({
            icon: <Plus size={48} />,
            clicked: false
        })
        this.clicked = this.clicked.bind(this);
    }

    clicked() {
        if (!this.state.clicked) {
            this.setState({
                icon: <Dash size={48} />,
                clicked: true,
            })
        } else {
            this.setState({
                icon: <Plus size={48} />,
                clicked: false
            })
        }
        this.props.callback();
    }


    render() {
        return (
            <button
                onClick={this.clicked}
                className="mb-2 btn btn-secondary w-100 text-center text-primary text-dark"
            >
                {this.state.icon}
            </button>
        )
    }
}

export class GenericSubmitButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            text: this.props.text || "Submit"
        })

    }


    render() {
        return (
            <button type="submit" className="btn btn-primary">
                {this.state.text}
            </button>
        )
    }
}

export class TransformerButton extends React.Component {
    /*
    A button that turns into something else when you click it!
    props:
        outerClass       CSS Classes to use for outer div
        buttonClass      CSS classes to use for button
        object           Object to turn into        
    */
    constructor(props) {
        super(props);

        this.clicked = this.clicked.bind(this);
        this.state = {
            display: <button onClick={this.clicked} className="btn btn-primary">New</button>
        }
    }

    clicked() {
        this.setState({
            display: this.props.object
        })
    }

    render() {
        return (
            <div className={this.props.outerClass || ""}>
                {this.state.display}
            </div>
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
            this.props.onlogin(result.json);
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

class Footer extends React.Component {
    render() {
        return (
            <div className="text-center text-light">
                <small>
                    Logged in as {this.props.username}
                </small>
            </div>
        )
    }
}

export class Container extends React.Component {
    /*
    Container is the primary section (or "container") of the page
    It has many callbacks as well as looking after the little navigation buttons using the Navigation class.
    */
    constructor(props) {
        super(props)
        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPackPage = this.setPackPage.bind(this);
        this.setRoutePage = this.setRoutePage.bind(this);

        this.getSettings = this.getSettings.bind(this);
        this.setSettings = this.setSettings.bind(this);
        this.showEditorControls = this.showEditorControls.bind(this);
        this.setEsSettings = this.setEsSettings.bind(this);

        this.setRoutePage = this.setRoutePage.bind(this);

        var cookie = GetCookie('token');
        var usernameCookie = GetCookie('username');

        var navigation = new Navigation();
        navigation.setRoutePage = this.setRoutePage;
        navigation.setPackPage = this.setPackPage;
        navigation.setPage = this.setPage;
        this.nav = navigation;

        this.elasticsearch = new ElasticSearch();

        if (cookie) {
            this.state = {
                loggedIn: true,
                page: "packs",
                username: usernameCookie,
                settings: {},
            }

        } else {
            this.state = {
                loggedIn: false,
                settings: {},
            }
        }

    }

    componentDidMount() {
        this.getSettings();
    }

    getSettings() {
        if (this.state.loggedIn) {
            var m = new Moxsoar();
            m.GetSettings(this.setSettings);
            this.elasticsearch.GetStatus(this.setEsSettings);
        }
    }

    setSettings(result) {
        if (!result.failed) {
            this.setState({
                settings: result.json,
            });
        }
    }

    setEsSettings(result) {
        if (result.failed) {
            this.setState({
                elasticSearchError: "moxosar API failure.",
                elasticSearchStatus: false
            })
        } else {
            var r = result.json;
            if (r['Connected']) {
                this.setState({
                    elasticSearchError: "",
                    elasticSearchStatus: true
                })
            } else {
                this.setState({
                    elasticSearchError: r['Message'],
                    elasticSearchStatus: false
                })
            }
        }
    }



    // We need to pass self in, as this is accessed within a callback function.
    // This is a bit weird!
    setLoggedIn(jsondata) {
        this.setState({
            loggedIn: true,
            username: jsondata['Username'],
            settings: jsondata['Settings']
        })
        this.getSettings();
    }

    setPage(pageValue) {
        this.setState({ page: pageValue, showEditorControls: false })
    }

    setRoutePage(packName, integrationName) {
        this.setState({
            page: "integration",
            packName: packName,
            integrationName: integrationName,
            showEditorControls: packName
        });
    }

    setPackPage(pageValue, packName) {
        this.setState({ page: pageValue, packName: packName, showEditorControls: packName })
    }

    showEditorControls(v) {
        // Display the little editor controls buttons
        if (this.state.showEditorControls !== v) {
            this.setState({
                showEditorControls: v
            })
        }
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
                        <div className="m-2 w-50 float-left">
                            <BackButton onclick={this.setPage} />
                            <SettingsButton onclick={this.setPage} />
                            <HelpButton />
                            <ElasticSearchStatusSimple
                                status={this.state.elasticSearchStatus}
                            />

                        </div>
                        <div className="float-right">
                            <EditorControls
                                show={this.state.showEditorControls}
                            />
                        </div>
                        <Main
                            page={this.state.page}
                            nav={this.nav}
                            packName={this.state.packName}
                            integrationName={this.state.integrationName}
                            username={this.state.username}
                            settings={this.state.settings}
                            globalStateCallback={this.getSettings}
                        />
                        <Footer username={this.state.username} />
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
            <Tools onClick={this.onclick} size={24} className="icon" />
        )
    }
}

class HelpButton extends React.Component {
    constructor(props) {
        super(props);

        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        window.open("https://adambaumeister.github.io/moxsoar/")
    }

    render() {
        return (
            <QuestionCircle onClick={this.onclick} size={24} className="icon" />
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
            <ArrowLeft onClick={this.onclick} size={24} className="icon" />
        )
    }
}

export class Background extends React.Component {
    render() {
        var result;
        result = <div className="h-100">
            <div className="bg" />
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
