import React, { Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

class PollAdmin extends Component {

    constructor(props){

      super(props);
      this.state = {
        polls: []
      }

      this.componentDidMount = this.componentDidMount.bind(this)
      this._getSuccess = this._getSuccess.bind(this)
      this.render = this.render.bind(this)
      this.eachPoll = this.eachPoll.bind(this)

      this.handleDestroy = this.handleDestroy.bind(this)
      this.handleShare = this.handleShare.bind(this)

    }

    componentDidMount() {
      var _this = this;

          var xhr = $.ajax({
            url: '/api/polls/admin',
            type: 'GET'
          })

          xhr.done(this._getSuccess)
            .fail(this._getError)
    }

    _getSuccess(resp) {
      // successfully pulled the record

      this.setState({
        polls: resp.polls
      })

    }

    _getError() {
      console.log("error fetching poll");
    }

    handleShare(event, id) {

      event.preventDefault();
      var path = location.protocol + '//' + location.host;
      var pollPath = path + "/poll/" + id;
      var tweet = "Checkout my new poll! " + pollPath;
      var href="https://twitter.com/home?status="+tweet;
      window.open(href);
    }

    handleDestroy(event, id) {

      event.preventDefault();
      console.log('A poll was asked to be removed: ' + id);

      return $.ajax({
        url: '/api/poll/destroy',
        type: 'DELETE',
        data: {
          _id: id
        }
      })

    }

    _destroySuccess() {
      // remove the poll from state and rerender
    }

    _destroyError() {

    }



    eachPoll (poll, i) {

      return (
        <div className="row" key={poll._id}>
          <div className="col-xs-10">
            <Link to={"/poll/" + poll._id} >
              <div className="btn btn-info btn-block">
                {poll.name}
              </div>
            </Link>
          </div>

          <div className="col-xs-1">
            <div className="btn btn-info" onClick={(e) => this.handleShare(e, poll._id)}>
              <i className="fa fa-share" ></i>
            </div>
          </div>

          <div className="col-xs-1">
            <div className="btn btn-danger" onClick={(e) => this.handleDestroy(e, poll._id)}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </div>
          </div>

        </div>
      )
    }

    render() {
      return (
        <div>
          {this.state.polls.map(this.eachPoll)}
        </div>
      );
    }
}

export default PollAdmin;
