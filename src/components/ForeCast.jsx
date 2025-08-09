const ForeCast = ({ forecast }) => {

    const toCityDate = (dt) => {
        const utc = dt * 1000
        return new Date(utc + forecast.city.timezone * 1000)
    }

    const dailyForeCast = forecast.list.reduce((acc, item) => {
        const date = toCityDate(item.dt).toLocaleDateString()
        if (!acc.find(f => f.date === date)) {
            acc.push({
                temperature: `${Math.round(item.main.temp)}°C`,
                day: toCityDate(item.dt).toLocaleDateString("en-EN", { weekday: 'short' }),
                date,
                icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
            })
        }
        return acc
    }, []).slice(0, 5)

    const hourlyForeCast = forecast.list.slice(0, 5).map(item => ({
        time: toCityDate(item.dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        degree: `${Math.round(item.main.temp)}°C`,
        windSpeed: `${item.wind.speed}`
    }))

    return (
        <div className="flex">
            {/* Daily Forecast */}
            <div className="xl:w-96 w-full h-1/2 px-4 py-4 bg-[#050e1fde] shadow-2xl shadow-black m-4 rounded-lg text-white mt-10">
                <h2 className="flex items-center justify-center font-bold text-2xl">5 Days Forecast</h2>
                {dailyForeCast.map((cast, index) => (
                    <div key={index} className="flex flex-row justify-between items-center p-2">
                        <img src={cast.icon} alt='icon' className="select-none w-16 h-16"/>
                        <p className="font-bold">{cast.temperature}</p>
                        <p className="font-bold">{cast.day}, {cast.date}</p>
                    </div>
                ))}
            </div>

            {/* Hourly Forecast */}
            <div className="flex-grow h-auto px-4 py-4 bg-[#050e1fde] shadow-2xl m-4 mt-10 rounded-lg hidden lg:block text-white">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Hourly Forecast</h1>
                <div className="flex justify-around items-center gap-4 h-54 mt-14">
                    {hourlyForeCast.map((hourCast, index) => (
                        <div key={index} className="flex flex-col items-center gap-5 bg-[#1c2938] rounded-lg p-4 w-28 text-center shadow-md">
                            <p className="text-sm font-medium">{hourCast.time}</p>
                            <img src={hourCast.icon} alt='hourCastIcon' className="w-16 h-16 select-none"/>
                            <p>{hourCast.degree}</p>
                            <p>{hourCast.windSpeed} km/h</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ForeCast
