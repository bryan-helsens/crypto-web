import { Typography, makeStyles, LinearProgress } from '@material-ui/core'
import axios from 'axios'
import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import CoinInfo from '../components/CoinInfo'
import { SingleCoin } from '../config/api'
import { CryptoState } from '../CryptoContext'
import parse from 'html-react-parser';
import { numberWithCommas } from '../components/Banner/Carousel'

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
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
      lineHeight: 1.8
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      // making responsive
      [theme.breakpoints.down('md')]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: "center",
      },
      [theme.breakpoints.down('xs')]: {
        alignItems: "start"
      },
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!coin) return <LinearProgress style={{ backgroundColor: 'gold' }} />
  
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
          className={classes.heading}
          style={{
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
            parse(coin?.description.en.split('. ')[0])
          }.
        </Typography>

        <div className={classes.marketData}>
          <span style={{ display: 'flex' }}>
            <Typography
              variant="h5"
              className={classes.heading}
            >
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {coin?.market_cap_rank}
            </Typography>
          </span>

          <span style={{ display: 'flex' }}>
            <Typography
              variant="h5"
              className={classes.heading}
            >
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {symbol}{" "} 
              {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
            </Typography>
          </span>

          <span style={{ display: 'flex' }}>
            <Typography
              variant="h5"
              className={classes.heading}
            >
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {symbol}{" "}
              {
                numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
                )
              }M
            </Typography>
          </span>
        </div>

      </div>

         {/* chart */}
         <CoinInfo coin={coin} />
    </div>
  )
}

export default CoinPage