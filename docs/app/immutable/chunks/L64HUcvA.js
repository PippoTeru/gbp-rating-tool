import{$ as E,a0 as b,a1 as P,l as A,A as W,q as Y,z as $,a2 as B,a3 as L,J as C,a4 as j,a5 as z,a6 as T,v as w,u as D,r as F,c as p,a7 as J,a8 as X,a9 as G,aa as K,ab as Q,ac as U,I as Z,a as x,V as rr,F as tr,h as S,X as er}from"./DxVFdlLd.js";import{b as ar}from"./DV2Aajoc.js";const nr=["touchstart","touchmove"];function sr(r){return nr.includes(r)}let I=!1;function ir(){I||(I=!0,document.addEventListener("reset",r=>{Promise.resolve().then(()=>{var t;if(!r.defaultPrevented)for(const a of r.target.elements)(t=a.__on_r)==null||t.call(a)})},{capture:!0}))}function V(r){var t=P,a=A;E(null),b(null);try{return r()}finally{E(t),b(a)}}function dr(r,t,a,i=a){r.addEventListener(t,()=>V(a));const n=r.__on_r;n?r.__on_r=()=>{n(),i(!0)}:r.__on_r=()=>i(!0),ir()}const k=new Set,N=new Set;function or(r,t,a,i={}){function n(e){if(i.capture||y.call(t,e),!e.cancelBubble)return V(()=>a==null?void 0:a.call(this,e))}return r.startsWith("pointer")||r.startsWith("touch")||r==="wheel"?B(()=>{t.addEventListener(r,n,i)}):t.addEventListener(r,n,i),n}function lr(r,t,a,i,n){var e={capture:i,passive:n},u=or(r,t,a,e);(t===document.body||t===window||t===document)&&$(()=>{t.removeEventListener(r,u,e)})}function _r(r){for(var t=0;t<r.length;t++)k.add(r[t]);for(var a of N)a(r)}function y(r){var O;var t=this,a=t.ownerDocument,i=r.type,n=((O=r.composedPath)==null?void 0:O.call(r))||[],e=n[0]||r.target,u=0,_=r.__root;if(_){var d=n.indexOf(_);if(d!==-1&&(t===document||t===window)){r.__root=t;return}var v=n.indexOf(t);if(v===-1)return;d<=v&&(u=d)}if(e=n[u]||r.target,e!==t){W(r,"currentTarget",{configurable:!0,get(){return e||a}});var m=P,f=A;E(null),b(null);try{for(var s,o=[];e!==null;){var c=e.assignedSlot||e.parentNode||e.host||null;try{var l=e["__"+i];if(l!==void 0&&!e.disabled)if(Y(l)){var[H,...M]=l;H.apply(e,[r,...M])}else l.call(e,r)}catch(g){s?o.push(g):s=g}if(r.cancelBubble||c===t||c===null)break;e=c}if(s){for(let g of o)queueMicrotask(()=>{throw g});throw s}}finally{r.__root=t,delete r.currentTarget,E(m),b(f)}}}function vr(r,t){var a=t==null?"":typeof t=="object"?t+"":t;a!==(r.__t??(r.__t=r.nodeValue))&&(r.__t=a,r.nodeValue=a+"")}function ur(r,t){return q(r,t)}function hr(r,t){L(),t.intro=t.intro??!1;const a=t.target,i=S,n=p;try{for(var e=C(a);e&&(e.nodeType!==8||e.data!==j);)e=z(e);if(!e)throw T;w(!0),D(e),F();const u=q(r,{...t,anchor:e});if(p===null||p.nodeType!==8||p.data!==J)throw X(),T;return w(!1),u}catch(u){if(u===T)return t.recover===!1&&G(),L(),K(a),w(!1),ur(r,t);throw u}finally{w(i),D(n)}}const h=new Map;function q(r,{target:t,anchor:a,props:i={},events:n,context:e,intro:u=!0}){L();var _=new Set,d=f=>{for(var s=0;s<f.length;s++){var o=f[s];if(!_.has(o)){_.add(o);var c=sr(o);t.addEventListener(o,y,{passive:c});var l=h.get(o);l===void 0?(document.addEventListener(o,y,{passive:c}),h.set(o,1)):h.set(o,l+1)}}};d(Q(k)),N.add(d);var v=void 0,m=U(()=>{var f=a??t.appendChild(Z());return x(()=>{if(e){rr({});var s=tr;s.c=e}n&&(i.$$events=n),S&&ar(f,null),v=r(f,i)||{},S&&(A.nodes_end=p),e&&er()}),()=>{var c;for(var s of _){t.removeEventListener(s,y);var o=h.get(s);--o===0?(document.removeEventListener(s,y),h.delete(s)):h.set(s,o)}N.delete(d),f!==a&&((c=f.parentNode)==null||c.removeChild(f))}});return R.set(v,m),v}let R=new WeakMap;function pr(r,t){const a=R.get(r);return a?(R.delete(r),a(t)):Promise.resolve()}export{ir as a,_r as d,lr as e,hr as h,dr as l,ur as m,vr as s,pr as u};
