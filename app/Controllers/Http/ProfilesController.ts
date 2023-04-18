import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'

export default class ProfilesController {

    public async profile({ view, params,auth }: HttpContextContract) {
        const username = params.username
        
        const user= await User.findBy('username',username)

        if (!user) {
            // return "Page Not Found"
            return view.render('errors/not-found')
        }else{
            await user.load('posts')

            await auth.user?.load('followings')

            await user?.load('followings')


            const followers = await auth.user?.followers()
            
            return  view.render('profile',{user , followers})
        }
    }

    public async edit({ view }: HttpContextContract) {
        
        // const user= await User.findBy('username',username)

        return view.render('accounts/edit')
    }

    public async update({request,auth,response }: HttpContextContract) {
        
        const user = auth.user!
        const avatar = request.file('avatar')!
        
        if (avatar) {
            const imageName= new Date().getTime().toString() + `.${avatar.extname}`
            await avatar.move(Application.publicPath('images'), {
               name:imageName
            })
           
            user.avtar = `images/${imageName}`
        }
  

   
        user.details = request.input('details')
        await user!.save()

        return response.redirect(`/${user?.username}`)
        // user.avatar =
        // const user= await User.findBy('username',username)

        // return view.render('accounts/edit')
    }
}
