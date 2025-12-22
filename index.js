import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/get-full-user-data", async (req, res) => {
  try {
    const userResponse = await axios.get("https://randomuser.me/api/");
    const userData = userResponse.data.results[0];

    const user = {
      firstName: userData.name.first,
      lastName: userData.name.last,
      gender: userData.gender,
      profilePicture: userData.picture.large,
      age: userData.dob.age,
      dateOfBirth: userData.dob.date.split("T")[0],
      city: userData.location.city,
      country: userData.location.country,
      address: `${userData.location.street.number} ${userData.location.street.name}`,
    };

    let countryInfo = {};
    try {
      const countryResponse = await axios.get(
        `http://api.countrylayer.com/v2/name/${user.country}`,
        {
          params: {
            access_key: process.env.COUNTRY_API_KEY,
            fullText: true,
          },
        }
      );
      
      const cData = countryResponse.data[0];
      countryInfo = {
        name: cData.name,
        capital: cData.capital,
        language: cData.languages[0].name,
        currencyCode: cData.currencies[0].code,
        flag: cData.flag || "https://via.placeholder.com/150",
      };
    } catch (err) {
      console.error("Country API Error:", err.message);
      countryInfo = { 
        name: user.country, 
        currencyCode: "USD", 
        note: "Country data unavailable (API limit or error)" 
      };
    }

    let exchangeRate = {};
    if (countryInfo.currencyCode) {
      try {
        const rateResponse = await axios.get(
          `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${countryInfo.currencyCode}`
        );
        
        const rates = rateResponse.data.conversion_rates;
        exchangeRate = {
          localCurrency: countryInfo.currencyCode,
          usd: rates.USD,
          kzt: rates.KZT,
          text: `1 ${countryInfo.currencyCode} = ${rates.USD} USD, 1 ${countryInfo.currencyCode} = ${rates.KZT} KZT` // 
        };
      } catch (err) {
        console.error("Exchange API Error:", err.message);
      }
    }

    let news = [];
    try {
      const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: user.country,
          language: "en", 
          pageSize: 5,
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      news = newsResponse.data.articles.map((article) => ({
        title: article.title,
        image: article.urlToImage,
        description: article.description,
        url: article.url,
      }));
    } catch (err) {
      console.error("News API Error:", err.message);
    }

    res.json({
      user,
      countryInfo,
      exchangeRate,
      news,
    });

  } catch (error) {
    console.error("Global Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // 
});