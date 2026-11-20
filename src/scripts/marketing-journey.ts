export type JourneyFrame = { screen: string; focus: string; zoom: number; duration: number; chapter: number; menu?: boolean; menuGroup?: string; state?: string; cursor?: string; click?: boolean; scroll?: number };
const FRAMES: JourneyFrame[] = [
  {screen:'report',focus:'report-overview',zoom:1,duration:2200,chapter:0},
  {screen:'report',focus:'investment',zoom:2.15,duration:1800,chapter:0},
  {screen:'report',focus:'leads',zoom:2.15,duration:1700,chapter:0},
  {screen:'report',focus:'conversations',zoom:2.15,duration:1700,chapter:0},
  {screen:'report',focus:'sales',zoom:2.15,duration:1700,chapter:0},
  {screen:'report',focus:'roas',zoom:2.15,duration:1900,chapter:0},
  {screen:'report',focus:'menu-marketing',zoom:1.7,duration:850,chapter:1,cursor:'menu-marketing',click:true},
  {screen:'report',focus:'nav-conversions',zoom:1.7,duration:1400,chapter:1,menu:true,cursor:'nav-conversions',click:true},
  {screen:'conversions',focus:'conversions-overview',zoom:1,duration:2000,chapter:1},
  {screen:'conversions',focus:'conversions-rule',zoom:1.8,duration:1800,chapter:1},
  {screen:'conversions',focus:'nav-campaigns',zoom:1.7,duration:1200,chapter:2,menu:true,cursor:'nav-campaigns',click:true},
  {screen:'campaigns',focus:'new-campaign',zoom:1.55,duration:1600,chapter:2,cursor:'new-campaign',click:true},
  {screen:'composer',focus:'channel-options',zoom:1.8,duration:2500,chapter:2},
  {screen:'campaigns',focus:'nav-rules',zoom:1.7,duration:1500,chapter:3,menu:true,cursor:'nav-rules',click:true},
  {screen:'rules',focus:'edit-rule',zoom:1.55,duration:1800,chapter:3,cursor:'edit-rule',click:true},
  {screen:'rule-editor',focus:'rule-inspector',zoom:1.3,duration:1800,chapter:3,scroll:0},
  {screen:'rule-editor',focus:'rule-inspector',zoom:1.5,duration:3500,chapter:3,scroll:260},
  {screen:'conversation',focus:'conversation-overview',zoom:1,duration:1800,chapter:4},
  {screen:'conversation',focus:'attribution-origin',zoom:2,duration:3200,chapter:4},
  {screen:'report',focus:'report-overview',zoom:1,duration:2600,chapter:4},
];
const STARTS = FRAMES.map((_,index) => FRAMES.slice(0,index).reduce((sum,frame) => sum+frame.duration,0));
const DURATION = FRAMES.reduce((sum,frame) => sum+frame.duration,0);
const CHAPTER_FRAMES = [0,8,12,16,18];
export type JourneyCopy = { title:string;demo:string;label:string;play:string;pause:string;replay:string;expand:string;collapse:string;chapters:string[];captions:string[] };
type Camera = { x:number;y:number;zoom:number };
const smooth = (n:number) => {const p=Math.max(0,Math.min(1,n));return p*p*(3-2*p);};
const lerp = (a:number,b:number,p:number) => a+(b-a)*p;
const clock = (ms:number) => `${Math.floor(ms/60000).toString().padStart(2,'0')}:${Math.floor((ms/1000)%60).toString().padStart(2,'0')}`;

class ProductJourney extends HTMLElement {
  private frames=FRAMES;
  private starts=STARTS;
  private duration=DURATION;
  private chapterFrames=CHAPTER_FRAMES;
  private abort?:AbortController;
  private viewport?:HTMLElement;
  private world?:HTMLElement;
  private caption?:HTMLElement;
  private copy?:JourneyCopy;
  private progress?:HTMLElement;
  private timeLabel?:HTMLElement;
  private cursor?:HTMLElement;
  private screens:HTMLElement[]=[];
  private targets=new Map<string,HTMLElement>();
  private chapters:HTMLButtonElement[]=[];
  private media=matchMedia('(prefers-reduced-motion: reduce)');
  private intersection?:IntersectionObserver;
  private resize?:ResizeObserver;
  private time=0;
  private last=0;
  private raf=0;
  private visible=false;
  private wanted=true;
  private optedIn=false;
  private index=-1;
  private chapter=-1;
  private camera:Camera={x:560,y:350,zoom:1};
  private from:Camera={x:560,y:350,zoom:1};
  private cursorFrom={x:32,y:170};
  private cursorPosition={x:32,y:170};
  private lastScroll=0;
  private fromScroll=0;

