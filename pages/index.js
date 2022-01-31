import { Alert, Button, Card, CardContent, CardMedia, Grid, OutlinedInput } from '@mui/material'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from '../styles/Home.module.css'

const paramsNtripFileInit = {
  pathfile: "",
  numLine: 0
}


let fileContent = []

export default function Home() {
  const [isActive, setisActive] = useState(false);
  const [paramsNtripFile, setparamsNtripFile] = useState(paramsNtripFileInit);
  const [update, setupdate] = useState(false);
  const [idInterval, setidIterval] = useState(null);

  useEffect(() => {

    if (isActive) {


      fetch("/api", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...paramsNtripFile, previousData: [] })
      })
        .then(response => response.json())
        .then(data => {
          fileContent = data
          setupdate(preValue => !preValue)
        })

      const idIterevalTemp = setInterval(() => {
        fetch("/api", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...paramsNtripFile, previousData: fileContent })
        })
          .then(response => response.json())
          .then(data => {
            fileContent = data
            setupdate(preValue => !preValue)
          })
      }, 5000)

      setidIterval(idIterevalTemp)

    } else {
      clearInterval(idInterval)
    }

    return () => { clearInterval(idInterval) };
  }, [isActive]);


  const handleStart = () => {
    if (!isActive) {
      if (paramsNtripFile.numLine <= 0) {
        Swal.fire({
          icon: 'error',
          title: "El número de linea debe ser mayor a 0"
        })
        return;
      } else if (paramsNtripFile.pathfile === "") {
        Swal.fire({
          icon: 'error',
          title: "Ingrese la ubicación del archivo"
        })
        return;
      }
    }

    setisActive(preValue => !preValue)


  }


  const handleChangeInputs = (event) => {

    if (event.target.value <= 0) {
      return
    }
    setparamsNtripFile({
      ...paramsNtripFile,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Lector NTRIP</title>
        <meta name="description" content="Reader files NTRIP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Grid container direction="row" justifyContent="center" alignContent="flex-start">
          <Grid item xs={12} md={6} lg={3} xl={2} >
            <Card className={styles.imageCardLogo} >
              <CardMedia
                component="img"
                image='img/Cigma.jpeg'
                width="100%"
                height="100%"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardMedia
                component="img"
                width="100%"
                image='img/ESPE.png'
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="center" alignContent="flex-start">
          <Grid item xs={12} md={6} lg={5} xl={4} >

            <CardMedia
              component="img"
              image='img/Movilidad-espe-logo-removebg-preview.png'
              width="100%"
              height="100%"
            />
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="flex-start" alignContent="center">
          <Grid item xs={12} md={3} lg={2} >
            <label>Número de Linea: </label>
          </Grid>
          <Grid item xs={12} md={9} lg={2}  >

            <OutlinedInput
              size='small'
              type='number'
              name='numLine'
              className={styles.inputNumLines}
              value={paramsNtripFile.numLine}
              onChange={handleChangeInputs}
            />

          </Grid>
          <Grid item xs={12} md={3} lg={2} >
            <label>Ubicación del archivo: </label>
          </Grid>
          <Grid item xs={12} md={9} lg={6}  >

            <OutlinedInput
              fullWidth
              size='small'
              name='pathfile'
              className={styles.inputNumLines}
              value={paramsNtripFile.pathfile}
              onChange={handleChangeInputs}
            />
          </Grid>
          <Grid item xs={12} marginTop={2} textAlign="center" >
            {
              isActive ?
                <Button variant='contained' color='error' onClick={handleStart}>Detener</Button>
                :
                <Button variant='contained' color='success' onClick={handleStart} >Iniciar</Button>

            }

          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="center" alignContent="center">
          <Grid item xs={12} md={10} lg={8} marginTop={4}>
            <h3>Datos enviados al aplicativo</h3>
            <Card>
              <CardContent>
                <Grid container direction="row" justifyContent="center" alignContent="center" marginBottom={3}>
                  <Grid xs={3} className={styles.cellHeaderResult} >
                    Fecha/Hora
                  </Grid>
                  <Grid xs={3} className={styles.cellHeaderResult} >
                    X
                  </Grid>
                  <Grid xs={3} className={styles.cellHeaderResult} >
                    Y
                  </Grid>
                  <Grid xs={3} className={styles.cellHeaderResult}  >
                    Z
                  </Grid>
                  {
                    fileContent.map(
                      (item, index) => (
                        <Grid container direction="row" justifyContent="center" alignContent="center" key={index.toString()}>
                          <Grid xs={3} className={styles.cellHeaderResult}  >
                            {item.date}
                          </Grid>
                          <Grid xs={3} className={styles.cellHeaderResult}   >
                            {item.x}
                          </Grid>
                          <Grid xs={3} className={styles.cellHeaderResult}   >
                            {item.y}
                          </Grid>
                          <Grid xs={3} className={styles.cellHeaderResult}   >
                            {item.z}
                          </Grid>
                        </Grid>
                      )
                    )
                  }
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div >
  )
}
