const time = document.getElementById('time');    
      
const wearh_text = document.getElementById('wearh_text');
wearh_text.addEventListener('keydown',(e)=>{
    if(e.keyCode === 13){
        action();
    }
});
action();

function action(){
    let location = wearh_text.value;
    const detect_header = 'KakaoAK 4d367b10176f37e2e09f1e0c0ca30613';

    let laguage_detect_url = 'https://dapi.kakao.com/v3/translation/language/detect?query='+location;
 
    $.ajax({
        type : 'POST'
        ,url : laguage_detect_url
        ,headers : {'Authorization' : detect_header}
        ,contentType: 'application/x-www-form-urlencoded'
        ,success :(data)=>{
            let selected_language = data.language_info[0].code;   
            
            if(selected_language !== 'en'){      

                let translate_url = 'https://dapi.kakao.com/v2/translation/translate?src_lang=' + selected_language + '&target_lang=en&query='+encodeURIComponent(location);
            
                $.ajax({
                    type : 'POST'
                    ,url : translate_url
                    ,headers : {'Authorization' : detect_header}
                    ,success :(data2)=>{
                        location = data2.translated_text[0];
                        weather_search(location);
                    }
                });

            }else{
                weather_search(location)
            }

        }
     });
    
}

function weather_search(location){
            const serviceKey = 'c72a18d83b26cf39043d1d8f55a8d575';
            let lat = 37.556686625082556;
            let long = 27.0790179278834;
            
            $.get('https://api.openweathermap.org/geo/1.0/direct?q='+location+'&limit=5&appid='+serviceKey,(map)=>{
                lat = map[0].lat;
                long = map[0].lon;
            
                let url = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid='+serviceKey+'&lang=kr';
                
                $.post(url,(data)=>{
                    const descript = document.getElementById('descript');
                    const temp = document.getElementById('temp');
                    const min_temp = document.getElementById('min_temp');
                    const max_temp = document.getElementById('max_temp');
                    const hum = document.getElementById('hum');
                    const pressure = document.getElementById('pressure');
                    const icon = document.getElementById('icon');
                    const video = document.getElementById('video');
                    
                    descript.innerText = data.weather[0].description;
                    weather_desc=data.weather[0].description;
                    console.log(weather_desc.indexOf('비'));
                    if(weather_desc.indexOf('맑음')>-1){
                        icon.innerText = '🌞';
                        video.src='sunshine.mp4';
                    }else if(weather_desc.indexOf('구름')>-1){
                        icon.innerText = '🌤'
                        video.src='clear.mp4';
                    }else if(weather_desc.indexOf('흐림')>-1){
                        icon.innerText = '☁'
                        video.src='cloud.mp4';
                    }else if(weather_desc.indexOf('비')>-1){
                        icon.innerText = '🌧'
                        video.src='rain.mp4';
                    }else if(weather_desc.indexOf('눈')>-1){
                        icon.innerText = '☃'
                        video.src='snow.mp4';
                    }
                    temp.innerText = Math.ceil(data.main.temp-273.15)+'℃';
                    min_temp.innerText = Math.ceil(data.main.temp_min-273.15)+'℃';
                    max_temp.innerText = Math.ceil(data.main.temp_max-273.15)+'℃';
                    hum.innerText = data.main.humidity+'%';
                    pressure.innerText = data.main.pressure+' hPa';
                });
            });
        }  

const getDDay = ()=>{

    const setDate = new Date("2017-08-24T00:00:00+0900");
    const setYear = setDate.getFullYear();
    const setMonth = setDate.getMonth()+1;
    const setDay = setDate.getDate();

    const now = new Date();

    const distance =  now.getTime() - setDate.getTime();  

    const day = Math.floor(distance/(1000*60*60*24));
    const hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60))/(1000*60));
    const seconds = Math.floor((distance % (1000*60))/1000);

    time.innerText = 
        `${day}일 ${hours < 10 ? `0${hours}` : hours} :  ${minutes < 10 ? `0${minutes}` : minutes} :  ${seconds < 10 ? `0${seconds}` : seconds}😍`;
}

const init = ()=>{
    getDDay();
    setInterval(getDDay,1000);
}

init();