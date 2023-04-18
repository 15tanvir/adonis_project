import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'


export default class EmailVerifiesController {

    public async index({  response, auth}: HttpContextContract) {

        // const nanoid = require("nanoid")



        // await Mail.send((message) => {
        //     message
        //       .from('tsheikh@cxr.agency')
        //       .to(auth.user.email)
        //       .subject('Verify Email')
        //         .htmlView('emails/verify', { user: auth.user , url})
        // })

        auth.user?.sendVerificationEmail()

        return response.redirect().back()
    }


    public async store({ request,response, params }: HttpContextContract) {

        // const userid = params.userid

        // const token = params.token



        // const sessionToken = session.get(`token-${userid}`)

        if (request.hasValidSignature()) {
        const user = await  User.findByOrFail('email',params.email);

            user.email_verfied_at = DateTime.local()
            user.save()
            // session.forget(`token-${userid}`)
            return response.redirect(`${user.username}`);

        }
        else {
             return "Invalid token"
        }
        // return user

        // return "wwo"
    }

}
