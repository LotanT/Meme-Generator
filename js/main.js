'use strict';

var gElCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  loadSavedMemes();
  renderGallery();
  var elContainer = document.querySelector('.editor');
  elContainer.hidden = true;
  addListeners();
}

function renderMeme() {
  const meme = getMeme();
  const img = getImgByID(meme.selectedImgId);
  const canvasSize = renderImg(img);
  saveCanvasSize(canvasSize);
  meme.lines.forEach((line) => {
    writeTxt(line);
    if (line === getCurrLine()) setControlBox(line);
  });
  var elInput = document.querySelector('.meme-input');
  var elTxtColor = document.getElementById('txtcolor');
  var elStrokeColor = document.getElementById('strokecolor');
  var elStrokeOn = document.getElementById('strokeon');
  var eltxtFont = document.querySelector('.font-select');
  if (!meme.lines.length || meme.selectedLineIdx === -1) {
    elInput.value = '';
    elTxtColor.value = '#020202';
    elStrokeColor.value = '#020202';
    elStrokeOn.checked = true;
    eltxtFont = 'Trebuchet MS';
  } else {
    elInput.value = getCurrLine().txt;
    elTxtColor.value = getCurrLine().color;
    elStrokeColor.value = getCurrLine().strokeColor;
    elStrokeOn.checked = getCurrLine().isStroke;
    eltxtFont.value = getCurrLine().font;
  }
}

function setDisplayEditor(){
  
}
function resizeCanvas() {
  var elContainer = document.querySelector('.canvas-container');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
  renderMeme();
}
function onChooseImg(id) {
  setMeme(id);
  displayEditor();
  renderMeme();
}
function displayEditor() {
  const elSection = document.querySelectorAll('section');
  elSection.forEach((section) => (section.hidden = true));
  const elLinks = document.querySelectorAll('.clean-list li');
  elLinks.forEach((link) => link.classList.remove('live'));
  elSection[1].hidden = false;
}

function renderImg(img) {
  var elContainer = document.querySelector('.canvas-container');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height =
    (img.naturalHeight * elContainer.offsetWidth) / img.naturalWidth;
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
  return { w: gElCanvas.width, h: gElCanvas.height };
}

function writeTxt(line) {
  gCtx.font = `${line.size}px ${line.font}`;
  gCtx.fillStyle = line.color;
  gCtx.textBaseline = 'middle';
  gCtx.textAlign = line.align;
  gCtx.setTransform(1, 0, 0, 1, 0, 0);
  gCtx.translate(line.x, line.y);
  // console.log(line.angle)
  gCtx.rotate(line.angle* Math.PI / 180)
  gCtx.fillText(line.txt, 0, 0);
  gCtx.strokeStyle = line.strokeColor;
  gCtx.lineWidth = 1;
  if (line.isStroke) gCtx.strokeText(line.txt, 0, 0);
  setWidthLine(line, gCtx.measureText(line.txt).width);
}

function setControlBox(line) {
  var height = line.size;
  var x = line.x - 5;
  if (line.align === 'right') x -= line.width;
  else if (line.align === 'center') x -= line.width / 2;
  drawRect(x, line.y - height / 2 - 3, line.width + 10, height + 3);
}
function drawRect(x, y, width, height) {
  if (!getCurrLine()) return;
  gCtx.beginPath();
  gCtx.strokeStyle = '#ffffff';
  gCtx.lineWidth = 3;
  gCtx.rect(-width / 2, -height / 2, width, height);
  gCtx.stroke();
  gCtx.closePath();
  drawArc(width, height);
}
function drawArc(width, height, size = 4, color = 'blue') {
  gCtx.beginPath();
  gCtx.lineWidth = '1';
  gCtx.arc(width / 2, height / 2, size, 0, 2 * Math.PI);
  gCtx.strokeStyle = 'white';
  gCtx.stroke();
  gCtx.fillStyle = color;
  gCtx.fill();
  const img = new Image();
  img.src = 'images/rotate-btn.png';
  // gCtx.drawImage(img, width / 2, -height / 2 -20, 20, 20);
}

function isLineClicked(pos) {
  const lines = getMeme().lines;
  var clickedLine = lines.find((line) => {
    var x = line.x;
    if (line.align === 'right') x -= line.width;
    else if (line.align === 'center') x -= line.width / 2;
    return (
      pos.x >= x &&
      pos.x <= x + line.width + 5 &&
      pos.y >= line.y - line.size / 2 - 3 &&
      pos.y <= line.y + line.size / 2 + 3 + 5
    );
  });
  if (clickedLine) {
    setCurrLine(clickedLine.idx);
    renderMeme();
    return true;
  } else {
    setCurrLine(-1);
    renderMeme();
    return false;
  }
}

