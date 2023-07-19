import { useEffect, useState } from "react";

interface Ilocation {
    latitude: number
    longitude: number
}

export const useGeoLocation = (options= {}) => {
    const [location, setLocation] = useState<Ilocation>();
    const [error, setError] = useState('');

    const handleLocSuccess = (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords

        setLocation({
            latitude,
            longitude
        })
    }
    
    const handleLocError = (err: GeolocationPositionError) => {
        setError(err.message)
    }

    useEffect(() => {
        const { geolocation } = navigator;

        if (!geolocation) {
            setError('Geolocation is not supported.')
            return
        }

        geolocation.getCurrentPosition(handleLocSuccess, handleLocError, options);
    }, [])

    return { location, error }
}