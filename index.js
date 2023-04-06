const puppeteer = require('puppeteer');



async function completeForm(stockName, percentChange, unixTime) {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
    });
    const page = await browser.newPage();
    //open form browser page
    await page.goto('https://forms.zohopublic.in/developers/form/TestResponses/formperma/-gq-UT1RjqASnGgBsW-M8MmPm8e3YLhcyFam06v2piE');

    //Type into search boxes
    await page.type('input[name="SingleLine"]', stockName);
    await page.type('input[name="SingleLine1"]', percentChange);
    await page.type('input[name="SingleLine2"]', unixTime);

    //Press submit button
    const submit = 'button[elname="submit"]'
    await page.waitForSelector(submit);
    await page.click(submit)

    await browser.close();
}

async function init() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //open CNBC website
    await page.goto('https://www.cnbc.com/us-market-movers/');

    //Click NASDAQ button to show relevant top gainers
    const nasdaqButton = '.MarketMoversMenu-marketOption'
    await page.waitForSelector(nasdaqButton);
    const selectors = await page.$$(nasdaqButton)
    await selectors[1].click()


    //Get all Top Gainers
    const marketTable = '.MarketTop-topTable';
    await page.waitForSelector(marketTable);
    const topGainers = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.MarketTop-topTable tr'), e => ({
            stock: e.querySelector('.MarketTop-name').innerText,
            percent: e.querySelector('.MarketTop-quoteChange').innerText
        }))
    );

    //Extract second top gainer name and percent change (removing % character)
    const stockName = topGainers[1].stock
    const percentChange = topGainers[1].percent.slice(0, -1)
    
    //Get current UNIX time
    const unixTime = JSON.stringify(Date.now())

    console.log(`Stock Name: ${stockName}, Percent Change: ${percentChange}, UNIX Timestamp: ${unixTime}`)

    //close CNBC browser and call function to complete form
    await browser.close();
    completeForm(stockName, percentChange, unixTime);
}

init();