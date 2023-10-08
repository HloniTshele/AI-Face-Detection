import React, { Component } from "react"
import './App.css';
import ParticlesBg from 'particles-bg'
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkform';
import Rank from './Components/Rank/Rank'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import SignIn from './Components/Sign In/SignIn';
import Register from './Components/Register/Register'


const initialValues ={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      user: {
        id:'',
        name:'',
        email:'',
        entries: 0,
        joined: ''

      }

}
class App extends Component{
  constructor(){
    super();
    this.state = initialValues;
  }

  loadUser =(data) =>{
    this.setState({user: {
      id:data.id,
      name:data.name,
      email:data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  calculateFaceLocation = (clarifyData)=>{ 
    const clarifyFace = clarifyData.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return{
      leftCol: clarifyFace.left_col * width,
      topRow: clarifyFace.top_row * height,
      rightCol: width - (clarifyFace.right_col * width) ,
      bottomRow: height - (clarifyFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
      this.setState({box:box});
  }


  onInputChange =(event) =>{
    this.setState({input: event.target.value});
  }
  
  

  onButtonSubmit =()=>{
    this.setState({imageUrl:this.state.input});
    //Ajax
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(response => response.json())
    .then(result => {
      this.displayFaceBox(this.calculateFaceLocation(result))
      fetch('http://localhost:3000/image', {
        method: 'put',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            id: this.state.user.id
        })
    })
    .then(response=> response.json())
    .then(count=>{
      this.setState(Object.assign(this.state.user,{entries:count}))
    })
  })
    .catch(error => console.log('error', error));
  }

  onRouteChange =(route)=>{
    if(route === 'signout'){
      this.setState(initialValues)
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }
 
  render(){
    const {isSignedIn, imageUrl,route,box} =this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
       
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'?
        <div>
        <Logo/>
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm onInputChange={this.onInputChange}
         onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div> 
        : (
          route === 'signin'?
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>:
          <Register loadUser={this.loadUser} onRouteChange ={this.onRouteChange}/> 
        )
        
      }
      </div>
    );
  }
 
}

export default App;
