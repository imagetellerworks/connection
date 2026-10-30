/* Shared UI adapter. Original controls are moved, never cloned, so their handlers and state survive. */
(() => {
  'use strict';
  const script = document.querySelector('script[data-scene]');
  const scene = script.dataset.scene;
  const q = new URLSearchParams(location.search);
  // The projector deliberately keeps its original full-bleed presentation.
  if (window.self !== window.top || q.get('mode') === 'display' || (scene === 'birds' && q.get('panel') === '0')) return;
  const body = document.body;
  const titles = {
    birds:['birds','손끝을 따라, 함께 흐르는 철새의 움직임.'],
    connection:['connection','밤하늘의 점과 점을, 손끝으로 이어 보세요.'],
    call_map:['map','도움이 필요한 순간과, 함께할 사람을 연결해요.'],
    call_loop:['angel call','필요한 순간의 이야기가 하나씩 떠올라요.'],
    message_projection:['messages','우리의 이야기를 움직이는 화면에 담아요.'],
    promo_intro:['part-time angels','파트타임 엔젤의 이야기를 만나 보세요.'],
    touch:['touch','손끝의 움직임이 무대 위로 이어집니다.'],
    control:['part-time angels','장면을 고르고, 공연의 흐름을 이어가세요.']
  };
  body.classList.add('pta-ui',`pta-${scene}`);
  document.documentElement.classList.add('pta-page');
  document.querySelector('meta[name=theme-color]')?.setAttribute('content','#f4f3f6');
  const head = document.createElement('header');head.className='pta-head';
  const [title,description]=titles[scene];
  head.innerHTML=`<p class="pta-eyebrow">PART-TIME ANGELS · INTERACTIVE</p><h1 class="pta-title">${title}</h1><p class="pta-description">${description}</p>`;
  const nav=document.createElement('nav');nav.className='pta-nav';nav.setAttribute('aria-label','작품 선택');
  const inScenes=location.pathname.includes('/scenes/');
  [['birds','birds'],['connection','connection'],['call_map','map'],['call_loop','call'],['message_projection','message']].forEach(([file,label])=>{
    const a=document.createElement('a');a.href=(inScenes?'':'scenes/')+file+'.html';a.textContent=label;
    if(scene===file)a.setAttribute('aria-current','page');nav.append(a);
  });
  if(!['touch','birds','connection'].includes(scene))head.append(nav);
  body.prepend(head);
  function element(tag,cls){const e=document.createElement(tag);e.className=cls;return e}
  function caption(text){const e=element('p','pta-caption');e.textContent=text;return e}
  // The native dialog keeps focus and touch interaction inside the artwork introduction.
  const aboutButton=element('button','pta-about-button');aboutButton.type='button';aboutButton.textContent='about';
  aboutButton.setAttribute('aria-label','About · 작품 소개');aboutButton.setAttribute('aria-haspopup','dialog');aboutButton.setAttribute('aria-controls','pta-about');
  head.append(aboutButton);
  const about=element('dialog','pta-about');about.id='pta-about';about.setAttribute('aria-labelledby','pta-about-title');
  about.innerHTML='<div class="pta-about-heading"><h2 id="pta-about-title">about</h2><button type="button" class="pta-about-close" aria-label="작품 소개 닫기" autofocus>×</button></div><p class="pta-about-kicker">PART-TIME ANGELS · INTERACTIVE</p><p>연극 &lt;파트타임엔젤&gt; 속 한 장면을 위해 기획·제작된 터치 기반의 인터랙티브 제너레이티브 아트입니다.</p><p>모바일에서는 화면을 직접 터치하며 작품의 움직임을 만들어 갈 수 있습니다.</p><p>공연과 전시에서는 프로젝션 전체 화면으로 작품을 펼치고, 아이패드를 컨트롤 패널로 활용해 조작할 수 있습니다.</p><section class="pta-about-english" lang="en" aria-label="English"><p>This touch-based interactive generative artwork was conceived and created for a scene in the play &lt;Part-Time Angels&gt;.</p><p>On mobile devices, you can shape the movement of the artwork by touching the screen.</p><p>For performances and exhibitions, the artwork can be projected in full screen and operated using an iPad as a control panel.</p></section>';
  body.append(about);
  aboutButton.onclick=()=>about.showModal();
  about.querySelector('.pta-about-close').onclick=()=>about.close();
  about.addEventListener('keydown',e=>e.stopPropagation());
  about.addEventListener('click',e=>{if(e.target===about){const r=about.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)about.close();}});
  if(scene==='birds'){
    const sky=document.getElementById('sky'),panel=document.getElementById('panel');
    const main=element('main','pta-main');head.after(main);main.append(sky,caption('한 손가락으로 흩뜨리기 · 두 손가락으로 확대·축소'));
    const dock=element('div','pta-dock');dock.setAttribute('aria-label','철새 조작');
    const icons={settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>',pause:'<path d="M9 5v14M15 5v14"/>',enter:'<path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/>',view:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>'};
    [['gesture','settings','흩뜨리기'],['pause','pause','일시정지'],['enter','enter','재진입'],['sky-theme','view','하늘색']].forEach(([id,ic,label])=>{
      const b=element('button','');b.type='button';b.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[ic]}</svg><span>${label}</span>`;
      b.addEventListener('click',()=>{
        if(id==='gesture'){
          const select=document.getElementById('gesture');
          select.value=select.value==='scatter'?'guide':'scatter';select.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(id==='sky-theme')document.getElementById('skyCycle').click();
        else document.getElementById(id).click();
      });
      if(id==='sky-theme'){
        const original=document.getElementById('skyCycle');b.title='하늘색 바꾸기';
        const swatch=element('i','pta-sky-swatch');swatch.setAttribute('aria-hidden','true');b.querySelector('svg').replaceWith(swatch);
        const sync=()=>{b.querySelector('span').textContent=original.textContent;swatch.style.backgroundImage=original.style.getPropertyValue('--sky-swatch');};
        new MutationObserver(sync).observe(original,{childList:true,subtree:true,characterData:true});sync();
      }
      if(id==='gesture'){
        const select=document.getElementById('gesture');
        const sync=()=>{b.querySelector('span').textContent={scatter:'흩뜨리기',guide:'유도하기',off:'터치 꺼짐'}[select.value];};
        select.addEventListener('change',sync);new MutationObserver(sync).observe(document.getElementById('panel'),{attributes:true,subtree:true,attributeFilter:['aria-pressed']});sync();
      }
      if(id==='toggle'){
        b.setAttribute('aria-controls','panel');
        const sync=()=>b.setAttribute('aria-expanded',String(!body.classList.contains('panel-hidden')));
        new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['class']});sync();
      }
      if(id==='pause'){
        const original=document.getElementById('pause');
        const sync=()=>{b.querySelector('span').textContent=original.textContent;b.setAttribute('aria-label',original.textContent);};
        new MutationObserver(sync).observe(original,{childList:true,subtree:true});sync();
      }
      dock.append(b);
    });main.append(dock,panel);
    panel.querySelector('h1').textContent='움직임과 화면';
    panel.querySelectorAll('details[open]').forEach(d=>d.open=false);
    const exit=element('button','pta-exit');exit.textContent='← 조작 화면';exit.onclick=()=>{body.classList.remove('clean');window.dispatchEvent(new Event('resize'));};body.append(exit);
    new MutationObserver(()=>window.dispatchEvent(new Event('resize'))).observe(body,{attributes:true,attributeFilter:['class']});
  }
  if(scene==='call_loop'||scene==='message_projection'){
    body.classList.add('pta-loop');
    const rail=document.querySelector('.rail');const sections=[...rail.querySelectorAll(':scope>.sec')];
    // Playback stays visible. Advanced panels retain their actual DOM and listeners.
    sections.slice(1).forEach(sec=>{
      const details=element('details','pta-more'),summary=document.createElement('summary');
      summary.textContent=sec.querySelector('.lab')?.textContent||'설정';
      sec.before(details);details.append(summary,sec);
      if(sec.querySelector('.lab'))sec.querySelector('.lab').hidden=true;
    });
  }
  if(scene==='touch'){
    const stage=element('main','pta-touch-stage');
    const oldHead=document.querySelector('.head');oldHead.after(stage);
    stage.append(document.getElementById('pad'),document.getElementById('inactive'));
  }
  if(scene==='call_map'){
    document.querySelector('.brand .name').textContent='콜 관제';
    document.querySelector('.brand .sub').textContent='함께할 사람을 찾는 중';
    document.getElementById('btn-admin').setAttribute('aria-label','통계와 설정 열기');
  }
  // When Connection changes to display mode inside the current tab, restore its projection UI.
  if(scene==='connection'){
    const sync=()=>{
      const display=body.dataset.mode==='display';
      body.classList.toggle('pta-ui',!display);head.hidden=display;
      document.documentElement.classList.toggle('pta-page',!display);
    };
    new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['data-mode']});sync();
  }
  if(scene==='birds'||scene==='connection'){
    body.classList.add('pta-immersive');
    const panel=document.querySelector(scene==='birds'?'#panel':'.control-panel');
    if(!panel.id)panel.id='pta-detail-panel';
    panel.classList.add('pta-drawer');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-label',scene==='birds'?'철새 컨트롤 패널':'Connection 컨트롤 패널');
    const scrim=element('div','pta-scrim');scrim.setAttribute('aria-hidden','true');
    const menu=element('button','pta-menu');menu.type='button';menu.setAttribute('aria-label','컨트롤 패널 열기');menu.setAttribute('aria-controls',panel.id);
    menu.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h14"/></svg>';
    body.append(scrim,panel);
    const dock=document.querySelector(scene==='birds'?'.pta-dock':'.transport');
    dock.classList.add('pta-five-controls');dock.append(menu);
    let opened=false;
    const visibleControls=()=>[...panel.querySelectorAll('button,input,select,textarea,summary,a[href],[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
    const sync=(show,focus=false)=>{
      if(!show&&panel.contains(document.activeElement))menu.focus();
      opened=show;body.classList.toggle('pta-panel-open',show);panel.inert=!show;
      panel.setAttribute('aria-hidden',String(!show));menu.setAttribute('aria-expanded',String(show));
      menu.setAttribute('aria-label',show?'컨트롤 패널 닫기':'컨트롤 패널 열기');
      menu.innerHTML=show?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h14"/></svg>';
      if(focus){if(show)(visibleControls()[0]||panel).focus();else menu.focus();}
    };
    const setOpen=(show)=>{
      if(scene==='birds'){
        const hidden=body.classList.contains('panel-hidden');
        if(show===hidden)document.getElementById('toggle').click();
      }
      sync(show,true);
    };
    menu.onclick=()=>setOpen(!opened);scrim.onclick=()=>setOpen(false);
    if(scene==='birds'){
      document.getElementById('close').click();
      new MutationObserver(()=>{
        const show=!body.classList.contains('panel-hidden');
        if(show!==opened)sync(show);
      }).observe(body,{attributes:true,attributeFilter:['class']});
    }else{
      document.querySelector('#sequenceBtn .button-content>span').textContent='점과선';
      document.getElementById('sequenceBtn').setAttribute('aria-label','점과 선 시퀀스 재생');
      for(const [id,path] of [['pulseBtn','<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>'],]){
        const b=document.getElementById(id),label=b.textContent;
        b.innerHTML='<span class="button-content"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg><span>'+label+'</span></span>';
      }
      for(const [id,label] of [['tab-scenes','장면저장'],['resetBtn','초기화'],['explodeBtn','흩뜨리기'],['gatherBtn','모으기'],['savePresetBtn','설정저장'],['exportBtn','내보내기'],['importBtn','불러오기']])document.getElementById(id).textContent=label;
      const blackout=document.getElementById('blackoutBtn');
      const motionButton=element('button','pta-motion-cycle');motionButton.type='button';
      motionButton.innerHTML='<span class="button-content"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c3-8 7-8 10 0s7 8 10 0"/></svg><span></span></span>';
      blackout.before(motionButton);blackout.hidden=true;panel.append(blackout);
      const modes=['flow','orbit','gather','breathe'],names={flow:'흐르기',orbit:'공전',gather:'모이기',breathe:'숨쉬기'};
      const currentMotion=()=>document.querySelector('[data-motion][aria-pressed="true"]')?.dataset.motion||'flow';
      const syncMotion=()=>{const mode=currentMotion(),next=modes[(modes.indexOf(mode)+1)%modes.length];motionButton.querySelector('span>span').textContent=names[mode];motionButton.setAttribute('aria-label','움직임: '+names[mode]+'. 누르면 '+names[next]);};
      motionButton.onclick=()=>{const next=modes[(modes.indexOf(currentMotion())+1)%modes.length];document.querySelector('[data-motion="'+next+'"]').click();syncMotion();};
      new MutationObserver(syncMotion).observe(panel.querySelector('.modes'),{subtree:true,attributes:true,attributeFilter:['aria-pressed']});syncMotion();
      const close=element('button','pta-panel-close');close.type='button';close.setAttribute('aria-label','컨트롤 패널 닫기');close.textContent='×';close.onclick=()=>setOpen(false);
      panel.querySelector('.panel-head').append(close);
      const tools=document.querySelector('.top-actions');panel.querySelector('.panel-head').after(tools);
      const notice=document.querySelector('.notice');if(notice)panel.append(notice);
    }
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){setOpen(false);return;}
      if(e.key==='Tab'&&opened){
        const items=[...visibleControls(),menu],first=items[0],last=items[items.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    sync(false);
  }
  if(scene==='birds'||scene==='connection') installLanguage();
  requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));

  function installLanguage(){
    // Translate presentation nodes only; control values, saved names and artwork state stay intact.
    const dictionary = {
      '손끝을 따라, 함께 흐르는 철새의 움직임.':'A flock in motion, flowing with your touch.',
      '밤하늘의 점과 점을, 손끝으로 이어 보세요.':'Connect the points of the night sky with your touch.',
      '연극 <파트타임엔젤> 속 한 장면을 위해 기획·제작된 터치 기반의 인터랙티브 제너레이티브 아트입니다.':'This touch-based interactive generative artwork was conceived and created for a scene in the play <Part-Time Angels>.',
      '모바일에서는 화면을 직접 터치하며 작품의 움직임을 만들어 갈 수 있습니다.':'On mobile devices, you can shape the movement of the artwork by touching the screen.',
      '공연과 전시에서는 프로젝션 전체 화면으로 작품을 펼치고, 아이패드를 컨트롤 패널로 활용해 조작할 수 있습니다.':'For performances and exhibitions, the artwork can be projected in full screen and operated using an iPad as a control panel.',
      'About · 작품 소개':'About the artwork','작품 소개 닫기':'Close About',
      '철새의 흐름 · Flocks':'Flocks','오른쪽에서 왼쪽으로 날아가는 철새 떼. 화면을 누르고 움직여 무리를 조절할 수 있습니다.':'A flock flying from right to left. Touch and drag to guide the birds.',
      '오른쪽에서 왼쪽으로, 함께 흐르는 움직임':'Flowing together, from right to left',
      '철새 움직임 설정':'Flock settings','철새의 흐름':'Flocks','패널 숨기기':'Hide panel',
      '무리의 형태':'Formation','V자 대열':'V shape','군무':'Flock','긴 흐름':'Ribbon',
      '터치 / 드래그':'Touch / drag','새 떼 흩뜨리기':'Scatter the flock','새 떼 유도하기':'Guide the flock','끄기':'Off',
      '터치 반응 조절':'Touch response','터치 강도':'Touch strength','터치 범위':'Touch radius',
      '새의 수':'Bird count','비행 속도':'Flight speed','무리의 퍼짐':'Spread','대열 유지':'Cohesion',
      '불규칙한 움직임':'Irregular motion','개체별 위글과 딜레이':'Individual wiggle and delay','개체별 속도 차이':'Speed variation',
      '위글 크기':'Wiggle amount','위글 빈도':'Wiggle frequency','반응 딜레이':'Response delay','모임 / 퍼짐의 리듬':'Gather / scatter rhythm','흐름의 굽이':'Flow curvature',
      '화면과 질감':'View and texture','새의 크기':'Bird size','줌':'Zoom','필름 입자':'Film grain','바람':'Wind',
      '흰 하늘':'Light sky','검은 하늘':'Dark sky','일시정지':'Pause','재생':'Play','다시 진입':'Re-enter','재진입':'Restart',
      '전체화면':'Full screen','초기 설정':'Defaults','탭하거나 누른 채 움직여 보세요.':'Tap or touch and drag.',
      '두 손가락으로 줌 · H 패널 · Space 정지':'Pinch to zoom · H panel · Space pause',
      '조작 패널':'Controls','영상만 보기':'Artwork only','움직임과 화면':'Motion and view','철새 조작':'Flock controls',
      '한 손가락으로 흩뜨리기 · 두 손가락으로 확대·축소':'One finger to scatter · Pinch to zoom',
      '흩뜨리기':'Scatter','유도하기':'Guide','터치 꺼짐':'Touch off','하늘색':'Sky','← 조작 화면':'← Controls',
      '철새 컨트롤 패널':'Flock control panel','Connection 컨트롤 패널':'Connection control panel','컨트롤 패널 열기':'Open controls','컨트롤 패널 닫기':'Close controls',
      '오른쪽 바깥에서 다시 날아옵니다':'The flock flies in again from the right.',
      '화면을 두 번 누르면 조작 패널이 열립니다':'Double-tap to open the controls.',
      '이 기기에서는 영상만 보기로 전환합니다':'Switching to artwork-only view on this device.',
      '전체화면을 지원하지 않는 브라우저입니다':'This browser does not support full screen.',
      '화면 복구 중입니다':'Restoring the artwork…',
      '이 브라우저에서 하늘 화면을 열 수 없습니다. 최신 Safari 또는 Chrome에서 다시 열어 주세요.':'The sky could not be rendered. Please open this page in an up-to-date Safari or Chrome browser.',
      'CONNECTIONS 스튜디오':'CONNECTIONS studio','기기 연결':'Connect devices','송출':'Projection','화면 열기':'Open display',
      '실시간 그래픽 미리보기':'Live artwork preview','미리보기 모드입니다. 아이폰·아이패드와 연결하려면 컴퓨터에서 동봉된 서버를 실행하세요.':'Preview mode. Run the included server on your computer to connect an iPhone or iPad.',
      '실시간 점·선 네트워크. 한 손가락으로 밀어내고 두 손가락으로 확대하세요.':'A live network of points and lines. Push with one finger and pinch to zoom.',
      '화면을 드래그해 점을 밀어내세요. 두 손가락으로 확대·축소.':'Drag to push the points away. Pinch to zoom.',
      '화면을 눌러 점을 끌어당기세요. 두 손가락으로 확대·축소.':'Touch to attract the points. Pinch to zoom.',
      '라이브 재생 조작':'Live playback controls','점 → 선 시퀀스':'Points → lines','점과선':'Connect','점과 선 시퀀스 재생':'Play the points-to-lines sequence',
      '호출':'Call','암전':'Blackout','암전 해제':'End blackout','비주얼 컨트롤 패널':'Visual control panel','컨트롤 패널':'Controls','컨트롤 카테고리':'Control categories',
      '비주얼':'Visual','움직임':'Motion','장면·저장':'Presets','장면저장':'Presets','점과 선의 색상':'Point and line colors','화이트':'White','레드':'Red','듀얼':'Dual',
      '흐르기':'Flow','공전하기':'Orbit','공전':'Orbit','모이기':'Gather','숨쉬기':'Breathe','밀어내기':'Repel','끌어당기기':'Attract',
      '전체 흩뜨리기':'Scatter all','중앙으로 모으기':'Gather to center','모으기':'Gather',
      '검은 미리보기 화면이 터치패드입니다. 한 손가락은 점을 움직이고, 두 손가락은 확대·축소합니다. 슬라이더 바깥에서는 평소처럼 스크롤할 수 있습니다.':'Use the black canvas as a touchpad. Move the points with one finger and pinch to zoom. Scroll normally outside the sliders.',
      '현재 설정 저장':'Save current settings','설정 내보내기':'Export settings','설정 불러오기':'Import settings','설정저장':'Save','내보내기':'Export','불러오기':'Import',
      '저장한 설정은 이 브라우저에 보관됩니다. 다른 기기로 옮길 때는 JSON 파일로 내보내세요.':'Presets are stored in this browser. Export a JSON file to move them to another device.',
      '장면 전환':'Scenes','송출 메뉴':'Projection menu','기본값으로 초기화 ↺':'Reset to defaults ↺','초기화':'Reset',
      '전체화면으로 송출':'Project in full screen','메뉴 숨기기':'Hide menu','스튜디오':'Studio',
      '전체화면으로 전환한 뒤 메뉴가 사라집니다. H 키로 메뉴를 다시 여세요.':'The menu hides in full screen. Press H to show it again.','닫기':'Close',
      '점의 수':'Point count','연결 거리':'Link distance','점 크기':'Point size','선 굵기':'Line width','선 밝기':'Line opacity','전체 밝기':'Brightness',
      '빨간 점 비율':'Red point ratio','움직임 속도':'Motion speed','잔상':'Trails','확대·축소':'Zoom',
      '고립':'Isolate','점으로 남아 있기':'Remain as separate points','신호와 함께 깨어나기':'Awaken with a signal',
      '연결':'Connect','하나의 네트워크 되기':'Become one network','붕괴':'Collapse','연결을 풀고 흩어지기':'Release the links and scatter',
      '아직 저장한 설정이 없습니다.':'No saved presets yet.','이름 없는 설정':'Untitled preset','설정':'Settings',
      '이 브라우저에서 다시 불러올 장면 이름을 정하세요.':'Name this scene so you can load it again in this browser.','장면 이름':'Scene name','저장하기':'Save',
      '저장한 설정을 적용했습니다.':'Saved preset applied.','설정을 저장했습니다.':'Preset saved.','설정 파일을 불러왔습니다.':'Settings imported.',
      '브라우저 저장소를 사용할 수 없습니다. JSON 내보내기를 사용하세요.':'Browser storage is unavailable. Please export a JSON file.',
      '18초 동안 점이 하나씩 연결됩니다.':'The points will connect one by one over 18 seconds.','기본 설정으로 되돌렸습니다.':'Default settings restored.',
      '아직 연결되지 않았습니다. 기기 연결 상태를 확인하세요.':'Not connected yet. Check the device connection.',
      '명령을 보내지 못했습니다. 연결을 다시 확인하고 있어요.':'The command could not be sent. Checking the connection.',
      '서버에 접속할 수 없습니다. 주소와 Wi-Fi를 확인하세요.':'Cannot reach the server. Check the address and Wi-Fi.',
      '팝업이 차단되었습니다. 브라우저에서 팝업을 허용하세요.':'The pop-up was blocked. Please allow pop-ups in your browser.',
      '이 브라우저에서는 전체화면 버튼을 지원하지 않습니다. 컴퓨터의 전체화면 기능을 사용하세요.':'This browser does not support the full-screen button. Use your computer’s full-screen controls.',
      '브라우저가 전체화면 전환을 허용하지 않았습니다. F11 또는 브라우저 메뉴를 사용하세요.':'The browser blocked full screen. Use F11 or the browser menu.',
      '파일이 너무 큽니다.':'The file is too large.','CONNECTIONS 설정 파일이 아닙니다.':'This is not a CONNECTIONS settings file.','설정 값이 없습니다.':'No settings were found.',
      '색상':'COLOR PALETTE','움직임 방식':'MOVEMENT BEHAVIOR','터치 반응':'TOUCH INTERACTION','장면 선택':'LIVE SCENES / 01—04','저장한 설정':'YOUR PRESETS',
      'LOCAL PREVIEW / 이 기기에서만':'LOCAL PREVIEW / this device only',
      '하늘 색조합':'Sky palette','하늘색 바꾸기':'Change sky palette','평안':'Peace','갈등':'Conflict','싱그러움':'Freshness','설렘':'Flutter','희망':'Hope','그리움':'Longing','열정':'Passion','고요':'Stillness','위로':'Comfort','몽상':'Reverie'
    };
    let language='ko';try{language=localStorage.getItem('pta-language')==='en'?'en':'ko';}catch{}
    const reverse=new Map();for(const [ko,en] of Object.entries(dictionary))if(!reverse.has(en))reverse.set(en,ko);
    const sources=new WeakMap(),attributeSources=new WeakMap();
    const normalize=s=>s.replace(/\s+/g,' ').trim();
    function english(s){
      if(dictionary[s])return dictionary[s];
      if(/^\d+ 마리$/.test(s))return s.replace(' 마리',' birds');
      const motion=s.match(/^움직임: (.+)\. 누르면 (.+)$/);if(motion)return 'Motion: '+english(motion[1])+'. Next: '+english(motion[2]);
      const cue=s.match(/^(고립|호출|연결|붕괴) 장면$/);if(cue)return english(cue[1])+' scene';
      if(s.startsWith('불러오기 실패: '))return 'Import failed: '+english(s.slice(9));
      if(s.endsWith(' 삭제'))return 'Delete '+s.slice(0,-3);
      return s;
    }
    const aboutEnglish=about.querySelector('.pta-about-english');aboutEnglish?.remove();
    const tools=element('div','pta-head-tools');head.append(tools);tools.append(aboutButton);
    function switcher(){
      const group=element('div','pta-language');group.setAttribute('role','group');group.setAttribute('aria-label','Language / 언어');
      for(const [code,label] of [['en','EN'],['ko','KR']]){
        const button=element('button','');button.type='button';button.textContent=label;button.dataset.language=code;
        button.setAttribute('aria-label',code==='en'?'English':'한국어');
        button.onclick=()=>{language=code;try{localStorage.setItem('pta-language',code);}catch{}apply();};group.append(button);
      }return group;
    }
    tools.prepend(switcher());about.querySelector('.pta-about-heading').insertBefore(switcher(),about.querySelector('.pta-about-close'));
    document.getElementById('savePresetBtn')?.addEventListener('click',()=>{
      const name=document.getElementById('presetName');
      if(language==='en'&&name?.value==='나의 장면'){name.value='My scene';name.select();}
    });
    function translateText(node){
      const parent=node.parentElement;if(!parent||parent.closest('script,style,textarea,.pta-language,.saved-item'))return;
      const value=normalize(node.data);if(!value)return;
      let record=sources.get(node);
      if(!record||value!==record.output){record={source:dictionary[value]?value:(reverse.get(value)||value)};sources.set(node,record);}
      const output=language==='en'?english(record.source):record.source;
      record.output=output;if(value!==output)node.data=node.data.replace(node.data.trim(),output);
    }
    function translateAttributes(el){
      if(el.closest('.pta-language'))return;
      let records=attributeSources.get(el);if(!records){records={};attributeSources.set(el,records);}
      for(const name of ['aria-label','title','placeholder']){
        const value=el.getAttribute(name);if(!value)continue;
        let record=records[name];if(!record||value!==record.output)record=records[name]={source:dictionary[value]?value:(reverse.get(value)||value)};
        const output=language==='en'?english(record.source):record.source;
        record.output=output;if(value!==output)el.setAttribute(name,output);
      }
    }
    function translateTree(root){
      if(root.nodeType===Node.TEXT_NODE){translateText(root);return;}
      if(root.nodeType!==Node.ELEMENT_NODE)return;
      translateAttributes(root);
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){const n=walker.currentNode;if(n.nodeType===Node.TEXT_NODE)translateText(n);else translateAttributes(n);}
    }
    const observer=new MutationObserver(records=>{
      observer.disconnect();
      for(const r of records){if(r.type==='childList')r.addedNodes.forEach(translateTree);else if(r.type==='attributes')translateAttributes(r.target);else translateText(r.target);}
      observe();
    });
    function observe(){observer.observe(body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder']});}
    function apply(){
      observer.disconnect();document.documentElement.lang=language;
      body.classList.toggle('pta-english',language==='en');translateTree(body);
      document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
      if(scene==='birds')document.title=language==='en'?'Flocks':'철새의 흐름 · Flocks';
      observe();
    }
    window.addEventListener('storage',e=>{if(e.key==='pta-language'){language=e.newValue==='en'?'en':'ko';apply();}});
    apply();
  }
})();