  connectedCallback() {
    if(this.abort)return;
    this.abort=new AbortController();
    const {signal}=this.abort;
    this.viewport=this.querySelector<HTMLElement>('[data-mj-viewport]')??undefined;
    this.world=this.querySelector<HTMLElement>('[data-mj-world]')??undefined;
    if(!this.viewport||!this.world)return;
    try{
      this.copy=JSON.parse(this.dataset.copy||'{}');
      if(this.dataset.frames){
        const frames:JourneyFrame[]=JSON.parse(this.dataset.frames);
        if(!frames.length||frames.some(frame=>!Number.isFinite(frame.duration)||frame.duration<=0))return;
        this.frames=frames;
        this.starts=frames.map((_,index)=>frames.slice(0,index).reduce((sum,frame)=>sum+frame.duration,0));
        this.duration=frames.reduce((sum,frame)=>sum+frame.duration,0);
      }
      if(this.dataset.chapterFrames)this.chapterFrames=JSON.parse(this.dataset.chapterFrames);
    }catch{return;}
    this.caption=this.querySelector<HTMLElement>('[data-mj-caption]')??undefined;
    this.progress=this.querySelector<HTMLElement>('[data-mj-progress]')??undefined;
    this.timeLabel=this.querySelector<HTMLElement>('[data-mj-time]')??undefined;
    this.cursor=this.querySelector<HTMLElement>('[data-mj-cursor]')??undefined;
    this.screens=Array.from(this.querySelectorAll<HTMLElement>('[data-j-screen]'));
    this.querySelectorAll<HTMLElement>('[data-j-target]').forEach(el=>this.targets.set(el.dataset.jTarget||'',el));
    this.chapters=Array.from(this.querySelectorAll<HTMLButtonElement>('[data-mj-chapter]'));
    this.wanted=!this.media.matches;
    this.querySelector('[data-mj-play]')?.addEventListener('click',()=>{this.optedIn=true;this.wanted=!this.wanted;this.sync();},{signal});
    this.querySelector('[data-mj-replay]')?.addEventListener('click',()=>{this.time=0;this.index=-1;this.camera={x:560,y:350,zoom:1};this.optedIn=true;this.wanted=true;this.render();this.sync();},{signal});
    this.chapters.forEach((button,i)=>button.addEventListener('click',()=>{const index=this.chapterFrames[i];this.time=this.starts[index]+Math.min(1200,this.frames[index].duration*.55);this.index=-1;this.render(true);this.sync();},{signal}));
    const expand=this.querySelector<HTMLButtonElement>('[data-mj-expand]');
    if(expand&&document.fullscreenEnabled&&this.requestFullscreen){expand.hidden=false;expand.addEventListener('click',()=>{if(document.fullscreenElement===this)document.exitFullscreen().catch(()=>{});else this.requestFullscreen().catch(()=>{});},{signal});}
    document.addEventListener('fullscreenchange',()=>{if(expand&&this.copy){const label=document.fullscreenElement===this?this.copy.collapse:this.copy.expand;expand.setAttribute('aria-label',label);expand.title=label;}this.render();},{signal});
    document.addEventListener('visibilitychange',()=>this.sync(),{signal});
    this.media.addEventListener('change',()=>{if(this.media.matches){this.wanted=false;this.optedIn=false;}this.sync();},{signal});
    if(typeof IntersectionObserver !== 'undefined'){this.intersection=new IntersectionObserver(entries=>{this.visible=entries.some(entry=>entry.isIntersecting);this.sync();},{threshold:.15});this.intersection.observe(this);}else this.visible=true;
    if(typeof ResizeObserver !== 'undefined'){this.resize=new ResizeObserver(()=>this.render(true));this.resize.observe(this.viewport);}else window.addEventListener('resize',()=>this.render(true),{signal});
    this.dataset.ready='true';this.render();this.sync();
  }

  disconnectedCallback(){this.abort?.abort();this.abort=undefined;this.intersection?.disconnect();this.resize?.disconnect();cancelAnimationFrame(this.raf);this.raf=0;}

  private get running(){return this.wanted&&this.visible&&!document.hidden&&(!this.media.matches||this.optedIn);}
  private sync(){
    const playing=this.running;
    this.dataset.playing=String(playing);
    const button=this.querySelector<HTMLButtonElement>('[data-mj-play]');
    const label=this.querySelector<HTMLElement>('[data-mj-play-label]');
    const icon=this.querySelector<HTMLElement>('[data-mj-play-icon]');
    const action=this.wanted?this.copy?.pause:this.copy?.play;
    if(action){button?.setAttribute('aria-label',action);if(label)label.textContent=action;}
    if(icon)icon.dataset.state=this.wanted?'pause':'play';
    if(!playing){cancelAnimationFrame(this.raf);this.raf=0;this.last=0;return;}
    if(!this.raf){this.last=0;this.raf=requestAnimationFrame(stamp=>this.tick(stamp));}
  }

