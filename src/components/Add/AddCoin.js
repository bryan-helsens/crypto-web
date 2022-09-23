import { Box, Button, TextField } from '@material-ui/core'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext'
import { db } from '../../firebase'

const AddCoin = ({ handleClose }) => {
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [bought, setBought] = useState(0)
    const [amount, setAmount] = useState(0)

    const { setAlert, currency, user, myCoins } = CryptoState()

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
                        id: name,
                        name: name,
                        symbol: symbol,
                        bought: parseInt(bought),
                        amount: parseFloat(amount),
                    }
                ]:[
                    {
                        id: name,
                        name: name,
                        symbol: symbol,
                        bought: parseInt(bought),
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
        <TextField 
          variant="outlined"
          type="text"
          label="Enter Name (Bitcoin)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
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