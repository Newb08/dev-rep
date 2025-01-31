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

console.log("Select a news category (or type 'exit' to quit):");
for (let key in categoryMap) {
    console.log(`Press ${key} for ${categoryMap[key]} news`);
}

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

function fetchAndDisplayNews(category, callback) {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
    const options = {
        headers: { 'User-Agent': 'MyNewsApp/1.0' }
    };

    https.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const news = JSON.parse(data);
                displayData(news,category);
            } catch (error) {
                console.error("Error parsing response:", error.message);
            }
            callback(); 
        });
    }).on('error', (err) => {
        console.error(`Got error: ${err.message}`);
        callback();
    });
}

function main() {
    rl.question("\nEnter your choice (1-7) or type 'exit' to quit: ", (num) => {
        if (num.toLowerCase() === 'exit') {
            console.log("Exiting the program. Goodbye!");
            rl.close();
            return;
        }

        const category = categoryMap[num];

        if (!category) {
            console.log("Invalid selection. Please enter a valid number between 1 and 7.");
            main();
        } else {
            fetchAndDisplayNews(category, main);
        }
    });
}

main();
