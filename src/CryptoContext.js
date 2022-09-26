import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect, useContext, createContext } from 'react'
import { AllCoins, CoinList, GetAllCoins, GetCoinData } from './config/api';
import { auth, db } from './firebase';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
    const [currency, setCurrency] = useState("EUR");
    const [symbol, setSymbol] = useState("€");
    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [alert, setAlert] = useState({
      open: false,
      message: "",
      type: "success",
    })
    const [watchlist, setWatchlist] = useState([])
    const [allCoins, setAllCoins] = useState([])
    const [myCoins, setMyCoins] = useState([])
    const [getCoinData, setGetCoinData] = useState([])
    const [getAllCoins, setGetAllCoins] = useState([])

    useEffect(() => {
      if (user) {
        const coinRef = doc(db, "my_coins", user.uid)

        let unsubscribe = onSnapshot(coinRef, coin => {
          if (coin.exists()){
            console.log(coin.data().coins);
            setMyCoins(coin.data().coins)
          }else{
            console.log("You don't have any coins");
          }
        })
        return () => {
          unsubscribe()
        }
      }
    }, [user])

    useEffect(() => {
      if (user) {
        const coinRef = doc(db, "watchlist", user.uid)

        let unsubscribe = onSnapshot(coinRef, coin => {
          if (coin.exists()){
            console.log(coin.data().coins);
            setWatchlist(coin.data().coins)
          } else {
            console.log("No Items in Watchlist");
          }
        })

        return () => {
          unsubscribe()
        }
      }
    }, [user])

    useEffect(() => {
      onAuthStateChanged(auth, user => {
        if (user) setUser(user);
        else setUser(null);
      })
    }, [])

    const fetchCoins = async () => {
      setLoading(true)
      const { data } = await axios.get(CoinList(currency))

      setCoins(data)
      setLoading(false)
    }

    const fetchAllCoins = async () => {
      setLoading(true)
      const { data } = await axios.get(AllCoins(currency))

      setAllCoins(data)
      setLoading(false)
    }

    const fetchGetCoinData = async (name) => {
      setLoading(true)
      const { data } = await axios.get(GetCoinData(currency, name))

      setGetCoinData(data)
      setLoading(false)
    }

    const fetchGetAllCoins = async () => {
      setLoading(true)
      const { data } = await axios.get(GetAllCoins())

      setGetAllCoins(data)
      setLoading(false)
    }


    useEffect(() => {
        if (currency === "EUR") setSymbol('€');
        else if (currency === "USD") setSymbol('$');
    }, [currency])

  return (
    <Crypto.Provider value={{ 
      currency, setCurrency, symbol, coins, loading, fetchCoins, alert, setAlert, user, watchlist, fetchAllCoins, allCoins, myCoins, fetchGetCoinData, getCoinData,
      fetchGetAllCoins, getAllCoins
    }}>
        {children}
    </Crypto.Provider>
  )
}

export default CryptoContext

export const CryptoState = () => {
    return useContext(Crypto);
};