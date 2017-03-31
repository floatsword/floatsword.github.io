var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

const endTime = new Date(2016,8,7,12,10,10,10);
var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){

    //取得绘图上下文
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');


    //自适应
    WINDOW_WIDTH = document.documentElement.clientWidth;
    WINDOW_HEIGHT = document.documentElement.clientHeight;

    MARGIN_TOP = WINDOW_HEIGHT/5;
    MARGIN_LEFT = WINDOW_WIDTH/10;
    RADIUS = WINDOW_WIDTH*4/5/106 -1 ;

    //计算canvas的宽高

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;


    //渲染函数,参数为绘图上下文环境
    curDate = new Date();
    render( ctx );
    setInterval(function(){
        render(ctx);
        update();
    },30)


}


function update(){

    var nextDate = new Date();
    nextDate.setSeconds(nextDate.getSeconds())


    var nextHours = nextDate.getHours();
    var nextMinutes = nextDate.getMinutes();
    var nextSeconds = nextDate.getSeconds();

    var curHours = parseInt(curDate.getHours());
    var curMinutes = Math.floor(curDate.getMinutes())
    var curSeconds = curDate.getSeconds();


    if( nextSeconds != curSeconds ){


        if( parseInt(curHours/10)!=parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT ,MARGIN_TOP , parseInt(curHours/10) )
        }
        if( parseInt(curHours%10)!=parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT+ 8*2*(RADIUS+1), MARGIN_TOP , parseInt(curHours%10) )
        }

        if( parseInt(curMinutes/10)!=parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 19*2*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) )
        }
        if( parseInt(curMinutes%10)!=parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 27*2*(RADIUS+1) ,MARGIN_TOP , parseInt(curMinutes%10) )

        }

        if( parseInt(curSeconds/10)!=parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 38*2*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) )
        }
        if( parseInt(curSeconds%10)!=parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 46*2*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) )
        }

        curDate = nextDate;
    }

    updateBalls()


}

function updateBalls(){

    for( var i = 0 ; i < balls.length ; i++ ){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT - RADIUS ){
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy*0.5 +2;
        }
    }
    var cnt = 0;
    for( var i=0;i<balls.length;i++ ){
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[i];
        }
    }
    while(balls.length>Math.min( 300,cnt) ){
        balls.pop();
    }
}


function addBalls( x , y , num){
    for( var i =0 ; i < digit[num].length ; i++ ){
        for( var j = 0 ; j < digit[num][i].length ; j++ ){
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x: x+2*(RADIUS+1)*j+(RADIUS+1),
                    y: y+2*(RADIUS+1)*i+(RADIUS+1),
                    r: RADIUS,
                    g: (Math.random()+1.5),
                    vx: Math.pow(-1,Math.ceil( Math.random()*1000) ) *4 ,
                    vy: -5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }

                balls.push( aBall );
            }
        }

    }
}



function getCurShowTimeSeconds(){

    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret/1000);

    return ret >= 0 ? ret : 0;

}



function render(ctx){//绘制当前canvas的画布 ：时钟

    ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    //时钟的数字
    var hours = curDate.getHours(),
        minutes = curDate.getMinutes(),
        seconds = curDate.getSeconds();

    // var hours = parseInt(curShowTimeSeconds/3600);
    // var minutes = Math.floor(curShowTimeSeconds/60 %60)
    // var seconds = curShowTimeSeconds%60;

    renderDigit( MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), ctx)
    renderDigit( MARGIN_LEFT + 8*2*(RADIUS+1), MARGIN_TOP ,hours%10,ctx);
    renderDigit( MARGIN_LEFT + 15*2*(RADIUS+1),MARGIN_TOP,10,ctx);
    renderDigit( MARGIN_LEFT + 19*2*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), ctx);
    renderDigit( MARGIN_LEFT + 27*2*(RADIUS+1), MARGIN_TOP, minutes%10, ctx);
    renderDigit( MARGIN_LEFT + 34*2*(RADIUS+1),MARGIN_TOP,10,ctx);
    renderDigit( MARGIN_LEFT + 38*2*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),ctx);
    renderDigit( MARGIN_LEFT + 46*2*(RADIUS+1), MARGIN_TOP, seconds%10, ctx);
    // renderDigit

    for( var i=0 ; i<balls.length ; i++ ){

        ctx.fillStyle = balls[i].color;
        ctx.beginPath();
        ctx.arc( balls[i].x , balls[i].y , balls[i].r , 0 , 2*Math.PI ,false )
        ctx.closePath();
        ctx.fill();
    }
}

function renderDigit( x , y , num , ctx ){
    /* 绘制数字，
       参数:1.绘制的起点，
            2.绘制的数字（个位数），
            从digit.js文件中的数组拿到要绘制的二维数组(7*10)
            从而获取到要绘制圆球的位置



            3.上下文绘图环境
    */


    ctx.fillStyle = 'rgb(0,102,153)';

    //digit[num]对应的二维数组就是num的点阵数组
    //
    //
    for( var i = 0; i < digit[num].length ; i++ ){
        for( var j = 0; j < digit[num][i].length; j++ ){
        //digit[num][i]为二维数组中的行
            if(digit[num][i][j]==1){
            //dig[num][i][j]为数组中对应的值，如果为1的话，表明要在这个位置绘制小球,


        /* i即行数
           j即列数
           我们要在点阵(j,i)处画一个小球
           假设每个小球处在一个方格内，那么为了美观，让小球与方格四周有1px的距离。
           所以，假设小球的半径为r，则每个方格的长度为2*(r+1);
           在点阵中坐标为(j,i)的小球的圆心为（centerX,centerY）
           centerX = x+2(r+1)*j+(r+1)
           centerY = y+2(r+1)*i+(r+1)
        */

                ctx.beginPath();
                ctx.arc( x + 2*(RADIUS+1)*j+(RADIUS+1), y+2*(RADIUS+1)*i+(RADIUS+1) , RADIUS , 0 , Math.PI*2 );
                ctx.closePath();

                ctx.fill();
            }
        }
    }
}
