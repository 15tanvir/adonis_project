import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column ,beforeSave , hasMany,
  HasMany} from '@ioc:Adonis/Lucid/Orm'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import Post from './Post';
import Following from './Following';


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number
 
  @column()
  public name: string

  @column()
  public username: string

  @column()
  public avtar: string

  @column()
  public details: string

  @column()
  public email: string

  @column()
  public password: string



  @column()
  public confirm_password: string

  @column.dateTime()
  public email_verfied_at: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Following)
  public followings: HasMany<typeof Following>

  public async followers() {
    const followers = await Following.query().where('following_id', this.id)
    
    return  followers.length
  }

  //here we open the link in incognito mode the, link will show the invalid token. Using this aproach we can perticularly verified the link in the particular window,as we are using the session.
  // public async sendVerificationEmail(session) {
  //   const token = uuidv4()
  //   session.put(`token-${this.id}`,token)
  //   const url=`${Env.get('APP_URL')}/confirm-email/${this.id}/${token}`

  //  await  Mail.send((message) => {
  //     message
  //       .from('tsheikh@cxr.agency')
  //       .to(this.email)
  //       .subject('Verify Email')
  //       .htmlView('emails/verify', { user:this ,url})
  // })
  // }

  public async sendVerificationEmail() {
    // const token = uuidv4()
    // session.put(`token-${this.id}`,token)
    const url = Env.get('APP_URL')+ Route.makeSignedUrl('verifyEmail', {
      params: {
        email: this.email
      },
      expiresIn:'30min'
      
    })

    // const url=`${Env.get('APP_URL')}/confirm-email/${this.id}/${token}`

   await  Mail.send((message) => {
      message
        .from('tsheikh@cxr.agency')
        .to(this.email)
        .subject('Verify Email')
        .htmlView('emails/verify', { user:this ,url})
  })
  }
}
