import React from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { createBrowserHistory } from 'history'
class UserScreen extends React.Component {
    
   
    constructor(props){
        super(props);
        this.state = {
            challenges : [],
            challengesSearch : [], 
            pages : [],
            unreadMessages : 0,
            sorts : ['Date (newest)', 'Date (oldest)', 'Number of entries high', 'Number of entries low'],
            filter : null,
            sort : null,
            input : '',
            currentPage : 1
         };

         this.setSort = this.setSort.bind(this);
         this.onChangeRadio = this.onChangeRadio.bind(this);
    }
    clickChallenge(id) {
        let his = createBrowserHistory();
        his.push('/challenge/'+id);
        window.location.reload();
    }
    async setSort(sort){
        let sortVal = '1'
        
        if (sort == 'Date (oldest)'){
            this.setState({ sort : '2'})
            sortVal = '2'
        }
        else if (sort == 'Number of entries high'){
            this.setState({ sort : '3'})
            sortVal = '3'
        }
        else if (sort == 'Number of entries low'){
            this.setState({ sort : '4'})
            sortVal = '4'
        }else{
            this.setState({ sort : '1'})
        }

        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        console.log('yeah', this.state.filter, sortVal)
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params : {
                filter : this.state.filter,
                sort : sortVal
            }
        }).then(res => {
            this.setState({ challenges : res.data.challenges})
            console.log(res.data.pages)
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
                console.log('da')
            }
            console.log(pages)
            this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })

        




    }
    handleCategoryChange = (sort) => {
        this.setSort(sort);
    }

    async pageClick(page){
        this.setState({ currentPage : page})
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token

        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params: {
              page: page - 1,
              filter : this.state.filter,
              sort : this.state.sort
            }
          }).then(res => {
            console.log(res.data.challenges)
            this.setState({ challenges : res.data.challenges})
            // let pages = []
            // for (let i = 0; i< res.data.pages; i++){
            //     pages.push(i+1)
            //     console.log('da')
            // }
            // console.log(pages)
            // this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })
    }
   updateInput = async (input) => {
     const filtered = this.state.challenges.filter(challenge => {
          let rule = challenge.name.toLowerCase().includes(input.toLowerCase())
          if (challenge.text){
              rule = rule ||  challenge.text.toLowerCase().includes(input.toLowerCase())
          }
          

            return  rule
     })
     this.setState({ challengesSearch : filtered})
     this.setState({ input : input})
  }
    async componentDidMount(){
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        console.log('yeah', this.state.filter, this.state.sort)
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params : {
                filter : this.state.filter,
                sort : this.state.sort
            }
        }).then(res => {
            this.setState({ challenges : res.data.challenges})
            console.log(res.data.pages)
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
                console.log('da')
            }
            console.log(pages)
            this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })
        if (localStorage.getItem('isAuthenticated') == 'true'){
            await axios.get(process.env.REACT_APP_BACKEND_URL + '/unread-messages', {
                params : {
                    user : localStorage.getItem('userId')
                }
            }).then(res => {
                
                this.setState({unreadMessages : res.data.unreadMessages})
            }).catch(err => {
                console.log(err)
            })
        }
        



    } 
    async onChangeRadio(event) {
        console.log(event.target.value);
        this.setState({ filter : event.target.value})
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params : {
                filter : event.target.value,
                sort : this.state.sort
            }
        }).then(res => {
            this.setState({ challenges : res.data.challenges})
            console.log(res.data.pages, 'pages')
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
                console.log('da')
            }
            console.log(pages)
            this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })

        
      }
    render(){
        let challenges;
        if (this.state.input.length > 0){
            challenges = this.state.challengesSearch.slice(0,13)
        }else{
            challenges = this.state.challenges
        }
        let renderChallenges = challenges.map((challenge)=> {
            return (<div onClick={() => this.clickChallenge(challenge._id)}className="ui card"style={{borderRadius : '0px',maxHeight : '270px', maxWidth : '200px', justifyContent: 'center',alignItems: 'center', zIndex : '11', border : 'none', overflow : 'hidden', cursor: 'pointer', boxShadow : 'none' }}>
                {/* <div style={{display : 'inline-block', paddingTop : '8px'}} class="ui header">{challenge.name}</div> */}
                <div  style = {{padding : '0px', justifyContent: 'center',alignItems: 'center' }}className="ui middle aligned center aligned content">
                        
                        {challenge.photoURL ? <div style={{overflow : 'hidden', width : '200px', height : '200px',display : 'flex', justifyContent: 'center'}}>
                                <img style={{ margin : 'auto', maxHeight : '200px', width : 'auto', height : '200px'}}src={challenge.photoURL}/>
                            </div>
                             :
                        <div style={{ paddingTop : '5px', height : '200px', width : '200px',display : 'flex', justifyContent: 'center',alignItems: 'center'}}className="description">{challenge.text.substring(0, 200)}</div> }
                        <div style={{ float : 'left', display : 'block'}}className="description"> {challenge.name}</div>
                        <div style={{ float : 'left', display : 'block'}}className="description"> # of songs: {challenge.entries.length}</div>
                    </div>
                
                
                
                    
            </div>)
        })
        let pagesRender = []
        for (let i = this.state.currentPage - 1; i <= this.state.currentPage + 2; i++){
            console.log(i, this.state.currentPage, this.state.pages)
            if (i > 0 && this.state.pages.includes(i)){
                pagesRender.push(i)
            }
        }

        return (<div>
            <div  style={{ backgroundColor : '#323433', color: 'white', borderBottom : '1px solid grey'}}>
            <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block'}}>Music challenge app</h1>
            {localStorage.isAuthenticated == 'true' ? <div  style={{ width : '400px', display: 'inline-block', float : 'right', marginRight : '50px'}}>
            <Link style={{borderRadius : '0px', marginTop : '8px', backgroundColor : '#323433', color: 'white'}}className="ui button" to="/new_challenge">
                Create your challenge
            </Link>
            <Link style={{borderRadius : '0px', marginTop : '8px',backgroundColor : '#323433', color: 'white'}}className="ui button" to={`/profile/${localStorage.getItem('userId')}`}>
                Your profile
            </Link>
            <Link style={{borderRadius : '0px', marginTop : '8px', backgroundColor : '#323433', color: 'white'}}className="ui button" to="/inbox">
                Inbox {this.state.unreadMessages ? <span style={{color : 'black'}}>{this.state.unreadMessages}</span> : <div></div>}
            </Link>
            </div>
                 : 
            <div style={{ width : '200px', display: 'inline-block', float : 'right', marginRight : '50px', marginTop :'10px'}}>
                <Link style={{borderRadius : '0px', marginTop : '0px', backgroundColor : '#323433', color: 'white'}} className="ui button" to="/login">
                            Login
                </Link>
                <Link style={{borderRadius : '0px', marginTop : '0px', backgroundColor : '#323433', color: 'white'}} className="ui button" to="/signup">
                            Sign up
                </Link>
            </div>
            
            }
            
            </div>
            
            <div>
                <p className="ui paragraph" style={{paddingLeft: '20px', paddingTop: '10px', paddingBottom : '10px', borderBottom : '1px solid grey'}}>Welcome to the music challenge app! Purpose of the app is to inquire your creative processes, develop musical expression of moods and emotions.
                <br></br> Goal is to create an original song which suits the image or text of the challenge the most. Enjoy!
                <br></br> For a challenge you can put an image or paragraph of text(from your favourite book or even your own writing) that you would like to hear a song composed of.
                <br></br> As for song entries of a challenge please post your original works, it can be some of your previous work if you think it suits the challenge, but you are encouraged to make a new song/ short passage specifically for a certain challenge.
                </p>
            
            </div>
           
            <h3 style={{paddingLeft : '20px', width: '350px'}}>Challenges:</h3>
            <div style={{display : 'inline', position : 'relative', top : '-30px', left :'500px'}}class="ui search">
                <div class="ui icon input">
                    <input value={this.state.input}
                        onChange={(e) => this.updateInput(e.target.value)}
                        style={{ borderRadius : '0px',width : '300px'}} 
                        class="prompt" type="text" placeholder="Search..."/>
                    <i class="search icon"></i>
                </div>
                <div class="results"></div>
                </div>
          
            <div style={{display :'inline', position : 'relative', left : '600px', top : '-30px'}} onChange={this.onChangeRadio}>
                <span class="ui text">Filter by:</span>
                
                <div style={{marginLeft : '10px'}}class="ui radio checkbox"> <input  type="radio" value="Image" name="options" /> <label>Image</label></div>
                <div style={{marginLeft : '10px'}}class="ui radio checkbox"> <input type="radio" value="Text" name="options" />  <label>Text</label></div>
                <div style={{marginLeft : '10px'}}class="ui radio checkbox"> <input type="radio" value="Both" name="options" />  <label>Both</label></div>
                
            </div>
            <div style={{display :'inline', position : 'relative', left : '700px', top : '-30px'}}>
            
                <span>Sort by: </span>
               
                <select  name="select" class="ui dropdown" onChange={event => this.handleCategoryChange(event.target.value)}>
                {this.state.sorts.map(function(n) { 
                    return (<option value={n} onClick={() => this.setSort(n)}>{n}</option>);
                })}
                </select>
               
                


            {/* <select name="select" onChange={event => this.handleCategoryChange(event.target.value)}>
                {this.state.sorts.map(function(n) { 
                    return (<option value={n} onClick={() => this.setSort(n)}>{n}</option>);
                })}
            </select> */}
            </div>
            <div style={{paddingLeft : '20px', borderRight : '1px solid grey'}}className="ui cards">{renderChallenges}</div>
            { this.state.input.length == 0 ? 
            <div style={{paddingLeft : '20px'}}>pages: 
            {pagesRender.map(page => {
                return (<div onClick={() => this.pageClick(page)}style={{display: 'inline', cursor: 'pointer' }} > {' '+page}</div>)
            })}
            { !pagesRender.includes(this.state.pages[this.state.pages.length -1 ]) ?<div onClick={() => this.pageClick(this.state.pages[this.state.pages.length -1 ])}style={{display: 'inline', cursor: 'pointer' }} >     ...{this.state.pages[this.state.pages.length -1 ]}</div>
            : ''}
            <div style={{display : 'inline', paddingLeft: '6px'}}>
        { this.state.currentPage != 1 ? <i class="arrow left  icon"onClick={() => this.pageClick(this.state.currentPage -1)}></i> : ''}{ this.state.currentPage != this.state.pages[this.state.pages.length -1 ]  ? <i class="arrow right icon" onClick={() => this.pageClick(this.state.currentPage +1)}></i> : '' }
        </div>
            </div>
        : ''}
        
        
            


        </div>)

    }

}
export default UserScreen;