import express from "express";
import spider from "./spider";

const app = express();
const spid = new spider();

const port = process.env.PORT || 8888;

app.get('/', (req, res) => {
  res.send("Nothing here, try /crawl");
});

app.get('/crawl', (req, res) => {
  let u = req.query.url;
  let t = req.query.title;
  let c = req.query.chapters;
  let e = req.query.encoding || 'gbk';
  spid.start(u, t, c, e);
});

app.listen(port, () => { console.log("Spider is listening on port " + port); });