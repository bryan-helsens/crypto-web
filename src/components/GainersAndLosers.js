import { Container, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CryptoState } from '../CryptoContext'
import { numberWithCommas } from './Banner/Carousel'

const useStyles = makeStyles((theme) => ({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    container: {
        display: "flex", 
        justifyContent: "space-around", 
        marginBottom: 30,
        [theme.breakpoints.down("sm")]: {
            display: "block",
        },
    },
    sub_container: {
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            paddingBottom: "2%"
        },
    }
}))

const GainersAndLosers = () => {
    const [gainers, setGainers] = useState([])
    const [losers, setLosers] = useState([])

    const navigate = useNavigate();
    const classes = useStyles();

    const { currency, symbol, coins, fetchCoins } = CryptoState()
    

    const highestGainers = () => {
        let orderedList = coins.sort((a, b) => a.price_change_percentage_24h < b.price_change_percentage_24h)
        setGainers(orderedList.slice(0, 3))
        setLosers(orderedList.slice(orderedList.length - 3).reverse())
    }

    useEffect(() => {
        fetchCoins()
        highestGainers()
    }, [currency])

  return (
    <div className={classes.container}>
        <div className={classes.sub_container}>
            <Typography
                variant="h5"
                style={{ fontFamily: "Montserrat", backgroundColor: 'rgb(238, 188, 29)', width: "99%", color: "#000", padding: "2%", fontWeight: 700}}
            >
                Gainers
            </Typography>

            <TableContainer style={{ width:"99%" }}>
                <Table> 
                    <TableBody>
                        {gainers
                        .map(row => {
                            let profit = row?.price_change_percentage_24h >= 0;

                            return (
                                <TableRow
                                    onClick={() => navigate(`/coins/${row.id}`)}
                                    className={classes.row}
                                    key={(row.id).toUpperCase()}
                                >
                                    <TableCell 
                                        components="th" 
                                        scope="row"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 30
                                        }}
                                    >
                                        <img 
                                            src={row?.image}
                                            alt={row.name}
                                            title={row.name}
                                            height="30"
                                        />
                                        <span
                                            style={{
                                                textTransform: "uppercase",
                                                fontSize: 15,
                                            }}
                                        >
                                            {row.symbol}
                                        </span>
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
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
       

        <div className={classes.sub_container}>
            <Typography
                variant="h5"
                style={{ fontFamily: "Montserrat", backgroundColor: 'rgb(238, 188, 29)', width: "99%", color: "#000", padding: "2%", fontWeight: 700}}
            >
                Losers
            </Typography>
            
            <TableContainer style={{ width:"99%" }}>
                    <Table> 
                        <TableBody>
                            {losers
                            .map(row => {
                                let profit = row?.price_change_percentage_24h >= 0;

                                return (
                                    <TableRow
                                        onClick={() => navigate(`/coins/${row.id}`)}
                                        className={classes.row}
                                        key={(row.id).toUpperCase()}
                                    >
                                        <TableCell 
                                            components="th" 
                                            scope="row"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 30
                                            }}
                                        >
                                            <img 
                                                src={row?.image}
                                                alt={row.name}
                                                title={row.name}
                                                height="30"
                                            />
                                            <span
                                                style={{
                                                    textTransform: "uppercase",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {row.symbol}
                                            </span>
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
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>
  )
}

export default GainersAndLosers