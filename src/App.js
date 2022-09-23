import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header'
import Homepage from './Pages/HomePage'
import Coinpage from './Pages/CoinPage'
import { makeStyles } from "@material-ui/core";
import Alert from './components/Alert';
import MyCoinsPage from './Pages/MyCoinsPage';

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<Coinpage />} exact/>
          <Route path="/my_coins" element={<MyCoinsPage />} exact/>
        </Routes>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
