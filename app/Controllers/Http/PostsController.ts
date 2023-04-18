import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import Post from 'App/Models/Post'

export default class PostsController {

    public async create({view}:HttpContextContract) {
        

        return view.render('posts/create')
        return 'create post'
    }

    public async store({request,response,auth}:HttpContextContract) {
        const image = request.file('post_img')
        
        if (image) {
            const imageName= new Date().getTime().toString() + `.${image.extname}`
            await image.move(Application.publicPath('images'), {
               name:imageName
            })
           const post =new Post()
            post.image = `images/${imageName}`
            post.caption = request.input('caption')
            post.userId = auth.user!.id
            
            post.save()
            return response.redirect(`/${auth.user?.username}`)
        }

        return 'create post'
    }



}
