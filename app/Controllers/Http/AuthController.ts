import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema ,rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {

    public async signup({request,response}:HttpContextContract){
        const signUpSchema = schema.create({
            name: schema.string(),
            email: schema.string( [
                rules.email()
            ]),
            password: schema.string(),
            confirm_password: schema.string(),
            username: schema.string(),

        
        })

        try {
            const payload = await request.validate({
                schema: signUpSchema,
                messages: {
                    required: '{{ field }} is required to sign up',
                }
            })

              const user = new User()
              await user.fill(payload).save()
              
              //send Email
            
            //   await Mail.send((message) => {
            //     message
            //       .from('tsheikh@cxr.agency')
            //       .to(user.email)
            //       .subject('Verify Email')
            //       .htmlView('emails/verify', { user })
            //   })

             user?.sendVerificationEmail()



              return response.redirect('/')

        } catch (error) {
            response.badRequest(error.messages)
        }
     


        
        // console.log(payload)

        
        // console.log(user.$isPersisted) // true

    }
    
    public async login({ request ,auth,response}: HttpContextContract) {
        const loginSchema = schema.create({
            email: schema.string( [
                rules.email()
            ]),
            password: schema.string(),
        
        })
        
        const req= await request.validate({
            schema: loginSchema,
            messages: {
                required: '{{ field }} is required to login',
            }
        })

        const email = req.email;
        const password = req.password;

        const user = await auth.use('web').attempt(email, password)

        // const user = await User.findByOrFail("email",req.email)

        auth.isLoggedIn
  
        return response.redirect(`${user.username}`)

        return auth.use('web').isLoggedIn;
    }
}
