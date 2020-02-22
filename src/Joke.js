import React, { Component } from 'react';
import './Joke.css';

export default class Joke extends Component {
  constructor(props) {
    super(props);
    this.state = {
      falling: false,
      climbing: false
    };
    this.downVoteThis = this.downVoteThis.bind(this);
    this.upVoteThis = this.upVoteThis.bind(this);
  }

  getColor() {
    if (this.props.votes >= 15) {
      return '#4CAF50';
    } else if (this.props.votes >= 12) {
      return '#8BC34A';
    } else if (this.props.votes >= 9) {
      return '#CDDC39';
    } else if (this.props.votes >= 6) {
      return '#FFEB3B';
    } else if (this.props.votes >= 3) {
      return '#FFC107';
    } else if (this.props.votes >= 0) {
      return '#FF9800';
    } else {
      return '#f44336';
    }
  }
  getEmoji() {
    if (this.props.votes >= 15) {
      return 'em em-rolling_on_the_floor_laughing size';
    } else if (this.props.votes >= 12) {
      return 'em em-laughing size ';
    } else if (this.props.votes >= 9) {
      return 'em em-smiley size';
    } else if (this.props.votes >= 6) {
      return 'em em-slightly_smiling_face size';
    } else if (this.props.votes >= 3) {
      return 'em em-neutral_face size';
    } else if (this.props.votes >= 0) {
      return 'em em-confused size';
    } else {
      return 'em em-angry size';
    }
  }

  downVoteThis() {
    this.setState({ falling: true });
    console.log(this.state.falling);
    setTimeout(() => {
      this.setState({ falling: false });
    }, 1000);
    this.props.downvote();
  }

  upVoteThis() {
    this.setState({ climbing: true });
    console.log(this.state.climbing);
    setTimeout(() => {
      this.setState({ climbing: false });
    }, 1000);
    this.props.upvote();
  }

  render() {
    return (
      <div
        className={`Joke 
        ${this.state.falling ? ' dropdown ' : ''}
        ${this.state.climbing ? ' dropup ' : ''} 
        `}
      >
        <div className="Joke-buttons">
          <i
            className="fas fa-arrow-up"
            // onClick={this.props.upvote}
            onClick={this.upVoteThis}
          />
          <span className="Joke-votes" style={{ borderColor: this.getColor() }}>
            {this.props.votes}
          </span>
          <i
            className="fas fa-arrow-down"
            // onClick={this.props.downvote}
            onClick={this.downVoteThis}
          />
        </div>
        <div className="Joke-text">{this.props.text}</div>
        <div className="Joke-smiley">
          <i
            className={this.getEmoji()}
            // style={{ minWidth: '30px !important', minHeight: '3em !important' }}
            // aria-role="presentation"
            aria-label="ROLLING ON THE FLOOR LAUGHING"
          ></i>
        </div>
      </div>
    );
  }
}
