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

module.exports = {
    async sendEncryptedMail(param) {
        /**
         * Unlock block
         */
        var glob = new chilkat.Global();
        var success = glob.UnlockBundle(process.env.CK_KEY);
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
        // console.log("Trial more, or with a purchased unlock code? >>> ", glob.LastErrorText);





        /**
         * Setup Email & add attachments
         */
        var mailman = new chilkat.MailMan();
        mailman.SmtpHost = process.env.SMTP_HOST;
        mailman.SmtpUsername = process.env.SMTP_USERNAME;
        mailman.SmtpPassword = process.env.SMTP_PASSWORD;
        mailman.SmtpPort = process.env.SMTP_PORT;
        mailman.StartTLS = true;

        var email = new chilkat.Email();
        email.Subject = param.subject;
        email.Body = param.body;
        email.From = param.from;
        success = email.AddTo(param.to, param.to);
        email.SendSigned = true;
        email.SendEncrypted = true;
        // Add some attachments
        var contentType = email.AddFileAttachment(param.attachPath)
        if (email.LastMethodSuccess !== true) {
            console.log(email.LastErrorText);
            return;
        }
        console.log('setup successfully!!!');







        /**
         * Encrypting
         */
        var cert = new chilkat.Cert();
        var success = cert.LoadFromFile(param.cerPath);
        if (success !== true) {
            console.log('load cer error>>>', cert.LastErrorText);
            return;
        }
        success = email.SetEncryptCert(cert);
        console.log('encrypted!!!');


        






        /**
         * Signing
         */
        var pfx = new chilkat.Pfx();
        var success = pfx.LoadPfxFile(param.pfxPath, "");
        if (success !== true) {
            console.log('load pfx error>>>', pfx.LastErrorText);
            return;
        }

        var signCert = pfx.GetCert(0);
        if (pfx.LastMethodSuccess !== true) {
            console.log('GetCert error >>>', pfx.LastErrorText);
            return;
        }
        email.SetSigningCert(signCert);
        console.log('signing success!!!');







        /**
         * Sending email
         */
        success = mailman.SendEmail(email);
        if (success !== true) {
            console.log('Error in sending email>>>', mailman.LastErrorText);
        } else {
            success = mailman.CloseSmtpConnection();
            if (success !== true) {
                console.log("Connection to SMTP server not closed cleanly.");
            }

            console.log("Mail with attachments sent!");
        }

    }
}
