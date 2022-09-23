import { Button, Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@material-ui/core'
import { doc, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import { db } from '../firebase';
import AddCoinModal from './AddCoinModal';
import { numberWithCommas } from './Banner/Carousel';

const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#000",
      },
      type: "dark",
    },
});

let data = [
    {
        id: 1,
        name: "Ethereum",
        symbol: "ETH",
        bought: 265.00,
        amount: 0.1691478,
    },
    {
        id: 2,
        name: "Bitcoin",
        symbol: "BTC",
        bought: 100.00,
        amount: 0.00453769,
    },{
        id: 3,
        name: "ApeCoin",
        symbol: "APE",
        bought: 30.00,
        amount: 4.8996407,
    },
    {
        id: 4,
        name: "PancakeSwap",
        symbol: "CAKE",
        bought: 50.00,
        amount: 12.50163604,
    },
];

const useStyles = makeStyles({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "gold",
        },
    },
    notchedOutline: {
        borderWidth: "1px",
        borderColor: "gray !important",
    },
})

const MyCoinsTable = () => {
    const [search, setSearch] = useState("")
    const rows = ["Coin", "Bought", "Amount", "Coin Value", "Total Value", "Porfit/Loss"]

    const classes = useStyles();
    const navigate = useNavigate();

    const { loading, coins, symbol, fetchAllCoins, allCoins, currency, myCoins, user, setAlert } = CryptoState()

    useEffect(() => {
        fetchAllCoins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency])

    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name.toLowerCase().includes(search.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(search.toLowerCase())
        ))
    }

    const calcProfit = (bought, valueNow) => {
        return valueNow - bought
    }

    console.log(myCoins);

  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{ textAlign: "center" }}>
            <Typography
                variant="h4"
                style={{ margin: 18, fontFamily: "Montserrat"}}
            >
                My coins list
            </Typography>

            
            <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between", flexDirection: 'row', marginBottom: 20, width: "100%" }}>
                <TextField 
                    label="Search for a Crypto Currency..." 
                    InputLabelProps={{ style: {color: "white" } }}
                    variant="outlined"
                    InputProps={{
                        classes: {
                        notchedOutline: classes.notchedOutline,
                        },
                        style: {
                            color: "white"
                        }
                    }}
                    style={{ width: '90%' }}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <AddCoinModal />
            </div>
          

            <TableContainer>
                {
                    loading? (
                        <LinearProgress style={{ backgroundColor: "gold" }} />
                    ) : (
                        <Table>
                            <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                <TableRow>
                                    {rows.map((head) => (
                                        <TableCell 
                                            style={{
                                                color: "black",
                                                fontWeight: 700,
                                                fontFamily: "Montserrat"
                                            }}
                                            key={head}
                                            align={head === "Coin" ? "" : "right"}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    myCoins.map(row => {

                                        let coin = allCoins?.filter((coin) => (
                                            coin.name.toLowerCase().includes(row.name.toLowerCase()) ||
                                            coin.symbol.toLowerCase().includes(row.symbol.toLowerCase())
                                        ))
                                        coin = coin[0]

                                        return (
                                            <TableRow
                                                onClick={() => navigate(`/coins/${coin.id}`)}
                                                className={classes.row}
                                                key={row.name}
                                            >
                                                <TableCell
                                                    components="th"
                                                    scope="row"
                                                    style={{
                                                        display: 'flex',
                                                        gap: 15,
                                                    }}
                                                >
                                                    <img 
                                                        src={coin?.image}
                                                        alt={coin?.name}
                                                        title={coin?.name}
                                                        height="50"
                                                        style={{ marginBottom: 10 }}
                                                    />
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <span style={{ textTransform: "uppercase", fontSize: 22 }} >{row.symbol}</span>
                                                        <span style={{ color: "darkgrey" }}>{row.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell align='right' style={{ fontSize: "1rem" }}>
                                                    {symbol + " "}
                                                    {numberWithCommas(row.bought.toFixed(2))}
                                                </TableCell>
                                                <TableCell align='right' style={{ fontSize: "1rem" }}>
                                                    {row.amount}
                                                    {" " + row.symbol}
                                                </TableCell>
                                                <TableCell align='right' style={{ fontSize: "1rem" }}>
                                                    {symbol + " "}
                                                    {numberWithCommas(coin?.current_price.toFixed(2))}
                                                </TableCell>
                                                <TableCell align='right' style={{ fontSize: "1rem" }}>
                                                    {symbol + " "}
                                                    {(row.amount * coin?.current_price).toFixed(2)}
                                                </TableCell>

                                                <TableCell 
                                                    align='right'
                                                    style={{
                                                        color: row.bought <= (row.amount * coin?.current_price) ? 'rgb(14, 203, 129)' : 'red',
                                                        fontWeight: 500,
                                                        fontSize: "1.2rem"
                                                    }}
                                                >
                                                    {symbol + " "}
                                                    {calcProfit(row.bought, (row.amount * coin?.current_price)).toFixed(2)}
                                                </TableCell>
                                   
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    )
                }
            </TableContainer>
        </Container>
    </ThemeProvider>
  )
}

export default MyCoinsTable