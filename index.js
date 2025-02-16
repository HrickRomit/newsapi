const PORT = process.env.PORT|| 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
    {
        name: 'bdnews24',
        address: 'https://bdnews24.com/entertainment',
        base: ''
    },
    {
        name: 'prothomalo',
        address: 'https://www.prothomalo.com/sports',
        base: ''
    },
    {
        name: 'thedailystar',
        address: 'https://www.thedailystar.net/sports',
        base: 'https://www.thedailystar.net'
    },
];


const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Bangladesh")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base +url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
  res.json('Welcome to my API');
});

app.get('/news', (req, res) => {
    res.json(articles)
});

app.get('/news/:newspaperID',(req,res)=>{
  const newspaperID =  req.params.newspaperID
  
  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base
 
   axios.get(newspaperAddress)
   .then(response =>{
    const html = response.data
    const $ = cheerio.load(html)
    const specificArticles = []

    $('a:contains("India")',html).each(function(){
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
            title,
            url : newspaperBase + url,
            source: newspaperID
        })
    })
    res.json(specificArticles)
   }).catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
