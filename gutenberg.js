const axios = require('axios');
const $ = require('cheerio');
const fs = require('fs');
const baseURL = 'https://www.gutenberg.org';
const daArray = [];

(async() => {
    const firstPage = await axios.get(`${baseURL}/browse/scores/top`);

    const top5List = $('#books-last1', firstPage.data).next().children().slice(0, 5);

    for (let i = 0; i < top5List.length; i++) {
    	// this grabs the full ending part that individualizes the pages
        const link = ($(top5List[i]).children().first().attr('href'));
        const info = await axios.get(`${baseURL}/${link}`);
        // const title = $(console.log($(top5List[i]).text()));
        var something = $(top5List[i]).text();

        var author = something;
        // this is for the title name--------------------
        var n = author.indexOf("by");
        var tab2 = author.substr(0, n);
        console.log('Title: ' + tab2);
        const TheActualTitle = tab2

        // this is for the authors name -----------------

        var n = author.indexOf("by");
        var tab = author.substr(n + 2);
        console.log('Author: ' + tab);
        const TheActualAuthor = tab

        // language--------------------------------------
        // var maybe = "maybe next time";
        let language = $(`#bibrec div:nth-child(1) table tbody tr:nth-child(5) td`, info.data).text();
        let languageThing = $(`#bibrec div:nth-child(1) table tbody tr:nth-child(3) td`, info.data).text();
        // this check to see if one of the two varible is equal to english and then writes it
        if (language = "English") {
            console.log("Language: " + language);
            TheActualLangauge = language;
        } else {
            if (languageThing = "English") {
                console.log("Language: " + languageThing);
                TheActualLangauge = languageThing;
            }
        }



        // bookFormats----------------------------------
        const bookFormat = [$(`#download div table tbody tr:nth-child(2) td.unpadded.icon_save`, info.data).text(), $(`#download div table tbody tr:nth-child(3) td.unpadded.icon_save`, info.data).text(), $(`#download div table tbody tr:nth-child(4) td.unpadded.icon_save`, info.data).text(), $(`#download div table tbody tr:nth-child(5) td.unpadded.icon_save`, info.data).text(), $(`#download div table tbody tr:nth-child(6) td.unpadded.icon_save`, info.data).text(), $(`#download div table tbody tr:nth-child(7) td.unpadded.icon_save`, info.data).text(), $(`#download div table tbody tr:nth-child(8) td.unpadded.icon_save`, info.data).text()];
        const bookLinks = [$(`#download div table tbody tr:nth-child(2) td.unpadded.icon_save a`, info.data).attr('href'), $(`#download div table tbody tr:nth-child(3) td.unpadded.icon_save a`, info.data).attr('href'), $(`#download div table tbody tr:nth-child(4) td.unpadded.icon_save a`, info.data).attr('href'), $(`#download div table tbody tr:nth-child(5) td.unpadded.icon_save a`, info.data).attr('href'), $(`#download div table tbody tr:nth-child(6) td.unpadded.icon_save a`, info.data).attr('href'), $(`#download div table tbody tr:nth-child(7) td.unpadded.icon_save a`, info.data).attr('href'), $(`#download div table tbody tr:nth-child(8) td.unpadded.icon_save a`, info.data).attr('href')];

        const bookFormats = {};
        for (var j = 0; j < bookFormat.length; j++) {
            if (bookFormat[j] != '') {
                bookFormats[bookFormat[j]] = bookLinks[j];
            }
        }
		// this pushes the varibles and data into the array
        daArray.push({bookFormats,TheActualTitle, TheActualAuthor, TheActualLangauge});
        


        //this is for the full url per book--------------

        const thing = baseURL + link;
        console.log("link: " + thing);
        // console.log(something);

        // 
    }
    console.log(daArray);
    let dataThing = JSON.stringify(daArray);
    fs.writeFileSync('books.json', dataThing);

})();