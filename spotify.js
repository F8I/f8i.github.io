let session = ""
socket = ""
let paused = false

function linkToUri(link){
    return "spotify:track:" + link.split("?")[0].substring(link.split("?")[0].lastIndexOf('/') + 1)
}

function skip(){

    socket.send(JSON.stringify({type: "PLAYER_SKIP", session: session}))
}

function rewind(){

    socket.send(JSON.stringify({type: "PLAYER_REWIND", session: session}))
}



function pause(){

    if(paused == false)
    {
        paused = true
        socket.send(JSON.stringify({type: "PLAYER_PAUSE", session: session}))
        document.getElementById("pauseButton").innerHTML = `<i class="fa-solid fa-play"></i>`
        

    }
    else{
        paused = false
        socket.send(JSON.stringify({type: "PLAYER_RESUME", session: session}))
        document.getElementById("pauseButton").innerHTML = `<i class="fa-solid fa-pause">`

    }


}



window.onload = function(){


 document.getElementById("playButton2").onclick = function(){
        socket.send(JSON.stringify({type: "SONG_CHANGE", session: session, uri: linkToUri(document.getElementById("trackUri").value)}))


      }

    
    document.getElementById("connectButton").onclick = function(){
       
        socket = new WebSocket("wss://spotify-dev.o-k.repl.co", "dev")
        session = document.getElementById("sessionId").value

        socket.onopen = () => {
            socket.send(JSON.stringify({type: "FETCH_CURRENT_SONG", session: session}))
                alert("Connected to session " + session + " successfully!")
          }



          socket.onmessage = (a) => {
            let json = JSON.parse(a.data)
          switch(json.type){


            case "CURRENT_SONG":
                console.log(json)
        
                if(json.session == session)
                {
                    let artists = ""
    
                    for (var k in json.meta){
                        if (json.meta.hasOwnProperty(k)) {
                            if(k.startsWith("artist_name"))
                            {
                                artists += json.meta[k] + ", "
                            }
                             
                        }
                    }
                    artists = artists.substring(0, artists.length - 2)
                    
                            if(json.meta.is_local == "true")
                            {
                                document.getElementById("coverArt").src = "https://cdn.discordapp.com/attachments/957268278835830806/1045721625095577710/E469D7F1-C3C1-469C-BE76-6D7ADBF4EF06.jpg"
                    
                            }
                            else{
                                document.getElementById("coverArt").src = "https://i.scdn.co/image/" + json.meta.image_url.split(":")[2]
                    
                            }
                            document.getElementById("songName").innerHTML = json.meta.title
                            document.getElementById("songArtist").innerHTML = artists

                }

                break;

        case "SONG_CHANGE_UI":
            console.log(json)
    
            if(json.session == session)
            {
    
                let artists = ""
    
    for (var k in json.meta){
        if (json.meta.hasOwnProperty(k)) {
            if(k.startsWith("artist_name"))
            {
                artists += json.meta[k] + ", "
            }
             
        }
    }
    artists = artists.substring(0, artists.length - 2)
    
            if(json.meta.is_local == "true")
            {
                document.getElementById("coverArt").src = "https://cdn.discordapp.com/attachments/957268278835830806/1045721625095577710/E469D7F1-C3C1-469C-BE76-6D7ADBF4EF06.jpg"
    
            }
            else{
                document.getElementById("coverArt").src = "https://i.scdn.co/image/" + json.meta.image_url.split(":")[2]
    
            }
            document.getElementById("songName").innerHTML = json.meta.title
            document.getElementById("songArtist").innerHTML = artists
    
            }
            
          }
        }



      }




    



      
}
