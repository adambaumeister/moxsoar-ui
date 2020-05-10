import React from 'react';
import Moxsoar from '../api/moxsoar';

class Method extends React.Component {
    
}

class Methods extends React.Component {
    render() {
        return (
            <div className="card mt-2 mb-2 p-3">
                <div className="row">
                    <div className="col">
                        <h5>
                            {this.props.route.Route.Path}
                        </h5>
                    </div>
                    <div className="col text-right">
                        <h5>
                            {this.props.route.Route.ResponseCode}
                        </h5>
                    </div>
                </div>
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