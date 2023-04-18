import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    
    // this is the one way
    // if (auth.isGuest) {
    //   await next()
    // } else {
    //   return response.redirect('/profile')
    // }

    //alternate way 

    if (auth.isAuthenticated) {
      return response.redirect('/profile')
      
    } else {
      await next()
    }
  }
}
