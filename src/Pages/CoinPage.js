import { Typography, makeStyles } from '@material-ui/core'
import axios from 'axios'
import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import CoinInfo from '../components/CoinInfo'
import { SingleCoin } from '../config/api'
import { CryptoState } from '../CryptoContext'
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      [theme.breakpoints.down("md")] : {
        flexDirection: 'column',
        alignItems: 'center',
      } 
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")] : {
        width: "100%",
      },
      display: "flex",
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 25,
      borderRight: "2px solid grey"
    },
    description: {
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
      lineHeight: 1.8
    }
}))

const CoinPage = () => {
  const classes = useStyles()
  const { id } = useParams()
  const [coin, setCoin] = useState()

  const { currency, symbol } = CryptoState()

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id))

    console.log(data);

    setCoin(data)
  }

  console.log(coin);

  useEffect(() => {
    fetchCoin()
  }, [])
  

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img 
          src={coin?.image.large}
          alt={coin?.name}
          title={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />

        <Typography
          variant="h3"
          style={{
            fontWeight: "bold",
            marginBottom: 20,
            fontFamily: "Montserrat",
            overflow: "hidden"
          }}
        >
          {coin?.name}
        </Typography>

        <Typography
          variant="subtitle2"
          className={classes.description}
        >
          {
            coin ? (
               parse(coin?.description.en.split('. ')[0] + ".")
            ) : (
              <></>
            )
          }
        </Typography>

      </div>

         {/* chart */}
         <CoinInfo coin={coin} />
    </div>
  )
}

export default CoinPage