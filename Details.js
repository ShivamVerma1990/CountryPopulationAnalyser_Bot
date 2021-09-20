
let puppeteer = require("puppeteer");
let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let xlsx = require("xlsx");
let fs = require("fs");
const { log } = require("console");
let url = "https://www.worldometers.info/geography/how-many-countries-are-there-in-the-world/"
let browerObj, rTab;
let local;
(async function () {
  
    let brower = await puppeteer.launch
        ({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized", "--disable-notifications"]

        })
    browerObj = brower;
    let page = await browerObj.newPage();
    rTab = page;
    await rTab.goto("https://www.google.com/");
    await rTab.type('input[title="Search"]', "How many countries are there in the world? - Worldometer");
    await rTab.keyboard.press("Enter", { delay: 100 });
    await waitAndClick(".LC20lb.DKV0Md", rTab);
await waitAndClick("td>a",rTab);
await waitAndClick("div>h2",rTab);
 


})();




//let url="https://www.worldometers.info/coronavirus/";
request(url, cb)
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else if (response.statusCode == 404) {
        console.log("page not found");
    } else {
        //console.log(html)
        getData(html);
    }
}

function getData(html) {
    let searchTool = cheerio.load(html);
    let data = searchTool(".maincounter-number");
    //let title=searchTool("Countries in the World:")
    console.log("**************Number of Countries in the World:****************");

     console.log("Total countries are", data.text());
    request(url, cb2)
}

let arra = [];
//let url="https://www.worldometers.info/coronavirus/";

function cb2(err, response, html) {
    if (err) {
        console.log(err);
    } else if (response.statusCode == 404) {
        console.log("page not found");
    } else {
        //    console.log(html)
        getNoOfCountries(html);
        console.table(arra);

    }
}

function getNoOfCountries(html) {
    let searchTool = cheerio.load(html);
    let dats = searchTool("tbody tr");
    for (let i = 0; i < dats.length; i++) {
        let cols = searchTool(dats[i]).find("td")


        let country = searchTool(cols[1]).text();


        let population = searchTool(cols[2]).text();
        arra.push({
            country,
            population
        })
    }






    request(url, cb3)
}

function cb3(err, response, html) {
    if (err) {
        console.log(err);
    } else if (response.statusCode == 404) {
        console.log("page not found");
    } else {
        //console.log(html)
        console.log("**************Link of each countries:****************");
      
        getALLCountryDetail(html);
        
    }

}

function getALLCountryDetail(html) {

    let searchTool = cheerio.load(html);
    let dats = searchTool("tbody tr");
    for (let i = 0; i < dats.length; i++) {
        let cols = searchTool(dats[i]).find("td");
        let aElem = searchTool(cols[1]).find("a");
        let link = aElem.attr("href");
        //console.log(link);
        let dataSplit = link.split("/");

        //console.log(dataSplit[2]);
        let fullLink = `https://www.worldometers.info${link}`



        console.log(fullLink);
        //          


        request(fullLink, cb5);
    
    }
    // }
}


function cb5(err, response, html) {
    if (err) {
        console.log(err);
    } else if (response.statusCode == 404) {
        console.log("page not found");
    } else {
        //console.log(html)

        getSeprateCountry(html);
        
        

   

    }

}


let arr = [];
function getSeprateCountry(html) {
    let searchTool = cheerio.load(html);

    let globalElem = searchTool(".content-inner");
    let tableLevel = globalElem.find(".table.table-striped")
    let tableHeadOrBodyIdx = searchTool(tableLevel[0])//.find("thead th");
    let tableHead = tableHeadOrBodyIdx.find("thead th")

    let nameOfTheCountry = searchTool(tableHead[12]).text();
    let splitNameOfCountry = nameOfTheCountry.split("Global")[0].trim();
    //console.log("name",splitNameOfCountry);
    let tableBody = tableHeadOrBodyIdx.find("tbody tr");
    for (let i = 0; i < tableBody.length; i++) {
        let column = searchTool(tableBody[i]).find("td");
        Year = searchTool(column[0]).text();
        Population = searchTool(column[1]).text();
        YearlyChangePercantage = searchTool(column[2]).text();
        YearlyChange = searchTool(column[3]).text();
        MigrantsNet = searchTool(column[4]).text();
        MedianAge = searchTool(column[5]).text();
        FertilityRate = searchTool(column[6]).text();
        DensityPerKm = searchTool(column[7]).text();
        UrbanPercantageOfPop = searchTool(column[8]).text();
        UrbanPopulation = searchTool(column[9]).text();
        CountryShareofWorldPoP = searchTool(column[10]).text();
        WorldPopulation = searchTool(column[11]).text();
        GlobalRank = searchTool(column[12]).text();
       
        processData(splitNameOfCountry, Year, Population, YearlyChangePercantage, YearlyChange, MigrantsNet, MedianAge, FertilityRate, DensityPerKm, UrbanPercantageOfPop, UrbanPopulation, CountryShareofWorldPoP, WorldPopulation, GlobalRank);
        
        

    }


}

//console.table(arr);
console.log("```````````````````````````````````````````````````````````````````");
console.log("**************Each countries population realted data store in xlsx file:****************");

function processData(splitNameOfCountry, Year, Population, YearlyChangePercantage, YearlyChange, MigrantsNet, MedianAge, FertilityRate, DensityPerKm, UrbanPercantageOfPop, UrbanPopulation, CountryShareofWorldPoP, WorldPopulation, GlobalRank) {
    let obj = {
        splitNameOfCountry,
        Year,
        Population,
        YearlyChangePercantage,
        YearlyChange,
        MigrantsNet,
        MedianAge,
        FertilityRate,
        DensityPerKm,
        UrbanPercantageOfPop,
        UrbanPopulation,
        CountryShareofWorldPoP,
        WorldPopulation,
        GlobalRank
    }
    let countryNameDir = path.join(__dirname, splitNameOfCountry);
    if (fs.existsSync(countryNameDir) == false) {
        fs.mkdirSync(countryNameDir);
    }
    let countryNameDirFile = path.join(countryNameDir, splitNameOfCountry + ".xlsx");
    let countryArray = [];
    if (fs.existsSync(countryNameDirFile) == false) {
        countryArray.push(obj);

    } else {

        countryArray = excelReader(countryNameDirFile, splitNameOfCountry);
        countryArray.push(obj);

    }
    excelWriter(countryNameDirFile, countryArray, splitNameOfCountry);


}


///////////////////////read and write data in xlsx format/////////////////////////////
function excelWriter(filePath, json, sheetName) {
    // workbook create
    let newWB = xlsx.utils.book_new();
    // worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // excel file create 
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    // sheet to json 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
function waitAndClick(selector, cpage) {
    return new Promise(function (resolve, reject) {
        let promiseClone = cpage.waitForSelector(selector, { visible: true });
        promiseClone.then(function () {
            let clickClone = cpage.click(selector, { delay: 100 })
            return clickClone
        }).then(function () {
            resolve();
        }).catch(function (err) {

            reject(err);
        })


    })

}


