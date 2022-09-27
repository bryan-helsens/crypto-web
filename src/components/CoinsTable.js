import React, { useState, useEffect } from 'react'
import { CryptoState } from '../CryptoContext'
import { Container, createTheme, LinearProgress, TableCell, ThemeProvider } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core'
import { numberWithCommas } from './Banner/Carousel';
import Pagination from "@material-ui/lab/Pagination";
import GainersAndLosers from './GainersAndLosers';

const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#000",
      },
      type: "dark",
    },
  });

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
  

const CoinsTable = () => {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const { currency, symbol, coins, loading, fetchCoins } = CryptoState()
    const classes = useStyles();

    const navigate = useNavigate();

    useEffect(() => {
      fetchCoins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency])

    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name.toLowerCase().includes(search.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(search.toLowerCase())
        ))
    }

  return (
    <ThemeProvider theme={darkTheme}>
        <Container style={{ textAlign: 'center'}}>

            <Typography
                variant="h4"
                style={{ margin: 18, fontFamily: "Montserrat"}}
            >
                Cryptocurrency Prices by Market Cap
            </Typography>

            {loading ? (
                <LinearProgress style={{ backgroundColor: "gold" }} />
            ):(
                <GainersAndLosers /> 
            )}

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
                style={{ marginBottom: 20, width: '100%' }}
                onChange={(e) => setSearch(e.target.value)
                }
            />

            <TableContainer>
                {
                    loading? (
                        <LinearProgress style={{ backgroundColor: "gold" }} />
                    ) : (
                        <Table>
                            <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                <TableRow>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                        <TableCell
                                            style={{
                                                color: "black",
                                                fontWeight: "700",
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
                                {handleSearch()
                                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                .map(row => {
                                    let profit = row.price_change_percentage_24h >= 0;

                                    return (
                                        <TableRow
                                            onClick={() => navigate(`/coins/${row.id}`)}
                                            className={classes.row}
                                            key={row.name}
                                        >
                                            <TableCell 
                                                components="th" 
                                                scope="row"
                                                style={{
                                                    display: "flex",
                                                    gap: 15
                                                }}
                                            >
                                                <img 
                                                    src={row?.image}
                                                    alt={row.name}
                                                    title={row.name}
                                                    height="50"
                                                    style={{ marginBottom: 10 }}
                                                />

                                                <div
                                                    style={{ display: "flex", flexDirection: "column" }}
                                                >
                                                    <span
                                                        style={{
                                                            textTransform: "uppercase",
                                                            fontSize: 22,
                                                        }}
                                                    >
                                                        {row.symbol}
                                                    </span>
                                                    <span style={{ color: "darkgrey" }}>{row.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align='right'>
                                                {symbol + " "}
                                                {numberWithCommas(row.current_price.toFixed(2))}
                                            </TableCell>
                                            <TableCell
                                                align='right'
                                                style={{
                                                    color: profit > 0 ? 'rgb(14, 203, 129)' : 'red',
                                                    fontWeight: 500
                                                }}
                                            >
                                                {profit && "+"}
                                                {row.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                            <TableCell align='right'>
                                                {symbol + " "}
                                                {numberWithCommas(row.market_cap.toString().slice(0, -6))} M
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )
                }
            </TableContainer>

            <Pagination
                count={(handleSearch()?.length / 10).toFixed(0)}
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

export default CoinsTable