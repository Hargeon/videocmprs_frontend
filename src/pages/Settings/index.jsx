import { Container, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    errorGrid: {
        color: "#721c24",
        backgroundColor: "#f8d7da",
        borderColor: "#f5c6cb",
        borderRadius: "5px"
    },
    connectBtn: {
        marginTop: "1rem"
    }
}))

function Settings() {
    const classes = useStyles();

    const displayInfo = () => {
        return (
            <a href="https://t.me/video_compressor_dev_bot">Telegram BOT</a>
        )
    }

    return (
        <Container maxWidth="md" className={classes.root}>
            {displayInfo()}
      </Container>
    )
}

export default Settings