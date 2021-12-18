'use strict';

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
var gCanvasSize;
var gSavedMemes;
const STORAGE_KEY = 'MemesDB';
var gImgs = [
  {
    id: 1,
    url: 'images/meme-imgs (square)/1.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 2,
    url: 'images/meme-imgs (square)/2.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 3,
    url: 'images/meme-imgs (square)/3.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 4,
    url: 'images/meme-imgs (square)/4.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 5,
    url: 'images/meme-imgs (square)/5.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 6,
    url: 'images/meme-imgs (square)/6.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 7,
    url: 'images/meme-imgs (square)/7.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 8,
    url: 'images/meme-imgs (square)/8.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 9,
    url: 'images/meme-imgs (square)/9.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 10,
    url: 'images/meme-imgs (square)/10.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 11,
    url: 'images/meme-imgs (square)/11.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 12,
    url: 'images/meme-imgs (square)/12.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 13,
    url: 'images/meme-imgs (square)/13.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 14,
    url: 'images/meme-imgs (square)/14.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 15,
    url: 'images/meme-imgs (square)/15.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 16,
    url: 'images/meme-imgs (square)/16.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 17,
    url: 'images/meme-imgs (square)/17.jpg',
    keywords: ['funny', 'cat'],
  },
  {
    id: 18,
    url: 'images/meme-imgs (square)/18.jpg',
    keywords: ['funny', 'cat'],
  },
];
var gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'I sometimes eat Falafel',
      size: 20,
      font: 'Impact',
      align: 'center',
      color: '#ff0000',
      x: 50,
      y: 50,
      isStroke: true,
    },
  ],
};

function getMeme() {
  return gMeme;
}
function getCurrLine() {
  return gMeme.lines[gMeme.selectedLineIdx];
}
function getImages() {
  return gImgs;
}

function getImgByID(imgId) {
  const img = new Image();
  var currImg = gImgs.find((img) => img.id === imgId);
  if(currImg){
    img.src = currImg.url;
    return img;
  } 
  return gMeme.selectedImgId;
}

function setLineTxt(txt) {
  getCurrLine().txt = txt;
}
function setTxtColor(color) {
  getCurrLine().color = color;
}
function setTxtSize(diff) {
  getCurrLine().size = getCurrLine().size + diff * 2;
}
function changeFocus() {
  gMeme.selectedLineIdx++;
  if (gMeme.selectedLineIdx >= gMeme.lines.length) {
    gMeme.selectedLineIdx = 0;
  }
}
function addline() {
  var y;
  if (!gMeme.lines.length) y = 25;
  else if (gMeme.lines.length === 1) y = gCanvasSize.h - 20;
  else y = gCanvasSize.h / 2;
  const newLine = {
    idx: gMeme.lines.length,
    txt: 'Add here',
    size: 20,
    font: 'Impact',
    align: 'center',
    color: '#020202',
    strokeColor: '#020202',
    x: gCanvasSize.w / 2,
    y: y,
    isDrag: false,
    isStroke: true,
    isSetSize: false
  };
  gMeme.lines.push(newLine);
  gMeme.selectedLineIdx = gMeme.lines.length - 1;
}
function deletLine() {
  gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  changeFocus();
}

function setLineDrag(isDrag) {
  getCurrLine().isDrag = isDrag;
}

function moveLine(dx, dy) {
  const line = getCurrLine();
  line.x += dx;
  line.y += dy;
}

function changeAlign(align) {
  getCurrLine().align = align;
}
function changeFont(font) {
  getCurrLine().font = font;
}

function changStrokeColor(color) {
  getCurrLine().strokeColor = color;
}

function setWidthLine(lineSet, width) {
  var lineIdx = gMeme.lines.findIndex((line) => line.idx === lineSet.idx);
  gMeme.lines[lineIdx].width = width;
}

function setStroke() {
  getCurrLine().isStroke = !getCurrLine().isStroke;
}

function saveCanvasSize(canvasSize) {
  gCanvasSize = canvasSize;
}

function saveMeme(memeImg) {
  gMeme.memeImg = memeImg;
  if (!gMeme.id) gMeme.id = makeId();
  else {
    const memeIdx = gSavedMemes.findIndex((meme) => meme.id === gMeme.id);
    gSavedMemes.splice(memeIdx, 1);
  }
  gSavedMemes.unshift(gMeme);
  console.log(gSavedMemes);
  saveToStorage(STORAGE_KEY, gSavedMemes);
}

function loadSavedMemes() {
  gSavedMemes = loadFromStorage(STORAGE_KEY) || [];
}

function getSavedMemes() {
  return gSavedMemes;
}

function setLineSize(isSetSize){
  getCurrLine().isSetSize = isSetSize;
}
function setMeme(id) {
  gMeme = gSavedMemes.find((meme) => meme.id === id);
  if (gMeme) return;
  gMeme = {
    selectedImgId: id,
    selectedLineIdx: 0,
    lines: [
      {
        idx: 0,
        txt: 'Add here',
        size: 20,
        font: 'Impact',
        align: 'center',
        color: '#000000',
        strokeColor: '#000000',
        x: 156,
        y: 25,
        isDrag: false,
        isStroke: true,
        width: 50,
        isSetSize: false
      },
    ],
  };
}
