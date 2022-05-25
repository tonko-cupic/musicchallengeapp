import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import { Link ,useParams } from 'react-router-dom'
import ReactAudioPlayer from 'react-audio-player';
import Waveform from './Waveform';
import { useNavigate } from 'react-router-dom';
export default function Challenge() {
    const [offset, setOffset] = useState({});
    const [user, setUser] = useState({});
    const [edit, setEdit] = useState({});
    const [inputs, setInputs] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();   
    const handleSubmit = async (event) => {
        event.preventDefault();

        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/set-link', {
                id : localStorage.getItem('userId'),
                link: inputs.link
                
              })
        
        setUser(values => ({...values, link: inputs.link}))
        setEdit(false);
    }




    useEffect(() => {
        async function fetchAPI(){
            let token = localStorage.getItem('token')
            console.log(id, 'iddd')
            axios.defaults.headers.common['Authorization'] = "token: "+token
            let response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user', {
                params: {
                  id: id
                }
              })
            setUser(response.data.user)
            setOffset(0)
        }
        fetchAPI()

        

    }, []);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
    const editLink = () => {
        setEdit(true);
    }
    const clickArrow = (flag) => {
        if (flag){
            setOffset(offset + 5)
        }else{
            setOffset(offset - 5)
        }
        
    }
    const openInbox = async(id) => {

        await axios.get(process.env.REACT_APP_BACKEND_URL + '/user', {
            params : {
                id : id
            }
        }).then( async (res)  => {
            let res1 = await axios.post(process.env.REACT_APP_BACKEND_URL + '/new-inbox', {
                user1: id,
                user2: localStorage.getItem('userId')
            })
            


        }).catch(err => {
            console.log(err)
        })











        navigate('/inbox/')
    }
    return(<div>
        <div style={{ backgroundColor : 'grey', float : 'top', height : '51px', marginBottom : '20px'}}>
        <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block'}}>Music challenge app</h1>
        <Link style={{borderRadius : '0px', marginTop : '8px', color : 'black', backgroundColor : 'grey', float :'right', marginRight : '100px'}} className="ui button" to="/">
                Back
            </Link>
            

        </div>
        { user._id == localStorage.getItem('userId') ?
        <h1 style={{paddingLeft : '20px'}}className="ui header">Your profile </h1>
          :
          <h1 style={{paddingLeft : '20px'}}className="ui header">
            Profile page for user {user.username}               <i onClick={() => openInbox(user._id)}style={{marginBottom :'5px', fontSize : '30px',cursor : 'pointer' }}class="envelope outline icon"></i> 
        </h1> }
        { edit == true ? 
                <form onSubmit={handleSubmit}>
                    <label>Soundcloud/ bandcamp link :</label>
                    <input type="text" name = "link" onChange={handleChange} value={inputs.link}></input>
                    <input style={{marginTop : '16px'}}className="ui button" type="submit" />
                </form>
        
            : 
            <div style={{paddingLeft : '20px'}}>Soundcloud/ bandcamp link : {user.link}
            
            { user._id == localStorage.getItem('userId') ?
            <i onClick={()=> editLink()}style={{ paddingLeft : '10px'}}class="edit icon"></i>
                : <div></div>
            }
            
            </div>
            
            }
        { user._id == localStorage.getItem('userId') ?

        <h4 style={{paddingLeft : '20px'}}>
            Song entries
        </h4> : <h4 style={{paddingLeft : '20px'}}>
        Song entries by the user
        </h4>}
        <table style={{paddingLeft : '20px'}} class="ui very basic collapsing celled table">
        <tbody>
            
            <tr>
                <td>
                    challenge
                </td>
                <td>
                    song
                </td>
            </tr>
            {user.entries ? user.entries.slice(offset,offset+ 5).map((entry,i) => {
                return <tr>
                    <td><Link style={{color: 'black'}}to={`/challenge/${entry.challenge._id}`}>
                        {entry.challenge.name}
                    </Link></td>
                    <td class="profile" style={{width : '500px'}}><Waveform id={i}url={entry.songURL}
                    /> </td>
                </tr>
            }) : <div></div>}
            { offset != 0 ? <i class="arrow left  icon"onClick={() => clickArrow(false)}></i> : ''}{ user.entries ? offset + 5 < user.entries.length ? <i class="arrow right icon" onClick={() => clickArrow(true)}></i> : '' : '' }
        </tbody>


        </table>

        <table style={{ float : 'right', position : 'absolute', top : '164px', right : '700px'}}class="ui very basic collapsing celled table">
        
        { user._id == localStorage.getItem('userId') ?
        <h4>Challenges</h4>
        : <h4>Challenges by the user</h4> }
        <tbody>
            
           
            {user.challenges ? user.challenges.map(entry => {
                return <tr>
                    <td><Link style={{color: 'black'}}to={`/challenge/${entry._id}`}>
                        {entry.name}
                    </Link></td>
                    
                </tr>
            }) : <div></div>}
        </tbody>


        </table>
        
        
        
    </div>)
}