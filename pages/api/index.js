import fs from "fs"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      let requestData = {
        pathfile: "",
        numLine: 0,
        previousData: []
      }
      try {
        requestData.pathfile = req.body.pathfile
        requestData.previousData = req.body.previousData
        requestData.numLine = Number(req.body.numLine)
      } catch (error) {
        console.error(error)
        res.status(400).json({ error: error })
      }


      fs.readFile(requestData.pathfile, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          res.status(400).json({ error: err })
          return
        }


        const lines = data.split("\n"[0]).filter(line => line.includes("EPEC3"))
        let dataRequired = lines[lines.length - 1]
        dataRequired = dataRequired.split(" "[0])

        res.status(200).json([{
          date: dataRequired[0],
          x: dataRequired[4],
          y: dataRequired[9],
          z: dataRequired[14]
        }, ...requestData.previousData])
      })
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" })
      break;
  }



}
