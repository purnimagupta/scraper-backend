var express = require('express');
var router = express.Router();
var axios = require('axios');
var scraper = require('../utils/scraper');
var convertStrToObj = require('../utils/strToObj')


function getData(symbol, period) {
  const request = axios.get(`https://www1.nseindia.com/corporates/listDir/getListDirectEQ.jsp?symbol=${symbol}&Period=${period}`)
  return request
    .then(result => { return result.data })
    .catch(error => { console.error(error); return Promise.reject(error); });
}

function getURL(symbol) {
  return `https://www1.nseindia.com/companytracker/cmtracker.jsp?symbol=${symbol}&cName=cmtracker_nsedef.css`
}

/* GET users listing. */
router.get('/search', async function(req, res, next) {
  const symbol = req.query.symbol;
  const period = req.query.Period;

  const url = getURL(symbol);

  try {
      const data = await getData(symbol, period);
      const strToObj = convertStrToObj(data.trim()) 

      if(strToObj.rows.length > 0) {
        const companyDetails = await scraper(url)
        console.log("companyDetails", companyDetails);
        res.status(200).json({ data: JSON.stringify(companyDetails) })            
      } 
      else{
        res.status(200).json({ data: '' }) 
      }
    }
    catch (error) {
      console.log(error);
    }
  }
);
module.exports = router;
