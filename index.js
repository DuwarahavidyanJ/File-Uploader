const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');

const app = express()
const port = process.env.PORT || 5000;


//middleware
app.use(cors('*'));
app.use(bodyParser.json())
app.use(express.static('public'))  // static html file should be saved in public folder
app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json())
var nm = require('nodemailer');
let savedOTPS = {};


mongoose.connect('mongodb://localhost:27017/loginDB'),{
    useNewURLParser: true,
    useUnifiedTopology: true
};


var db = mongoose.connection;

//if we have any connection to DB we can check
db.on('error',()=>console.log("Error in Conneting to Database"));
db.once('open', () => console.log("Connected to Database") );


app.get("/",(req,res)=>{
    res.render("login")
})

app.post("/login", async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;

        const user = await db.collection('users').findOne({ Email: email });

        if (!user) {
            return response.send("<script>alert('Invalid information! Please create an account first');</script>");
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            return response.redirect('upload.html');
        } else {
            return response.send("<script>alert('Invalid Password');</script>");
        }
    } catch (error) {
        console.error(error);
        return response.status(500).send("<script>alert('Internal Server Error');</script>");
    }
});


// signup should be same in line 22 in index.html
app.post("/signup", async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var create_password = req.body.create_password;
    var confirm_password = req.body.confirm_password;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(create_password, 10);

    // Store data in a single object
    const data = {
        "Name": name,
        "Email": email,
        "Password": hashedPassword
    }

    // Check if email already exists in the database
    db.collection('users').findOne({ Email: data.Email }, function (err, doc) {
        if (err) throw err;

        if (doc) {
            return res.send("<script>alert('Email already exists. Please use a different email.');</script>" );
        } else {
            db.collection('users').insertOne(data, (err, collection) => {
                if (err) {
                    throw err;
                } else {
                    console.log("Record Inserted Successfully");
                    // Redirect to the home page or send a response as needed
                    return res.redirect("EmailOTPVerification.html");
                }
            });
        }
    });
});


var transporter = nm.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'duwa2323@gmail.com',
            pass: 'bqtd lkbv hsoa vmdw'
        }
    }
);

app.post('/sendotp', (req, res) => {
    let email = req.body.email;
    let digits = '0123456789';
    let limit = 4;
    let otp = ''
    for (i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];

    }
    var options = {
        from: 'duwa2323@gmail.com',
        to: `${email}`,
        subject: "Testing node emails",
        html: `<p>Enter the otp: ${otp} to verify your email address</p>`

    };
    transporter.sendMail(
        options, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send("couldn't send")
            }
            else {
                savedOTPS[email] = otp;
                setTimeout(
                    () => {
                        delete savedOTPS.email
                    }, 60000
                )
                res.send("sent otp")
            }

        }
    )
})

// Email Verification

app.post('/verify', (req, res) => {
    let otprecived = req.body.otp;
    let email = req.body.email;
    if (savedOTPS[email] == otprecived) {
        res.send("Verfied")
        return res.redirect('index.html'); 

    }
    else {
        res.status(500).send("Invalid OTP")
    }
})




//File Uploading

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'FileUpload',
    password: 'VIDyan12#$',
    port: 5432,
});

app.use(express.static('public'));
app.use(express.json());

const upload = multer();

app.post('/upload', upload.single('file'), (req, res) => {
    const { originalname, buffer } = req.file;

    pool.query('INSERT INTO files (filename, filedata) VALUES ($1, $2) RETURNING *', [originalname, buffer], (error, results) => {
        if (error) {
            throw error;
        }

        res.json(results.rows[0]);
    });
});

app.get('/files', (req, res) => {
    pool.query('SELECT id, filename FROM files', (error, results) => {
        if (error) {
            throw error;
        }

        res.json(results.rows);
    });
});

app.get('/download/:id', (req, res) => {
    const fileId = req.params.id;

    pool.query('SELECT filename, filedata FROM files WHERE id = $1', [fileId], (error, results) => {
        if (error) {
            throw error;
        }

        const { filename, filedata } = results.rows[0];
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/octet-stream');
        res.send(filedata);
    });
});

app.delete('/delete/:id', (req, res) => {
    const fileId = req.params.id;

    pool.query('DELETE FROM files WHERE id = $1 RETURNING *', [fileId], (error, results) => {
        if (error) {
            throw error;
        }

        res.json({ message: 'File deleted successfully', file: results.rows[0] });
    });
});


//routing
app.get('/',(req, res) => {
    return res.redirect('index.html'); //this will be starting page
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


