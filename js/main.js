'use strict';

var gElCanvas;
var gCtx;

function init() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  resizeCanvas();
  renderMeme();
  renderGallery();
  var elContainer = document.querySelector('.editor');
  elContainer.hidden = true;
}

function renderMeme() {
  const meme = getMeme();
  const img = getImgByID(meme.selectedImgId);
  renderImg(img);
  meme.lines.forEach((line) => {
    console.log(line);
    writeTxt(line);
  });
  if(!meme.lines.length) return
  var elInput = document.querySelector('.meme-input');
  elInput.value = meme.lines[meme.selectedLineIdx].txt;
  var elTxtColor = document.querySelector('#txtcolor');
  elTxtColor.value = meme.lines[meme.selectedLineIdx].color;
  var elTxtSize = document.querySelector('.txt-size-input');
  elTxtSize.value = meme.lines[meme.selectedLineIdx].size;
}

function resizeCanvas() {
  var elContainer = document.querySelector('.canvas-container');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
}
function onChooseImg(img, id) {
  setMeme(img, id);
  var elEditor = document.querySelector('.editor');
  elEditor.hidden = false;
  var elEditor = document.querySelector('.gallery');
  elEditor.hidden = true;
  const elLinks = document.querySelectorAll('.clean-list li');
  elLinks.forEach((link) => link.classList.remove('live'));
  renderMeme();
}
function onImgInput(ev) {
  loadImageFromInput(ev, renderImg);
}
function renderImg(img) {
  var elContainer = document.querySelector('.canvas-container');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height =
    (img.naturalHeight * elContainer.offsetWidth) / img.naturalWidth;
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
  // writeTxt(txt)
}

function writeTxt(line) {
  console.log(line.txt);
  gCtx.font = `${line.size}px arial`;
  gCtx.fillStyle = line.color;
  gCtx.textBaseline = 'middle';
  gCtx.textAlign = line.aling;
  gCtx.fillText(line.txt, line.x, line.y);
}

function onChangeImput(txt) {
  setLineTxt(txt);
  renderMeme();
}

function onChangTxtColor(color) {
  setTxtColor(color);
  renderMeme();
}

function onChangeTxtSize(diff) {
  setTxtSize(diff);
  renderMeme();
}

function onChangeFocus() {
  changeFocus();
  renderMeme();
}

function onAddLine(){
  addline();
  renderMeme();
}

function onDeletLint(){
  deletLine()
  renderMeme();
}
