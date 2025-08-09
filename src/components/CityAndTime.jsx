import sun from "../assets/sun.png"
import Clock from "./Clock"
import sunrise from "../assets/sunrise.png"
import sunset from "../assets/sunset.png"
import humidity from "../assets/humidity.png"
import windIcon from "../assets/wind.png"
import pressure from "../assets/pressure.png"
import UV from "../assets/UV.png"
import ForeCast from './ForeCast'
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from 'axios'

const CityAndTime = ({ cityName, lat, lon, setLat, setLon }) => {
    const [weatherData, setWeatherData] = useState(null)
    const [forecastData, setForeCastData] = useState(null)
    const [uvIndex, setUvIndex] = useState(null)

    const fetchData = async (inputLat, inputLon) => {
        try {
            let url;

            if (cityName && cityName.trim() !== "") {
                const encodedCity = encodeURIComponent(cityName)
                url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=dd365cb80fb480ef6885c7ec909d1c5f`
            } else if (inputLat && inputLon) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${inputLat}&lon=${inputLon}&units=metric&appid=dd365cb80fb480ef6885c7ec909d1c5f`
            } else {
                toast.error("Missing city name or coordinates")
                return
            }

            const currentWeather = await axios.get(url)
            setWeatherData(currentWeather.data)

            const { coord } = currentWeather.data
            setLat(coord.lat)
            setLon(coord.lon)

            const forecast = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=dd365cb80fb480ef6885c7ec909d1c5f`
            )
            setForeCastData(forecast.data)

            const oneCall = await axios.get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=dd365cb80fb480ef6885c7ec909d1c5f`
            )
            setUvIndex(oneCall.data.current?.uvi ?? "N/A")

        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch weather data")
        }
    }

    useEffect(() => {
        if (!cityName && (!lat || !lon)) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setLat(latitude)
                    setLon(longitude)
                    fetchData(latitude, longitude)
                },
                (error) => {
                    console.log("Geolocation error:", error)
                    toast.error("Location access denied. Please enter a city manually.")
                }
            )
        } else {
            fetchData(lat, lon)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityName])

    if (!weatherData || !forecastData) {
        return <div className="flex items-center justify-center text-white text-2xl md:text-6xl ">Loading...</div>
    }

    const { main, weather, sys, wind: windInfo, timezone } = weatherData
    const { list } = forecastData
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

    return (
        <>
            <div className="flex flex-col xl:flex-row gap-4">
                {/* Left section: city and time */}
                <div className="w-full xl:w-1/3 h-auto md:h-72 bg-[#050e1fde] shadow-2xl shadow-black rounded-lg text-white p-4 flex flex-col justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold">{cityName || weatherData.name}</h1>
                    <img src={sun} alt="weatherimage" className="w-24 select-none" />
                    <Clock timezoneOffset={timezone} /> {/* Pass city timezone */}
                </div>

                {/* Right section: weather details */}
                <div className="flex-grow h-auto md:h-72 bg-[#050e1fde] shadow-2xl rounded-lg text-white p-4 flex flex-col justify-around md:flex-row items-center md:items-stretch gap-4">
                    {/* Temperature and sunrise/sunset */}
                    <div className="flex flex-col items-center justify-between xl:justify-center gap-6 md:gap-4">
                        <h1 className="text-5xl md:text-7xl font-bold">{main.temp}&#8451;</h1>
                        <p className="text-center">
                            Feels like: <span className="text-lg md:text-xl ml-2 font-bold">{main.feels_like}&#8451;</span>
                        </p>
                        <div className="flex xl:flex-col md:flex-row items-center gap-4">
                            <div className="flex items-center gap-2">
                                <img src={sunrise} alt="sunrise" className="h-8 md:h-10 select-none" />
                                <div className="text-center">
                                    <h6>Sunrise</h6>
                                    <p>{new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={sunset} alt="sunset" className="h-8 md:h-10 select-none" />
                                <div className="text-center">
                                    <h6>Sunset</h6>
                                    <p>{new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main weather icon */}
                    <div className="flex flex-col justify-center items-center">
                        <img src={weatherIconUrl} alt={weather[0].description} className="w-36 h-36 md:w-52 md:h-52 select-none" />
                        <p className="font-bold text-xl md:text-3xl capitalize">{weather[0].description}</p>
                    </div>

                    {/* Additional weather info */}
                    <div className="grid grid-cols-2 flex flex-row justify-between gap-4 md:p-4">
                        <div className="flex flex-col items-center gap-2">
                            <img src={humidity} alt="humidity" className="h-8 md:h-10 select-none" />
                            <p>{main.humidity}%</p>
                            <h6>Humidity</h6>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <img src={windIcon} alt="windSpeed" className="h-8 md:h-10 select-none" />
                            <p>{windInfo.speed} km/h</p>
                            <h6>Wind Speed</h6>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <img src={pressure} alt="pressure" className="h-8 md:h-10 select-none" />
                            <p>{main.pressure} hPa</p>
                            <h6>Pressure</h6>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <img src={UV} alt="uv" className="h-8 md:h-10 select-none" />
                            <p>{uvIndex}</p>
                            <h6>UV</h6>
                        </div>
                    </div>
                </div>
            </div>
            <ForeCast forecastData={list} />
        </>
    )
}

export default CityAndTime
