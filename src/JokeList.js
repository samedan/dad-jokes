import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import Joke from './Joke';
import uuid from 'uuid/v4';

export default class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      // get the jokes from localStorage, if not there load new jokes
      jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
      loading: false
    };

    // check for duplicate jokes
    this.seenjokes = new Set(this.state.jokes.map(j => j.text));
    console.log(this.seenjokes);
    this.handleClick = this.handleClick.bind(this);
    this.deleteJokes = this.deleteJokes.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) {
      // this.getJokes();
      this.handleClick();
    }
  }

  async getJokes() {
    try {
      // Load Jokes
      let newJokes = [];
      while (newJokes.length < this.props.numJokesToGet) {
        let res = await axios.get('https://icanhazdadjoke.com/', {
          headers: { Accept: 'application/json' }
        });
        let newJoke = res.data.joke;
        if (!this.seenjokes.has(newJoke)) {
          newJokes.push({ id: uuid(), text: newJoke, votes: 0 });
        } else {
          console.log('Duplicate: ');
          console.log(newJoke);
        }
      }

      this.setState(
        oldState => ({
          loading: false,
          jokes: [...oldState.jokes, ...newJokes]
        }),
        () =>
          window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
      );
    } catch (error) {
      alert(error);
      this.setState({ loading: false });
    }
  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        )
      }),
      // after setState finishes
      () =>
        window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    this.setState(
      { loading: true },
      // after setting state
      this.getJokes
    );
  }
  deleteJokes() {
    this.setState({
      jokes: []
    });
    window.localStorage.clear();
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      );
    }

    let jokesSorted = this.state.jokes.sort((a, b) => b.votes - a.votes);

    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            alt="icons"
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            New jokes
          </button>
          <button
            className="JokeList-delete dropdown"
            onClick={this.deleteJokes}
          >
            Delete jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {jokesSorted.map(j => (
            <Joke
              key={j.id}
              votes={j.votes}
              text={j.text}
              upvote={() => this.handleVote(j.id, 1)}
              downvote={() => this.handleVote(j.id, -1)}
            />
          ))}
        </div>{' '}
      </div>
    );
  }
}
