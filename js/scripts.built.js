/**
 * uri-component-library
 * 
 * --scripts--
 * 
 * @version v5.0.0
 * @author Brandon Fuller <bjcfuller@uri.edu>
 * @author John Pennypacker <jpennypacker@uri.edu>
 * @license GPL-3.0
 * @see https://www.uri.edu/styleguide
 */

!function(){"use strict";const e={gid:"1bYlIQJiL4r8B0kudD_kXqzo-fgKs6ZRl6RyZjL9eRnA",dom:{output:document.getElementById("output")}};function t(e){const t=document.createElement("li"),n=document.createElement("div");n.className="item-name",n.innerHTML=e.name,t.appendChild(n);const s=document.createElement("div");s.className="item-ingredients",s.innerHTML=e.ingredients,t.appendChild(s);const a=document.createElement("div");a.className="item-time",a.innerHTML=e.time,t.appendChild(a);const o=document.createElement("div");return o.className="item-refresh",o.innerHTML="Refresh",t.appendChild(o),t}window.addEventListener("load",function(t){const n=new XMLHttpRequest;n.onreadystatechange=function(){n.readyState==XMLHttpRequest.DONE&&200==n.status?t(n.responseText):0!==n.status&&n.status};const s="https://spreadsheets.google.com/feeds/list/"+e.gid+"/default/public/values?alt=json";n.open("GET",s,!0),n.send()}((function(n){const s=JSON.parse(n).feed.entry;e.data={all:[],short:[],medium:[],long:[]};let a={};for(let t=0;t<s.length;t++){a={};for(const e in s[t])e.includes("gsx$")&&(a[e.replace("gsx$","")]=s[t][e].$t);switch(e.data.all.push(a),a.time){case"<30":e.data.short.push(a);break;case"30-60":e.data.medium.push(a);break;case">60":e.data.long.push(a)}}console.log("M",e),function(){const n=function(t){const n=e.data.all.slice(e.data.all),s=[];for(let e=0;e<t;e++){const e=Math.floor(Math.random()*n.length),t=n.splice(e,1);s.push(t[0])}return s}(14);console.log(n);const s=document.createElement("ul");for(let e=0;e<n.length;e++)s.appendChild(t(n[e]));e.dom.output.appendChild(s)}()})),!1)}();