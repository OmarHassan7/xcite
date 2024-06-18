const puppeteer = require("puppeteer");
const fs = require("fs");
async function delay(s) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, s * 1000);
  });
}
const MAX_NUM_CATGS = 16;
let i;

(async () => {
  let queries = [];
  const browser = await puppeteer.launch({
    defaultViewport: false,
    headless: false,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.goto("https://www.xcite.com");

  await page.click(
    "#__next > header > div > div.hidden.Header_navigationWrapper__d0pvK > div:nth-child(2) > div.Header_navigationLink__YQocy.Header_navigationLinkWithChildren__HM2Px.false.hidden"
  );

  await page.setRequestInterception(true);

  page.on("request", (req) => req.continue());

  page.on("response", async (res) => {
    const url = res.url();
    if (url.endsWith("json") && url.includes("category")) {
      const jsonRes = await res.json();

      const interstedData = {
        indexName: jsonRes.pageProps.categoryProps.indexName,
        categoryQuery: jsonRes.pageProps.categoryProps.searchQuery,
        categoryName: jsonRes.pageProps.categoryProps.categoryName,
        lang: jsonRes.pageProps.categoryProps.hrefLang,
      };
      queries.push(interstedData);
      console.log(queries);
      fs.writeFileSync("all-queries.json", JSON.stringify(queries));
    }
  });
  for (i = 1; i <= MAX_NUM_CATGS; i++) {
    await page.click(
      `#__next > header > div.Header_header__9Ysh0 > div.Header_navigationCategoryFlyout__dtadR.hidden > div > div > ul > li:nth-child(${i}) > div > h5`
    );
    await delay(10);
  }
})();
