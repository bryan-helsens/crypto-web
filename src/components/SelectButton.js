import React from 'react'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    selectButton: {
        border: "1px solid gold",
        borderRadius: 5,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        fontFamily: "Montserrat",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "gold",
          color: "black",
        },
        width: "13%",
    },
})


const SelectButton = ({ children, selected, onClick }) => {    
    const classes = useStyles();

  return (
    <span
        style={{
            backgroundColor: selected ? "gold" : "",
            color: selected ? "black" : "",
            fontWeight: selected ? 700 : 500,
        }}
        className={classes.selectButton}
        onClick={onClick}
    >
        {children}
    </span>
  )
}

export default SelectButton