import { Box, Button, TextField } from '@material-ui/core'
import Autocomplete from "@material-ui/lab/Autocomplete";
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext'
import { db } from '../../firebase'
  

const AddCoin = ({ handleClose }) => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [bought, setBought] = useState(0)
    const [amount, setAmount] = useState(0)
    const [selectedCoin, setSelectedCoin] = useState(null)

    const { setAlert, currency, user, myCoins, getAllCoins } = CryptoState()

    const handleSubmit = async () => {
        try {

            await addToMyCoins()

            handleClose()
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error"
              })
        }
    }

    const addToMyCoins = async () => {
        const coinRef = doc(db, "my_coins", user.uid)
    
        try {
            await setDoc(coinRef,{
                coins: myCoins?[...myCoins, 
                    {
                        id: id,
                        name: name,
                        symbol: symbol,
                        bought: parseFloat(bought),
                        amount: parseFloat(amount),
                    }
                ]:[
                    {
                        id: id,
                        name: name,
                        symbol: symbol,
                        bought: parseFloat(bought),
                        amount: parseFloat(amount),
                    }
                ],
            })
        
            setAlert({
                open: true,
                type: "success",
                message: `${name} Added to the My Coins!`
            })
    
        } catch (error) {
            setAlert({
                open: true,
                type: "error",
                message: error.message
            })
        }
    }

  return (
    <Box
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "5%"
        }}
    >

        <Autocomplete
            options={getAllCoins}
            getOptionLabel={(option) => (option.name)}
            variant="outlined"
            fullWidth
            onInputChange={(event, selectedCoin) => {
                setSelectedCoin(selectedCoin);
                setName(selectedCoin)
                // eslint-disable-next-line array-callback-return
                getAllCoins.filter((coin) => {

                    if (coin.name === selectedCoin){
                        setSymbol((coin.symbol).toUpperCase());
                        setId(coin.id)
                    }
                     
                 })
            }}
            renderInput={params => <TextField {...params} label="Enter Name (Bitcoin)" />}
        />

        <TextField 
          variant="outlined"
          type="text"
          value={id}
          style={{ visibility: "hidden", height: 0, width: 0 }}
          onChange={(e) => setId(e.target.value)}
        />

        <TextField 
          variant="outlined"
          type="text"
          label="Enter Symbol (BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          fullWidth
        />
        <TextField 
          variant="outlined"
          type="number"
          label={`Enter Price ${currency}`}
          value={bought}
          onChange={(e) => setBought(e.target.value)}
          fullWidth
        />
        <TextField 
          variant="outlined"
          type="number"
          label="Enter Amount Coins"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
        />

        <Button
            variant="contained"
            size="large"
            style={{ backgroundColor: "#EEBC1D"}}
            onClick={handleSubmit}
        >
            Add
        </Button>
    </Box>
  )
}

export default AddCoin