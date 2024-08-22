import './App.css';
import { auth } from './config';
import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import axios from 'axios';
import { useState,useEffect } from 'react';

function App(){

    const [githubid,setGithubid] = useState('');
    const [username,setUsername] = useState('');
    const [message,setMessage] = useState('');
    const [success,setSuccess] = useState(false);
    const [newUser,setNewUser] = useState(true);

    const token = import.meta.env.VITE_GitHub_Token;

    const handleClick = async (e) => {
      setGithubid(e.target.value);

      const owner = "skrsumit250";
      const repo = "BSBE-Archive"
      
      // console.log('token',token);

      const url = `https://api.github.com/repos/${owner}/${repo}/collaborators`;
      const headers = {Authorization: `Bearer ${token}`};
  
      try{
        const response = await fetch(`https://api.github.com/users/${githubid}`);
        if(response.status===404){
          setMessage("GitHub Account not exists.");
          return;
        } 
        else{
          const GitHubUser = await response.json();
          // console.log('GitHubUser',GitHubUser);
    
          try{

            const response = await axios.get(url ,{headers});
            const collaborators = response.data;
            // console.log('collaborators',collaborators);
    
            const isCollaborator = collaborators.some(collaborator => collaborator.login === githubid);
            if(isCollaborator){
              // console.log('User is already a Collaborator');
              // Redirect to Repo Link
              setGithubid(githubid);
              setSuccess(true);
              setNewUser(false);
              return;
            }
            else{
              const provider = new OAuthProvider('microsoft.com');
              provider.setCustomParameters({
                prompt: 'consent',
                tenant: '850aa78d-94e1-4bc6-9cf3-8c11b530701c',
              });
        
              try {
                const result = await signInWithPopup(auth, provider);
                // Handle successful sign-in
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                // console.log(result.user);
        
                try{
                    const newURL = `https://api.github.com/repos/${owner}/${repo}/collaborators/${githubid}`;
                    const response = await axios.put(newURL , {},{headers});
                    const githubData = response.data;
                    // console.log(githubData);
        
                    setUsername(result.user.displayName);
                    setGithubid(githubid);
                    setNotice(str);
                    setSuccess(true);
                } 
                catch(error){
                  console.error('Error:', error);
                }
                // Save user information to Realtime Database
                const usersRef = ref(getDatabase(), 'users/' + result.user.uid);
                const userdata = await set(usersRef, {
                  displayName: result.user.displayName,
                  email: result.user.email,
                }).then(() => {
                  console.log('User data saved successfully');
                })
                .catch((error) => {
                  console.error('Error saving user data:', error);
                });
              } 
              catch (error) {
                const credential = OAuthProvider.credentialFromError(error);
                console.log('Error ',error);
                console.error('Auth Error ',credential);
              }
            }
          }
          catch(error){
            console.log('Error:',error);
          }
        }
      } 
      catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      if(!newUser){
        window.location.href = "https://github.com/skrsumit250/BSBE-Archive"; 
      }
    }, [newUser]);

    return(
      <>
        { !success && 
          <div className="home">
              <div className="box">
                <h1>Register to BSBE Archive</h1>
                <div className="row">
                  <img src="./github.png" alt="" />
                  <input value={githubid} onChange={(e)=> setGithubid(e.target.value)} type="text" placeholder='Enter GitHub Id' />
                </div>
                <p id='warning'>{message}</p>
                <div className="row">
                  <img src="./microsoft.png" alt="" />
                  <button onClick={handleClick}>Continue With IITG Web Mail</button>
                </div>
              </div>
          </div>
        }
        { success &&
          <div className="welcome">
              <h1>Welcome {githubid} !</h1>
              <p>Accept the invite link sent to your GitHub linked Email id</p>
              <p>Access The BSEBE Archive through below link!</p>
              <a href="https://github.com/skrsumit250/BSBE-Archive">github.com/skrsumit250/BSBE-Archive</a>
          </div>
        }
      </>
        
    )
}
export default App;