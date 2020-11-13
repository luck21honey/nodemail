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
        // Replace license key after purchased
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


        // The mailman object is used for sending and receiving email.
        var mailman = new chilkat.MailMan();

        // Set the SMTP server
        mailman.SmtpHost = process.env.SMTP_HOST;
        mailman.SmtpUsername = process.env.SMTP_USERNAME;
        mailman.SmtpPassword = process.env.SMTP_PASSWORD;
        mailman.SmtpSsl = process.env.SMTP_SSL;
        mailman.SmtpPort = process.env.SMTP_PORT;

        // Load the .cer file into a certificate object.
        var cert = new chilkat.Cert();
        var success = cert.LoadFromFile(param.cerPath);
        if (success !== true) {
            console.log('load cer error>>>', cert.LastErrorText);
            return;
        }
        console.log('Load Cer Success!!!', success);

        var email = new chilkat.Email();
        email.Subject = param.subject;
        email.Body = param.body;
        email.From = param.from;
        email.SendSigned = true;
        success = email.AddTo(param.to, param.to);

        // Add some attachments
        var contentType = email.AddFileAttachment(param.attachPath)
        if (email.LastMethodSuccess !== true) {
            console.log(email.LastErrorText);
            return;
        }

        // encryption
        email.SendEncrypted = true;
        success = email.SetEncryptCert(cert);

        // signing
        // The 1st argument is the filename, the 2nd arg is the PFX file's password
        success = mailman.AddPfxSourceFile(param.pfxPath, process.env.PFX_PASS);
        if (success !== true) {
            console.log('load pfx error>>>', mailman.LastErrorText);
            return;
        }

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
