'use strict'



function renderGallery(){
    var elContainer = document.querySelector('.editor');
    elContainer.hidden = true;
    const imgs = getImages();
    const strHtmls = imgs.map((img)=>{
        return `<img src="${img.url}" onclick="onChooseImg(${img.id})">`
    })
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('');
    
}

function onChangeDisplay(ev){
    const elLinks = document.querySelectorAll('.clean-list li');
    elLinks.forEach(link=> link.classList.remove('live'))
    ev.classList.add('live');
    const elSection = document.querySelectorAll('section');
    console.log(elSection)
    elSection.forEach(section=>section.hidden = true)
    switch (ev.innerText){
        case 'Gallery':
            elSection[0].hidden = false;
        case 'Saved':
        case 'About':
    }
    toggleMenu()
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
    const elBtnMenu = document.querySelector('.btn-menu');
    elBtnMenu.innerText = document.body.classList.contains('menu-open')
      ? '✕'
      : '☰';
  }