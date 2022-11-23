const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require("./utils/contact");
const { body, check, validationResult } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(morgan("dev"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//configurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layout/main-layout",
    title: "halaman home",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layout/main-layout",
    title: "halaman about",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    layout: "layout/main-layout",
    title: "halaman contact",
    contacts,
    msg: req.flash("msg"),
  });
});

//form tambah data
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layout/main-layout",
    title: "halaman tambah contact",
  });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("nama sudah terdaftar");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("nohp", "no HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        layout: "layout/main-layout",
        title: "halaman tambah contact",
        errors: errors.array(),
      });
    } else {
      // res.send(req.body);
      addContact(req.body);
      req.flash("msg", "Data Contact berhasil ditambahakan");
      res.redirect("/contact");
    }
  }
);

//delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  //jika contact tidak ada
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data Contact berhasil dihapus");
    res.redirect("/contact");
  }
});

//form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    layout: "layout/main-layout",
    title: "halaman ubah data  contact",
    contact,
  });
});

//ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        console.log(value);
        throw new Error("nama sudah terdaftar");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("nohp", "no HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        layout: "layout/main-layout",
        title: "halaman ubah contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      // res.send(req.body);
      updateContacts(req.body);
      req.flash('msg','Data Contact : ', req.body.nama, ' berhasil diubah');
      res.redirect("/contact");
    }
  }
);

//detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    layout: "layout/main-layout",
    title: "halaman detail contact",
    contact,
  });
});

app.get("/product/:id", (req, res) => {
  res.send(
    `Produk id : ${req.params.id} <br> Category : ${req.query.category}`
  );
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}....`);
});
