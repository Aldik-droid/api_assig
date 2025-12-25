import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.static("public"));

app.get("/api/get-full-user-data", async (req, res) => {
  try {
    const userRes = await axios.get("https://randomuser.me/api/");
    const userData = userRes.data.results[0];

    const user = {
      firstName: userData.name.first,
      lastName: userData.name.last,
      gender: userData.gender,
      age: userData.age,
      dateOfBirth: userData.dob.date.split("T")[0],
      country: userData.location.country,
      address: `${userData.location.city}, ${userData.location.country}`,
      profilePicture: userData.picture.large
    };

    let countryInfo = {};
    try {
      const cRes = await axios.get(`https://restcountries.com/v3.1/name/${user.country}?fullText=true`);
      const cData = cRes.data[0];

      countryInfo = {
        name: cData.name.common,
        capital: cData.capital ? cData.capital[0] : "N/A",
        currencyCode: Object.keys(cData.currencies)[0],
        flag: cData.flags.svg
      };
    } catch (e) {
      console.log("Country API error, using defaults");
      countryInfo = { name: user.country, capital: "N/A", currencyCode: "USD" };
    }

    let exchangeRate = { text: "No rate data" };
    try {
      const exRes = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${countryInfo.currencyCode}`);
      const rates = exRes.data.conversion_rates;
      exchangeRate.text = `1 ${countryInfo.currencyCode} = ${rates.USD} USD / ${rates.KZT} KZT`;
    } catch (e) { console.log("Exchange API error"); }

    let news = [];
    try {
      const nRes = await axios.get(`https://newsapi.org/v2/everything?q=${user.country}&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`);
      news = nRes.data.articles.map(a => ({ title: a.title, url: a.url }));
    } catch (e) { console.log("News API error"); }

    res.json({ user, countryInfo, exchangeRate, news });

  } catch (error) {
    console.error("Main Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));