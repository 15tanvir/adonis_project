import Route from '@ioc:Adonis/Core/Route'

Route.get('/','HomeController.index')
Route.get('/signup', async ({ view }) => {
  return view.render('auth/signup')
}).middleware('guest')
Route.get('/login', async ({ view }) => {
  return view.render('auth/login')
}).middleware('guest')



Route.post('/verify-email', 'EmailVerifiesController.index').middleware('auth')
Route.get('/verify-email/:email','EmailVerifiesController.store').as('verifyEmail')






Route.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/login')
})


//without controller
// Route.post('/sign-up', async ({ request }) => {

//   return request
// })

Route.post('/signup', 'AuthController.signup')
Route.post('/login','AuthController.login')

// Route.get('/:username', async ({ view }) => {
//   return view.render('profile')
// }).middleware('auth')

Route.get('/post/create','PostsController.create').middleware('auth')
Route.post('/post/create','PostsController.store').middleware('auth')


//follow
Route.post('/follow/:userid', 'FollowsController.store').middleware('auth')

Route.delete('/follow/:userid','FollowsController.destroy').middleware('auth')


Route.get('/accounts/edit','ProfilesController.edit').middleware('auth')
Route.post('/accounts/edit','ProfilesController.update').middleware('auth')

Route.get('/:username','ProfilesController.profile').middleware('auth')