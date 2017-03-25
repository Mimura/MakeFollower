// import hoge = require('./module/_mod');

// hoge.func1();

// $(function () {
//     alert("hoggge");
// });

function AnimationTop() :void{
    let camome :Vivus = new Vivus('x-svg-camome', {start: "autostart",file: '/public/img/camome.svg', type: 'oneByOne', duration: 800}); 
}

function TweenButton(delay = 0) :void{
    TweenMax.from('#x-top-button', 1, { y: 200, autoAlpha:0, delay:delay});
}

function TweenTheme(delay = 0,callBack :() => void = null) :void{
    TweenMax.from('#x-theme-wrapper', 1, { y: -400, autoAlpha: 0, delay: delay,onComplete: callBack});
}

$(window).load(function () {
    // setTimeout(function(){
    // },1000);
    TweenTheme(0.1,() => AnimationTop());
    TweenButton(7.5);
});

// var $svg = Snap( '#svg path' ); //動かしたいpath要素
// var path = 'M22,62c0,0,68-52,156-46s100,34,196,34S512,7,566,15.5S740,18,740,102s-58,152-28,182s-217.2,52-321.6,0S110,356,52,306s8-920-152S8,142,22,62z'; //アニメーション後のパス

// $svg.animate({d: path }, 3000 );
//要素.animate({d: 移動後のパス }, 'アニメーション時間' );
