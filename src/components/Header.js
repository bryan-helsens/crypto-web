import { AppBar, Container, createTheme, MenuItem, Select, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import AuthModal from './Auth/AuthModal';
import UserSidebar from './Auth/UserSidebar';

const useStyles = makeStyles(() => ({
    title: {
      flex: 1,
      color: "gold",
      fontFamily: "Montserrat",
      fontWeight: "bold",
      cursor: "pointer",
    },
}));

const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#fff',
        },
        type: "dark",
    }
});

const Header = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const { currency, setCurrency, user } = CryptoState()
    
  return (
    <ThemeProvider theme={darkTheme}>
        <AppBar color="transparent" position="static">
            <Container>
                <Toolbar>
                    <Typography 
                        onClick={() => navigate('/')} 
                        className={classes.title}
                        variant="h6"    
                    >
                        My Crypto
                    </Typography>

                    <Select
                        variant="outlined"
                        value={currency}
                        style={{ width: 100, height: 40, marginRight: 15, overflow: 'hidden' }}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"EUR"}>EUR</MenuItem>
                        <MenuItem value={"USD"}>USD</MenuItem>
                    </Select>

                    { user ? <UserSidebar /> : <AuthModal /> }
                </Toolbar>
            </Container>
        </AppBar>
    </ThemeProvider>
  )
}

export default Header