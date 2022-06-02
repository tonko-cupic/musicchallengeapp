import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './styles.css'
import axios from 'axios'
class Waveform extends Component {  
  state = {
    playing: false,
    current : 0,
    hasStarted : false
  };

  componentDidMount() {
    const track = document.querySelector(`#track${this.props.id}`);

    this.waveform = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: `#waveform${this.props.id}`,
      backend: 'WebAudio',
      height: 45,
      progressColor: '#2D5BFF',
      responsive: true,
      fillParent: true,
      minPxPerSec : 5,
      waveColor: '#EFEFEF',
      cursorColor: 'transparent',
    });

    this.waveform.on('audioprocess', () => {      
        this.setState({current :this.waveform.getCurrentTime()})
    });
    this.waveform.load(track);
  };
  async componentWillUnmount(){
    this.waveform.playPause();
  }
  handlePlay = async () => {
    if (!this.state.hasStarted){
      this.setState({ hasStarted : true})
      let token = localStorage.getItem('token')
      axios.defaults.headers.common['Authorization'] = "token: "+token

          
      let response;
      
      response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/play-song', {
          url : this.props.url
      })








    }
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };
  
  render() {
    const url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3';

    return (
      <div style={{height : '50px'}} >
        <button id="wavebtn" onClick={this.handlePlay} >
          {!this.state.playing ? '►' : '❚❚'}
        </button>
        <div style={{width : '400px'}}>
        <div class="waveform "id={`waveform${this.props.id}`} />
        </div>

        <div style={{ position : 'relative', top : '-45px', left :'450px'}}>►{this.props.plays}</div>
        <audio id={`track${this.props.id}`} src={this.props.url} />
        { this.state.hasStarted ? <div style={{ width : '30px',zIndex : '30', position : 'relative', left : '450px', top : '-88px'}}>{Math.floor(this.state.current / 60) + ':' + ('0'+Math.floor(this.state.current % 60)).slice(-2)}</div> : ''}
        
      </div>
    );
  }
};

export default Waveform;