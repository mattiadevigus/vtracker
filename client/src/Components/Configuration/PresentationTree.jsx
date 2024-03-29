import React, { Component } from 'react';
import { Link } from 'react-router-dom';


const styleBefore = {
    display: 'none'
}

let link = window.location.hostname;

class PresentationTree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: "",
        }
    }

    render() {
        return (
            <section id="presentationTree" style={styleBefore}>
                <div className="presentation-container w3-animate-right">
                    <img style={{ width: "20%" }} src="./images/v_icon.png" alt="" />
                    <h1>FINITO</h1>
                    <hr />
                    <h5>AVVIA IL VTRACKER</h5>
                    <hr />
                    <div className="button-container">
                        <Link to="/App" >
                            <button><i className="fas fa-arrow-right"></i></button>
                        </Link>
                    </div>
                    <div className="presentation-info">
                        <p>Potrai cambiare le impostazioni successivamente nell'apposita sezione</p>
                        <hr />
                        <p>Link da inviare ai piloti: <b>http://{link}/App </b></p>
                        <span style={{ color: "red", fontSize: "0.7rem" }}>Se il link contiene localhost, accedi al browser utilizzando l'ip del server</span>
                        <hr />
                    </div>
                </div>
            </section>
        )
    }

}

export default PresentationTree;