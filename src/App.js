import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import * as Papa from "papaparse";
import data from "./data/Cities";
import Button from "@mui/material/Button";
import Weather from "./component/Weather";

function App() {
  const [csvFile, setCsvFile] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState(data);
  const [result, setResult] = useState();
  const [errorMessage, setErrorMessage] = useState(null);

  const load = function () {
    setCities(data);
    fetch("./worldcities.csv")
      .then((response) => response.text())
      .then((responseText) => {
        setIsLoading(false);
        var data = Papa.parse(responseText);
        setCsvFile(data.data);
      });
  };

  let handleSelection = function (e) {
    setErrorMessage(null);
    setSearchField(e);
    let filteredCities = cities.filter((elem) => elem.includes(searchField));
    setCities(filteredCities);
    console.log(cities);
  };

  let handleSubmit = function (event) {
    if (searchField === null) {
      setErrorMessage("Please insert a location");
      // return;
    }

    event.preventDefault();
    let newArr = csvFile.filter((elem) =>
      elem[0].toLowerCase().includes(searchField.toLowerCase())
    );

    try {
      const options = {
        method: "GET",
        url: "https://weatherbit-v1-mashape.p.rapidapi.com/current",
        params: { lon: newArr[0][2], lat: newArr[0][3] },
        headers: {
          "X-RapidAPI-Key":
            "4f127d7e80msh033583c7d24821dp1ee847jsn21e209ffa220",
          "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          console.log(response);
          setResult(response.data.data);
        })
        .catch(function (error) {
          setErrorMessage(error.message);
        });
    } catch {
      setErrorMessage("Ups, no location found.");
    }
  };

  useEffect(() => {
    load();
  });

  return (
    <div className="App">
      <header className="App-header">Welcome to Weathy</header>
      <form>
        <label className="my-2 text-xl text-white">Location</label>
        <input
          className="my-2"
          type="text"
          name="name"
          onChange={(e) => handleSelection(e.target.value)}
        />
        <button className="butn my-2" onClick={(e) => handleSubmit(e)}>
          Search
        </button>
        {errorMessage && <div className="error my-2">{errorMessage}</div>}
      </form>
      {result && <Weather />}
      {result && <div>YES</div>}
    </div>
  );
}

export default App;
