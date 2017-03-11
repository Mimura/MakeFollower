// import hoge = require('./module/_mod');

// hoge.func1();

// $(function () {
//     alert("hoggge");
// });
function AnimationTop() {
    let camome :Vivus = new Vivus('x-svg-camome', {start: "autostart",file: '/public/img/camome.svg', type: 'oneByOne', duration: 1000}); 
    camome.play();
}

$(window).load(function () {
    setTimeout(function(){
        AnimationTop();
    },3000);
});

// new Vivus('x-remove-vec', {start: 'autostart', type: 'delayed', duration: 200}); 
// new Vivus('x-follower-vec', {start: 'autostart', type: 'delayed', duration: 200}); 
// new Vivus('x-return-vec', {start: 'autostart', type: 'delayed', duration: 200}); 
// new Vivus('x-peke', {start: 'autostart', type: 'delayed', duration: 200}); 
