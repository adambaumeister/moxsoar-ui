import React from 'react';
import Moxsoar from '../api/moxsoar';
import logo from '../moxsoar_logo.svg';
import './Packs.css';
import IntegrationDetails from './Integration';
import { Plus, Check, ArrowClockwise, ArrowDown, X, TrashFill, FileCheck } from 'react-bootstrap-icons';
import { GenericSubmitButton, TextInput, StatusBar, TransformerButton, ConfirmButton } from './Core'
import { CSSTransitionGroup } from 'react-transition-group' // ES6

class InfoBox extends React.Component {
    render() {
        return (
            <div className="text-center text-muted">{this.props.Description || ""} {this.props.Author || ""} {this.props.Version || ""}</div>
        )
    }
}

class Integration extends React.Component {
    constructor(props) {
        super(props);
        this.onclick = this.onclick.bind(this);
        this.delete = this.delete.bind(this);
    }

    onclick() {
        this.props.nav.setRoutePage(this.props.packName, this.props.integration.Name);
    }

    delete(e) {
        e.stopPropagation();

        var m = new Moxsoar();
        m.DeleteIntegration(this.props.statuscb, this.props.packName, this.props.integration.Name)
    }
    render() {
        return (
            <div onClick={this.onclick} className="mb-2 btn btn-primary w-100 text-left">
                <div className="row">
                    <div className="col">
                        <h4>
                            {this.props.integration.Name}
                        </h4>
                    </div>
                    <div className="col-1 text-right">
                        <h4>
                            <TrashFill
                                onClick={this.delete}
                                color="#dc3545"
                                className="icon"
                                size={24}
                            />
                        </h4>
                    </div>
                </div>

            </div>
        )
    }
}

class Running extends React.Component {
    render() {

        var ints = [];
        var index = 0;

        for (var integration of this.props.running) {
            ints.push(<Integration
                packName={this.props.packName}
                key={index}
                integration={integration}
                nav={this.props.nav}
                statuscb={this.props.statuscb}
            />)
            index++;
        }
        return (
            <div className="m-4">
                {ints}
            </div>
        )
    }
}

class RunnerTable extends React.Component {
    render() {
        return (
            <div className="row mb-4 mt-4 text-center text-primary">
                <div className="col p-0"><h5>Address</h5> {this.props.runner.Address}</div>
                <div className="col p-0"><h5>Port Start</h5>{this.props.runner.PortMin}</div>
                <div className="col p-0"><h5>Port End</h5>{this.props.runner.PortMax}</div>
            </div>
        )
    }
}

class AddIntegrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    submit(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();

        m.AddIntegration(this.props.statuscb, this.props.packName, data.get("name"));
    }

    render() {
        return (
            <form onSubmit={this.submit}>
                <TextInput displayName='Name' fieldName='name' />
                <GenericSubmitButton text="Add" />
            </form>

        )
    }
}

class PackDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            retrieved: false,
            runner: {},
            statusBar: ""
        };
        this.setDetails = this.setDetails.bind(this);
        this.status = this.status.bind(this);

    }

    componentDidMount() {

        var m = new Moxsoar();
        m.GetPackDetails(this, this.props.packName);
    }

    status(result) {
        if (result.failed) {
            this.setState({
                statusBar: <StatusBar
                    type="alert alert-warning mt-4 fade show"
                    show={true}
                    msg={result.error}
                />
            })
        } else {
            this.setState({
                statusBar: <StatusBar
                    type="alert alert-success mt-4 fade show"
                    show={true}
                    msg={result.json["Message"]}
                />
            })

            var m = new Moxsoar();
            m.GetPackDetails(this, this.props.packName);
        }

    }

    setDetails(result) {
        this.setState({
            runner: result.json["RunConfig"],
            retrieved: true
        })
    }

    render() {
        if (!this.state.retrieved) {
            return (
                <div>Loading...</div>
            )
        } else {
            return (
                <div>
                    <InfoBox Description={this.state.runner.Info.Description} Author={this.state.runner.Info.Author} Version={this.state.runner.Info.Version} />
                    <h4 className="text-light ml-4">Runner configuration</h4>
                    <RunnerTable runner={this.state.runner.Runner} />
                    <h4 className="text-light ml-4">Running integrations</h4>
                    <Running
                        packName={this.props.packName}
                        running={this.state.runner.Running}
                        nav={this.props.nav}
                        statuscb={this.status}
                    />
                    <div className="m-4">
                        {this.state.statusBar}
                    </div>
                    <TransformerButton
                        outerClass="m-4 text-center"
                        object={<AddIntegrationForm
                            packName={this.props.packName}
                            statuscb={this.status}
                        />}
                    />
                </div>
            )
        }

    }
}

