/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";

export const sendMail = (email: string, subject: any, html: any) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.USER_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: email,
		subject: subject,
		html: html, // HTML body
	};

	transporter.sendMail(mailOptions, function (error: any, info: any) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent : " + info.response);
		}
	});
};

export const sendMailOTPRegister = async (otp: string, email: string) => {
	const subject = "Register - Your OTP Code";
	const html = `
				<h1>Register New Account</h1>
				<p>We received a request to register your account. Use the following OTP code to register your account:</p>
				<p>OTP will expire in 3 minutes</p>
				<h2 style="color: #000;">${otp}</h2>
				<p>If you did not request this, please ignore this email.</p>
				<p>Thank you!</p>
		`;
	sendMail(email, subject, html);
};
