import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import $ from 'jquery';
import axios from 'axios';


class New extends React.Component {
  /*
    form to submit a new poll
  */

  constructor(props) {
    super(props);

    this.state = {
      pollName: '',
      flashes: [],
    };

    // methods that need access this `this`
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.eachFlash = this.eachFlash.bind(this);
    this._onSuccess = this._onSuccess.bind(this);
    this._onError = this._onError.bind(this);
  }

  handleChange(event) {
    // handle changing state of fields

    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  _create() {
    // submit the form data
    return $.ajax({
      url: '/api/polls',
      type: 'POST',
      data: {
        name: this.state.pollName,
        options: this.state.pollOptions,
      },
      beforeSend: function() {
        this.setState({loading: true});
      }.bind(this),

    });
  }

  _onSuccess(resp) {
    // after succssful creation

    if (resp.data.success) {
      // redirect to poll page
      const path = `poll/${resp.data.id}`;
      hashHistory.push(path);
    } else {
        // TODO: redirect to login
    }
  }

  _onError(resp) {
    // if the server returned an error

    let newFlashes = this.state.flashes;

    if (resp.data && resp.data.msg ) {
      newFlashes.push({msg: resp.data.msg, success: false});
    } else {
      newFlashes.push({msg: 'Oops something went wrong!', success: false});
    }
    this.setState({
      flashes: newFlashes,
    });
  }

  handleSubmit(event) {
    // handle submition of form
    event.preventDefault();
    let formData = {
      pollName: this.state.pollName,
    };

    axios.post('/api/polls', {
      name: this.state.pollName,
      options: this.state.pollOptions,
    })
      .then(this._onSuccess)
      .catch(this._onError);
  }

  eachFlash(flash, i) {
    // display each flash message

    return (
      <div
        className={'alert alert-' + (flash.success ? 'success' : 'danger') + ' alert-dismissable' }
        key={i}
      >
          <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
          {flash.msg}
      </div>

    );
  }

  render() {
    return (

      <div>
        <h1> Create a new poll </h1>
        <div className="flashes"> {this.state.flashes.map(this.eachFlash)} </div>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-2 col-form-label form-text">Poll Name</label>
            <div className="col-10">
              <input
                className="form-control"
                ref="pollName"
                name="pollName"
                type="text"
                value={this.state.pollName}
                onChange={this.handleChange}
              />
            </div>
          </div>


          <div className="form-group row">
            <label className="form-text">Options (One choice per line)</label>
            <textarea
              className="form-control"
              rows="3"
              type="text"
              ref="pollOptions"
              name="pollOptions"
              value={this.state.pollOptions}
              onChange={this.handleChange}
            >

            </textarea>
          </div>


          <input className="btn btn-info" type="submit" value="Submit" />
        </form>
      </div>

    );
  }

}

export default New;
