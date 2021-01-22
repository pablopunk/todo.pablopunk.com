const fetch = require('node-fetch')

const head = `
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

<link media="all" rel="stylesheet" href="/styles.css" />

<title>todo.pablopunk.com - The to do list for open source developers</title>
<meta name="description" content="List of tasks to do when you are an open source developer relying on Github issues and pull requests." />
<meta name="tags" content="tasks,todo,to,do,open,source,github,list,productivity,freelance,remote,pull,request,issues,new,tab,window,minimal" />
`

const body = `
<a href="https://github.com/pablopunk/todo.pablopunk.com" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
<script type="text/javascript">
  (function() {
    function setDarkMode(v) {
      window.__darkMode = v
      localStorage.setItem('dark', v ? 'yes' : 'no');
      document.body.className = v ? 'dark' : 'light';
    }
    var q = window.matchMedia('(prefers-color-scheme: dark)');
    q.addListener(function(e) { setDarkMode(e.matches); });
    var darkLS
    try { darkLS = localStorage.getItem('dark'); }
    catch (err) { }
    setDarkMode(darkLS ? darkLS === 'yes' : q.matches);
    window.__toggleDarkMode = function() {
      setDarkMode(!window.__darkMode);
    }
  })();
</script>
<script data-goatcounter="https://digestim.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
`

const transparentBody = `
  <script type="text/javascript">
    document.body.className = 'transparent'
  </script>
`

module.exports = async (req, res) => {
  let [_0, user, repo] = req.url.split('/')
  // if url is /search, then org=search will beignored
  // cause params should also contain a ?org=value

  let params

  if (repo) {
    ;[repo, params] = repo.split('?')
  } else {
    ;[user, params] = user.split('?')
  }

  let githubRes

  if (repo) {
    // /user/repo
    githubRes = await fetch(
      `https://github.com/search?q=repo%3A${user}%2F${repo}+is%3Aopen&${params}`
    )
  } else {
    // user or org
    githubRes = await fetch(
      `https://github.com/search?q=org%3A${user}+is%3Aopen&${params}`
    )
  }

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

  let html = githubHtml
    .replace(
      '</head>',
      `${head}
      </head>`
    )
    .replace(
      '</body>',
      `${body}
    </body>`
    )

  if (params && params.includes('transparent')) {
    html += transparentBody
  }

  res.end(html)
}
