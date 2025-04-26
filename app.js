const cityInput=document.querySelector('.city-input');
const searchbutton=document.querySelector('.search-btn');
const apikey='11a239b87f7b8165f3d9242a6b31b973';
const notfoundsection=document.querySelector('.not-found');
const searchcity=document.querySelector('.search-city');
const weatherInfo=document.querySelector('.weather-info');
const countryTxt=document.querySelector('.country-text');
const tempTxt=document.querySelector('.temp-text');
const condition=document.querySelector('.condition-text');
const humidity=document.querySelector('.humidity-value-text');
const wind=document.querySelector('.wind-value-text');
const weatherSummaryImg=document.querySelector('.weather-summary-image');
const currentdata=document.querySelector('.current-data-txt');
const forecast=document.querySelector('.forecast-item-container');

// const sections=document.querySelectorAll('.weather-info, .search-city, .not-found')
searchbutton.addEventListener('click',function(){
    if(cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
})
cityInput.addEventListener('keydown',function(event){
    if(event.key=='Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo()
        cityInput.value='';
        cityInput.blur();
    }
})
async function getFetchData(endPoint,city){
    const apiurl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
    const response=await fetch(apiurl);
    return response.json();
}
async function updateWeatherInfo(city){
 const weatherdata= await getFetchData("weather",city);
 if(weatherdata.cod !=200){
    showdisplaySection(notfoundsection);
    return
}
const{
name:country,
main:{temp,humidity},
weather:[{id,main}],
wind:{speed},
}=weatherdata
countryTxt.textContent=country;
tempTxt.textContent=Math.floor(temp)+'°C';
condition.textContent=main;
humidity.textContent=humidity;
wind.textContent=speed+'M/s';
currentdata.textContent=getcurrentdate();
weatherSummaryImg.src=`new/weather/${getweatherIcon(id)}`;
await updateForecastInfo(city);
showdisplaySection(weatherInfo);
}
async function updateForecastInfo(city){
const forecastData=await getFetchData('forecast',city)
const timetaken='12:00:00';
const todayDate=new Date().toISOString().split('T')[0];
forecast.innerHTML='';
forecastData.list.forEach(forecastweather=>{
    if(forecastweather.dt_txt.includes(timetaken) &&
        !forecastweather.dt_txt.includes(todayDate))
        updateForecastItems(forecastweather)
    console.log(forecastweather);
})
}
function updateForecastItems(weatherdata){
 const{
    dt_txt:date,
    weather:[{id}],
    main:{temp}
 }=weatherdata
 const datetaken=new Date(date)
const dateOptions={
    day:'2-digit',
        month:'short'
}
const dateresult=datetaken.toLocaleDateString('en-US',dateOptions);
 const forecastItem=
 `<div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateresult}</h5>
            <img src="new/weather/${getweatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.floor(temp)+'°C'}</h5>            
          </div>`
forecast.insertAdjacentHTML('beforeend',forecastItem)
}
function getcurrentdate(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}
function getweatherIcon(id){
    if(id<=232){
        return  "thunderstorm.svg";
    }
    if(id<=321){
        return  "drizzle.svg";
    }
    if(id<=531){
        return  "rain.svg";
    }
    if(id<=622){
        return  "snow.svg";
    }
    if(id<=781){
        return  "atmosphere.svg";
    }
    if(id==800){
        return  "clear.svg";
    }
    else{
        return "clouds.svg";
    }
}
function showdisplaySection(showSection){
    [notfoundsection, searchcity, weatherInfo].forEach(sec => {
        sec.style.display = 'none';
    });
    showSection.style.display = 'flex';
}
