import { Request, Response } from 'express'

import { Mail } from "../../models/nodemailer";
import fs from 'fs'
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import path from 'path'

import userTable from '../../models/tabelaLogins';
import configJwt from '../../config/services/jwt';

type users = {
	nome: string,
	email: string,
	senha: string,
	role: string
}

export default {
	/* async store(req, res) {
		const { name, email, password } = req.body;
		const user = {
			name,
			email,
			password,
		};
		// var htmlstream = fs.createReadStream("./src/config/messages/mail.html");
		Mail.sendMail({
			from: 'Zincagem Flash <noreply@zincagemflash.com.br>',
			to: `${name} <${email}>`,
			subject: 'Confirmação de cadastro',
			html: `
					<style>
									* {
											font-family: Arial, Helvetica, sans-serif;
									}
							</style>
							<h1>Confirmação de login</h1>
							<p>Bom dia ${name}, preciso que confirme a sua conta para ter a acesso a ela</p>
					`
			})
			return res.json(user);
	}, */ // Colocar depois depois de fazer o login

	async criar(req: Request, res: Response) {
		const data = moment().format('DD/MM/YYYY-HH:MM:SS')
		const { name, email, password, repeatpassword } = req.body;
		const role = 'default'
		const created_at = data;
		console.log(req.body)
		const dados = {
			name,
			email,
			password,
			repeatpassword,
			role,
			created_at
		}
		if (!dados.password === dados.repeatpassword) {
			return res.json({
				Error: 'senhas não coincidem'
			})
		}
		dados.password = await bcrypt.hash(dados.password, 8)

		if (await userTable.findOne({ where: { email } })) {
			return res.status(401).json({
				message: "Usuário já existente"
			})
		}

		const login: users = {
			nome: dados.name,
			email: dados.email,
			senha: dados.password,
			role: dados.role
		}

		console.log(login)

		try {
			await userTable.create(login);
			res.status(201).json({
				error: false,
				message: "Usuário cadastrado com sucesso"
			});
			console.log('Novo login cadastrado:');
			console.log('Email: ' + dados.email);
			console.log('Momento: ' + data);
		} catch (error) {
			console.log(error)
		}
	},

	async logar(req: Request, res: Response) {
		const { email, password } = req.body;

		const dados = {
			email,
			password
		}

		const userExist = await userTable.findOne({
			where: {
				email: dados.email
			}
		})

		if (!userExist) {
			return res.status(404).render(path.join(__dirname + '/../../views/errors/emailNotFound.ejs'))
		}

		if (!(await bcrypt.compare(password, userExist.senha))) {
			return res.status(400).json({
				error: true,
				message: 'A senha está inválida!'
			})
		}

		const token = jwt.sign(
			{ id: userExist.id },
			configJwt.secret,
			{ expiresIn: configJwt.expireIn }
		)

		res.cookie('Authentication', 'Bearer ' + token, {
			httpOnly: true,
			secure: true
		})
		res.send('hello')

	},

	async forgotPassword(req: Request, res: Response) {
		const { email } = req.body;

		if (!email) {
			return res.status(400).send(
				JSON.stringify({
					'error': 'The email is not found'
				})
			)
		}

		const userEmail = await userTable.findOne({
			where: {
				email: email,
			}
		});
		try {
			const token = crypto.randomBytes(10).toString('hex');
			const now = new Date();
			now.setHours(now.getHours() + 1);
			if (!userEmail) {
				res.status(404).send(
					JSON.stringify({
						'Error': 'The email is not found'
					})
				);
			}

			await Mail.sendMail({
				from: 'noreply@zincagemflash.com.br',
				to: email,
				subject: 'Recuperação de Senha',
				html: `
				<!DOCTYPE html>
<html>
<head>
  <style>
    @media screen {
      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 400;
        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
      }

      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 700;
        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
      }
    }

    /**
     * Avoid browser level font resizing.
     * 1. Windows Mobile
     * 2. iOS / OSX
     */
    body,
    table,
    td,
    a {
      -ms-text-size-adjust: 100%; /* 1 */
      -webkit-text-size-adjust: 100%; /* 2 */
    }

    /**
     * Remove extra space added to tables and cells in Outlook.
     */
    table,
    td {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }

    /**
     * Better fluid images in Internet Explorer.
     */
    img {
      -ms-interpolation-mode: bicubic;
    }

    /**
     * Remove blue links for iOS devices.
     */
    a[x-apple-data-detectors] {
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      color: inherit !important;
      text-decoration: none !important;
    }

    /**
     * Fix centering issues in Android 4.4.
     */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

    body {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /**
     * Collapse table borders to avoid space between cells.
     */
    table {
      border-collapse: collapse !important;
    }

    a {
      color: #1a82e2;
    }

    img {
      height: auto;
      line-height: 100%;
      text-decoration: none;
      border: 0;
      outline: none;
    }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Redefina sua senha.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                <img src='/assets/flashlogo.png' border="100" width="100" style="display: block; width: 420px; max-width: 420px; min-width: 48px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Redefina sua senha</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Toque no botão abaixo para redefinir a senha da sua conta de cliente. Se você não solicitou uma nova senha, você pode excluir este e-mail com segurança. </p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="https://zincagemflash.com.br/reset_password/token=<%= token %>" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Clique aqui</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Se isso não funcionar, copie e cole o seguinte link no seu navegador:</p>
              <p style="margin: 0; max-width: 600px; width: 100%;"><a href="https://zincagemflash.com.br/reset_password/token=${token}" target="_blank">https://zincagemflash.com.br/reset_password/token=${token}</a></p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Atenciosamente,<br> Zincagem Flash</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start permission -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">Você recebeu este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta. Se você não solicitou uma redefinição de senha, pode excluir este e-mail com segurança.</p>
            </td>
          </tr>
          <!-- end permission -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>
				`
			})
			res.send(
				JSON.stringify({
					'message': 'Success'
				})
			)

		} catch (err) {
			console.log(err.message)
			res.status(400).send({ 'error': 'Error on forgot  password, try again' });
		}
	}
};