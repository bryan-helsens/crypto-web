import React, { useState } from 'react'
import Drawer from '@mui/material/Drawer';
import { CryptoState } from '../../CryptoContext';
import { Avatar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { numberWithCommas } from '../Banner/Carousel';
import { AiFillDelete } from 'react-icons/ai'
import { doc, setDoc } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    container: {
        width: 350,
        padding: 25,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        backgroundColor: theme.palette.background.paper,
        color: "white",
        overflowX: "hidden",
    },
    profile: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        height: "92%",
    },
    picture: {
        width: 150,
        height: 150,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "contain",
    },
    button: {
        height: "5%",
        width: "100%",
        backgroundColor: "#EEBC1D",
        marginTop: 10,
    },
    watchlist: {
        flex: 1,
        width: "100%",
        backgroundColor: "gray",
        borderRadius: 10,
        padding: 15,
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        overflowY: "scroll"
    },
    coin: {
      padding: 10,
      borderRadius: 9,
      color: "black",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#EEBC1D",
      boxShadow: "0 0 3px black"
    }
}));

const UserSidebar = () => {
  const [state, setState] = useState({
    right: false,
  });

  const { user, setAlert, watchlist, coins, symbol } = CryptoState()
  const classes = useStyles();
  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid)

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id)
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        type: "success",
        message: `${coin.name} Removed from the Watchlist!`
      })

    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: error.message
      })
    }
  }

  const logOut = () => {
    signOut(auth)

    setAlert({
        open: true,
        type: "success",
        message: "Logout Successfull !"
    })

    toggleDrawer()
  }

  const navigateMyCoins = () => {
    navigate("/my_coins")

  }

  const profit = (coinPercentage) => {
    return coinPercentage >= 0;
  }

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
            <Avatar 
                onClick={toggleDrawer(anchor, true)}
                style={{
                    height: 38,
                    width: 38,
                    marginLeft: 15,
                    cursor: "pointer",
                    backgroundColor: "#EEBC1D",
                }}
                src={user.photoURL}
                alt={user.displayName || user.email} 
                title={user.displayName || user.email} 
            />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
                <div className={classes.profile}>
                    <Avatar 
                        className={classes.picture}
                        src={user.photoURL}
                        alt={user.displayName || user.email} 
                        title={user.displayName || user.email} 
                    />
                    <span
                        style={{
                            width: '100%',
                            fontSize: 25,
                            textAlign: 'center',
                            fontWeight: 'bolder',
                            wordWrap: 'break-word'
                        }}
                    >
                        {user.displayName || user.email}
                    </span>
                    <div className={classes.watchlist}>
                        <span
                            style={{ fontSize: 15, textShadow: "0 0 5px black" }}
                        >
                            Watchlist
                        </span>

                        {coins.map((coin) => {
                          if (watchlist.includes(coin.id))
                            return (
                              <div className={classes.coin}>
                                <span>{ coin.name }</span>

                                <div style={{ 
                                  display: "flex", 
                                  flexDirection: "column", 
                                  alignItems: "end", 
                                  float: "right", 
                                  justifyContent: "space-around", 
                                  width: "65%" }}
                                >
                                  <span>
                                    {symbol}
                                    {numberWithCommas(coin.current_price.toFixed(2))}
                                  </span>
                                  <span
                                    style={{
                                      color: profit(coin.price_change_percentage_24h) > 0 ? 'green' : 'red',
                                    }}
                                  >
                                    {profit(coin.price_change_percentage_24h) && "+"}
                                    {coin.price_change_percentage_24h.toFixed(2)}%
                                  </span>

                                </div>
                                  <AiFillDelete
                                    style={{ cursor: "pointer" }}
                                    fontSize="16"
                                    onClick={() => removeFromWatchlist(coin)}
                                  />
                              </div>
                            )
                        })}

                    </div>
                </div>

                
                <Button
                    variant="contained"
                    className={classes.button}
                    onClick={navigateMyCoins}
                >
                    My Coins
                </Button>

                <Button
                    variant="contained"
                    className={classes.button}
                    onClick={logOut}
                >
                    Log Out
                </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default UserSidebar