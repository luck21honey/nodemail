var mail = require('./sendEncryptedMail');
var param = {
    from: "pandamoney425@gmail.com",
    to: "peacehoney425@gmail.com",
    subject: "This email is encrypted",
    body: "This is a digitally encrypted mail",
    attachPath: __dirname + "/../source/test.csv",
    certPath: __dirname + "/../source/ELD_RSA.crt"
}

mail.sendEncryptedMail(param);
