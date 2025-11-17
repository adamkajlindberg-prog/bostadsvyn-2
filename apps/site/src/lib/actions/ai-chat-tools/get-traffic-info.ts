import { TRAFIKVERKET_API_KEY } from "../../../../env-server";

const getTrafficInfo = async () => {
    try {
        const response = await fetch(`https://api.trafikinfo.trafikverket.se/v2/data.json`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/xml',
            },
            body: `
                <REQUEST>
                    <LOGIN authenticationkey="${TRAFIKVERKET_API_KEY}" />
                    <QUERY objecttype="AntalKörfält2" namespace="vägdata.nvdb_dk_o" schemaversion="1.2" limit="10">
                        <FILTER></FILTER>
                    </QUERY>
                </REQUEST>
            `
        })

        const data = await response.json();
        
        return JSON.stringify(data)
    } catch (error) {
        console.error('Fetch failed (Trafikverket API). Error:', error);
        return 'Could not retrieve information from the Trafikverket API at this time.';
    }
};

export default getTrafficInfo;