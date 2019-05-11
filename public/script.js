'use strict'
let log = console.log.bind(console),
    id = val => document.getElementById(val),
    ul = id('ul'),
    media = id('media'),
    start = id('start'),
    stop = id('stop'),
    identify = id('identify'),
    stream,
    recorder,
    counter=1,
    chunks;

start.disabled = stop.disabled = identify.disabled =true;


media.onclick = e => navigator.mediaDevices.getUserMedia({audio:true}).then(_stream => {
    stream = _stream;
    media.style.display = 'none';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        chunks.push(e.data);
        if(recorder.state == 'inactive')  makeLink();
    };
    log('got media successfully');
}).catch(log);

start.onclick = e => {
    start.disabled = true;
    identify.disabled =true;
    stop.removeAttribute('disabled');
    chunks=[];
    recorder.start();
}


stop.onclick = e => {
    stop.disabled = true;
    recorder.stop();
    start.removeAttribute('disabled');
    identify.removeAttribute('disabled');

}

function makeLink(){
    let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' })
        , url = URL.createObjectURL(blob)
        , li = document.createElement('li')
        , au = document.createElement('audio')
        , hf = document.createElement('a')
    ;
    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = `${counter++}.ogg`;
    hf.innerHTML = `Download ${hf.download}`;
    li.appendChild(au);
    li.appendChild(hf);
    ul.appendChild(li);
    var xhr=new XMLHttpRequest();
    xhr.onload=function(e) {
        if(this.readyState === 4) {
            console.log("Server returned: ",e.target.responseText);
        }
    };
    var fd=new FormData();
    fd.append("audiodata",blob, "filename");
    xhr.open("POST","/upload",true);
    xhr.send(fd);

}


