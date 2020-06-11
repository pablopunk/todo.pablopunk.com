const fetch = require('node-fetch')

const meta = `
<link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
<link rel="manifest" href="/favicon/manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">

<title>digest.im - The to do list for open source developers</title>
<meta name="description" content="List of tasks to do when you are an open source developer relying on Github issues and pull requests." />
<meta name="tags" content="tasks,todo,to,do,open,source,github,list,productivity,freelance,remote,pull,request,issues,new,tab,window,minimal" />

<script data-goatcounter="https://digestim.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
`

module.exports = async (req, res) => {
  const [_0, pathname] = req.url.split('/')
  const [org, params] = pathname.split('?')

  // if url is /search, then org=search will beignored
  // cause params should also contain a ?org=value

  const githubRes = await fetch(
    `https://github.com/search?q=org%3A${org}+is%3Aopen&${params}`
  )
  let githubHtml = await githubRes.text()

  githubHtml = githubHtml
    .split('\n')
    .filter((l) => !l.includes('favicon'))
    .filter((l) => !l.includes('<title>'))
    .map((line) => {
      // replace all links except pagination links
      if (
        line.includes('<a') &&
        !line.includes('aria-label="Page') &&
        !line.includes('rel="next"')
      ) {
        return line.replace('href="', 'href="https://github.com')
      }

      return line
    })
    .join('\n')

  const html = githubHtml.replace(
    '</head>',
    `${meta}<link media="all" rel="stylesheet" href="/styles.css" />
        ${
          req.query.dark !== undefined
            ? '<link media="all" rel="stylesheet" href="/dark.css" />'
            : ''
        }
    </head>`
  )

  res.end(html)
}
