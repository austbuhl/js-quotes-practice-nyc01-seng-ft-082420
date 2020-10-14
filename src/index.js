
let sort = false

const getQuotes = sort => {
  const url = sort ? 'http://localhost:3000/quotes?_sort=author' : 'http://localhost:3000/quotes?_embed=likes' 
  document.querySelector('#quote-list').innerHTML = ''
  fetch(url)
    .then(response => response.json())
    .then(quotes => {
      for(const quote of quotes) {
        renderQuote(quote)
      }
    })
}

const renderQuote = quoteObj => {
  const quoteList = document.querySelector('#quote-list')
  const quoteLi = document.createElement('li')
  quoteLi.classList.add('quote-card')
  quoteLi.dataset.quoteId = quoteObj.id
  let quoteLikes = quoteObj.likes === undefined ? 0 : quoteObj.likes.length
  
  quoteLi.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quoteObj.quote}</p>
      <footer class="blockquote-footer">${quoteObj.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quoteLikes}</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-info'>Edit</button>
    </blockquote>
  `

  quoteList.append(quoteLi)
}

const submitHandler = () => {
  const newQuoteForm = document.querySelector('#new-quote-form')
  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()
    const newQuote = newQuoteForm.quote.value
    const newAuthor = newQuoteForm.author.value
    
    newQuoteForm.reset()
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({quote: newQuote, author: newAuthor})
    }

    fetch('http://localhost:3000/quotes', options)
      .then(response => response.json())
      .then(renderQuote)
  })
}

const clickHandler = () => {
  document.addEventListener('click', e => {
    if ( e.target.matches('.btn-danger') ) {
      const delBtn = e.target
      const quoteId = delBtn.parentElement.parentElement.dataset.quoteId
      
      fetch('http://localhost:3000/quotes/' + quoteId, {method: "DELETE"})
        .then(response => response.json())
        .then(console.log)

      const quoteLi = document.querySelector(`[data-quote-id="${quoteId}"]`)
      quoteLi.remove()
    } else if ( e.target.matches('.btn-success') ) {
      const likeBtn = e.target
      const quoteId = parseInt(likeBtn.parentElement.parentElement.dataset.quoteId)
      
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({quoteId: quoteId, createdAt: Math.floor(Date.now() / 1000)})
      }

      fetch('http://localhost:3000/likes', options)
        .then(response => response.json())
        .then(like => {
          const quoteLi = document.querySelector(`[data-quote-id="${like.quoteId}"]`)
          const scoreSpan = quoteLi.querySelector('.btn-success').querySelector('span')
          const newScore = parseInt(scoreSpan.textContent) + 1

          scoreSpan.textContent = newScore
        })
    } 
      else if ( e.target.matches('.btn-info') ) {
        const quoteLi = e.target.closest('li')
      
    } 
      else if ( e.target.matches('#sort-off') ) {
        e.target.id = 'sort-on'
        e.target.textContent = 'Sort: ON'
        sort = true
        getQuotes(sort)
    } 
      else if ( e.target.matches('#sort-on') ) {
        e.target.id = 'sort-off'
        e.target.textContent = 'Sort: OFF'
        sort = false
        getQuotes(sort)
    }
  })
}


clickHandler()
submitHandler()
getQuotes(sort)
