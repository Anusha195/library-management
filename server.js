const express = require('express');
const admin = require('firebase-admin');
const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const serviceAccount = require('./key.json');
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('login');
});

// Employee login 
app.post('/employee', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.collection('employee').where('username', '==', username).where('password', '==', password).get();
    if (user.empty) {
        res.redirect('/admin');
    } else {
        res.send('Invalid username or password');
    }
});


app.post('/add-book', async (req, res) => {
    const { bookName, bookId, author } = req.body;
    await db.collection('books').add({ bookName, bookId, author, available: true });
    res.redirect('/admin');
});

app.get('/book-report', async (req, res) => {
    try {
        const booksSnapshot = await db.collection('books').get();
        const books = [];

        booksSnapshot.forEach(doc => {
            books.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.render('book-report', { books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/book-request', async (req, res) => {
    try {
        const requestSnapshot = await db.collection('requests').get(); 
        const bookRequests = [];

        requestSnapshot.forEach(doc => {
            bookRequests.push({ id: doc.id, ...doc.data() }); 
        });

        res.render('book-request', { bookRequests: bookRequests });
    } catch (error) {
        console.error("Error fetching book requests: ", error);
        res.status(500).send("Error fetching book requests.");
    }
});

app.post('/acceptRequest/:id', async (req, res) => {
    const requestId = req.params.id;

    try {
        const requestSnapshot = await db.collection('requests').doc(requestId).get();

        if (!requestSnapshot.exists) {
            return res.status(404).send("Request not found.");
        }
        const requestData = requestSnapshot.data();
        await db.collection('issuedBooks').add({
            bookId: requestData.bookId,
            branch: requestData.branch,
            personName: requestData.personName,
            issuedAt: new Date() 
        });
        await db.collection('requests').doc(requestId).delete();
        res.redirect('/book-request');
    } catch (error) {
        console.error("Error accepting request: ", error);
        res.status(500).send("Error accepting request.");
    }
});

app.get('/admin', (req, res) => {
    res.render('admin'); 
});

app.get('/s_t', (req, res) => {
    res.render('s_t'); 
});

//add-book
app.get('/add-book', (req, res) => {
    res.render('add-book'); 
});

//add-person
app.get('/add-person', (req, res) => {
    res.render('add-person'); 
});



app.post('/add-person', async (req, res) => {
    const { username, password, email, type } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('users').add({
            username: username,
            password: hashedPassword, 
            email: email,
            type: type
        });

        res.send('Person added successfully!');
    } catch (error) {
        console.error("Error adding person: ", error);
        res.status(500).send("Error adding person.");
    }
});

//book-report
app.get('/book-report', (req, res) => {
    res.render('book-report'); 
});

//book-request
app.get('/book-request', (req, res) => {
    res.render('book-request'); 
});

app.get('/issue-report', async (req, res) => {
    try {
        const issuebooksSnapshot = await db.collection('issuedBooks').get();
        const issuebooks = issuebooksSnapshot.docs.map(doc => doc.data());

        res.render('issue-report', { issuebooks });
    } catch (error) {
        console.error('Error fetching issue report:', error);
        res.status(500).send('Error fetching issue report');
    }
});

//issue report
app.get('/issue-report', (req, res) => {
    res.render('issue-report'); 
});


app.get('/student-report', async (req, res) => { 
    try {
        const usersSnapshot = await db.collection('users').get();
        const students = [];

        usersSnapshot.forEach(doc => {
            const { password, ...studentData } = doc.data(); 
            students.push({
                id: doc.id,
                ...studentData
            });
        });

        res.render('student-report', { students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/student-report', (req, res) => {
    res.render('student-report'); 
});


app.post('/issue-book', async (req, res) => {
    const { bookId, username, branch } = req.body;

    try {
        const currentDate = new Date();
        const dateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        await db.collection('issuedBooks').add({
            bookId: bookId,
            username: username,
            branch: branch,
            issuedAt: dateOnly 
        });
        res.send("issued book successfully")
    } catch (error) {
        console.error('Error issuing book:', error);
        res.status(500).send('Error issuing book');
    }
});
//issue-book
app.get('/issue-book', (req, res) => {
    res.render('issue-book'); 
});

//logout
app.get('/logout', (req, res) => {
    res.render('login'); 
});


// Student/Teacher login with bcrypt password comparison
app.post('/student-teacher', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userSnapshot = await db.collection('users')
            .where('username', '==', username)
            .get();

        if (userSnapshot.empty) {
            return res.send('Invalid username or password');
        }

        const userData = userSnapshot.docs[0].data();
        const isMatch = await bcrypt.compare(password, userData.password);

        if (isMatch) {
            req.session.username = username;
            res.render('s_t');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

app.get('/my-account', async (req, res) => {
    if (!req.session.username) {
        return res.redirect('/student-teacher'); 
    }

    const username = req.session.username;

    try {
        const userSnapshot = await db.collection('users')
            .where('username', '==', username)
            .get();

        if (userSnapshot.empty) {
            return res.status(404).send('User not found');
        }

        const userDoc = userSnapshot.docs[0].data();
        res.render('my-account', { user: userDoc });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Error fetching user details');
    }
});

app.get('/my-account', (req, res) => {
    res.render('my-account'); 
});

app.get('/request-book', (req, res) => {
    res.render('request-book');  
});

app.post('/submit-book-request', async (req, res) => {
    const { bookID, branch } = req.body;
    const username = req.session.username;  

    if (!bookID || !branch || !username) {
        return res.status(400).send('Book ID, branch, and username are required.');
    }

    try {
        await db.collection('requests').add({
            bookId: bookID,
            branch: branch,  
            personName: username,  
            requestedAt: new Date()
        });

        res.send('Book request submitted successfully.');
    } catch (error) {
        res.status(500).send('Error submitting book request.');
    }
});

app.get('/report-book', async (req, res) => {
    const username = req.session.username; 

    try {
        const issuedBooksSnapshot = await db.collection('issuedBooks').where('personName', '==', username).get();

        if (issuedBooksSnapshot.empty) {
            return res.render('report-book', { issuedBooks: [] });
        }

        const issuedBooks = issuedBooksSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });

        res.render('report-book', { issuedBooks });
    } catch (error) {
        console.error("Error fetching issued books: ", error);
        res.status(500).send("Error fetching issued books.");
    }
});
app.post('/returnBook/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        await db.collection('issuedBooks').doc(bookId).delete();
        res.render('s_t');
    } catch (error) {
        console.error("Error returning book: ", error);
        res.status(500).send("Error returning book.");
    }
});


//logout
app.get('/logout', (req, res) => {
    res.render('login'); 
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
