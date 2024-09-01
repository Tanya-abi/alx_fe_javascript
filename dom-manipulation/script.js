const quotes = [
    { text: "It takes courage to grow up and become who you really are.", category: "Inspiration" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", category: "Success" },
    { text: "Everything you've ever wanted is sitting on the other side of fear.", category: "Motivation" }
  ];
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    quoteDisplay.innerHTML = `
      <p>"${selectedQuote.text}"</p>
      <p><em>Category: ${selectedQuote.category}</em></p>
    `;
  }
  
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <input type="text" id="quoteText" placeholder="Enter quote">
      <input type="text" id="quoteCategory" placeholder="Enter category">
      <button id="submitQuote">Add Quote</button>
    `;
  
    document.body.appendChild(formContainer);
  
    document.getElementById('submitQuote').addEventListener('click', function() {
      const quoteText = document.getElementById('quoteText').value;
      const quoteCategory = document.getElementById('quoteCategory').value;
      if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        alert('Quote added!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    });
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
  