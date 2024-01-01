import Express from "express";
import fileUpload from "express-fileupload";
import mustacheExpress from "mustache-express";
import request from "supertest";
import fs from "fs/promises";
import exp from "constants";

const app = Express();
app.set("views", "./views");
app.set("view engine", "html");
app.engine("html", mustacheExpress());
app.use(fileUpload());
// app.use(Express.urlencoded({ extended: true }));
app.use(Express.json())

app.get("/", async (req, res) => {
  const list = await fs.readdir("./upload");
  res.render("index", {
    title: "send img",
    data: {
      title: "uploader file",
    },
    img: list,
  });
});

app.post("/upload", async (req, res) => {
  const sample = req.files.photo; // atribut photo harus sama dengan atribut dari form input di html nya
  let name = sample.name;
  let ext = name.split(".");
  ext = ext.pop();

  await sample.mv(
    "./upload/" + Math.floor(Math.random() * 10000) + "." + ext,
    (err) => {
      if (err) res.status(503).send("error");
      res.send("file upload");
    }
  );
});

app.post("/download", (req, res) => {
  console.log("./upload/"+req.body.photo);
  res.download("./upload/"+req.body.photo)
  res.send("a");
});

test("donwload", async () => {
  const response = await request(app).post("/download").send({ photo: "215.png" });
  expect(response.text).toContain("a");
});
