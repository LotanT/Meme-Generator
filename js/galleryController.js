'use strict'



function renderGallery(){
    const elSection = document.querySelectorAll('section');
    elSection.forEach(section=>section.hidden = true)
    elSection[0].hidden = false;
    const imgs = getImages();
    const strHtmls = imgs.map((img)=>{
        return `<img src="${img.url}" onclick="onChooseImg(${img.id})">`
    })
    strHtmls.unshift('<input type="file" class="file-input btn" name="image" onchange="onImgInput(event)"/>')
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('');
}

function onChangeDisplay(ev){
    const elLinks = document.querySelectorAll('.clean-list li');
    elLinks.forEach(link=> link.classList.remove('live'))
    ev.classList.add('live');
    const elSection = document.querySelectorAll('section');
    elSection.forEach(section=>section.hidden = true)
    switch (ev.innerText){
        case 'Gallery':
            elSection[0].hidden = false;
        case 'Saved':
            elSection[2].hidden = false;
            renderCanvas();
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