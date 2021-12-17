'use strict';

var gElCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  resizeCanvas();
  renderMeme();
  renderGallery();
  var elContainer = document.querySelector('.editor');
  elContainer.hidden = true;
  addListeners();
}

function renderMeme() {
  const meme = getMeme();
  const img = getImgByID(meme.selectedImgId);
  renderImg(img);
  meme.lines.forEach((line) => {
    writeTxt(line);
    if(line === getCurrLine()) setControlBox(line);
  });
  if (!meme.lines.length) return;
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
  renderMeme();
}
function onChooseImg(id) {
  setMeme(id);
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
}

function writeTxt(line) {
  gCtx.font = `${line.size}px ${line.font}`;
  gCtx.fillStyle = line.color;
  gCtx.textBaseline = 'middle';
  gCtx.textAlign = line.align;
  gCtx.fillText(line.txt, line.x, line.y);
  // gCtx.strokeText(line.txt, line.x, line.y);
  setWidthLine(line,gCtx.measureText(line.txt).width);
}

function setControlBox(line) {
  var height = line.size;
  var x = line.x - 5
  if(line.align === 'right') x -= line.width;
  else if(line.align === 'center') x -= line.width/2
  drawRect(
    x,
    line.y - height / 2 - 3,
    line.width + 10,
    height + 3
  );
}
function drawRect(x, y, width, height) {
  gCtx.beginPath();
  gCtx.strokeStyle = '#ffffff';
  gCtx.lineWidth = 3;
  gCtx.rect(x, y, width, height);
  gCtx.stroke();
  gCtx.closePath();
}

function isLineClicked(pos) {
  const lines = getMeme().lines;
  var clickedLine = lines.find((line) => {
    var x = line.x;
    if(line.align === 'right') x -= line.width;
    else if(line.align === 'center') x -= line.width/2
    // console.log(x,pos.x,x+line.width)
    // console.log(line.y - line.size / 2 - 3,line.y + line.size / 2 + 3)
    return (
      pos.x >= x &&
      pos.x <= x + line.width &&
      pos.y >= line.y - line.size / 2 - 3 &&
      pos.y <= line.y + line.size / 2 + 3
    );
  });
  if (clickedLine) {
    gMeme.selectedLineIdx = lines.findIndex(
      (line) => line.txt === clickedLine.txt
    );
    renderMeme()
    return true;
  } 
  else return false;
}

function addListeners() {
  addMouseListeners();
  addTouchListeners();
  window.addEventListener('resize', () => {
    resizeCanvas();
    // const center = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
  });
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousemove', onMove);
  gElCanvas.addEventListener('mousedown', onDown);
  gElCanvas.addEventListener('mouseup', onUp);
  gElCanvas.addEventListener('mouseleave', onUp);
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchmove', onMove);
  gElCanvas.addEventListener('touchstart', onDown);
  gElCanvas.addEventListener('touchend', onUp);
  gElCanvas.addEventListener('touchcancel', onUp);
}

function onDown(ev) {
  const pos = getEvPos(ev);
  if (!isLineClicked(pos)) return;
  setLineDrag(true);
  gStartPos = pos;
  document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
  const line = getCurrLine();
  if(!line) return;
  if (!line.isDrag) return;
  const pos = getEvPos(ev);
  const dx = pos.x - gStartPos.x;
  const dy = pos.y - gStartPos.y;
  moveLine(dx, dy);
  gStartPos = pos;
  renderMeme();
}

function onUp() {
  if(!getCurrLine()) return
  setLineDrag(false);
  document.body.style.cursor = 'unset';
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    console.log();
    pos = {
      x: ev.pageX - ev.target.offsetLeft,
      y: ev.pageY - ev.target.offsetTop,
    };
  }
  return pos;
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

function onAddLine() {
  addline();
  renderMeme();
}

function onDeletLint() {
  deletLine();
  renderMeme();
}

function onChangeAlign(align){
  changeAlign(align);
  renderMeme();
}

function onChangeFont(font){
  changeFont(font);
  renderMeme();
}

function downloadImg(elLink) {
  var imgContent = gElCanvas.toDataURL('image/jpeg');
  elLink.href = imgContent;
}