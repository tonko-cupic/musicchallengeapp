import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from "react-hook-form";
import SimpleReactValidator from 'simple-react-validator';
import FormData from 'form-data'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link ,useParams } from 'react-router-dom'
export default function Challenge() {
    const [inputs, setInputs] = useState({});
    const simpleValidator = useRef(new SimpleReactValidator({autoForceUpdate: this}))
    const [errMsg, setErrMsg] = useState();
    const [formData, setFormData] = useState(new FormData());
    const navigate = useNavigate();
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
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formValid = simpleValidator.current.allValid()
        if (!formValid) {
          simpleValidator.current.showMessages()
        }else{

            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token

            let photoURL;
            let response;
            if (!formData.entries().next().done){
                response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/upload', formData)
                photoURL = response.data.url
            }
            







            let data = { name : inputs.name, photoURL : photoURL, text: inputs.text }
            
            response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/challenge',data).then(response => {
                navigate('/')
            }).catch(error => {
                setErrMsg(error.response.data.message)
             })
            
        }
    }








    return (<div>
        <div style={{ backgroundColor : 'grey', float : 'top', height : '51px', marginBottom : '20px'}}>
        <h1 style={{position : 'relative', top : '8px', paddingLeft : '20px', display: 'inline-block'}}className="ui header">Add new challenge: </h1>
        <Link style={{borderRadius : '0px', marginTop : '8px', color : 'black', backgroundColor : 'grey', float :'right', marginRight : '100px'}}className="ui button" to="/">
                Back
            </Link>
        </div>
        
        <form className="ui form" style={{paddingLeft : '20px'}}onSubmit={handleSubmit} >
        <div className="fields" >
        <div className="field">
            <label>Name: </label>
            <input type="text" value={inputs.name || ""} 
            onChange={handleChange} name = "name" onBlur={simpleValidator.current.showMessageFor('name')}/>
            
            <div style={{color: 'red'}}>{simpleValidator.current.message('name', inputs.name, 'required')}</div>
             </div>
             <div className="field">
             <label>Text: </label>
             <textarea value={inputs.text || ""} 
                onChange={handleChange} name = "text" type="textarea" rows={2} cols={5} style={{width: '500px'}}/>
           
             </div>
            
        </div>
        <label >Add image of a challenge</label>
             <input style ={{border : 'none'}}
                    type="file"
                    accept="image/*"
                    id="contained-button-file"
                    onChange={(e) => onSelectImageHandler(e.target.files)}
            />
        <input style={{marginTop : '16px' }}className="ui button" type="submit" />
        </form>
        
        <div className="ui message" style={{ color: 'red', margin : '0px', display : errMsg ? 'block' : 'none'}}>
                        <i className="close icon"></i>
                        <div className="header">
                        </div>
                        <p>{errMsg}</p>
            </div>
    </div>)
}