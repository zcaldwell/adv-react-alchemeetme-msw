// When in doubt check the docs!
// 🚨🚨 https://mswjs.io/docs/ 🚨🚨

import { screen, render } from '@testing-library/react'
// 🚨
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from './App'

const user = {
  id: 1,
  created_at: '2021-12-13T00:17:29+00:00',
  // 🚨 Add a name here
  name: 'Spencer',
  avatar: 'https://thumbs.gfycat.com/NiceRequiredGrunion-size_restricted.gif',
  header: 'https://static.wikia.nocookie.net/naruto/images/5/50/Team_Kakashi.png',
  likes: ['React', 'Anime', 'Traveling', 'Living', 'Tower Defense Games', 'Card Games'],
  motto: 'Res Non Verba',
  color: 'crimson',
}

/**
 * Goes inside the callback function body
 *     const select = req.url.searchParams.get('select')
    if (select === '*') {
      return res()
    }
 */

// 🚨 Create your server
const server = setupServer(
  rest.get('https://uzgiamkrbapxufnwdrja.supabase.co/rest/v1/users?select=*', (req, res, ctx) => {
    const select = req.url.searchParams.get('select')
    if (select === '*') {
      return res(ctx.json([user]))
    }

    return res(ctx.json())
  })
)

// 🚨 Listen for server start
beforeAll(() => server.listen())

// 🚨 Close server when complete
afterAll(() => server.close())

test('Should render the header', async () => {
  render(<App />)
  const banner = screen.getByRole('banner')
  const headerImg = screen.getByAltText(/alchemy/i)
  const profileName = await screen.findByText(user.name)

  expect(banner).toHaveStyle({
    background: 'var(--grey)',
  })
  expect(headerImg).toBeInTheDocument()
  expect(profileName).toBeInTheDocument()
})

test('Should render the header with Sasuke 🌬️🔥', async () => {
  const sasuke = {
    id: 1,
    created_at: '2021-12-13T00:17:29+00:00',
    name: 'Sasuke 🌬️🔥',
    avatar: 'https://thumbs.gfycat.com/NiceRequiredGrunion-size_restricted.gif',
    header: 'https://static.wikia.nocookie.net/naruto/images/5/50/Team_Kakashi.png',
    likes: ['React', 'Anime', 'Traveling', 'Living', 'Tower Defense Games', 'Card Games'],
    motto: 'Res Non Verba',
    color: 'crimson',
  }

  server.use(
    rest.get('https://uzgiamkrbapxufnwdrja.supabase.co/rest/v1/users?select=*', (req, res, ctx) => {
      const select = req.url.searchParams.get('select')
      if (select === '*') {
        return res(ctx.json([sasuke]))
      }

      return res(ctx.json())
    })
  )

  // 🚨 Use the server to change the response for this test

  render(<App />)
  server.use(rest.post('login'))

  const profileName = await screen.findByText(sasuke.name)

  expect(profileName).toBeInTheDocument()
})
