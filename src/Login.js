import { useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMsg, seterrorMsg] = useState("")
  const navigate = useNavigate();   
  localStorage.setItem('isAuthenticated', false)
  const handlesubmit = async (e) => {
    e.preventDefault();

    let data = { email : email, password : password }
    let response = null;
    try{
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/sign-in',data)
    }catch(err){
        seterrorMsg(true)
    }
    if (response.status === 201){
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', response.data.role)
        localStorage.setItem('userId', response.data.userId)
        
        navigate('/');
        
        
    }
    if (response.status === 401) {
        seterrorMsg(true)
    }
  };
  return (
      <div >

      
    <h1 style={{width:' 100%',height: '100px',display: 'flex',justifyContent: 'center',alignItems: 'center'}}className="ui header">Music challenge app</h1>
    <div style={{paddingTop : '50px', height : '500px'}}className="ui middle aligned center aligned grid">
       
      <form className="ui large form" onSubmit={handlesubmit}>
          <div className="ui stacked segment">
            <div className="field">
            <label htmlFor="Email">Email</label>
            <input
                type="text"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="Input"
            />
            </div>
            <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
                
                type="Password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                
            />
            </div>
          </div>
        
        <button style={{marginLeft : '100px'}}className="ui button" type="submit">Log in</button>
        <div>
            <div className="ui message" style={{ color: 'red', margin : '0px', display : errorMsg ? 'block' : 'none'}}>
                            <i className="close icon"></i>
                            <div className="header">
                            </div>
                            <p>Wrong email or password</p>
                </div>
        </div>
      </form>
    </div>
    </div>
  );
};
export default Login;