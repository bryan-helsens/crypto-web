import React from 'react'
import { AppBar, Container, Toolbar, Typography, Select, MenuItem, ThemeProvider, createTheme } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext"

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

    const { currency, setCurrency } = CryptoState()

    console.log(currency);
    
  return (
    <ThemeProvider theme={darkTheme}>
        <AppBar color="transparent" position="static">
            <Container>
                <Toolbar>
                    <Typography 
                        onClick={() => navigate('/')} 
                        className={classes.title}
                        variant="h6"    
                    >Crypto Hunter</Typography>

                    <Select
                        variant="outlined"
                        value={currency}
                        style={{ width: 100, height: 40, marginLeft: 15, overflow: 'hidden' }}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"EUR"}>EUR</MenuItem>
                        <MenuItem value={"USD"}>USD</MenuItem>
                    </Select>
                </Toolbar>
            </Container>
        </AppBar>
    </ThemeProvider>
  )
}

export default Header