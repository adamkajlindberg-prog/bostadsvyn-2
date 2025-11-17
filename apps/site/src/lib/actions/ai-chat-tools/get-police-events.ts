const getPoliceEvents = async (location: string) => {
    try {
        const response = await fetch(`https://polisen.se/api/events?locationname=${location}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        });
        
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const limitedData = Array.isArray(data) ? data.slice(0, 10) : data; // Limit to 10 events
        return JSON.stringify(limitedData);
    } catch (error) {
        console.error('Fetch failed (Polisen API). Error:', error);
        return 'Could not retrieve information from the Police API at this time.';
    }
};

export default getPoliceEvents;