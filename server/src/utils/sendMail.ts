// TODO:
// ! nodemailer not working on my pc but it's working on cloud
// ! I think it's because of firewall of maybe other issue
// ! so, for now I'm gonna mock this.

// import nodemailer from "nodemailer"

type Mail = {
  to: string
  subject: string
  html: string
}

export async function sendMail(options: Mail) {
  console.log(options)
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "w7zevtfdoyxj62rv@ethereal.email", // generated ethereal user
  //     pass: "JFBjEBeJCuZHGHVUBM", // generated ethereal password
  //   },
  // })

  // // send mail with defined transport object
  // await transporter.sendMail({
  //   from: '"Danish Sajjad" <danishsjjad@gmail.com>', // sender address
  //   to: "dsajjad258@gmail.com", // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: "Hello world? plain text", // plain text body
  //   html: "<b>Hello world? in html</b>", // html body
  // })
}
