import { useEffect, useState } from "react"

const Clock = ({ timezoneOffset }) => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Convert UTC time to city local time
    const getCityTime = () => {
        // Get current UTC time in ms
        const utcTime = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000
        // Add the city’s timezone offset (from API, in seconds)
        return new Date(utcTime + timezoneOffset * 1000)
    }

    const cityTime = getCityTime()

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl md:text-6xl font-bold">
                {cityTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </h1>
            <p className="text-sm md:text-md font-medium">
                {cityTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
        </div>
    )
}

export default Clock
