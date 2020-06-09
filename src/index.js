const fetch = require('node-fetch')

module.exports = async (req, res) => {
  const [_0, pathname] = req.url.split('/')
  const [org, params] = pathname.split('?')

  // if url is /search, then org=search will beignored
  // cause params should also contain a ?org=value

  const githubRes = await fetch(
    `https://github.com/search?q=org%3A${org}+is%3Aopen&${params}`
  )
  const html = (await githubRes.text()).replace(
    '</head>',
    `<link media="all" rel="stylesheet" href="/styles.css" />
        ${
          req.query.dark !== undefined
            ? '<link media="all" rel="stylesheet" href="/dark.css" />'
            : ''
        }
    </head>`
  )

  res.end(html)
}
