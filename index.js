const dotenv = require("dotenv").config();

const { formatProducts } = require("./formatProducts");

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
  let numTotalProducts = 0;

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

      numTotalProducts = response.data.results[0].nbHits;

      allProducts = [...allProducts, ...totalProducts];

      normalizedProducts = formatProducts(allProducts);

      if (allProducts.length >= numTotalProducts) break;
      currentPage += 1;
    } catch (error) {
      console.error(
        "Error fetching data from API:",
        error.response ? error.response.data : error.message
      );
    }
  }
}

fetchProducts("aa3f0317-b79e-43bc-b775-7a9a9113d1e5");
