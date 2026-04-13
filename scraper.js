const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Target URL: Yahan aapne wo link dalna hai jahan se video milti hai
const TARGET_URL = 'https://crichd.com.co/'; 

async function scrapePlayerLink() {
    try {
        console.log(`Fetching data from: ${TARGET_URL}`);
        
        // Website ko ye lagna chahiye ke hum aam browser se aaye hain
        const response = await axios.get(TARGET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        let playerLink = null;
        
        // Iframe tag dhoondna jisme 'flow.php', 'playerado', ya 'player0003' likha ho
        $('iframe').each((index, element) => {
            const src = $(element).attr('src');
            if (src && (src.includes('flow.php') || src.includes('playerado') || src.includes('player0003'))) {
                playerLink = src;
            }
        });

        if (playerLink) {
            console.log('✅ Naya Link Mil Gaya:', playerLink);
            
            // Link ko ek choti si file mein save karna
            const dataToSave = {
                stream_url: playerLink,
                last_updated: new Date().toISOString()
            };
            
            fs.writeFileSync('stream-data.json', JSON.stringify(dataToSave, null, 2));
            console.log('💾 Data stream-data.json mein save ho gaya');
        } else {
            console.log('❌ Player ka iframe nahi mila.');
        }

    } catch (error) {
        console.error('⚠️ Error aa gaya:', error.message);
    }
}

scrapePlayerLink();
