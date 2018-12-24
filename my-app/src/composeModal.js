import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {closeCompose, composeEmail} from "./redux/action";
import axios from "axios";

class ComposeModal extends Component {

    constructor(props) {
        super(props);
        // this.routeChange = this.routeChange.bind(this);
        this.state = {
          recipient: "",
          subject: "",
          msg: "",
        };
      }

 sendMail = e => {
     axios({
         method: "POST",
         url: "https://omail.herokuapp.com/send",
         data: {
         from: this.props.currentUser,
         to: this.state.recipient,
         subject: this.state.subject,
         msg: this.state.msg 
         }
     })
         .then(res => {
         this.props.closeCompose()
         if(!res.data)
         {
             alert("Fail to send mail, Username does not exist");
         }
         console.log(res.data);
         })
         .catch(e => {
         console.log(e);
         });
     };

    render(){
        return (<div id="compose-modal" className="modal">
                <header className="modal-header">
                    <span className="label">Compose Message</span>
                    <button href="close" className="ui black button" onClick = {() => this.props.closeCompose()}>
                        <i className="remove icon" />
                    </button>
                </header>
                <div className="modal-container">
                    <div className="ui form">
                        <div className="inline fields">
                            <label>From :</label>
                            <div>{this.props.currentUser}</div>
                        </div>
                        <div className="inline fields">
                            <label>To:</label>
                            <input value={this.state.recipient} onChange={e => this.setState({recipient: e.target.value})} ></input>
                        </div>
                        <div className="inline fields">
                            <label>Subject:</label>
                            <input value={this.state.subject} onChange={e => this.setState({subject: e.target.value})}></input>
                        </div>
                        <div className="ui divider"></div>
                        <div className="field">
                        <label>Compose Email:<textarea value={this.state.msg}
                            onChange={e => this.setState({msg: e.target.value})} /></label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">

                    <button type="button" className="ui primary button" role="button" onClick={this.sendMail}>Send</button>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state){
    return{
        composeEmail: state.mailEditReducer.composeEmail,
        currentUser: state.userReducer.email,
        reply: state.composeEmailReducer.reply

    };

}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({composeEmail: composeEmail, closeCompose: closeCompose}, dispatch)

}

export default connect(mapStateToProps, matchDispatchToProps)(ComposeModal);