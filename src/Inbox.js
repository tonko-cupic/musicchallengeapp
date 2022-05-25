import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import Chat from './Chat.js'
import { Link } from 'react-router-dom'
class Inbox extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            inboxes : [],
            message : null,
            inbox : null,
            newInboxUsername : null,
            id : null,
            newChatStart : true
        };
        
        

        
    }

    async componentDidMount(){

        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token

        await axios.post(process.env.REACT_APP_BACKEND_URL + '/get-inboxes', {
            user : localStorage.getItem('userId')
        }).then(res => {
            this.setState({ inboxes : res.data.inboxes})
            console.log(res.data, 'bleh')
        }).catch(err => {
            console.log(err)
        })
        console.log(this.state.inboxes, 'ASDF')
        for (let i = 0; i < this.state.inboxes.length; i++){
            console.log(this.state.inboxes[i], i , 'AAAAAAAAAAA')
            if (this.state.inboxes[i].messages.length == 0){
                console.log('yuhh')
                this.setState({ inbox : this.state.inboxes[i]})
                if (this.state.inboxes[i].user1 == localStorage.getItem('userId')){
                    this.setState({ newInboxUsername : this.state.inboxes[i].user2.username})
                }else{
                    this.setState({ newInboxUsername : this.state.inboxes[i].user1.username})
                }
                
            }
        }


        
        
    }
    async componentWillUnmount(){
        console.log(this.state.inboxes, 'ASDF2')
        for (let i = 0; i < this.state.inboxes.length; i++){
            if (this.state.inboxes[i].messages.length == 0){
                let res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-inbox', {
                    id : this.state.inboxes[i]._id
                })

            }
        }
    }
    handleChange(event) {
        this.setState({message: event.target.value});
    }
    
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.message);
        event.preventDefault();
    }
    async inboxClick(inbox){
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token

        await axios.post(process.env.REACT_APP_BACKEND_URL + '/get-inbox', {
            id : inbox._id
        }).then(res => {
            this.setState({ inbox : res.data.inbox})
            console.log(res.data, 'blefffffffffffh')
        }).catch(err => {
            console.log(err)
        })
        console.log(inbox.messages[inbox.messages.length - 1].user , localStorage.getItem('userId'), 'check')
        if (inbox.messages[inbox.messages.length - 1].user != localStorage.getItem('userId') && !inbox.isRead){
            await axios.post(process.env.REACT_APP_BACKEND_URL + '/read-inbox', {
                id : inbox._id,
                user : localStorage.getItem('userId')
            }).then(res => {
            }).catch(err => {
                console.log(err)
            })
        }
        var element = document.getElementById("chatbox");
        element.scrollTop = element.scrollHeight;
        
        
    }
    render() {
        console.log(this.props.id)
        let renderInboxes = this.state.inboxes.map(inbox => {
            console.log(inbox)
            return <div class="item" style={{cursor : 'pointer'}}>
                <div style={{ border : inbox.isRead == true ? 'none' : 'solid grey' }}onClick={() => this.inboxClick(inbox)}class="content">
                {inbox.user1._id == localStorage.getItem('userId') ?
                    <div class="header">{inbox.user2.username}</div> : <div class="header">{inbox.user1.username}</div>}
                        {inbox.messages[0]?.user == localStorage.getItem('userId') ?<i class="share icon"></i> : <div></div>}{inbox.messages[0] ? inbox.messages[0]?.message.substring(0,37) : 'New chat created!'}
                </div>
            </div>
        })
        let renderChat;
        if (this.state.inbox?.messages){
            renderChat = this.state.inbox.messages.map(message => {
                return <div>
                    {message.message}
                </div>
            })
        }
        


        return <div>
            <div style={{ backgroundColor : 'grey', float : 'top', height : '51px', marginBottom : '0px'}}>
               
               
                <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block'}}>Music challenge app</h1>
                <Link style={{borderRadius : '0px', marginTop : '8px', color : 'black', backgroundColor : 'grey', float :'right', marginRight : '100px'}} className="ui button" to="/">
                Back
            </Link>
            
            </div>
            <h2 className="ui header" style={{paddingLeft : '20px', paddingTop : '0px', marginTop : '5px'}}>Inbox</h2>

            <div style={{ overflowY: 'scroll',border: '1px solid grey',  height : '500px', width : '300px', marginLeft : '20px', marginTop : '50px'}}class="ui celled list">
                {renderInboxes}
            </div>
            <div style={{border: '1px solid grey',height : '600px', width : '600px', position : 'relative', left : '320px', bottom : '515px'}}>
                <Chat inbox={this.state.inbox} newUsername={this.state.newInboxUsername}/>
            
            </div>
            
        </div>
    }
}


export default Inbox