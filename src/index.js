const fetch = require('node-fetch')

module.exports = async (req, res) => {
  let [_0, org] = req.url.split('/')
  org = org.split('?')[0]

  const githubRes = await fetch(
    `https://github.com/search?q=org%3A${org}+is%3Aopen`
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
