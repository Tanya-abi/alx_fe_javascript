
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "It takes courage to grow up and become who you really are.", category: "Inspiration" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", category: "Success" },
    { text: "Everything you've ever wanted is sitting on the other side of fear.", category: "Motivation" }
  ];
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    quoteDisplay.innerHTML = `
      <p>"${selectedQuote.text}"</p>
      <p><em>Category: ${selectedQuote.category}</em></p>
    `;
  }
  
  function getUniqueCategories() {
    const categories = quotes.map(quote => quote.category);
    return [...new Set(categories)];
  }
  
  function populateCategories() {
    const categorySelect = document.getElementById('categoryFilter');
    categorySelect.innerHTML = '<option value="all">All Categories</option>'; // Reset categories
    const categories = getUniqueCategories();
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }
  
  function filterQuotesByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    const filteredQuotes = selectedCategory === 'all' 
      ? quotes 
      : quotes.filter(quote => quote.category === selectedCategory);
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex];
    
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
        saveQuotes();
        populateCategories();
        alert('Quote added!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    });
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotesByCategory);
  
  // Populate categories and load a random quote on page load
  populateCategories();
  loadLastViewedQuote();
  
  