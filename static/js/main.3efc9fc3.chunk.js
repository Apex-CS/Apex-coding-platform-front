(this["webpackJsonpapex-coding-platform"]=this["webpackJsonpapex-coding-platform"]||[]).push([[0],{150:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),o=t(11),s=t.n(o),r=(t(80),t(12)),c=t(153),i=t(69),u=t.n(i),m=t(73);const d="apex-code-challenge-"+window.location.href.split("/")[3]+"-"+window.location.href.split("/")[4];function p(e,a){const t=d+e,[l,o]=Object(n.useState)(()=>{const e=localStorage.getItem(t);return null!=e?JSON.parse(e):"function"===typeof a?a():a});return Object(n.useEffect)(()=>{localStorage.setItem(t,JSON.stringify(l))},[t,l]),[l,o]}t(108),t(109),t(110),t(111),t(63),t(112),t(113),t(114),t(115),t(116);var g=t(70),h=t(44),f=t(46),v=t(74);function b(e){const{language:a,displayName:t,value:n,onChange:o,lineNumbers:s,funtion:r,theme:c}=e;return l.a.createElement("div",{className:"editor-container"},l.a.createElement("div",{className:"editor-title"},t,function(e){return"Console"===t?l.a.createElement("button",{type:"button",className:"run-btn",onClick:()=>e()},l.a.createElement(h.a,{icon:f.a})," Run Code"):"Test Cases"===t?l.a.createElement("button",{type:"button",className:"run-btn",onClick:()=>e()},l.a.createElement(h.a,{icon:f.b})," Run Test Cases"):t.includes("Main")?e():void 0}(r)),l.a.createElement(g.Controlled,{onBeforeChange:function(e,a,n){"Console"!==t&&o(n)},value:n,className:"code-mirror-wrapper",options:{lineWrapping:!0,lint:!0,mode:a,matchBrackets:!0,theme:void 0===c?"default":c,lineNumbers:s,indentWithTabs:!0,autocomplete:v.a,extraKeys:{"Ctrl-Space":"autocomplete"},smartIndent:!0,autofocus:!0}}))}var E=t(72),N=t(22),y=t(47);t(121);var S=function(){const e=Object(n.useRef)(null),[a,t]=Object(n.useState)("00:00:00"),o=e=>{let{total:a,hours:n,minutes:l,seconds:o}=(e=>{const a=Date.parse(e)-Date.parse(new Date),t=Math.floor(a/1e3%60),n=Math.floor(a/1e3/60%60);return{total:a,hours:Math.floor(a/1e3/60/60%24),minutes:n,seconds:t}})(e);a>=0&&t((n>9?n:"0"+n)+":"+(l>9?l:"0"+l)+":"+(o>9?o:"0"+o))},s=a=>{t("00:30:00"),e.current&&clearInterval(e.current);const n=setInterval(()=>{o(a)},1e3);e.current=n},r=()=>{let e=new Date;return e.setSeconds(e.getSeconds()+1800),e};return Object(n.useEffect)(()=>{s(r())},[]),l.a.createElement(l.a.Fragment,null,l.a.createElement(y.a,{fixed:"top",bg:"dark","data-bs-theme":"dark"},l.a.createElement(E.a,null,l.a.createElement(y.a.Brand,{href:"#home"},l.a.createElement("img",{alt:"",src:"/img/logo.svg",width:"30",height:"30",className:"d-inline-block align-top"})," ","APEX Code Platform")),l.a.createElement(N.a,{className:"container-fluid"},l.a.createElement(N.a.Item,{className:"ml-auto"},l.a.createElement(N.a.Link,null,l.a.createElement("h5",null,"Interviewer"))),l.a.createElement(N.a.Item,{className:"ml-auto"},l.a.createElement(N.a.Link,null,l.a.createElement("h5",null,"Name of Candidate for level"))),l.a.createElement(N.a.Item,{className:"ml-auto"},l.a.createElement(N.a.Link,null,l.a.createElement("h4",null,a)," ")))))};const C="https://afdevs.ddns.net";var w=C+"/api/v1/java_code";const j=window.location.href.split("/")[3],O=window.location.href.split("/")[4],_="apex-code-challenge-"+j+"-"+O,I=new u.a("https://afdevs.ddns.net/ws-endpoint"),J=c.a.over(I),T=async(e,a,t)=>{const n=await fetch(e,{method:"POST",body:a,headers:{"Content-type":"application/json; charset=UTF-8"}}),l=await n.json();return"result"===t?l.result+" in "+l.duration+" ms\n\n"+l.output:"load"===t?l:void 0};var x=function(){!function(){if(""===j){let e=(Math.random()+1).toString(36).substring(2);window.location.replace(window.location.href+e)}}();const[e,a]=Object(n.useState)("Run your code and see the result here"),[t,o]=Object(n.useState)("See the cases results here"),[s,c]=p("text","See the code challenge here"),[i]=p("java",'public class Main {\n    public static void main (String[] args) {\n        System.out.print("Hello World from Java!");\n    }\n  }'),[u,d]=p("initialState",!0),[g]=p("python",'print("Hello World from Python")'),[h,f]=p("code",i),[v,E]=p("input","Put your input values here"),[N,y]=Object(n.useState)({label:"Java 21",value:"java",displayName:"Main.java",language:"text/x-java"}),x=[{label:"Java 21",value:"java",displayName:"Main.java",language:"text/x-java"},{label:"Python 3",value:"python",displayName:"Main.py",language:"python"}];function k(e){"Java 21"===e.label?(w=C+"/api/v1/java_code",f(i)):"Python 3"===e.label&&(w=C+"/api/v1/python_code",f(g)),y(e)}function z(e,a,t){var n={message:e,type:a,from:I._transport.unloadRef};J.send("/topic/reply-"+j+"-"+O,{},JSON.stringify(n)),t(e)}document.addEventListener("visibilitychange",L),document.addEventListener("mouseleave",L),document.addEventListener("copy",(function(){const e=document.getSelection();console.log(e.toString())}));const P=(e,a,t)=>{z(e,a,t)};function M(){let e=JSON.stringify({code:btoa(JSON.parse(localStorage.getItem(_+"code"))),session_id:j,case_id:O,input_values:btoa(JSON.parse(localStorage.getItem(_+"input")))});T(w,e,"result").then(e=>{z(e,"Console",a)})}function L(){document.hidden?console.log("Candidate left the Tab"):console.log("Candidate came back the Tab")}return Object(n.useEffect)(()=>{const e=setTimeout(()=>{},250);return()=>clearTimeout(e)},[s,h]),J.connect({},()=>{J.subscribe("/topic/reply-"+j+"-"+O,e=>{let t=JSON.parse(e.body);I._transport.unloadRef!==t.from&&("Code"===t.type?f(t.message):"Text"===t.type?c(t.message):"Console"===t.type?a(t.message):"Input"===t.type?E(t.message):"Test Cases"===t.type&&o(t.message))})}),function(){if(void 0!==O&&u){let e=JSON.stringify({session_id:j,case_id:O,user_name:""});d(!1),T("https://afdevs.ddns.net/api/v1/load_case",e,"load").then(e=>{f(atob(e.code_starter)),c(atob(e.description)),E(atob(e.input_values))})}}(),l.a.createElement(l.a.Fragment,null,l.a.createElement(S,null),l.a.createElement("div",{className:"pane top-pane"},l.a.createElement(r.b,{autoSaveId:"save",direction:"horizontal"},l.a.createElement(r.a,{className:"pane top-pane",minSize:10,defaultSizePercentage:50},l.a.createElement(b,{language:"powershell",displayName:"Text",lineNumbers:!1,value:s,onChange:e=>P(e,"Text",c),theme:"dracula"})),l.a.createElement(r.c,null),l.a.createElement(r.a,{className:"pane top-pane",minSize:10},l.a.createElement(b,{language:N.language,displayName:N.displayName,lineNumbers:!0,value:h,funtion:()=>l.a.createElement(m.a,{defaultValue:{label:"Java 21"},options:x,onChange:k,theme:e=>({...e,colors:{primary25:"silver",primary:"black"}})}),onChange:e=>P(e,"Code",f),theme:"material-darker"})),l.a.createElement(r.c,null),l.a.createElement(r.a,{className:void 0!==O?"":"pane top-pane",defaultSizePercentage:25,minSize:10},void 0!==O?l.a.createElement(l.a.Fragment,null,l.a.createElement(r.b,{direction:"vertical"},l.a.createElement(r.a,{className:"pane ",minSize:10,defaultSizePercentage:33},l.a.createElement(b,{language:"powershell",displayName:"Console",lineNumbers:!1,funtion:M,value:e,onChange:e=>P(e,"Console",a),theme:"3024-night"})),l.a.createElement(r.c,{className:"resizer"}),l.a.createElement(r.a,{className:"pane vertical-pane",minSize:10,defaultSizePercentage:33},l.a.createElement(b,{language:"powershell",displayName:"Input",lineNumbers:!1,value:v,onChange:e=>P(e,"Input",E),theme:"3024-night"})),l.a.createElement(r.c,null),l.a.createElement(r.a,{className:"pane vertical-pane",minSize:10,defaultSizePercentage:33},l.a.createElement(b,{language:"powershell",displayName:"Test Cases",lineNumbers:!1,value:t,funtion:function(){let e=JSON.stringify({code:btoa(JSON.parse(localStorage.getItem(_+"code"))),session_id:j,case_id:O,input_values:btoa(JSON.parse(localStorage.getItem(_+"input")))});T("https://afdevs.ddns.net/api/v1/java_test_cases",e,"result").then(e=>{z(e,"Test Cases",o)})},onChange:e=>P(e,"Test Cases",o),theme:"3024-night"})))):l.a.createElement(l.a.Fragment,null,l.a.createElement(b,{language:"powershell",displayName:"Console",lineNumbers:!1,funtion:M,value:e,onChange:e=>P(e,"Console",a),theme:"3024-night"}))))))};s.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(x,null)),document.getElementById("root"))},75:function(e,a,t){e.exports=t(150)},80:function(e,a,t){}},[[75,1,2]]]);
//# sourceMappingURL=main.3efc9fc3.chunk.js.map