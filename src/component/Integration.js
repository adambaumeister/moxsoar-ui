import React from 'react';
import Moxsoar from '../api/moxsoar';
import ReactJson from 'react-json-view';
import XMLViewer from 'react-xml-viewer';
import { RadioButtons, TextInput, TextAreaInput, StatusBar, SelectInput, ToggleButton } from './Core'

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-github";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';


import './core.css';

function getFileType(fileName) {
    var res = fileName.split(".");
    return res[1];
}


class Method extends React.Component {
    render() {
        var res = getFileType(this.props.method.ResponseFile);

        var output;
        if (res == "json") {
            var j = JSON.parse(this.props.method.ResponseString);

            output = <div className="col m-3">
                <JSONInput
                    locale={locale}
                    height='550px'
                    width='100%'
                    placeholder={j}
                    viewOnly='true'
                    style={{
                        outerBox: {
                            border: '1px solid black',
                            borderRadius: '5px'
                        }
                    }}

                />
            </div>
        } else if (res == "xml") {
            output = <div className="colmw-100 p-3 m-3">
                <XMLViewer xml={this.props.method.ResponseString} />
            </div>
        } else {
            output = <div className="colmw-100 p-3 m-3">
                {this.props.method.ResponseString}
            </div>
        }
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h5>
                            {this.props.method.HttpMethod}
                        </h5>
                    </div>
                    <div className="col text-right">
                        <h5>
                            {this.props.method.ResponseCode}
                        </h5>
                    </div>

                </div>
                <div className="row">
                    {output}
                </div>
            </div>
        )
    }
}

class Methods extends React.Component {
    render() {
        var methods = [];

        var index = 0;
        for (var m of this.props.route.Route.Methods) {
            var method = <Method key={index} method={m} />
            methods.push(method);
            index++;
        }

        return (
            <div className="card mt-2 mb-2 p-3">
                <h4 className="text-muted">Methods</h4>
                {methods}
            </div>
        )

    }
}

class Route extends React.Component {
    constructor(props) {
        super(props);
        this.displayMethod = this.displayMethod.bind(this);

        this.state = ({
            methodDisplay: <div></div>,
            methodDisplayed: false
        })

    }

    displayMethod() {
        var mapi = new Moxsoar();
        if (this.state.methodDisplayed) {
            this.setState({
                methodDisplay: <div></div>,
                methodDisplayed: false

            })
        } else {
            mapi.GetRouteDetails(this, this.props.packName, this.props.integrationName, this.props.rowId)
        }

    }

    setDetails(result) {
        var j = result.json;
        var m = <Methods route={j} />

        this.setState({
            methodDisplay: m,
            methodDisplayed: true
        })
    }

    render() {
        var methods = "GET";
        if (this.props.route.Methods) {
            methods = this.props.route.Methods.length + " methods";
        }
        return (
            <div>
                <button onClick={this.displayMethod} data-toggle="collapse" className="mb-2 btn btn-primary w-100 text-left">
                    <div className="row">
                        <div className="col">
                            <h4>{this.props.route.Path}</h4>
                        </div>
                        <div className="col text-right">
                            <h4 className="text-muted">
                                {methods}
                            </h4>
                        </div>
                    </div>

                </button>
                {this.state.methodDisplay}
            </div>

        )
    }
}

class AddRouteForm extends React.Component {

    constructor(props) {
        super(props);

        this.parsePathInput = this.parsePathInput.bind(this);
        this.submit = this.submit.bind(this);
        this.updateResponseString = this.updateResponseString.bind(this);
        this.updateResponseStringAce = this.updateResponseStringAce.bind(this);

        this.changeInputType = this.changeInputType.bind(this);

        this.state = ({
            pathInputClass: "",
            responsestring: "",
            inputType: "JSON",
            responseInput: <JSONInput
                id='add_route_editor'
                locale={locale}
                height='550px'
                width='100%'
                style={{
                    outerBox: {
                        border: '1px solid black',
                        borderRadius: '5px'
                    }
                }}
                onChange={this.updateResponseString}
            />
        })

    }


    parsePathInput(value) {
        var pattern = new RegExp('^/.*');
        if (pattern.test(value)) {
            this.setState({ pathInputClass: "bg-success" });
        } else {
            this.setState({ pathInputClass: "bg-warn" });

        }
    }

