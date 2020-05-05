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
            
            p.push(<Pack key={index} pack={pack}/>);
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
    render() {
        var Comment = "MOXSOAR content repository."
        if (this.props.pack.Comment != "") {
            Comment = this.props.pack.Comment
        }        

        return (
            <button className="mb-2 btn btn-primary w-100 text-left">
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
    render() {
        return (
            <div className="row h-100 justify-content-center align-items-center">
                <div className="card main-box">

                    <img src={logo} height='50px' className="mt-4"></img>
                    <h1 className="header mt-2 text-center text-muted">Installed Content Packs</h1>
                    <PackList/>
                </div>
            </div>
        )
    }
}