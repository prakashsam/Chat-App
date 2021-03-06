import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { array, string, func, number } from 'prop-types';
import moment from 'moment';

import { postNewMessageToServer, addNewMessageForChatroom, addNewMessage, ADD_NEW_MESSAGE, addNewImageForChatroom } from './ChatActionCreators';
import { getAllMessages, getMessagesChatroomName } from './ChatReducer';
import { getUserId, getUsername } from '../Login/LoginReducer';

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' }
  }

  componentDidUpdate(prevProps) {
    if (this.props.messages.length > prevProps.messages.length) {
      this.chatBottomRef.scrollIntoView();
    }
  }

  handleChange = (evt) => {
    this.setState({ message: evt.target.value });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const { userId, chatroomId, addNewMessageForChatroom, username } = this.props;
    const content = evt.target.message.value;
    if (content.trim().length > 0) {
      addNewMessageForChatroom({ content, userId, chatroomId });
      this.setState({ message: '' });
    }
  }

  onAddFile = (evt) => {
    const { userId, chatroomId, addNewMessageForChatroom, username } = this.props;
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      this.props.addNewImageForChatroom({
        content: reader.result,
        user: {
          userId,
          username,
        },
        chatroomId,
      });
    }, false);

    reader.readAsDataURL(file);
    evt.target.value = null;
    this.setState({ message: '' });
  }

  isPreviousUser = (messages, currentMessage, idx) => {
    return idx > 0 && currentMessage.user.username === messages[idx - 1].user.username
  }

  parseDate = (date) => {
    return moment.utc(date).format('LT');
  }

  render() {
    const { messages, chatroomId, userId, chatroomName } = this.props
    return (
      <div className="container-chatbox">
        <div>
          <h2 className="chatroom-title">{`#${chatroomName}`}</h2>
          <hr />
        </div>
        <div className="container-chat-history">
          {messages.map((message, idx) => (
            <div className="message-content-container" ref={(ref) => {
              if (idx === messages.length - 1) {this.chatBottomRef = ref;}}} key={`${message.user.userId}-${chatroomId}-${idx}`}>
              {!this.isPreviousUser(messages, message, idx) ?
                <div className="message-content-item-image">
                  <img className="message-user-image" src={message.user.avatar}/>
                </div> : <div className="message-content-no-image">{this.parseDate(message.createdAt)}</div>}
              <div className="message-content-item-text">
                {!this.isPreviousUser(messages, message, idx) &&
                  <div className="message-content-header">
                    <div className="message-username">{message.user.username}</div>
                    <div className="message-time-stamp">{this.parseDate(message.createdAt)}</div>
                  </div>}
                {message.type === 'img' && <img src={message.content}/>}
                {message.type === 'message' && <div className="chat-message">{message.content}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="container-message-form">
          <input type="file" ref="upload" name="file" onChange={this.onAddFile} />
          <form className="message-form" onSubmit={this.onSubmit}>
            <input className="message-text-area" onChange={this.handleChange} value={this.state.message} name="message" placeholder={`Message #${chatroomName}`}/>
           </form>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  messages: array.isRequired,
  chatroomName: string,
  chatroomId: string.isRequired,
  userId: number.isRequired,
  username: string.isRequired,
  addNewMessageForChatroom: func.isRequired,
  addNewImageForChatroom: func.isRequired,
};

const mapStateToProps = (state, { params }) => ({
  messages: getAllMessages(state),
  chatroomName: getMessagesChatroomName(state),
  chatroomId: params.chatroomId,
  userId: getUserId(state),
  username: getUsername(state),
});

const mapDispatchToProps = { addNewMessageForChatroom, addNewImageForChatroom };

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

