import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [inputAmount, setInputAmount] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState({
    inputAmount: "",
    from: "",
    to: "",
  });
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [apiError, setApiError] = useState("");

  //Fetching the list of currencies available .
  useEffect(() => {
    setApiError("");
    async function fetchCurrencies() {
      try {
        const response = await fetch(
          `https://api.frankfurter.dev/v2/currencies`,
        );

        if (!response.ok) {
          throw new Error("Failed to Fetch the List of Currencies");
        }

        const data = await response.json();
        setCurrencies(data);
      } catch (err) {
        setApiError(err.message);
        console.error(err.message);
      }
    }

    fetchCurrencies();
  }, []);

  //Whenever my to,from value changes i want to fetch data.
  useEffect(() => {
    setApiError("");
    if (!from || !to) {
      setLoading(false);
      return;
    }

    if (from === to) {
      setExchangeRate(1);
      setLoading(false);
      return;
    }

    const fetchRates = async () => {
      setLoading(true);
      // console.log("loading Started");
      setApiError("");

      try {
        const response = await fetch(
          `https://api.frankfurter.dev/v2/rates?base=${from}&quotes=${to}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data[0].rate)

        if (!data.length) {
          throw new Error("Exchange rate unavailable");
        }

        setExchangeRate(data[0].rate);
      } catch (err) {
        setApiError(err.message);
        console.log(err.message);
        setExchangeRate(0);
        setConvertedAmount(0);
      } finally {
        setLoading(false);
        // console.log("Loading finished ");
      }
    };

    fetchRates();
    // console.log(exchangeRate)
  }, [from, to]);

  //convert func - if the inputAmt is not present don't return any output
  const convert = () => {
    return inputAmount * exchangeRate;
  };

  // handleSubit- updating the error object
  const handleSubmit = () => {
    const errors = {
      inputAmount: inputAmount > 0 ? "" : "Amount is required",
      to: to ? "" : "Please enter Output Amount Currency",
      from: from ? "" : "Please enter Input Amount Currency",
    };

    setError(errors);

    return !errors.inputAmount && !errors.from && !errors.to;
  };

  const swap = () => {
    let temp = inputAmount;
    setInputAmount(convertedAmount);
    setConvertedAmount(temp);

    temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-[50px]">Currency Converter</h1>
      <div className="flex gap-4">
        {/* INPUT AMT */}
        <div className="relative">
          <input
            type="Number"
            placeholder="Amount"
            className={`border ${error.inputAmount ? "border-red-500" : "border-black"} border-2 px-4 py-2 rounded-xl`}
            value={inputAmount}
            onChange={(e) => {
              setInputAmount(e.target.value);
              // console.log(inputAmount)
            }}
          />

          {error.inputAmount && (
            <p className="text-red-500 absolute top-full left-0 p">
              {error.inputAmount}
            </p>
          )}
        </div>

        {/* FROM */}
        <div className="relative">
          <select
            onChange={(e) => {
              setFrom(e.target.value);
              // console.log(from)
            }}
            value={from}
          >
            <option value="">From</option>

            {currencies.map((currency) => (
              <option key={currency.iso_code} value={currency.iso_code}>
                {currency.name}
              </option>
            ))}
          </select>

          {error.from && (
            <p className="absolute top-full left-0 p text-red-500">
              {error.from}
            </p>
          )}
        </div>

        {/* TO */}
        <div className="relative">
          <select
            onChange={(e) => {
              setTo(e.target.value);
              // console.log(from)
            }}
            value={to}
          >
            <option value="">To</option>

            {currencies.map((currency) => (
              <option key={currency.iso_code} value={currency.iso_code}>
                {currency.name}
              </option>
            ))}
          </select>

          {error.to && (
            <p className="absolute top-full left-0 text-red-500">{error.to}</p>
          )}
        </div>

        {/*CONVERT Btn */}
        <button
          className="px-4 py-2 rounded-full bg-black text-white font-bold"
          onClick={() => {
            const isValid = handleSubmit();
            if (isValid) {
              setConvertedAmount(convert(isValid));
            }
          }}
          disabled={exchangeRate == 0 ? true : false}
        >
          Convert
        </button>

        {/* DISPAY AMT */}
        <input
          type="text"
          placeholder="Converted Amount"
          className="border-2 px-4 py-2 rounded-xl"
          value={convertedAmount}
          readOnly
        />

        {/* SWAP Btn */}
        <button
          onClick={() => {
            swap();
          }}
          className="px-4 py-2 bg-black text-white font-bold rounded-full"
        >
          Swap
        </button>
      </div>

      {/* Displaying Errors and Loading  */}
      <div className="fixed bottom-0 left-0 m-4 p-4 bg-blue-500 text-white rounded">
        {loading && <p>Fetching Exchange Rates...</p>}

        {apiError && <p className="text-red-500">{apiError}</p>}
      </div>
    </div>
  );
}

export default App;
