const https = require('https'); 
const readline = require('readline'); 

const apiKey = '0a02ada2b2d441929da9df8678a9014f';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const categoryMap = {
    1: "business",
    2: "entertainment",
    3: "general",
    4: "health",
    5: "science",
    6: "sports",
    7: "technology"
};

console.log("Select a news category:");
for (let key in categoryMap) {
    console.log(`Press ${key} for ${categoryMap[key]} news`);
}

rl.question("Enter your choice (1-7): ", (num) => {
    const category = categoryMap[num];

    if (!category) {
        console.log("Invalid selection. Please enter a valid number between 1 and 7.");
        rl.close();
        return;
    }

    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;

    const options = {
        headers: {
            'User-Agent': 'MyNewsApp/1.0'
        }
    };

    https.get(url, options, (res) => {
        let data = '';

        // console.log(Status Code: ${res.statusCode});

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
             // console.log("Raw API Response:", data);
            try {
                const news = JSON.parse(data);
                //  console.log("Parsed JSON:", news);

                if (news.status === 'ok' && news.articles.length > 0) {
                    console.log(`\nTop Headlines in ${category}:\n`);
                    news.articles.forEach((article, index) => {
                        console.log(`${index + 1}. ${article.title}`);
                        console.log(`   Link: ${article.url}\n`);
                    });
                } else {
                    console.log('No news articles found or an error occurred:', news.message);
                }
            } catch (error) {
                console.error(error.message);
            }
            rl.close();
        });
    }).on('error', (err) => {
        console.error(`Got error: ${err.message}`);
        rl.close();
    });
});

