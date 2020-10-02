const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const {User} = require('./model/User');
const {auth} = require('./middleware/auth');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB is connected...'))
  .catch(err => console.log(err));

/* Routes */
app.get('/', (req, res) => {
    res.send('This is root page')
});

app.get('/api/hello', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/user/register', (req, res) => {
    // 회원 가입할 때 필요한 정보들을 클라이언트에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) {return res.json({success: false, err});}
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/user/login', (req, res) => {
    // 요청 된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "일치하는 이메일이 없습니다."
            });
        }

        // 요청 된 이메일이 DB에 있다면 비밀번호가 일치하는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({loginSuccess: false, message: "비밀번호가 맞지 않습니다."});
            }

            // 비밀번호까지 맞다면 Token을 생성한다.
            user.generateToken((err, user) => {
                if (err) {return res.status(400).send(err);}

                // 생성한 token을 쿠키에 저장한다.
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({loginSuccess: true, userId: user._id});
            });
        });
    });
});

app.get('/api/user/auth', auth, (req, res) => {
    // 여기 까지 middleware를 통과했다는 의미는 Authentication이 True라는 뜻이다.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/user/logout', auth, (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ''},
        (err, user) => {
            if (err) {return res.json({success: false, err});}
            return res.status(200).send({
                success: true
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});