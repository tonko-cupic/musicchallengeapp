import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
class Counter extends React.Component {
    state = {
      count: this.props.votes,
      hasVoted : false
    };
  
    async vote(id){
      let token = localStorage.getItem('token')
      axios.defaults.headers.common['Authorization'] = "token: "+token
        let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/vote', {
            id : id
        }).then(res => {
          this.setState(prev => ({ count: prev.count + 1 }));
          this.setState({ hasVoted : true})
          console.log(this.state.count)
        }).catch(err => {

        })
      

    };
  
    render() {
      console.log(this.props.hasVoted, this.state.hasVoted)
      return (
          <div style={{ paddingLeft : '10px'}}>
            {this.state.count}<i style={{ display : ((this.props.hasVoted || this.state.hasVoted )|| !(localStorage.getItem('isAuthenticated') == 'true')) ? 'none' : 'block-inline', cursor : 'pointer',fontSize: '2em', paddingLeft: '15px',position : 'relative', top : '4px'}} onClick={() => this.vote(this.props.id)} class="angle up icon"></i>
          </div>
        
      );
    }
  }

  export default Counter;