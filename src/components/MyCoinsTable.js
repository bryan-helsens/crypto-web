import { Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@material-ui/core'
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { GetCoinData } from '../config/api';
import { CryptoState } from '../CryptoContext';
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

const useStyles = makeStyles((theme) => ({
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
    search: {
        width: "90%",
        [theme.breakpoints.down("md")]: {
            width: "88%"
        },
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginBottom: 10
        },
    },
    search_add: {
        display: 'flex', 
        alignItems: "center", 
        justifyContent: "space-between", 
        flexDirection: 'row', 
        marginBottom: 20, 
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
    },
    profit: {
        paddingBottom: 20,
        fontWeight: 500,
        color: "#EEBC1D"
    }
}))

const MyCoinsTable = () => {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [coinsDataList, setCoinsDataList] = useState([])
    const [TotalProfit, setTotalProfit] = useState(0)
    const rows = ["Coin", "Bought", "Amount", "Coin Value", "Total Value", "Porfit/Loss"]

    const classes = useStyles();
    const navigate = useNavigate();

    const { loading, symbol, fetchAllCoins, currency, myCoins, fetchGetAllCoins } = CryptoState()


    useEffect(() => {
        fetchAllCoins()
        fetchGetAllCoins()
    }, [currency, myCoins])

    const calcProfit = (bought, valueNow) => {
        return valueNow - bought
    }

    const fetchCoin = async (name) => {
        const { data } = await axios.get(GetCoinData(currency, name))
        return data
      }

 
    const combineLists = () => {
        coinsDataList.forEach(coinInfo => {
            myCoins.filter((coin) => {
                if (coin.id.toLowerCase().includes(coinInfo.id.toLowerCase())) 
                    coin.totalValue = parseFloat((coin.amount * coinInfo?.current_price)).toFixed(2)
                    coin.profitOrLoss = parseFloat(calcProfit(coin.bought, coin.totalValue)).toFixed(2)
            })
        });

        myCoins.sort((a, b) => b.profitOrLoss - a.profitOrLoss)
        return
    }

    const getAllCoinNames = async () => {
        let tmpList = ""
        myCoins?.forEach(myCoin => {
            tmpList += myCoin.id.toLowerCase().replace(/ /g,"-") + ","
        });

        let coinsList = await fetchCoin(tmpList) 
        setCoinsDataList(coinsList)

        combineLists()
        calcuTotalProfitOrLoss()
    }

    const calcuTotalProfitOrLoss = async () => {
        let sum = 0
        await myCoins?.forEach(myCoin => {
            sum += parseFloat(myCoin.profitOrLoss)
        });

        setTotalProfit((sum).toFixed(2))
    }

    if (myCoins !== undefined){
        getAllCoinNames()
    }

    const handleSearch = () => {
        return myCoins !== undefined ? myCoins.filter((coin) => (
            coin.name.toLowerCase().includes(search.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(search.toLowerCase()) 
        )) : []
    }

  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{ textAlign: "center" }}>
            <Typography
                variant="h4"
                style={{ margin: 18, fontFamily: "Montserrat"}}
            >
                My coins list
            </Typography>

            
            <div 
                className={classes.search_add}    
            >
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
                    className={classes.search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <AddCoinModal />
            </div>


            <Typography
                variant="h6"
                className={classes.profit}
            >
                Total Profit/Loss: 
                <p
                    style={{ color: TotalProfit >= 0 ? 'rgb(14, 203, 129)' : "red" }}
                >
                    {symbol + " "}
                    {TotalProfit}
                </p>
            </Typography>
          

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
                                    handleSearch()
                                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                    .map(row => {

                                        let coin = coinsDataList.filter((coin) => (
                                            coin.id.toLowerCase().includes(row.id.toLowerCase()) ||
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
                                                        alt={row?.name}
                                                        title={row?.name}
                                                        height="50"
                                                        width="50"
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
                                                <TableCell align='right'>
                                                    {symbol + " "}
                                                    {numberWithCommas(row.bought.toFixed(2))}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    {row.amount}
                                                    {" " + row.symbol}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    {symbol + " "}
                                                    {numberWithCommas(coin?.current_price.toFixed(2))}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    {symbol + " "}
                                                    {row.totalValue}
                                                </TableCell>

                                                <TableCell 
                                                    align='right'
                                                    style={{
                                                        color: row.profitOrLoss >= 0 ? 'rgb(14, 203, 129)' : "red",
                                                        fontWeight: 500,
                                                        fontSize: "1.2rem"
                                                    }}
                                                >
                                                    {symbol + " "}
                                                    {row.profitOrLoss}
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

            <Pagination
                count={((handleSearch()?.length / 10) + 1).toFixed(0)}
                style={{
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
                classes={{ ul: classes.pagination }}
                onChange={(_, value) => {
                    setPage(value);
                    window.scroll(0, 450);
                }}
            />
        </Container>
    </ThemeProvider>
  )
}

export default MyCoinsTable