  private tick(stamp:number){
    if(!this.running){this.raf=0;return;}
    if(this.last)this.time=(this.time+Math.min(stamp-this.last,80))%this.duration;
    this.last=stamp;this.render();this.raf=requestAnimationFrame(next=>this.tick(next));
  }

  private point(key:string){
    const element=this.targets.get(key);
    if(!element||!this.world)return{x:560,y:350};
    let x=element.offsetWidth/2,y=element.offsetHeight/2;
    let node:HTMLElement|null=element;
    while(node&&node!==this.world){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent as HTMLElement|null;}
    return{x,y};
  }

  private render(instant=false){
    if(!this.viewport||!this.world)return;
    let index=this.starts.findIndex((start,i)=>this.time>=start&&this.time<start+this.frames[i].duration);
    if(index<0)index=0;
    const frame=this.frames[index];
    if(index!==this.index){
      this.from={...this.camera};this.cursorFrom={...this.cursorPosition};this.fromScroll=this.frames[this.index]?.screen===frame.screen?this.lastScroll:0;
      this.index=index;this.dataset.frame=String(index);this.dataset.scene=frame.screen;this.dataset.state=frame.state||'';this.dataset.menuGroup=frame.menuGroup||'';
      this.screens.forEach(screen=>screen.classList.toggle('is-active',screen.dataset.jScreen===frame.screen));
      this.targets.forEach((target,key)=>target.classList.toggle('is-emphasized',key===frame.focus&&!frame.menu&&frame.zoom>1));
      if(this.caption&&this.copy)this.caption.textContent=this.copy.captions[index]||'';
      if(frame.chapter!==this.chapter){this.chapter=frame.chapter;this.chapters.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===frame.chapter)));}
    }
    const phase=(this.time-this.starts[index])/frame.duration;
    const position=this.point(frame.focus);
    const small=this.viewport.clientWidth<500;
    const zoom=frame.zoom===1?1:Math.min(3,frame.zoom*(small?1.34:1));
    const p=instant?1:smooth(Math.min(1,(this.time-this.starts[index])/Math.min(1050,frame.duration*.6)));
    this.camera={x:lerp(this.from.x,position.x,p),y:lerp(this.from.y,position.y,p),zoom:lerp(this.from.zoom,zoom,p)};
    const width=this.viewport.clientWidth,height=this.viewport.clientHeight;
    const scale=width/1120*this.camera.zoom;
    const visibleWidth=width/scale,visibleHeight=height/scale;
    const x=visibleWidth>=1120?560:Math.max(visibleWidth/2,Math.min(1120-visibleWidth/2,this.camera.x));
    const y=visibleHeight>=700?350:Math.max(visibleHeight/2,Math.min(700-visibleHeight/2,this.camera.y));
    this.world.style.transform=`translate3d(${width/2-x*scale}px,${height/2-y*scale}px,0) scale(${scale})`;
    this.style.setProperty('--mj-menu-opacity',String(frame.menu?smooth(Math.min(1,phase*5)):0));
    this.lastScroll=lerp(this.fromScroll,frame.scroll||0,smooth(Math.min(1,phase*1.25)));
    this.style.setProperty('--mj-rule-scroll',String(this.lastScroll));
    if(this.cursor){
      const destination=this.point(frame.cursor||frame.focus);
      const cp=smooth(Math.min(1,phase*2.2));
      this.cursorPosition={x:lerp(this.cursorFrom.x,destination.x,cp),y:lerp(this.cursorFrom.y,destination.y,cp)};
      this.cursor.style.transform=`translate3d(${this.cursorPosition.x}px,${this.cursorPosition.y}px,0)`;
      this.cursor.style.opacity=frame.cursor?'1':'0';
      const ring=this.cursor.querySelector<HTMLElement>('span');
      const click=Math.max(0,Math.min(1,(phase-.68)/.25));
      if(ring){ring.style.opacity=frame.click&&click>0?String(1-click):'0';ring.style.transform=`scale(${.3+click*1.3})`;}
    }
    if(this.progress)this.progress.style.transform=`scaleX(${this.time/this.duration})`;
    const timeText=`${clock(this.time)} / ${clock(this.duration)}`;
    if(this.timeLabel&&this.timeLabel.textContent!==timeText)this.timeLabel.textContent=timeText;
  }
}

if(!customElements.get('marketing-journey'))customElements.define('marketing-journey',class extends ProductJourney{});
if(!customElements.get('sales-journey'))customElements.define('sales-journey',class extends ProductJourney{});

if(!customElements.get('support-journey'))customElements.define('support-journey',class extends ProductJourney{});

if(!customElements.get('operations-journey'))customElements.define('operations-journey',class extends ProductJourney{});
