'use strict'

function renderCanvas(){
    const memes = getSavedMemes();
    const strHtmls = memes.map((meme)=>{
        return `<img src="${meme.memeImg}" onclick="onChooseMeme('${meme.id}')">`
    })
    document.querySelector('.savedMemes-container').innerHTML = strHtmls.join(''); 
}