    changeInputType(type) {
        var rb;
        if (type === "JSON") {
            rb = <JSONInput
                id='add_route_editor'
                locale={locale}
                height='550px'
                width='100%'
                style={{
                    outerBox: {
                        border: '1px solid black',
                        borderRadius: '5px'
                    }
                }}
                onChange={this.updateResponseString}
            />
        } else {
            //rb = <input name="responsestringText" className="w-100" style={{ height: 550 }} />
            rb = <AceEditor
                mode="xml"
                theme="github"
                name="UNIQUE_ID_OF_DIV"
                onChange={this.updateResponseStringAce}

                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    useWorker: false
                }}
            />
        }


        this.setState({
            inputType: type,
            responseInput: rb
        })
    }

    submit(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var m = new Moxsoar();
        var r = {};
        r.path = data.get("path");
        r.responsecode = parseInt(data.get("responsecode"));
        r.filename = data.get("filename");
        r.method = data.get("method");
        r.responsestring = data.get("responsestring");

        m.AddRoute(this.props.statuscb, this.props.packName, this.props.integrationName, r);

    }

    updateResponseStringAce(obj) {
        this.setState({ responsestring: obj });
    }

    updateResponseString(obj) {
        this.setState({ responsestring: obj.plainText });
    }

    render() {
        var codes = [
            200,
            404,
            500
        ];

        var methods = [
            "GET",
            "POST",
            "PUT",
            "HEAD",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ];

        const types = [
            "JSON",
            "Text"
        ]

        return (
            <form onSubmit={this.submit}>
                <div className="row text-center">
                    <div className="col">
                        <h3 className="text-light m-3">New Response</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <SelectInput name="method" options={methods} />
                    </div>
                    <div className="col">
                        <TextInput onchange={this.parsePathInput} inputclass={this.state.pathInputClass} displayName='Path' fieldName='path' />
                    </div>
                    <div className="col">
                        <TextInput displayName='File name' fieldName='filename' />
                    </div>
                    <div className="col-2">
                        <SelectInput name="responsecode" options={codes} />
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <RadioButtons active="JSON" options={types} callback={this.changeInputType} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col">
                        {this.state.responseInput}
                    </div>
                    <input type="hidden" name="responsestring" value={this.state.responsestring} />
                </div>
                <div className="row mb-2">
                    <div className="col text-center">
                        <button type="submit" className="btn btn-secondary text-light ">
                            Add
                    </button>
                    </div>
                </div>
            </form>
        )
    }
}

class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.routes = [];
        var index = 0;
        this.state = ({
            form: <div></div>,
            addFormOpen: false,
            statusShow: false,
            statusBar: "",
            statusMsg: "",
            routes: []
        })

        this.addRoute = this.addRoute.bind(this);
        this.status = this.status.bind(this);
        this.setDetails = this.setDetails.bind(this);
        this.getRoutes = this.getRoutes.bind(this);

    }

    componentDidMount() {
        this.getRoutes();
    }

    getRoutes() {
        var m = new Moxsoar();
        m.GetIntegrationDetails(this, this.props.packName, this.props.integrationName);
    }

    setDetails(result) {
        var routesFromJson = [];
        var index = 0;
        for (var route of result.json.Routes) {
            routesFromJson.push(<Route rowId={index} key={index} route={route} packName={this.props.packName} integrationName={this.props.integrationName} />);
            index++;
        }

        this.setState({
            integration: result.json,
            retrieved: true,
            routes: routesFromJson
        })
    }


    addRoute() {
        if (!this.state.addFormOpen) {
            this.setState({
                form: <AddRouteForm
                    packName={this.props.packName}
                    integrationName={this.props.integrationName}
                    statuscb={this.status}
                />,
                addFormOpen: true
            });
        } else {
            this.setState({
                form: <div />,
                addFormOpen: false
            })
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
                    msg="Route Added!"
                />
            })
            this.getRoutes();
        }
    }

    render() {
        return (
            <div className="m-4">
                {this.state.statusBar}
                <ToggleButton callback={this.addRoute} />
                {this.state.form}
                {this.state.routes}
            </div>
        )
    }
}

export default class IntegrationPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Routes
                packName={this.props.packName}
                integrationName={this.props.integrationName}
            />
        )
    }
}