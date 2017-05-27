// import hoge = require('./module/_mod');
// hoge.func1();

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
    TweenTheme(0.1,() => AnimationTop());
    TweenButton(0);
});
