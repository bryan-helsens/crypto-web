import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { CircularProgress, createTheme, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider } from "@material-ui/core"
import { CryptoState } from "../CryptoContext"
import { HistoricalChart } from '../config/api'
import { makeStyles } from "@material-ui/core/styles";
import { Line } from "react-chartjs-2";
import { Chart } from 'chart.js/auto'
import { chartDays } from '../config/time'
import SelectButton from './SelectButton'
import { numberWithCommas } from './Banner/Carousel'

const darkTheme = createTheme({
  palette: {
      primary: {
          main: '#fff',
      },
      type: "dark",
  }
});

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
  percentageTable: {
    marginTop: 20,
    padding: 20,
  }
}))

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState()
  const [days, setDays] = useState(1)

  console.log(days);

  const { currency, symbol } = CryptoState()
  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency))
    setHistoricData(data.prices)
  }

  console.log(historicData);

  const calculateProfit = (value) => {
    return value >= 0
  }

  useEffect(() => {
    fetchHistoricData()
  }, [currency, days])
  

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>

        {
          !historicData ? (
            <CircularProgress
              style={{ color: "gold" }}
              size={250}
              thickness={1}
            />
          ) : (
            <>
              <Line 
                data={{
                  labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return (days <= 1) ? time : date.toLocaleDateString();
                  }),


                  datasets : [
                    {
                      data: historicData.map((coin) => coin[1]),
                      label: `Price ( Past ${days} Days ) in ${currency}`,
                      borderColor: "#EEBC1D"
                    }
                ]
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => {
                            return `${symbol} ` + numberWithCommas(value);
                        }
                      },
                      title: {
                        display: true,
                        align: "end",
                        text: currency
                      }
                    },
                }}}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                {chartDays.map((day) => (
                  <SelectButton
                    key={day.value}
                    onClick={() => setDays(day.value)}
                    selected={day.value === days}
                  >
                    {day.label}
                  </SelectButton>
                ))}
              </div>
            </>
          )
        }


        <Table className={classes.percentageTable}>
          <TableHead style={{ backgroundColor: "#EEBC1D" }}>
          <TableRow>
              {chartDays.map((head) => (
                head.data ? (
                  <TableCell
                      style={{
                          color: "black",
                          fontWeight: "700",
                          fontFamily: "Montserrat",
                      }}
                      key={head.value}
                      align="center"
                  >
                      {head.label}
                  </TableCell>) : 
                  (
                    <></>
                  )
              ))}
          </TableRow>
          </TableHead>

          <TableBody>
            {console.log(coin.market_data)}
            <TableRow>
            {chartDays.map((head) => {
              let time = head.data;

              return (
                head.data ? (
                  <TableCell
                      style={{
                          fontWeight: 500,
                          fontFamily: "Montserrat",
                          border: "1px solid gray",
                          color: coin.market_data[time][currency.toLowerCase()] > 0 ? 'rgb(14, 203, 129)' : 'red',
                      }}
                      align="center"
                  >
                    {calculateProfit(coin.market_data[time][currency.toLowerCase()]) && "+"}
                    {coin.market_data[time][currency.toLowerCase()].toFixed(1)} %
                  </TableCell>) : 
                  (
                    <></>
                  )
              )
              })}
            </TableRow>
          </TableBody>
        </Table>

      </div>
    </ThemeProvider>
  )
}

export default CoinInfo