class NewButton extends React.Component {

    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);
        this.clicked = this.clicked.bind(this);
        this.setResult = this.setResult.bind(this);

        this.b = <button onClick={this.clicked} className="mb-2 btn btn-secondary w-100 text-center text-primary text-dark">
            <Plus size={48} />
        </button>

        this.state = {
            display: this.b,
            failed: false,
            success: false
        }

    }

    setResult(result) {
        if (result.failed) {
            this.setState({ failed: true, failMessage: result.error });
        } else {
            this.setState({
                success: true,
                message: result.json['Message'],
                display: this.b
            })
            this.props.update();
        }
    }

    submit(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();
        m.ClonePack(this, data.get("packname"), data.get("repo"))
    }

    clicked() {
        var r = <form onSubmit={this.submit}>
            <div className="row">
                <div className="col">
                    <TextInput displayName='Pack name' fieldName='packname' />
                </div>
                <div className="col">
                    <TextInput displayName='Git repository' fieldName='repo' />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col text-center">
                    <button type="submit" className="btn btn-secondary text-light ">
                        Add
                    </button>
                </div>
            </div>
        </form>

        this.setState({
            display: r
        })
    }

    render() {
        return (
            <div>
                {this.state.display}
                <StatusBar show={this.state.failed} type="alert alert-danger mt-4 fade show" msg={this.state.failMessage} />
                <StatusBar show={this.state.success} type="alert alert-success mt-4 fade show" msg={this.state.message} />
            </div>
        )
    }
}

class PackList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packs: [],
            added: false
        };
        this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
    }

    componentDidMount() {
        var m = new Moxsoar();
        m.GetPacks(this);
    }

    rerenderParentCallback() {
        var m = new Moxsoar();
        m.GetPacks(this);
    }

    addPacks(result) {
        var index = 0;
        var p = [];

        for (var pack of result.json["Packs"]) {

            p.push(<Pack nav={this.props.nav} key={index} pack={pack} update={this.rerenderParentCallback} />);
            this.setState({ packs: p });
            index++;
        }
    }

    render() {
        return (
            <div className="mt-3 ml-5 mr-5">
                <div>
                    {this.state.packs}
                </div>
                <NewButton update={this.rerenderParentCallback} />
            </div>
        )
    }
}