function isSetSizeclicked(pos) {
  const lines = getMeme().lines;
  var clickedSetSize = lines.find((line) => {
    var x = line.x;
    if (line.align === 'right') x -= line.width;
    else if (line.align === 'center') x -= line.width / 2;
    return (
      Math.abs(x + line.width - pos.x) < 8 &&
      Math.abs(line.y + line.size / 2 + 3 - pos.y) < 8
    );
  });
  if (clickedSetSize) {
    setCurrLine(clickedSetSize.idx);
    renderMeme();
    return true;
  } else {
    setCurrLine(-1);
    renderMeme();
    return false;
  }
}

function isRotateclicked(pos) {
  const lines = getMeme().lines;
  var clickedLineRotate = lines.find((line) => {
    var x = line.x;
    if (line.align === 'right') x -= line.width;
    else if (line.align === 'center') x -= line.width / 2;
    return (
      Math.abs(x + line.width + 10 - pos.x) < 10 &&
      Math.abs(line.y - line.size / 2 - 10 - pos.y) < 10
    );
  });
  if (clickedLineRotate) {
    setCurrLine(clickedLineRotate.idx);
    renderMeme();
    return true;
  } else {
    setCurrLine(-1);
    renderMeme();
    return false;
  }
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
  // if (isRotateclicked(pos)) {
  //   setLineRotate(true);
  //   setStartPosAndCursor(pos);
  // } else
   if (isSetSizeclicked(pos)) {
    setLineSize(true);
    setStartPosAndCursor(pos);
  } else if (isLineClicked(pos)) {
    setLineDrag(true);
    setStartPosAndCursor(pos);
  }
}
function setStartPosAndCursor(pos) {
  gStartPos = pos;
  document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
  const line = getCurrLine();
  if (!line) return;
  const pos = getEvPos(ev);
  if (line.isRotate) {
    // var diffAngle = Math.atan2(line.y - pos.y, line.x - pos.x);
    var diffAngle = Math.atan2(gStartPos.y - pos.y, gStartPos.x - pos.x);
    // diffAngle = (diffAngle * 180) / Math.PI
    if(pos.x < line.x) diffAngle = -diffAngle;
    console.log(diffAngle)
    setAngelRotate(-diffAngle);
  }
  if (line.isSetSize) {
    const dx = (pos.x - gStartPos.x) / 3.7;
    setTxtSize(dx);
  }
  if (line.isDrag) {
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y;
    moveLine(dx, dy);
  }
  gStartPos = pos;
  renderMeme();
}

function onUp() {
  if (!getCurrLine()) return;
  setLineRotate(false);
  setLineSize(false);
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
function onChooseMeme(memeId) {
  setMeme(memeId);
  displayEditor();
  renderMeme();
}
function onChangeImput(txt) {
  if (!getCurrLine()) return;
  setLineTxt(txt);
  renderMeme();
}

function onChangTxtColor(color) {
  if (!getCurrLine()) return;
  setTxtColor(color);
  renderMeme();
}

function onChangeTxtSize(diff) {
  if (!getCurrLine()) return;
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
  if (!getCurrLine()) return;
  deletLine();
  renderMeme();
}

function onChangeAlign(align) {
  if (!getCurrLine()) return;
  changeAlign(align);
  renderMeme();
}

function onChangeFont(font) {
  if (!getCurrLine()) return;
  changeFont(font);
  renderMeme();
}

function downloadImg(elLink) {
  setCurrLine(-1);
  renderMeme();
  var imgContent = gElCanvas.toDataURL('image/jpeg');
  elLink.href = imgContent;
}

function onChangStrokeColor(color) {
  if (!getCurrLine()) return;
  changStrokeColor(color);
  renderMeme();
}

function onStrokeOn() {
  if (!getCurrLine()) return;
  setStroke();
  renderMeme();
}

function onSaveMeme() {
  setCurrLine(-1);
  renderMeme();
  saveMeme(gElCanvas.toDataURL('image/jpeg'));
}

function onImgInput(ev) {
  loadImageFromInput(ev, renderImg);
}

function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader();
  var img = new Image();

  reader.onload = (event) => {
    img.onload = onImageReady.bind(null, img);
    img.src = event.target.result;
    onChooseImg(img);
  };
  reader.readAsDataURL(ev.target.files[0]);
}
