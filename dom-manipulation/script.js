// Initialize the quotes array
let quotes = [
    { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { id: 2, text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
  ];
  
  // API URL for server simulation
  const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API URL
  
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
    const filteredQuotes = filterQuotesByCategory();
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const selectedQuote = filteredQuotes[randomIndex].text;
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = selectedQuote;
      saveLastViewedQuote(selectedQuote); // Save the last viewed quote to Session Storage
    } else {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = 'No quotes available for this category.';
    }
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    const newQuoteId = quotes.length ? Math.max(...quotes.map(q => q.id)) + 1 : 1;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { id: newQuoteId, text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();  // Save quotes after adding a new one
      populateCategories();  // Update category dropdown
      postQuoteToServer(newQuote); // Post new quote to server
  
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
        populateCategories();  // Update category dropdown
        notifyUser('Quotes imported successfully!');
      } catch (e) {
        alert('Failed to import quotes. Please ensure the file is in the correct format.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Function to populate categories in the dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Default option
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Function to filter quotes based on the selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = filterQuotesByCategory(selectedCategory);
    displayQuote(filteredQuotes);
    saveSelectedCategory(selectedCategory);
  }
  
  // Function to filter quotes by category
  function filterQuotesByCategory(category) {
    if (category === 'all') {
      return quotes;
    }
    return quotes.filter(q => q.category === category);
  }
  
  // Function to display a quote from the filtered list
  function displayQuote(filteredQuotes) {
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const selectedQuote = filteredQuotes[randomIndex].text;
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = selectedQuote;
      saveLastViewedQuote(selectedQuote); // Save the last viewed quote to Session Storage
    } else {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = 'No quotes available for this category.';
    }
  }
  
  // Function to save the last selected category to Local Storage
  function saveSelectedCategory(category) {
    localStorage.setItem('selectedCategory', category);
  }
  
  // Function to restore the last selected category filter from Local Storage
  function restoreSelectedCategory() {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      const categoryFilter = document.getElementById('categoryFilter');
      categoryFilter.value = savedCategory;
      filterQuotes();  // Apply the saved filter
    }
  }
  
  // Function to sync local data with the server
  function fetchQuotesFromServer() {
    fetch(API_URL)
      .then(response => response.json())
      .then(serverQuotes => {
        handleDataSync(serverQuotes);
      })
      .catch(error => console.error('Error fetching quotes:', error));
  }
  
  // Handle server data sync
  function handleDataSync(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    
    // Resolve conflicts: Server data takes precedence
    const mergedQuotes = serverQuotes.map(serverQuote => {
      const existingQuote = localQuotes.find(q => q.id === serverQuote.id);
      return existingQuote ? serverQuote : existingQuote;
    }).filter(Boolean); // Remove any undefined entries
  
    // Save merged quotes to local storage
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    populateCategories(); // Update category dropdown
    notifyUser('Your quotes have been updated.');
  }
  
  // Post new quote to server
  function postQuoteToServer(newQuote) {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuote),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Quote posted successfully:', data);
      })
      .catch(error => console.error('Error posting quote:', error));
  }
  
  // Notify users of updates
  function notifyUser(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }
  
  // Handle manual conflict resolution
  function resolveConflict(choice) {
    if (choice === 'keepServer') {
      fetchQuotesFromServer();
    }
    document.getElementById('conflictResolution').style.display = 'none';
  }
  
  // Initialize the app
  function initializeApp() {
    loadQuotes();
    populateCategories();
    restoreSelectedCategory(); // Restore selected category filter
    displayLastViewedQuote(); // Display last viewed quote
    fetchQuotesFromServer(); // Initial fetch of server quotes
  }
  
  // Fetch data periodically
  setInterval(fetchQuotesFromServer, 5 * 60 * 1000); // Every 5 minutes
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  
  // Initialize the app on load
  initializeApp();

  
  
  