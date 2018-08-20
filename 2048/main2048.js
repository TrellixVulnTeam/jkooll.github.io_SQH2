var board=new Array();
var hid=new Array();
var  score=0;
var times=0;

var startx = 0;
var starty=0;
var endx=0;
var endy=0;

$(document).ready(function(){
  prepareForMobile();
  newgame();
});

function prepareForMobile(){
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $("#grid-container").css("width",gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("height",gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("border-radius",0.02*gridContainerWidth);

    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame(){
  //初始化棋盘
  init();
  //在随机两个格子里生成数字
  generateOneNumber();
  generateOneNumber();
}
function init(){
  for(var i = 0; i < 4;i ++)
      for(var j = 0;j < 4; j ++){
        var gridCell=$("#grid-cell-"+i+"-"+j);
        gridCell.css("top",getPosTop(i,j));
        gridCell.css("left",getPosLeft(i,j));
      }

  for(var i=0;i<4;i++){

    board[i]=Array();
    for(var j = 0;j < 4; j ++)
      board[i][j]=0;
  }

  updateBoardView();
}

function updateBoardView(){
  $(".number-cell").remove();
  for(var i=0;i<4;i++)
  {
      hid[i]=Array();
      for(var j=0;j<4;j++){
          hid[i][j]=0;
        $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
        var theNumberCell=$("#number-cell-"+i+"-"+j);

        if(board[i][j]==0){
          theNumberCell.css('width','0px');
          theNumberCell.css('height','0px');
          theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
          theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
        }
        else{
          theNumberCell.css('width',cellSideLength);
          theNumberCell.css('height',cellSideLength);
          theNumberCell.css('top',getPosTop(i,j));
          theNumberCell.css('left',getPosLeft(i,j));
          theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
          theNumberCell.css('color',getNumberColor(board[i][j]));
          theNumberCell.text(board[i][j]);
        }
      }
  }

  $(".number-cell").css("line-height",cellSideLength+"px");
  $(".number-cell").css("font-size",0.6*cellSideLength+"px");
}

function generateOneNumber(){
  if(nospace(board))
      return false;

  //随机一个位置
  var times=0;
  var randx=0;
  var randy=0;
  while(times<50){
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
    if(board[randx][randy]==0)
        break;
    times++;
  }

  if(times==50)
  {
      for(var i=0;i<4;i++)
          for(var j=0;j<4;j++)
          if(board[i][j]==0){
              randx=i;
              randy=j;
          }
  }

  ///随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;
  board[randx][randy]=randNumber;

  showNumberWithAnimation( randx,randy,randNumber);
  return true;
}

$(document).keydown(function(event){
    event.preventDefault();
  switch(event.keyCode){
    case 37://lefe
        moveLeft();
        setTimeout("generateOneNumber()",200);
        setTimeout("isGameover()",300);
        break;
    case 38://up
        moveUp();
        setTimeout("generateOneNumber()",200);
        setTimeout("isGameover()",300);
        break;
    case 39://right
        moveRight();
        setTimeout("generateOneNumber()",200);
        setTimeout("isGameover()",300);
        break;
    case 40://down
        moveDown();
        setTimeout("generateOneNumber()",200);
        setTimeout("isGameover()",300);
        break;
    default:
        break;
  }
});

document.addEventListener("touchstart",function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
})
document.addEventListener('touchend', function(event) {
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax=endx-startx;
    var deltay=endy-starty;

    if(Math.abs(deltax)<0.1*documentWidth && Math.abs(deltay)<0.1*documentWidth)
        return;
    //x
    if(Math.abs(deltax)>Math.abs(deltay)){

        if(deltax>0){
            //moveLeft
            moveRight();
            setTimeout("generateOneNumber()",200);
            setTimeout("isGameover()",300);
        }
        else {
            //moveRight
            moveLeft();
            setTimeout("generateOneNumber()",200);
            setTimeout("isGameover()",300);
        }
    }
    //y
    else {
        if(deltay>0){
            //moveDown
            moveDown();
            setTimeout("generateOneNumber()",200);
            setTimeout("isGameover()",300);
        }
        else {
            //moveUp
            moveUp();
            setTimeout("generateOneNumber()",200);
            setTimeout("isGameover()",300);
        }
    }
});


function isGameover(){
    showScore();
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert("gameover!!!");
}

function showScore(){
    score=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
        {
            score+=board[i][j];
        }
    var sco=$("#score");
    sco.text(score);
}


function moveLeft(){
  if(!canMoveLeft(board))
      return false;

  for(var i=0;i<4;i++)
      for(var j=1;j<4;j++)
          if(board[i][j]!=0){
              for(var k=0;k<j;k++){
                  if(board[i][k]==0 &&  noBlockH(i,k,j,board)){
                      showMoveAnimation(i,j,i,k);
                      board[i][k]=board[i][j];
                      board[i][j]=0;
                      break;
                  }
                  else if(board[i][j]==board[i][k] &&  noBlockH(i,k,j,board) && hid[i][k]!=1){
                      showMoveAnimation(i,j,i,k);

                      board[i][k]+=board[i][j];
                      board[i][j]=0;
                      hid[i][k]=1;

                      break;
                  }
              }
          }


  setTimeout(function() {
      updateBoardView();
  }, 200);
  return true;
}

function moveRight(){
  if(!canMoveRight(board))
      return false;

  for(var i=0;i<4;i++)
      for(var j=2;j>=0;j--)
          if(board[i][j]!=0){
              for(var k=3;k>j;k--){
                  if(board[i][k]==0 &&  noBlockH(i,j,k,board)){
                      showMoveAnimation(i,j,i,k);
                      board[i][k]=board[i][j];
                      board[i][j]=0;
                      break;
                  }
                  else if(board[i][j]==board[i][k] &&  noBlockH(i,j,k,board) && hid[i][k]!=1){
                      showMoveAnimation(i,j,i,k);

                      board[i][k]+=board[i][j];
                      board[i][j]=0;
                      hid[i][k]=1;

                      break;
                  }
              }
          }


  setTimeout(function() {
      updateBoardView();
  }, 200);
  return true;
}

function moveUp(){
  if(!canMoveUp(board))
      return false;

  for(var i=1;i<4;i++)
      for(var j=0;j<4;j++)
          if(board[i][j]!=0){
              for(var k=0;k<i;k++){
                  if(board[k][j]==0 &&  noBlockV(j,k,i,board)){
                      showMoveAnimation(i,j,k,j);
                      board[k][j]=board[i][j];
                      board[i][j]=0;
                      break;
                  }
                  else if(board[i][j]==board[k][j] &&  noBlockV(j,k,i,board) && hid[k][j]!=1){
                      showMoveAnimation(i,j,k,j);

                      board[k][j]+=board[i][j];
                      board[i][j]=0;
                      hid[k][j]=1;

                      break;
                  }
              }
          }


  setTimeout(function() {
      updateBoardView();
  }, 200);
  return true;
}

function moveDown(){
  if(!canMoveDown(board))
      return false;

  for(var i=2;i>=0;i--)
      for(var j=0;j<4;j++)
          if(board[i][j]!=0){
              for(var k=3;k>i;k--){
                  if(board[k][j]==0 &&  noBlockV(j,i,k,board)){
                      showMoveAnimation(i,j,k,j);
                      board[k][j]=board[i][j];
                      board[i][j]=0;
                      break;
                  }
                  else if(board[i][j]==board[k][j] &&  noBlockV(j,i,k,board) && hid[k][j]!=1){
                      showMoveAnimation(i,j,k,j);

                      board[k][j]+=board[i][j];
                      board[i][j]=0;
                      hid[k][j]=1;

                      break;
                  }
              }
          }


  setTimeout(function() {
      updateBoardView();
  }, 200);
  return true;
}