class Pack extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentView: 'packs'
        }

        this.state.Comment = "MOXSOAR content repository."
        if (this.props.pack.Comment != "") {
            this.state.Comment = this.props.pack.Comment
        }

        var c = <div className="col">
            <h4>
                {this.props.pack.Name}
            </h4>
            <h6 className="text-muted">
                {this.state.Comment}
            </h6>
        </div>

        this.c = c;

        this.state.content = c;

        this.onclick = this.onclick.bind(this);
        this.activate = this.activate.bind(this);

    }

    activate() {
        var m = new Moxsoar();
        m.ActivatePack(this, this.props.pack.Name);
    }

    activatecb(result) {
        if (result.failed) {
            this.setState({ failed: true, failMessage: result.error });
        } else {
            this.setState({ content: this.c })


            this.props.update();
        }
    }

    onclick() {

        // If this is the active pack go to that page
        if (this.props.pack.Active) {
            this.props.nav.setPackPage("pack", this.props.pack.Name)
            // Otherwise, set this one as active
        } else {
            var c = <div className="col">
                <button onClick={this.activate} className="btn btn-dark p-2">Make this content pack active</button>
            </div>
            this.setState({ content: c });
        }
    }

    render() {
        var flags = "";
        if (this.props.pack.Active) {
            var flags = <Check size={36} />
        }

        return (
            <div className="row no-gutters">
                <UpdateButton pack={this.props.pack} />
                <div onClick={this.onclick} className="col mb-2 btn btn-primary w-100 text-left">
                    <div className="row pl-2">
                        {this.state.content}
                        <div className="col-1 text-right my-auto checkbox">
                            {flags}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

class UpdateButton extends React.Component {

    constructor(props) {
        super(props);
        this.updateClick = this.updateClick.bind(this);
        this.updatecb = this.updatecb.bind(this);

        this.state = {
            success: false,
            failed: false,
            loading: false
        }

    }

    updatecb(result) {
        if (result.failed) {
            this.setState({ failed: true, failMessage: result.error, loading: false });
        } else {
            this.setState({ success: true, loading: false });
        }
    }

    updateClick() {
        var m = new Moxsoar();
        this.setState({ loading: true });

        m.UpdatePack(this.updatecb, this.props.pack.Name)
    }

    render() {
        var icon;
        if (this.state.success) {
            icon = <Check size={36} />
        } else if (this.state.failed) {
            icon = <X size={36} />
        } else if (this.state.loading) {
            icon = <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        } else {
            icon = <ArrowDown size={36} />
        }

        return (
            <div className="col-1 icon text-center my-auto no-gutters" onClick={this.updateClick}>{icon}</div>
        )
    }

}


class Settings extends React.Component {
    /*
    Settings Page
    */
    constructor(props) {
        super(props);
        this.state = {
            failed: false,
            failMessage: '',
            matching: false,
            newPassword: '',
            newPasswordRepeat: '',
            inputclass: "",
            message: "",
            success: "",
            statusBar: <div />
        }
        this.onPwChange = this.onPwChange.bind(this);
        this.onRepeatChange = this.onRepeatChange.bind(this);
        this.reactStringify = this.reactStringify.bind(this);
        this.addusercb = this.addusercb.bind(this);
        this.status = this.status.bind(this);

        this.changeSettings = this.changeSettings.bind(this);
    }

    onPwChange(pw) {
        this.setState({ newPassword: pw });
    }

    onRepeatChange(pw) {
        if (pw != this.state.newPassword) {
            this.setState({ inputclass: "bg-warning" })
        } else {
            this.setState({ inputclass: "bg-success" })

        }
        this.setState({ newPasswordRepeat: pw });

    }

    reactStringify(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();
        m.AddUser(this.status, this.props.username, data.get('password'));
    }

    changeSettings(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();
        m.EditSettings(this.status, data);
        this.props.globalStateCallback();
    }

    addusercb(result) {
        if (result.failed) {
            this.setState({ failed: true, failMessage: result.error });
        } else {
            this.setState({ success: true, message: "Success!" });
        }
    }

    status(result) {
        if (result.failed) {
            this.setState({
                statusBar: <StatusBar
                    type="alert alert-warning mt-4 fade show"
                    show={true}
                    msg={result.error}
                />
            })
        } else {
            this.setState({
                statusBar: <StatusBar
                    type="alert alert-success mt-4 fade show"
                    show={true}
                    msg={result.json["Message"]}
                />
            })
        }
    }


    render() {
        return (
            <div className="m-4">
                <div className="row">
                    <div className="col">
                        {this.state.statusBar}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h4 className="text-light mb-2 text-center">
                            Change password
                        </h4>
                        <form onSubmit={this.reactStringify}>
                            <TextInput onchange={this.onPwChange} fieldName='password' type='password' />
                            <TextInput onchange={this.onRepeatChange} inputclass={this.state.inputclass} displayName="Repeat Password" fieldName='RepeatPassword' type='password' />
                            <GenericSubmitButton />
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h4 className="text-light mb-2 text-center">
                            System Settings
                        </h4>
                        <form onSubmit={this.changeSettings}>
                            <TextInput
                                fieldName='displayhost'
                                displayName="Moxsoar Server Name"
                                placeholder={this.props.settings['DisplayHost']}
                            />
                            <GenericSubmitButton />
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export class EditorControls extends React.Component {
    /*
    Displays controls for saving the config
    Props
        show (bool): True or false, controls rendering
    */
    constructor(props) {
        super(props);

        this.clicked = this.clicked.bind(this);
        this.submit = this.submit.bind(this);
        this.status = this.status.bind(this);
        this.state = {
            items: [
                <div className="row no-gutters" key="1">
                    <div className="col">
                        <FileCheck
                            size={24}
                            className="icon m-2"
                            onClick={this.clicked}
                        />
                    </div>
                </div>

            ]
        }
    }

    status(result) {
        if (result.failed) {
            this.setState({
                items:
                    <StatusBar
                        type="alert alert-warning mt-4 fade show"
                        show={true}
                        msg={result.error}
                    />
            })
        } else {
            this.setState({
                items:
                    <div className="row no-gutters" key="1">
                        <div className="col">
                            <FileCheck
                                size={24}
                                className="icon m-2"
                                onClick={this.clicked}
                            />
                        </div>
                    </div>
            })
        }
    }


    submit(e) {
        e.preventDefault();
        // temporary hack until we build the user admin interface
        var dummy_author = {
            "Name": "Moxsoar User Interface",
            "Email": "moxsoarui@localhost",
            "When": new Date().toISOString(),
        }
        var data = new FormData(e.target);
        var message = data.get("message");
        var m = new Moxsoar();
        m.SavePack(this.status, this.props.show, message, dummy_author)
    }
    clicked() {
        this.setState({
            items: [
                <form onSubmit={this.submit} key="1">
                    <div className="row no-gutters" key="1">
                        <div className="col">
                            <TextInput
                                displayName='Message'
                                fieldName='message'
                                outerClass="input-group"
                                displayNameWidth="w-30"
                            />
                        </div>
                        <div className="col-1">
                            <button type="submit" className="icon-button">
                                <ConfirmButton />
                            </button>
                        </div>
                    </div>
                </form>

            ]
        })
    }

    render() {
        if (this.props.show) {
            return (
                <div>
                    {this.state.items}
                </div>)
        }
        return (
            <div />
        )
    }
}

export class Main extends React.Component {
    /*
    Renders the content within the main container based on the page we're on
    */
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.page == 'pack') {
            return (
                <div className="h-100 justify-content-center align-items-center">

                    <div className="card main-box">

                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-light">{this.props.packName}</h1>
                        <PackDetails packName={this.props.packName} nav={this.props.nav} />
                    </div>
                </div>
            )
        } else if (this.props.page == 'integration') {
            //this.props.showEditorControlsCallback(true);

            return (
                <div className="h-100 justify-content-center align-items-center">

                    <div className="card main-box">

                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-light">{this.props.packName}</h1>
                        <IntegrationDetails
                            packName={this.props.packName}
                            integrationName={this.props.integrationName}
                            settings={this.props.settings}
                        />
                    </div>
                </div>
            )
        } else if (this.props.page == 'settings') {
            //this.props.showEditorControlsCallback(false);

            return (
                <div className="h-100 justify-content-center align-items-center">

                    <div className="card main-box">

                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-light">Settings</h1>
                        <Settings
                            username={this.props.username}
                            settings={this.props.settings}
                            globalStateCallback={this.props.globalStateCallback}
                        />
                    </div>
                </div>
            )

        } else {
            //this.props.showEditorControlsCallback(false);

            return (
                <div className="">
                    <div className="card main-box">

                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-light">Installed Content Packs</h1>
                        <PackList
                            nav={this.props.nav}
                        />
                    </div>
                </div>
            )
        }

    }
}
