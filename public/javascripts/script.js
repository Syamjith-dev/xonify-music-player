


document.addEventListener("DOMContentLoaded", () => {

let audio = null
let currentBtn = null
let currentId = null

const progress = document.getElementById("progress")
const currentTime = document.getElementById("currentTime")
const duration = document.getElementById("duration")

const bottomPlay = document.getElementById("playBtn")
const bottomIcon = document.getElementById("bottomIcon")

function formatTime(time){
    if(!time) return "0:00"
    let min = Math.floor(time/60)
    let sec = Math.floor(time%60)
    if(sec < 10) sec = "0"+sec
    return min + ":" + sec
}

window.playSong = function(btn){

    const id = btn.dataset.id
    const name = btn.dataset.name
    const artist = btn.dataset.artist
    const icon = btn.querySelector(".icon")

    const nowPlayImg = document.querySelector(".nowPlayImg")
    const songName = document.querySelector(".songName")
    const artistName = document.querySelector(".artist")

    // update right section
    nowPlayImg.style.backgroundImage = `url('/songs-images/${id}.png')`
    nowPlayImg.style.backgroundSize = "cover"
    nowPlayImg.style.backgroundPosition = "center"

    songName.innerText = name
    artistName.innerText = artist

    // same song
    if(audio && currentId === id){

        if(audio.paused){
            audio.play()
            icon.innerText="⏸"
            if(bottomIcon) bottomIcon.innerText="⏸"
        }else{
            audio.pause()
            icon.innerText="▶"
            if(bottomIcon) bottomIcon.innerText="▶"
        }

        return
    }

    // stop old song
    if(audio){
        audio.pause()
        if(currentBtn){
            currentBtn.querySelector(".icon").innerText="▶"
        }
    }

    // play new song
    audio = new Audio(`/songs/${id}.mp3`)
    audio.play()

    icon.innerText="⏸"
    if(bottomIcon) bottomIcon.innerText="⏸"

    currentBtn = btn
    currentId = id

    audio.addEventListener("loadedmetadata",()=>{
        if(progress) progress.max = audio.duration
        if(duration) duration.innerText = formatTime(audio.duration)
    })

    audio.addEventListener("timeupdate",()=>{
        if(progress) progress.value = audio.currentTime
        if(currentTime) currentTime.innerText = formatTime(audio.currentTime)
    })

    audio.onended = () =>{
        nextSong()
    }

}

window.nextSong = function(){

    if(!currentBtn) return

    let card = currentBtn.closest(".col-md-3") || currentBtn.closest(".song-card")
    let nextCard = card.nextElementSibling

    if(!nextCard){
        nextCard = document.querySelector(".col-md-3") || document.querySelector(".song-card")
    }

    const nextBtn = nextCard.querySelector(".play-btn, .play-btn-like")

    if(nextBtn) playSong(nextBtn)

}

window.prevSong = function(){

    if(!currentBtn) return

    let card = currentBtn.closest(".col-md-3") || currentBtn.closest(".song-card")
    let prevCard = card.previousElementSibling

    if(!prevCard){
        const cards = document.querySelectorAll(".col-md-3, .song-card")
        prevCard = cards[cards.length-1]
    }

    const prevBtn = prevCard.querySelector(".play-btn, .play-btn-like")

    if(prevBtn) playSong(prevBtn)

}

// bottom play button
if(bottomPlay){
bottomPlay.onclick = ()=>{

    if(!audio){
        const firstBtn = document.querySelector(".play-btn")
        if(firstBtn) playSong(firstBtn)
        return
    }

    if(audio.paused){
        audio.play()
        bottomIcon.innerText="⏸"
        if(currentBtn) currentBtn.querySelector(".icon").innerText="⏸"
    }else{
        audio.pause()
        bottomIcon.innerText="▶"
        if(currentBtn) currentBtn.querySelector(".icon").innerText="▶"
    }

}
}

// progress bar
if(progress){
progress.oninput = function(){
    if(audio){
        audio.currentTime = progress.value
    }
}
}

})



