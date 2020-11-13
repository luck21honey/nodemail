var mail = require('./sendEncryptedMail');
var param = {
    from: "pandamoney425@gmail.com",
    to: "peacehoney425@gmail.com",
    subject: "This email is encrypted",
    body: "This is a digitally encrypted mail",
    attachPath: "../source/test.csv",
    pfxPath: "../source/ELD_RSA.pfx",
    cerPath: "../source/FMCSA_ELD_Expires_April2023_Certificate.cer"
}

mail.sendEncryptedMail(param);
