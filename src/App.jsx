import { useState } from "react";
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

  //Creating the object that containing the exchange rates
  const exchangeRates = {
    USD: {
      INR: 83,
      EUR: 0.92,
    },
    EUR: {
      USD: 1.09,
      INR: 90,
    },
    INR: {
      USD: 0.012,
      EUR: 0.011,
    },
  };

  //convert func - if the inputAmt is not present don't return any output
  const convert = () => {
    let exchangeRate = exchangeRates[from][to];
    console.log(to);
    console.log(from);
    if (from === to) {
      exchangeRate = 1.0;
    }
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

        <div className="relative">
          <select
            onChange={(e) => {
              setFrom(e.target.value);
              // console.log(from)
            }}
            value={from}
          >
            <option value="">From</option>
            <option value={"USD"}>USD</option>
            <option value={"EUR"}>EUR</option>
            <option value={"INR"}>INR</option>
          </select>

          {error.from && (
            <p className="absolute top-full left-0 p text-red-500">
              {error.from}
            </p>
          )}
        </div>

        <div className="relative">
          <select
            onChange={(e) => {
              setTo(e.target.value);
              // console.log(from)
            }}
            value={to}
          >
            <option value="">To</option>
            <option value={"USD"}>USD</option>
            <option value={"EUR"}>EUR</option>
            <option value={"INR"}>INR</option>
          </select>

          {error.to && (
            <p className="absolute top-full left-0 text-red-500">{error.to}</p>
          )}
        </div>

        <button
          className="px-4 py-2 rounded-full bg-black text-white font-bold"
          onClick={() => {
            const isValid = handleSubmit();
            if (isValid) {
              setConvertedAmount(convert(isValid));
            }
          }}
        >
          Convert
        </button>

        <input
          type="text"
          placeholder="Converted Amount"
          className="border-2 px-4 py-2 rounded-xl"
          value={convertedAmount}
          readOnly
        />

        <button
          onClick={() => {
            swap();
          }}
          className="px-4 py-2 bg-black text-white font-bold rounded-full"
        >
          Swap
        </button>
      </div>
    </div>
  );
}

export default App;
