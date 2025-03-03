const https = require('https'); 
const readline = require('readline'); 

const apiKey = '0a02ada2b2d441929da9df8678a9014f';
// Use the key below if api requests are exhausted

// const apiKey = '27ee71d063cf4ad5b51cc13bb5263347';

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

console.log("Select a news category (or type 'exit' to quit)::");
for (let key in categoryMap) {
    console.log(`Press ${key} for ${categoryMap[key]} news`);
}

const askQuestion = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
};

const fetchData = (url, options) => {
    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const news = JSON.parse(data);
                    resolve(news);
                } catch (error) {
                    reject(new Error("Error parsing JSON: " + error.message));
                }
            });

        }).on('error', (err) => {
            reject(new Error("Request failed: " + err.message));
        });
    });
};

const displayData = (category, news) => {
    if (news.status === 'ok' && news.articles.length > 0) {
        console.log(`\nTop Headlines in ${category}:\n`);
        news.articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title}`);
            console.log(`   Link: ${article.url}\n`);
        });
    } else {
        console.log('No news articles found or API key is exhausted:', news.message);
    }
};

async function main() {
    while(true){
        try {
            const number = await askQuestion("Enter your choice (1-7) or type 'exit' to quit: ");
            if(number.toLowerCase() === 'exit'){
                rl.close();
                break;
            }
            const category = categoryMap[number];

            if (!category) {
                console.log("Invalid selection. Please enter a valid number between 1 and 7.");
                continue;
            }

            const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
            const options = {
                headers: { 'User-Agent': 'MyNewsApp/1.0' }
            };

            const news = await fetchData(url, options);
            displayData(category, news);
        } catch (err) {
            console.error("Error:", err.message);
        }
    }
}

main();
