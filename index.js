var mail = require('./sendEncryptedMail');
var param = {
    from: "pandamoney425@gmail.com",
    to: "fmcsaeldsub@dot.gov", // peacehoney425@gmail.com
    subject: "TEST: ELD records from TEST:TESTXX",
    body: "This is a digitally encrypted mail",
    attachPath:  __dirname + "/../source/test.csv",
    pfxPath: __dirname + "/../source/ELD_RSA.pfx",
    cerPath:  __dirname + "/../source/FMCSA_ELD_Expires_April2023_Certificate.cer"
}

mail.sendEncryptedMail(param);
