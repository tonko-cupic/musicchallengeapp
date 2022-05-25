import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import { Link ,useParams } from 'react-router-dom'
import ReactAudioPlayer from 'react-audio-player';
import Counter from './Counter'
import FormData from 'form-data'
import Waveform from './Waveform';
import { createBrowserHistory } from 'history'
export default function Challenge() {
    const { id } = useParams();
    const [challenge, setChallenge] = useState({});
    const [comment, setComment] = useState({});
    const [formData, setFormData] = useState(new FormData());

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setComment({ text : value})
      }
    const handleSubmit = async (event) => {
        event.preventDefault();

        
        

            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token

           
            let response;
            
            response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/comment', {
                comment : comment.text,
                id : challenge.id
            })
            let com = []
            for (let i = 0 ; i< challenge.comments.length; i++){
                com.push(challenge.comments[i])
            }
            com.push(response.data.comment)
            setChallenge(values => ({...values, comments: com}))
            //setChallenge({ comments : com})
            setComment({ text : ''})

        
            
    }








    useEffect(() => {
        console.log(localStorage.getItem('role'),'role')
        async function fetchAPI(){
            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token
            let response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenge', {
                params: {
                  id: id
                }
              })
            setChallenge({ comments : response.data.challenge.comments, user : response.data.challenge.user, text : response.data.challenge.text, id : response.data.challenge._id, name : response.data.challenge.name, photoURL : response.data.challenge.photoURL, entries: response.data.challenge.entries})
            console.log(response.data.challenge, 'sda')
            console.log(localStorage.getItem('userId'), 'id')
            
        }
        
        fetchAPI()

        

    }, []);
    const deleteComment = async (time) => {
        let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token
            let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-comment', {
                time: time,
                id : challenge.id
                
              })
              let com = []
              for (let i = 0 ; i< challenge.comments.length; i++){
                  if (challenge.comments[i].time != time){
                    com.push(challenge.comments[i])
                  }
                  
              }
              console.log(com)
              setChallenge(values => ({...values, comments: com}))

    }
    const onSelectImageHandler = (files) => {
        const file = files[0];
        var formData = new FormData();
        formData.append('file', file)
    
        setFormData(formData)
        const config = {
            headers: {
                "Content-Type":"multipart/form-data" 
            }
        };
    }
    const deleteSong = async (id) => {
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token

           
        let response;
        
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-song', {
            id : id
        })
        let entries = []
        for (let i = 0 ; i< challenge.entries.length; i++){
            if (challenge.entries[i]._id != id){
                entries.push(challenge.entries[i])
            }
            
        }
        console.log(entries)
        setChallenge(values => ({...values, entries: entries}))




    }
    const deleteChallenge = async (id) => {
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
           
        let response;
        
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-challenge', {
            id : challenge.id
        })
        
        let his = createBrowserHistory();
        his.push('/');
        window.location.reload();



    }
    const submitSong = async () => {
        axios.defaults.headers.common['Content-Type'] ="multipart/form-data"
        let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token
        let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/upload', formData)
        let songURL = response.data.url

        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/entry', {
            challenge : challenge.id,
            songURL : songURL
        })
        window.location.reload();

    }
    
    return (<div>
        <div style={{ backgroundColor : 'grey', float : 'top', height : '51px'}}>
            
            <h1 style={{position : 'relative', top : '8px', paddingLeft : '20px', display: 'inline-block'}}className="ui header">{challenge.name} </h1>
            
            <div style={{paddingLeft : '20px', display: 'inline', position : 'relative', top : '6px'}}>By: 
            {challenge.user ? <Link style={{color : 'black', fontWeight: 'bold'}} to={`/profile/${challenge.user._id}`}>
                    {challenge.user ? ' '+challenge.user.username : ''}
                </Link> : <div></div>}
                
            </div>
            
        
            {localStorage.isAuthenticated == 'true' ? <div style={{ width : '300px', display: 'inline-block', float : 'right', marginRight : '50px'}}>
            <Link style={{borderRadius : '0px', marginTop : '8px', color : 'black', backgroundColor : 'grey'}} className="ui button" to="/">
                Back
            </Link>
            
            {
                challenge.user ? (challenge.user._id == localStorage.getItem('userId') || localStorage.getItem('role') == 'admin')?
                <button style={{borderRadius : '0px', marginTop : '8px', color : 'black', backgroundColor : 'grey'}}className="ui button" onClick={() => {if(window.confirm('Are you sure to delete this challenge?')){deleteChallenge(challenge.id)}}}>Delete challenge</button>
                : <div></div> : <div></div>
                
            }
           
            </div>
                 : 
            <div style={{ width : '700px', display: 'inline', float : 'right', paddingLeft: '400px', marginRight : '0px', marginTop : '10px'}}>
                <Link style={{borderRadius : '0px', marginTop : '0px', color : 'black', backgroundColor : 'grey'}} className="ui button" to="/login">
                            Login
                </Link>
                <Link style={{borderRadius : '0px', marginTop : '0px', color : 'black', backgroundColor : 'grey'}} className="ui button" to="/signup">
                            Sign up
                </Link>
                <Link style={{borderRadius : '0px', marginTop : '0px', color : 'black', backgroundColor : 'grey'}} className="ui button" to="/">
                Back
            </Link>
            </div>}
            </div>
        
            
        { challenge.photoURL ? 
        <div style={{height : '600px', float: 'left', paddingTop : '10px'}}>
            <div style={{float : 'left', height : '600px' , display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
            <img style={{paddingLeft : '20px', maxHeight : '600px', width : 'auto', maxWidth : '650px', height : 'auto'}} src={challenge.photoURL}/>
            
            </div>
            { challenge.text ? <div style={{top : '0px', left : '0px',position : 'relative',paddingLeft : '20px', height : 'auto', width : 'auto', float : 'bottom ', display: 'block'}}> {challenge.text}
        
        
            </div> : <div></div>} 
            </div>
        
        :
        
        <div style={{ float : 'left', paddingLeft : '20px',position : 'relative', top : '70px', maxHeight : '400px', width : 'auto', maxWidth : '400px', height : 'auto'}}> {challenge.text}
        
        
        </div>}
        
        
        
        
        <div style={{float : 'right', paddingRight : '50px', paddingTop: '70px'}}>
        <table class="ui very basic collapsing celled table">
        <thead>
            <tr><th>User</th>
            <th>Song</th>
            <th>Votes</th>
        </tr></thead>
        <tbody>
        {challenge.entries ? challenge.entries.map((entry, i) => {
                return (<tr>
                    <td style={{ height : '50px'}}>
                    <Link style={{color : 'black', fontWeight: 'bold'}} to={`/profile/${entry.user._id}`}>
                        {entry.user ? ' '+entry.user.username : ''}
                </Link>
                    </td>
                    <td style={{width : '500px', height : '50px', marginRight : '20px'}}>
                     <Waveform plays={entry.plays} id={i}url={entry.songURL}
                    /> <span style={{width : '20px', height : '50px'}}></span>
                    </td>
                    <td style={{ height : '50px'}}>
                        <Counter votes={entry.votes} hasVoted={entry.voted.includes(localStorage.getItem('userId'))} id={entry._id}/>
                    </td>
                    { (entry.user._id === localStorage.getItem('userId')|| localStorage.getItem('role') == 'admin') ? 
                    
                    <button onClick={() => {if(window.confirm('Are you sure to delete this record?')){deleteSong(entry._id)}}} style={{ position : 'relative' ,left : '20px', top : '24px', fontSize : '10px', height : '25px', width : '60px'}}class="ui button">Delete</button> :
                    <div></div>
                }
                    
                </tr>)
            }) : <div>No song entries!</div>}
        </tbody>
        { challenge.entries && challenge.entries.length == 0 ? <div>No song entries!</div> : <div></div>}

        </table>
            { localStorage.getItem('isAuthenticated') === 'true' ? <div style={{float : 'bottom', paddingRight : '200px'}}>
            <h4>Add your song</h4>
            <input
                    type="file"
                    accept="audio/*"
                    id="contained-button-file"
                    onChange={(e) => onSelectImageHandler(e.target.files)}
            />
            <button style={{paddingLeft : '20px'}} className="ui button" onClick={() => submitSong()} >
            Send
            </button>
            </div> : <div></div>}
            
            
            <div style={{paddingTop : '50px', width : '400px'}}class="ui comments">
                <h3 class="ui dividing header">Comments</h3>
                {challenge.comments ? challenge.comments.map(comment => {
                    return <div class="comment">
                            <div class="content">
                            <Link style={{color : 'black', fontWeight: 'bold'}} class="author" to={`/profile/${comment.user._id}`}>
                                    {comment.user.username}
                                </Link>
                                <div class="metadata">
                                    <span class="date">{comment.time.replace('T', ' ').substring(0, comment.time.length - 5)}</span>
                                </div>
                                {((localStorage.getItem('userId') === comment.user._id) || localStorage.getItem('role') == 'admin') ? <i style={{cursor: 'pointer'}}onClick={() => deleteComment(comment.time)} class="trash icon"></i> : <div></div>}
                                <div class="text">
                                    {comment.comment}
                                </div>
                            </div>
                        </div>
                }) : <div></div>}
            </div>
            <form style={{ width : '400px'}}class="ui reply form" onSubmit={handleSubmit}>
                <div class="field">

                
                </div>
                {localStorage.isAuthenticated == 'true' ? 
                <div>
                    <textarea name="comment" value={comment.text || ""} 
                    onChange={handleChange}></textarea>
                    <button type="submit" class="ui blue labeled submit icon button">
                        <i class="icon edit"></i> Add Comment
                    </button>
                </div>
                 : <div></div>}
            </form>
        </div>
        
        
       
    </div>)
       
        
}
