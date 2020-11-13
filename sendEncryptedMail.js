require('dotenv').config();

var os = require('os');
if (os.platform() == 'win32') {
    if (os.arch() == 'ia32') {
        var chilkat = require('@chilkat/ck-node12-win-ia32');
    } else {
        var chilkat = require('@chilkat/ck-node12-win64');
    }
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node12-arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('@chilkat/ck-node12-linux32');
    } else {
        var chilkat = require('@chilkat/ck-node12-linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('@chilkat/ck-node12-macosx');
}

function sendEncryptedMail() {
    // Replace license key after purchased
    var glob = new chilkat.Global();
    var success = glob.UnlockBundle("Anything for 30-day trial");
    if (success !== true) {
        console.log("Unlock error>>>", glob.LastErrorText);
        return;
    }

    var status = glob.UnlockStatus;
    if (status == 2) {
        console.log("Unlocked using purchased unlock code.");
    }
    else {
        console.log("Unlocked in trial mode.");
    }
    console.log("trial more, or with a purchased unlock code? >>> ", glob.LastErrorText);


    // The mailman object is used for sending and receiving email.
    var mailman = new chilkat.MailMan();

    // Set the SMTP server
    mailman.SmtpHost = "smtp.gmail.com";
    mailman.SmtpUsername = "";
    mailman.SmtpPassword = "";
    mailman.SmtpSsl = true;
    mailman.SmtpPort = 465;

    // Load the .cer file into a certificate object.
    var cert = new chilkat.Cert();
    var success = cert.LoadFromFile("../source/ELD_RSA.crt");
    if (success !== true) {
        console.log(cert.LastErrorText);
        return;
    }
    console.log('Load Cert Success!!!', success);

    var email = new chilkat.Email();

    email.Subject = "This email is encrypted";
    email.Body = "This is a digitally encrypted mail";
    email.From = "";
    success = email.AddTo("Chilkat Blog", ""); // fmcsaeldsub@dot.gov

    // Indicate that the email is to be sent encrypted.
    email.SendEncrypted = true;
    // Specify the certificate to be used for encryption.
    success = email.SetEncryptCert(cert);

    success = mailman.SendEmail(email);
    if (success !== true) {
        console.log('Error in sending email>>>', mailman.LastErrorText);
    }
    else {
        console.log("Mail Sent!");
    }

}