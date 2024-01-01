import Express from "express";
import fileUpload from "express-fileupload";
import mustacheExpress from "mustache-express";
import fs from "fs/promises";

const app = Express();
app.set("views", "./views");
app.set("view engine", "html");
app.engine("html", mustacheExpress());
app.use(fileUpload());
app.use("/upload", Express.static("upload"));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

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
  if (req.files) {
    const sample = req.files.photo; // atribut photo harus sama dengan atribut dari form input di html nya
    let name = sample.name;
    let ext = name.split(".");
    ext = ext.pop();

    await sample.mv(
      "./upload/" + Math.floor(Math.random() * 10000) + "." + ext,
      (err) => {
        if (err) res.status(503).send("error");
        res.redirect("/");
      }
    );
  } else {
    res.redirect("/");
  }
});

app.post("/download", (req, res) => {
  console.log("./upload/" + req.body.photo);
  res.download("./upload/"+req.body.photo, req.body.photo, (err) => {
    if (err) console.log(err);
    console.log("berhasil?");
  });
});

app.listen(3000, () => {
  console.log("app listen at port 3000");
});
