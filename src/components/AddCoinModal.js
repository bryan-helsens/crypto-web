import { AppBar, Backdrop, Box, Button, Fade, makeStyles, Modal, Tab, Tabs } from '@material-ui/core'
import React, { useState } from 'react'
import AddCoin from './Add/AddCoin';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        color: "white",
        borderRadius: 10,
        zIndex: 1
    },
    button: {
        backgroundColor: "#EEBC1D",
    },
}))

const AddCoinModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const classes = useStyles();

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    
  return (
    <div>
        <Button
            variant="contained"
            style={{
            padding: 15, 
            height: "auto",
            color: "#000"
            }}
            className={classes.button}
            onClick={handleOpen}
        >
            Add Coin
        </Button>

        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open} >
          <Box className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Add Coin" />
              </Tabs>
            </AppBar>

            <AddCoin handleClose={handleClose} />

          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default AddCoinModal