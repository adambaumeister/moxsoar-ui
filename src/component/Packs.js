import React from 'react';
import Moxsoar from '../api/moxsoar';
import logo from '../moxsoar_logo.svg';
import './Packs.css';
import IntegrationDetails from './Integration';

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
    }

    onclick() {
        this.props.nav.setRoutePage(this.props.packName, this.props.integration.Name);
    }
    render() {
        return(
            <button onClick={this.onclick} className="mb-2 btn btn-primary w-100 text-left">
            <h4>
                {this.props.integration.Name}
            </h4>
            <h6 className="text-muted">
                {this.props.integration.Addr}
            </h6>
        </button>
        )
    }
}

class Running extends React.Component {
    render() {

        var ints = [];
        var index = 0;

        for (var integration of this.props.running) {
            ints.push(<Integration packName={this.props.packName} key={index} integration={integration} nav={this.props.nav}/>)
            index++;
        }
        return(
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

class PackDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            retrieved: false,
            runner: {}
        };
        this.setDetails = this.setDetails.bind(this);

    }

    componentDidMount() {

        var m = new Moxsoar();
        m.GetPackDetails(this, this.props.packName);
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
                    <h4 className="text-muted ml-4">Runner configuration</h4>
                    <RunnerTable runner={this.state.runner.Runner} />
                    <h4 className="text-muted ml-4">Running integrations</h4>
                    <Running packName={this.props.packName} running={this.state.runner.Running} nav={this.props.nav} />
                </div>
            )
        }

    }
}

class PackList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packs: []
        };
    }

    componentDidMount() {
        var m = new Moxsoar();
        m.GetPacks(this);
    }

    addPacks(result) {
        var index = 0;
        for (var pack of result.json["Packs"]) {
            var p = this.state.packs;

            p.push(<Pack nav={this.props.nav} key={index} pack={pack} />);
            this.setState({ packs: p });
            index++;
        }
    }

    render() {
        return (
            <div className="mt-3 ml-5 mr-5">
                {this.state.packs}
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

        this.onclick = this.onclick.bind(this);
    }

    onclick() {
        this.props.nav.setPackPage("pack", this.props.pack.Name)
    }

    render() {
        var Comment = "MOXSOAR content repository."
        if (this.props.pack.Comment != "") {
            Comment = this.props.pack.Comment
        }

        return (
            <button onClick={this.onclick} className="mb-2 btn btn-primary w-100 text-left">
                <h4>
                    {this.props.pack.Name}
                </h4>
                <h6 className="text-muted">
                    {Comment}
                </h6>
            </button>
        )
    }
}

export class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props.packName);
        if (this.props.page == 'pack') {
            return (
                <div className="row h-100 justify-content-center align-items-center">

                    <div className="card main-box">

                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-muted">{this.props.packName}</h1>
                        <PackDetails packName={this.props.packName} nav={this.props.nav}/>
                    </div>
                </div>
            )
        } else if(this.props.page == 'integration') {
            return (
                <div className="row h-100 justify-content-center align-items-center">

                <div className="card main-box">
    
                    <img src={logo} height='50px' className="mt-4"></img>
                    <h1 className="header mt-2 text-center text-muted">{this.props.packName}</h1>
                    <IntegrationDetails packName={this.props.packName} integrationName={this.props.integrationName}/>
                </div>
            </div>
            )
        } else {
            return (
                <div className="">
                    <div className="card main-box">

                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-muted">Installed Content Packs</h1>
                        <PackList nav={this.props.nav} />
                    </div>
                </div>
            )
        }

    }
}
