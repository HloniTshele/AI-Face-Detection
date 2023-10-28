const handleApiCall =(req,res)=>{
    const MODEL_ID = 'face-detection';
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", clarifyReturnOptions(req.body.input))
    .then(response => response.json())
    .then(result =>{
        res.json(result);
    })
    .catch(error => console.log('error', error));
}

const clarifyReturnOptions =(ImageURL)=>{
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '5834cadeafb54f4d8a8849d0c5b6438a';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'hlonitshele';    
    const APP_ID = 'facerecognitionv1';
    // Change these to whatever model and image input you want to use
    const IMAGE_URL = ImageURL;
  
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
  
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions;
  }



//adding the users entries
const imageHandler = (req,res,db)=>{
    let {id}  = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries)
    })
    .catch(err=> res.status(400).json("Unable to get entries"))
}


export default {imageHandler, handleApiCall}



