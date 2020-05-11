import React from 'react';
import Moxsoar from '../api/moxsoar';
import ReactJson from 'react-json-view';
import XMLViewer from 'react-xml-viewer'

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

            output =  <div className="col json-cover mw-100 p-3 m-3">
                        <ReactJson src={j} theme="ashes"/>
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
        return(
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
            var method = <Method key={index} method={m}/>
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
        var m = <Methods route={j}/>

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


class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.routes = [];
        var index = 0;
        for (var route of this.props.routes) {
            this.routes.push(<Route rowId={index} key={index} route={route} packName={this.props.packName} integrationName={this.props.integrationName}/>);
            index++;
        }
    }

    render() {
        return (
            <div className="m-4">
                {this.routes}
            </div>
        )
    }
}

export default class IntegrationPage extends React.Component {

    constructor(props) {
        super(props);
        this.setDetails = this.setDetails.bind(this);
        this.state = {
            retrieved: false,
            integration: {}
        }
    }

    componentDidMount() {
        var m = new Moxsoar();
        m.GetIntegrationDetails(this, this.props.packName, this.props.integrationName);
    }

    setDetails(result) {
        this.setState({
            integration: result.json,
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
                <Routes routes={this.state.integration.Routes} packName={this.props.packName} integrationName={this.props.integrationName} />
            )
        }
    }
}