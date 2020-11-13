var fs = require('fs');
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

function chilkatExample() {

    // This example requires the Chilkat API to have been previously unlocked.
    // See Global Unlock Sample for sample code.

    // The mailman object is used for sending and receiving email.
    var mailman = new chilkat.MailMan();

    // Set the SMTP server.
    mailman.SmtpHost = "smtp.comcast.net";

    // Load the .cer file into a certificate object.
    // When sending S/MIME encrypted email, it is the recipient's
    // certificate that is used for encryption.  Only the public key
    // is needed to encrypt.  The recipient is the only
    // one possessing the private key, and therefore is the only
    // one able to decrypt.
    var cert = new chilkat.Cert();
    // fs.readFile(__dirname + '../source/ELD_RSA.crt', function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     cert = data;
    //     console.log(data.toString());
    // });

    var success = cert.LoadFromFile("../source/ELD_RSA.crt");
    if (success !== true) {
        console.log(cert.LastErrorText);
        return;
    }
    console.log('Success!!!', success);

    // // Create a new email object
    // var email = new chilkat.Email();

    // email.Subject = "This email is encrypted";
    // email.Body = "This is a digitally encrypted mail";
    // email.From = "Chilkat Support <support@chilkatsoft.com>";
    // success = email.AddTo("Chilkat Blog", "admin@cknotes.com");

    // // Indicate that the email is to be sent encrypted.
    // email.SendEncrypted = true;

    // // Specify the certificate to be used for encryption.
    // success = email.SetEncryptCert(cert);

    // success = mailman.SendEmail(email);
    // if (success !== true) {
    //     console.log(mailman.LastErrorText);
    // }
    // else {
    //     console.log("Mail Sent!");
    // }

}

chilkatExample();