  let quotes = [
    { text: "It takes courage to grow up and become who you really are.", category: "Inspiration" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", category: "Success" },
    { text: "Everything you've ever wanted is sitting on the other side of fear.", category: "Motivation" }
  ];

  // Function to load quotes from Local Storage
  function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    }
  }

  // Function to save quotes to Local Storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex].text;
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = selectedQuote;
    saveLastViewedQuote(selectedQuote); // Save the last viewed quote to Session Storage
  }

  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();  // Save quotes after adding a new one

      // Clear the input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';

      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  // Function to save the last viewed quote to Session Storage
  function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', quote);
  }

  // Function to display the last viewed quote on page load
  function displayLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = lastQuote;
    }
  }

  // Function to export quotes to a JSON file
  function exportToJsonFile() {
    const jsonStr = JSON.stringify(quotes);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);  // Clean up after download
  }

  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } catch (e) {
        alert('Failed to import quotes. Please ensure the file is in the correct format.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Event listener for showing a new quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  // Load quotes and display the last viewed quote on page load
  loadQuotes();
  displayLastViewedQuote();
  
  