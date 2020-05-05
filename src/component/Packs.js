import React from 'react';
import Moxsoar from '../api/moxsoar';
import logo from '../moxsoar_logo.svg';
import './Packs.css';


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
            
            p.push(<Pack nav={this.props.nav} key={index} pack={pack}/>);
            this.setState({packs: p});
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
        this.props.nav.nav("pack")(this.props.pack.Name)
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

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.packDetails = this.packDetails.bind(this);

        this.state = {
            currentView: 'packs'
        }

        var nav = new Navigation();
        nav.register('pack', this.packDetails)
        this.nav = nav;
    }

    packDetails(packName) {
        this.setState({currentView: "pack", packName: packName})
    }

    render() {
        if (this.state.currentView == 'pack') {
            return (
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="card main-box">
    
                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-muted">{this.state.packName}</h1>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="card main-box">
    
                        <img src={logo} height='50px' className="mt-4"></img>
                        <h1 className="header mt-2 text-center text-muted">Installed Content Packs</h1>
                        <PackList nav={this.nav}/>
                    </div>
                </div>
            )
        }

    }
}

class Navigation {
    constructor() {
        this.handlers = {};
    }
    register(viewName, f) {
        this.handlers[viewName] = f;
    }

    nav(viewName) {
        return this.handlers[viewName];
    }
}