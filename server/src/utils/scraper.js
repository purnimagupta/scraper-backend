const puppeteer = require('puppeteer');

async function scrapeData(url) {

    const browser = await puppeteer.launch({
      headless: false
    });
    // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto(url, {  
      waitUntil: 'networkidle2',
      timeout: 3000000
    });

    const tableNodeList = await page.evaluate(() => {
      var tables = document.querySelectorAll('table');
      var tableArray = Array.from(tables);
      var lastTables = tableArray.slice(24, 27);
      var arr=[];
      for(let i=0; i<lastTables.length; i++) {
          arr.push(lastTables[i].innerText)
      }
      return arr;
    });

    var key_arr = ["Company Info", "Corporate Actions", "Announcements"];
    var companyDetails = {};

    for(var i =0; i<key_arr.length; i++) { 
      companyDetails[ key_arr[i] ] = tableNodeList[i];
    }

    await browser.close();
    return companyDetails;        
} 

module.exports = scrapeData;
  