const dotenv = require("dotenv").config();

const axios = require("axios");
const fs = require("fs");

const headers = {
  "x-algolia-api-key": process.env.API_KEY,
  "x-algolia-application-id": process.env.APP_ID,
  "x-algolia-agent": process.env.API_AGENT,
};

async function fetchProducts(query) {
  let currentPage = 0;
  let allProducts = [];
  let totalHits = 0;

  let normalizedProducts;

  while (true) {
    const data = {
      requests: [
        {
          indexName: "xcite_prod_kw_en_main",
          params: `page=${currentPage}&query=${query}&hitsPerPage=${60}`,
        },
      ],
    };
    try {
      const response = await axios.post(process.env.API_URL, data, { headers });
      const totalProducts = response.data.results[0].hits;

      totalHits = response.data.results[0].nbHits;

      allProducts = [...allProducts, ...totalProducts];

      normalizedProducts = allProducts.map((el) => {
        return {
          productType: el.shwCardType,
          englishDescription: el.name,
          arabicDescription: el.crossLanguage,
          id: el.ctId,
          price: el.price,
          currency: el.currency,
          discountPerc: el.discountDiff,
          undiscountedPrice: el.unmodifiedPrice,
          inStock: el.inStock,
        };
      });
      console.log(normalizedProducts);

      if (allProducts.length >= totalHits) break;
      currentPage += 1;
    } catch (error) {
      console.error(
        "Error fetching data from API:",
        error.response ? error.response.data : error.message
      );
    }
  }
  console.log(allProducts.length);
}

fetchProducts("aa3f0317-b79e-43bc-b775-7a9a9113d1e5");
