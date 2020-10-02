const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function (next) {
    let user = this;

    // 비밀번호를 변경 할 때만 암호화 하기(이메일이나 이름을 변경할 때에는 동작하지 않음)
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
           if (err) {
               return next(err);
           }
           bcrypt.hash(user.password, salt, function (err, hash) {
               if (err) {
                   return next(err);
               }
               user.password = hash;
               next();
           });
        });
    } else {
        // next()를 넣어줘야 이후의 과정으로 넘어가게 된다.
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword와 암호화된 비밀번호가 일치하는가 확인
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) {return cb(err);}
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function (cb) {
    let user = this;

    // jsonwebtoken을 이용해서 token 생성하기
    const token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function (err, user) {
        if (err) {return cb(err);}
        cb(null, user);
    });
}

userSchema.statics.findByToken = function (token, cb) {
    let user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 사용자 아이디를 이용해서 사용자를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는지 비교한다.
        user.findOne({
            '_id': decoded,
            'token': token
        }, function (err, user) {
            if (err) {return cb(err);}
            cb(null, user);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = {User}