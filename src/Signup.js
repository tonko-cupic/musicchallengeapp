import { useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, seterrorMsg] = useState("")
  const navigate = useNavigate();   
  localStorage.setItem('isAuthenticated', false)
  const handlesubmit = async (e) => {
    e.preventDefault();

    let data = { email : email, password : password, username : username }
    let response = null;
    
    response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/sign-up',data).then(res => {
        
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        console.log(res.data.token)
        window.alert("Thanks for signing up!");
        navigate('/');
    }).catch(err => {
        console.log(err)
        seterrorMsg(true)
    })
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
            <div className="field">
            <label htmlFor="username">username</label>
            <input
                type="text"
                placeholder="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
        
        <button style={{marginLeft : '100px'}}className="ui button" type="submit">Sign up</button>
        <div>
            <div className="ui message" style={{ color: 'red', margin : '0px', display : errorMsg ? 'block' : 'none'}}>
                            <i className="close icon"></i>
                            <div className="header">
                            </div>
                            <p>email already exists!</p>
                </div>
        </div>
      </form>
    </div>
    </div>
  );
};
export default Signup;