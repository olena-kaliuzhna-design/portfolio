/* Animated cards stack (vanilla port of animated-cards-stack).
   The section is tall; its inner frame sticks to the screen. Cards lie in a fanned pile,
   straighten out as you scroll, then fly up one by one; the last card stays.
   Progress = framer-motion useScroll offset ["start center", "end end"]. */
(function(){
  var root=document.querySelector('[data-cards-stack]');
  if(!root)return;
  var cards=[].slice.call(root.querySelectorAll('.cs-card'));
  var N=cards.length;if(!N)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){root.classList.add('cs-static');return;}
  var INC_Y=10,INC_Z=10,raf=null;
  function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
  function map(p,a,b,from,to){if(b===a)return to;var t=clamp((p-a)/(b-a),0,1);return from+(to-from)*t;}
  cards.forEach(function(c,j){
    var index=j+2;                       /* as in the demo: index + 2, so the last card never leaves */
    c.style.top=(j*INC_Y)+'px';
    c.style.zIndex=String(N+2-index);
    c._i=index;
  });
  function progress(){
    var r=root.getBoundingClientRect(),h=innerHeight;
    return clamp((h/2-r.top)/(r.height-h/2),0,1);
  }
  function paint(){
    raf=null;
    var p=progress();
    for(var j=0;j<N;j++){
      var c=cards[j],index=c._i;
      var start=index/(N+1),end=(index+1)/(N+1);
      var r0=start-1.5,r1=end/1.5;
      var y=map(p,start,end,0,-180);
      var rot=map(p,r0,r1,90-index,0);
      var dx=map(p,r0,r1,4,0),dy=map(p,r0,r1,4,12),blur=map(p,r0,r1,2,24),alpha=map(p,r0,r1,.15,.2);
      c.style.transform='translateZ('+(index*INC_Z)+'px) translateY('+y.toFixed(2)+'%) rotate('+rot.toFixed(2)+'deg)';
      c.style.filter='drop-shadow('+dx.toFixed(1)+'px '+dy.toFixed(1)+'px '+blur.toFixed(1)+'px rgba(0,0,0,'+alpha.toFixed(3)+'))';
    }
  }
  function kick(){if(!raf)raf=requestAnimationFrame(paint);}
  addEventListener('scroll',kick,{passive:true});
  addEventListener('resize',kick);
  paint();
})();
