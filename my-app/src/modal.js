import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectEmail} from "./redux/action";

import axios from 'axios' 

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            from: this.props.currentEmail.Sender,
            to: this.props.currentUser,
            subject: this.props.currentEmail.Subject,
            msg: ""
        };
    }




    sendMail = e => {
        axios({
          method: "POST",
          url: "https://omail.herokuapp.com/send",
          data: {
            from: this.props.currentUser,
            to: this.props.currentEmail.Sender,
            subject: "RE: " + this.props.currentEmail.Subject,
            msg: this.state.msg 
          }
        })
          .then(res => {
            this.props.selectEmail("")
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
        return (<div className="modal">
                <header className="modal-header">
                    <span className="label">Read Message</span>
                    <button href="close" className="ui black button" onClick = {() =>  this.props.selectEmail("")}>
                        <i className="remove icon" />
                    </button>
                </header>
                <div className="modal-container">
                    <div className="ui form">
                        <div className="inline fields">
                            <label>From :</label>
                            <div>{this.props.currentEmail.Sender}</div>
                        </div>
                        <div className="ui divider"></div>
                        <div className="inline fields">
                            <label>Subject:</label>
                            <div>{this.props.currentEmail.Subject}</div>
                        </div>
                        <div className="ui divider"></div>
                        <div className="field">
                            <p>{this.props.currentEmail.MailBody}</p>
                        </div>
                        <div className="field">
                            <label>Type Reply Here:<textarea value={this.state.msg}
                            onChange={e => this.setState({msg: e.target.value})} /></label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">

                    <button type="button" className="ui primary button" role="button" onClick={this.sendMail}>
                    Reply</button>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state){
    return{
        mail : state.EmailList,
        currentEmail: state.mailEditReducer.currentEmail,
        currentUser: state.userReducer.email
    };

}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({selectEmail: selectEmail}, dispatch)

}

export default connect(mapStateToProps, matchDispatchToProps)(Modal);